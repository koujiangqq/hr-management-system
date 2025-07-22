# HR管理系统 - WebDAV存储版本

本版本已移除MinIO S3兼容存储，改用WebDAV作为文件存储后端，并集成了Paperless-NGX文档管理系统和OpenAI智能分析功能。

## 主要变更

### 1. 存储系统
- ❌ 移除MinIO S3兼容存储
- ✅ 新增WebDAV文件存储
- ✅ 支持任何WebDAV兼容的存储服务

### 2. 文档管理
- ✅ 集成Paperless-NGX API
- ✅ 支持文档OCR识别
- ✅ 支持文档全文搜索
- ✅ 支持文档标签管理

### 3. AI智能功能
- ✅ OpenAI智能文档分类
- ✅ 自动标签生成
- ✅ 文档内容摘要
- ✅ 智能文档问答

## 服务架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端 (Vue3)   │────│  后端 (Spring)  │────│  MySQL 数据库   │
│   Port: 3000    │    │   Port: 8080    │    │   Port: 3306    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                    ┌─────────┼─────────┐
                    │         │         │
            ┌───────▼───┐ ┌───▼────┐ ┌──▼──────────┐
            │  WebDAV   │ │ Redis  │ │ Paperless   │
            │Port: 8081 │ │Port:   │ │ Port: 8000  │
            │           │ │ 6379   │ │ (可选)      │
            └───────────┘ └────────┘ └─────────────┘
```

## 快速开始

### 1. 环境准备

复制环境变量配置文件：
```bash
cp .env.example .env
```

编辑 `.env` 文件，配置必要的环境变量：
```bash
# 基础配置（必需）
DB_PASSWORD=your_secure_password
WEBDAV_USERNAME=your_webdav_username
WEBDAV_PASSWORD=your_webdav_password

# OpenAI配置（可选，用于AI功能）
OPENAI_API_KEY=your_openai_api_key

# Paperless-NGX配置（可选）
PAPERLESS_API_TOKEN=your_paperless_token
```

### 2. 启动服务

```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 3. 访问应用

- **前端应用**: http://localhost:3000
- **后端API**: http://localhost:8080/api
- **WebDAV存储**: http://localhost:8081/webdav
- **Paperless-NGX**: http://localhost:8000 (可选)

### 4. 默认账号

- **管理员**: admin / admin123
- **HR经理**: hr_manager / hr123456

## 配置说明

### WebDAV存储配置

WebDAV是一个基于HTTP的文件存储协议，支持多种存储后端：

```yaml
webdav:
  url: http://webdav:8080/webdav  # WebDAV服务地址
  username: admin                  # 用户名
  password: admin123              # 密码
  base-path: /hr-documents        # 文档存储根路径
```

**支持的WebDAV服务**：
- Nextcloud
- ownCloud
- Apache HTTP Server (mod_dav)
- Nginx (nginx-dav-ext-module)
- SabreDAV
- 本项目使用的 bytemark/webdav

### Paperless-NGX集成

Paperless-NGX是一个开源的文档管理系统，提供OCR、全文搜索等功能：

```yaml
paperless:
  api:
    url: http://paperless:8000/api  # Paperless-NGX API地址
    token: your_api_token           # API访问令牌
```

**功能特性**：
- 自动OCR文档识别
- 全文搜索
- 标签管理
- 文档分类
- 邮件导入

### OpenAI智能分析

集成OpenAI API提供智能文档分析功能：

```yaml
openai:
  api:
    key: your_api_key                    # OpenAI API密钥
    base-url: https://api.openai.com/v1  # API基础URL
    model: gpt-3.5-turbo                 # 使用的模型
```

**AI功能**：
- 智能文档分类
- 自动标签生成
- 文档内容摘要
- 智能问答

## API接口

### 文档管理接口

```bash
# 上传文档
POST /api/documents/upload
Content-Type: multipart/form-data

# 获取文档列表
GET /api/documents?category=contracts&tags=重要&keyword=合同

# 获取文档详情
GET /api/documents/{id}

# 下载文档
GET /api/documents/{id}/download

# 删除文档
DELETE /api/documents/{id}

# 智能问答
POST /api/documents/{id}/ask
{
  "question": "这份合同的有效期是多久？"
}

# 重新分析文档
POST /api/documents/{id}/reanalyze

# 获取分类列表
GET /api/documents/categories

# 获取标签列表
GET /api/documents/tags
```

### 文档分类

系统支持以下文档分类：
- `personnel_files` - 人事档案
- `contracts` - 合同文件
- `financial_reports` - 财务报表
- `meeting_minutes` - 会议纪要
- `policies` - 政策制度
- `training_materials` - 培训资料
- `certificates` - 证书证照
- `invoices` - 发票单据
- `others` - 其他文档

## 部署说明

### 生产环境部署

1. **安全配置**：
   ```bash
   # 修改默认密码
   DB_PASSWORD=your_secure_db_password
   WEBDAV_PASSWORD=your_secure_webdav_password
   JWT_SECRET=your_secure_jwt_secret
   ```

2. **外部WebDAV服务**：
   ```bash
   # 使用外部WebDAV服务
   WEBDAV_URL=https://your-webdav-server.com/webdav
   WEBDAV_USERNAME=your_username
   WEBDAV_PASSWORD=your_password
   ```

3. **SSL/TLS配置**：
   - 配置反向代理（Nginx/Apache）
   - 启用HTTPS
   - 配置SSL证书

### 数据备份

```bash
# 备份数据库
docker-compose exec mysql mysqldump -u root -p hr_system > backup.sql

# 备份WebDAV文件
docker-compose exec webdav tar -czf /tmp/webdav-backup.tar.gz /var/lib/dav
docker cp $(docker-compose ps -q webdav):/tmp/webdav-backup.tar.gz ./webdav-backup.tar.gz
```

## 故障排除

### 常见问题

1. **WebDAV连接失败**：
   - 检查WebDAV服务是否启动
   - 验证用户名密码是否正确
   - 确认网络连接正常

2. **文档上传失败**：
   - 检查文件大小限制
   - 验证WebDAV存储空间
   - 查看后端日志

3. **AI功能不可用**：
   - 检查OpenAI API密钥是否配置
   - 验证网络是否能访问OpenAI API
   - 查看API调用限制

### 日志查看

```bash
# 查看所有服务日志
docker-compose logs

# 查看特定服务日志
docker-compose logs backend
docker-compose logs webdav
docker-compose logs paperless

# 实时查看日志
docker-compose logs -f backend
```

## 开发说明

### 本地开发环境

1. **后端开发**：
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

2. **前端开发**：
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### 添加新的存储后端

如需支持其他存储系统，可以实现 `StorageService` 接口：

```java
public interface StorageService {
    String uploadFile(MultipartFile file, String category) throws IOException;
    InputStream downloadFile(String filePath) throws IOException;
    void deleteFile(String filePath) throws IOException;
    boolean fileExists(String filePath) throws IOException;
}
```

## 许可证

本项目采用 MIT 许可证，详见 [LICENSE](LICENSE) 文件。