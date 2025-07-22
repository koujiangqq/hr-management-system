# 行政人事管理系统启动脚本 (PowerShell)

Write-Host "🚀 启动行政人事管理系统..." -ForegroundColor Green

# 检查 Docker 是否安装
try {
    docker --version | Out-Null
} catch {
    Write-Host "❌ Docker 未安装，请先安装 Docker Desktop" -ForegroundColor Red
    exit 1
}

try {
    docker-compose --version | Out-Null
} catch {
    Write-Host "❌ Docker Compose 未安装，请先安装 Docker Compose" -ForegroundColor Red
    exit 1
}

# 创建必要的目录
$directories = @("logs", "data\mysql", "data\minio", "data\redis")
foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

# 停止现有容器
Write-Host "🛑 停止现有容器..." -ForegroundColor Yellow
docker-compose down

# 构建并启动服务
Write-Host "🔨 构建并启动服务..." -ForegroundColor Blue
docker-compose up --build -d

# 等待服务启动
Write-Host "⏳ 等待服务启动..." -ForegroundColor Cyan
Start-Sleep -Seconds 30

# 检查服务状态
Write-Host "🔍 检查服务状态..." -ForegroundColor Magenta
docker-compose ps

Write-Host ""
Write-Host "✅ 系统启动完成！" -ForegroundColor Green
Write-Host ""
Write-Host "📋 访问信息：" -ForegroundColor White
Write-Host "   前端地址: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   后端API: http://localhost:8080/api" -ForegroundColor Cyan
Write-Host "   MinIO控制台: http://localhost:9001" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔑 默认登录账号：" -ForegroundColor White
Write-Host "   管理员: admin / admin123" -ForegroundColor Yellow
Write-Host "   HR经理: hr_manager / hr123456" -ForegroundColor Yellow
Write-Host ""
Write-Host "📊 数据库连接信息：" -ForegroundColor White
Write-Host "   主机: localhost:3306" -ForegroundColor Cyan
Write-Host "   数据库: hr_system" -ForegroundColor Cyan
Write-Host "   用户名: root" -ForegroundColor Cyan
Write-Host "   密码: hr123456" -ForegroundColor Cyan
Write-Host ""
Write-Host "💾 MinIO存储信息：" -ForegroundColor White
Write-Host "   访问密钥: minioadmin" -ForegroundColor Cyan
Write-Host "   秘密密钥: minioadmin123" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 查看日志命令：" -ForegroundColor White
Write-Host "   docker-compose logs -f [服务名]" -ForegroundColor Gray
Write-Host "   例如: docker-compose logs -f backend" -ForegroundColor Gray
Write-Host ""
Write-Host "🛑 停止系统命令：" -ForegroundColor White
Write-Host "   docker-compose down" -ForegroundColor Gray