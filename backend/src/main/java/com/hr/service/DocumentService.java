package com.hr.service;

import com.hr.entity.Document;
import com.hr.entity.Tag;
import com.hr.repository.DocumentRepository;
import com.hr.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * 文档管理服务
 */
@Service
@Transactional
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private WebDAVStorageService webDAVStorageService;

    @Autowired
    private PaperlessNgxService paperlessNgxService;

    @Autowired
    private OpenAIService openAIService;

    /**
     * 上传文档（智能分类和标签）
     */
    public Document uploadDocument(MultipartFile file, String title, String description, Long userId) {
        try {
            // 1. 临时分类，后续会被AI分类覆盖
            String tempCategory = "temp";
            
            // 2. 上传到WebDAV存储
            String filePath = webDAVStorageService.uploadFile(file, tempCategory);
            
            // 3. 读取文件内容用于AI分析（简化处理）
            String content = extractTextContent(file);
            
            // 4. AI智能分类
            String aiCategory = openAIService.classifyDocument(file.getOriginalFilename(), content);
            
            // 5. AI生成标签
            List<String> aiTags = openAIService.generateTags(file.getOriginalFilename(), content);
            
            // 6. AI生成摘要
            String summary = openAIService.generateSummary(content);
            
            // 7. 创建文档记录
            Document document = new Document();
            document.setTitle(title != null ? title : file.getOriginalFilename());
            document.setDescription(description);
            document.setFileName(file.getOriginalFilename());
            document.setFilePath(filePath);
            document.setFileSize(file.getSize());
            document.setContentType(file.getContentType());
            document.setCategory(aiCategory);
            document.setSummary(summary);
            document.setUploadTime(LocalDateTime.now());
            document.setUploadedBy(userId);
            document.setAiProcessed(true);
            
            // 8. 保存文档
            document = documentRepository.save(document);
            
            // 9. 处理标签
            List<Tag> tags = processTagsFromAI(aiTags);
            document.setTags(tags);
            document = documentRepository.save(document);
            
            // 10. 上传到Paperless-NGX（可选）
            if (paperlessNgxService.isAvailable()) {
                try {
                    List<String> tagNames = tags.stream().map(Tag::getName).toList();
                    Long paperlessId = paperlessNgxService.uploadDocument(file, document.getTitle(), tagNames, "HR System");
                    if (paperlessId != null) {
                        document.setPaperlessId(paperlessId);
                        documentRepository.save(document);
                    }
                } catch (Exception e) {
                    System.err.println("Failed to upload to Paperless-NGX: " + e.getMessage());
                }
            }
            
            return document;
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload document", e);
        }
    }

    /**
     * 获取文档列表
     */
    public List<Document> getDocuments(String category, List<String> tags, String keyword) {
        if (category != null || (tags != null && !tags.isEmpty()) || keyword != null) {
            return documentRepository.findByFilters(category, keyword, tags);
        }
        return documentRepository.findAllByOrderByUploadTimeDesc();
    }

    /**
     * 获取文档详情
     */
    public Optional<Document> getDocument(Long id) {
        return documentRepository.findById(id);
    }

    /**
     * 下载文档
     */
    public InputStream downloadDocument(Long id) throws IOException {
        Optional<Document> documentOpt = documentRepository.findById(id);
        if (documentOpt.isEmpty()) {
            throw new RuntimeException("Document not found");
        }
        
        Document document = documentOpt.get();
        
        // 增加下载次数
        document.setDownloadCount(document.getDownloadCount() + 1);
        documentRepository.save(document);
        
        return webDAVStorageService.downloadFile(document.getFilePath());
    }

    /**
     * 删除文档
     */
    public void deleteDocument(Long id) {
        Optional<Document> documentOpt = documentRepository.findById(id);
        if (documentOpt.isEmpty()) {
            throw new RuntimeException("Document not found");
        }
        
        Document document = documentOpt.get();
        
        try {
            // 从WebDAV删除文件
            webDAVStorageService.deleteFile(document.getFilePath());
            
            // 从Paperless-NGX删除（如果存在）
            if (document.getPaperlessId() != null && paperlessNgxService.isAvailable()) {
                paperlessNgxService.deleteDocument(document.getPaperlessId());
            }
            
            // 从数据库删除记录
            documentRepository.delete(document);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete document", e);
        }
    }

    /**
     * 智能问答
     */
    public String askQuestion(Long documentId, String question) {
        Optional<Document> documentOpt = documentRepository.findById(documentId);
        if (documentOpt.isEmpty()) {
            throw new RuntimeException("Document not found");
        }
        
        Document document = documentOpt.get();
        
        try {
            // 获取文档内容
            InputStream inputStream = webDAVStorageService.downloadFile(document.getFilePath());
            String content = extractTextContent(inputStream, document.getContentType());
            
            // 使用OpenAI回答问题
            return openAIService.answerQuestion(question, content);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to answer question", e);
        }
    }

    /**
     * 重新分析文档（重新分类和标签）
     */
    public Document reanalyzeDocument(Long id) {
        Optional<Document> documentOpt = documentRepository.findById(id);
        if (documentOpt.isEmpty()) {
            throw new RuntimeException("Document not found");
        }
        
        Document document = documentOpt.get();
        
        try {
            // 获取文档内容
            InputStream inputStream = webDAVStorageService.downloadFile(document.getFilePath());
            String content = extractTextContent(inputStream, document.getContentType());
            
            // 重新分类
            String newCategory = openAIService.classifyDocument(document.getFileName(), content);
            document.setCategory(newCategory);
            
            // 重新生成标签
            List<String> newTagNames = openAIService.generateTags(document.getFileName(), content);
            List<Tag> newTags = processTagsFromAI(newTagNames);
            document.setTags(newTags);
            
            // 重新生成摘要
            String newSummary = openAIService.generateSummary(content);
            document.setSummary(newSummary);
            
            document.setAiProcessed(true);
            document.setUpdatedTime(LocalDateTime.now());
            
            return documentRepository.save(document);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to reanalyze document", e);
        }
    }

    /**
     * 获取所有分类
     */
    public List<String> getAllCategories() {
        return documentRepository.findDistinctCategories();
    }

    /**
     * 获取所有标签
     */
    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }

    /**
     * 处理AI生成的标签
     */
    private List<Tag> processTagsFromAI(List<String> tagNames) {
        List<Tag> tags = new ArrayList<>();
        
        for (String tagName : tagNames) {
            if (tagName == null || tagName.trim().isEmpty()) {
                continue;
            }
            
            Optional<Tag> existingTag = tagRepository.findByName(tagName.trim());
            
            if (existingTag.isPresent()) {
                tags.add(existingTag.get());
            } else {
                // 创建新标签
                Tag newTag = new Tag();
                newTag.setName(tagName.trim());
                newTag.setColor(generateRandomColor());
                newTag.setAiGenerated(true);
                tags.add(tagRepository.save(newTag));
            }
        }
        
        return tags;
    }

    /**
     * 生成随机颜色
     */
    private String generateRandomColor() {
        String[] colors = {
                "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
                "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9"
        };
        return colors[(int) (Math.random() * colors.length)];
    }

    /**
     * 提取文本内容（简化实现）
     */
    private String extractTextContent(MultipartFile file) {
        try {
            return extractTextContent(file.getInputStream(), file.getContentType());
        } catch (IOException e) {
            return "";
        }
    }

    /**
     * 从输入流提取文本内容
     */
    private String extractTextContent(InputStream inputStream, String contentType) {
        try {
            byte[] bytes = inputStream.readAllBytes();
            
            if (contentType != null && contentType.startsWith("text/")) {
                return new String(bytes);
            }
            
            // 对于其他类型的文件，返回空字符串
            // 实际项目中可以使用Apache Tika等库进行文本提取
            return "";
            
        } catch (IOException e) {
            return "";
        }
    }

    /**
     * 获取文档统计信息
     */
    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        // 总文档数
        long totalDocs = documentRepository.countTotalDocuments();
        stats.put("totalDocuments", totalDocs);
        
        // 本月上传数
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        long thisMonthDocs = documentRepository.countDocumentsThisMonth(startOfMonth);
        stats.put("thisMonthDocuments", thisMonthDocs);
        
        // 分类统计
        List<Object[]> categoryStats = documentRepository.countByCategory();
        Map<String, Long> categoryMap = new HashMap<>();
        for (Object[] stat : categoryStats) {
            categoryMap.put((String) stat[0], (Long) stat[1]);
        }
        stats.put("categoryStats", categoryMap);
        
        // 文件类型统计
        List<Object[]> contentTypeStats = documentRepository.countByContentType();
        Map<String, Long> contentTypeMap = new HashMap<>();
        for (Object[] stat : contentTypeStats) {
            contentTypeMap.put((String) stat[0], (Long) stat[1]);
        }
        stats.put("contentTypeStats", contentTypeMap);
        
        return stats;
    }
}