# HR管理系统 - WebDAV版本更新说明

## 版本信息
- **版本**: 2.0.0
- **更新日期**: 2025-01-22
- **主要变更**: 移除S3兼容存储，改用WebDAV + Paperless-NGX + OpenAI

## 🔄 主要变更

### 1. 存储系统重构
- ❌ **移除**: MinIO S3兼容存储
- ✅ **新增**: WebDAV文件存储服务
- ✅ **支持**: 任何WebDAV兼容的存储后端

### 2. 文档管理增强
- ✅ **集成**: Paperless-NGX文档管理系统
- ✅ **功能**: OCR文档识别
- ✅ **功能**: 全文搜索
- ✅ **功能**: 高级标签管理

### 3. AI智能功能
- ✅ **新增**: OpenAI智能文档分类
- ✅ **新增**: 自动标签生成
- ✅ **新增**: 文档内容摘要
- ✅ **新增**: 智能文档问答

## 📁 文件变更

### 新增文件
```
backend/src/main/java/com/hr/service/
├── WebDAVStorageService.java      # WebDAV存储服务
├── PaperlessNgxService.java       # Paperless-NGX集成
├── OpenAIService.java             # OpenAI智能分析
└── DocumentService.java           # 文档管理服务（重构）

backend/src/main/java/com/hr/controller/
└── DocumentController.java        # 文档管理控制器

scripts/
└── deploy-webdav.sh               # WebDAV版本部署脚本

配置文件/
├── .env.example                   # 环境变量示例
├── README-WebDAV.md               # WebDAV版本说明文档
├── start.sh                       # Linux/Mac启动脚本
└── start.bat                      # Windows启动脚本
```

### 修改文件
```
backend/pom.xml                    # 更新依赖配置
backend/src/main/resources/application.yml  # 新增配置项
backend/src/main/java/com/hr/entity/Document.java  # 实体类更新
backend/src/main/java/com/hr/repository/DocumentRepository.java  # 仓库接口更新
docker-compose.yml                 # 服务配置更新
```

### 移除文件
```
# MinIO相关配置和代码已移除
```

## 🔧 配置变更

### 新增配置项

#### WebDAV配置
```yaml
webdav:
  url: ${WEBDAV_URL:http://localhost:8081/webdav}
  username: ${WEBDAV_USERNAME:admin}
  password: ${WEBDAV_PASSWORD:admin123}
  base-path: ${WEBDAV_BASE_PATH:/hr-documents}
```

#### Paperless-NGX配置
```yaml
paperless:
  api:
    url: ${PAPERLESS_API_URL:http://localhost:8000/api}
    token: ${PAPERLESS_API_TOKEN:}
```

#### OpenAI配置
```yaml
openai:
  api:
    key: ${OPENAI_API_KEY:}
    base-url: ${OPENAI_BASE_URL:https://api.openai.com/v1}
    model: ${OPENAI_MODEL:gpt-3.5-turbo}
    timeout: 30000
```

### 移除配置项
```yaml
# MinIO配置已移除
minio:
  endpoint: ...
  access-key: ...
  secret-key: ...
```

## 🐳 Docker服务变更

### 新增服务
```yaml
webdav:                    # WebDAV文件存储
  image: bytemark/webdav:latest
  ports: ["8081:8080"]

paperless:                 # Paperless-NGX文档管理
  image: ghcr.io/paperless-ngx/paperless-ngx:latest
  ports: ["8000:8000"]
```

### 移除服务
```yaml
# MinIO服务已移除
minio:
  image: minio/minio:latest
```

## 🔌 API变更

### 新增接口
```bash
# 智能问答
POST /api/documents/{id}/ask

# 重新分析文档
POST /api/documents/{id}/reanalyze

# 获取分类列表
GET /api/documents/categories

# 获取标签列表
GET /api/documents/tags

# 获取统计信息
GET /api/documents/statistics
```

### 修改接口
```bash
# 文档上传接口增强（支持AI分析）
POST /api/documents/upload

# 文档列表接口增强（支持更多筛选）
GET /api/documents?category=&tags=&keyword=
```

## 📊 数据库变更

### Document表结构更新
```sql
-- 新增字段
ALTER TABLE documents ADD COLUMN summary TEXT;           -- 文档摘要
ALTER TABLE documents ADD COLUMN paperless_id BIGINT;   -- Paperless-NGX ID
ALTER TABLE documents ADD COLUMN ai_processed BOOLEAN DEFAULT FALSE;  -- AI处理状态

-- 字段类型调整
ALTER TABLE documents MODIFY COLUMN category VARCHAR(50);  -- 分类改为字符串类型
```

## 🚀 部署方式

### 快速启动
```bash
# Linux/Mac
./start.sh

# Windows
start.bat

# 或使用Docker Compose
docker-compose up -d
```

### 完整部署
```bash
# 使用部署脚本（推荐）
./scripts/deploy-webdav.sh
```

## 🔄 迁移指南

### 从MinIO版本迁移

1. **备份数据**：
   ```bash
   # 备份数据库
   docker-compose exec mysql mysqldump -u root -p hr_system > backup.sql
   
   # 备份MinIO文件
   docker-compose exec minio mc cp --recursive /data/hr-files ./minio-backup/
   ```

2. **更新代码**：
   ```bash
   git pull origin main
   ```

3. **配置环境**：
   ```bash
   cp .env.example .env
   # 编辑 .env 文件
   ```

4. **迁移文件**：
   ```bash
   # 将MinIO文件迁移到WebDAV
   # 具体步骤请参考迁移文档
   ```

5. **启动新版本**：
   ```bash
   ./scripts/deploy-webdav.sh
   ```

## ⚠️ 注意事项

1. **兼容性**：
   - 需要Docker 20.10+
   - 需要Docker Compose 2.0+
   - 建议使用Linux/Mac环境

2. **资源需求**：
   - 内存: 最少4GB，推荐8GB
   - 磁盘: 最少10GB可用空间
   - CPU: 2核心以上

3. **网络要求**：
   - 如使用OpenAI功能，需要能访问OpenAI API
   - 如使用外部WebDAV，需要相应的网络连接

4. **安全建议**：
   - 修改默认密码
   - 使用HTTPS（生产环境）
   - 定期备份数据

## 🆘 故障排除

### 常见问题

1. **WebDAV连接失败**：
   - 检查服务状态：`docker-compose ps`
   - 查看日志：`docker-compose logs webdav`

2. **AI功能不工作**：
   - 检查OpenAI API密钥配置
   - 验证网络连接

3. **Paperless-NGX启动慢**：
   - 首次启动需要初始化，请耐心等待
   - 查看启动日志：`docker-compose logs paperless`

### 获取帮助

- 查看详细文档：`README-WebDAV.md`
- 检查服务状态：`./check-status.sh`
- 查看服务日志：`docker-compose logs -f`

## 📝 更新日志

### v2.0.0 (2025-01-22)
- 移除MinIO S3存储，改用WebDAV
- 集成Paperless-NGX文档管理系统
- 新增OpenAI智能分析功能
- 重构文档管理服务
- 优化部署流程

### v1.0.0 (2024-12-01)
- 初始版本
- 基于MinIO S3存储
- 基础文档管理功能