---
title: 批处理模式
---

# 2.13 批处理模式

> **预计耗时**：8 分钟

## 本关任务简报

到目前为止，你用 Claude Code 的方式都是"打开交互界面 → 输入问题 → 等回答 → 再输入"。这种模式适合探索性的工作，但有时候你只是想让 Claude **跑完一个任务就退出**——不需要来来回回对话，甚至不需要盯着界面。

**批处理模式**（Headless Mode）解决的就是这类问题：不打开交互界面，直接用一行命令让 Claude 执行任务并输出结果。你可以把它塞进脚本、串进管道、放进 CI/CD，让 Claude 成为自动化流水线里的一个环节。

---

## 通关奖励：解锁以下技能

- 💻 用 `-p` 把 Claude Code 变成命令行工具，直接获取输出
- 🔗 通过管道把其他命令的输出喂给 Claude 处理
- 📄 用 `--output-format` 控制输出格式，方便程序解析
- 🤖 把 Claude Code 嵌入 CI/CD 流水线，实现自动代码审查
- ⚡ 用 Git Worktree 同时跑多个任务，互不干扰

---

## 开始前先检查装备

| 前置知识 | 说明 |
|---------|------|
| [2.4 权限系统 →](./permissions) | 批处理模式会用到 `--dangerously-skip-permissions` 等参数，需要理解其含义和风险 |
| [2.6 会话管理 →](./session-management) | 了解"会话"的概念——批处理模式是不打开交互界面的非交互式会话形式 |

---

## 机制解析

### 批处理模式的核心：`-p` 参数

普通启动 Claude Code 会进入交互式会话，加上 `-p` 后变成"一问一答就结束"：

```bash
claude -p "帮我检查 src/ 目录下所有 TypeScript 文件有没有明显的类型错误"
```

Claude 执行完任务、输出结果，然后**自动退出**。不开界面，不等待下一条消息。

这个模式下 Claude 仍然可以读取项目文件、执行命令——它的能力没有缩水，只是不再等你继续对话。

---

### 管道输入：把其他命令的输出喂给 Claude

批处理模式最实用的技巧是和管道组合使用：

```bash
# 分析错误日志
cat error.log | claude -p "分析这段错误日志，找出根本原因，给出可能的修复方向"

# 生成 commit message
git diff HEAD~1 | claude -p "根据这次变更，生成一条简洁的 git commit message，格式：<type>: <description>"

# 代码审查
git diff main | claude -p "对这次变更做代码审查，重点看安全性和可维护性问题"
```

管道把前一个命令的标准输出直接交给 Claude，Claude 的回答打印到终端，可以继续被下一个命令处理。

---

### 控制执行行为

**限制工具调用轮数**

Claude 完成任务时可能要多次调用工具（读文件 → 分析 → 再读 → 给结论）。`--max-turns` 限制最多执行多少轮，防止在复杂任务里无限循环：

```bash
claude -p "重构 auth.ts，把所有硬编码字符串抽取成常量" --max-turns 10
```

**控制输出格式**

默认输出是纯文本，适合人读。如果后续要用脚本处理结果，用 JSON 格式更稳：

```bash
# 纯文本（默认）
claude -p "解释这段代码的作用"

# JSON 格式（适合程序解析）
claude -p "解释这段代码的作用" --output-format json

# 流式 JSON（边生成边输出，适合实时处理）
claude -p "解释这段代码的作用" --output-format stream-json
```

JSON 格式输出包含角色（role）、内容（content）、工具调用记录等结构化信息，方便脚本提取特定字段。

---

### 嵌入 CI/CD：自动代码审查示例

把 Claude Code 放进 GitHub Actions，在每个 PR 打开时自动跑一次代码审查：

```yaml
name: AI Code Review
on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Run AI Code Review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          git diff origin/main...HEAD | claude -p \
            "对这个 PR 进行代码审查，重点关注：
            1. 安全漏洞（SQL 注入、XSS、认证绕过等）
            2. 明显的性能问题
            3. 错误处理是否完整
            输出格式：按严重程度分类，每条问题说明位置和原因" \
            --output-format json
```

实际使用时，通常还需要把 Claude 的输出写到 PR 评论里——这部分可以结合 `gh` 命令或 GitHub Actions 的 comment 插件来做。

---

### 并行执行多个任务：结合 Git Worktree

批处理模式下，你可以同时开多个终端窗口，各自跑不同的任务。用 Git Worktree 创建多个独立工作目录，就不会互相污染文件状态：

```bash
# 创建两个独立工作树
git worktree add ../feature-login feature/login
git worktree add ../feature-signup feature/signup

# 在两个终端里分别执行（互不干扰）
cd ../feature-login && claude -p "实现用户登录 API，包含 JWT 签发逻辑"
cd ../feature-signup && claude -p "实现用户注册 API，包含邮箱验证发送"
```

两个 Claude 实例在各自的工作树里运行，代码隔离、互不影响，结束后各自提交、合并回主分支。

> Git Worktree 并行工作流的完整配置和进阶玩法，在 [进阶使用 3.3 →](/advanced/worktree-parallel) 里展开介绍。

---

## 开始闯关

**目标：跑一次批处理命令，确认能正常输出结果。**

**第 1 步：最简单的批处理命令**

在你的项目目录下运行：

```bash
claude -p "列出当前目录下的所有文件，用一句话说明这个项目大概是做什么的"
```

等它输出完毕自动退出，说明批处理模式工作正常。

**第 2 步：管道组合**

试一下把 git log 喂给 Claude：

```bash
git log --oneline -10 | claude -p "根据这 10 条 commit 记录，概括最近项目主要做了什么改动"
```

**第 3 步：看 JSON 格式输出**

```bash
claude -p "用一句话介绍批处理模式" --output-format json
```

对比纯文本和 JSON 输出的结构差异，了解后者的字段布局。

---

## 通关检定

- [ ] 能用 `-p` 跑一条批处理命令，看到结果后 Claude 自动退出
- [ ] 知道怎么用管道把其他命令的输出传给 Claude 处理
- [ ] 知道 `--output-format json` 适合什么场景、和默认输出有什么区别
- [ ] 知道 `--max-turns` 的作用是什么
- [ ] 知道什么时候应该结合 Git Worktree 跑并行任务

全部点亮就算通关 ✓

---

## 卡关了？翻车指南在这

**运行 `-p` 命令后一直等待，没有输出**

可能原因：① API Key 没配好，Claude 卡在认证环节；② 任务本身需要读写大量文件，响应时间比想象的长；③ 网络问题导致请求超时。先试一个简单的任务（`claude -p "说你好"`）验证基础连通性。

**管道输入没有被 Claude 正确接收**

确认管道前面的命令有输出（先单独跑一次）。另外，有些命令的输出是 stderr 而不是 stdout，需要用 `2>&1` 合并：

```bash
# 把 stderr 也传给 Claude
some-command 2>&1 | claude -p "分析这段输出"
```

**CI 里 `ANTHROPIC_API_KEY` 有了但还是报认证错误**

检查 Secrets 的名称是否和 YAML 里对应，Key 值开头有没有多余空格。可以先在 Actions 日志里打印 `echo $ANTHROPIC_API_KEY | head -c 5` 验证前几个字符是否正确（不要打印完整 Key）。

**想在批处理里用国内中转模型**

设置对应的环境变量即可，和交互模式一样：

```bash
ANTHROPIC_BASE_URL=你的中转地址 ANTHROPIC_API_KEY=你的Key claude -p "任务描述"
```

---

## 下一关

批处理常和 Git 配合（比如在 CI 里对 diff 做审查），而 Git 也是后面进阶章节反复用到的基础工具。进入本板块最后一关 [2.14 Git 入门 →](./git-basics)，把这个绕不开的工具一次讲清楚。
