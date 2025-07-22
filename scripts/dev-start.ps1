# 开发环境启动脚本 (不依赖Docker)

Write-Host "🚀 启动开发环境..." -ForegroundColor Green

# 检查 Node.js 是否安装
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js 版本: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js 未安装，请先安装 Node.js 18+" -ForegroundColor Red
    Write-Host "下载地址: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# 检查 Java 是否安装
try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    Write-Host "✅ Java 版本: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Java 未安装，请先安装 JDK 17+" -ForegroundColor Red
    Write-Host "下载地址: https://adoptium.net/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "📋 开发环境说明：" -ForegroundColor White
Write-Host "   - 前端将在 http://localhost:5173 启动" -ForegroundColor Cyan
Write-Host "   - 后端需要手动启动在 http://localhost:8080" -ForegroundColor Cyan
Write-Host "   - 需要手动配置数据库连接" -ForegroundColor Yellow
Write-Host ""

# 启动前端开发服务器
Write-Host "🔨 安装前端依赖..." -ForegroundColor Blue
Set-Location frontend

if (!(Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 前端依赖安装失败" -ForegroundColor Red
        exit 1
    }
}

Write-Host "🚀 启动前端开发服务器..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Set-Location ..

Write-Host ""
Write-Host "✅ 前端开发服务器已启动！" -ForegroundColor Green
Write-Host ""
Write-Host "📋 下一步操作：" -ForegroundColor White
Write-Host "   1. 配置数据库（MySQL 8.0+）" -ForegroundColor Yellow
Write-Host "   2. 修改 backend/src/main/resources/application.yml 中的数据库配置" -ForegroundColor Yellow
Write-Host "   3. 在另一个终端中启动后端：" -ForegroundColor Yellow
Write-Host "      cd backend" -ForegroundColor Gray
Write-Host "      ./mvnw spring-boot:run" -ForegroundColor Gray
Write-Host ""
Write-Host "🌐 访问地址：" -ForegroundColor White
Write-Host "   前端开发服务器: http://localhost:5173" -ForegroundColor Cyan
Write-Host "   后端API: http://localhost:8080/api" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔑 默认登录账号：" -ForegroundColor White
Write-Host "   用户名: admin" -ForegroundColor Yellow
Write-Host "   密码: admin123" -ForegroundColor Yellow