---
title: DeepSeek
---

# 1.2e DeepSeek

> **目标**：把 DeepSeek 的 API Key 配进 Claude Code，完成第一次对话验证。

## 本关任务简报

这条路线适合你，如果：

- 你追求性价比，DeepSeek 是目前按量付费场景里性价比较高的选项之一
- 你在国内，想要国内直连、不依赖代理的稳定路线
- 任务量大，需要控制成本

## 通关奖励：解锁以下技能

- 在 DeepSeek 开放平台注册、充值并拿到 API Key
- 用原生 Anthropic 格式接口把 DeepSeek 配进 Claude Code（配置最简单）
- 用 `/doctor` + `/model` 验证接入，并了解兼容层的能力边界

---

## 机制解析

### 可用模型

DeepSeek 官方支持 Anthropic API 格式，可以直接在 Claude Code 里用：

| 模型 | 定位 |
|------|------|
| **deepseek-v4-pro** | 主力旗舰，推理能力强，支持百万上下文 |
| **deepseek-v4-flash** | 轻量快速版，性价比更高 |

> ℹ️ 网站内容不定期更新，表格里不一定是平台最新模型；作者会尽量确保模型信息准确，请以平台官网和 `/model` 实际显示为准。

::: info 模型自动映射
DeepSeek 的 Anthropic 接口会按模型名前缀自动映射：
- `claude-opus-*` → `deepseek-v4-pro`
- `claude-sonnet-*` / `claude-haiku-*` → `deepseek-v4-flash`
- 其它不认识的模型名 → 一律映射到 `deepseek-v4-flash`

所以即使 Claude Code 默认请求的是 Claude 模型名，也能正常落到 DeepSeek 模型上；想精确控制时直接指定模型名即可。
:::

### 计费规则参考

DeepSeek 按 token 按量计费，分**高峰 / 非高峰**两档价格，非高峰是高峰的一半：

| 模型 | 输入（缓存命中）| 输入（缓存未命中）| 输出 |
|------|--------------|--------------|------|
| deepseek-v4-flash | ¥0.05 / ¥0.10（非高峰/高峰）| ¥1.5 / ¥3.0 | ¥4.5 / ¥9.0 |
| deepseek-v4-pro | ¥0.15 / ¥0.30 | ¥4.5 / ¥9.0 | ¥13.5 / ¥27.0 |

（单位：元 / 百万 token；高峰时段为北京时间周一至周五 9:00-12:00、14:00-18:00，其余时间按非高峰价）

DeepSeek 官方目前只有按量计费，没有订阅套餐——想省心按月付费的话，GLM、MiniMax、通义千问都有套餐制选项，可以对比看看。

> ℹ️ 网站内容不定期更新，计费规则会随厂商的政策随时调整，请以 DeepSeek 官网当前定价为准，此处计费机制仅供对比参考。

---

## 开始闯关

### 第 1 步：注册并获取 API Key

访问 DeepSeek 开放平台：[https://platform.deepseek.com](https://platform.deepseek.com)

1. 注册账号（支持手机号注册）
2. 打开 [API keys 管理页](https://platform.deepseek.com/api_keys)，点击 **创建 API key**
3. **立刻复制保存**，关闭窗口后看不到完整 Key

然后充值：在控制台左侧的 **「充值」** 入口完成充值，建议先充入少量额度试用。

---

### 第 2 步：配置 Claude Code

DeepSeek 官方提供 Anthropic 格式的兼容接口。官方文档给的是一份完整配置，直接把 Claude Code 里几档模型都映射到 DeepSeek，并调好了推理强度和自动压缩窗口，照抄即可：

**Windows PowerShell**

```powershell
$env:ANTHROPIC_BASE_URL   = "https://api.deepseek.com/anthropic"
$env:ANTHROPIC_AUTH_TOKEN = "你的 DeepSeek API Key"
$env:ANTHROPIC_MODEL = "deepseek-v4-pro"
$env:ANTHROPIC_DEFAULT_OPUS_MODEL = "deepseek-v4-pro"
$env:ANTHROPIC_DEFAULT_SONNET_MODEL = "deepseek-v4-pro"
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL = "deepseek-v4-flash"
$env:CLAUDE_CODE_SUBAGENT_MODEL = "deepseek-v4-flash"
$env:CLAUDE_CODE_EFFORT_LEVEL = "max"
$env:CLAUDE_CODE_AUTO_COMPACT_WINDOW = "786432"
claude
```

**macOS / Linux**

```bash
export ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"
export ANTHROPIC_AUTH_TOKEN="你的 DeepSeek API Key"
export ANTHROPIC_MODEL="deepseek-v4-pro"
export ANTHROPIC_DEFAULT_OPUS_MODEL="deepseek-v4-pro"
export ANTHROPIC_DEFAULT_SONNET_MODEL="deepseek-v4-pro"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="deepseek-v4-flash"
export CLAUDE_CODE_SUBAGENT_MODEL="deepseek-v4-flash"
export CLAUDE_CODE_EFFORT_LEVEL="max"
export CLAUDE_CODE_AUTO_COMPACT_WINDOW="786432"
claude
```

::: warning 必须用 `ANTHROPIC_AUTH_TOKEN`，`ANTHROPIC_API_KEY` 在这条线上不可靠
DeepSeek 官方接入文档从头到尾只用 `ANTHROPIC_AUTH_TOKEN`。实测 `ANTHROPIC_API_KEY` 在这个接口上可能鉴权不过、模型调不通——如果你配好了却提示连不上 DeepSeek，先检查是不是把变量名设错了。
:::

::: info 后面几个变量是干什么的
- `ANTHROPIC_DEFAULT_OPUS/SONNET/HAIKU_MODEL`：把 Claude Code 内部的模型槽位映射到 DeepSeek 对应模型，避免切档或后台小任务时调不到官方 Claude 模型报错。
- `CLAUDE_CODE_SUBAGENT_MODEL`：子 Agent（Task 工具派生的子任务）走的模型。
- `CLAUDE_CODE_EFFORT_LEVEL`：推理强度，官方推荐设 `max`。
- `CLAUDE_CODE_AUTO_COMPACT_WINDOW`：自动压缩的上下文容量（token），匹配 DeepSeek 的上下文能力。
:::

上面是临时写法，只在当前终端窗口生效。长期使用推荐写进 Claude Code 配置文件（`~/.claude/settings.json`），内容一样，不用每次开终端都设一遍：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.deepseek.com/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "你的 DeepSeek API Key",
    "ANTHROPIC_MODEL": "deepseek-v4-pro",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "deepseek-v4-pro",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "deepseek-v4-pro",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "deepseek-v4-flash",
    "CLAUDE_CODE_SUBAGENT_MODEL": "deepseek-v4-flash",
    "CLAUDE_CODE_EFFORT_LEVEL": "max",
    "CLAUDE_CODE_AUTO_COMPACT_WINDOW": "786432"
  }
}
```

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

选择 `deepseek-v4-pro` 或 `deepseek-v4-flash`，发一句话：

```text
> 你好，请用中文介绍一下你自己
```

自查清单：

- [ ] 已注册并充值，Key 完整无多余空格
- [ ] Key + Base URL（`https://api.deepseek.com/anthropic`）配进环境变量或 `settings.json`
- [ ] `/doctor` 无报错，`/model` 看到 DeepSeek 系列
- [ ] 发一句话能稳定收到回复

全部点亮就算通关 ✓

---

## 兼容性说明

DeepSeek 的 Anthropic 格式接口支持大部分常用字段，但有几点需要了解：

- 图片类型的消息内容（`type=image`）暂不支持
- `thinking` 字段支持，但 `budget_tokens` 参数会被忽略
- `anthropic-beta` 和 `anthropic-version` header 会被忽略，不影响基本使用

---

## 卡关了？翻车指南在这

| 现象 | 原因 | 解决 |
|------|------|------|
| `/doctor` 报认证失败 | Key 粘贴有误 | 确认 Key 完整，没有多余空格 |
| 余额不足错误 | 账户充值不足 | 去 platform.deepseek.com 充值 |
| 超时或连接慢 | 网络波动或高峰期 | 换个时段重试 |

---

## 这条路线的优点和代价

**优点**：价格极低，国内直连，稳定；官方提供原生 Anthropic 格式接口，配置最简单；deepseek-v4-pro 百万上下文，适合处理大型代码库。

**代价**：这是兼容接入层，不是官方 Claude；部分高级能力（如图片理解）受限制；综合能力已不是国产模型里最强的一档，被 GLM-5.3 等甩开一段距离，胜在便宜和稳定，不是跑分最强。

---

::: tip 💬 还是搞不定？
配置过程中遇到困难？加入群聊与众多战友[探讨交流](/community)，寻找高效解决方案。
:::

## 下一关

接入跑通后，[回到 1.2 接入模型 →](./api-key-setup) 选择其他路线，或直接进入 [1.3 第一次对话 →](./first-conversation)。
