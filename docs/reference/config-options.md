---
title: 配置选项速查
---

# E. 配置选项速查

`settings.json` 用来配置 Claude Code 的默认行为。

## 文件位置与优先级

同一个字段在多处定义时，**上面的覆盖下面的**：

| 优先级 | 位置 | 用途 |
|--------|------|------|
| 最高 | 企业 / 托管设置（managed） | 管理员统一下发，用户改不了 |
| ↑ | 命令行参数 | 本次启动临时覆盖 |
| ↑ | `.claude/settings.local.json` | 个人本地（应 gitignore，不提交）|
| ↑ | `.claude/settings.json` | 项目级（随项目提交，团队共享）|
| 最低 | `~/.claude/settings.json` | 用户级（对你所有项目生效）|

## 常用顶层字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `model` | string | 默认模型 ID，如 `"claude-sonnet-4-6"` |
| `permissions` | object | 工具权限规则（见下）→ 概念见 [2.4 权限系统](/basics/permissions) |
| `hooks` | object | 生命周期钩子（见下）→ 入门 [2.9 Hooks](/basics/hooks)、进阶 [3.4 Hooks 自动化](/advanced/hooks-automation) |
| `mcpServers` | object | MCP 服务器配置（见下）→ 概念 [2.12 MCP](/basics/mcp-servers)、实战 [3.7 MCP 实战](/advanced/mcp-in-practice) |
| `env` | object | 注入到所有会话和子进程的环境变量 → 清单见 [G. 环境变量速查](./env-vars) |

## 模型与推理

| 字段 | 说明 |
|------|------|
| `fallbackModel` | 主模型不可用时回退的模型 |
| `availableModels` | 限制用户可选的模型范围 |
| `modelOverrides` | 把官方模型 ID 映射到供应商模型 ID（接第三方时有用）|
| `effortLevel` | 跨会话固定推理强度：`"low"`/`"medium"`/`"high"`/`"xhigh"` |
| `alwaysThinkingEnabled` | 所有会话默认开启扩展思考 |
| `showThinkingSummaries` | 交互会话里显示思考摘要 |
| `advisorModel` | 顾问工具用的模型（别名或完整 ID）|

## 行为与功能

| 字段 | 说明 |
|------|------|
| `outputStyle` | 回答风格，如 `"Explanatory"`（更啰嗦地解释）|
| `language` | 偏好的回答语言，如 `"chinese"` |
| `defaultShell` | 输入框命令的默认 shell：`"bash"` 或 `"powershell"`（Windows 常用）|
| `autoMemoryEnabled` | 是否开启自动记忆，默认 `true`（见 [2.8 记忆系统](/basics/memory-system)）|
| `cleanupPeriodDays` | 自动清理多少天前的会话记录，默认 30 |
| `autoUpdatesChannel` | 更新通道：`"stable"`（稳定）或 `"latest"`（最新，默认）|
| `includeGitInstructions` | 系统提示里是否带内置 git 指引，默认 `true` |
| `attribution` | 自定义 git 提交 / PR 的署名（旧字段 `includeCoAuthoredBy` 已废弃）|
| `respectGitignore` | `@` 文件选择器是否遵守 `.gitignore`，默认 `true` |
| `plansDirectory` | plan 文件存放目录，默认 `~/.claude/plans` |
| `editorMode` | 输入框键位：`"normal"` 或 `"vim"`（见 [B. Vim 模式](./vim-mode)）|
| `forceLoginMethod` | 限制登录方式：`"claudeai"`（订阅账号）或 `"console"`（API）|
| `enableAllProjectMcpServers` | 自动批准项目 `.mcp.json` 里的所有 MCP 服务器 |
| `skillOverrides` | 单个 Skill 的可见性：`"on"` / `"name-only"` / `"user-invocable-only"` / `"off"` |
| `disableAllHooks` | 一键禁用所有 hooks 和自定义状态栏 |
| `disableWorkflows` / `disableBundledSkills` / `disableAgentView` | 分别关闭工作流 / 内置 Skill / 后台 agent |
| `disableRemoteControl` | 禁用远程控制功能 |
| `statusLine` | 自定义状态栏显示内容的脚本 |
| `apiKeyHelper` | 自定义生成 API 鉴权令牌的脚本（高级用法）|

## 界面与体验

| 字段 | 说明 |
|------|------|
| `autoScrollEnabled` | 全屏渲染时自动跟随新输出到底部，默认 `true` |
| `showTurnDuration` | 回答后显示本轮耗时，默认 `true` |
| `spinnerTipsEnabled` | 等待时在转圈处显示小贴士，默认 `true` |
| `prefersReducedMotion` | 减少 / 关闭界面动画（无障碍）|
| `preferredNotifChannel` | 通知方式：`"auto"` / `"terminal_bell"` / `"iterm2"` 等 |

## permissions 字段

```json
{
  "permissions": {
    "allow": ["自动允许的工具或匹配模式"],
    "ask":   ["每次都问一下的工具"],
    "deny":  ["永远禁止的工具或匹配模式"]
  }
}
```

- `allow`：命中的操作自动放行，不弹确认
- `ask`：命中的操作每次都要你确认（即使在自动模式下）
- `deny`：命中的操作直接拒绝

**工具名与匹配模式：**

| 写法 | 含义 |
|--------|------|
| `Bash` | 所有 shell 命令 |
| `Bash(git *)` | 只匹配 git 命令 |
| `Read` / `Edit` / `Write` | 读 / 改 / 写文件 |
| `Read(./.env*)` | 匹配特定路径（可放进 `deny` 保护密钥）|
| `WebFetch` / `WebSearch` | 抓网页 / 网络搜索 |

> 权限模式（default / acceptEdits / plan 等）和这些规则怎么配合，见 [2.4 权限系统](/basics/permissions)。

## hooks 字段

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash|Edit|Write",
        "hooks": [
          { "type": "command", "command": "shell 命令" }
        ]
      }
    ],
    "PostToolUse": []
  }
}
```

**常用 Hook 事件**（按生命周期分组）：

| 分组 | 事件 | 触发时机 |
|------|------|---------|
| 会话 | `SessionStart` | 会话开始 / 恢复时 |
| 会话 | `SessionEnd` | 会话结束时 |
| 每轮 | `UserPromptSubmit` | 你提交提示、Claude 处理前 |
| 每轮 | `Stop` | Claude 完成一轮回答后 |
| 工具循环 | `PreToolUse` | 工具调用前（可拦截）|
| 工具循环 | `PostToolUse` | 工具调用成功后 |
| 工具循环 | `PostToolUseFailure` | 工具调用失败后 |
| 工具循环 | `PermissionRequest` | 弹出权限确认时 |
| 子 agent / 任务 | `SubagentStart` / `SubagentStop` | 子 agent 启动 / 结束 |
| 子 agent / 任务 | `TaskCreated` / `TaskCompleted` | 任务被创建 / 标记完成 |
| 文件 / 配置 | `FileChanged` | 被监视的文件改动 |
| 文件 / 配置 | `InstructionsLoaded` | 加载 CLAUDE.md / 规则文件时 |
| 文件 / 配置 | `CwdChanged` | 工作目录切换 |
| 压缩 | `PreCompact` / `PostCompact` | 上下文压缩前 / 后 |
| 通知 | `Notification` | Claude Code 发出通知时 |

> 以上是常用事件，完整约 30 个（还有 `Elicitation`、`WorktreeCreate`、`TeammateIdle` 等更细的）。不想手写 JSON？用 `/hooks` 交互式配置，或直接把需求告诉 Claude 让它生成。完整玩法见 [2.9 Hooks 系统](/basics/hooks) 和 [3.4 Hooks 自动化工作流](/advanced/hooks-automation)。

## mcpServers 字段

```json
{
  "mcpServers": {
    "服务器名": {
      "command": "启动命令",
      "args": ["参数列表"],
      "env": { "环境变量": "值" }
    }
  }
}
```

> 一般用 `claude mcp add ...` 命令配置更省事，不用手写。见 [2.12 MCP 服务器](/basics/mcp-servers) 和 [3.7 MCP 实战配置与案例](/advanced/mcp-in-practice)。

## env 字段

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://your-proxy.com",
    "HTTP_PROXY": "http://proxy:8080"
  }
}
```

> 这里设的变量会注入到每个会话。常用变量清单见 [G. 环境变量速查](./env-vars)。

## 完整配置示例

```json
{
  "model": "claude-sonnet-4-6",
  "outputStyle": "Explanatory",
  "cleanupPeriodDays": 20,
  "permissions": {
    "allow": [
      "Bash(git *)",
      "Bash(npm run *)",
      "Read",
      "Edit",
      "Write"
    ],
    "ask": [
      "Bash(git push *)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Read(./.env*)"
    ]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "npx prettier --write . 2>/dev/null || true" }
        ]
      }
    ]
  },
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxx"
      }
    }
  }
}
```

---

> 💡 不确定某个配置该怎么写、或者想要最符合自己需求的设置？直接把需求告诉 Claude Code，比如"帮我配一个：编辑文件后自动跑 prettier，且禁止删除命令"，让它帮你生成并写进 `settings.json`，比对着字段手写快得多。
```
