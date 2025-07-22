package com.hr.service;

import com.github.sardine.Sardine;
import com.github.sardine.SardineFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

/**
 * WebDAV存储服务
 */
@Service
public class WebDAVStorageService {

    @Value("${webdav.url}")
    private String webdavUrl;

    @Value("${webdav.username}")
    private String username;

    @Value("${webdav.password}")
    private String password;

    @Value("${webdav.base-path:/hr-documents}")
    private String basePath;

    private Sardine getSardineClient() {
        return SardineFactory.begin(username, password);
    }

    /**
     * 上传文件
     */
    public String uploadFile(MultipartFile file, String category) throws IOException {
        Sardine sardine = getSardineClient();
        
        // 生成文件路径
        String fileName = generateFileName(file.getOriginalFilename());
        String fullPath = basePath + "/" + category + "/" + fileName;
        String fullUrl = webdavUrl + fullPath;
        
        try {
            // 确保目录存在
            ensureDirectoryExists(sardine, basePath + "/" + category);
            
            // 上传文件
            sardine.put(fullUrl, file.getInputStream(), file.getContentType());
            
            return fullPath;
        } finally {
            sardine.shutdown();
        }
    }

    /**
     * 下载文件
     */
    public InputStream downloadFile(String filePath) throws IOException {
        Sardine sardine = getSardineClient();
        String fullUrl = webdavUrl + filePath;
        return sardine.get(fullUrl);
    }

    /**
     * 删除文件
     */
    public void deleteFile(String filePath) throws IOException {
        Sardine sardine = getSardineClient();
        String fullUrl = webdavUrl + filePath;
        
        try {
            if (sardine.exists(fullUrl)) {
                sardine.delete(fullUrl);
            }
        } finally {
            sardine.shutdown();
        }
    }

    /**
     * 检查文件是否存在
     */
    public boolean fileExists(String filePath) throws IOException {
        Sardine sardine = getSardineClient();
        String fullUrl = webdavUrl + filePath;
        
        try {
            return sardine.exists(fullUrl);
        } finally {
            sardine.shutdown();
        }
    }

    /**
     * 获取文件URL
     */
    public String getFileUrl(String filePath) {
        return webdavUrl + filePath;
    }

    /**
     * 确保目录存在
     */
    private void ensureDirectoryExists(Sardine sardine, String dirPath) throws IOException {
        String fullUrl = webdavUrl + dirPath;
        
        if (!sardine.exists(fullUrl)) {
            // 递归创建父目录
            String parentPath = dirPath.substring(0, dirPath.lastIndexOf('/'));
            if (!parentPath.isEmpty() && !parentPath.equals(basePath)) {
                ensureDirectoryExists(sardine, parentPath);
            }
            
            sardine.createDirectory(fullUrl);
        }
    }

    /**
     * 生成唯一文件名
     */
    private String generateFileName(String originalFilename) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        
        if (originalFilename != null && originalFilename.contains(".")) {
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String nameWithoutExt = originalFilename.substring(0, originalFilename.lastIndexOf("."));
            return timestamp + "_" + uuid + "_" + nameWithoutExt + extension;
        } else {
            return timestamp + "_" + uuid + "_" + (originalFilename != null ? originalFilename : "unknown");
        }
    }

    /**
     * URL编码文件路径
     */
    private String encodePath(String path) {
        try {
            return URLEncoder.encode(path, StandardCharsets.UTF_8.toString())
                    .replace("+", "%20")
                    .replace("%2F", "/");
        } catch (Exception e) {
            return path;
        }
    }
}