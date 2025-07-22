package com.hr.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * 健康检查控制器
 */
@RestController
@RequestMapping("/actuator")
public class HealthController implements HealthIndicator {
    
    @Autowired
    private DataSource dataSource;
    
    /**
     * 健康检查端点
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> health = new HashMap<>();
        
        try {
            // 检查数据库连接
            boolean dbHealthy = checkDatabase();
            
            health.put("status", dbHealthy ? "UP" : "DOWN");
            health.put("timestamp", LocalDateTime.now());
            health.put("application", "HR Management System");
            health.put("version", "1.0.0");
            
            Map<String, Object> components = new HashMap<>();
            components.put("database", Map.of("status", dbHealthy ? "UP" : "DOWN"));
            health.put("components", components);
            
            return ResponseEntity.ok(health);
            
        } catch (Exception e) {
            health.put("status", "DOWN");
            health.put("error", e.getMessage());
            return ResponseEntity.status(503).body(health);
        }
    }
    
    /**
     * Spring Boot Actuator 健康检查
     */
    @Override
    public Health health() {
        try {
            boolean dbHealthy = checkDatabase();
            
            if (dbHealthy) {
                return Health.up()
                    .withDetail("database", "UP")
                    .withDetail("timestamp", LocalDateTime.now())
                    .build();
            } else {
                return Health.down()
                    .withDetail("database", "DOWN")
                    .withDetail("timestamp", LocalDateTime.now())
                    .build();
            }
        } catch (Exception e) {
            return Health.down()
                .withDetail("error", e.getMessage())
                .withDetail("timestamp", LocalDateTime.now())
                .build();
        }
    }
    
    /**
     * 检查数据库连接
     */
    private boolean checkDatabase() {
        try (Connection connection = dataSource.getConnection()) {
            return connection.isValid(5); // 5秒超时
        } catch (Exception e) {
            return false;
        }
    }
}