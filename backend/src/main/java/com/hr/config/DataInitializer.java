package com.hr.config;

import com.hr.entity.User;
import com.hr.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * 数据初始化器
 */
@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserService userService;
    
    @Override
    public void run(String... args) throws Exception {
        initializeDefaultUsers();
    }
    
    /**
     * 初始化默认用户
     */
    private void initializeDefaultUsers() {
        // 检查是否已存在管理员用户
        if (userService.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword("admin123");
            admin.setRealName("系统管理员");
            admin.setEmail("admin@hr-system.com");
            admin.setRole(User.UserRole.SUPER_ADMIN);
            admin.setStatus(User.UserStatus.ACTIVE);
            
            userService.createUser(admin);
            System.out.println("默认管理员用户已创建: admin/admin123");
        }
        
        // 检查是否已存在HR经理用户
        if (userService.findByUsername("hr_manager").isEmpty()) {
            User hrManager = new User();
            hrManager.setUsername("hr_manager");
            hrManager.setPassword("hr123456");
            hrManager.setRealName("人事经理");
            hrManager.setEmail("hr@hr-system.com");
            hrManager.setRole(User.UserRole.ADMIN);
            hrManager.setStatus(User.UserStatus.ACTIVE);
            
            userService.createUser(hrManager);
            System.out.println("默认HR经理用户已创建: hr_manager/hr123456");
        }
    }
}