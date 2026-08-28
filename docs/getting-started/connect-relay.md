---
title: 中转站
---

# 1.2g 中转站

> **目标**：理解什么是中转站、为什么要用它，以及如何配进 Claude Code。

## 本关任务简报

如果你想在国内稳定访问官方 Claude / OpenAI，或想用一个 Key 同时调多个服务商的模型，中转站是绕开网络与多平台麻烦的一条捷径。这一关讲清它是什么、什么时候值得用，以及怎么配进 Claude Code。

## 通关奖励：解锁以下技能

- 理解中转站的工作原理，以及它和直连平台的区别
- 判断自己的场景该不该用中转站
- 用中转站给的 Key + Base URL 把模型配进 Claude Code

---

## 机制解析

### 什么是中转站

中转站（API Relay / 代理服务商）是介于你和模型服务商之间的一层代理服务。

你发出的请求先到中转站服务器，中转站再用自己的账号转发给 OpenAI、Anthropic 等原始服务商，结果原路返回给你。

**你拿到的是**：中转站提供的 API Key + 接入地址（Base URL）。
**中转站负责**：网络连通、模型整合、计费换算、稳定维护。

### 什么时候用中转站

| 场景 | 推荐？ |
|------|------|
| 需要稳定访问官方 Claude，但网络条件不稳定 | ✅ |
| 需要在 Claude Code 里同时用多个不同服务商的模型 | ✅ |
| 对价格敏感，中转站折扣比官方直充更划算 | ✅ |
| 只需要一个模型，且该平台已经有直接接入方式 | 不一定需要 |

---

## 开始闯关

中转站提供 Anthropic 格式的接口地址和 Key，接入 Claude Code 和其他平台完全一样：

### 终端临时配置

**Windows PowerShell**

```powershell
$env:ANTHROPIC_API_KEY  = "中转站给你的 Key"
$env:ANTHROPIC_BASE_URL = "中转站的 Anthropic 格式接口地址"
claude
```

**macOS / Linux**

```bash
export ANTHROPIC_API_KEY="中转站给你的 Key"
export ANTHROPIC_BASE_URL="中转站的 Anthropic 格式接口地址"
claude
```

### 写进配置文件（永久生效）

编辑 `~/.claude/settings.json`：

```json
{
  "env": {
    "ANTHROPIC_API_KEY": "中转站给你的 Key",
    "ANTHROPIC_BASE_URL": "中转站的 Anthropic 格式接口地址"
  }
}
```

两个变量的具体值都从注册后的中转站控制台里找，通常在「API 接入」或「开发者设置」页面。

### 通过 cc switch 配置中转站

如果你已经在用 cc switch 管理多个模型，也可以把中转站作为一个 provider 加进去。配置方式见：[1.2h cc switch →](./connect-cc-switch)

---

## 通关检定

进入 Claude Code 后：

```text
> /doctor
```

确认没有连接报错，然后切换到你想用的模型（比如 claude-opus-4-8 或 gpt-5.5）：

```text
> /model
```

自查清单：

- [ ] 从中转站控制台拿到了 Key 和 Anthropic 格式的 Base URL
- [ ] 两个变量配进了环境变量或 `settings.json`
- [ ] `/doctor` 无报错，`/model` 能选到目标模型
- [ ] 发一句话能稳定收到回复

全部点亮就算通关 ✓

---

## 中转站使用注意事项

**关于隐私**：你的请求内容会经过中转站服务器，对于涉密内容请自行评估风险。

**关于稳定性**：中转站是商业服务，选择时注意服务商的运营历史和用户口碑。

**关于价格**：中转站通常按 token 计费，价格通常低于直接购买官方 API，但要注意换算比例。

---

## 这条路线的优点和代价

**优点**：解决国内访问官方 Claude / OpenAI 的网络问题；支持多模型；价格通常更划算；配置方式简单，和直接接入平台完全一样。

**代价**：数据经过第三方服务器；依赖中转站的稳定性和持续运营；不是官方直接路线。

---

::: tip 💬 还是搞不定？
配置过程中遇到困难？加入群聊与众多战友[探讨交流](/community)，寻找高效解决方案。
:::

## 下一关

接入跑通后，[回到 1.2 接入模型 →](./api-key-setup) 选择其他路线，或直接进入 [1.3 第一次对话 →](./first-conversation)。
