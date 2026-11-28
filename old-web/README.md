# simpfun.cn 静态镜像（V4）

- 来源：https://simpfun.cn/
- 应用：简幻欢 - Simpfun • V4（Quasar / Vue SPA，挂载点 `#q-app`）
- 抓取时间：2026-11-28（北京时间）
- 入口：`/assets/index.8d44ebaa.js`、`/assets/index.8a19684e.css`

## 目录结构

```
index.html            # SPA 入口（纯客户端渲染）
favicon.ico
logo.png
assets/               # JS chunk、CSS chunk、字体（woff/woff2）
```

## 已知问题

- **后端接口不在静态包内**：页面接口、登录、WebSocket 指向 `https://api.simpfun.cn`，离线或纯静态托管下这些功能不可用。
- **后端静态图片未纳入**：推荐图、展示图、系统/微信等图片位于 `https://api.simpfun.cn/static/images/...`，由后端提供，未随本包下载。
- **Monaco Editor 部分资源走 CDN**：编辑器依赖 `cdn.jsdelivr.net/npm/monaco-editor` 等外部 CDN，离线环境可能加载不全。
- **无真实 PWA 资源**：线上 `/manifest.json`、`/sw.js`、`/logo.svg` 路径均被 SPA 兜底返回首页 HTML，不存在真实文件，未纳入本包。
- **字体已包含**：`assets/` 下的 woff / woff2 字体已随包下载。
- 本包为前端静态壳镜像，不包含任何后端程序、存档、配置或服务端文件。
