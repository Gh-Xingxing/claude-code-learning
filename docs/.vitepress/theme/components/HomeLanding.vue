<script setup>
// ── 优势卡（增删卡片改这里即可，无需动模板） ──
const whyCards = [
  { icon: '🎮', title: '闯关式学习体验', desc: '把高门槛工具拆成一关一关的挑战，感受玩中学的快感。', cta: '从第一关开始', link: '/getting-started/' },
  { icon: '💸', title: '所有内容均不收费', desc: '内容完全开源，没有付费门槛，放心使用。', cta: null, link: null },
  { icon: '📖', title: '随时随地可以翻阅', desc: '可以随时翻阅、学习、对照的教程网站。你可以把它当成一份便携手册。', cta: '翻翻工具箱', link: '/reference/' },
  { icon: '🔓', title: '国内使用无门槛', desc: '不止有官方模型接入教程，还手把手带你配置国产大模型，GLM / DeepSeek / MiniMax 等模型均有讲解。', cta: '了解如何接入国产模型', link: '/getting-started/api-key-setup' },
  { icon: '🔀', title: 'cc switch 深度解读', desc: '一键切换不同模型与服务商、快速同步各工具的配置、多 Agent 工具使用者的必备神器。', cta: '去看看 cc switch', link: '/advanced/cc-switch' },
  { icon: '🧩', title: 'Skills 专题精讲', desc: '从“什么是 Skill”到“怎么找到并活用 Skill”，由浅入深，通关即毕业。', cta: '传送至 Skills 专题', link: '/advanced/skills' },
  { icon: '✅', title: '内容来源真实可信', desc: '每篇都基于 Claude Code 官方文档 + 真实使用体验反复打磨，致力于带来最佳的使用体验。', cta: null, link: null },
  { icon: '🖥️', title: '界面概览', desc: 'Claude Code 跑在终端里时，界面跟普通聊天框完全不同。本站把这套独特界面拆解透彻，看完就能上手。', cta: '查看界面概览', link: '/basics/interface-overview' },
  { icon: '🧗', title: '深入闯关学习', desc: 'MCP、多 Agent、Hooks、Worktree、自定义命令、手机远程操控……各式各样的高阶内容都在进阶关里。', cta: '深入进阶使用', link: '/advanced/' },
]

// ── 主线关卡（含可选支线 branch） ──
const levels = [
  {
    n: '1', name: '🚀 快速上手', link: '/getting-started/',
    feat: '第一次碰 Claude Code？这关带你装好、接上模型、跑完第一次对话。',
    loot: '🏆 通关战利品：能装、能连模型、能对话，30~45 分钟上手',
    enter: '进入第一章节',
    branch: { tag: '支线 · 传送门', name: '🔄 工具迁移与协同', link: '/tool-migration/', enter: '走传送门',
      feat: '用过 Cursor / Copilot / 网页 AI？让这个支线成为前置关卡能更快学习上手。' },
  },
  {
    n: '2', name: '⚙️ 基础使用', link: '/basics/',
    feat: '了解掌握日常要用的操作，从“能跑”到“会用”。',
    loot: '🏆 战利品：深入了解 界面 / 快捷键 / 命令 / 会话 / 权限 / 记忆 / Git 等基础功能',
    enter: '进入第二章节',
    branch: null,
  },
  {
    n: '3', name: '🧠 进阶使用', link: '/advanced/',
    feat: '收集高阶功能技巧，玩出跟别人不一样的花样。',
    loot: '🏆 战利品：攻克 MCP / 多 Agent / Hooks / Worktree / 远程控制 等高阶技能',
    enter: '进入第三章节',
    branch: { tag: '支线 · 随身补给', name: '🧰 工具箱', link: '/reference/', enter: '打开速查表',
      feat: '忘了某个快捷键 / 命令 / 参数 / 报错？随时翻回来查，高密度速查。' },
  },
]

// ── 介绍区·优点滚动卡片（上行） ──
const feats1 = [
  { icon: '🏆', title: '顶尖智能体框架', desc: '复杂、长链路的任务也能细化拆解、一步步做完。' },
  { icon: '🛠️', title: '模型自己动手操作', desc: '读写文件、执行命令、审查代码，只需要你发出指令。' },
  { icon: '🔀', title: '模型自由切换', desc: '支持接入各大顶尖模型，满足多样化需求。' },
  { icon: '📝', title: '不只会写代码', desc: '文档、知识整理、日常事务，都能放心交给它。' },
  { icon: '🧠', title: '能读懂整个项目', desc: '超长上下文，大型代码库、长文档也能整体把握。' },
  { icon: '🧭', title: '会自己规划', desc: '先拆解任务、定好方案，再一步步执行落地。' },
]
// ── 介绍区·优点滚动卡片（下行） ──
const feats2 = [
  { icon: '⌨️', title: '终端原生', desc: '天生适合自动化、批量处理，能融进你的任何工作流。' },
  { icon: '💻', title: '全系统支持', desc: 'macOS、Windows、Linux，各种系统的电脑都能用。' },
  { icon: '🧩', title: '支持接入扩展', desc: 'Skills、MCP、Hooks 等多种扩展均可配置，探索意想不到的能力边界。' },
  { icon: '🖼️', title: '能看懂图片', desc: '截图、设计稿、报错图都能直接读懂（多模态）。' },
  { icon: '⏪', title: '随时可回溯', desc: '改错了能一键倒回之前的状态，放手让它干也心里有底。' },
  { icon: '🤝', title: '多 Agent 协作', desc: '复杂任务还能派出子 agent 并行处理多个任务，效率翻倍。' },
]
</script>

<template>
<div class="home-landing">

  <!-- HERO -->
  <header class="hero">
    <div class="wrap">
      <h1><span class="name">Claude Code</span><span class="sub">通关指南</span></h1>
      <p class="tag">零基础也能上手——让<b>高门槛工具教程</b>变成闯关挑战的游戏。</p>
      <div class="pill"><i>不收费</i><i>新手友好</i><i>完全开源</i></div>
      <div class="cta-row">
        <a class="btn btn-start" href="/getting-started/">▶ 开始闯关</a>
        <a class="btn btn-ghost" href="/reference/">🧰 翻找工具箱</a>
        <a class="btn btn-ghost" href="/community">💬 探讨交流</a>
      </div>
    </div>
  </header>

  <!-- A 什么是 Claude Code -->
  <section class="sec intro-sec">
    <div class="wrap">
      <div class="intro-head">
        <h2>什么是 <span class="hl">Claude Code</span>？</h2>
        <span class="eyebrow">⚡ 全球顶尖的 AI 编程智能体</span>
        <p class="lead">
          Claude Code 是 Anthropic 公司推出的 AI 智能体，运行在你自己的终端里。你把想做的事说清楚，它就能<b>自己读文件、做规划、改代码、执行命令、完整交付</b>，一步步把任务真正做完——它不会丢给你一段代码或步骤让你自己折腾，它会直接帮你把活干完。
        </p>
        <p class="sub">
          它背后是<b>目前公认第一梯队的 Harness 之一</b>，配上同样顶尖的 Claude 模型，能够给你带来意想不到的绝佳体验。但它也不会绑死官方模型，其他顶尖模型同样能接入使用。越来越多的人把它当作 vibe coding 工具的首选。
        </p>
      </div>
      <div class="showcase">
        <div class="mrow">
          <div class="track">
            <div class="chip" v-for="(f, i) in feats1.concat(feats1)" :key="'a' + i">
              <div class="badge">{{ f.icon }}</div>
              <div><h3>{{ f.title }}</h3><p>{{ f.desc }}</p></div>
            </div>
          </div>
        </div>
        <div class="mrow rev">
          <div class="track">
            <div class="chip" v-for="(f, i) in feats2.concat(feats2)" :key="'b' + i">
              <div class="badge">{{ f.icon }}</div>
              <div><h3>{{ f.title }}</h3><p>{{ f.desc }}</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- B 本站优势概览 -->
  <section class="sec">
    <div class="wrap">
      <div class="sec-head"><h2>本站优势概览</h2></div>
      <div class="why-grid">
        <component
          v-for="(c, i) in whyCards" :key="i"
          :is="c.link ? 'a' : 'div'" :href="c.link || undefined" class="why-card">
          <div class="ico">{{ c.icon }}</div>
          <h3>{{ c.title }}</h3>
          <p>{{ c.desc }}</p>
          <div v-if="c.cta" class="topic">{{ c.cta }} →</div>
        </component>
      </div>
    </div>
  </section>

  <!-- C 主线地图 -->
  <section class="sec sec-map">
    <div class="wrap">
      <div class="sec-head">
        <div class="kicker">MAIN QUEST MAP</div>
        <h2>🗺️ 通关主线地图</h2>
        <p>主线三个章节从零闯到熟练掌握，两条支线按需查看、随取随用。选择最适合你的章节开始吧！</p>
      </div>

      <div class="map">
        <div class="row" v-for="lv in levels" :key="lv.n">
          <div class="cell-l">
            <a class="lv-card" :href="lv.link">
              <div class="lv-name">{{ lv.name }}</div>
              <div class="feat">{{ lv.feat }}</div>
              <div class="loot">{{ lv.loot }}</div>
              <div class="enter">{{ lv.enter }} →</div>
            </a>
          </div>
          <div class="node">{{ lv.n }}</div>
          <div class="cell-r">
            <a v-if="lv.branch" class="branch" :href="lv.branch.link">
              <span class="btag">{{ lv.branch.tag }}</span>
              <div class="lv-name">{{ lv.branch.name }}</div>
              <div class="feat">{{ lv.branch.feat }}</div>
              <div class="enter">{{ lv.branch.enter }} →</div>
            </a>
          </div>
        </div>

        <div class="map-end">
          <div class="node-end">…</div>
          <div class="soon">🚧 新关卡还在加急制作中，敬请期待...</div>
        </div>
      </div>
    </div>
  </section>

  <!-- 底部双入口 -->
  <section class="sec">
    <div class="wrap">
      <div class="final">
        <h2>准备好了？<br>从第一关开始吧！</h2>
        <div class="two">
          <div class="col">
            <div class="cap">一台电脑、一个终端，照着做就能通关。</div>
            <a class="btn btn-start" href="/getting-started/">▶ 开始闯关</a>
          </div>
          <div class="col">
            <div class="cap">闯关遇到困难了？加入社群讨论或关注网站官方账号获取最新更新资讯~</div>
            <a class="btn btn-ghost" href="/community">💬 探讨交流</a>
          </div>
        </div>
      </div>
    </div>
  </section>

</div>
</template>

<style scoped>
.home-landing{
  /* 全部走 VitePress 主题变量，自动适配明暗 */
  --card-bg: var(--vp-c-bg);
  --soft: var(--vp-c-brand-soft);
  color: var(--vp-c-text-1);
}
.home-landing :where(a){text-decoration:none;color:inherit}
.wrap{max-width:1080px;margin:0 auto;padding:0 24px}

/* ── HERO ── */
.hero{text-align:center;padding:80px 0 64px;position:relative;overflow:hidden}
.hero::before{content:"";position:absolute;inset:0;z-index:0;
  background:
    radial-gradient(58% 46% at 50% -4%,var(--vp-c-brand-soft),transparent 70%),
    linear-gradient(transparent 31px,rgba(217,119,6,.04) 32px),
    linear-gradient(90deg,transparent 31px,rgba(217,119,6,.04) 32px);
  background-size:auto,32px 32px,32px 32px}
.hero .wrap{position:relative;z-index:1}
.hero h1{line-height:1.04;letter-spacing:-1.5px}
.hero h1 .name{display:block;font-size:80px;font-weight:850;color:var(--vp-c-brand-1)}
.hero h1 .sub{display:block;font-size:58px;font-weight:850;color:var(--vp-c-text-1);margin-top:8px}
.hero p.tag{font-size:22px;font-weight:600;color:var(--vp-c-text-2);max-width:680px;margin:30px auto 0}
.hero p.tag b{color:var(--vp-c-brand-2)}
.pill{display:inline-flex;align-items:center;gap:12px;margin-top:24px;font-size:14px;font-weight:700;
  color:var(--vp-c-text-2);background:var(--card-bg);border:1px solid var(--vp-c-divider);border-radius:999px;
  padding:9px 18px}
.pill i{font-style:normal;display:inline-flex;align-items:center;gap:6px;padding-right:12px;border-right:1px solid var(--vp-c-divider)}
.pill i:last-child{border-right:0;padding-right:0}
.pill i::before{content:"✓";color:var(--vp-c-brand-1);font-weight:900}
.cta-row{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-top:36px}
.btn{padding:13px 26px;border-radius:11px;font-size:15.5px;font-weight:700;cursor:pointer;
  transition:transform .12s,box-shadow .12s,background .12s,border-color .12s;display:inline-flex;align-items:center;gap:8px}
.btn:hover{transform:translateY(-2px)}
.btn-start{background:var(--vp-c-brand-1);color:#fff;box-shadow:0 6px 16px rgba(217,119,6,.32)}
.btn-start:hover{background:var(--vp-c-brand-2);color:#fff}
.btn-ghost{background:var(--card-bg);color:var(--vp-c-text-1);border:1px solid var(--vp-c-divider)}
.btn-ghost:hover{border-color:var(--vp-c-brand-1);color:var(--vp-c-brand-1)}

/* ── 段标题 ── */
.sec{padding:60px 0}
.sec-map{background:linear-gradient(180deg,transparent,var(--vp-c-bg-soft))}
.sec-head{text-align:center;margin-bottom:40px}
.sec-head .kicker{font-size:15px;font-weight:700;color:var(--vp-c-brand-1);letter-spacing:2px}
.sec-head h2{font-size:32px;font-weight:800;margin-top:8px;letter-spacing:-.5px;border:0;padding:0}
.sec-head p{color:var(--vp-c-text-2);margin-top:10px;font-size:15.5px}
/* 主线地图：标题再大一号，并拉开与导语的距离 */
.sec-map .sec-head h2{font-size:38px}
.sec-map .sec-head p{margin-top:20px}

/* ── B 优势卡（9 张 3 列） ── */
.why-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.why-card{background:var(--card-bg);border:1px solid var(--vp-c-divider);border-radius:16px;padding:26px 24px;
  transition:transform .14s,box-shadow .14s,border-color .14s;display:flex;flex-direction:column}
.why-card:hover{transform:translateY(-4px);box-shadow:0 12px 30px rgba(0,0,0,.08);border-color:var(--vp-c-brand-1)}
.why-card .ico{font-size:30px}
.why-card h3{font-size:17.5px;margin:14px 0 9px;font-weight:750;border:0;padding:0}
.why-card p{font-size:14px;color:var(--vp-c-text-2);flex:1;line-height:1.65}
.why-card .topic{margin-top:14px;font-size:13.5px;font-weight:700;color:var(--vp-c-brand-1)}

/* ── C 主线地图 ── */
.map{position:relative;max-width:1000px;margin:0 auto;padding:10px 0 4px}
.map::before{content:"";position:absolute;left:50%;top:0;bottom:54px;width:0;
  border-left:3px dashed var(--vp-c-brand-soft);transform:translateX(-50%)}
.row{display:grid;grid-template-columns:1fr 70px 1fr;align-items:center;margin:44px 0;min-height:150px}
.node{justify-self:center;width:56px;height:56px;border-radius:50%;background:var(--vp-c-brand-1);color:#fff;
  display:flex;align-items:center;justify-content:center;font-weight:850;font-size:24px;
  box-shadow:0 4px 12px rgba(217,119,6,.4),0 0 0 7px var(--vp-c-bg);z-index:2}
.cell-l{display:flex;justify-content:flex-end}
.cell-r{display:flex;justify-content:flex-start}
.lv-card{max-width:400px;background:var(--card-bg);border:1px solid var(--vp-c-divider);border-radius:16px;
  padding:22px 24px;transition:transform .14s,box-shadow .14s,border-color .14s}
.lv-card:hover{transform:translateY(-3px);box-shadow:0 12px 30px rgba(0,0,0,.08);border-color:var(--vp-c-brand-1)}
.lv-card .lv-name{font-size:20px;font-weight:800}
.lv-card .feat{font-size:14px;color:var(--vp-c-text-2);margin:9px 0;line-height:1.65}
.lv-card .loot{font-size:13px;color:var(--vp-c-brand-2);background:var(--soft);border-radius:8px;padding:8px 11px;margin-top:10px}
.lv-card .enter{margin-top:13px;font-size:14px;font-weight:700;color:var(--vp-c-brand-1)}
.branch{max-width:360px;
  background:repeating-linear-gradient(135deg,var(--vp-c-bg),var(--vp-c-bg) 13px,var(--vp-c-bg-soft) 13px,var(--vp-c-bg-soft) 26px);
  border:1.5px dashed var(--vp-c-brand-1);border-radius:16px;padding:20px 22px;transition:transform .14s}
.branch:hover{transform:translateY(-3px)}
.branch .btag{display:inline-block;font-size:11px;font-weight:800;color:#fff;background:var(--vp-c-brand-3);padding:3px 9px;border-radius:6px}
.branch .lv-name{font-size:18px;font-weight:800;margin-top:10px}
.branch .feat{font-size:13.5px;color:var(--vp-c-text-2);margin:7px 0;line-height:1.6}
.branch .enter{font-size:13.5px;font-weight:700;color:var(--vp-c-brand-1);margin-top:6px}
.map-end{position:relative;text-align:center;margin-top:8px}
.node-end{width:56px;height:56px;border-radius:50%;background:var(--vp-c-bg);border:2px dashed var(--vp-c-brand-1);
  color:var(--vp-c-brand-1);font-weight:800;font-size:26px;display:flex;align-items:center;justify-content:center;
  margin:0 auto;box-shadow:0 0 0 7px var(--vp-c-bg)}
.soon{margin-top:14px;font-size:14.5px;color:var(--vp-c-text-2);font-weight:600}

/* ── 底部双入口 ── */
.final{margin:30px auto 0;max-width:840px;background:var(--soft);
  border:1px solid var(--vp-c-divider);border-radius:24px;padding:52px 36px;text-align:center}
.final h2{font-size:32px;font-weight:850;letter-spacing:-.5px;line-height:1.25;border:0;padding:0}
.two{display:grid;grid-template-columns:1fr 1fr;gap:28px;max-width:680px;margin:34px auto 0}
.col{display:flex;flex-direction:column}
.col .cap{flex:1;font-size:14px;color:var(--vp-c-text-2);margin-bottom:16px;
  display:flex;align-items:flex-end;justify-content:center;text-align:center;line-height:1.6}
.col .btn{align-self:center}

/* ── A 介绍区：什么是 Claude Code ── */
.intro-sec{padding:20px 0 56px}
.intro-head{max-width:820px}
.intro-head h2{font-size:34px;font-weight:800;letter-spacing:-.5px;border:0;padding:0}
.intro-head h2 .hl{color:var(--vp-c-brand-1)}
.eyebrow{display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:700;letter-spacing:.04em;
  color:var(--vp-c-brand-1);background:var(--vp-c-brand-soft);padding:6px 14px;border-radius:999px;margin-top:14px}
.intro-head .lead{font-size:18px;margin-top:18px;line-height:1.78}
.intro-head .lead b{color:var(--vp-c-text-1);font-weight:700}
.intro-head .sub{font-size:15.5px;color:var(--vp-c-text-2);margin-top:14px;line-height:1.78}
.intro-head .sub b{color:var(--vp-c-brand-2)}
.showcase{margin-top:40px;display:flex;flex-direction:column;gap:18px}
.mrow{overflow:hidden;
  -webkit-mask:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);
          mask:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.track{display:flex;gap:18px;width:max-content;animation:introMarq 60s linear infinite}
.mrow.rev .track{animation-direction:reverse}
.mrow:hover .track{animation-play-state:paused}
@keyframes introMarq{to{transform:translateX(-50%)}}
.chip{flex:0 0 auto;width:320px;background:var(--card-bg);border:1px solid var(--vp-c-divider);border-radius:18px;
  padding:20px;display:flex;gap:15px;align-items:flex-start;transition:border-color .15s,box-shadow .15s}
.chip:hover{border-color:var(--vp-c-brand-1);box-shadow:0 10px 26px rgba(0,0,0,.06)}
.chip .badge{width:46px;height:46px;border-radius:13px;display:grid;place-items:center;font-size:23px;flex:0 0 auto;
  background:var(--vp-c-brand-soft)}
.chip h3{font-size:16px;font-weight:750;line-height:1.4;border:0;padding:0;margin:0}
.chip p{font-size:13px;color:var(--vp-c-text-2);margin-top:5px;line-height:1.6}

@media(max-width:760px){
  .intro-head h2{font-size:27px}.intro-head .lead{font-size:16.5px}.chip{width:280px}
  .hero h1 .name{font-size:50px}.hero h1 .sub{font-size:30px}
  .why-grid{grid-template-columns:1fr}
  .map::before{left:28px}
  .row{grid-template-columns:56px 1fr;gap:14px}
  .node{justify-self:start;grid-column:1;grid-row:1}
  .cell-l,.cell-r{justify-content:flex-start;grid-column:2}
  .cell-l{grid-row:1}.cell-r{grid-row:2}
  .node-end{margin:0 auto 0 6px}
  .two{grid-template-columns:1fr;gap:22px}
}
</style>
