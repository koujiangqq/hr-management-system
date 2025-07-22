#!/bin/bash

# VPS自动部署脚本 - 行政人事管理系统
# 作者: HR Management System Team
# 版本: 1.0.0

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# 检查是否为root用户
check_root() {
    if [[ $EUID -eq 0 ]]; then
        log_warn "检测到root用户，建议使用普通用户运行此脚本"
        read -p "是否继续? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# 检测操作系统
detect_os() {
    if [[ -f /etc/os-release ]]; then
        . /etc/os-release
        OS=$NAME
        VER=$VERSION_ID
    else
        log_error "无法检测操作系统版本"
        exit 1
    fi
    
    log_info "检测到操作系统: $OS $VER"
}

# 安装Docker
install_docker() {
    log_step "检查Docker安装状态..."
    
    if command -v docker &> /dev/null; then
        log_info "Docker已安装: $(docker --version)"
    else
        log_step "安装Docker..."
        
        if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
            # Ubuntu/Debian
            sudo apt-get update
            sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
            curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
            echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
            sudo apt-get update
            sudo apt-get install -y docker-ce docker-ce-cli containerd.io
        elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
            # CentOS/RHEL
            sudo yum install -y yum-utils
            sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
            sudo yum install -y docker-ce docker-ce-cli containerd.io
            sudo systemctl start docker
            sudo systemctl enable docker
        else
            log_error "不支持的操作系统: $OS"
            exit 1
        fi
        
        # 添加用户到docker组
        sudo usermod -aG docker $USER
        log_info "Docker安装完成"
    fi
}

# 安装Docker Compose
install_docker_compose() {
    log_step "检查Docker Compose安装状态..."
    
    if command -v docker-compose &> /dev/null; then
        log_info "Docker Compose已安装: $(docker-compose --version)"
    else
        log_step "安装Docker Compose..."
        sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
        log_info "Docker Compose安装完成"
    fi
}

# 安装Git
install_git() {
    log_step "检查Git安装状态..."
    
    if command -v git &> /dev/null; then
        log_info "Git已安装: $(git --version)"
    else
        log_step "安装Git..."
        if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
            sudo apt-get install -y git
        elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
            sudo yum install -y git
        fi
        log_info "Git安装完成"
    fi
}

# 克隆项目代码
clone_project() {
    log_step "克隆项目代码..."
    
    PROJECT_DIR="/opt/hr-system"
    
    if [[ -d "$PROJECT_DIR" ]]; then
        log_warn "项目目录已存在: $PROJECT_DIR"
        read -p "是否删除并重新克隆? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            sudo rm -rf "$PROJECT_DIR"
        else
            cd "$PROJECT_DIR"
            git pull origin main
            return
        fi
    fi
    
    sudo mkdir -p "$PROJECT_DIR"
    sudo git clone https://github.com/koujiangqq/hr-management-system.git "$PROJECT_DIR"
    sudo chown -R $USER:$USER "$PROJECT_DIR"
    cd "$PROJECT_DIR"
    
    log_info "项目代码克隆完成"
}

# 配置环境变量
setup_environment() {
    log_step "配置环境变量..."
    
    # 获取服务器IP
    SERVER_IP=$(curl -s ifconfig.me || curl -s ipinfo.io/ip || echo "localhost")
    
    # 生成随机密码
    DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-16)
    JWT_SECRET=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-32)
    MINIO_SECRET=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-16)
    
    cat > .env << EOF
# 数据库配置
DB_HOST=mysql
DB_PORT=3306
DB_NAME=hr_system
DB_USER=root
DB_PASSWORD=$DB_PASSWORD

# Redis配置
REDIS_HOST=redis
REDIS_PORT=6379

# MinIO配置
MINIO_ENDPOINT=http://minio:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=$MINIO_SECRET

# JWT配置
JWT_SECRET=$JWT_SECRET

# 服务器配置
SERVER_IP=$SERVER_IP
EOF
    
    log_info "环境变量配置完成"
    log_info "服务器IP: $SERVER_IP"
    log_info "数据库密码: $DB_PASSWORD"
    log_info "MinIO密钥: $MINIO_SECRET"
}

# 创建数据目录
create_directories() {
    log_step "创建数据目录..."
    
    mkdir -p data/{mysql,minio,redis}
    mkdir -p logs
    mkdir -p backups
    
    chmod -R 755 data logs backups
    
    log_info "数据目录创建完成"
}

# 配置防火墙
setup_firewall() {
    log_step "配置防火墙..."
    
    if command -v ufw &> /dev/null; then
        # Ubuntu UFW
        sudo ufw --force enable
        sudo ufw allow ssh
        sudo ufw allow 80
        sudo ufw allow 443
        sudo ufw allow 3000
        sudo ufw allow 8080
        sudo ufw allow 9001
        log_info "UFW防火墙配置完成"
    elif command -v firewall-cmd &> /dev/null; then
        # CentOS firewalld
        sudo systemctl start firewalld
        sudo systemctl enable firewalld
        sudo firewall-cmd --permanent --add-service=ssh
        sudo firewall-cmd --permanent --add-port=80/tcp
        sudo firewall-cmd --permanent --add-port=443/tcp
        sudo firewall-cmd --permanent --add-port=3000/tcp
        sudo firewall-cmd --permanent --add-port=8080/tcp
        sudo firewall-cmd --permanent --add-port=9001/tcp
        sudo firewall-cmd --reload
        log_info "firewalld防火墙配置完成"
    else
        log_warn "未检测到防火墙，请手动配置端口开放"
    fi
}

# 启动服务
start_services() {
    log_step "启动服务..."
    
    # 停止可能存在的服务
    docker-compose down 2>/dev/null || true
    
    # 构建并启动服务
    docker-compose up -d --build
    
    log_info "服务启动完成"
}

# 等待服务就绪
wait_for_services() {
    log_step "等待服务启动..."
    
    # 等待数据库启动
    log_info "等待数据库启动..."
    for i in {1..30}; do
        if docker-compose exec -T mysql mysqladmin ping -h localhost --silent; then
            log_info "数据库已就绪"
            break
        fi
        sleep 2
    done
    
    # 等待后端API启动
    log_info "等待后端API启动..."
    for i in {1..30}; do
        if curl -s http://localhost:8080/api/actuator/health > /dev/null; then
            log_info "后端API已就绪"
            break
        fi
        sleep 2
    done
    
    # 等待前端启动
    log_info "等待前端启动..."
    for i in {1..30}; do
        if curl -s http://localhost:3000 > /dev/null; then
            log_info "前端已就绪"
            break
        fi
        sleep 2
    done
}

# 创建监控脚本
create_monitor_script() {
    log_step "创建监控脚本..."
    
    cat > monitor.sh << 'EOF'
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
echo -n "前端服务: "
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 && echo " ✓" || echo " ✗"

echo -n "后端API: "
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/actuator/health && echo " ✓" || echo " ✗"

echo -n "MinIO服务: "
curl -s -o /dev/null -w "%{http_code}" http://localhost:9001 && echo " ✓" || echo " ✗"
EOF
    
    chmod +x monitor.sh
    log_info "监控脚本创建完成"
}

# 创建备份脚本
create_backup_script() {
    log_step "创建备份脚本..."
    
    cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

echo "开始备份数据库..."
docker-compose exec -T mysql mysqldump -u root -p$(grep DB_PASSWORD .env | cut -d'=' -f2) hr_system > $BACKUP_DIR/database_$DATE.sql

echo "开始备份文件..."
tar -czf $BACKUP_DIR/files_$DATE.tar.gz data/minio

echo "清理7天前的备份..."
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "备份完成: $DATE"
EOF
    
    chmod +x backup.sh
    
    # 设置定时备份
    (crontab -l 2>/dev/null; echo "0 2 * * * cd /opt/hr-system && ./backup.sh") | crontab -
    
    log_info "备份脚本创建完成，已设置每日2点自动备份"
}

# 显示部署结果
show_result() {
    log_step "部署完成！"
    
    SERVER_IP=$(grep SERVER_IP .env | cut -d'=' -f2)
    DB_PASSWORD=$(grep DB_PASSWORD .env | cut -d'=' -f2)
    MINIO_SECRET=$(grep MINIO_SECRET_KEY .env | cut -d'=' -f2)
    
    echo ""
    echo "=========================================="
    echo "🎉 HR管理系统部署成功！"
    echo "=========================================="
    echo ""
    echo "📋 访问信息："
    echo "   前端地址: http://$SERVER_IP:3000"
    echo "   后端API:  http://$SERVER_IP:8080/api"
    echo "   MinIO控制台: http://$SERVER_IP:9001"
    echo ""
    echo "🔑 默认登录账号："
    echo "   管理员: admin / admin123"
    echo "   HR经理: hr_manager / hr123456"
    echo ""
    echo "🔒 系统密码："
    echo "   数据库密码: $DB_PASSWORD"
    echo "   MinIO访问密钥: minioadmin"
    echo "   MinIO秘密密钥: $MINIO_SECRET"
    echo ""
    echo "🛠️ 管理命令："
    echo "   查看状态: docker-compose ps"
    echo "   查看日志: docker-compose logs -f"
    echo "   重启服务: docker-compose restart"
    echo "   停止服务: docker-compose down"
    echo "   系统监控: ./monitor.sh"
    echo "   手动备份: ./backup.sh"
    echo ""
    echo "📁 项目目录: /opt/hr-system"
    echo "=========================================="
}

# 主函数
main() {
    echo "=========================================="
    echo "🚀 HR管理系统VPS自动部署脚本"
    echo "=========================================="
    echo ""
    
    check_root
    detect_os
    install_docker
    install_docker_compose
    install_git
    clone_project
    setup_environment
    create_directories
    setup_firewall
    start_services
    wait_for_services
    create_monitor_script
    create_backup_script
    show_result
    
    echo ""
    log_info "部署脚本执行完成！"
    log_info "如果遇到问题，请查看日志: docker-compose logs -f"
}

# 执行主函数
main "$@"