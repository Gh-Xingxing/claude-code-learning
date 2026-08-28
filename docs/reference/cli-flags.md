---
title: CLI 参数速查
---

# D. CLI 参数速查

> 这一页列的都是**在终端里**敲的命令和启动标志——也就是你在系统命令行（PowerShell / 终端 / bash）里输入 `claude` 时跟在后面的参数，用来控制 Claude Code 怎么启动。它们和**会话内**输入的 `/` 斜杠命令（见 [C. 斜杠命令速查](./slash-commands)）是两回事：前者决定"怎么把 Claude Code 启动起来"，后者是"启动之后在对话里用"。

## 启动模式

| 命令 / 标志 | 说明 |
|------------|------|
| `claude` | 进入交互式 REPL |
| `claude -p "提示"` | 非交互（批处理）模式，执行后退出 |
| `claude --continue` | 继续上一条会话 |
| `claude --resume` | 交互式选择历史会话恢复 |
| `claude --resume <id>` | 直接恢复指定 ID 的会话 |
| `claude --dangerously-skip-permissions --continue` | 跳过权限检查并继续上一条会话 |
| `claude --dangerously-skip-permissions --resume` | 跳过权限检查并选择历史会话 |

## 模型选择

| 标志 | 值 | 说明 |
|------|-----|------|
| `--model <name>` | 模型 ID 或别名 | 指定模型；可用别名 `sonnet`/`opus`/`haiku`/`fable`（自动取最新版），或完整 ID |
| `--fallback-model <列表>` | 模型名（逗号分隔）| 主模型过载 / 不可用时按序回退 |

**常用模型 ID：**

| 模型 | ID | 别名 |
|------|-----|------|
| Opus 4.8 | `claude-opus-4-8` | `opus` |
| Sonnet 4.6 | `claude-sonnet-4-6` | `sonnet` |
| Haiku 4.5 | `claude-haiku-4-5-20251001` | `haiku` |
| Fable 5 | `claude-fable-5` | `fable` |

## 权限控制

| 标志 | 值 | 说明 |
|------|-----|------|
| `--allowedTools <list>` | 工具名（逗号分隔）| 本次会话自动允许的工具 |
| `--disallowedTools <list>` | 工具名（逗号分隔）| 本次会话禁止的工具 |
| `--permission-mode <mode>` | 见下表 | 指定权限模式（**必须紧跟值**）|
| `--dangerously-skip-permissions` | — | 跳过所有权限检查（仅沙箱用）|

> 提示：`--dangerously-skip-permissions` 可以和 `--continue` / `--resume` 组合使用，需要在**同一条启动命令里**一起写。

**`--permission-mode` 正确用法：**

```bash
claude --permission-mode acceptEdits   # ✅ 正确
claude --permission-mode plan          # ✅ 正确
claude --permission-mode               # ❌ 错误，缺少值
```

**权限模式值：**

| 值 | 调出方式 | 说明 |
|----|---------|------|
| `default` | Shift+Tab 或 CLI | 每次工具调用需确认 |
| `acceptEdits` | Shift+Tab 或 CLI | 自动接受文件编辑 |
| `plan` | Shift+Tab 或 CLI | 只规划，不执行 |
| `dontAsk` | 仅 CLI | 自动接受大多数操作 |
| `bypassPermissions` | 仅 `--dangerously-skip-permissions` | 跳过所有检查（危险）|

## 批处理 / 脚本模式选项

`-p` / `--print` 进入非交互模式后这些才有意义：

| 标志 | 值 | 说明 |
|------|-----|------|
| `--print` / `-p` | 提示 | 非交互执行后退出，输出结果 |
| `--output-format <fmt>` | `text` / `json` / `stream-json` | 输出格式 |
| `--input-format <fmt>` | `text` / `stream-json` | 输入格式 |
| `--max-turns <n>` | 数字 | 最大工具调用轮数 |
| `--max-budget-usd <n>` | 金额 | 花费达到上限就停 |
| `--json-schema <schema>` | JSON Schema | 让输出匹配指定结构 |
| `--bare` | — | 跳过 hooks/skills/插件/MCP/记忆/CLAUDE.md 自动发现，脚本启动更快 |
| `--verbose` | — | 显示详细工具调用日志 |
## 账户相关

| 命令 | 说明 |
|------|------|
| `claude auth login` | 在终端登录 Anthropic 账户（等同会话内 `/login`），浏览器完成授权 |
| `claude auth status` | 查看当前登录状态（账号、套餐、有效期）|
| `claude auth logout` | 清除本机登录凭证 |

> 会话内登录用 `/login`（见 [C. 斜杠命令速查](./slash-commands)）；两者作用相同，可根据不同使用情况和需求自行选用。

## 终端子命令

这些是 `claude` 的子命令（不是启动标志），在终端里直接敲：

| 命令 | 说明 |
|------|------|
| `claude update` | 更新到最新版本 |
| `claude install [版本]` | 安装 / 重装原生二进制，可指定 `2.1.118` / `stable` / `latest` |
| `claude agents` | 打开 agent view，监控 / 派发后台并行会话 |
| `claude attach <id>` | 在当前终端接管某个后台会话 |

> 健康检查在会话内用 `/doctor`（没有 `claude doctor` 子命令）。

## 更多常用标志

| 标志 | 值 | 说明 |
|------|-----|------|
| `--add-dir <路径>` | 目录（可多个）| 启动时添加额外可读写目录 |
| `--worktree <名>` / `-w` | 名称 / `#PR号` | 在隔离的 git worktree 里启动；传 PR 号则拉取该 PR |
| `--tmux` | — | 给 worktree 建 tmux 会话（需配 `-w`）|
| `--name <名称>` / `-n` | 名称 | 给会话起显示名，可用 `--resume <名称>` 恢复 |
| `--session-id <uuid>` | UUID | 指定会话 ID |
| `--fork-session` | — | 恢复时新建会话 ID 而非复用（配 `--resume` / `--continue`）|
| `--from-pr <PR>` | PR 号 / URL | 恢复与某 PR 关联的会话 |
| `--tools <list>` | 工具名 | 限制可用内置工具，`""` 全禁、`"default"` 全开 |
| `--mcp-config <file>` | JSON 文件 / 字符串 | 从文件加载 MCP 服务器 |
| `--strict-mcp-config` | — | 只用 `--mcp-config` 指定的 MCP，忽略其它 |
| `--settings <file>` | JSON 文件 / 内联 JSON | 本次会话覆盖 `settings.json` 对应字段 |
| `--setting-sources <list>` | `user`/`project`/`local` | 指定加载哪些 settings 来源 |
| `--ide` | — | 启动时自动连接唯一可用的 IDE |
| `--chrome` | — | 开启 Chrome 浏览器集成 |
| `--debug [类别]` | 如 `"api,mcp"` | 开调试模式，可按类别过滤 |
| `--safe-mode` | — | 禁用全部自定义（CLAUDE.md/skills/插件/hooks/MCP 等）排查故障（v2.1.169+）|

## 自定义系统提示

| 标志 | 说明 |
|------|------|
| `--append-system-prompt <文本>` | 在默认系统提示后追加内容 |
| `--append-system-prompt-file <file>` | 从文件追加内容到默认提示 |
| `--system-prompt <文本>` | 用自定义文本**替换**整个系统提示 |
| `--system-prompt-file <file>` | 从文件替换整个系统提示 |

> 追加（append）保留 Claude Code 默认的工具指引和安全说明，只补你要的；替换（replace）会丢掉默认提示，需自己负责。两者可组合，但两个 replace 互斥。

## 其他

| 标志 | 说明 |
|------|------|
| `--version` / `-v` | 显示版本号 |
| `--help` / `-h` | 显示帮助信息 |
