---
title: 接入模型总览
---

# 1.2 接入模型：第一次对话

> **目标**：选对一条模型路线，真正完成第一次可用对话。

## 本关任务简报

装好 `claude` 只是把空壳放上了机器，它还没有"大脑"。这一关是整个接入环节的**总枢纽**：先把 API Key、Base URL、账号登录这几个概念分清，再根据你的网络和预算选一条模型路线，最后进对应平台子页完成接入。

## 通关奖励：解锁以下技能

- 理解为什么"装好了 Claude Code"还不等于"已经能用"
- 分清 API Key、Base URL、账号登录分别是什么
- 根据自己的网络条件和平台偏好选一条路线
- 知道进哪一个平台子页继续完成接入

---

## 开始前先检查装备

- `claude --version` 有正常输出
- 如果你打算使用 Claude 官方或 OpenAI，先确认 [1.1d 网络配置 →](./network)

---

## 机制解析

### 先把一个关键问题讲清楚

`claude` 命令装到本机，只是把 **Claude Code 这个 Agent 框架**放到了你的电脑里。

它要真正开始工作，还需要接入一个可用的 AI 模型：

1. **安装 Claude Code**：把工具本体装好
2. **接入模型**：给这个工具接上真正会回答问题的"大脑"

第二步没完成，Claude Code 就算安装成功，也不能跟你对话。

### 三个最容易混淆的概念

#### 1）API Key

**你调用模型服务时使用的身份凭证。**

平台需要知道"是谁在调用"，也需要知道"费用记到谁头上"。这个凭证就是 API Key。

你要去每个平台的控制台单独申请，通常只显示一次，拿到后立刻保存好。

::: warning Key 安全
- 不要提交进 Git
- 不要在截图或聊天记录里暴露
- 怀疑泄露时，立刻在平台控制台删掉旧 Key、重新创建
:::

#### 2）Base URL / 接口地址

**告诉 Claude Code "请求要发到哪里"。**

走官方 Claude 登录路线时，这个东西 Claude Code 自动处理，你不用管。

走 API 接入路线（包括官方 API 和所有第三方平台）时，你需要同时配置：
- `ANTHROPIC_API_KEY`（或 `ANTHROPIC_AUTH_TOKEN`）：填写平台提供的 Key
- `ANTHROPIC_BASE_URL`：填写平台提供的接口地址

#### 3）账号登录（/login）

仅限官方 Claude 路线使用。让 Claude Code 通过浏览器授权，绑定你的 Claude Pro / Max 订阅。最省事，但要求你的网络能访问 claude.ai。

### 配置方式

Claude Code 支持两种配置模型的方式，效果等价：

**方式一：启动前设置环境变量（推荐初学者）**

```bash
# macOS / Linux
export ANTHROPIC_API_KEY="你的Key"
export ANTHROPIC_BASE_URL="平台接口地址"
claude
```

```powershell
# Windows PowerShell
$env:ANTHROPIC_API_KEY = "你的Key"
$env:ANTHROPIC_BASE_URL = "平台接口地址"
claude
```

这种方式只在当前终端窗口生效，关掉窗口就失效。

**方式二：写进 Claude Code 配置文件（永久生效）**

编辑 `~/.claude/settings.json`，在 `env` 字段里写入：

```json
{
  "env": {
    "ANTHROPIC_API_KEY": "你的Key",
    "ANTHROPIC_BASE_URL": "平台接口地址"
  }
}
```

之后每次启动 Claude Code 都会自动读取这份配置。

::: tip 想随时切换多个平台？
如果你有多个平台的 Key，不想每次手动切环境变量，可以看 [1.2h cc switch →](./connect-cc-switch)，它提供更方便的多平台切换方案。
:::

---

## 先帮你做路线决策

**在国内、想快速跑通**：推荐选智谱 GLM 或 DeepSeek，国内直连、接入稳定、价格合理。

**已经有官方 Claude 订阅**：走 Claude（Anthropic）路线，原生功能最完整。

**对价格敏感、用量大**：DeepSeek 价格极低，是按量付费场景的性价比首选。

**想长期跑重度任务**：中转站适合需要稳定访问多个模型的高频用户。

---

## 路线对比

| 路线 | 网络要求 | 大致费用 | 适合谁 | 详细页面 |
|------|---------|---------|--------|--------|
| **Claude（Anthropic）** | 需访问 claude.ai / console | 订阅或按量 | 需要完整官方能力 | [1.2a →](./connect-claude) |
| **智谱 GLM** | 国内直连 | 套餐制，性价比高 | 推荐国内用户首选 | [1.2b →](./connect-zhipu) |
| **MiniMax** | 国内直连 | 按量或套餐 | 国产高性能模型 | [1.2c →](./connect-minimax) |
| **OpenAI（GPT）** | 需代理 | 按量或订阅 | 需要 GPT 系列模型 | [1.2d →](./connect-openai) |
| **DeepSeek** | 国内直连 | 极低，按量 | 价格最低，日常开发 | [1.2e →](./connect-deepseek) |
| **通义千问（阿里云）** | 国内直连 | 按量 | 阿里生态用户 | [1.2f →](./connect-qwen) |
| **中转站** | 取决于中转站 | 取决于中转站 | 需要稳定访问多模型 | [1.2g →](./connect-relay) |
| **cc switch** | 取决于你接的平台 | — | 需要随时切换多平台 | [1.2h →](./connect-cc-switch) |

---

## 通关检定

不管走哪条路线，进对应平台子页配完后，都用这套统一动作收尾验收：

**第一步：检查状态**

```text
> /doctor
```

**第二步：确认当前模型**

```text
> /model
```

**第三步：发一句话**

```text
> 你好，介绍一下你自己
```

自查清单：

- [ ] 能分清 API Key / Base URL / 账号登录三者的区别
- [ ] 根据自己的网络与预算选定了一条路线
- [ ] 进对应平台子页配好后，`/doctor` 无报错、`/model` 看到目标模型、对话能稳定回复

全部点亮就算通关 ✓

---

## 下一关

选好路线后，进入对应平台子页完成接入配置，再到 [1.3 第一次对话 →](./first-conversation) 做整体验收。
