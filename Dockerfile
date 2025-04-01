FROM node:16.16-alpine AS builder

WORKDIR /app

# 安装构建依赖
RUN apk update && apk add --no-cache build-base python3


# 复制配置文件
COPY .npmrc tsconfig.root.json lerna.json package.json package-lock.json ./

# 复制包目录
COPY packages/server ./packages/server
COPY packages/shared ./packages/shared
COPY packages/client ./packages/client

# 安装依赖并构建
RUN npm install @nx/nx-linux-x64-musl -g
RUN npm i && npm run build

# 运行阶段
FROM node:16.16-alpine

# 安装tini初始化系统
RUN apk add --no-cache tini

WORKDIR /app

# 从构建阶段复制必要文件
COPY --from=builder /app/packages/server/dist ./dist
COPY --from=builder /app/packages/server/package.json .
COPY --from=builder /app/node_modules ./node_modules

# 设置环境变量
ENV NODE_ENV production
EXPOSE 3001

# 使用tini作为入口点
ENTRYPOINT ["/sbin/tini", "--"]

# 运行应用
CMD ["node", "dist/index.js"]