---
title: 斜杠命令速查
---

# C. 斜杠命令速查

> 在输入框打 `/` 会列出当前可用的全部命令（含内置命令、Skill、插件和 MCP 贡献的命令）。**部分命令依平台 / 订阅 / 版本而定，不一定每个人都可见**（例如 `/desktop` 仅 macOS/Windows 且登录订阅时显示，`/upgrade` 仅 Pro/Max）。标了 Skill / 工作流的，是内置可调用的封装能力。

## 会话管理

| 命令 | 参数 | 说明 |
|------|------|------|
| `/clear` | `[名称]` | 清空上下文开新会话，旧会话仍可 `/resume`（别名 `/reset`、`/new`）|
| `/compact` | `[指令]` | 压缩上下文，可指定保留重点 |
| `/context` | `[all]` | 查看上下文窗口占用；`all` 展开逐项明细 |
| `/resume` | `[会话]` | 按 ID / 名称恢复，或打开选择器（别名 `/continue`）|
| `/rewind` | — | 倒回到检查点，恢复代码 / 对话（别名 `/checkpoint`、`/undo`）|
| `/branch` | `[名称]` | 在当前点分叉对话，试新方向又不丢原对话 |
| `/recap` | — | 生成当前会话的一句话摘要 |
| `/rename` | `[名称]` | 重命名当前会话 |
| `/export` | `[文件名]` | 导出当前对话为纯文本 |
| `/copy` | `[N]` | 复制上一条（或倒数第 N 条）回复 |
| `/cost` | — | 显示会话费用（别名 `/usage`）|
| `/usage` | — | 用量、套餐额度、活动统计（别名 `/cost`、`/stats`）|
| `/exit` | — | 退出 Claude Code（别名 `/quit`）|

## 模式与推理

| 命令 | 参数 | 说明 |
|------|------|------|
| `/model` | `[模型名]` | 切换模型并存为默认（不带参数打开选择器）|
| `/effort` | `[级别\|auto]` | 推理强度：`low`/`medium`/`high`/`xhigh`/`max`/`ultracode`（`max`、`ultracode` 仅当前会话）|
| `/plan` | `[描述]` | 进入 plan 模式（只规划不执行）|
| `/fast` | `[on\|off]` | 开关快速模式 |
| `/goal` | `[条件\|clear]` | 设定目标，Claude 跨轮持续做到满足为止 |
| `/advisor` | `[model\|off]` | 顾问模式，关键节点咨询第二个模型 |

> 扩展思考用快捷键 `Alt+T` 开启，或在提示里写"请深入思考"。`/think` **不是**内置命令。

## 项目与配置

| 命令 | 参数 | 说明 |
|------|------|------|
| `/init` | — | 在项目中生成 CLAUDE.md |
| `/config` | — | 打开配置界面（别名 `/settings`）；Vim 键位模式也在这里开（Editor mode）|
| `/memory` | — | 编辑 CLAUDE.md 记忆 / 开关自动记忆 |
| `/add-dir` | `<路径>` | 给当前会话添加额外工作目录 |
| `/cd` | `<路径>` | 把会话移到新工作目录（v2.1.169+）|
| `/permissions` | — | 查看 / 编辑权限规则（别名 `/allowed-tools`）|
| `/theme` | — | 切换配色主题 |
| `/statusline` | — | 配置状态栏显示 |
| `/keybindings` | — | 编辑键位配置文件 |
| `/sandbox` | — | 开关沙箱模式（受支持平台）|
| `/tui` | `[default\|fullscreen]` | 切换终端 UI 渲染器 |
| `/focus` | — | 聚焦视图，只看最后一问一答（仅全屏）|
| `/scroll-speed` | — | 调鼠标滚轮速度（仅全屏）|

## 子 Agent 与并行

| 命令 | 参数 | 说明 |
|------|------|------|
| `/agents` | — | 管理可委派的子 agent |
| `/tasks` | — | 管理后台运行的一切（别名 `/bashes`）|
| `/background` | `[提示]` | 把会话转为后台 agent，释放终端（别名 `/bg`）|
| `/fork` | `<指令>` | 派一个后台子 agent，继承完整对话去做某事 |
| `/batch` | `<指令>` | 跨库大改拆成 5–30 个独立单元各自在 worktree 并行（需 git）|
| `/stop` | — | 停止当前后台会话 |

## 远程与跨设备

| 命令 | 参数 | 说明 |
|------|------|------|
| `/remote-control`（`/rc`）| `[名称]` | 开启远程控制，用手机 / 浏览器接管会话（见 [3.14 →](/advanced/remote-control)）|
| `/mobile` | — | 显示手机 App 下载二维码（别名 `/ios`、`/android`）|
| `/desktop` | — | 在桌面应用里继续当前会话（别名 `/app`）|
| `/teleport`（`/tp`）| — | 把网页版会话拉进当前终端 |
| `/btw` | `<问题>` | 临时侧边提问，不写入对话历史 |
| `/remote-env` | — | 选择云端 agent 的默认环境 |
| `/web-setup` | — | 用本地 `gh` 凭证把 GitHub 连到网页版 |

## 代码审查与开发（Skill / 工作流）

| 命令 | 参数 | 说明 |
|------|------|------|
| `/review` | `[PR]` | 在当前会话本地审查 PR |
| `/code-review` | `[级别] [--fix] [--comment] [目标]` | 审查当前 diff（级别 low→ultra；`ultra` 为云端深审）|
| `/simplify` | `[目标]` | 只做清理式审查并应用修复，不找 bug |
| `/security-review` | — | 扫当前分支变更的安全漏洞 |
| `/debug` | `[描述]` | 开调试日志并排查问题（Skill）|
| `/diff` | — | 交互式查看未提交改动 + 每轮 diff |
| `/verify` | — | 跑起应用，验证改动是否真的生效 |
| `/run` | — | 启动并驱动项目应用 |
| `/deep-research` | `<问题>` | 联网搜索、交叉核对、产出带引用的报告 |
| `/autofix-pr` | `[提示]` | 云端盯当前分支 PR，CI 挂 / 有评论时自动推修复 |
| `/install-github-app` | — | 安装 GitHub Actions 审查应用 |
| `/install-slack-app` | — | 安装 Claude Slack 应用 |
| `/claude-api` | `[migrate\|...]` | 加载 Claude API 参考资料 / 迁移既有 API 代码 |

## 诊断与反馈

| 命令 | 参数 | 说明 |
|------|------|------|
| `/doctor` | — | 检查安装与配置，按 `f` 让 Claude 自动修 |
| `/status` | — | 显示版本、模型、账户、连接状态 |
| `/feedback` | `[报告]` | 反馈 / 报 bug / 分享对话（别名 `/bug`、`/share`）|
| `/help` | — | 显示帮助 |
| `/release-notes` | — | 查看版本更新日志 |
| `/insights` | — | 分析你的会话，生成模式与卡点报告 |
| `/team-onboarding` | — | 据使用历史生成团队上手指南 |
| `/privacy-settings` | — | 隐私设置（Pro/Max）|
| `/heapdump` | — | 写堆快照诊断内存占用 |

## IDE 与终端

| 命令 | 参数 | 说明 |
|------|------|------|
| `/ide` | — | 连接 VS Code / JetBrains 扩展 |
| `/terminal-setup` | — | 配置 Shift/Option+Enter 换行 |
| `/voice` | `[hold\|tap\|off]` | 语音听写设置 |
| `/chrome` | — | Claude in Chrome 浏览器集成设置 |

> 旧 `/vim` 命令已于 v2.1.92 移除，Vim 键位改在 `/config` → Editor mode 切换，见 [B. Vim 模式](./vim-mode)。

## 账户与计费

| 命令 | 参数 | 说明 |
|------|------|------|
| `/login` | — | 通过浏览器登录 Anthropic 账户 |
| `/logout` | — | 退出当前账户 |
| `/upgrade` | — | 打开升级页切换更高套餐 |
| `/usage-credits` | — | 配置用量额度，超限后继续用（原 `/extra-usage`）|
| `/passes` | — | 分享一周免费 Claude Code（账户合格才显示）|

## 自动化与扩展

| 命令 | 参数 | 说明 |
|------|------|------|
| `/hooks` | — | 查看 / 配置 Hooks |
| `/mcp` | `[reconnect\|enable\|disable ...]` | 管理 MCP 连接与 OAuth |
| `/skills` | — | 列出可用 Skill，按 `t` 按 token 排序 |
| `/plugin` | `[子命令]` | 管理插件（`list`/`install`/`enable`/`disable`）|
| `/reload-skills` | — | 重扫 skill / 命令目录，免重启（v2.1.152+）|
| `/reload-plugins` | `[--force]` | 重载插件以应用改动 |
| `/loop` | `[间隔] [提示]` | 按间隔重复跑提示，省略间隔则自定节奏（别名 `/proactive`）|
| `/schedule` | `[描述]` | 创建 / 管理云端定时任务（别名 `/routines`）|
| `/powerup` | — | 通过互动小课了解功能 |

## 云端规划与深审

| 命令 | 参数 | 说明 |
|------|------|------|
| `/ultraplan` | `<提示>` | 云端起草计划，浏览器查看后远程执行或回传终端 |
| `/ultrareview` | `[PR]` | 云端多 agent 深度审查（现推荐用 `/code-review ultra`）|

## 趣味与杂项

| 命令 | 参数 | 说明 |
|------|------|------|
| `/color` | `[颜色\|default]` | 设置提示栏颜色 |
| `/radio` | — | 打开 Claude FM lo-fi 电台 |
| `/stickers` | — | 订购 Claude Code 贴纸 |

> 仅特定环境可见：`/setup-bedrock`、`/setup-vertex`（分别设了 `CLAUDE_CODE_USE_BEDROCK` / `CLAUDE_CODE_USE_VERTEX` 时）。

## MCP CLI 速查（终端中执行）

| 命令 | 说明 |
|------|------|
| `claude mcp list` | 查看所有 MCP 及连接状态 |
| `claude mcp add -s user playwright -- npx @playwright/mcp@latest` | 全局添加 Playwright MCP |
| `claude mcp get playwright` | 查看 Playwright MCP 详情 |
| `claude mcp remove playwright -s user` | 删除全局 Playwright MCP |

## 自定义命令创建

在 `.claude/commands/<命令名>.md` 中写入提示模板，`$ARGUMENTS` 接收参数：

```
.claude/commands/
├── commit.md        →  /commit
├── review-pr.md     →  /review-pr
└── daily.md         →  /daily
```

> 更强的可分发形式是 Skill（`.claude/skills/<名>/SKILL.md`），见 [3.9 Skills 专题](/advanced/skills)。
