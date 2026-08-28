---
title: Linux 与 WSL
---

# 1.1c Linux 与 WSL

> **目标**：在 Linux 系统或 Windows 的 WSL 环境里完成 Claude Code 的安装和初次运行。

## 本关任务简报

这一关适合下面这几类玩家：

- 你在用 Linux 桌面系统（Ubuntu、Fedora、Arch 等）
- 你在 Windows 上开了 WSL，想在 WSL 里跑 Claude Code
- 你在服务器或远程主机上安装 Claude Code

如果你在 Windows 本地（非 WSL）安装，回到 [1.1 安装 →](./installation) 看主路线。

## 通关奖励：解锁以下技能

- 用 nvm 在 Linux / WSL 上装好合规版本的 Node.js（不踩 sudo 权限坑）
- 在 Linux 本地或 WSL 环境里完成 Claude Code 安装并验证
- 知道 WSL 下项目该放哪、代理怎么单独配

---

## 开始闯关

### 最简单：原生脚本（免 Node，推荐先试）

Linux / WSL 都能直接用官方原生安装脚本，**不用先装 Node.js**：

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

装完按它提示把 `~/.local/bin` 加进 PATH（它会给出具体 `echo` 命令），再 `claude --version` 验证即可。

下面还有两条路：**系统包管理器**（发行版是 Debian/Ubuntu、Fedora/RHEL、Alpine 之一时可选）、以及 **nvm + npm**（本来就需要 Node 环境、或想用 npm 管理时用）。

### 系统包管理器（apt / dnf / apk）

Claude Code 提供官方签名的包仓库，装完之后跟你系统里其他软件一样，走系统自身的升级流程更新（不吃 Claude Code 的自动更新）：

**Debian / Ubuntu（apt）**：

```bash
sudo install -d -m 0755 /etc/apt/keyrings
sudo curl -fsSL https://downloads.claude.ai/keys/claude-code.asc -o /etc/apt/keyrings/claude-code.asc
echo "deb [signed-by=/etc/apt/keyrings/claude-code.asc] https://downloads.claude.ai/claude-code/apt/stable stable main" | sudo tee /etc/apt/sources.list.d/claude-code.list
sudo apt update
sudo apt install claude-code
```

**Fedora / RHEL（dnf）**：

```bash
sudo tee /etc/yum.repos.d/claude-code.repo <<'EOF'
[claude-code]
name=Claude Code
baseurl=https://downloads.claude.ai/claude-code/rpm/stable
enabled=1
gpgcheck=1
gpgkey=https://downloads.claude.ai/keys/claude-code.asc
EOF
sudo dnf install claude-code
```

**Alpine（apk）**：

```sh
wget -O /etc/apk/keys/claude-code.rsa.pub https://downloads.claude.ai/keys/claude-code.rsa.pub
echo "https://downloads.claude.ai/claude-code/apk/stable" >> /etc/apk/repositories
apk add claude-code
```

> ℹ️ 上面三条都是 `stable` 渠道（比最新版慢一周左右、更稳）；想要每次发布就更新的 `latest` 渠道，把仓库地址里的 `stable` 换成 `latest` 即可。完整的签名校验步骤见官方文档。

### Linux 本地安装（nvm + npm）

### 第一步：确认 Node.js 版本

走 npm 安装的话，Claude Code 要求 Node.js **22 及以上**（版本低一点也不会装失败，只是会弹 `EBADENGINE` 警告——`claude` 本体是独立原生二进制，运行时不依赖 Node）。

```bash
node --version
```

如果输出 `v22.x.x` 或更高，直接跳到第二步。

如果没有 Node.js，或者想装到 22+，**推荐用 nvm 安装**（避免系统级权限问题）：

```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 重新加载终端配置
source ~/.bashrc  # 或 source ~/.zshrc

# 安装最新 LTS 版 Node.js
nvm install --lts
nvm use --lts

# 验证
node --version
```

::: tip 为什么用 nvm 而不是 apt/yum
系统包管理器（apt、yum、dnf）里的 Node.js 版本通常落后，而且用 `sudo npm install -g` 容易产生权限问题。用 nvm 安装的 Node.js 属于当前用户，不需要 sudo，也更容易切换版本。
:::

### 第二步：安装 Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

### 第三步：验证

```bash
claude --version
```

能输出版本号就完成了。如果报 `command not found`，检查 npm 的全局 bin 目录是否在 `PATH` 里：

```bash
echo $PATH | grep -o '[^:]*npm[^:]*bin[^:]*'
npm prefix -g  # 全局安装前缀，可执行文件在其 bin/ 子目录下
```

把 `npm bin -g` 输出的路径加进 `~/.bashrc` 或 `~/.zshrc` 的 `PATH`：

```bash
export PATH="$(npm prefix -g)/bin:$PATH"
```

---

### WSL（Windows Subsystem for Linux）安装

WSL 让你在 Windows 里运行一个完整的 Linux 环境。如果你想在 WSL 里使用 Claude Code，流程和 Linux 本地安装基本相同，只是多了一步确认 WSL 本身是否已开启。

#### 先确认 WSL 已安装

在 **Windows PowerShell**（非 WSL 终端）里运行：

```powershell
wsl --version
```

如果有版本号输出，说明 WSL 已经安装好了。如果报错或提示未安装，先安装 WSL：

```powershell
wsl --install
```

这条命令默认安装 Ubuntu，安装完成后重启电脑。

#### 进入 WSL 终端

安装好之后，打开 **Windows 终端**（Windows Terminal）或者在开始菜单里找 Ubuntu，进入 WSL 的命令行环境。

进去之后，你看到的提示符类似 `username@DESKTOP:~$`，这说明你已经在 Linux 环境里了。

#### 在 WSL 里安装 Node.js 和 Claude Code

和 Linux 本地安装完全一样：

```bash
# 1. 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc

# 2. 安装 Node.js LTS
nvm install --lts
nvm use --lts

# 3. 安装 Claude Code
npm install -g @anthropic-ai/claude-code

# 4. 验证
claude --version
```

---

## 通关检定

- [ ] `node --version` 输出 v22 或更高（走 npm 安装时才需要；推荐用 nvm 安装，不用 sudo）
- [ ] `npm install -g @anthropic-ai/claude-code` 顺利完成
- [ ] `claude --version` 能输出版本号
- [ ]（WSL 用户）项目准备放在 WSL 自己的文件系统（`~/`）而不是 `/mnt/c/`

全部点亮就算通关 ✓

---

## WSL 使用 Claude Code 的注意事项

**项目文件放在哪里**

WSL 可以访问 Windows 的文件系统（路径以 `/mnt/c/` 开头），也可以在 WSL 自己的文件系统（路径以 `~/` 开头）里工作。

建议把项目放在 WSL 文件系统里（`~/projects/` 之类的路径），不要放在 `/mnt/c/` 下。WSL 访问 `/mnt/c/` 的 I/O 速度比访问自己文件系统慢很多，会影响 Claude Code 读写文件的速度。

**代理配置**

WSL 有自己独立的网络栈，Windows 里设的代理不会自动传给 WSL。如果需要代理，在 WSL 的终端里单独设置：

```bash
export https_proxy=http://127.0.0.1:你的代理端口
export http_proxy=http://127.0.0.1:你的代理端口
```

在 WSL2 里，`127.0.0.1` 通常指向 WSL 本身，不是 Windows 主机。如果你的代理软件在 Windows 上，需要用 Windows 主机的 IP：

```bash
# 获取 Windows 主机 IP（通常是 172.xx.xx.1 这样的地址）
cat /etc/resolv.conf | grep nameserver | awk '{print $2}'
```

**终端推荐**

建议使用 **Windows Terminal**，它对 WSL 支持最好，也支持多标签切换 Windows PowerShell 和 WSL 终端。

---

## 卡关了？翻车指南在这

### `npm install -g` 提示权限不足

不要用 `sudo npm install -g`。改用 nvm 安装 Node.js，nvm 安装的 Node.js 天然支持当前用户的 npm 全局安装，不需要 sudo。

### `claude` 命令装好了但终端找不到

重新打开一个终端，或者手动加载配置：

```bash
source ~/.bashrc  # 或 source ~/.zshrc
```

如果还是找不到，用 `npm prefix -g` 查看全局前缀（可执行文件在其 `bin/` 子目录下），把该 `bin/` 路径加进 `PATH`。

### WSL 里 `claude update` 失败

和 Windows 下的原因类似，改用 npm 更新：

```bash
npm install -g @anthropic-ai/claude-code
```

---

## 下一关

安装完成后，进入 [1.2 接入模型 →](./api-key-setup) 选一条适合当前系统的模型路线。
