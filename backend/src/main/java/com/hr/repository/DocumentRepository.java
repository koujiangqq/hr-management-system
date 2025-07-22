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
    Page<Document> findByCategory(Document.DocumentCategory category, Pageable pageable);
    
    /**
     * 根据上传者查找文档
     */
    Page<Document> findByUploaderId(Long uploaderId, Pageable pageable);
    
    /**
     * 根据文件类型查找文档
     */
    Page<Document> findByFileType(String fileType, Pageable pageable);
    
    /**
     * 模糊查询文档标题
     */
    Page<Document> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    
    /**
     * 查找即将到期的文档
     */
    @Query("SELECT d FROM Document d WHERE d.expirationDate BETWEEN :startDate AND :endDate")
    List<Document> findExpiringDocuments(@Param("startDate") LocalDate startDate, 
                                       @Param("endDate") LocalDate endDate);
    
    /**
     * 查找已过期的文档
     */
    @Query("SELECT d FROM Document d WHERE d.expirationDate < :currentDate")
    List<Document> findExpiredDocuments(@Param("currentDate") LocalDate currentDate);
    
    /**
     * 统计文档总数
     */
    @Query("SELECT COUNT(d) FROM Document d")
    long countTotalDocuments();
    
    /**
     * 统计本月上传的文档数量
     */
    @Query("SELECT COUNT(d) FROM Document d WHERE d.createdTime >= :startOfMonth")
    long countDocumentsThisMonth(@Param("startOfMonth") LocalDateTime startOfMonth);
    
    /**
     * 统计即将到期的文档数量
     */
    @Query("SELECT COUNT(d) FROM Document d WHERE d.expirationDate BETWEEN :today AND :futureDate")
    long countExpiringDocuments(@Param("today") LocalDate today, 
                               @Param("futureDate") LocalDate futureDate);
    
    /**
     * 根据标签查找文档
     */
    @Query("SELECT DISTINCT d FROM Document d JOIN d.tags t WHERE t.name IN :tagNames")
    Page<Document> findByTagNames(@Param("tagNames") List<String> tagNames, Pageable pageable);
    
    /**
     * 全文搜索文档
     */
    @Query("SELECT d FROM Document d WHERE " +
           "d.title LIKE %:keyword% OR " +
           "d.originalName LIKE %:keyword% OR " +
           "d.description LIKE %:keyword%")
    Page<Document> searchDocuments(@Param("keyword") String keyword, Pageable pageable);
    
    /**
     * 根据多个条件查询文档
     */
    @Query("SELECT d FROM Document d WHERE " +
           "(:category IS NULL OR d.category = :category) AND " +
           "(:fileType IS NULL OR d.fileType = :fileType) AND " +
           "(:uploaderId IS NULL OR d.uploader.id = :uploaderId) AND " +
           "(:keyword IS NULL OR d.title LIKE %:keyword% OR d.description LIKE %:keyword%)")
    Page<Document> findByMultipleConditions(@Param("category") Document.DocumentCategory category,
                                          @Param("fileType") String fileType,
                                          @Param("uploaderId") Long uploaderId,
                                          @Param("keyword") String keyword,
                                          Pageable pageable);
}