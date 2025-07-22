# 行政人事管理系统

一个现代化的轻量级行政人事管理系统，专为HR经理设计，将传统Office办公模式转变为Web/App模式，大幅提升工作效率。

## 🎯 项目特色

- **现代简约界面** - 参考 https://qmqdvxjg.manus.space/ 的深色主题设计
- **智能文件管理** - AI自动分类和标签，支持多格式预览
- **费用分摊计算** - 自动化水电费分摊，支持多种计费模式
- **车队管理** - 车辆档案、维修保养、到期提醒
- **多端支持** - 支持生成Android APK和Windows应用
- **轻量化部署** - 2C2G服务器即可运行，支持Docker一键部署

## 🏗️ 系统架构

- **前端**: Vue 3 + TypeScript + Vite + Tailwind CSS
- **后端**: Spring Boot 3 + MySQL 8 + Redis
- **存储**: MinIO (S3兼容) + WebDAV支持
- **部署**: Docker + Docker Compose
- **安全**: JWT认证 + Spring Security

## 📋 功能模块

### 1. 文件管理板块
- ✅ 智能文件上传（拖拽、多文件、断点续传）
- ✅ AI自动分类（行政公文、合同、证照、发票等）
- ✅ 在线预览（PDF、Office文档、图片）
- ✅ 全文搜索和标签筛选
- ✅ 到期提醒和加密分享
- ✅ 批量导出和清单管理

### 2. 费用分摊板块
- ✅ 宿舍信息管理（面积、租金、押金）
- ✅ 抄表数据录入（自动填充上期度数）
- ✅ 费用自动计算和分摊
- ✅ Excel模板导入导出

### 3. 电费核算板块
- ✅ 租户抄表管理（持睿汽车水电表数据）
- ✅ 分时电费统计（峰平谷时段）
- ✅ 星达/持睿电费明细
- ✅ 用电量趋势分析

### 4. 车队管理板块
- ✅ 车辆档案管理
- ✅ 司机信息管理
- ✅ 维修保养记录
- ✅ 年检保险到期提醒

### 5. 系统管理板块
- ✅ 多用户权限管理
- ✅ 系统配置和参数设置
- ✅ 操作日志和审计
- ✅ 数据备份和恢复

## 🚀 快速开始

### 方式一：Docker 一键部署（推荐）

```bash
# Windows 用户
.\scripts\start.ps1

# Linux/Mac 用户
./scripts/start.sh
```

### 方式二：手动部署

```bash
# 1. 启动基础服务
docker-compose up -d mysql redis minio

# 2. 启动前端开发服务器
cd frontend
npm install
npm run dev

# 3. 启动后端服务
cd backend
./mvnw spring-boot:run
```

## 🔑 默认账号

| 角色 | 用户名 | 密码 | 权限 |
|------|--------|------|------|
| 超级管理员 | admin | admin123 | 全部功能 |
| HR经理 | hr_manager | hr123456 | 业务功能 |

## 🌐 访问地址

- **前端界面**: http://localhost:3000
- **后端API**: http://localhost:8080/api
- **MinIO控制台**: http://localhost:9001
- **数据库**: localhost:3306 (hr_system/root/hr123456)

## 📊 系统要求

### 最低配置
- **CPU**: 2核心
- **内存**: 2GB
- **存储**: 20GB
- **系统**: Ubuntu 18.04+ / CentOS 7+ / Windows 10+

### 推荐配置
- **CPU**: 4核心
- **内存**: 4GB
- **存储**: 50GB SSD
- **网络**: 10Mbps+

## 🛠️ 开发环境

### 前端开发
```bash
cd frontend
npm install
npm run dev      # 开发服务器
npm run build    # 生产构建
npm run preview  # 预览构建结果
```

### 后端开发
```bash
cd backend
./mvnw spring-boot:run          # 启动开发服务器
./mvnw test                     # 运行测试
./mvnw clean package           # 构建JAR包
```

## 📁 项目结构

```
hr-management-system/
├── frontend/                   # Vue 3 前端应用
│   ├── src/
│   │   ├── components/        # 公共组件
│   │   ├── views/            # 页面组件
│   │   ├── layouts/          # 布局组件
│   │   ├── router/           # 路由配置
│   │   └── style.css         # 全局样式
│   ├── public/               # 静态资源
│   └── package.json          # 依赖配置
├── backend/                   # Spring Boot 后端服务
│   ├── src/main/java/com/hr/
│   │   ├── entity/           # 实体类
│   │   ├── repository/       # 数据访问层
│   │   ├── service/          # 业务逻辑层
│   │   ├── controller/       # 控制器层
│   │   ├── config/           # 配置类
│   │   └── util/             # 工具类
│   ├── src/main/resources/   # 配置文件
│   └── pom.xml               # Maven配置
├── docker/                   # Docker相关文件
│   └── mysql/init.sql        # 数据库初始化脚本
├── scripts/                  # 部署脚本
│   ├── start.sh             # Linux/Mac启动脚本
│   └── start.ps1            # Windows启动脚本
├── docs/                     # 项目文档
├── docker-compose.yml        # Docker编排文件
└── README.md                # 项目说明
```

## 🔧 配置说明

### 环境变量
```bash
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hr_system
DB_USER=root
DB_PASSWORD=hr123456

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379

# MinIO配置
MINIO_ENDPOINT=http://localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123

# JWT配置
JWT_SECRET=hrManagementSystemSecretKey2024
```

## 📝 常用命令

```bash
# 查看服务状态
docker-compose ps

# 查看服务日志
docker-compose logs -f [服务名]

# 重启服务
docker-compose restart [服务名]

# 停止所有服务
docker-compose down

# 清理数据（谨慎使用）
docker-compose down -v
```

## 🤝 技术支持

如果您在使用过程中遇到问题，可以：

1. 查看项目文档和FAQ
2. 提交Issue描述问题
3. 联系技术支持

## 📄 许可证

本项目采用 MIT 许可证，详见 [LICENSE](LICENSE) 文件。

---

**注意**: 这是一个为HR经理量身定制的管理系统，专注于提升行政办公效率。系统采用现代化技术栈，界面简洁美观，功能实用高效。