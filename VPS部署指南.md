# VPS 部署指南

## 🚀 在VPS服务器上部署行政人事管理系统

### 📋 服务器要求

#### 最低配置
- **CPU**: 2核心
- **内存**: 2GB
- **存储**: 20GB
- **系统**: Ubuntu 18.04+ / CentOS 7+
- **网络**: 公网IP，开放端口 80, 443, 3000, 8080

#### 推荐配置
- **CPU**: 4核心
- **内存**: 4GB
- **存储**: 50GB SSD
- **带宽**: 5Mbps+

### 🔧 环境准备

#### 1. 连接到VPS服务器
```bash
# 使用SSH连接到你的VPS
ssh root@你的服务器IP
# 或者使用用户名
ssh 用户名@你的服务器IP
```

#### 2. 更新系统
```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y
```

#### 3. 安装必要软件

##### 安装Docker
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# CentOS/RHEL
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install -y docker-ce docker-ce-cli containerd.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

##### 安装Docker Compose
```bash
# 下载Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 添加执行权限
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker-compose --version
```

##### 安装Git
```bash
# Ubuntu/Debian
sudo apt install -y git

# CentOS/RHEL
sudo yum install -y git
```

### 🚀 部署步骤

#### 方法一：使用自动部署脚本（推荐）

1. **下载部署脚本**
```bash
# 创建部署目录
mkdir -p /opt/hr-system
cd /opt/hr-system

# 下载部署脚本
curl -O https://raw.githubusercontent.com/koujiangqq/hr-management-system/main/scripts/deploy-vps.sh

# 添加执行权限
chmod +x deploy-vps.sh

# 运行部署脚本
./deploy-vps.sh
```

#### 方法二：手动部署

1. **克隆项目代码**
```bash
# 创建项目目录
sudo mkdir -p /opt/hr-system
cd /opt/hr-system

# 克隆代码
sudo git clone https://github.com/koujiangqq/hr-management-system.git .

# 设置权限
sudo chown -R $USER:$USER /opt/hr-system
```

2. **配置环境变量**
```bash
# 创建环境配置文件
cat > .env << EOF
# 数据库配置
DB_HOST=mysql
DB_PORT=3306
DB_NAME=hr_system
DB_USER=root
DB_PASSWORD=hr123456

# Redis配置
REDIS_HOST=redis
REDIS_PORT=6379

# MinIO配置
MINIO_ENDPOINT=http://minio:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123

# JWT配置
JWT_SECRET=hrManagementSystemSecretKey2024VPS

# 服务器配置
SERVER_IP=你的服务器IP
DOMAIN=你的域名（可选）
EOF
```

3. **创建数据目录**
```bash
# 创建数据存储目录
mkdir -p data/{mysql,minio,redis}
mkdir -p logs

# 设置权限
chmod -R 755 data logs
```

4. **启动服务**
```bash
# 构建并启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 🔒 安全配置

#### 1. 配置防火墙
```bash
# Ubuntu (UFW)
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw allow 8080
sudo ufw enable

# CentOS (firewalld)
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload
```

#### 2. 修改默认密码
```bash
# 进入MySQL容器修改密码
docker-compose exec mysql mysql -u root -p

# 在MySQL中执行
ALTER USER 'root'@'%' IDENTIFIED BY '你的新密码';
FLUSH PRIVILEGES;
```

#### 3. 配置SSL证书（可选）
```bash
# 安装Certbot
sudo apt install certbot

# 获取SSL证书
sudo certbot certonly --standalone -d 你的域名

# 配置Nginx反向代理（见下文）
```

### 🌐 域名和反向代理配置

#### 1. 安装Nginx
```bash
# Ubuntu/Debian
sudo apt install -y nginx

# CentOS/RHEL
sudo yum install -y nginx
```

#### 2. 配置Nginx反向代理
```bash
# 创建配置文件
sudo tee /etc/nginx/sites-available/hr-system << EOF
server {
    listen 80;
    server_name 你的域名或IP;

    # 前端代理
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # API代理
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # MinIO代理
    location /minio/ {
        proxy_pass http://localhost:9001/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# 启用配置
sudo ln -s /etc/nginx/sites-available/hr-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 📊 监控和维护

#### 1. 系统监控脚本
```bash
# 创建监控脚本
cat > /opt/hr-system/monitor.sh << 'EOF'
#!/bin/bash
echo "=== HR管理系统状态监控 ==="
echo "时间: $(date)"
echo ""

echo "=== Docker容器状态 ==="
docker-compose ps

echo ""
echo "=== 系统资源使用 ==="
echo "CPU使用率:"
top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1

echo "内存使用:"
free -h

echo "磁盘使用:"
df -h /

echo ""
echo "=== 服务健康检查 ==="
echo "前端服务:"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "前端服务异常"

echo "后端API:"
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/actuator/health || echo "后端API异常"

echo ""
echo "=== 最近日志 ==="
docker-compose logs --tail=10
EOF

chmod +x /opt/hr-system/monitor.sh
```

#### 2. 自动备份脚本
```bash
# 创建备份脚本
cat > /opt/hr-system/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/hr-system/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

echo "开始备份数据库..."
docker-compose exec -T mysql mysqldump -u root -phr123456 hr_system > $BACKUP_DIR/database_$DATE.sql

echo "开始备份文件..."
tar -czf $BACKUP_DIR/files_$DATE.tar.gz data/minio

echo "清理7天前的备份..."
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "备份完成: $DATE"
EOF

chmod +x /opt/hr-system/backup.sh

# 设置定时备份
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/hr-system/backup.sh") | crontab -
```

### 🔧 常见问题解决

#### 问题1: 端口被占用
```bash
# 查看端口占用
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :8080

# 停止占用端口的服务
sudo systemctl stop 服务名
```

#### 问题2: Docker容器启动失败
```bash
# 查看详细日志
docker-compose logs 服务名

# 重新构建镜像
docker-compose build --no-cache

# 清理Docker资源
docker system prune -a
```

#### 问题3: 数据库连接失败
```bash
# 检查MySQL容器状态
docker-compose logs mysql

# 进入MySQL容器检查
docker-compose exec mysql mysql -u root -p
```

#### 问题4: 内存不足
```bash
# 添加交换空间
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 📝 部署检查清单

部署完成后，请检查：
- [ ] 所有Docker容器正常运行
- [ ] 前端页面可以正常访问
- [ ] 后端API健康检查通过
- [ ] 数据库连接正常
- [ ] 文件上传功能正常
- [ ] 用户登录功能正常
- [ ] 防火墙配置正确
- [ ] SSL证书配置（如果使用）
- [ ] 监控和备份脚本设置

### 🌐 访问地址

部署完成后，你可以通过以下地址访问系统：
- **系统主页**: http://你的服务器IP:3000
- **API接口**: http://你的服务器IP:8080/api
- **MinIO控制台**: http://你的服务器IP:9001
- **系统监控**: 运行 `/opt/hr-system/monitor.sh`

### 📞 技术支持

如果在部署过程中遇到问题：
1. 查看服务日志: `docker-compose logs -f`
2. 检查系统资源: `htop` 或 `top`
3. 运行监控脚本: `./monitor.sh`
4. 查看部署文档或联系技术支持

---

**注意**: 首次部署可能需要10-15分钟来下载Docker镜像和初始化数据库，请耐心等待。