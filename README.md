# resume-show

个人简历展示网站 —— "个人年度报告"式的滚动叙事简历:网页版做数据化 + 电影感叙事,同一份数据打印出传统 A4 简历。

- 求职方向:AI 产品经理(医学统计 × AI 产品跨界)
- 技术栈:Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + motion,纯静态导出
- 中英双语切换、暗色模式、移动端适配

## 本地开发

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 静态导出到 out/
npx serve out      # 本地预览生产构建
```

## 改简历

**只改 `data/resume.ts` 一个文件**:网页版、图表、打印 PDF 全部自动同步。

- 每个字段带中文注释与双语 `{ zh, en }` 结构,类型校验兜底
- 同一指标在 hero/实习/项目多处展示时引用同一个常量,改一处全站生效
- 数字统一两位小数(计数类除外),派生数值(提升幅度等)由 `lib/format.ts` 自动计算
- 不确定的内容标有 `TODO`,发布前请核对

## 部署

GitHub Pages(仓库名 `resume-show`,basePath 已配置):

1. 在 GitHub 新建仓库 `resume-show`(公开 —— GitHub Pages 免费版不支持私有仓库)
2. `git remote add origin git@github.com:<你的用户名>/resume-show.git && git push -u origin master`
3. Settings → Pages → Source 选 **GitHub Actions**(工作流已内置)
4. 访问 `https://<你的用户名>.github.io/resume-show/`

## 打印简历

网页右上角「打印简历」或 `Ctrl+P` → 另存为 PDF,输出 2 页 A4(打印版跟随当前语言)。

## 项目约定

详见 [CLAUDE.md](CLAUDE.md):设计色板、动画约定、单一数据源规则、Skills 说明。
