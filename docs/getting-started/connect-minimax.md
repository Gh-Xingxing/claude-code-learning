---
title: MiniMax
---

# 1.2c MiniMax

> **目标**：把 MiniMax 的 API Key 配进 Claude Code，完成第一次对话验证。

## 本关任务简报

这条路线适合你，如果：

- 你在国内，想走国产高性价比模型路线
- 你偏向按量计费，不想绑定套餐，MiniMax-M3 价格便宜、够用
- 不追求跑分最强档，日常编码任务用它性价比不错

如果你想要套餐制的国内路线，可以比较一下 [1.2b 智谱 GLM →](./connect-zhipu)。

## 通关奖励：解锁以下技能

- 在 MiniMax 开放平台注册、充值并拿到 API Key
- 把 MiniMax 配进 Claude Code（环境变量或 `settings.json`）
- 用 `/doctor` + `/model` 验证接入，并避开国内站 / 国际站搞混的坑

---

## 机制解析

### 可用模型

| 模型 | 定位 |
|------|------|
| **MiniMax-M3** | 官方接入 Claude Code 时使用的模型，代码与推理够用，价格便宜 |

> ℹ️ 网站内容不定期更新，表格里不一定是平台最新模型；作者会尽量确保模型信息准确，请以平台官网和 `/model` 实际显示为准。

::: info 只有一个模型名
官方接入文档里，Claude Code 的几档模型（opus / sonnet / haiku）全部映射到同一个 `MiniMax-M3`，不需要在意 `/model` 里选的是哪一档，实际都会走 `MiniMax-M3`。
:::

::: warning 国内站 / 国际站别搞混
MiniMax 分**国内站**和**国际站**两个站点，注册平台、获取API Key、使用Base URL 必须同属一套，跨站会鉴权失败导致无法正常使用：
- 国内站：注册用 `platform.minimaxi.com`，Base URL用 `https://api.minimaxi.com/anthropic`（**本页的配置模板用的是国内站**）
- 国际站：注册用 `platform.minimax.io`，Base URL用 `https://api.minimax.io/anthropic`
:::

### 计费规则参考

MiniMax（国内站）**按量计费**和**订阅套餐**两种都有。

**按量计费**：永久 5 折价，上下文超过 512K 后单价翻倍：

| 上下文长度 | 输入 | 输出 |
|-----------|------|------|
| ≤ 512K token | ¥2.1 / 百万 token | ¥8.4 / 百万 token |
| > 512K token | ¥4.2 / 百万 token | ¥16.8 / 百万 token |

缓存命中的输入 token 按输入价的 10% 计（约 ¥0.21/百万 token）。

**Token Plan（订阅套餐）**：按月付费，官方确认支持接入 Claude Code：

| 套餐 | 月费 |
|------|------|
| Plus | ¥49 |
| Max | ¥119 |
| Ultra | ¥469 |

各档具体额度（token 量或请求次数限制）以订阅时控制台显示的为准，本站没有拿到足够可靠的数字，不在这里瞎写。

> ℹ️ 网站内容不定期更新，计费规则会随厂商的政策随时调整，请以 MiniMax 官网当前定价为准，此处计费机制仅供对比参考。

---

## 开始闯关

### 第 1 步：注册并获取 API Key

访问 MiniMax 开放平台：[https://platform.minimaxi.com](https://platform.minimaxi.com)（注册并完成实名认证，新账户通常送少量体验金，可先免费试跑）

注册后：

1. 进入 **账户管理 → 接口密钥**
2. 点击 **创建新密钥**，给它取个名字（比如 `claude-code`）
3. **立刻复制保存**，关闭弹窗后无法再次查看完整 Key

::: warning Key 安全
不要提交进 Git，不要在截图或群聊中暴露。怀疑泄露时立刻在控制台删除并重新生成。
:::

---

### 第 2 步：充值

平台 → **充值** 页面，选择适合你的套餐或按量充值方式，完成充值后 Key 才能调用模型。

---

### 第 3 步：配置 Claude Code

**Windows PowerShell**

```powershell
$env:ANTHROPIC_BASE_URL   = "https://api.minimaxi.com/anthropic"
$env:ANTHROPIC_AUTH_TOKEN = "你的 MiniMax API Key"
claude
```

**macOS / Linux**

```bash
export ANTHROPIC_BASE_URL="https://api.minimaxi.com/anthropic"
export ANTHROPIC_AUTH_TOKEN="你的 MiniMax API Key"
claude
```

::: warning 必须用 `ANTHROPIC_AUTH_TOKEN`
MiniMax 官方接入文档只用 `ANTHROPIC_AUTH_TOKEN` 鉴权，没有用 `ANTHROPIC_API_KEY` 的写法。变量名设错是接不通模型的常见原因，配好之后先看下面的通关检定确认。
:::

上面是临时写法，只在当前终端窗口生效。长期使用推荐写进 Claude Code 配置文件，并按官方文档补上上下文窗口设置（MiniMax 模型上下文长、单次响应可能较久，默认超时容易误判为失败）：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.minimaxi.com/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "你的 MiniMax API Key",
    "ANTHROPIC_MODEL": "MiniMax-M3",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "MiniMax-M3",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "MiniMax-M3",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "MiniMax-M3",
    "CLAUDE_CODE_AUTO_COMPACT_WINDOW": "1000000"
  }
}
```

文件位置：`~/.claude/settings.json`

::: info `CLAUDE_CODE_AUTO_COMPACT_WINDOW` 是干什么的
把自动压缩的上下文窗口设为 100 万 token，匹配 MiniMax-M3 的上下文容量，避免还没到模型上限就被提前压缩。
:::

::: tip 切换前先清掉旧变量
如果你之前配过别的平台，先确认终端里没有残留的 `ANTHROPIC_AUTH_TOKEN` / `ANTHROPIC_BASE_URL`（旧值会覆盖 `settings.json`，导致看起来配了却连不上）。
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

选择 `MiniMax-M3`，发一句话：

```text
> 你好，请用中文介绍一下你自己
```

自查清单：

- [ ] 注册站点、API Key、Base URL 同属一套（国内站 / 国际站没混用）
- [ ] 账户已充值，Key 完整无多余空格
- [ ] `/doctor` 无报错，`/model` 看到 MiniMax 系列
- [ ] 发一句话能稳定收到回复

全部点亮就算通关 ✓

---

## 卡关了？翻车指南在这

| 现象 | 原因 | 解决 |
|------|------|------|
| `/doctor` 报认证失败 | Key 粘贴有误，或国内站 / 国际站混用 | 确认 Key 完整无空格，且站点与 Base URL 同属一套 |
| 连接超时 | 网络问题 | 检查网络，或换个时间段重试 |
| 余额不足错误 | 账户充值不足 | 去平台充值 |

---

## 这条路线的优点和代价

**优点**：国内直连，稳定；按量计费灵活，不用担心套餐闲置；价格便宜，日常编码任务够用。

**代价**：这是兼容接入层，不是 Anthropic 官方路线；部分高级能力（如扩展思考）可能受兼容层限制；综合性能不算出众，想要性能更强的模型可以参考 [1.2b 智谱 GLM →](./connect-zhipu) 或 [1.2e DeepSeek →](./connect-deepseek)。

---

::: tip 💬 还是搞不定？
配置过程中遇到困难？加入群聊与众多战友[探讨交流](/community)，寻找高效解决方案。
:::

## 下一关

接入跑通后，[回到 1.2 接入模型 →](./api-key-setup) 选择其他路线，或直接进入 [1.3 第一次对话 →](./first-conversation)。
