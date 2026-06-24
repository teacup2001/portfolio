#!/usr/bin/env bash

# Render 部署构建脚本

# 1. 安装依赖
npm install

# 2. 安装 lightningcss Linux 平台二进制（Windows 生成的 lockfile 不包含此包）
npm install lightningcss-linux-x64-gnu@1.32.0 --no-save

# 3. 将 Prisma schema 切换为 PostgreSQL（Render 需要 PostgreSQL）
sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma

# 4. 生成 Prisma Client
npx prisma generate

# 5. 将 schema 推送到数据库（仅当 DATABASE_URL 已配置时）
if [ -n "$DATABASE_URL" ]; then
  npx prisma db push --accept-data-loss
else
  echo "⚠️ DATABASE_URL 未配置，跳过数据库推送。请在 Render 环境变量中设置 DATABASE_URL。"
fi

# 6. 构建 Next.js 项目
npm run build
