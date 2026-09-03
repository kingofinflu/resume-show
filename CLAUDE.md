@AGENTS.md

# resume-show 项目文档

## 项目概述

个人简历展示网站。求职方向:**AI 产品经理**(陈思言,华中科技大学预防医学本科 → 复旦大学流行病与卫生统计学硕士在读,百度商业产品与阿里夸克 AGI 产品实习经验)。

**定位**:不是 PDF 的网页翻版,而是"个人年度报告"式的滚动叙事简历:
- **网页版**:数据化 + 电影感叙事——滚动驱动的章节故事线(Chapter 00 开场 → 01 医学生 → 02 跨界 AI → 03 项目实战 → 04 荣誉),大量量化指标以图表/大数字呈现
- **打印版**:同一份数据打印出传统 A4 简历(2 页),`Ctrl+P` 即可另存 PDF
- **中英双语**:右上角一键切换,默认中文

## 技术栈

- Next.js 16.3.4(App Router)+ React 19.2.8 + TypeScript + Tailwind CSS 4
- 动画:`motion`(framer-motion v13),声明式 API,不用 GSAP
- 图表:全部手写 SVG/CSS(≤8 个图表,不引 recharts)
- 纯静态导出(`output: 'export'`),无服务端、无 API routes、无 Server Actions
- 部署:GitHub Pages(basePath `/resume-show`)

> ⚠️ Next.js 16 有大量破坏性变更,写代码前先查 `node_modules/next/dist/docs/` 里的对应指南,注意弃用提示。

## 常用命令

```bash
npm run dev       # 本地开发 http://localhost:3000(无 basePath)
npm run build     # 静态导出,产物在 out/
npx serve out     # 本地预览静态产物(验证 basePath 用)
npm run lint      # ESLint
```

## 目录结构

```
app/
  layout.tsx            # metadata、字体、防闪烁脚本(主题+语言)
  page.tsx              # 组装屏幕版章节流 + 打印版 PrintResume
  globals.css           # @theme 设计令牌、@custom-variant dark、@media print 规则
components/
  site/                 # ScrollProgress、Navbar、Footer、ThemeToggle、LocaleToggle、PrintButton
  story/                # Hero、ChapterShell、Chapter01~04 章节组件
  viz/                  # CountUp、StatTile、MetricBars、BeforeAfterBars、PercentileBar、SkillRadar
  ui/                   # Reveal、Tag、SectionLabel
  print/PrintResume.tsx # A4 打印版简历(print-only,共用数据源)
data/resume.ts          # ★ 单一数据源(全站内容,中英双语)
lib/
  i18n.tsx              # LocaleProvider + useLocale + t()
  format.ts             # 数字格式化与派生计算(前1.22% → 超越98.78% 等)
  motion.ts             # 集中导出的动画 variants/过渡常量
  site.ts               # withBase() 处理 basePath、站点常量
hooks/                  # useTheme.ts、useIsMobile.ts
docs/resume-ref/        # PDF 渲染参考图(内容核对用)
public/                 # .nojekyll(必须)、favicon、fonts/
.github/workflows/deploy.yml
```

## 核心架构决策

### 1. 单一数据源(data/resume.ts)

**改简历 = 只改 `data/resume.ts` 一个文件**,网页版、图表、打印 PDF 全部自动同步,禁止在任何组件里硬编码简历内容。

- 文件内每个字段带中文注释说明含义与示例
- TypeScript 类型即校验:字段漏填、类型填错在编译时报错
- 增删条目(新实习/新项目/新荣誉)= 在对应数组里增删一个对象
- 派生数字(百分位→超越比、delta 计算)不落库,由 `lib/format.ts` 计算
- 指标 `description` 字段(口径说明)**必填**——55.60%、13.80% 这类数字不写明口径就是误导
- **数字指标统一保留两位小数**(如 94.60%、1.22%),由 `formatValue` 统一处理;计数字段(几段实习、几个产品)例外,显式 `precision: 0`
- **措辞用产品语言,不用开发技术栈词汇**:岗位是产品方向,项目字段是 `methods`(关键机制,如 LLM Judge、置信度评估),不是 `stack`

### 2. 双语方案

- 所有文本字段用 `type L = { zh: string; en: string }`,数字指标共享,结构保持单一
- `lib/i18n.tsx` 提供 LocaleProvider / useLocale / `t(l)`,locale 存 localStorage,默认 zh
- layout 内联脚本在 hydration 前设 `data-locale` 防闪烁
- 静态导出下 SEO 以默认 zh 为主,切换为纯客户端行为;打印版跟随当前语言

### 3. 打印方案

- `page.tsx` 双份渲染:`<main className="print:hidden">` 屏幕版 + `<div className="hidden print:block">` 打印版
- `@media print`:`@page { size: A4 }`、强制浅色主题变量、`[data-animate] { opacity:1!important; transform:none!important }`(否则未入视口的动画元素打印出空白——所有动画组件必须统一挂 `data-animate` 属性)
- PrintResume 分节 `break-inside: avoid`,约 2 页;入口是 PrintButton 调 `window.print()`

### 4. 动画约定

- 全站入场动画走 `ui/Reveal.tsx`(`whileInView` + `once: true`),禁止各组件自写重复 variants
- 章节滚动叙事骨架:外层 `min-h-[200vh]` + 内层 `sticky top-0 h-[100svh]`,`useScroll({ target, offset })` 驱动
- 全局 `<MotionConfig reducedMotion="user">`;移动端(useIsMobile)降级为普通滚动 + 入场动画,不做 sticky scrubbing
- 章节内容 SSR 输出,动画只在客户端 hydrate 后叠加

### 5. 静态导出与 basePath

- `next.config.ts`:`output: 'export'`;`basePath: NODE_ENV === 'production' ? '/resume-show' : ''`(仓库名与 basePath 必须一致);`trailingSlash: true`;`images.unoptimized: true`
- 手写 `<img src>` 一律走 `lib/site.ts` 的 `withBase()`;next/link 与 Next 自身资源自动带 basePath
- 静态导出禁用:cookies()/headers()/动态路由参数/Server Actions/rewrites
- `public/.nojekyll` 必须存在,否则 GH Pages 忽略 `_next` 导致资源 404

## 设计规范

### 配色(医学 × AI,已通过色觉无障碍校验,勿凭感觉微调)

- 分类色浅色:蓝 `#2a78d6` / 橙 `#eb6834` / 医学青 `#0d9488` / 荣誉金 `#eda100` / AI 紫 `#4a3aa7`;深色台阶:`#3987e5` / `#d95926` / `#1dab8f` / `#c98500` / `#9085e9`
- teal 顺序 ramp(条形图):浅色 `#14b8a6 → #0d9488 → #0f766e → #115e59`;深色 `#2dd4bf → #14b8a6 → #0d9488 → #0f766e`
- 状态色(仅问题指标,必配 icon+文字):good `#0ca30c` / warning `#fab219` / serious `#ec835a` / critical `#d03b3b`
- 表面/墨色:浅色底 `#f9f9f7`、卡片 `#fcfcfb`、主墨 `#0b0b0b`;深色底 `#0b1220`、主墨 `#ffffff`
- 语义映射:医学青 = 医学章节;AI 紫 = 跨界/AI;数据蓝 = 图表主色;荣誉金 = Ch04
- 文本永远用墨色 token,系列身份由色块/线键承载

### 字体

- 中文:系统字体栈(-apple-system, PingFang SC, HarmonyOS Sans SC, Microsoft YaHei),**不加载中文 webfont**
- 数字/Latin:自托管 Space Grotesk woff2(`next/font/local`)。**禁用 `next/font/google`**(国内构建访问 Google Fonts 常失败)
- 大数字用比例数字,表格/坐标轴数字用 `tabular-nums`

### 图表规范

- 柱宽 ≤24px、数据端 4px 圆角、从同一基线生长
- 单 hero figure 原则;柱顶只标 highlight 柱与问题柱,不每柱都标
- 每个图表配折叠 `<table>` 数据视图(无障碍 + 打印版指标来源)
- hover tooltip 命中区大于图形本身;暗色模式是单独调校的色板,不是自动反色

## 部署(GitHub Pages)

- 仓库:**私有** `resume-show`(用户要求暂不公开;GitHub Pages 免费版仅支持公开仓库,正式发布前需改公开或另选托管平台)
- `.github/workflows/deploy.yml`:push master → build → upload-pages-artifact → deploy-pages;仓库 Settings → Pages → Source 选 **GitHub Actions**
- 首次部署有几分钟生效延迟;仓库名必须与 basePath 一致
- 推送/公开仓库等操作前必须与用户确认(红线操作)

## Skills 使用说明

项目 `.claude/skills/` 下已放置 14 个 superpowers 插件技能,Claude Code 会在对应场景自动触发,**不要手动猜调用时机,由技能描述决定**:

| Skill | 触发场景 |
|---|---|
| `using-superpowers` | 每次对话开始——确立如何发现和使用技能,在回答(含澄清问题)前调用 |
| `brainstorming` | 任何创造性工作前(新功能、组件、行为修改)——先探清意图与需求再实现 |
| `writing-plans` | 有多步骤任务需求/规格,写代码之前 |
| `executing-plans` | 执行已有书面实施计划(跨会话、带检查点) |
| `subagent-driven-development` | 当前会话内执行含独立任务的实施计划 |
| `test-driven-development` | 实现任何功能或 bugfix 前,先写测试 |
| `systematic-debugging` | 遇到任何 bug、测试失败、异常行为,提修复方案前 |
| `requesting-code-review` | 完成任务、实现大功能、合并前验证工作符合要求 |
| `receiving-code-review` | 收到代码评审反馈、实现建议前(要求技术严谨,不盲从) |
| `verification-before-completion` | 声称"完成/修复/通过"前——先跑验证命令并确认输出,证据先于断言 |
| `dispatching-parallel-agents` | 面对 2+ 个无共享状态、无顺序依赖的独立任务 |
| `using-git-worktrees` | 需要与当前工作区隔离的功能开发,或执行实施计划前 |
| `finishing-a-development-branch` | 实现完成、测试全过,决定如何合入工作 |
| `writing-skills` | 创建/编辑/验证技能 |

每个技能的完整指令在其对应目录 `SKILL.md` 中,调用后以技能指令为准。
