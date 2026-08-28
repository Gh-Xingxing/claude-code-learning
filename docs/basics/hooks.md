---
title: Hooks 系统
---

# 2.9 Hooks 系统

> **预计耗时**：10 分钟

## 本关任务简报

Claude Code 改完文件之后，你是不是总要自己再跑一次 `prettier --write`？或者 Claude 执行了某个操作，你希望能收到一条通知，但它偏偏没有？

这类"Claude 做完某件事后，我想自动再做另一件事"的需求，就是 **Hooks 系统**的用武之地。

Hooks 让你在 Claude Code 的关键节点挂上自己的 shell 脚本，实现"自动格式化"、"自动通知"、"自动拦截危险命令"等效果，不需要你手动盯着操作。

---

## 通关奖励：解锁以下技能

- 🎣 理解 Hooks 的工作原理（事件 → 触发命令）
- ⚙️ 能在 `settings.json` 里配置基础 Hook
- 🔔 配置一个操作完成后的通知 Hook
- 🔗 知道在哪里学完整的进阶用法

---

## 机制解析

### Hooks 的工作方式

Hooks 的逻辑很简单：**当某个事件发生时，自动执行你指定的 shell 命令。**

```
Claude 调用工具（事件）
        ↓
检查有没有匹配这个工具的 Hook
        ↓
如果有，执行 Hook 指定的命令
```

整个过程在后台自动发生，不需要你手动触发。

---

### 四种事件类型

| 事件 | 触发时机 |
|------|---------|
| `PreToolUse` | Claude 调用工具**之前** |
| `PostToolUse` | Claude 调用工具**之后** |
| `PreCompact` | `/compact` 压缩对话**之前** |
| `PostCompact` | `/compact` 压缩完成**之后** |

日常用得最多的是 `PostToolUse`：在 Claude 改完文件后自动跑格式化、在 Claude 执行命令后发通知等。

`PreToolUse` 适合用来**拦截危险操作**：在 Claude 执行某条命令之前先检查，如果命令包含危险内容就终止。

---

### 配置结构

Hooks 配置在 `settings.json` 里，格式如下：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "你的命令"
          }
        ]
      }
    ]
  }
}
```

- `matcher`：用正则匹配工具名，`Edit|Write` 表示匹配 Edit 或 Write 工具
- `command`：触发时执行的 shell 命令

---

### 常见配置示例

**每次编辑文件后自动格式化**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{ "type": "command", "command": "prettier --write ." }]
      }
    ]
  }
}
```

**操作完成后桌面通知（Windows）**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "powershell -Command \"Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show('Claude 完成了一个操作')\""
          }
        ]
      }
    ]
  }
}
```

**操作完成后桌面通知（macOS）**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Claude 完成了一个操作\" with title \"Claude Code\"'"
          }
        ]
      }
    ]
  }
}
```

**拦截危险 Bash 命令（PreToolUse）**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "jq -e '.tool_input.command | test(\"rm -rf\")' >/dev/null 2>&1 && exit 2 || exit 0"
          }
        ]
      }
    ]
  }
}
```

Hook 通过标准输入（stdin）收到一段 JSON，工具参数在 `.tool_input` 里。这条命令用 `jq` 取出 Bash 要执行的命令，匹配到 `rm -rf` 就以 **exit 2** 退出——在 `PreToolUse` 里返回 exit 2 会阻断这次工具调用，并把原因反馈给 Claude。

---

### 用 `/hooks` 菜单配置

不想手写 JSON？可以用交互菜单：

```text
/hooks
```

打开图形化配置界面，选择事件类型、输入匹配规则和命令，保存后自动写入 settings.json。

---

### 配置文件位置

| 位置 | 作用范围 |
|------|---------|
| `~/.claude/settings.json` | 全局，所有项目生效 |
| `.claude/settings.json` | 项目级，只对当前项目生效 |

---

## 开始闯关

**目标：把你的自动化需求告诉 Claude，让它帮你生成并部署 Hook 配置。**

Hooks 配置的 JSON 语法不需要你手写——这正是 Claude Code 的用武之地。把你想要的自动化行为用自然语言描述给它，它会帮你生成配置文件。

**第 1 步：描述你的自动化需求**

告诉 Claude 你想要的行为：

```text
我希望每次你修改文件之后，自动运行 prettier 格式化代码。
帮我配置一个 PostToolUse Hook 实现这个需求，写进当前项目的 .claude/settings.json。
```

或者，如果你想先体验一下 Hook 的触发效果：

```text
帮我配置一个最简单的测试 Hook：每次你编辑文件后，向一个日志文件追加一行文字。
把配置写进 .claude/settings.json，并告诉我怎么验证它是否触发了。
```

**第 2 步：确认配置内容**

Claude 写完后，让它把内容显示出来确认：

```text
把刚才写进 .claude/settings.json 的内容贴出来给我看一下
```

你会看到类似这样的 JSON 结构。如果看起来合理，说"没问题"；如果不对，告诉它要调整哪里。

**第 3 步：重启并验证**

Hooks 配置在加载时生效，所以需要重启 Claude Code：按 `Ctrl+D` 退出，重新运行 `claude`。

重启后，让 Claude 编辑一个文件，观察是否自动触发了你配置的操作。

**第 4 步：用 `/hooks` 菜单查看已有配置**

```text
/hooks
```

打开图形化菜单，可以查看当前所有已配置的 Hook，也可以在里面增改规则。

---

## 通关检定

- [ ] 能说出 `PreToolUse` 和 `PostToolUse` 的区别和各自的典型用途
- [ ] 在 `settings.json` 里写了一个 Hook 配置
- [ ] 验证 Hook 在 Claude 执行操作后确实自动触发了
- [ ] 知道 `/hooks` 命令可以打开图形化配置菜单

全部点亮就算通关 ✓

---

## 卡关了？翻车指南在这

**配置了 Hook，但没有触发**

踩坑清单：① JSON 格式是否正确；② `matcher` 里的工具名要和实际工具调用名完全一致（大小写敏感）；③ 需要重启 Claude Code；④ 命令本身是否能在终端单独执行成功。

**Hook 触发了，但命令报错**

Hook 命令里的路径需要是绝对路径，不能依赖相对路径。另外，Hook 运行时的工作目录不一定是你的项目目录，建议命令里明确指定路径。

**想在 Hook 里用 Claude 传过来的工具参数**

Hook 会从标准输入（stdin）收到一段 JSON，里面有工具名、工具参数（`tool_input`）、当前目录等。在命令里用 `jq` 从 stdin 解析需要的字段，例如取出 Bash 要执行的命令：`jq -r '.tool_input.command' < /dev/stdin`。另外还能用环境变量 `$CLAUDE_PROJECT_DIR` 拿到项目根目录。高级用法见进阶使用章节。

---

::: tip 💬 还是搞不定？
Hooks 配好了却不触发、或执行报错？加入群聊与众多战友[探讨交流](/community)，寻找高效解决方案。
:::

## 下一关

[2.10 多模型与思考模式 →](./models-and-thinking)

Hooks 是自动化工作流的入门，下一关讲一个同样重要的选择：用对模型，让 Claude 在不同任务上发挥出真正的价值。更完整的 Hooks 用法在 [进阶使用 3.4 →](/advanced/hooks-automation) 里展开。
