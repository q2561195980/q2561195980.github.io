# 镜像上传指南（old-web/）

> 目标仓库：`q2561195980/q2561195980.github.io`，分支 `main`，目录 `old-web/`
> 镜像来源：https://simpfun.cn/ （简幻欢 • V4，Quasar/Vue SPA）
> 打包产物：`simpfun-cn-v4-mirror.tar.gz`（135 文件，压缩 1.7M / 解压 4.6M）

## 为什么没有直接从云端推送

- 当前云端会话环境没有 GitHub 登录凭据（gh 未登录、无 token、无 SSH）。
- GitHub 连接器只能把文件内容逐个内联成文本提交，不支持按目录或压缩包推送；实测二进制（字体/图标/图片）经文本通道会损坏。
- 镜像含 5 个大于 100K 的核心 JS/CSS（最大 1.67M），内联不可靠。
- 因此整包需在已登录 GitHub 的本地环境用 git 推送。

## 本地推送步骤

1. 下载镜像包并解压。
2. 克隆仓库：

```bash
git clone https://github.com/q2561195980/q2561195980.github.io.git
cd q2561195980.github.io
```

3. 把解压出的镜像内容放到 `old-web/` 下，确保结构为：

```
old-web/
├── index.html
├── favicon.ico
├── logo.png
├── API.md
└── assets/...
```

4. 提交并推送：

```bash
git add old-web
git commit -m "add simpfun.cn V4 mirror under old-web"
git push
```

## 路径适配（放到子目录后必改）

`index.html` 原始资源引用是根目录绝对路径，放到 `old-web/` 子目录后会指向仓库根（与旧站冲突），需改为相对路径：

- `href="/logo.png"` → `href="./logo.png"`
- `src="/assets/index.8d44ebaa.js"` → `src="./assets/index.8d44ebaa.js"`
- `href="/assets/index.8a19684e.css"` → `href="./assets/index.8a19684e.css"`
- 同时检查 JS/CSS 内部硬编码的 `/assets/` 绝对引用，按需改为 `./assets/` 或 `/old-web/assets/`。

## 文件清单

- 文本 125 个：JS 94、CSS 27、HTML 1、MD 2、`.nojekyll` 1
- 二进制 10 个（本次先跳过，需随本地 git 补传）：
  - `favicon.ico`、`logo.png`
  - `assets/flUhRq6tzZclQEJ-Vdg-IuiaDsNa.fd84f88b.woff`
  - `assets/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.4a4dbc62.woff2`
  - `assets/KFOkCnqEu92Fr1MmgVxIIzQ.34e9582c.woff`
  - `assets/KFOlCnqEu92Fr1MmEU9fBBc-.9ce7f3ac.woff`
  - `assets/KFOlCnqEu92Fr1MmSU5fBBc-.bf14c7d7.woff`
  - `assets/KFOlCnqEu92Fr1MmWUlfBBc-.e0fd57c0.woff`
  - `assets/KFOlCnqEu92Fr1MmYUtfBBc-.f6537e32.woff`
  - `assets/KFOmCnqEu92Fr1Mu4mxM.f2abf7fb.woff`

## 已知限制

- 后端接口指向 `https://api.simpfun.cn`，纯静态托管下登录/控制台/下单等功能不可用。
- 后端静态图、Monaco CDN 资源未纳入本包。
