@echo off
chcp 65001 >nul
echo 🚀 启动HR管理系统 WebDAV版本...

REM 检查环境配置文件
if not exist .env (
    echo 📝 创建环境配置文件...
    copy .env.example .env >nul
    echo ⚠️  请编辑 .env 文件配置必要参数
)

REM 启动服务
echo 🔧 启动Docker服务...
docker-compose up -d

echo ⏳ 等待服务启动...
timeout /t 30 /nobreak >nul

echo ✅ 服务启动完成！
echo.
echo 📋 访问地址：
echo    前端: http://localhost:3000
echo    后端: http://localhost:8080/api
echo    WebDAV: http://localhost:8081/webdav
echo.
echo 🔍 查看状态: docker-compose ps
echo 📋 查看日志: docker-compose logs -f

pause