package com.hr.repository;

import com.hr.entity.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 文档数据访问接口
 */
@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    
    /**
     * 根据分类查找文档
     */
    List<Document> findByCategoryOrderByUploadTimeDesc(String category);
    
    /**
     * 根据上传者查找文档
     */
    List<Document> findByUploadedByOrderByUploadTimeDesc(Long uploadedBy);
    
    /**
     * 根据文件名模糊查询
     */
    List<Document> findByFileNameContainingIgnoreCaseOrderByUploadTimeDesc(String fileName);
    
    /**
     * 模糊查询文档标题
     */
    List<Document> findByTitleContainingIgnoreCaseOrderByUploadTimeDesc(String title);
    
    /**
     * 查找即将到期的文档
     */
    @Query("SELECT d FROM Document d WHERE d.expirationDate BETWEEN :startDate AND :endDate ORDER BY d.expirationDate ASC")
    List<Document> findExpiringDocuments(@Param("startDate") LocalDate startDate, 
                                       @Param("endDate") LocalDate endDate);
    
    /**
     * 查找已过期的文档
     */
    @Query("SELECT d FROM Document d WHERE d.expirationDate < :currentDate ORDER BY d.expirationDate DESC")
    List<Document> findExpiredDocuments(@Param("currentDate") LocalDate currentDate);
    
    /**
     * 根据标签查找文档
     */
    @Query("SELECT DISTINCT d FROM Document d JOIN d.tags t WHERE t.name IN :tagNames ORDER BY d.uploadTime DESC")
    List<Document> findByTagNames(@Param("tagNames") List<String> tagNames);
    
    /**
     * 复合查询
     */
    @Query("SELECT DISTINCT d FROM Document d LEFT JOIN d.tags t WHERE " +
           "(:category IS NULL OR d.category = :category) AND " +
           "(:keyword IS NULL OR d.title LIKE %:keyword% OR d.description LIKE %:keyword% OR d.fileName LIKE %:keyword%) AND " +
           "(:tagNames IS NULL OR t.name IN :tagNames) " +
           "ORDER BY d.uploadTime DESC")
    List<Document> findByFilters(@Param("category") String category,
                                @Param("keyword") String keyword,
                                @Param("tagNames") List<String> tagNames);
    
    /**
     * 获取所有分类
     */
    @Query("SELECT DISTINCT d.category FROM Document d WHERE d.category IS NOT NULL ORDER BY d.category")
    List<String> findDistinctCategories();
    
    /**
     * 统计各分类文档数量
     */
    @Query("SELECT d.category, COUNT(d) FROM Document d GROUP BY d.category")
    List<Object[]> countByCategory();
    
    /**
     * 统计各文件类型数量
     */
    @Query("SELECT d.contentType, COUNT(d) FROM Document d GROUP BY d.contentType")
    List<Object[]> countByContentType();
    
    /**
     * 获取最近上传的文档
     */
    List<Document> findTop10ByOrderByUploadTimeDesc();
    
    /**
     * 获取下载次数最多的文档
     */
    List<Document> findTop10ByOrderByDownloadCountDesc();
    
    /**
     * 按时间范围查询文档
     */
    @Query("SELECT d FROM Document d WHERE d.uploadTime BETWEEN :startTime AND :endTime ORDER BY d.uploadTime DESC")
    List<Document> findByUploadTimeBetween(@Param("startTime") LocalDateTime startTime, 
                                          @Param("endTime") LocalDateTime endTime);
    
    /**
     * 查找所有按上传时间倒序
     */
    List<Document> findAllByOrderByUploadTimeDesc();
    
    /**
     * 根据Paperless ID查找文档
     */
    Document findByPaperlessId(Long paperlessId);
    
    /**
     * 查找AI已处理的文档
     */
    List<Document> findByAiProcessedTrueOrderByUploadTimeDesc();
    
    /**
     * 查找AI未处理的文档
     */
    List<Document> findByAiProcessedFalseOrderByUploadTimeDesc();
    
    /**
     * 统计文档总数
     */
    @Query("SELECT COUNT(d) FROM Document d")
    long countTotalDocuments();
    
    /**
     * 统计本月上传的文档数量
     */
    @Query("SELECT COUNT(d) FROM Document d WHERE d.uploadTime >= :startOfMonth")
    long countDocumentsThisMonth(@Param("startOfMonth") LocalDateTime startOfMonth);
    
    /**
     * 统计即将到期的文档数量
     */
    @Query("SELECT COUNT(d) FROM Document d WHERE d.expirationDate BETWEEN :today AND :futureDate")
    long countExpiringDocuments(@Param("today") LocalDate today, 
                               @Param("futureDate") LocalDate futureDate);
}