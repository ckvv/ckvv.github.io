# 文件库 `/assets/`

卡片显示上传时的原始文件名；旧对象没有原名时显示存储 key。页面首次只请求一页（最多 20 个文件），点击「显示更多文件」才按 R2 游标请求下一页。打开和删除文件仍使用 key。

部署时先更新 `../cloudflare-worker` 的 `GET /r2?view=page` 接口，再发布本站。旧客户端仍可使用不带 `view` 的数组接口。新接口公开原名，上传前请检查名称是否含敏感信息。

本地可启动 Worker 的 `pnpm dev`，然后在本站运行 `PUBLIC_ASSETS_API=http://localhost:8787/r2 pnpm dev`，使用本地存储验证分页浏览和上传。此变量仅覆盖 API；卡片仍链接生产资源域名。
