#!/usr/bin/env bash

# Render 部署构建脚本
# 核心问题：Windows 生成的 package-lock.json 不包含 Linux 平台原生二进制
# 解决方案：删除 lockfile，让 npm 在 Linux 上重新解析所有依赖

# 1. 删除 Windows 的 lockfile 和 node_modules，强制 npm 重新解析
rm -f package-lock.json
rm -rf node_modules

# 2. 在 Linux 上全新安装依赖（自动下载所有 Linux 平台原生二进制）
npm install

# 3. 将 Prisma schema 切换为 PostgreSQL（Render 需要 PostgreSQL）
sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma

# 4. 生成 Prisma Client
npx prisma generate

# 5. 将 schema 推送到数据库（仅当 DATABASE_URL 已配置时）
if [ -n "$DATABASE_URL" ]; then
  npx prisma db push --accept-data-loss
else
  echo "⚠️ DATABASE_URL 未配置，跳过数据库推送。"
fi

# 6. 构建 Next.js 项目
npm run build
