---
title: OpenAI（GPT）
---

# 1.2d OpenAI（GPT）

> **目标**：把 OpenAI 的模型接入 Claude Code，用于需要 GPT 系列模型能力的场景。

## 本关任务简报

这条路线适合你，如果：

- 你已经有 ChatGPT Plus / Pro 订阅，想在 Claude Code 里复用（cc switch 支持账号登录方式接入）
- 你需要用最新的 GPT 模型（目前 GPT-5.5 和 GPT-5.4 系列是主力）

OpenAI 没有 Anthropic 格式的原生接口，接入方式比其他平台稍绕——这一关帮你理清两条可行路，并把 Key 拿到、配通。

## 通关奖励：解锁以下技能

- 搞清楚 OpenAI 为什么不能像其他平台那样直接设环境变量
- 在 OpenAI 平台注册、充值并拿到 API Key
- 通过 cc switch 或中转站把 GPT 接进 Claude Code

---

## 开始前先检查装备

::: warning 国内用户注意
OpenAI 在国内无法直连，必须先完成 [1.1d 网络配置 →](./network)，确保代理正常。如果网络搞不定，建议优先使用国内可直连的 [智谱 GLM →](./connect-zhipu) 或 [DeepSeek →](./connect-deepseek)。
:::

---

## 机制解析

### 可用模型

| 模型 ID | 定位 | 适合什么场景 |
|---------|------|-----------|
| **gpt-5.5** | 旗舰，复杂推理与代码最强 | 深度编程任务、架构分析 |
| **gpt-5.4** | 均衡旗舰，性价比更好 | 日常开发、代码生成 |
| **gpt-5.4-mini** | 轻量快速 | 简单任务、批处理、subagent |

> ℹ️ 网站内容不定期更新，表格里不一定是平台最新模型；作者会尽量确保模型信息准确，请以平台官网和 `/model` 实际显示为准。

### 接入方式

OpenAI 目前没有 Anthropic 格式的兼容接口，在 Claude Code 里接入 OpenAI 有两条路：

1. **通过 cc switch 接入**（推荐）：cc switch 支持 OpenAI 接入，配置好后可以实现让 OpenAI 作为 Claude Code 的后端模型。
2. **通过中转站接入**：使用支持 OpenAI 且同时提供 Anthropic 格式的中转站，让 Claude Code 通过中转层调用 OpenAI。

两种方式都需要你有 OpenAI 的 API Key。

### 计费规则参考

OpenAI 同样是**订阅**和**按量计费**两种都有：

**ChatGPT 订阅**（cc switch 账号登录方式对应）：

| 档位 | 月费 |
|------|------|
| Plus | $20 |
| Pro | $100 或 $200（两档）|

**API 按量计费**：

| 模型 | 输入 | 输出 |
|------|------|------|
| gpt-5.5 | $5 / 百万 token | $30 / 百万 token |
| gpt-5.4 | $2.5 / 百万 token | $15 / 百万 token |
| gpt-5.4-mini | $0.75 / 百万 token | $4.5 / 百万 token |

> ℹ️ 网站内容不定期更新，计费规则会随厂商的政策随时调整，请以 OpenAI 官网当前定价为准，此处计费机制仅供对比参考。

---

## 开始闯关

### 第 1 步：注册并获取 API Key

访问 OpenAI 开放平台：[https://platform.openai.com](https://platform.openai.com)

1. 注册账号并完成邮箱验证
2. 进入 **API Keys** 页（左侧导航或直接访问 [platform.openai.com/api-keys](https://platform.openai.com/api-keys)）
3. 点击 **Create new secret key**，给它取个名字（比如 `claude-code`）
4. **立刻复制保存**，关闭窗口后看不到完整 Key

::: warning Key 只显示一次
创建后立刻保存，关掉窗口再打开就看不到完整字符串了。
:::

然后充值：进入 **Billing → Payment methods**，添加信用卡并充值（建议先充 $5 试用）。

---

### 第 2 步：接入 Claude Code

#### 方式一：通过 cc switch 接入（推荐）

cc switch 可以让 Claude Code 使用 OpenAI 格式的后端，是目前最稳定的接入方式。支持两种认证：

- **API Key**：填写 OpenAI API Key + `https://api.openai.com/v1` 作为 Base URL，按量付费
- **账号登录**：cc switch 支持通过 OAuth 登录 OpenAI 账号，可复用 ChatGPT Plus / Pro 订阅额度，不需要单独充值 API 余额

详细配置流程见：[1.2h cc switch →](./connect-cc-switch)

#### 方式二：通过支持 OpenAI 的中转站

部分中转站同时提供 Anthropic 格式接口，并支持把 OpenAI 的模型代理出来。配置方式等同于普通中转站接入：

```powershell
# Windows PowerShell
$env:ANTHROPIC_API_KEY  = "中转站 Key"
$env:ANTHROPIC_BASE_URL = "中转站 Anthropic 格式接口地址"
claude
```

选择模型时选中转站提供的 OpenAI 模型名称即可。详见 [1.2g 中转站 →](./connect-relay)。

---

## 通关检定

- [ ]（国内）已配好代理，能直连 OpenAI
- [ ] 已拿到 OpenAI API Key（或用 cc switch 的账号 OAuth 登录）
- [ ] 通过 cc switch 或中转站完成接入
- [ ] 在 Claude Code 里 `/model` 选到 GPT 模型，发一句话能稳定回复

全部点亮就算通关 ✓

---

## 这条路线的优点和代价

**优点**：GPT 系列模型在通用场景和英文任务上表现稳定，有已经存量 ChatGPT 订阅的用户可以复用。

**代价**：国内无法直连，必须代理；价格偏高；接入方式比直接设 env var 稍复杂，需要借助 cc switch 或中转站。

---

::: tip 💬 还是搞不定？
不确定如何用订阅的 Codex 账号接入？加入群聊与众多战友[探讨交流](/community)，寻找高效解决方案。如需科学工具或代充可联系作者。
:::

## 下一关

接入跑通后，[回到 1.2 接入模型 →](./api-key-setup) 选择其他路线，或直接进入 [1.3 第一次对话 →](./first-conversation)。
