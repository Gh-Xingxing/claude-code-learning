import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Claude Code 通关指南',
  description: '从零到熟练，把 Claude Code 一关一关学会的通关指南。不收费、不卖课、完全开源。',

  base: '/',
  cleanUrls: true,
  sitemap: {
    hostname: 'https://claudecodelearning.com'
  },

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    ['link', { rel: 'apple-touch-icon', href: '/favicon.png' }],
    ['meta', { name: 'theme-color', content: '#d97706' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:title', content: 'Claude Code 通关指南' }],
    ['meta', { property: 'og:site_name', content: 'Claude Code 通关指南' }],
    ['meta', { property: 'og:url', content: 'https://claudecodelearning.com' }],
    ['meta', { property: 'og:description', content: '从零到熟练，把 Claude Code 一关一关学会的通关指南。不收费、不卖课、完全开源。' }],
  ],

  themeConfig: {
    logo: '/favicon.png',
    siteTitle: 'Claude Code 通关指南',

    nav: [
      { text: '快速上手', link: '/getting-started/', activeMatch: '/getting-started/' },
      { text: '基础使用', link: '/basics/', activeMatch: '/basics/' },
      { text: '进阶使用', link: '/advanced/', activeMatch: '/advanced/' },
      { text: '工具箱', link: '/reference/', activeMatch: '/reference/' },
      { text: '工具迁移与协同', link: '/tool-migration/', activeMatch: '/tool-migration/' },
      { text: '探讨交流', link: '/community', activeMatch: '/community' },
    ],

    sidebar: [
      // ── 板块1：快速上手 ──────────────────────────────────────
      {
        text: '🚀 快速上手',
        collapsed: false,
        items: [
          { text: '章节导读', link: '/getting-started/' },
          {
            text: '1.1 安装',
            link: '/getting-started/installation',
            collapsed: true,
            items: [
              { text: '1.1a 其他安装方法', link: '/getting-started/installation-alternatives' },
              { text: '1.1b 安装排错', link: '/getting-started/installation-troubleshoot' },
              { text: '1.1c Linux 与 WSL', link: '/getting-started/linux-wsl' },
              { text: '1.1d 网络配置', link: '/getting-started/network' },
            ]
          },
          {
            text: '1.2 接入模型',
            link: '/getting-started/api-key-setup',
            collapsed: true,
            items: [
              { text: '1.2a Claude（Anthropic）', link: '/getting-started/connect-claude' },
              { text: '1.2b 智谱 GLM', link: '/getting-started/connect-zhipu' },
              { text: '1.2c MiniMax', link: '/getting-started/connect-minimax' },
              { text: '1.2d OpenAI（GPT）', link: '/getting-started/connect-openai' },
              { text: '1.2e DeepSeek', link: '/getting-started/connect-deepseek' },
              { text: '1.2f 通义千问', link: '/getting-started/connect-qwen' },
              { text: '1.2g 中转站', link: '/getting-started/connect-relay' },
              { text: '1.2h cc switch（推荐）', link: '/getting-started/connect-cc-switch' },
            ]
          },
          { text: '1.3 第一次对话', link: '/getting-started/first-conversation' },
          { text: '1.4 初始化项目', link: '/getting-started/project-init' },
          { text: '1.5 如何更新与排错', link: '/getting-started/update' },
        ]
      },

      // ── 板块2：基础使用 ──────────────────────────────────────
      {
        text: '⚙️ 基础使用',
        collapsed: false,
        items: [
          { text: '章节导读', link: '/basics/' },
          { text: '2.1 界面概览', link: '/basics/interface-overview' },
          { text: '2.2 快捷键详解', link: '/basics/keyboard-shortcuts' },
          { text: '2.3 斜杠命令指南', link: '/basics/slash-commands' },
          { text: '2.4 权限系统', link: '/basics/permissions' },
          { text: '2.5 文件引用与上下文', link: '/basics/file-references' },
          { text: '2.6 会话管理', link: '/basics/session-management' },
          { text: '2.7 CLAUDE.md 与项目配置', link: '/basics/claude-md' },
          { text: '2.8 内存与记忆系统', link: '/basics/memory-system' },
          { text: '2.9 Hooks 系统', link: '/basics/hooks' },
          { text: '2.10 多模型与思考模式', link: '/basics/models-and-thinking' },
          { text: '2.11 IDE 集成', link: '/basics/ide-integration' },
          { text: '2.12 MCP 服务器', link: '/basics/mcp-servers' },
          { text: '2.13 批处理模式', link: '/basics/batch-mode' },
          { text: '2.14 Git 入门', link: '/basics/git-basics' },
        ]
      },

      // ── 板块3：进阶使用 ──────────────────────────────────────
      {
        text: '🧠 进阶使用',
        collapsed: false,
        items: [
          { text: '章节导读', link: '/advanced/' },
          { text: '3.1 扩展思考模式', link: '/advanced/extended-thinking' },
          { text: '3.2 多 Agent 并行编排', link: '/advanced/multi-agent' },
          { text: '3.3 Git Worktree 并行实例', link: '/advanced/worktree-parallel' },
          { text: '3.4 Hooks 自动化工作流', link: '/advanced/hooks-automation' },
          { text: '3.5 自定义斜杠命令', link: '/advanced/custom-commands' },
          { text: '3.6 图片与多模态', link: '/advanced/vision-multimodal' },
          { text: '3.7 MCP 实战配置与案例', link: '/advanced/mcp-in-practice' },
          { text: '3.8 cc switch 完整功能解析', link: '/advanced/cc-switch' },
          {
            text: '3.9 Skills 专题',
            link: '/advanced/skills',
            collapsed: true,
            items: [
              { text: '3.9a 基础关：什么是 Skill', link: '/advanced/skills-basics' },
              { text: '3.9b 困难关：找到和活用 Skill', link: '/advanced/skills-advanced' },
            ]
          },
          { text: '3.10 Git 工作流整合', link: '/advanced/git-workflow' },
          { text: '3.11 大型代码库处理', link: '/advanced/large-codebase' },
          { text: '3.12 提示词进阶', link: '/advanced/prompt-advanced' },
          { text: '3.13 调试与排错', link: '/advanced/debug-workflow' },
          { text: '3.14 远程控制：手机操控 Claude Code', link: '/advanced/remote-control' },
          { text: '3.15 沙箱模式', link: '/advanced/sandbox' },
        ]
      },

      // ── 板块4：工具箱 ────────────────────────────────────────
      {
        text: '🧰 工具箱',
        collapsed: true,
        items: [
          { text: '工具箱说明', link: '/reference/' },
          { text: 'A. 快捷键速查', link: '/reference/keyboard-shortcuts' },
          { text: 'B. Vim 模式速查', link: '/reference/vim-mode' },
          { text: 'C. 斜杠命令速查', link: '/reference/slash-commands' },
          { text: 'D. CLI 参数速查', link: '/reference/cli-flags' },
          { text: 'E. 配置选项速查', link: '/reference/config-options' },
          { text: 'F. 平台接入速查', link: '/reference/platforms' },
          { text: 'G. 环境变量速查', link: '/reference/env-vars' },
          { text: 'H. 错误信息速查', link: '/reference/errors' },
        ]
      },

      // ── 板块5：工具迁移与协同 ─────────────────────────────────
      {
        text: '🔄 工具迁移与协同',
        collapsed: true,
        items: [
          { text: '章节导读', link: '/tool-migration/' },
          { text: '5.1 从独立编程 Agent 迁移', link: '/tool-migration/from-agents' },
          { text: '5.2 从 IDE 内嵌助手迁移', link: '/tool-migration/from-ide' },
          { text: '5.3 从网页版 AI 迁移', link: '/tool-migration/from-web' },
          { text: '5.4 多工具协同（双开 / 多开）', link: '/tool-migration/multi-tool' },
        ]
      },
    ],

    docFooter: {
      prev: '上一课',
      next: '下一课'
    },

    outline: {
      level: [2, 3],
      label: '本页目录'
    },

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '没有找到相关内容',
                resetButtonTitle: '清除搜索',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Gh-Xingxing/claude-code-learning' }
    ],

    lastUpdated: {
      text: '最后更新于',
    },

    footer: {
      message: '本站内容基于 Claude Code 官方文档与真实使用经验整理 · 采用 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh" target="_blank" rel="noopener noreferrer">CC BY-NC-SA 4.0</a> 协议',
      copyright: '© 2026 Claude Code 通关指南'
    }
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true,
    container: {
      tipLabel: '提示',
      warningLabel: '注意',
      dangerLabel: '警告',
      infoLabel: '信息',
      detailsLabel: '详情'
    }
  }
})
