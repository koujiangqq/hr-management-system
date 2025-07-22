-- 创建数据库
CREATE DATABASE IF NOT EXISTS hr_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE hr_system;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    real_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    role ENUM('SUPER_ADMIN', 'ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    status ENUM('ACTIVE', 'DISABLED', 'LOCKED') NOT NULL DEFAULT 'ACTIVE',
    last_login_time DATETIME,
    created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建标签表
CREATE TABLE IF NOT EXISTS tags (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    ai_generated BOOLEAN NOT NULL DEFAULT FALSE,
    use_count INT NOT NULL DEFAULT 0,
    created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_ai_generated (ai_generated),
    INDEX idx_use_count (use_count)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建文档表
CREATE TABLE IF NOT EXISTS documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    storage_path VARCHAR(512) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size BIGINT NOT NULL,
    content_type VARCHAR(100),
    category ENUM('ADMIN', 'CONTRACT', 'CERT', 'INVOICE', 'REPORT', 'REGULATION'),
    description TEXT,
    expiration_date DATE,
    uploader_id BIGINT,
    ai_generated BOOLEAN NOT NULL DEFAULT FALSE,
    download_count INT NOT NULL DEFAULT 0,
    created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_title (title),
    INDEX idx_file_type (file_type),
    INDEX idx_category (category),
    INDEX idx_uploader_id (uploader_id),
    INDEX idx_expiration_date (expiration_date),
    INDEX idx_created_time (created_time),
    FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建文档标签关联表
CREATE TABLE IF NOT EXISTS document_tags (
    document_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    PRIMARY KEY (document_id, tag_id),
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建费用分摊相关表
CREATE TABLE IF NOT EXISTS dormitories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(50) NOT NULL UNIQUE,
    area DECIMAL(8,2) NOT NULL DEFAULT 30.00,
    rent DECIMAL(10,2) NOT NULL DEFAULT 350.00,
    deposit DECIMAL(10,2) NOT NULL DEFAULT 1000.00,
    status ENUM('OCCUPIED', 'VACANT', 'MAINTENANCE') NOT NULL DEFAULT 'VACANT',
    remarks TEXT,
    created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_room_number (room_number),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建抄表记录表
CREATE TABLE IF NOT EXISTS meter_readings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    dormitory_id BIGINT,
    reading_month VARCHAR(7) NOT NULL, -- 格式: YYYY-MM
    water_start_reading DECIMAL(10,2),
    water_end_reading DECIMAL(10,2),
    electricity_start_reading DECIMAL(10,2),
    electricity_end_reading DECIMAL(10,2),
    reading_date DATE NOT NULL,
    recorder_id BIGINT,
    created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_dormitory_id (dormitory_id),
    INDEX idx_reading_month (reading_month),
    INDEX idx_reading_date (reading_date),
    FOREIGN KEY (dormitory_id) REFERENCES dormitories(id) ON DELETE CASCADE,
    FOREIGN KEY (recorder_id) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY uk_dormitory_month (dormitory_id, reading_month)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建车辆管理相关表
CREATE TABLE IF NOT EXISTS vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    license_plate VARCHAR(20) NOT NULL UNIQUE,
    vehicle_type VARCHAR(100) NOT NULL,
    brand VARCHAR(50),
    model VARCHAR(50),
    year_manufactured INT,
    purchase_date DATE,
    status ENUM('NORMAL', 'MAINTENANCE', 'RETIRED') NOT NULL DEFAULT 'NORMAL',
    annual_inspection_date DATE,
    insurance_expiry_date DATE,
    driver_id BIGINT,
    remarks TEXT,
    created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_license_plate (license_plate),
    INDEX idx_status (status),
    INDEX idx_annual_inspection_date (annual_inspection_date),
    INDEX idx_insurance_expiry_date (insurance_expiry_date),
    FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建系统配置表
CREATE TABLE IF NOT EXISTS system_configs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value TEXT,
    config_type ENUM('STRING', 'NUMBER', 'BOOLEAN', 'JSON') NOT NULL DEFAULT 'STRING',
    description VARCHAR(255),
    created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_config_key (config_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入默认系统配置
INSERT INTO system_configs (config_key, config_value, config_type, description) VALUES
('system.name', '行政人事管理系统', 'STRING', '系统名称'),
('file.max_size', '104857600', 'NUMBER', '文件上传最大大小(字节)'),
('file.allowed_types', 'pdf,doc,docx,xls,xlsx,jpg,jpeg,png,gif', 'STRING', '允许上传的文件类型'),
('electricity.peak_rate', '0.8', 'NUMBER', '峰时电价(元/度)'),
('electricity.normal_rate', '0.6', 'NUMBER', '平时电价(元/度)'),
('electricity.valley_rate', '0.4', 'NUMBER', '谷时电价(元/度)'),
('water.rate', '3.5', 'NUMBER', '水费单价(元/吨)');

-- 插入一些示例数据
INSERT INTO dormitories (room_number, area, rent, deposit, status, remarks) VALUES
('101', 30.00, 350.00, 1000.00, 'OCCUPIED', '单人间'),
('102', 30.00, 350.00, 1000.00, 'OCCUPIED', '单人间'),
('103', 30.00, 350.00, 1000.00, 'VACANT', '单人间'),
('201', 45.00, 500.00, 1500.00, 'OCCUPIED', '双人间'),
('202', 45.00, 500.00, 1500.00, 'MAINTENANCE', '双人间，维修中');

INSERT INTO vehicles (license_plate, vehicle_type, brand, model, status, annual_inspection_date, insurance_expiry_date) VALUES
('渝A12345', '货车', '东风', 'DFL1160BX1V', 'NORMAL', '2024-12-15', '2024-10-20'),
('渝A67890', '卡车', '解放', 'CA1180P62K1L4T3E5', 'MAINTENANCE', '2025-03-10', '2024-11-05'),
('渝B11111', '面包车', '五菱', '宏光S3', 'NORMAL', '2024-09-30', '2024-12-25');

-- 创建全文索引（如果支持）
-- ALTER TABLE documents ADD FULLTEXT(title, description);
-- ALTER TABLE tags ADD FULLTEXT(name);