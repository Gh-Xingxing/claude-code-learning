---
title: 平台接入速查
---

# F. 平台接入速查

> 各平台接入 Claude Code 最常被忘的两件事：**Base URL** 和 **用哪个认证变量**。这张表把它们集中起来。完整步骤和最新模型名见各平台接入页。

## 一表速查

| 平台 | Base URL | 认证环境变量 | 备注 |
|------|----------|-------------|------|
| [Claude 官方](/getting-started/connect-claude) | 默认，无需设置 | `ANTHROPIC_API_KEY` 或 `/login` | 直连需网络条件（见 [1.1d](/getting-started/network)）|
| [智谱 GLM](/getting-started/connect-zhipu) | `https://open.bigmodel.cn/api/anthropic` | `ANTHROPIC_AUTH_TOKEN` | ⚠️ 是 `AUTH_TOKEN` 不是 `API_KEY` |
| [MiniMax（大陆）](/getting-started/connect-minimax) | `https://api.minimaxi.com/anthropic` | `ANTHROPIC_AUTH_TOKEN` | ⚠️ 是 `AUTH_TOKEN` 不是 `API_KEY`；国内站，注册同域名 `platform.minimaxi.com` |
| [MiniMax（国际）](/getting-started/connect-minimax) | `https://api.minimax.io/anthropic` | `ANTHROPIC_AUTH_TOKEN` | ⚠️ 是 `AUTH_TOKEN` 不是 `API_KEY`；国际站 `platform.minimax.io`，与国内站 Key 不通用 |
| [DeepSeek](/getting-started/connect-deepseek) | `https://api.deepseek.com/anthropic` | `ANTHROPIC_AUTH_TOKEN` | ⚠️ 是 `AUTH_TOKEN` 不是 `API_KEY`；按量付费、百万上下文 |
| [通义千问（大陆）](/getting-started/connect-qwen) | `https://{WorkspaceId}.cn-beijing.maas.aliyuncs.com/apps/anthropic` | `ANTHROPIC_AUTH_TOKEN` | ⚠️ 是 `AUTH_TOKEN` 不是 `API_KEY`；`{WorkspaceId}` 换成百炼工作空间 ID |
| [通义千问（国际）](/getting-started/connect-qwen) | `https://{WorkspaceId}.ap-southeast-1.maas.aliyuncs.com/apps/anthropic` | `ANTHROPIC_AUTH_TOKEN` | ⚠️ 同上，新加坡节点 |
| [OpenAI（GPT）](/getting-started/connect-openai) | 无 Anthropic 兼容接口 | — | 走 cc switch 或中转站接入 |
| [中转站](/getting-started/connect-relay) | 中转站提供的接口地址 | `ANTHROPIC_API_KEY` | 解决官方网络问题 |
| [cc switch（推荐）](/getting-started/connect-cc-switch) | 可视化管理，自动写入 | — | 免手改环境变量，切换方便 |

## 通用配置写法

设好 `ANTHROPIC_BASE_URL` + 对应认证变量再启动 `claude` 即可。以 DeepSeek 为例（**注意国产模型平台基本都要求 `ANTHROPIC_AUTH_TOKEN`，不是 `ANTHROPIC_API_KEY`**，具体看上表）：

```powershell
# PowerShell（Windows）
$env:ANTHROPIC_BASE_URL   = "https://api.deepseek.com/anthropic"
$env:ANTHROPIC_AUTH_TOKEN = "你的 Key"
claude
```

```bash
# bash / zsh（macOS / Linux）
export ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"
export ANTHROPIC_AUTH_TOKEN="你的 Key"
claude
```

> 不想每次设变量、想随时切换平台？用 [cc switch](/getting-started/connect-cc-switch) 一键切换。完整环境变量清单见 [G. 环境变量速查](./env-vars)。
