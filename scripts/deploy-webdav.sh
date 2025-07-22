#!/bin/bash

# HR管理系统 WebDAV版本部署脚本
# 作者: HR Management System Team
# 版本: 2.0.0

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# 检查Docker和Docker Compose
check_docker() {
    log_step "检查Docker环境..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker未安装，请先安装Docker"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose未安装，请先安装Docker Compose"
        exit 1
    fi
    
    log_info "Docker环境检查通过"
}

# 创建环境配置文件
setup_environment() {
    log_step "配置环境变量..."
    
    if [ ! -f .env ]; then
        log_info "创建环境配置文件..."
        cp .env.example .env
        
        # 生成随机密码
        DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-16)
        WEBDAV_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-16)
        JWT_SECRET=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-32)
        
        # 更新配置文件
        sed -i "s/DB_PASSWORD=hr123456/DB_PASSWORD=$DB_PASSWORD/" .env
        sed -i "s/WEBDAV_PASSWORD=admin123/WEBDAV_PASSWORD=$WEBDAV_PASSWORD/" .env
        sed -i "s/JWT_SECRET=hrManagementSystemSecretKey2024/JWT_SECRET=$JWT_SECRET/" .env
        
        log_info "环境配置文件已创建: .env"
        log_warn "请编辑 .env 文件配置OpenAI API密钥等可选参数"
    else
        log_info "环境配置文件已存在"
    fi
}

# 构建和启动服务
start_services() {
    log_step "构建和启动服务..."
    
    # 停止现有服务
    docker-compose down 2>/dev/null || true
    
    # 构建镜像
    log_info "构建Docker镜像..."
    docker-compose build --no-cache
    
    # 启动服务
    log_info "启动服务..."
    docker-compose up -d
    
    log_info "服务启动完成"
}

# 等待服务就绪
wait_for_services() {
    log_step "等待服务启动..."
    
    # 等待数据库启动
    log_info "等待MySQL数据库启动..."
    for i in {1..30}; do
        if docker-compose exec -T mysql mysqladmin ping -h localhost --silent 2>/dev/null; then
            log_info "MySQL数据库已就绪"
            break
        fi
        sleep 2
        if [ $i -eq 30 ]; then
            log_error "MySQL数据库启动超时"
            exit 1
        fi
    done
    
    # 等待WebDAV启动
    log_info "等待WebDAV服务启动..."
    for i in {1..30}; do
        if curl -s http://localhost:8081/webdav > /dev/null 2>&1; then
            log_info "WebDAV服务已就绪"
            break
        fi
        sleep 2
        if [ $i -eq 30 ]; then
            log_warn "WebDAV服务启动超时，但不影响主要功能"
            break
        fi
    done
    
    # 等待后端API启动
    log_info "等待后端API启动..."
    for i in {1..60}; do
        if curl -s http://localhost:8080/api/actuator/health > /dev/null 2>&1; then
            log_info "后端API已就绪"
            break
        fi
        sleep 2
        if [ $i -eq 60 ]; then
            log_error "后端API启动超时"
            exit 1
        fi
    done
    
    # 等待前端启动
    log_info "等待前端服务启动..."
    for i in {1..30}; do
        if curl -s http://localhost:3000 > /dev/null 2>&1; then
            log_info "前端服务已就绪"
            break
        fi
        sleep 2
        if [ $i -eq 30 ]; then
            log_warn "前端服务启动超时"
            break
        fi
    done
}

# 测试服务
test_services() {
    log_step "测试服务功能..."
    
    # 测试后端API
    log_info "测试后端API..."
    health_response=$(curl -s http://localhost:8080/api/actuator/health)
    if echo "$health_response" | grep -q '"status":"UP"'; then
        log_info "✅ 后端API健康检查通过"
    else
        log_error "❌ 后端API健康检查失败"
    fi
    
    # 测试WebDAV
    log_info "测试WebDAV服务..."
    if curl -s -u admin:$(grep WEBDAV_PASSWORD .env | cut -d'=' -f2) http://localhost:8081/webdav > /dev/null; then
        log_info "✅ WebDAV服务连接正常"
    else
        log_warn "⚠️  WebDAV服务连接异常"
    fi
    
    # 测试Paperless-NGX（如果启用）
    if docker-compose ps | grep -q paperless; then
        log_info "测试Paperless-NGX服务..."
        if curl -s http://localhost:8000 > /dev/null; then
            log_info "✅ Paperless-NGX服务正常"
        else
            log_warn "⚠️  Paperless-NGX服务异常"
        fi
    fi
}

# 创建管理脚本
create_management_scripts() {
    log_step "创建管理脚本..."
    
    # 创建状态检查脚本
    cat > check-status.sh << 'EOF'
#!/bin/bash
echo "=== HR管理系统服务状态 ==="
echo "时间: $(date)"
echo ""

echo "=== Docker容器状态 ==="
docker-compose ps

echo ""
echo "=== 服务健康检查 ==="
echo -n "前端服务: "
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
    echo "✅ 正常"
else
    echo "❌ 异常"
fi

echo -n "后端API: "
if curl -s http://localhost:8080/api/actuator/health | grep -q '"status":"UP"'; then
    echo "✅ 正常"
else
    echo "❌ 异常"
fi

echo -n "WebDAV服务: "
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8081/webdav | grep -q "401\|200"; then
    echo "✅ 正常"
else
    echo "❌ 异常"
fi

echo -n "Paperless-NGX: "
if docker-compose ps | grep -q paperless && curl -s -o /dev/null -w "%{http_code}" http://localhost:8000 | grep -q "200"; then
    echo "✅ 正常"
else
    echo "⚠️  未启用或异常"
fi

echo ""
echo "=== 系统资源使用 ==="
echo "内存使用:"
free -h | grep Mem

echo "磁盘使用:"
df -h / | tail -1
EOF
    
    chmod +x check-status.sh
    
    # 创建备份脚本
    cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

echo "开始备份数据库..."
docker-compose exec -T mysql mysqldump -u root -p$(grep DB_PASSWORD .env | cut -d'=' -f2) hr_system > $BACKUP_DIR/database_$DATE.sql

echo "开始备份WebDAV文件..."
docker-compose exec webdav tar -czf /tmp/webdav_$DATE.tar.gz /var/lib/dav
docker cp $(docker-compose ps -q webdav):/tmp/webdav_$DATE.tar.gz $BACKUP_DIR/

echo "开始备份配置文件..."
cp .env $BACKUP_DIR/env_$DATE.backup
cp docker-compose.yml $BACKUP_DIR/docker-compose_$DATE.yml

echo "清理7天前的备份..."
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.backup" -mtime +7 -delete

echo "备份完成: $DATE"
ls -la $BACKUP_DIR/
EOF
    
    chmod +x backup.sh
    
    log_info "管理脚本创建完成"
}

# 显示部署结果
show_result() {
    log_step "部署完成！"
    
    # 读取配置
    DB_PASSWORD=$(grep DB_PASSWORD .env | cut -d'=' -f2)
    WEBDAV_PASSWORD=$(grep WEBDAV_PASSWORD .env | cut -d'=' -f2)
    
    echo ""
    echo "=========================================="
    echo "🎉 HR管理系统 WebDAV版本部署成功！"
    echo "=========================================="
    echo ""
    echo "📋 访问信息："
    echo "   前端应用:     http://localhost:3000"
    echo "   后端API:      http://localhost:8080/api"
    echo "   WebDAV存储:   http://localhost:8081/webdav"
    echo "   Paperless-NGX: http://localhost:8000 (可选)"
    echo ""
    echo "🔑 默认登录账号："
    echo "   管理员:       admin / admin123"
    echo "   HR经理:       hr_manager / hr123456"
    echo ""
    echo "🔒 系统密码："
    echo "   数据库密码:   $DB_PASSWORD"
    echo "   WebDAV密码:   $WEBDAV_PASSWORD"
    echo "   WebDAV用户:   admin"
    echo ""
    echo "🛠️ 管理命令："
    echo "   查看状态:     ./check-status.sh"
    echo "   服务日志:     docker-compose logs -f"
    echo "   重启服务:     docker-compose restart"
    echo "   停止服务:     docker-compose down"
    echo "   数据备份:     ./backup.sh"
    echo ""
    echo "📁 重要文件："
    echo "   环境配置:     .env"
    echo "   服务配置:     docker-compose.yml"
    echo "   部署文档:     README-WebDAV.md"
    echo ""
    echo "🚀 功能特性："
    echo "   ✅ WebDAV文件存储"
    echo "   ✅ Paperless-NGX集成 (可选)"
    echo "   ✅ OpenAI智能分析 (需配置API密钥)"
    echo "   ✅ 智能文档分类"
    echo "   ✅ 自动标签生成"
    echo "   ✅ 文档问答功能"
    echo ""
    echo "⚙️  配置OpenAI功能："
    echo "   编辑 .env 文件，设置 OPENAI_API_KEY"
    echo "   重启服务: docker-compose restart backend"
    echo ""
    echo "=========================================="
}

# 主函数
main() {
    echo "=========================================="
    echo "🚀 HR管理系统 WebDAV版本部署脚本"
    echo "=========================================="
    echo ""
    
    check_docker
    setup_environment
    start_services
    wait_for_services
    test_services
    create_management_scripts
    show_result
    
    echo ""
    log_info "部署脚本执行完成！"
    log_info "如果遇到问题，请查看日志: docker-compose logs -f"
}

# 执行主函数
main "$@"