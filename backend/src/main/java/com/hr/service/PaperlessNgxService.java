package com.hr.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Paperless-NGX集成服务
 */
@Service
public class PaperlessNgxService {

    @Value("${paperless.api.url:}")
    private String paperlessUrl;

    @Value("${paperless.api.token:}")
    private String paperlessToken;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public PaperlessNgxService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * 检查Paperless-NGX是否可用
     */
    public boolean isAvailable() {
        return paperlessUrl != null && !paperlessUrl.trim().isEmpty() 
               && paperlessToken != null && !paperlessToken.trim().isEmpty();
    }

    /**
     * 上传文档到Paperless-NGX
     */
    public Long uploadDocument(MultipartFile file, String title, List<String> tags, String correspondent) {
        if (!isAvailable()) {
            return null;
        }
        
        try {
            String url = paperlessUrl + "/documents/post_document/";
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Token " + paperlessToken);
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            
            // 添加文件
            ByteArrayResource fileResource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };
            body.add("document", fileResource);
            
            // 添加标题
            if (title != null && !title.trim().isEmpty()) {
                body.add("title", title);
            }
            
            // 添加标签
            if (tags != null && !tags.isEmpty()) {
                for (String tag : tags) {
                    body.add("tags", tag);
                }
            }
            
            // 添加通讯员
            if (correspondent != null && !correspondent.trim().isEmpty()) {
                body.add("correspondent", correspondent);
            }
            
            HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, headers);
            
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                return jsonNode.has("id") ? jsonNode.get("id").asLong() : null;
            }
            
            return null;
        } catch (Exception e) {
            System.err.println("Failed to upload document to Paperless-NGX: " + e.getMessage());
            return null;
        }
    }

    /**
     * 获取文档信息
     */
    public Map<String, Object> getDocument(Long documentId) {
        if (!isAvailable() || documentId == null) {
            return null;
        }
        
        try {
            String url = paperlessUrl + "/documents/" + documentId + "/";
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Token " + paperlessToken);
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                return objectMapper.readValue(response.getBody(), Map.class);
            }
            
            return null;
        } catch (Exception e) {
            System.err.println("Failed to get document from Paperless-NGX: " + e.getMessage());
            return null;
        }
    }

    /**
     * 搜索文档
     */
    public List<Map<String, Object>> searchDocuments(String query, List<String> tags, String correspondent) {
        if (!isAvailable()) {
            return new ArrayList<>();
        }
        
        try {
            StringBuilder urlBuilder = new StringBuilder(paperlessUrl + "/documents/?");
            
            if (query != null && !query.trim().isEmpty()) {
                urlBuilder.append("query=").append(query).append("&");
            }
            
            if (tags != null && !tags.isEmpty()) {
                for (String tag : tags) {
                    urlBuilder.append("tags__name__icontains=").append(tag).append("&");
                }
            }
            
            if (correspondent != null && !correspondent.trim().isEmpty()) {
                urlBuilder.append("correspondent__name__icontains=").append(correspondent).append("&");
            }
            
            String url = urlBuilder.toString();
            if (url.endsWith("&")) {
                url = url.substring(0, url.length() - 1);
            }
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Token " + paperlessToken);
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                JsonNode results = jsonNode.get("results");
                
                List<Map<String, Object>> documents = new ArrayList<>();
                if (results != null && results.isArray()) {
                    for (JsonNode result : results) {
                        documents.add(objectMapper.convertValue(result, Map.class));
                    }
                }
                
                return documents;
            }
            
            return new ArrayList<>();
        } catch (Exception e) {
            System.err.println("Failed to search documents in Paperless-NGX: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * 获取所有标签
     */
    public List<Map<String, Object>> getAllTags() {
        if (!isAvailable()) {
            return new ArrayList<>();
        }
        
        try {
            String url = paperlessUrl + "/tags/";
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Token " + paperlessToken);
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                JsonNode results = jsonNode.get("results");
                
                List<Map<String, Object>> tags = new ArrayList<>();
                if (results != null && results.isArray()) {
                    for (JsonNode result : results) {
                        tags.add(objectMapper.convertValue(result, Map.class));
                    }
                }
                
                return tags;
            }
            
            return new ArrayList<>();
        } catch (Exception e) {
            System.err.println("Failed to get tags from Paperless-NGX: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * 创建标签
     */
    public Long createTag(String name, String color) {
        if (!isAvailable() || name == null || name.trim().isEmpty()) {
            return null;
        }
        
        try {
            String url = paperlessUrl + "/tags/";
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Token " + paperlessToken);
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("name", name.trim());
            if (color != null && !color.trim().isEmpty()) {
                requestBody.put("color", color);
            }
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                return jsonNode.has("id") ? jsonNode.get("id").asLong() : null;
            }
            
            return null;
        } catch (Exception e) {
            System.err.println("Failed to create tag in Paperless-NGX: " + e.getMessage());
            return null;
        }
    }

    /**
     * 删除文档
     */
    public boolean deleteDocument(Long documentId) {
        if (!isAvailable() || documentId == null) {
            return false;
        }
        
        try {
            String url = paperlessUrl + "/documents/" + documentId + "/";
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Token " + paperlessToken);
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.DELETE, entity, String.class);
            
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            System.err.println("Failed to delete document from Paperless-NGX: " + e.getMessage());
            return false;
        }
    }

    /**
     * 获取文档下载URL
     */
    public String getDocumentDownloadUrl(Long documentId) {
        if (!isAvailable() || documentId == null) {
            return null;
        }
        
        return paperlessUrl + "/documents/" + documentId + "/download/";
    }

    /**
     * 获取文档预览URL
     */
    public String getDocumentPreviewUrl(Long documentId) {
        if (!isAvailable() || documentId == null) {
            return null;
        }
        
        return paperlessUrl + "/documents/" + documentId + "/preview/";
    }

    /**
     * 测试连接
     */
    public boolean testConnection() {
        if (!isAvailable()) {
            return false;
        }
        
        try {
            String url = paperlessUrl + "/documents/?page_size=1";
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Token " + paperlessToken);
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            System.err.println("Failed to test Paperless-NGX connection: " + e.getMessage());
            return false;
        }
    }
}