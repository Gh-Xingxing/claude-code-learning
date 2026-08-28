---
title: Claude（Anthropic）
---

# 1.2a Claude（Anthropic）

> **目标**：如果你想走 Claude Code 最原生、最完整的一条路线，这一页带你从账号 / API Key 一直走到第一次对话。

## 本关任务简报

这条是 Claude Code 最原生、最完整的一条路线，优先适合：

- 你愿意用 Claude 模型本身的能力，而不是兼容层
- 你已经有可用的 Claude 账号，或愿意申请 Anthropic 控制台账号
- 你后面会用到 Claude Code 的扩展思考、长上下文、深度工具调用这类原生能力
- 你对预算不是特别敏感，更看重稳定性和功能完整性

这一关带你从账号 / API Key 一直走到第一次对话。

## 通关奖励：解锁以下技能

- 分清官方路线的两种接入方式（账号登录 vs API Key），并选定一种
- 完成 `/login` 浏览器授权，或在控制台拿到并配好 API Key
- 用 `/doctor` + 对话验证接入跑通
- 知道怎么查订阅 / API 的用量与余额

---

## 开始前先检查装备

- 已完成 [1.1 安装](./installation)，`claude --version` 正常输出

::: warning 网络条件要求
Claude 官方服务（claude.ai / console.anthropic.com）在国内通常无法直连。如果你需要代理，请先完成 [1.1d 网络配置 →](./network)，再回来接着操作。

如果暂时没有合适的网络条件，可以先从国内直连的路线入手：[1.2b 智谱 GLM →](./connect-zhipu) 或 [1.2e DeepSeek →](./connect-deepseek)。
:::

---

## 机制解析

### 可用模型

Claude Code 里可以直接用 `/model` 切换的官方模型系列，大致定位：

| 模型 | 定位 | 什么时候用 |
|------|------|-----------|
| Claude Fable 系列 | 目前最强、最贵，长链路复杂任务的天花板 | 极高难度架构设计、长时间自主跑的复杂任务 |
| Claude Opus 系列 | 旗舰，最强推理与代码能力 | 架构设计、深度调试、复杂重构 |
| Claude Sonnet 系列 | 主力，性价比 + 速度均衡 | 日常开发、写代码、读代码 |
| Claude Haiku 系列 | 轻量级，最快 | 简单问答、批量小任务 |

> ℹ️ 网站内容不定期更新，表格里不一定是平台最新模型；作者会尽量确保模型信息准确，请以平台官网和 `/model` 实际显示为准。

第一次跑通时不用纠结型号，让 Claude Code 用默认值就行；后面熟悉了再用 `/model` 切。启动时也可以用 `--model` 指定：既支持别名（`opus` / `sonnet`），也支持完整模型名（如 `claude-sonnet-4-6`）：

```bash
claude --model sonnet
```

如果你想全面对比，直接看 [2.10 多模型与思考模式 →](/basics/models-and-thinking)。

### 接入方式：两种路线怎么选

Claude 官方路线有两种主流方式，新手最容易混淆，但其实区别很简单：

| 方式 | 你做的事 | 适合谁 |
|------|---------|-------|
| **方式 A：账号登录** | 让 Claude Code 通过浏览器登录，绑定 Claude Pro / Max 订阅 | 已经在用 Claude.ai 网页版，希望复用订阅额度 |
| **方式 B：API Key** | 在 Anthropic 控制台开通 API、生成 Key，按用量付费 | 想自己控制额度、做工程化使用、跑批处理脚本 |

### 计费规则参考

官方同样是**订阅**和**按量计费**两种都有，跟走方式 A 还是方式 B 对应：

**订阅（方式 A 对应）**：

| 档位      | 月费                   |
| ------- | -------------------- |
| Free    | $0（不支持接入Claude code） |
| Pro     | $20（月付）/ 约 $17（年付均摊） |
| Max 5x  | $100                 |
| Max 20x | $200                 |

Max 5x / 20x 指的是相对 Pro 的用量倍数，每 5 小时滚动重置一次额度，模型能力本身和 Pro 没有区别，区别只在额度的多少。

**API 按量计费（方式 B 对应）**：

| 模型 | 输入 | 输出 |
|------|------|------|
| Claude Fable 系列 | $10 / 百万 token | $50 / 百万 token |
| Claude Opus 系列 | $5 / 百万 token | $25 / 百万 token |
| Claude Sonnet 系列 | $2 / 百万 token | $10 / 百万 token |
| Claude Haiku 系列 | $1 / 百万 token | $5 / 百万 token |

> ℹ️ 网站内容不定期更新，计费规则会随厂商的政策随时调整，请以 Anthropic 官网当前定价为准，此处计费机制仅供对比参考。

---

## 开始闯关


### 方式 A：用账号登录（推荐尝试）

#### 适合谁

- 你已经在 Claude.ai 网页版用 Claude，订阅了 Pro / Max
- 你不想去研究 API 计费、Key 管理这些事
- 你目前所在的网络环境能稳定打开 Claude.ai 登录页

#### 你需要先准备什么

1. 一个可用的 Anthropic / Claude.ai 账号（有 Pro 或 Max 订阅会更顺手）
2. 当前电脑能打开 Claude.ai 的浏览器（如果连登录页都打不开，这条方式就不会成功）
3. 已完成 [1.1 安装](./installation)，`claude --version` 正常输出

#### 实际操作

打开终端，输入（记得先打开代理工具并按 [1.1d 网络配置 →](./network)这一节配置端口）：

```bash
claude
```

进入交互界面后，输入：

```text
> /login
```

Claude Code 会输出一个授权链接（或自动打开默认浏览器）。

按提示：

1. 在浏览器里登录你的 Anthropic 账号
2. 授权 Claude Code 访问该账号
3. 把页面上给的授权码粘回终端

完成后终端会提示登录成功。登录凭证会存在本机，之后无需重复登录。

::: info 也可以在交互界面外登录
不想先进交互界面？在终端直接 `claude auth login` 也能完成同样的登录（加 `--console` 则走 Console 的 API 按量计费而非订阅，首次会自动建一个 “Claude Code” 工作区）。终端登录子命令的完整说明见 [D. CLI 参数速查 →](/reference/cli-flags)。
:::

#### 这条方式的验收

```text
> /doctor
> 你好，介绍一下你自己
```

只要能稳定回复，就说明这条方式跑通了。

#### 这条方式的优点

- 不用自己管 API Key
- 复用现有订阅额度，不会突然产生意外的 API 费用
- 配置最少，最贴近"装好就能用"

#### 这条方式的代价

- 严重依赖你能不能正常访问 Claude.ai 登录页
- 国内用户在没有合适网络条件时，这一步会直接卡住
- 订阅额度是按月分配的，不能像 API 那样按用量精细控制

---

### 方式 B：用官方 API Key

#### 适合谁

- 你想自己掌控用量与计费
- 你后面要做批处理、CI / CD、自动化脚本
- 你已经习惯 Anthropic 控制台，不需要再绕账号登录
- 你需要稳定的程序化访问，不想被订阅产品的限流影响

#### 第 1 步：去 Anthropic 控制台拿 API Key

打开 Anthropic 控制台（`console.anthropic.com`），登录后做这几件事：

1. 进入 **API Keys** 页（在控制台左侧 / 个人头像菜单里都能找到）
2. 点击 **Create Key**，给它一个能让你认出来的名字（比如 `claude-code-local`）
3. **立刻复制保存**：Key 只会完整显示一次，关掉页面就再也看不到完整字符串
4. 顺手到 **Billing / Plans** 页确认：
   - 已经绑定有效付款方式
   - 已经充值过额度，或者订阅了对应套餐
   - 没有充值的 API Key 是不能调用模型的，这是新手最常见的"看起来能配但用不了"

::: warning Key 不要泄露
- 不要提交进 Git
- 不要发在群里、截图里
- 一旦怀疑泄露，立刻在控制台把这个 Key 删掉，再生成一个新的
:::

#### 第 2 步：在终端里给 Claude Code

**Windows PowerShell**

```powershell
$env:ANTHROPIC_API_KEY = "sk-ant-api03-..."
claude
```

**macOS / Linux**

```bash
export ANTHROPIC_API_KEY="sk-ant-api03-..."
claude
```

上面这种写法只在当前终端会话生效，关掉窗口就没了。

如果你后面要长期使用，再写进自己的 shell 配置文件（`~/.zshrc` / `~/.bashrc` / PowerShell `$PROFILE`）。

#### 这条方式的验收

```text
> /doctor
> /model
> 你好，请用一句话介绍一下你自己
```

如果 `/doctor` 提示连接正常、`/model` 看到 Claude 系列模型、对话能正常返回，就完成了。

#### 这条方式的优点

- 用量可控，按需付费
- 不依赖订阅产品本身的额度变化
- 适合自动化、CI / CD、批处理使用

#### 这条方式的代价

- 需要绑定付款方式
- Key 泄露的责任在你
- 第一次还要熟悉一下控制台的导航结构

---

## 通关检定

- [ ] 想清楚自己走方式 A（账号登录）还是方式 B（API Key）
- [ ] `/login` 授权成功，或 Key + （如需）Base URL 已配进终端 / `settings.json`
- [ ] `/doctor` 无报错，`/model` 看到 Claude 系列模型
- [ ] 发一句话能稳定收到回复
- [ ]（API Key 用户）控制台已绑卡 / 充值，不是"配好却用不了"

全部点亮就算通关 ✓

---

## 如何查看用量和余额

### 订阅用户（Pro / Max）

打开 **claude.ai** → 左下角头像 → **Settings** → **Billing**，可以看到当前订阅计划和本月用量数据。

Claude Pro / Max 的额度不是固定的消息条数，系统会根据当前负载动态调整——需求低时可以用更多。

### API Key 用户

打开 **console.anthropic.com** → **Billing** → **Usage**，可以按日 / 月查看 token 消耗明细和对应费用。

如果你想防止意外超额，可以在 **Settings** → **Limits** 里设置用量上限，超过后 API 会自动停止响应。

余额查看：**console.anthropic.com** → **Billing** → **Credits** 或 **Balance**。

### 在 Claude Code 内查当前会话成本

```text
> /cost
```

这个命令显示当前会话消耗的 token 数量和大致费用估算。对 API 付费用户来说，可以随时用它感知一次任务的消耗量。

---

## 卡关了？翻车指南在这

**"登录页打不开 / 授权回调失败"**

通常和网络环境有关。如果你只是想先跑通 Claude Code，没必要在这一条路上死磕，直接换到国内平台（智谱 / MiniMax）会省更多时间。

**"Key 配好了但 `/doctor` 报错"**

按这个顺序检查：

1. Key 是不是粘错了（前后多了空格、引号没去掉）
2. Anthropic 控制台里有没有充值 / 绑卡
3. 当前终端是不是真的拿到了 `ANTHROPIC_API_KEY`（PowerShell 里 `echo $env:ANTHROPIC_API_KEY`，bash 里 `echo $ANTHROPIC_API_KEY`）

**"以前能用，今天突然不行了"**

先 `/doctor` 看错误描述。如果是网络层面的报错，结合 [1.5 如何更新与排错 →](./update) 里的代理排查思路。

**在这条路线上花超过 30 分钟还没跑通**

认真考虑：你是不是其实没必要先走官方路线、只想先把 Claude Code 用起来？如果是，直接换路别硬撑：

- 国内直连路线 → [1.2b 智谱 GLM →](./connect-zhipu) 或 [1.2e DeepSeek →](./connect-deepseek)
- 后面要切多个平台 → [1.2h cc switch →](./connect-cc-switch)

---

::: tip 💬 还是搞不定？
配置过程中遇到困难？加入群聊与众多战友[探讨交流](/community)，寻找高效解决方案。如需科学工具或代充可联系作者。
:::

## 下一关

接入跑通后，[回到 1.2 接入模型 →](./api-key-setup) 选择其他路线，或直接进入 [1.3 第一次对话 →](./first-conversation)。
