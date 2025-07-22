package com.hr.repository;

import com.hr.entity.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 标签数据访问接口
 */
@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    
    /**
     * 根据名称查找标签
     */
    Optional<Tag> findByName(String name);
    
    /**
     * 检查标签名称是否存在
     */
    boolean existsByName(String name);
    
    /**
     * 根据AI生成标识查找标签
     */
    Page<Tag> findByAiGenerated(Boolean aiGenerated, Pageable pageable);
    
    /**
     * 模糊查询标签名称
     */
    Page<Tag> findByNameContainingIgnoreCase(String name, Pageable pageable);
    
    /**
     * 查找热门标签（按使用次数排序）
     */
    @Query("SELECT t FROM Tag t ORDER BY t.useCount DESC")
    List<Tag> findPopularTags(Pageable pageable);
    
    /**
     * 根据名称列表查找标签
     */
    List<Tag> findByNameIn(List<String> names);
    
    /**
     * 统计标签总数
     */
    @Query("SELECT COUNT(t) FROM Tag t")
    long countTotalTags();
    
    /**
     * 统计AI生成的标签数量
     */
    @Query("SELECT COUNT(t) FROM Tag t WHERE t.aiGenerated = true")
    long countAiGeneratedTags();
}