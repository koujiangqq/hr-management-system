package com.hr.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * OpenAI智能分析服务
 */
@Service
public class OpenAIService {

    @Value("${openai.api.key:}")
    private String apiKey;

    @Value("${openai.api.base-url:https://api.openai.com}")
    private String baseUrl;

    @Value("${openai.model:gpt-3.5-turbo}")
    private String model;

    private final OkHttpClient httpClient;
    private final ObjectMapper objectMapper;

    public OpenAIService() {
        this.httpClient = new OkHttpClient.Builder()
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(60, TimeUnit.SECONDS)
                .writeTimeout(60, TimeUnit.SECONDS)
                .build();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * 智能文档分类
     */
    public String classifyDocument(String fileName, String content) {
        if (apiKey == null || apiKey.isEmpty()) {
            return getDefaultCategory(fileName);
        }

        try {
            String prompt = buildClassificationPrompt(fileName, content);
            String response = callOpenAI(prompt);
            return extractClassificationResult(response);
        } catch (Exception e) {
            System.err.println("OpenAI classification failed: " + e.getMessage());
            return getDefaultCategory(fileName);
        }
    }

    /**
     * 智能标签生成
     */
    public List<String> generateTags(String fileName, String content) {
        if (apiKey == null || apiKey.isEmpty()) {
            return getDefaultTags(fileName);
        }

        try {
            String prompt = buildTagGenerationPrompt(fileName, content);
            String response = callOpenAI(prompt);
            return extractTagsResult(response);
        } catch (Exception e) {
            System.err.println("OpenAI tag generation failed: " + e.getMessage());
            return getDefaultTags(fileName);
        }
    }

    /**
     * 文档内容摘要
     */
    public String generateSummary(String content) {
        if (apiKey == null || apiKey.isEmpty()) {
            return "文档摘要功能需要配置OpenAI API密钥";
        }

        try {
            String prompt = buildSummaryPrompt(content);
            String response = callOpenAI(prompt);
            return extractSummaryResult(response);
        } catch (Exception e) {
            System.err.println("OpenAI summary generation failed: " + e.getMessage());
            return "摘要生成失败";
        }
    }

    /**
     * 智能文档问答
     */
    public String answerQuestion(String question, String documentContent) {
        if (apiKey == null || apiKey.isEmpty()) {
            return "智能问答功能需要配置OpenAI API密钥";
        }

        try {
            String prompt = buildQuestionAnswerPrompt(question, documentContent);
            return callOpenAI(prompt);
        } catch (Exception e) {
            System.err.println("OpenAI Q&A failed: " + e.getMessage());
            return "抱歉，无法回答您的问题。";
        }
    }

    private String callOpenAI(String prompt) throws IOException {
        String url = baseUrl + "/v1/chat/completions";
        
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("max_tokens", 1000);
        requestBody.put("temperature", 0.7);
        
        List<Map<String, String>> messages = new ArrayList<>();
        Map<String, String> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", prompt);
        messages.add(message);
        requestBody.put("messages", messages);
        
        String jsonBody = objectMapper.writeValueAsString(requestBody);
        
        RequestBody body = RequestBody.create(
                jsonBody, 
                MediaType.parse("application/json")
        );
        
        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .addHeader("Authorization", "Bearer " + apiKey)
                .addHeader("Content-Type", "application/json")
                .build();
        
        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("OpenAI API调用失败: " + response.code() + " " + response.message());
            }
            
            String responseBody = response.body().string();
            JsonNode jsonNode = objectMapper.readTree(responseBody);
            
            return jsonNode.get("choices")
                    .get(0)
                    .get("message")
                    .get("content")
                    .asText();
        }
    }

    private String buildClassificationPrompt(String fileName, String content) {
        return String.format("""
                请根据文件名和内容对以下文档进行分类。
                
                文件名: %s
                内容摘要: %s
                
                请从以下类别中选择最合适的一个：
                - personnel_files (人事档案)
                - contracts (合同文件)
                - financial_reports (财务报表)
                - meeting_minutes (会议纪要)
                - policies (政策制度)
                - training_materials (培训资料)
                - certificates (证书证照)
                - invoices (发票单据)
                - others (其他文档)
                
                请只返回类别的英文标识符，不要包含其他内容。
                """, fileName, truncateContent(content, 500));
    }

    private String buildTagGenerationPrompt(String fileName, String content) {
        return String.format("""
                请根据文件名和内容为以下文档生成3-5个相关标签。
                
                文件名: %s
                内容摘要: %s
                
                标签要求：
                1. 简洁明了，每个标签不超过8个字符
                2. 能够准确描述文档的主要内容或用途
                3. 便于后续搜索和分类
                4. 使用中文
                
                请以JSON数组格式返回标签，例如：["人事", "合同", "重要"]
                """, fileName, truncateContent(content, 500));
    }

    private String buildSummaryPrompt(String content) {
        return String.format("""
                请为以下文档内容生成一个简洁的中文摘要（不超过150字）：
                
                %s
                
                摘要应该包含文档的主要内容和关键信息。
                """, truncateContent(content, 2000));
    }

    private String buildQuestionAnswerPrompt(String question, String documentContent) {
        return String.format("""
                基于以下文档内容用中文回答问题：
                
                文档内容：
                %s
                
                问题：%s
                
                请基于文档内容给出准确的回答。如果文档中没有相关信息，请说明无法从文档中找到答案。
                """, truncateContent(documentContent, 2000), question);
    }

    private String extractClassificationResult(String response) {
        String result = response.trim().toLowerCase();
        
        String[] validCategories = {
                "personnel_files", "contracts", "financial_reports", 
                "meeting_minutes", "policies", "training_materials", 
                "certificates", "invoices", "others"
        };
        
        for (String category : validCategories) {
            if (result.contains(category)) {
                return category;
            }
        }
        
        return "others";
    }

    private List<String> extractTagsResult(String response) {
        try {
            JsonNode jsonNode = objectMapper.readTree(response);
            List<String> tags = new ArrayList<>();
            
            if (jsonNode.isArray()) {
                for (JsonNode tag : jsonNode) {
                    tags.add(tag.asText());
                }
            }
            
            return tags.isEmpty() ? getDefaultTags("") : tags;
        } catch (Exception e) {
            // 如果JSON解析失败，尝试从文本中提取标签
            List<String> tags = new ArrayList<>();
            String[] lines = response.split("\n");
            
            for (String line : lines) {
                line = line.trim();
                if (line.startsWith("-") || line.startsWith("•")) {
                    String tag = line.substring(1).trim();
                    if (!tag.isEmpty()) {
                        tags.add(tag);
                    }
                }
            }
            
            return tags.isEmpty() ? getDefaultTags("") : tags;
        }
    }

    private String extractSummaryResult(String response) {
        return response.trim();
    }

    private String truncateContent(String content, int maxLength) {
        if (content == null) {
            return "";
        }
        
        if (content.length() <= maxLength) {
            return content;
        }
        
        return content.substring(0, maxLength) + "...";
    }

    private String getDefaultCategory(String fileName) {
        if (fileName == null) return "others";
        
        String lowerName = fileName.toLowerCase();
        
        if (lowerName.contains("合同") || lowerName.contains("contract")) {
            return "contracts";
        } else if (lowerName.contains("发票") || lowerName.contains("invoice")) {
            return "invoices";
        } else if (lowerName.contains("证书") || lowerName.contains("证照") || lowerName.contains("cert")) {
            return "certificates";
        } else if (lowerName.contains("会议") || lowerName.contains("meeting")) {
            return "meeting_minutes";
        } else if (lowerName.contains("人事") || lowerName.contains("personnel")) {
            return "personnel_files";
        } else if (lowerName.contains("财务") || lowerName.contains("financial")) {
            return "financial_reports";
        } else if (lowerName.contains("培训") || lowerName.contains("training")) {
            return "training_materials";
        } else if (lowerName.contains("制度") || lowerName.contains("政策") || lowerName.contains("policy")) {
            return "policies";
        }
        
        return "others";
    }

    private List<String> getDefaultTags(String fileName) {
        List<String> tags = new ArrayList<>();
        
        if (fileName != null) {
            String lowerName = fileName.toLowerCase();
            
            if (lowerName.contains("重要") || lowerName.contains("important")) {
                tags.add("重要");
            }
            if (lowerName.contains("紧急") || lowerName.contains("urgent")) {
                tags.add("紧急");
            }
            if (lowerName.contains("合同")) {
                tags.add("合同");
            }
            if (lowerName.contains("发票")) {
                tags.add("发票");
            }
            if (lowerName.contains("证书") || lowerName.contains("证照")) {
                tags.add("证照");
            }
        }
        
        if (tags.isEmpty()) {
            tags.add("文档");
        }
        
        return tags;
    }
}