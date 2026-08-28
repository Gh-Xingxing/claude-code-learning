---
title: Hooks 自动化工作流
---

# 3.4 Hooks 自动化工作流

> **预计耗时**：15 分钟

## 本关任务简报

::: tip 先看这里：这一关你不一定要全学
对大多数人来说，[2.9 Hooks 系统 →](/basics/hooks) 讲的基础就够用了——**知道 Hooks 能干什么、会用一句话让 Claude Code 帮你把 Hook 配好**，这才是日常最重要的能力。你完全可以不懂 JSON、不懂退出码，照样用好 Hooks。

这一关是给**想深入机制、想自己手写 Hook 配置**的读者准备的：搞清楚 Hook 脚本怎么拿到数据、退出码各自什么含义、以及怎么把多个 Hook 串成真正的工程流水线。如果你只想"让 Claude 改完文件自动格式化"，回 2.9 让 Claude 帮你配就行，不必啃这一关。
:::

想往下学的，目标是把 Hooks 接进真实的工程流水线："Claude 改完文件 → Prettier 格式化 → 跑测试 → 发通知"这种多步自动化，每一步都由 Hook 自动触发，不用你盯着。

---

## 通关奖励：解锁以下技能

- 📥 搞懂 Hook 脚本怎么拿到数据（stdin 的 JSON，不是环境变量）
- 🚦 理解退出码的含义，尤其"哪个码能拦住操作"
- 🔗 能把多个 Hook 叠成一条流水线
- 🛡️ 用 PreToolUse 拦截危险操作，构建安全防护层
- 🗂️ 知道 Hooks 不止 Pre/PostToolUse，还有一整套生命周期事件

---

## 开始前先检查装备

| 前置知识 | 说明 |
|---------|------|
| [2.9 Hooks 系统 →](/basics/hooks) | Hooks 的概念、事件类型、基础配置结构、`/hooks` 菜单——这一关直接在此基础上进阶，没看过先去补 |

---

## 机制解析

### 关键一：Hook 脚本怎么拿到数据

这是新手最容易搞错的地方，先讲透。

很多老教程会告诉你用 `$CLAUDE_TOOL_INPUT` 之类的环境变量拿工具参数——**这是错的，这些变量不存在**。Hook 的真实数据通道是 **标准输入（stdin）**：Claude Code 在触发 Hook 时，会往脚本的 stdin 灌一段 JSON，里面装着这次操作的全部信息。

一段 PreToolUse 收到的 JSON 长这样：

```json
{
  "session_id": "abc123",
  "cwd": "/home/user/my-project",
  "permission_mode": "default",
  "hook_event_name": "PreToolUse",
  "tool_name": "Bash",
  "tool_input": { "command": "npm test" }
}
```

所以 Hook 脚本要做的是：**从 stdin 读 JSON，用 `jq` 把需要的字段取出来。** 比如取 Bash 要执行的命令：

```bash
COMMAND=$(jq -r '.tool_input.command' < /dev/stdin)
```

> 想根据项目根目录、推理强度等做判断时，确实有几个真实环境变量可用：`CLAUDE_PROJECT_DIR`（项目根）、`CLAUDE_EFFORT`（当前 effort 级别）、`CLAUDE_ENV_FILE`（SessionStart 持久化环境变量的文件）等。但**工具名、工具参数这些核心信息一律走 stdin 的 JSON**，不是环境变量。

---

### 关键二：退出码决定"放行还是拦住"

Hook 跑完会返回一个退出码（exit code），Claude Code 根据它决定下一步。退出码的作用就是让你的脚本能**否决 Claude 的操作**——这是安全防护的基础。

**PreToolUse（工具执行前）：**

| 退出码 | 效果 |
|--------|------|
| `0` | 放行。若 stdout 输出了带 `"permissionDecision": "deny"` 的 JSON，则按 JSON 拦截；否则走正常权限流程 |
| `2` | **拦截**这次工具调用，并把脚本的 stderr 作为原因反馈给 Claude |
| 其他非零（如 1）| **非阻断错误**：stderr 记进 transcript，但**工具照常执行** |

**PostToolUse（工具执行后）：**

| 退出码 | 效果 |
|--------|------|
| `0` | 成功，继续流程 |
| `2` | 工具已经执行完了（拦不住），但把 stderr 反馈给 Claude |
| 其他非零 | 非阻断错误，记日志后继续 |

::: warning 最反直觉的一点
**只有 exit 2 才能拦住操作**，exit 1 不行。这和你平时"非零即失败"的 Unix 直觉相反——在 Hook 里写 `exit 1` 想拦截危险命令，结果命令照样执行。要拦，就 `exit 2`。
:::

---

### 四个工程配方（全部走 stdin + jq）

**配方 1：改完文件 → 自动跑测试（最实用）**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npm test -- --passWithNoTests 2>&1 | tail -5"
          }
        ]
      }
    ]
  }
}
```

效果：Claude 每次改完文件自动跑测试，最后 5 行结果反馈给它，它会知道改动有没有破坏测试。（这个配方不需要解析 JSON，命令是固定的。）

---

**配方 2：格式化被改的那个文件 → 再跑测试（流水线化）**

要对"刚被改的那个文件"做格式化，就得从 stdin 的 JSON 里取出文件路径。同一个 `matcher` 下叠多个 Hook，会按顺序执行：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "FILE=$(jq -r '.tool_input.file_path' < /dev/stdin); [ -n \"$FILE\" ] && npx prettier --write \"$FILE\" 2>/dev/null || true"
          },
          {
            "type": "command",
            "command": "npm test -- --passWithNoTests 2>&1 | tail -5"
          }
        ]
      }
    ]
  }
}
```

效果：文件改完 → 取出该文件路径 → Prettier 格式化它 → 跑测试 → 结果反馈给 Claude，整条流水线全自动。

---

**配方 3：危险命令拦截（安全防护）**

从 stdin 取出 Bash 命令，命中高危关键词就 `exit 2` 拦下：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "CMD=$(jq -r '.tool_input.command' < /dev/stdin); echo \"$CMD\" | grep -qiE 'rm -rf|drop table|delete from|truncate' && { echo '已拦截高危命令，请手动确认后再执行' >&2; exit 2; } || exit 0"
          }
        ]
      }
    ]
  }
}
```

效果：Claude 想执行含高危关键词的命令时，Hook 以 **exit 2** 退出，操作被取消，Claude 收到 stderr 里的提示，会重新斟酌。（注意这里是 `exit 2` 而不是 `exit 1`。）

---

**配方 4：操作审计日志（记录 Claude 做了什么）**

`.*` 匹配所有工具，从 JSON 取工具名追加到日志：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "TOOL=$(jq -r '.tool_name' < /dev/stdin); echo \"$(date '+%Y-%m-%d %H:%M:%S') [$TOOL]\" >> ~/.claude/audit.log 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}
```

效果：所有工具调用追加到日志，方便事后审计这次会话 Claude 调了哪些工具。

::: tip 不用自己背这些 JSON
就算是想自己写配置的人，实操时也建议**把需求说给 Claude Code，让它生成上面这种配置**——它清楚 stdin/jq/退出码这套规则，比手敲准。这一关的价值在于让你**看懂它生成的东西、能验证对不对**。
:::

---

### Hooks 不止 Pre/PostToolUse

2.9 里主要用 `PreToolUse` / `PostToolUse`，但 Hooks 覆盖的是 Claude Code 的**整个生命周期**。常用的还有：

| 事件 | 触发时机 | 典型用途 |
|------|---------|---------|
| `SessionStart` | 会话启动 | 注入环境变量、初始化项目状态 |
| `SessionEnd` | 会话结束 | 收尾、清理临时文件 |
| `UserPromptSubmit` | 你提交提示词时 | 给提示追加上下文、做敏感词过滤 |
| `Stop` | Claude 结束一轮回复 | 完成通知、触发后续动作 |
| `SubagentStop` | 子 Agent 结束 | 汇总子 Agent 结果 |
| `PreCompact` / `PostCompact` | `/compact` 前后 | 压缩前后做记录 |

> 想做"每次会话开始自动加载某些信息""任务跑完桌面通知"这类需求，往往不是 ToolUse 事件，而是上面这些生命周期事件。完整事件集和各自的 JSON 字段，配置时让 Claude 对照官方文档帮你选。

---

### 全局 vs 项目级 Hook 的配置策略

| 放这里 | 适合什么 |
|--------|---------|
| `~/.claude/settings.json` | 通用规则：危险命令拦截、操作日志——所有项目都要 |
| `.claude/settings.json`（项目内）| 项目特定规则：这个项目的测试命令、专用格式化工具 |

两层配置会合并生效，全局规则 + 项目规则同时跑。

---

## 开始闯关

**目标：在你的项目里配置一条真正跑通的格式化 → 测试流水线。**

**第 1 步：把需求说给 Claude Code（推荐）**

```text
我想在你每次修改文件后自动做两件事：
1. 用 Prettier 格式化刚被修改的那个文件
2. 跑 npm test 确认没破坏测试（只要最后 5 行输出）

帮我配成 PostToolUse Hook，写进 .claude/settings.json，
注意用 stdin 的 JSON 取文件路径、别用不存在的环境变量。
```

让 Claude 生成配置，你用这一关学的规则核对它写得对不对。

**第 2 步：验证流水线生效**

重启 Claude Code 后让它改一个文件，观察：Prettier 有没有格式化、测试结果有没有出现在输出里。

**第 3 步：加一条危险命令拦截**

```text
再加一个 PreToolUse Hook：当你要执行含 "rm -rf" 或 "DROP TABLE" 的命令时，
先打印警告并用 exit 2 拦下，让我手动确认。加进全局 ~/.claude/settings.json。
```

**第 4 步：检查日志**

配上审计日志、跑一段时间后：

```bash
cat ~/.claude/audit.log
```

---

## 通关检定

- [ ] 知道 Hook 数据来自 **stdin 的 JSON**，要用 `jq` 解析，不是 `$CLAUDE_TOOL_INPUT` 之类的环境变量
- [ ] 记得**只有 exit 2 能拦住 PreToolUse 的操作**，exit 1 不行
- [ ] 知道同一个 `matcher` 下可以叠多个 Hook，按顺序执行
- [ ] 配过格式化 + 测试的流水线，验证两步都自动触发了
- [ ] 知道 Hooks 还有 SessionStart / Stop 等生命周期事件

全部点亮就算通关 ✓

---

## 卡关了？翻车指南在这

**写了拦截 Hook，危险命令却照样执行了**

九成是用了 `exit 1`。PreToolUse 里只有 `exit 2` 拦得住，`exit 1` 算非阻断错误、工具照跑。改成 `exit 2`。

**`jq` 取出来的值是空的**

先确认字段路径对不对——工具参数在 `.tool_input` 下，文件路径通常是 `.tool_input.file_path`，Bash 命令是 `.tool_input.command`。可以临时把 `jq -r '.' < /dev/stdin >> /tmp/hook-debug.json` 打出来看看完整 JSON 长什么样，再决定取哪个字段。

**叠了两个 Hook，只触发了第一个**

检查两个 Hook 是不是都在**同一个 `hooks` 数组**里（同一个 `matcher` 对象下），而不是各自一个 `matcher` 对象。JSON 层级很容易写错。

**流水线跑了，但 Claude 没看到测试结果**

测试失败信息常走 stderr。确认命令里先 `2>&1` 把 stderr 并到 stdout 再 `tail`：`npm test 2>&1 | tail -5`，别让 `2>/dev/null` 把它吞了。

**拦截 Hook 误伤了正常命令**

正则太宽。用 `grep -qiE` 收窄关键词、加边界；先把 `.tool_input.command` 打到调试文件看实际内容，再调正则。

---

## 下一关

[3.5 自定义斜杠命令 →](./custom-commands)

Hooks 解决"自动触发重复动作"的问题，下一关解决"封装高频提示词"的问题——把你最常用的任务描述做成一个命令，以后输入 `/commit` 就能一键触发。
