# old-web

simpfun.cn（简幻欢 • V4）前端静态镜像归档目录。

## 当前状态

镜像尚未完整上传。云端环境无 GitHub 凭据，连接器仅支持文本内联提交、无法无损承载整包（含 5 个 >100K 的核心 JS/CSS 和 10 个二进制字体/图标）。

整包需在已登录 GitHub 的本地环境用 git 推送至本目录，结构应为：

```
old-web/
├── index.html
├── favicon.ico
├── logo.png
├── API.md
└── assets/...
```

## 注意

- 入口 HTML 使用根目录绝对路径 `/assets/`、`/logo.png`，放到本子目录后需改为相对路径 `./assets/`、`./logo.png`。
- 二进制（7 woff/woff2、logo.png、favicon.ico）须经 git 通道补传，勿走文本内联通道（会损坏）。
- 后端接口指向 `https://api.simpfun.cn`，纯静态托管下登录、控制台、下单等功能不可用。
