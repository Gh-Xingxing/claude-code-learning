---
title: 环境变量速查
---

# G. 环境变量速查

> Claude Code 常用的环境变量集中在这。接入第三方平台、配代理、调行为开关时查这页。变量在**启动时读取**，改完要重开 `claude` 才生效；优先级：CLI 标志 > 环境变量 > `settings.json`。

## 接入与认证

| 变量 | 作用 | 补充说明 |
|------|------|---------|
| `ANTHROPIC_API_KEY` | API Key 鉴权 | 官方 Claude 用这个；国产平台大多不认它 |
| `ANTHROPIC_AUTH_TOKEN` | 鉴权令牌（Bearer）| 智谱 GLM、DeepSeek、MiniMax、通义千问等第三方平台基本都要求用这个而非 `API_KEY`，见 [F. 平台接入速查](./platforms) |
| `ANTHROPIC_BASE_URL` | 自定义接口地址 | 接第三方 / 中转站时设置，指向其 Anthropic 格式接口 |
| `ANTHROPIC_MODEL` | 默认模型名 | 可选，指定启动时用的模型 |
| `CLAUDE_CODE_OAUTH_TOKEN` | 长效登录 token | 仅推理用，**不能开启远程控制** |
| `ANTHROPIC_BETAS` | 追加 `anthropic-beta` 头 | 逗号分隔，仅 API Key 用户 |
| `ANTHROPIC_CUSTOM_HEADERS` | 自定义请求头 | `Name: Value` 格式，过代理 / 网关时用 |

## 模型映射（接第三方常用）

接第三方时，Claude Code 内部按 Sonnet/Opus/Haiku「槽位」调度，常需把这些槽位映射到供应商的实际模型，否则切模型或后台小任务可能仍调不存在的官方模型而报错。

| 变量 | 作用 | 补充说明 |
|------|------|---------|
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | Sonnet 槽位映射 | 指向供应商模型 |
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | Opus 槽位映射 | 同上 |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | Haiku 槽位映射（含后台小 / 快任务）| 同上；**取代已废弃的 `ANTHROPIC_SMALL_FAST_MODEL`** |
| `ANTHROPIC_DEFAULT_FABLE_MODEL` | Fable 槽位映射 | 同上 |
| `ANTHROPIC_CUSTOM_MODEL_OPTION` | 给 `/model` 选择器加自定义条目 | 配 `_NAME` / `_DESCRIPTION` 显示 |
| `CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY` | 从网关 `/v1/models` 拉模型列表填充 `/model` | 中转站 / 网关用户 |
| `ANTHROPIC_SMALL_FAST_MODEL` | ⚠️ **已废弃** | 旧的后台小模型变量，改用 `ANTHROPIC_DEFAULT_HAIKU_MODEL` |

## 网络与代理

| 变量 | 作用 | 补充说明 |
|------|------|---------|
| `HTTPS_PROXY` | HTTPS 代理地址 | 官方直连需要时设置（见 [1.1d](/getting-started/network)）|
| `HTTP_PROXY` | HTTP 代理地址 | 同上 |
| `ENABLE_TOOL_SEARCH` | 过代理时启用 MCP 工具搜索 | 配 `ANTHROPIC_BASE_URL` 用 |

## 第三方云后端

| 变量 | 作用 | 补充说明 |
|------|------|---------|
| `CLAUDE_CODE_USE_BEDROCK` | 走 AWS Bedrock | 与远程控制不兼容 |
| `CLAUDE_CODE_USE_VERTEX` | 走 Google Vertex | 与远程控制不兼容 |
| `CLAUDE_CODE_USE_FOUNDRY` | 走 Microsoft Foundry | 与远程控制不兼容 |

## 工具与 Bash 行为

| 变量 | 作用 | 补充说明 |
|------|------|---------|
| `CLAUDE_CODE_USE_POWERSHELL_TOOL` | 让 Claude 用 PowerShell 工具 | Windows 用户设为 `1` |
| `BASH_DEFAULT_TIMEOUT_MS` | Bash 命令默认超时 | 默认 120000 |
| `BASH_MAX_TIMEOUT_MS` | 模型能设的最大 Bash 超时 | 默认 600000 |
| `BASH_MAX_OUTPUT_LENGTH` | Bash 输出超长后转存文件的阈值 | 字符数 |
| `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR` | 每条 Bash/PS 后回到原工作目录 | 设为 `1` |

## 性能、思考与上下文

| 变量 | 作用 | 补充说明 |
|------|------|---------|
| `API_TIMEOUT_MS` | 接口超时（毫秒）| 默认 600000；第三方接口慢时调大，如 MiniMax 模板设 `3000000` |
| `MAX_THINKING_TOKENS` | 扩展思考 token 预算 | 设为 `0` 关闭思考；调大给更多思考空间 |
| `CLAUDE_CODE_EFFORT_LEVEL` | 推理强度 | `low`/`medium`/`high`/`xhigh`/`max`/`auto` |
| `CLAUDE_CODE_DISABLE_THINKING` | 请求里不带 thinking 参数 | 兼容性场景用 |
| `CLAUDE_CODE_AUTO_COMPACT_WINDOW` | 自动压缩的上下文容量（token）| |
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | 自动压缩触发百分比 | 1–100 |
| `CLAUDE_CODE_DISABLE_1M_CONTEXT` | 关闭 1M 上下文支持 | |

## 功能开关

| 变量 | 作用 | 补充说明 |
|------|------|---------|
| `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` | 禁用后台任务 | 设为 `1` 关闭（含 `Ctrl+B`）|
| `CLAUDE_CODE_AUTO_BACKGROUND_TASKS` | 强制开启长任务自动转后台 | |
| `CLAUDE_CODE_TASK_LIST_ID` | 跨会话共享任务列表 | 命名目录 `~/.claude/tasks/<id>` |
| `CLAUDE_CODE_DISABLE_AGENT_VIEW` | 禁用后台 agent / agent view | 设为 `1` |
| `CLAUDE_CODE_DISABLE_WORKFLOWS` | 禁用工作流 | 设为 `1` |
| `CLAUDE_CODE_DISABLE_BUNDLED_SKILLS` | 禁用内置 Skill | 设为 `1` |
| `CLAUDE_CODE_DISABLE_CRON` | 禁用定时任务 | 设为 `1` |
| `CLAUDE_CODE_DISABLE_FAST_MODE` | 禁用快速模式 | |
| `CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING` | 禁用文件检查点（影响 `/rewind`）| |
| `CLAUDE_CODE_DISABLE_ATTACHMENTS` | 禁用附件处理 | |
| `CLAUDE_CODE_DISABLE_ADVISOR_TOOL` | 禁用顾问工具 | |
| `CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION` | 开 / 关提示词建议 | 设为 `false` 关闭灰色建议 |
| `CLAUDE_CODE_DISABLE_AUTO_MEMORY` | 禁用自动记忆 | |
| `CLAUDE_CODE_DISABLE_CLAUDE_MDS` | 不加载任何 CLAUDE.md | |
| `CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS` | 系统提示里去掉内置 git 指引 | |

## 界面与渲染

| 变量 | 作用 | 补充说明 |
|------|------|---------|
| `CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN` | 关全屏渲染，用经典主屏 | 显示错乱时可试 |
| `CLAUDE_CODE_DISABLE_MOUSE` | 全屏下禁用鼠标跟踪 | |
| `CLAUDE_CODE_DISABLE_VIRTUAL_SCROLL` | 关虚拟滚动，整段渲染 | |
| `CLAUDE_CODE_ACCESSIBILITY` | 保留原生光标，便于读屏 | 无障碍场景 |
| `CLAUDE_CODE_DISABLE_TERMINAL_TITLE` | 不自动改终端标题 | |

## 更新、遥测与隐私

| 变量 | 作用 | 补充说明 |
|------|------|---------|
| `DISABLE_AUTOUPDATER` | 关闭自动更新 | 设为 `1`；想固定版本时用 |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | 一键关所有非必要流量 | ⚠️ 会导致远程控制资格检查失败；总开关，含下面几项 |
| `DISABLE_TELEMETRY` | 关闭遥测 | ⚠️ 同样会影响远程控制资格 |
| `DO_NOT_TRACK` | 关闭跟踪（DNT 标准）| |
| `DISABLE_ERROR_REPORTING` | 关闭错误上报 | |
| `DISABLE_FEEDBACK_COMMAND` | 关闭 `/feedback` 反馈 | |
| `CLAUDE_CODE_DISABLE_FEEDBACK_SURVEY` | 关闭会话质量问卷 | |

## 远程控制与调试

| 变量 | 作用 | 补充说明 |
|------|------|---------|
| `CLAUDE_REMOTE_CONTROL_SESSION_NAME_PREFIX` | 远程会话名前缀 | 默认用主机名 |
| `CCR_FORCE_BUNDLE` | `claude --remote` 强制打包上传本地仓库 | 不走 GitHub |
| `CLAUDE_CODE_DEBUG_LOGS_DIR` | 调试日志目录 | 配 `--debug` 用 |
| `CLAUDE_CODE_DEBUG_LOG_LEVEL` | 调试日志级别 | `verbose`/`debug`/`info`/`warn`/`error` |
| `CLAUDECODE` | Claude 启动的子进程里被设为 `1` | 脚本 / hook 里可据此判断是否在 CC 内运行 |

> 设置方法：PowerShell 用 `$env:VAR = "值"`，bash/zsh 用 `export VAR="值"`，CMD 用 `set VAR=值`。各平台具体接入见 [F. 平台接入速查](./platforms)。