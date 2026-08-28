---
title: 智谱 GLM
---

# 1.2b 智谱 GLM

> **目标**：把智谱 GLM 的 API Key 配进 Claude Code，完成第一次对话验证。

## 本关任务简报

这条路线适合你，如果：

- 你在国内，需要国内直连、不依赖代理的稳定路线
- 你看重模型的综合编程能力，GLM-5.3 整体对标一线旗舰水准；GLM-5.3-Flash 便宜到夸张，日常任务性价比是这几个国产平台里最突出的
- 你愿意购买套餐（而不只是按量付费），这是套餐性价比较高的方案之一

如果你目前已有官方 Claude 账号，可以先看 [1.2a Claude（Anthropic）](./connect-claude)。

## 通关奖励：解锁以下技能

- 在智谱开放平台注册、订阅套餐并拿到 API Key
- 把 GLM 通过 `settings.json` 或环境变量配进 Claude Code
- 用 `/doctor` + `/model` 验证接入，并按场景在 GLM-5.3 / GLM-4.7 间选型省额度

---

## 机制解析

### 可用模型

GLM Coding Plan 套餐内所有模型均可在 Claude Code 里使用：

| 模型 | 定位 | 额度消耗 |
|------|------|---------|
| **GLM-5.3** | 最新旗舰（2026-08 发布），1M 上下文、128K 最大输出，长程任务最强，编码推荐 Max 思考档 | 旗舰档，具体倍数以官网 `/model` 显示为准 |
| **GLM-5.3-Flash** | 旗舰的轻量版，价格极低，日常编码任务性价比出众，同价位很难找到更强的 | 轻量档，额度消耗低 |
| **GLM-4.7** | 主力日常任务，额度消耗 1 倍 | 1 倍 |
| **GLM-4.5-Air** | 轻量快速，适合简单任务 | 1 倍 |

> ℹ️ 网站内容不定期更新，表格里不一定是平台最新模型；作者会尽量确保模型信息准确，请以平台官网和 `/model` 实际显示为准。

推荐策略：复杂任务用 GLM-5.3，追求性价比用 GLM-5.3-Flash，日常开发用 GLM-4.7 节省额度。

### 计费规则参考

GLM Coding Plan 走**订阅套餐**，按「积分」计额度，不是按 token 按量计费：

| 套餐 | 月费 | 每 5 小时积分 | 每周积分 |
|------|------|------------|--------|
| Lite | ¥49 | 2,000 | 10,000 |
| Pro | ¥149 | 12,000 | 60,000 |
| Max | ¥469 | 28,000 | 140,000 |

**推荐 Pro**：额度足够日常开发，性价比最高；重度用户上 Max。

> ℹ️ 网站内容不定期更新，计费规则会随厂商的政策随时调整，请以智谱官网当前定价为准，此处计费机制仅供对比参考。

---

## 开始闯关

### 第 1 步：注册并订阅

访问智谱平台官网：https://bigmodel.cn/

注册账号后，在套餐详情页选择 Lite / Pro / Max 套餐订阅。

---

### 第 2 步：获取 API Key

订阅完成后，进入个人中心：

1. 打开 [https://bigmodel.cn/apikey/platform](https://bigmodel.cn/apikey/platform)
2. 点击 **创建 API Key**，给它取个名字（比如 `claude-code`）
3. **立刻复制保存**，关闭弹窗后无法再次查看完整 Key

::: warning Key 安全
不要提交进 Git，不要在截图或群聊中暴露。怀疑泄露时立刻在控制台删除并重新生成。
:::

---

### 第 3 步：配置 Claude Code

以下方式任选其一即可。

#### 方式一：Coding Tool Helper（官方自动化工具，最省事）

在终端执行：

```bash
npx @z_ai/coding-helper
```

这个官方工具会自动帮你写好 `settings.json`、配置模型映射、按需管理 MCP 服务、初始化本地环境，跟着终端里的提示走完就好，不用自己敲配置。**推荐懒得手动配置、或者第一次接入国产模型的用户用这条路。**

::: tip 需要 Node.js
`npx` 是 Node.js 自带的工具，如果提示找不到命令，先按 [1.1 安装 Claude Code](./installation) 里的方式装好 Node.js。
:::

#### 方式二：写进 Claude Code 配置文件（推荐日常使用）

编辑 `~/.claude/settings.json`（没有就新建），加入以下内容（替换 Key）：

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "你的智谱 API Key",
    "ANTHROPIC_BASE_URL": "https://open.bigmodel.cn/api/anthropic",
    "API_TIMEOUT_MS": "3000000",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": 1
  }
}
```

保存后，直接启动 `claude` 即可，不需要额外设置环境变量。**比方式一更直观（配置内容都在一个文件里看得见），比方式三更省心（一次配好，不用每次开终端都设）**。

#### 方式三：临时环境变量（当前终端生效，适合先试一下）

**Windows PowerShell**

```powershell
$env:ANTHROPIC_AUTH_TOKEN = "你的智谱 API Key"
$env:ANTHROPIC_BASE_URL   = "https://open.bigmodel.cn/api/anthropic"
claude
```

**macOS / Linux**

```bash
export ANTHROPIC_AUTH_TOKEN="你的智谱 API Key"
export ANTHROPIC_BASE_URL="https://open.bigmodel.cn/api/anthropic"
claude
```

只在当前终端窗口生效，关掉窗口就失效，适合先验证一下 Key 能不能用，再决定要不要写进方式二的配置文件。

::: info 为什么用 ANTHROPIC_AUTH_TOKEN 而不是 ANTHROPIC_API_KEY？
这是智谱官方文档的推荐配置。`ANTHROPIC_AUTH_TOKEN` 能更好地兼容智谱的 Anthropic 兼容层。
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

选择 `glm-5.3` 或 `glm-4.7`，发一句话：

```text
> 你好，请用中文介绍一下你自己
```

自查清单：

- [ ] 已订阅套餐并拿到完整 API Key（格式类似 `xxx.xxx`）
- [ ] Key + Base URL 配进了 `settings.json` 或环境变量
- [ ] `/doctor` 无连接报错，`/model` 能看到 GLM 系列
- [ ] 发一句话能稳定收到中文回复

全部点亮就算通关 ✓

---

## 套餐专属 MCP 能力

订阅 Pro 或 Max 套餐后，还可以在 Claude Code 里通过 MCP 接入以下能力（需要额外配置 MCP 服务器，详见官方文档或直接跟你配置好的claude code沟通即可）：

- **视觉理解**：把截图直接丢给 GLM 分析
- **联网搜索**：实时查资料
- **网页读取**：给 URL 就能总结内容
- **开源仓库分析**：直接读取 GitHub 代码库

---

## 卡关了？翻车指南在这

| 现象 | 原因 | 解决 |
|------|------|------|
| `/doctor` 报认证失败 | Key 粘贴有误或配置文件位置不对 | 确认 Key 完整（格式类似 `xxx.xxx`），确认 `settings.json` 保存正确 |
| 套餐显示售罄 | 每日限售 | 每日 10:00（UTC+8）释放新库存，届时刷新页面购买 |
| 响应慢或超时 | 高峰期（14:00~18:00 UTC+8）负载高 | 避开高峰时段，或切换到 GLM-4.7 降低资源消耗 |

---

## 这条路线的优点和代价

**优点**：国内直连，稳定；GLM-5.3 能力强，官方明确支持 Claude Code；GLM-5.3-Flash 性价比突出；套餐制省心，不用担心按量账单冲高；享有联网搜索等扩展 MCP 能力。

**代价**：套餐限量，有时抢不到；高峰期（14:00~18:00）会有限流；按套餐计费，轻度用户可能按量更划算。

---

::: tip 💬 还是搞不定？
配置过程中遇到困难？加入群聊与众多战友[探讨交流](/community)，寻找高效解决方案。
:::

## 下一关

接入跑通后，[回到 1.2 接入模型 →](./api-key-setup) 选择其他路线，或直接进入 [1.3 第一次对话 →](./first-conversation)。
