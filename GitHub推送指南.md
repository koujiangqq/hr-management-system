# GitHub 推送指南

## 🚀 将项目推送到GitHub的完整步骤

### 第一步：在GitHub上创建仓库

1. **登录GitHub**
   - 访问 https://github.com
   - 登录你的GitHub账号

2. **创建新仓库**
   - 点击右上角的 "+" 号
   - 选择 "New repository"
   - 填写仓库信息：
     - Repository name: `hr-management-system`
     - Description: `现代化的行政人事管理系统`
     - 选择 Public 或 Private
     - **不要**勾选 "Initialize this repository with a README"
   - 点击 "Create repository"

### 第二步：本地Git初始化和推送

在项目根目录打开终端（PowerShell或CMD），执行以下命令：

#### 1. 初始化Git仓库
```bash
git init
```

#### 2. 添加所有文件到暂存区
```bash
git add .
```

#### 3. 创建第一次提交
```bash
git commit -m "🎉 初始化行政人事管理系统项目

✨ 功能特性:
- 完整的前后端分离架构
- Vue 3 + Spring Boot 3 技术栈
- 五大核心业务模块
- Docker 一键部署
- 现代化深色主题界面

📋 包含模块:
- 文件管理板块 (智能上传、AI分类)
- 费用分摊板块 (宿舍管理、抄表录入)
- 电费核算板块 (分时电费统计)
- 车队管理板块 (车辆档案、维修记录)
- 系统管理板块 (用户权限、系统配置)

🚀 部署方式:
- Docker Compose 一键部署
- 开发环境手动启动
- 支持 Windows/Linux/Mac"
```

#### 4. 添加远程仓库地址
```bash
# 替换 YOUR_USERNAME 为你的GitHub用户名
git remote add origin https://github.com/YOUR_USERNAME/hr-management-system.git
```

#### 5. 推送到GitHub
```bash
git branch -M main
git push -u origin main
```

### 第三步：验证推送结果

1. 刷新GitHub仓库页面
2. 确认所有文件都已上传
3. 检查README.md是否正确显示

## 🔧 常见问题解决

### 问题1：Git未安装
**解决方案**：
- Windows: 下载安装 Git for Windows (https://git-scm.com/download/win)
- Mac: 安装 Xcode Command Line Tools 或使用 Homebrew
- Linux: `sudo apt-get install git` 或 `sudo yum install git`

### 问题2：认证失败
**解决方案**：
```bash
# 配置Git用户信息
git config --global user.name "你的姓名"
git config --global user.email "你的邮箱"

# 如果推送时要求登录，使用Personal Access Token
# 在GitHub Settings > Developer settings > Personal access tokens 创建token
```

### 问题3：推送被拒绝
**解决方案**：
```bash
# 如果远程仓库有内容，先拉取
git pull origin main --allow-unrelated-histories

# 然后再推送
git push origin main
```

### 问题4：文件太大
**解决方案**：
```bash
# 检查大文件
git ls-files --others --ignored --exclude-standard

# 添加到.gitignore
echo "大文件路径" >> .gitignore
git add .gitignore
git commit -m "更新.gitignore"
```

## 📝 后续维护

### 日常提交流程
```bash
# 1. 查看文件状态
git status

# 2. 添加修改的文件
git add .

# 3. 提交更改
git commit -m "描述你的更改"

# 4. 推送到远程仓库
git push origin main
```

### 分支管理
```bash
# 创建开发分支
git checkout -b develop

# 切换分支
git checkout main
git checkout develop

# 合并分支
git checkout main
git merge develop
```

### 版本标签
```bash
# 创建版本标签
git tag -a v1.0.0 -m "发布版本 1.0.0"

# 推送标签
git push origin v1.0.0
```

## 🌟 推荐的仓库设置

### 1. 设置仓库描述
在GitHub仓库页面点击设置图标，添加：
- Description: `现代化的行政人事管理系统，专为HR经理设计`
- Website: 你的演示地址（如果有）
- Topics: `hr-management`, `vue3`, `spring-boot`, `docker`, `admin-system`

### 2. 启用GitHub Pages（可选）
如果想展示项目文档：
- Settings > Pages
- Source: Deploy from a branch
- Branch: main / docs

### 3. 设置分支保护（可选）
- Settings > Branches
- Add rule for `main` branch
- 启用 "Require pull request reviews"

## 📋 推送检查清单

推送前确认：
- [ ] 所有敏感信息已移除（密码、密钥等）
- [ ] .gitignore 文件已正确配置
- [ ] README.md 内容完整且准确
- [ ] 项目可以正常构建和运行
- [ ] 许可证文件已添加
- [ ] 提交信息清晰明确

---

**提示**：首次推送可能需要几分钟时间，特别是包含较多文件时。推送完成后，你的项目就可以在GitHub上公开访问了！