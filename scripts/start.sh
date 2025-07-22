#!/bin/bash

# 行政人事管理系统启动脚本

echo "🚀 启动行政人事管理系统..."

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 创建必要的目录
mkdir -p logs
mkdir -p data/mysql
mkdir -p data/minio
mkdir -p data/redis

# 停止现有容器
echo "🛑 停止现有容器..."
docker-compose down

# 构建并启动服务
echo "🔨 构建并启动服务..."
docker-compose up --build -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 30

# 检查服务状态
echo "🔍 检查服务状态..."
docker-compose ps

echo ""
echo "✅ 系统启动完成！"
echo ""
echo "📋 访问信息："
echo "   前端地址: http://localhost:3000"
echo "   后端API: http://localhost:8080/api"
echo "   MinIO控制台: http://localhost:9001"
echo ""
echo "🔑 默认登录账号："
echo "   管理员: admin / admin123"
echo "   HR经理: hr_manager / hr123456"
echo ""
echo "📊 数据库连接信息："
echo "   主机: localhost:3306"
echo "   数据库: hr_system"
echo "   用户名: root"
echo "   密码: hr123456"
echo ""
echo "💾 MinIO存储信息："
echo "   访问密钥: minioadmin"
echo "   秘密密钥: minioadmin123"
echo ""
echo "📝 查看日志命令："
echo "   docker-compose logs -f [服务名]"
echo "   例如: docker-compose logs -f backend"
echo ""
echo "🛑 停止系统命令："
echo "   docker-compose down"