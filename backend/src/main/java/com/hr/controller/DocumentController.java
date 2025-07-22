package com.hr.controller;

import com.hr.entity.Document;
import com.hr.entity.Tag;
import com.hr.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * 文档管理控制器
 */
@RestController
@RequestMapping("/documents")
@CrossOrigin(origins = "*")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    /**
     * 上传文档
     */
    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "userId") Long userId) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (file.isEmpty()) {
                response.put("success", false);
                response.put("message", "文件不能为空");
                return ResponseEntity.badRequest().body(response);
            }
            
            Document document = documentService.uploadDocument(file, title, description, userId);
            
            response.put("success", true);
            response.put("message", "文档上传成功");
            response.put("document", document);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "文档上传失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 获取文档列表
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getDocuments(
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "tags", required = false) List<String> tags,
            @RequestParam(value = "keyword", required = false) String keyword) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Document> documents = documentService.getDocuments(category, tags, keyword);
            
            response.put("success", true);
            response.put("documents", documents);
            response.put("total", documents.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "获取文档列表失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 获取文档详情
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getDocument(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<Document> documentOpt = documentService.getDocument(id);
            
            if (documentOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "文档不存在");
                return ResponseEntity.notFound().build();
            }
            
            response.put("success", true);
            response.put("document", documentOpt.get());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "获取文档详情失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 下载文档
     */
    @GetMapping("/{id}/download")
    public ResponseEntity<InputStreamResource> downloadDocument(@PathVariable Long id) {
        try {
            Optional<Document> documentOpt = documentService.getDocument(id);
            
            if (documentOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Document document = documentOpt.get();
            InputStream inputStream = documentService.downloadDocument(id);
            
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, 
                       "attachment; filename=\"" + document.getFileName() + "\"");
            headers.add(HttpHeaders.CONTENT_TYPE, document.getContentType());
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.parseMediaType(document.getContentType()))
                    .body(new InputStreamResource(inputStream));
                    
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 删除文档
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteDocument(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            documentService.deleteDocument(id);
            
            response.put("success", true);
            response.put("message", "文档删除成功");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "文档删除失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 智能问答
     */
    @PostMapping("/{id}/ask")
    public ResponseEntity<Map<String, Object>> askQuestion(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            String question = request.get("question");
            if (question == null || question.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "问题不能为空");
                return ResponseEntity.badRequest().body(response);
            }
            
            String answer = documentService.askQuestion(id, question);
            
            response.put("success", true);
            response.put("answer", answer);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "智能问答失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 重新分析文档
     */
    @PostMapping("/{id}/reanalyze")
    public ResponseEntity<Map<String, Object>> reanalyzeDocument(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Document document = documentService.reanalyzeDocument(id);
            
            response.put("success", true);
            response.put("message", "文档重新分析完成");
            response.put("document", document);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "文档重新分析失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 获取所有分类
     */
    @GetMapping("/categories")
    public ResponseEntity<Map<String, Object>> getCategories() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<String> categories = documentService.getAllCategories();
            
            response.put("success", true);
            response.put("categories", categories);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "获取分类失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 获取所有标签
     */
    @GetMapping("/tags")
    public ResponseEntity<Map<String, Object>> getTags() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Tag> tags = documentService.getAllTags();
            
            response.put("success", true);
            response.put("tags", tags);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "获取标签失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 获取文档统计信息
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 这里可以添加统计逻辑
            response.put("success", true);
            response.put("message", "统计信息获取成功");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "获取统计信息失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}