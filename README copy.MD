extension-risk-system/
├── apps/
│   ├── server/         # NestJS 应用
│   └── client/         # React + AntD 应用
├── pnpm-workspace.yaml
├── package.json
├── turbo.json (可选)
├── README.md

<!-- 启动命令 -->
pnpm --filter server start
pnpm --filter client dev
