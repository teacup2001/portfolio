#!/usr/bin/env bash

# Render 部署构建脚本

# 1. 将 Prisma schema 切换为 PostgreSQL（Render 需要 PostgreSQL）
sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma

# 2. 生成 Prisma Client（使用 PostgreSQL 配置）
npx prisma generate

# 3. 将 schema 推送到 PostgreSQL 数据库（创建表）
npx prisma db push --skip-generate

# 4. 构建 Next.js 项目
npm run build
