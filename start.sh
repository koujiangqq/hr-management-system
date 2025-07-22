#!/bin/bash

# HR管理系统快速启动脚本

echo "🚀 启动HR管理系统 WebDAV版本..."

# 检查环境配置文件
if [ ! -f .env ]; then
    echo "📝 创建环境配置文件..."
    cp .env.example .env
    echo "⚠️  请编辑 .env 文件配置必要参数"
fi

# 启动服务
echo "🔧 启动Docker服务..."
docker-compose up -d

echo "⏳ 等待服务启动..."
sleep 30

echo "✅ 服务启动完成！"
echo ""
echo "📋 访问地址："
echo "   前端: http://localhost:3000"
echo "   后端: http://localhost:8080/api"
echo "   WebDAV: http://localhost:8081/webdav"
echo ""
echo "🔍 查看状态: docker-compose ps"
echo "📋 查看日志: docker-compose logs -f"