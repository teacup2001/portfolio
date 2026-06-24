#!/usr/bin/env bash

# Render 部署构建脚本

# 1. 安装依赖（包括 devDependencies，因为需要 prisma CLI）
npm install

# 2. 将 Prisma schema 切换为 PostgreSQL（Render 需要 PostgreSQL）
sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma

# 3. 生成 Prisma Client（使用 PostgreSQL 配置）
npx prisma generate

# 4. 将 schema 推送到 PostgreSQL 数据库（创建表）
npx prisma db push --accept-data-loss

# 5. 构建 Next.js 项目
npm run build
