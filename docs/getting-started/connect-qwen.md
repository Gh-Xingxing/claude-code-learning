---
title: 通义千问（阿里云）
---

# 1.2f 通义千问（阿里云）

> **目标**：把阿里云百炼平台的 API Key 配进 Claude Code，完成第一次对话验证。

## 本关任务简报

这条路线适合你，如果：

- 你已经是阿里云用户，或更倾向于使用阿里生态的服务
- 你想在国内直连的前提下使用能力全面的大模型
- 通义千问（Qwen3 系列）在代码、推理、中文方面均有较好表现

## 通关奖励：解锁以下技能

- 在阿里云百炼控制台完成实名、开通服务并拿到 API Key
- 把通义千问配进 Claude Code，并选对大陆 / 国际节点
- 用 `/doctor` + `/model` 验证接入，按场景在 Qwen 各模型间选型

---

## 机制解析

### 可用模型

阿里云百炼（DashScope）提供的模型，接入 Claude Code 后可用：

| 模型 | 定位 |
|------|------|
| **qwen3.7-max** | 旗舰主力，官方 Claude Code 接入指南默认使用 |
| **qwen3.8-max** | 更新旗舰，能力更强，价格也更高 |
| **qwen3.7-flash** | 轻量快速，性价比高 |

> ℹ️ 网站内容不定期更新，表格里不一定是平台最新模型；作者会尽量确保模型信息准确，请以平台官网和 `/model` 实际显示为准。

平台提供的具体模型以百炼控制台为准，会持续更新。

::: warning Base URL 要填对地域和 Workspace ID
阿里云百炼现在的 Anthropic 兼容接口按**地域 + 工作空间（Workspace）**区分，不再是一个通用地址：

```
https://{WorkspaceId}.cn-beijing.maas.aliyuncs.com/apps/anthropic   ← 中国大陆（本页默认）
https://{WorkspaceId}.ap-southeast-1.maas.aliyuncs.com/apps/anthropic   ← 新加坡（国际）
```

把 `{WorkspaceId}` 换成你自己的工作空间 ID（百炼控制台顶部或「工作空间管理」页能看到）。API Key 与 Base URL 必须同属一个地域，跨地域会连接超时。
:::

### 计费规则参考

阿里云百炼**按量计费**和**订阅套餐（Coding Plan）**两种都有。

**按量计费**：按 token 计费，常有限时折扣。以 qwen3.7-max 折扣价为例：

| 模型 | 输入 | 输出 |
|------|------|------|
| qwen3.7-max（限时 5 折） | ¥6 / 百万 token | ¥18 / 百万 token |
| qwen3.7-max（原价） | ¥12 / 百万 token | ¥36 / 百万 token |

新用户通常有免费试用额度（额度大小不定期调整，以控制台开通时的提示为准）。

**Coding Plan（订阅套餐）**：按调用次数计额度，不是按 token：

| 套餐 | 月费 | 每 5 小时 | 每周 | 每月 |
|------|------|----------|------|------|
| Pro | ¥200 | 6,000 次（滚动恢复）| 45,000 次 | 90,000 次 |

这个套餐不止能用通义千问，还能在同一份额度里切换 Kimi、GLM、MiniMax 等其他厂商模型——本质是个多模型编码套餐，接入方式见上面「想要套餐制」提示框。

> ℹ️ 网站内容不定期更新，计费规则会随厂商的政策随时调整，请以百炼官网当前定价为准，此处计费机制仅供对比参考。

---

## 开始闯关

### 第 1 步：注册并开通服务

访问阿里云百炼控制台：[https://bailian.console.aliyun.com](https://bailian.console.aliyun.com)

1. 没有阿里云账号的话，按页面提示注册并完成实名认证（阿里云要求）
2. 登录后开通百炼（Model Studio）服务，按提示同意服务协议

---

### 第 2 步：获取 API Key

1. 进入 API Key 管理页：[bailian.console.aliyun.com/#/api-key](https://bailian.console.aliyun.com/#/api-key)
2. 点击 **创建 API Key**
3. **立刻复制保存**，关闭弹窗后看不到完整 Key

::: warning Key 只显示一次
创建后立刻保存，关掉弹窗再打开就看不到完整字符串了。
:::

---

### 第 3 步：配置 Claude Code

阿里云百炼提供 Anthropic 格式的兼容接口，把 `{WorkspaceId}` 换成你自己的工作空间 ID：

**Windows PowerShell**

```powershell
$env:ANTHROPIC_BASE_URL   = "https://{WorkspaceId}.cn-beijing.maas.aliyuncs.com/apps/anthropic"
$env:ANTHROPIC_AUTH_TOKEN = "你的阿里云百炼 API Key"
claude
```

**macOS / Linux**

```bash
export ANTHROPIC_BASE_URL="https://{WorkspaceId}.cn-beijing.maas.aliyuncs.com/apps/anthropic"
export ANTHROPIC_AUTH_TOKEN="你的阿里云百炼 API Key"
claude
```

::: warning 必须用 `ANTHROPIC_AUTH_TOKEN`
阿里云官方接入文档只用 `ANTHROPIC_AUTH_TOKEN` 鉴权。变量名设错、或 Base URL 里忘了替换 `{WorkspaceId}`，都会导致连不上模型。
:::

::: info 海外 / 国际地区
如果你在中国大陆以外的地区，使用新加坡节点：
```
ANTHROPIC_BASE_URL="https://{WorkspaceId}.ap-southeast-1.maas.aliyuncs.com/apps/anthropic"
```
:::

长期使用推荐写进 Claude Code 配置文件（`~/.claude/settings.json`），顺便把几档模型都映射到通义千问：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://{WorkspaceId}.cn-beijing.maas.aliyuncs.com/apps/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "你的阿里云百炼 API Key",
    "ANTHROPIC_MODEL": "qwen3.7-max",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "qwen3.7-max",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "qwen3.7-max",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "qwen3.6-flash",
    "CLAUDE_CODE_SUBAGENT_MODEL": "qwen3.7-max"
  }
}
```

::: tip 想要套餐制而不是按量付费？
百炼也有类似 GLM Coding Plan 的订阅套餐，Base URL 固定为 `https://coding.dashscope.aliyuncs.com/apps/anthropic`，配的是套餐专属 API Key 和 `qwen3.7-plus` 模型，不需要填 Workspace ID。想省心按月付费的话可以去百炼控制台看看这个套餐详情。
:::

---

## 通关检定

进入 Claude Code 后：

```text
> /doctor
```

确认没有连接报错，然后切换模型：

```text
> /model
```

选择 `qwen3.7-max`，发一句话：

```text
> 你好，请用中文介绍一下你自己
```

自查清单：

- [ ] 已完成阿里云实名、开通百炼服务并拿到 Key
- [ ] Base URL 节点（大陆 / 国际）与账号一致，没选错
- [ ] `/doctor` 无报错，`/model` 看到 Qwen 系列
- [ ] 发一句话能稳定收到回复

全部点亮就算通关 ✓

---

## 卡关了？翻车指南在这

| 现象 | 原因 | 解决 |
|------|------|------|
| 提示需要实名认证 | 阿里云强制要求 | 完成阿里云实名认证后重试 |
| 连接超时 | 地域选错，或 `{WorkspaceId}` 没替换 | 确认 Base URL 里的地域（大陆/新加坡）和 Workspace ID 都对 |
| 鉴权失败 | 用了 `ANTHROPIC_API_KEY` 而不是 `ANTHROPIC_AUTH_TOKEN` | 换成 `ANTHROPIC_AUTH_TOKEN`，重新发起对话 |
| API key invalid | Key 错误或服务未开通 | 确认已开通百炼服务，重新获取 Key |

---

## 这条路线的优点和代价

**优点**：国内直连，稳定；qwen3.7-max / qwen3.8-max 综合能力不弱，能打进第一梯队；阿里云生态支撑，服务稳定性有保障；也有类似 GLM 的套餐制选项。

**代价**：Anthropic 格式兼容层，部分高级能力可能受限；Base URL 要按地域 + Workspace ID 拼，比其他几个平台配置步骤多一步；需要持续关注模型更新和计费变化。

---

::: tip 💬 还是搞不定？
配置过程中遇到困难？加入群聊与众多战友[探讨交流](/community)，寻找高效解决方案。
:::

## 下一关

接入跑通后，[回到 1.2 接入模型 →](./api-key-setup) 选择其他路线，或直接进入 [1.3 第一次对话 →](./first-conversation)。
