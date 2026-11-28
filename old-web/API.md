# simpfun.cn V4 后端接口说明

> 来源：前端静态包逆向（`assets/Client.825f18dc.js` 等）。方法、路径、函数名、入参字段取自源码；个别动态字段以后端实际返回为准。

## 一、概览

| 项 | 说明 |
|---|---|
| Base URL | `https://api.simpfun.cn` |
| 客户端 | 自封装 `fetch`（chunk 内打包 axios 适配层） |
| 鉴权 | `localStorage.token` → 请求头 `Authorization: <token>`，**裸 token，无 Bearer 前缀** |
| 请求头 | `Content-Type: application/x-www-form-urlencoded`、`accept: application/json` |
| 参数编码 | `key=encodeURIComponent(value)&...`；GET 拼到 query，其余方法放 `body` |
| 响应 | JSON `{code, msg, data?}`；空响应/非 JSON 包装成 `{code, msg}`；网络异常返回 `code:500` |

## 二、URL 通用结构

```
https://api.simpfun.cn  /api  /ins/{id}  /file  /list
└────── 域名（后端服务器）┘ └前缀┘ └─ 资源对象 ─┘ └子资源┘ └动作┘
```

- **`/api`**：接口前缀，后面都是后端接口，不是网页。
- **资源对象**：业务实体，如 `ins`（实例）、`dev`（开发者包）、`ticket`（工单）。
- **`{id}`**：动态编号，代表"哪一个"实例 / 整合包 / 工单，如 `/api/ins/123` 是编号 123 的服务器。
- **子资源**：对象下的附属功能，如实例下的 `file`（文件）、`backup`（备份）、`traffic`（流量）。
- **动作词**：`list`（列表）、`create`（创建）、`delete`（删除）等。

### HTTP 方法习惯（非严格 RESTful）

| 方法 | 含义 | 典型用途 |
|---|---|---|
| GET | 取数据 | 查列表、详情、状态 |
| POST | 创建或触发动作 | 新建、开机、提交、发指令 |
| PUT | 整体更新 / 替换 | 保存配置、购买、设为主端口 |
| PATCH | 局部更新 | 改某一项设置、重置流量 |
| DELETE | 删除 | 删备份、删版本、结束工单 |

> 这套接口很多"动作"也用 POST，不按方法严格区分语义。

## 三、接口清单

### 1. 认证 / 账号

| 方法 | 路径 | 封装函数 | 入参 | 含义 |
|---|---|---|---|---|
| POST | `/api/auth/login` | login | username, passwd | 登录，成功后写入 `localStorage.token` |
| POST | `/api/auth/register` | register | username, passwd, invite_code | 注册 |
| GET | `/api/auth/info` | getUserInfo | — | 当前用户信息 |
| POST | `/api/auth/logout` | logout | — | 登出 |
| POST | `/api/bindqq` | bindqq | qq | 绑定 QQ |
| POST | `/api/bindpd` | bindpd | id | 绑定第三方账号 |
| GET | `/api/invite` | showInviteInfo | — | 邀请码 / 邀请奖励信息 |
| POST | `/api/user/point` | get | — | 当前积分 |
| GET | `/api/pointhistory` | showPointHistory | — | 积分历史 |
| GET | `/api/diamondhistory` | showDiamondHistory | — | 钻石历史 |
| GET | `/api/announcement` | getAnnouncements | — | 公告列表 |
| POST | `/api/announcement_read` | announcement_read | — | 标记公告已读 |

### 2. 充值 / 支付

| 方法 | 路径 | 封装函数 | 入参 | 含义 |
|---|---|---|---|---|
| POST | `/api/recharge` | recharge | point, method, recharge_mode? | 发起充值 |
| PUT | `/api/recharge` | check_recharge | order_id | 核对充值订单 |
| GET | `/api/pay/web/meta` | getWebPayMeta | — | 支付所需元信息 |
| GET | `/api/pay/web/status` | queryWebPayStatus | order_id | 支付状态查询 |
| POST | `/api/pay/web/create` | 内联 | 支付参数 | 创建网页支付单 |

### 3. 商店 / 游戏

> shop 服务于"开服选套餐"流程：`list` 拉套餐，`confirmation` 下单前确认资格与价格；真正开通走 `ins/create`。

| 方法 | 路径 | 封装函数 | 入参 | 含义 |
|---|---|---|---|---|
| GET | `/api/shop/list` | getList | version_id, ins_id?, custom? | 可选套餐列表（价格 point、磁盘 disk、流量 traffic、线路、图标、解锁状态） |
| GET | `/api/shop/confirmation` | getConfirmation | version_id, item_id, ins_id?, custom? | 选定套餐后的购买确认（价格 / 库存 / 资格校验） |
| GET | `/api/games/list` | getList | — | 游戏列表 |
| GET | `/api/games/list?custom=true` | getCustomGameList | — | 自定义游戏列表 |
| GET | `/api/games/versionlist` | getVersionList | kind_id | 游戏版本列表 |
| GET | `/api/games/kindlist` | getKindList | game_id | 游戏分类列表 |
| GET | `/api/games/customlist` | getCustomList | game_id, from_version_id | 自定义版本列表 |
| GET | `/api/games/custom_versionlist` | getCustomVersionList | kind_id | 自定义版本号列表 |

### 4. 实例列表 / 创建

| 方法 | 路径 | 封装函数 | 入参 | 含义 |
|---|---|---|---|---|
| GET | `/api/ins/list` | getList | — | 我的实例列表 |
| POST | `/api/ins/create` | create | item_id/item, version_id, custom? | 创建 / 开通实例（真正下单） |
| POST | `/api/server` | getPublicServer | — | 公共服务器信息 |

### 5. 实例操作 `/api/ins/{id}/...`

#### 基础信息

| 方法 | 路径 | 封装函数 | 入参 | 含义 |
|---|---|---|---|---|
| GET | `/detail` | getDetail | — | 实例详情 |
| GET | `/power` | power | action=start\|stop\|restart | 电源：启动 / 停止 / 重启 |
| GET | `/stat` | get_stat | — | 性能统计 |
| GET | `/properties` | getProperties | — | 配置属性 |
| GET | `/translator` | getTranslator | — | 翻译功能 |
| GET | `/sftp` | getSFTP | — | SFTP 连接信息 |
| POST | `/sftp` | resetSFTP | — | 重置 SFTP |
| GET | `/ws` | getWebSocket | — | 获取 WebSocket 通道地址与临时令牌 |
| POST | `/state` | getState | — | 运行状态 |
| POST | `/stats` | stats | — | 状态统计上报 / 查询 |
| POST | `/delete` | destroy | — | 删除实例 |
| POST | `/rename` | rename | name | 重命名 |
| POST | `/change` | change | — | 更换版本 / 配置 |
| POST | `/reinstall` | — | version_id, diff, save, custom? | 重装服务端 |
| POST | `/activate` | activate | — | 激活实例 |
| POST | `/rating` | ratingSubmit | — | 评分提交 |
| POST | `/toolbox` | toolBox | — | 工具箱操作 |
| GET | `/onekeycommand` | getOneKeyCommand | — | 一键命令 |

#### 流量 traffic

| 方法 | 路径 | 封装函数 | 入参 | 含义 |
|---|---|---|---|---|
| POST | `/traffic` | resetTraffic | — | 重置流量 |
| PATCH | `/traffic` | manual_resetTraffic | — | 手动重置流量 |
| PATCH | `/traffic` | auto_resetTraffic | — | 自动重置流量 |
| PATCH | `/traffic` | enableMoreTraffic | — | 开启额外流量 |
| PATCH | `/traffic` | disableMoreTraffic | — | 关闭额外流量 |
| PATCH | `/traffic` | setTrafficResetCD | — | 设置重置冷却时间 |
| PUT | `/traffic` | buyTraffic | traffic | 购买流量 |

#### 任务 / 定时

| 方法 | 路径 | 封装函数 | 入参 | 含义 |
|---|---|---|---|---|
| GET | `/tasks` | getTasks | — | 后台任务列表 |
| POST | `/tasks` | cancelTask | — | 取消任务 |
| PUT | `/tasks` | speedupTask | — | 加速任务 |
| GET | `/delaysend` | getScheduledTasks | — | 定时任务列表 |
| DELETE | `/delaysend` | deleteScheduledTask | scheduler_id | 删除定时任务 |

#### 客服 / 钻石方案 / AI 分析

| 方法 | 路径 | 封装函数 | 入参 | 含义 |
|---|---|---|---|---|
| GET | `/support` | getSupportInfo | — | 技术支持信息 |
| POST | `/support` | createTechSupport | feedback | 提交反馈 / 工单 |
| DELETE | `/support` | end_techSupport | feedback | 结束支持 |
| GET | `/diamond_plan` | get_diamondPlan | — | 钻石套餐方案 |
| POST | `/diamond_plan` | post_diamond_plan | — | 提交钻石方案 |
| GET | `/ai_analyze` | GetQuota / GetHistoryList / GetHistory | quota=true 或 id | AI 配额 / 历史列表 / 历史详情 |
| POST | `/ai_analyze` | SendQuestion / SendLog / SendFileLog | type=answer\|file_log, supplement, log_fault_type… | AI 故障分析 |

#### 文件 file

| 方法 | 路径 | 封装函数 | 入参 | 含义 |
|---|---|---|---|---|
| GET | `/file/list` | getList | path | 列目录 |
| GET | `/file/fetch` | fetch | path | 读取文件内容 |
| GET | `/file/download` | getDownloadLink | path | 下载链接 |
| GET | `/file/upload` | getUploadLink | — | 获取上传链接 |
| POST | `/file/upload` | Hn.request | multipart 表单 | 上传文件（独立 axios 实例，带进度回调） |
| POST | `/file/create` | create | mode, root, name | 新建文件 / 文件夹 |
| POST | `/file/paste` | paste | list(JSON 串), target | 粘贴 |
| POST | `/file/copy` | copy | — | 复制 |
| POST | `/file/delete` | delete | list(JSON 串) | 删除 |
| POST | `/file/rename` | rename | — | 重命名 |
| POST | `/file/save` | save | — | 保存文件 |
| POST | `/file/archive` | archive | root, files(JSON 串), format | 打包压缩 |
| POST | `/file/unarchive` | unarchive | root, file | 解压 |

#### 备份 / 回滚

| 方法 | 路径 | 封装函数 | 入参 | 含义 |
|---|---|---|---|---|
| GET | `/backup` | get | — | 备份列表 |
| POST | `/backup` | create | tag | 新建备份 |
| PATCH | `/backup` | restore | — | 恢复备份 |
| DELETE | `/backup` | remove | backup_id | 删除备份 |
| PUT | `/backup` | rename | — | 备份重命名 |
| GET | `/rollback` | get | — | 可回滚版本 |
| POST | `/rollback` | rollback | — | 执行回滚 |

#### 配置 / 关联 / 公开

| 方法 | 路径 | 封装函数 | 入参 | 含义 |
|---|---|---|---|---|
| PUT | `/app` | set | version | 设置服务端 / 应用版本 |
| POST | `/allocation` | add | — | 新增端口分配 |
| PUT | `/allocation` | setPrimary | port_id | 设为主端口 |
| POST | `/relationship` | fetch | — | 拉取关联关系 |
| PUT | `/relationship/add` | add | — | 添加关联 |
| PUT | `/relationship/delete` | delete | uuid | 删除关联 |
| POST | `/publicize` | getPublicizeInfo | — | 获取公开设置 |
| PUT | `/publicize` | setPublicizeInfo | — | 更新公开设置 |

### 6. 开发者整合包 `/api/dev/...`

| 方法 | 路径 | 封装函数 | 含义 |
|---|---|---|---|
| GET | `/list` | getList | 整合包列表 |
| GET | `/support/list` | getSupportList | 支持分组列表 |
| GET | `/backup` | getBackup | 从现有实例备份（all, is_windows） |
| POST | `/create` | createModPack | 新建整合包 |
| GET | `/{id}/detail` | getModPack | 包详情 |
| POST | `/{id}/detail` | editModPack | 编辑整合包 |
| POST | `/{id}/delete` | deleteModPack | 删除整合包 |
| GET | `/{id}/version` | getModPackVersion | 版本列表 |
| POST | `/{id}/version` | createModPackVersion | 新增版本 |
| PATCH | `/{id}/version` | editModPackVersion | 编辑版本 |
| DELETE | `/{id}/version` | deleteModPackVersion | 删除版本 |
| GET | `/{id}/feedback` | getFeedback | 反馈列表 |

### 7. 工单 `/api/ticket`

| 方法 | 路径 | 封装函数 | 入参 | 含义 |
|---|---|---|---|---|
| POST | `/` | fetchList | — | 工单列表 |
| PUT | `/` | create | title, content, ins_id | 提交新工单 |
| POST | `/{id}` | fetch | — | 工单详情 |
| POST | `/{id}/reply` | reply | — | 回复工单 |
| POST | `/{id}/close` | close | — | 关闭工单 |

## 四、WebSocket（实例控制台 / 终端）

1. HTTP 先取通道：`GET /api/ins/{id}/ws` → `{ data: { socket, token } }`
2. `new WebSocket(data.socket)`，地址由后端下发
3. **鉴权走消息体，不走握手头**：`onopen` 后发送
   ```json
   {"event":"auth","args":["<data.token>"]}
   ```
4. `onmessage` 收帧分发处理

## 五、URL 词汇对照

- **auth** authentication 认证：login 登录 · register 注册 · logout 登出 · info 信息
- **point** 积分 · **diamond** 钻石（充值货币）· **invite** 邀请
- **recharge** 充值 · **pay** 支付 · **meta** 元信息 · **status** 状态
- **shop** 商店 / 套餐 · **item_id** 物品 ID · **confirmation** 购买确认
- **ins** instance 服务器实例 · **detail** 详情 · **power** 电源 · **properties** 配置属性
- **traffic** 流量 · **backup** 备份 · **restore** 恢复 · **rollback** 回滚
- **file** 文件：list 列目录 · fetch 读取 · download 下载 · upload 上传 · archive 打包 · unarchive 解压
- **allocation** 端口分配 · **relationship** 关联关系 · **publicize** 公开
- **dev** developer 开发者整合包 · **version** 版本 · **feedback** 反馈
- **ticket** 工单 · **reply** 回复 · **close** 关闭

## 六、curl 示例

> 令牌从浏览器 `localStorage.token` 获取，直接放 `Authorization` 头，不加 `Bearer `。

查询商店套餐列表：

```bash
curl -G 'https://api.simpfun.cn/api/shop/list' \
  -H 'accept: application/json' \
  -H 'Authorization: <token>' \
  --data-urlencode 'version_id=1'
```

启动实例 12：

```bash
curl -G 'https://api.simpfun.cn/api/ins/12/power' \
  -H 'accept: application/json' \
  -H 'Authorization: <token>' \
  --data-urlencode 'action=start'
```

提交工单：

```bash
curl -X PUT 'https://api.simpfun.cn/api/ticket' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'Authorization: <token>' \
  --data-urlencode 'title=面板打不开' \
  --data-urlencode 'content=进入实例后面板一直加载不出来' \
  --data-urlencode 'ins_id=12'
```

## 七、易混淆点

- **`stat` vs `stats`**：`stat` 偏实例性能统计；`stats` 是另一个状态上报 / 查询动作，具体字段以后端返回为准。
- **`dev` 不是开发环境**：指"开发者上传的整合包"模块，和 `ins`（正在运行的服务器实例）是两套东西。
- **`shop` 不扣款不开服**：只列套餐和确认资格；真正创建实例走 `POST /api/ins/create`。
