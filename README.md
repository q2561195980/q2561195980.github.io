# Simpfun 静态镜像（构建 af0b66fc）

- 来源：https://simpfun.net/
- buildId：`af0b66fc-2bc2-492d-9e3f-18c5d7c1983c`
- 构建时间：2026-11-26 23:44（北京时间）
- 打包时间：2026-11-27

## 目录结构

```
index.html / 404.html       # SPA 入口与子路由刷新兜底页（纯客户端渲染，data-ssr="false"）
.nojekyll                   # 关闭 GitHub Pages 的 Jekyll 处理
browser-check.js
_nuxt-skew-sw.js
sw.js
favicon.ico
_nuxt/                      # JS chunk、CSS
assets/images/              # 桌面/官网图片、扫雷贴图与音效 wav
assets/logos/              # 浏览器/站点 SVG 与 logo
blockly-media/             # Blockly 媒体资源
```

## 已知问题

- **Minecraft 资源未包含**：`assets/minecraft/` 下的贴图、语言 json、物品组件 json 未随本包部署。
- **字体文件未包含**：`_nuxt/fonts/` 下的 woff2、站点 ttf（含编辑器图标字体）未随本包部署，相关文字/图标可能回退到系统默认字体。
- **部分音效缺失**：扫雷 `tick.wav` / `win.wav` / `lose.wav` 已包含；Blockly 拖拽与终端/编辑器音效（`click.mp3`、`delete.mp3`、`disconnect.mp3`、`drop.mp3` 等）路径由运行时变量拼接，线上未提供对应静态文件，未纳入本包。
- **后端接口不在静态包内**：页面接口、登录、WebSocket 仍指向 simpfun.net，离线或纯静态托管下这些功能不可用。
- **MC 服务端 JSON 不属于前端**：`banned-ips.json`、`ops.json`、`whitelist.json`、`usercache.json` 等是服务端文件，静态镜像不含。
- **少量编辑器图标/语言定义线上 404**：如 `api.ico`、`tmlanguage.json` 等，线上本身即返回 404 兜底页。
- **SPA 子路由刷新**：纯静态托管无服务端重写，子路径刷新靠 `404.html` 兜底，状态码仍可能为 404。
- 本包为前端静态壳镜像，不包含任何后端程序、存档或配置。
