---
title: 错误信息速查
pageClass: reference-errors
---

# H. 错误信息速查

> 看到报错先在这按**报错文案**查：左列是你实际会看到的提示，中列是常见原因，右列是直接动作（详细解法点链接进对应页的"翻车指南"）。

## 安装与启动

| 报错信息 | 可能原因 | 怎么办 |
|---------|---------|--------|
| `command not found: claude` | 没装成功，或没加进 PATH | 重开终端；仍不行见 [1.1b 安装排错](/getting-started/installation-troubleshoot) |
| `EACCES` / `permission denied`（npm 全局安装时）| 全局目录权限不足 | 别用 sudo 硬装，见 [1.1b 安装排错](/getting-started/installation-troubleshoot) 情况 3 |
| WSL 里 `claude` 无反应 / 报错 | WSL 环境配置问题 | 见 [1.1c Linux 与 WSL](/getting-started/linux-wsl) |

## 接入与认证

| 报错信息 | 可能原因 | 怎么办 |
|---------|---------|--------|
| `API Error: 401` / `Invalid API key` | Key 没设、设错、或过期 | 跑 `/doctor` 检查；确认 `ANTHROPIC_API_KEY` 正确 |
| 智谱等平台报 401，但 Key 没错 | 用错了变量名 | 智谱要 `ANTHROPIC_AUTH_TOKEN` 不是 `API_KEY`，见 [F. 平台接入速查](./platforms) |
| `Connection error` / `fetch failed` / `ECONNREFUSED` | 网络 / 代理不通 | 见 [1.1d 网络配置](/getting-started/network)、[1.5 更新与排错](/getting-started/update) |
| `unable to verify` / `self-signed certificate`（SSL/TLS）| 代理或证书问题 | 见 [1.5 如何更新与排错](/getting-started/update) |
| `model not found` / 模型不可用 | 平台不支持该模型名，或订阅不含 | 换模型名；见 [2.10 多模型与思考](/basics/models-and-thinking) |

## Git 与 GitHub

| 报错信息 | 可能原因 | 怎么办 |
|---------|---------|--------|
| `git: command not found` | 没装 Git | 装 Git 并重开终端，见 [2.14 Git 入门](/basics/git-basics) |
| `Please tell me who you are` | 没配 Git 身份 | `git config --global user.name/email`，见 [2.14](/basics/git-basics) |
| push 时要密码 / `Authentication failed` | GitHub 不再支持密码推送 | 用 `gh auth login` 或个人访问令牌（PAT），见 [2.14](/basics/git-basics) |
| `remote origin already exists` | 仓库是 clone 来的，已有远程 | 用 `git remote set-url origin 新地址`，见 [2.14](/basics/git-basics) |
| push 被拒：`protected branch` | `main` 开了分支保护 | 改用分支 + PR 流程，见 [2.14](/basics/git-basics) |

## 远程控制

| 报错信息 | 可能原因 | 怎么办 |
|---------|---------|--------|
| `Remote Control requires a claude.ai subscription` | 在用 API Key | 用 `/login` 登录订阅账号；unset `ANTHROPIC_API_KEY`，见 [3.14 远程控制](/advanced/remote-control) |
| `Remote Control requires a full-scope login token` | 用了长效 / 仅推理 token | 用 `/login` 重新登录，见 [3.14](/advanced/remote-control) |
| 手机连不上 / 会话掉线 | 手机网络不通，或电脑进程关了 | 见 [3.14 远程控制](/advanced/remote-control) 的翻车指南 |

## 日常使用

| 现象 | 可能原因 | 怎么办 |
|---------|---------|--------|
| `Alt+Enter` 不换行 / 触发全屏 | 终端劫持了该键 | 改用 `Shift+Enter`，或跑 `/terminal-setup`，见 [2.2 快捷键](/basics/keyboard-shortcuts) |
| Claude"忘事" / 提示上下文已满 | 上下文窗口用满 | `/compact` 压缩或 `/clear` 重开，见 [2.6 会话管理](/basics/session-management) |
| 大项目里越跑越慢 / 跑不动 | 上下文爆炸 | 见 [3.11 大型代码库处理](/advanced/large-codebase) |
| 装了 MCP 但 Claude 不用 | 没在提示里指明 | 明确要求"用 X MCP 做…"，见 [2.12 MCP 服务器](/basics/mcp-servers) |
| Skill 创建了但 `/` 里找不到 | 路径 / 文件名错，或没重启 | 见 [3.9a Skills 基础](/advanced/skills-basics) |

---

> 没找到你的报错？把完整报错原文直接贴给 Claude Code 或丢进搜索，往往比在这查更快。这页只收最高频的那些。
