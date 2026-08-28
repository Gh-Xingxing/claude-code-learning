---
title: IDE 集成
---

# 2.11 IDE 集成

> **预计耗时**：10 分钟

## 本关任务简报

终端用起来挺顺手，但每次 Claude 改了文件，你都要手动切回编辑器去看改了什么，再决定要不要接受。能不能让 Claude 直接在编辑器里操作，改动直接显示在你眼前？

可以。Claude Code 有 VS Code 和 JetBrains 的官方扩展，安装后 Claude 的文件修改会以 diff 视图展示，你可以逐块接受或拒绝，不需要切窗口。

---

## 通关奖励：解锁以下技能

- 🔌 完成 VS Code 或 JetBrains 扩展的安装和连接
- 👁️ 能在 IDE 里看到 Claude 文件修改的 diff 视图
- 🖥️ 理解终端模式和 IDE 模式各自的优势
- 🔗 知道如何在终端会话和 IDE 会话之间切换

---

## 开始前先检查装备

| 前置知识 | 说明 |
|---------|------|
| [1.1 安装 →](/getting-started/installation) | Claude Code 已安装并能正常使用 |
| VS Code 或 JetBrains 系列 IDE | 本关专为 IDE 扩展设计，需要先有 IDE 环境才能安装对应扩展 |

---

## 机制解析

### 终端 vs IDE：两种模式的实际差异

不是所有人都需要 IDE 集成。先看看两种模式在实际使用中的区别：

| 功能 | 终端模式 | IDE 模式 |
|------|---------|---------|
| 文件修改展示 | 纯文字输出 | 可视化 diff 高亮 |
| 逐块接受修改 | 不支持 | 支持（可以只接受部分修改）|
| 引用 IDE 终端输出 | 用 `!命令` | 用 `@terminal:名称` |
| 跨文件跳转 | 手动 | 点击跳转 |
| 侧边栏集成 | 无 | Claude 面板在 IDE 里 |

**如果你的工作流是：打开编辑器工作 → 偶尔切到终端问 Claude → 再切回来看改动**，IDE 集成可以消除这个"切窗口"的摩擦。

**如果你更习惯全键盘操作、或者任务以脚本/数据处理为主**，终端模式更简洁。

---

### VS Code 集成

**安装扩展**

在 VS Code 扩展市场搜索 **Claude Code** 并安装，或者在 Claude Code 会话里输入：

```text
/ide
```

它会自动检测 VS Code 并引导你安装。

**连接 IDE**

在终端的 Claude Code 会话里运行：

```text
/ide
```

Claude Code 会自动检测当前已打开的 VS Code 实例并建立连接。成功后，Claude 的文件修改会在 VS Code 里以 diff 视图弹出。

**IDE 模式专属快捷键**

| 快捷键 | 操作 |
|--------|------|
| `Cmd+Enter`（macOS）/ `Ctrl+Enter`（Win） | 在 IDE 的 Claude 面板里提交消息 |
| `@terminal:名称` | 引用 VS Code 某个终端标签的输出 |

---

### JetBrains 集成

支持 IntelliJ IDEA、PyCharm、WebStorm、GoLand 等 JetBrains 系列。

**安装插件**

在 IDE 的 Plugin Marketplace 搜索 **Claude Code** 并安装，重启 IDE。

安装后在 IDE 侧边栏找到 Claude Code 面板，使用方式和 VS Code 版本类似。

---

### 在终端和 IDE 之间切换

终端会话和 IDE 会话共用同一套历史记录。如果你在终端开了一个会话，想把它接续到 IDE 里继续：

```bash
claude --resume
```

选择之前的会话，再运行 `/ide` 连接，上下文会保留。

---

## 开始闯关

**目标：完成扩展安装并验证 diff 视图可以正常工作。**

**第 1 步：安装扩展**

在 VS Code 里搜索并安装 **Claude Code** 扩展，或者在 Claude Code 会话里输入 `/ide`。

**第 2 步：连接**

在 Claude Code 会话里运行 `/ide`，等待连接成功提示。

**第 3 步：让 Claude 修改一个文件**

告诉 Claude 对某个文件做一点小改动（比如在某个文件末尾加一行注释），观察 VS Code 里是否弹出 diff 视图。

你应该能看到高亮的修改对比，以及"接受"和"拒绝"的按钮。

---

## 通关检定

- [ ] 扩展安装成功，在 VS Code / JetBrains 里能看到 Claude Code 面板
- [ ] 运行 `/ide` 后建立了连接
- [ ] Claude 修改文件后，IDE 里出现了 diff 视图
- [ ] 知道 IDE 模式和终端模式各自适合什么场景

全部点亮就算通关 ✓

---

## 卡关了？翻车指南在这

**运行 `/ide` 但提示没有找到 IDE**

踩坑清单：① VS Code 必须已经打开（不是只安装了）；② 扩展必须已安装且处于启用状态；③ 尝试先在 VS Code 里打开项目目录，然后在该目录启动 Claude Code，再运行 `/ide`。

**diff 视图弹出了，但接受后发现内容不对**

diff 视图展示的是"建议修改"，接受前可以点击"查看文件"仔细核对。如果发现接受了不想要的改动，用 `Ctrl+Z` 撤销，或配合 `git checkout` 恢复原文件。

**JetBrains 插件安装后找不到面板**

重启 IDE 后，在菜单栏找 View → Tool Windows → Claude Code，或者在右侧工具栏查找 Claude 图标。

---

## 下一关

[2.12 MCP 服务器 →](./mcp-servers)

IDE 集成解决了"在哪里用 Claude Code"的问题，下一关讲"给 Claude Code 扩展能力"——MCP 让它能连接浏览器、数据库和外部服务。
