/**
 * ★ 简历单一数据源 ★
 * 改简历 = 只改这个文件。网页版、图表、打印 PDF 全部自动同步。
 *
 * 规则:
 * - 每个文本字段是 { zh, en } 双语对象;数字指标共享,不用写两遍
 * - 同一指标多处展示(hero/实习/项目)引用同一个 Metric 常量,改一处全站同步
 * - 指标 description(口径说明)必填 —— 不写明口径的数字就是误导
 * - 增删条目 = 在对应数组里增删一个对象,章节组件不用动
 * - 派生数字(前后提升幅度、百分比格式)不要写死,由 lib/format.ts 计算
 * - 岗位是产品方向,内容措辞用产品语言(机制、链路、指标),不用开发技术栈词汇
 * - 不确定的内容用 TODO 标注,待确认
 */

// ---------- 基础类型 ----------

/** 双语文本 */
export type L = { zh: string; en: string };

/** 指标数值方向:数值上升是好事(up-good)还是下降是好事(down-good,如幻觉率) */
export type Polarity = "up-good" | "down-good";

/** 问题指标状态色(仅用于标注异常指标,必须配文字说明) */
export type Status = "good" | "warning" | "serious" | "critical";

export interface Metric {
  id: string;
  /** 指标名,如 "意图识别准确率" */
  label: L;
  /** 当前值(提升后的值),如 94.6 */
  value: number;
  /** 单位,省略时默认为 "%",计数类指标显式传 "" */
  unit?: "%" | "pp" | "x" | "个" | "周" | "天" | "";
  /** 小数位,默认 2(全站数字统一两位小数);计数类字段显式填 0 */
  precision?: number;
  /** 口径说明:这个数字怎么算出来的、代表什么 —— 必填 */
  description: L;
  /** 前后对比的基线值(提升前的值)。有 baseline 时图表用对比形式展示 */
  baseline?: number;
  /** 视觉强调(每张图最多 1 个) */
  highlight?: boolean;
  /** 数值方向(用于提升/降低的配色) */
  polarity?: Polarity;
  /** 仅问题指标用(如幻觉率),配 status 色 + 文字,不能只有颜色 */
  status?: Status;
}

export interface TimelineItem {
  id: string;
  /** 标题:学校/公司/项目名 */
  title: L;
  /** 副标题:学位/职位/角色 */
  subtitle: L;
  /** 开始时间,如 "2019.09" */
  start: string;
  /** 结束时间,"至今" 或 "2024.06" */
  end: string;
  current?: boolean;
}

export interface Education extends TimelineItem {
  /** 专业 */
  major: L;
  /** 学校标签,如 "985 · 211" */
  badge: L;
  /** 主修课程与成绩 */
  courses: L[];
}

export interface Experience extends TimelineItem {
  /** 公司 */
  company: L;
  /** 一句话定位 */
  summary: L;
  /** 分点成果 */
  achievements: L[];
  /** 关键指标(用于卡片/图表) */
  metrics: Metric[];
  /** 领域标签(产品/业务词,不是开发技术栈) */
  tags: L[];
  /** 收束叙事段(可选,如医学背景反哺商业产品) */
  outro?: L;
}

/** 项目(阿里夸克 4 个战役,Ch03 数据重章内容) */
export interface Project extends TimelineItem {
  category: "intent" | "agent-loop" | "skill" | "evaluation";
  /** 一句话概括 */
  summary: L;
  /** 叙事锚点:遇到的问题 */
  challenge: L;
  /** 怎么解决的 */
  solution: L;
  /** 关键数据 */
  metrics: Metric[];
  /** 关键机制/方法(产品语言,如 LLM Judge、置信度评估) */
  methods: L[];
}

export interface Honor {
  id: string;
  /** 荣誉名(含量化信息,如 "专业学分排名年级前 30%") */
  name: L;
  /** 次数,如 2 */
  count?: number;
  /** 所属阶段 */
  stage: "fudan" | "hust";
  /** 百分位:30 表示 "前 30%"(供图表使用,名称里已含该信息) */
  percentile?: number;
  /** 级别(名称里已含级别词时用于分组/筛选) */
  level: "national" | "provincial" | "school";
}

export interface Skill {
  id: string;
  name: L;
  /** 0-100 自评(雷达图/条形图用) */
  level: number;
  /** 分类:数据分析 / AI 工具 / 产品设计 */
  category: "data" | "ai" | "design";
  /** 是否进入技能雷达图(雷达图建议 ≤6 轴,选代表性技能) */
  radar?: boolean;
}

export interface Trait {
  id: string;
  title: L;
  body: L;
  /** 可选 emoji 图标(数据驱动,不按索引绑定) */
  emoji?: string;
}

export interface Chapter {
  id: string;
  /** 章节序号 00-04 */
  index: string;
  title: L;
  /** 一句话剧情 */
  subtitle: L;
  /** 章节主题色 */
  accent: "teal" | "violet" | "blue" | "gold";
}

export interface ResumeData {
  meta: {
    /** SEO 标题 */
    siteTitle: L;
    /** SEO 描述 */
    description: L;
    /** GitHub Pages 仓库名(basePath 依据,改仓库名时同步改 next.config.ts) */
    repoName: string;
  };
  contact: {
    name: L; // TODO: 核对姓名(OCR 识别为"陈思言")
    title: L; // TODO: 核对求职意向(图中为 "AI产品经理")
    phone: string;
    email: string;
    /** 一句话人设 */
    tagline: L;
  };
  /** Hero 副标题(一句话人设) */
  summary: L;
  /** Hero KPI 行(4 个大数字) */
  heroStats: Metric[];
  education: Education[];
  /** Ch01 收束叙事段 */
  educationOutro: L;
  experiences: Experience[];
  projects: Project[];
  /** Ch03 章节引言 */
  projectsIntro: L;
  honors: Honor[];
  skills: Skill[];
  /** 自我评价(个人特色,收尾用) */
  traits: Trait[];
  chapters: Chapter[];
}

// ---------- 共享指标常量(单一数据源:hero/实习/项目引用同一对象) ----------

const mInternships: Metric = {
  id: "m-internships",
  label: { zh: "大厂产品实习", en: "Product Internships" },
  value: 2,
  unit: "",
  precision: 0,
  description: { zh: "百度 + 阿里巴巴夸克 AGI 两段产品实习", en: "Two product internships at Baidu and Alibaba Quark AGI" },
};

const mProduct01: Metric = {
  id: "m-product-01",
  label: { zh: "AI 产品 0→1", en: "AI Product 0→1" },
  value: 1,
  unit: "",
  precision: 0,
  description: { zh: "夸克 AI 浏览器 0→1 产品落地搭建", en: "Built Quark AI browser product from 0 to 1" },
};

const mIntentAcc: Metric = {
  id: "m-intent-acc",
  label: { zh: "意图识别准确率", en: "Intent Accuracy" },
  value: 94.6,
  baseline: 78.4,
  description: { zh: "用户意图识别准确率,由 78.40% 提升至 94.60%", en: "User intent accuracy: 78.40% → 94.60%" },
  highlight: true,
};

const mFieldAcc: Metric = {
  id: "m-field-acc",
  label: { zh: "上下文关键字段准确率", en: "Key Field Accuracy" },
  value: 86.8,
  baseline: 55.6,
  description: { zh: "上下文关键字段准确率,由 55.60% 提升至 86.80%", en: "Key context field accuracy: 55.60% → 86.80%" },
};

const mHallucination: Metric = {
  id: "m-hallu",
  label: { zh: "幻觉率", en: "Hallucination Rate" },
  value: 3.7,
  baseline: 13.8,
  polarity: "down-good",
  status: "serious",
  description: { zh: "模型回答幻觉率,由 13.80% 降至 3.70%,通过结构化上下文、来源展示与读取失败提示降低不确定性", en: "Hallucination rate dropped from 13.80% to 3.70% via structured context and source display" },
};

const mAgentCompletion: Metric = {
  id: "m-agent-comp",
  label: { zh: "Agent 任务完成率", en: "Agent Task Completion" },
  value: 90.8,
  baseline: 53.1,
  description: { zh: "Agent 任务完成率,从内测基线 53.10% 提升至 90.80%", en: "Agent task completion: 53.10% baseline → 90.80%" },
};

const mAgentD1: Metric = {
  id: "m-agent-d1",
  label: { zh: "次日留存", en: "Day-1 Retention" },
  value: 48.6,
  description: { zh: "使用 agent 任务功能的用户次日留存率达 48.60%", en: "Day-1 retention of agent feature users: 48.60%" },
};

const mAgentD7: Metric = {
  id: "m-agent-d7",
  label: { zh: "7 日留存", en: "Day-7 Retention" },
  value: 32.7,
  description: { zh: "7 日留存率 32.70%,有效拉动用户留存提升", en: "Day-7 retention: 32.70%" },
};

const mSkillD1: Metric = {
  id: "m-skill-d1",
  label: { zh: "沉淀用户次日留存", en: "Skill Users Day-1 Retention" },
  value: 56.4,
  description: { zh: "沉淀 skill 的用户次日留存率达 56.40%,7 日留存率 41.80%", en: "Day-1 56.40%, day-7 41.80%" },
};

const mSkillReuseD1: Metric = {
  id: "m-skill-reuse-d1",
  label: { zh: "复用用户次日留存", en: "Reusers Day-1 Retention" },
  value: 63.1,
  description: { zh: "7 天内复用 skill 的用户次日留存率达 63.10%,7 日留存率 49.50%", en: "Day-1 63.10%, day-7 49.50%" },
  highlight: true,
};

const mMultiTask: Metric = {
  id: "m-multi-task",
  label: { zh: "多步任务完成率", en: "Multi-step Task Completion" },
  value: 86.3,
  baseline: 41.6,
  description: { zh: "多步任务完成率,由 41.60% 提升至 86.30%", en: "41.60% → 86.30%" },
  highlight: true,
};

const mAdoption: Metric = {
  id: "m-adoption",
  label: { zh: "结果采纳率", en: "Result Adoption" },
  value: 73.5,
  baseline: 42.8,
  description: { zh: "结果采纳率,由 42.80% 提升至 73.50%", en: "42.80% → 73.50%" },
};

const mCtr: Metric = {
  id: "m-ctr",
  label: { zh: "广告点击率提升", en: "CTR Lift" },
  value: 1.22,
  description: { zh: "AB 试验:广告点击率显著提升 1.22%", en: "A/B test: CTR significantly lifted by 1.22%" },
};

const mCvr: Metric = {
  id: "m-cvr",
  label: { zh: "转化率提升", en: "CVR Lift" },
  value: 2.15,
  description: { zh: "AB 试验:转化率显著提升 2.15%", en: "A/B test: CVR significantly lifted by 2.15%" },
};

const mCost: Metric = {
  id: "m-cost",
  label: { zh: "素材配置耗时降低", en: "Config Time Reduction" },
  value: 28.64,
  polarity: "down-good",
  description: { zh: "直播原生广告素材配置耗时降低约 28.64%", en: "Live native ad material config time reduced ~28.64%" },
};

// ---------- 内容 ----------

export const resume: ResumeData = {
  meta: {
    siteTitle: { zh: "陈思言 · AI 产品经理", en: "Siyan Chen · AI Product Manager" },
    description: {
      zh: "医学统计 × AI 产品的跨界简历:百度商业产品与阿里夸克 AGI 产品实习,0→1 搭建 AI 浏览器产品链路。",
      en: "A medical-statistics × AI product resume: product internships at Baidu and Alibaba Quark AGI, building an AI browser from 0 to 1.",
    },
    repoName: "resume-show",
  },

  contact: {
    name: { zh: "陈思言", en: "Siyan Chen" },
    title: { zh: "AI 产品经理", en: "AI Product Manager" },
    phone: "15196133770",
    email: "c841098648@163.com",
    tagline: { zh: "医学统计 × AI 产品", en: "Medical Statistics × AI Product" },
  },

  summary: {
    zh: "从流行病与卫生统计的医学训练出发,在百度与阿里完成两段产品实习,0→1 参与 AI 浏览器产品落地。",
    en: "Trained in epidemiology & health statistics, then shipped products at Baidu and Alibaba — building an AI browser from 0 to 1.",
  },

  heroStats: [mInternships, mIntentAcc, mAgentCompletion, mProduct01],

  education: [
    {
      id: "edu-fudan",
      title: { zh: "复旦大学", en: "Fudan University" },
      subtitle: { zh: "硕士研究生", en: "Master's Degree" },
      major: { zh: "流行病与卫生统计学", en: "Epidemiology & Health Statistics" },
      badge: { zh: "985 · 211", en: "985 · 211" },
      start: "2024.09",
      end: "至今",
      current: true,
      courses: [
        { zh: "统计方法 (A)", en: "Statistical Methods (A)" },
        { zh: "经济学导论 (A-)", en: "Intro to Economics (A-)" },
        { zh: "高等数学 (A-)", en: "Advanced Mathematics (A-)" },
      ],
    },
    {
      id: "edu-hust",
      title: { zh: "华中科技大学", en: "Huazhong University of Science & Technology" },
      subtitle: { zh: "本科", en: "Bachelor's Degree" },
      major: { zh: "预防医学", en: "Preventive Medicine" },
      badge: { zh: "985 · 211", en: "985 · 211" },
      start: "2019.09",
      end: "2024.06",
      courses: [
        { zh: "高等数学 (90)", en: "Advanced Mathematics (90)" },
        { zh: "计算机基础理论 (92)", en: "Computer Fundamentals (92)" },
      ],
    },
  ],

  educationOutro: {
    zh: "两所 985·211 高校,专业学分排名年级前 30% —— 数据思维,从医学统计开始。",
    en: "Two Project-985/211 universities, top 30% by GPA — data thinking, starting from medical statistics.",
  },

  experiences: [
    {
      id: "exp-alibaba",
      company: { zh: "阿里巴巴 · 夸克 AGI 部门", en: "Alibaba · Quark AGI" },
      title: { zh: "夸克 AI 浏览器 0→1 产品落地", en: "Quark AI Browser 0→1 Product" },
      subtitle: { zh: "产品实习生", en: "Product Intern" },
      start: "2025.08",
      end: "2025.11",
      summary: {
        zh: "负责夸克 AI 浏览器 0→1 产品落地搭建,聚焦办公核心场景,建立「上下文理解 - agent 执行 - 结果生成」链路。",
        en: "Led the 0→1 product build of Quark AI Browser, focusing on office scenarios and the context-understanding → agent-execution → result-generation pipeline.",
      },
      achievements: [
        {
          zh: "主导搭建用户意图识别与上下文管理体系,设计「规则识别 + LLM Judge + 置信度评估 + 兜底容错」多层校验机制",
          en: "Built the intent recognition & context management system with a multi-layer validation mechanism (rules + LLM Judge + confidence + fallback)",
        },
        {
          zh: "围绕「LLM 解析 - Loop 循环 - 工具调用 - 记忆管理」四大要素建立 agent 执行链路",
          en: "Established the agent execution pipeline around LLM parsing, loops, tool calls, and memory",
        },
        {
          zh: "搭建覆盖简单问答到复杂任务的六层分级测评体系,通过失败归因机制定位链路短板",
          en: "Built a six-tier evaluation system from simple Q&A to complex tasks, locating pipeline weaknesses via failure attribution",
        },
      ],
      metrics: [mIntentAcc, mAgentCompletion, mHallucination],
      tags: [
        { zh: "LLM Judge", en: "LLM Judge" },
        { zh: "Agent", en: "Agent" },
        { zh: "Skill", en: "Skill" },
        { zh: "Bad Case", en: "Bad Case" },
        { zh: "0→1", en: "0→1" },
      ],
    },
    {
      id: "exp-baidu",
      company: { zh: "百度 · 商业产品部", en: "Baidu · Commercial Products" },
      title: { zh: "直播原生广告商业化链路设计", en: "Live-stream Native Ads Commercialization" },
      subtitle: { zh: "产品实习生", en: "Product Intern" },
      start: "2025.03",
      end: "2025.06",
      summary: {
        zh: "负责手机百度主版视频信息流直播原生广告商业化链路设计,覆盖用户端广告样式、交互转化链路、广告平台投放能力、分发检索策略及实验评估。",
        en: "Designed the live-stream native ad commercialization pipeline for the Baidu App video feed: ad formats, conversion paths, ad platform capabilities, retrieval strategy and experimentation.",
      },
      achievements: [
        {
          zh: "设计短视频带直播、实况直播两类核心场景的原生广告样式与点击转化链路,AB 试验显著提升广告点击率、转化率与收入",
          en: "Designed native ad formats and conversion paths for short-video & live scenarios; A/B tests significantly lifted CTR, CVR and revenue",
        },
        {
          zh: "建设广告投放平台侧直播原生广告能力,打通投放平台素材库与百家号视频素材,素材配置耗时降低约 28.64%",
          en: "Built ad-platform capabilities for live native ads, cutting material configuration time by ~28.64%",
        },
        {
          zh: "制定广告召回与流量准入规则,针对医疗/教育/金融等高风险行业设计客户黑白名单与行业准入规则",
          en: "Defined ad retrieval & traffic admission rules, including whitelist/blacklist policies for high-risk industries (healthcare, education, finance)",
        },
      ],
      metrics: [mCtr, mCvr, mCost],
      tags: [
        { zh: "AB 实验", en: "A/B Testing" },
        { zh: "商业化", en: "Commercialization" },
        { zh: "广告平台", en: "Ad Platform" },
        { zh: "风控", en: "Risk Control" },
      ],
      outro: {
        zh: "医学背景在商业产品里没有浪费:针对医疗/教育/金融等高风险行业,我设计客户黑白名单与行业准入规则 —— 行业认知,成了风控能力的一部分。",
        en: "The medical background was not wasted: I designed whitelist/blacklist and admission rules for high-risk industries like healthcare — domain knowledge became part of risk control.",
      },
    },
  ],

  // 阿里夸克 4 个战役(Ch03 数据重章)
  projects: [
    {
      id: "prj-intent",
      category: "intent",
      title: { zh: "用户意图识别与上下文体系", en: "Intent Recognition & Context System" },
      subtitle: { zh: "战役一 · 让 AI 听懂用户", en: "Battle 1 · Teaching the AI to Understand" },
      start: "2025.08",
      end: "2025.11",
      summary: {
        zh: "基于 AI 浏览器统一交互入口,主导搭建用户意图识别与上下文管理体系。",
        en: "Built the user intent recognition and context management system for the unified AI browser entry point.",
      },
      challenge: {
        zh: "AI 浏览器交互入口统一后,模型需要准确区分访问、搜索、问答、任务执行四类意图,并管理读取边界,否则回答不确定、幻觉频发。",
        en: "The model had to reliably distinguish four intent types (visit, search, Q&A, task execution) and manage context boundaries — otherwise answers were unreliable and hallucinated.",
      },
      solution: {
        zh: "设计「规则识别 + LLM Judge + 置信度评估 + 兜底容错」多层校验机制;梳理上下文读取边界与默认读取策略,通过结构化上下文、来源展示与读取失败提示降低幻觉风险。",
        en: "Designed a multi-layer validation mechanism (rules + LLM Judge + confidence + fallback), and defined context reading boundaries with structured context, source display and read-failure hints.",
      },
      metrics: [mIntentAcc, mFieldAcc, mHallucination],
      methods: [
        { zh: "LLM Judge", en: "LLM Judge" },
        { zh: "置信度评估", en: "Confidence Scoring" },
        { zh: "兜底容错", en: "Fallback Handling" },
      ],
    },
    {
      id: "prj-agent",
      category: "agent-loop",
      title: { zh: "Agent 执行链路搭建", en: "Agent Execution Pipeline" },
      subtitle: { zh: "战役二 · 让 AI 干完活", en: "Battle 2 · Making the AI Get Things Done" },
      start: "2025.08",
      end: "2025.11",
      summary: {
        zh: "围绕「LLM 解析 - Loop 循环 - 工具调用 - 记忆管理」四大核心要素建立 agent 执行链路。",
        en: "Built the agent execution pipeline around LLM parsing, loops, tool calls, and memory.",
      },
      challenge: {
        zh: "任务执行容易中断、过程不可控、跨任务不连贯,用户对 agent 执行缺乏信任。",
        en: "Task execution was fragile: interrupted flows, uncontrollable processes, no cross-task continuity, and low user trust.",
      },
      solution: {
        zh: "依托 LLM 完成任务理解与规划;设计「识别当前状态 - 执行下一步 - 验证结果」Loop 循环;制定工具调用白名单与权限边界;搭建覆盖任务内记忆、用户偏好与流程记忆的记忆管理体系。",
        en: "LLM-driven task planning; a state→act→verify loop; tool-call whitelists and permission boundaries; and a memory system covering in-task memory, user preferences and process memory.",
      },
      metrics: [mAgentCompletion, mAgentD1, mAgentD7],
      methods: [
        { zh: "LLM 解析", en: "LLM Parsing" },
        { zh: "Loop 循环", en: "Loop" },
        { zh: "工具调用白名单", en: "Tool-call Whitelist" },
        { zh: "记忆管理", en: "Memory" },
      ],
    },
    {
      id: "prj-skill",
      category: "skill",
      title: { zh: "Skill 沉淀与复用机制", en: "Skill Accumulation & Reuse" },
      subtitle: { zh: "战役三 · 让经验可复用", en: "Battle 3 · Making Experience Reusable" },
      start: "2025.08",
      end: "2025.11",
      summary: {
        zh: "设定用户高频任务自动沉淀为 skill 的机制,建立标准化保存结构与版本管理。",
        en: "Designed an automatic skill-accumulation mechanism for high-frequency user tasks, with standardized structure and version management.",
      },
      challenge: {
        zh: "用户高频任务经验无法沉淀,每次都要从头执行,复用成本高。",
        en: "High-frequency task experience wasn't accumulated — every task started from scratch.",
      },
      solution: {
        zh: "设置标准化 skill 保存结构与方式,通过参数化配置提高泛用性;建立 skill 复盘和版本管理体系,支持用户编辑修改与优化。",
        en: "Standardized skill storage, parameterized configuration for generalization, plus review & version management with user-editable skills.",
      },
      metrics: [mSkillD1, mSkillReuseD1],
      methods: [
        { zh: "参数化配置", en: "Parameterized Config" },
        { zh: "版本管理", en: "Versioning" },
        { zh: "复盘机制", en: "Review Loop" },
      ],
    },
    {
      id: "prj-eval",
      category: "evaluation",
      title: { zh: "Agent 测评体系与迭代机制", en: "Agent Evaluation & Iteration" },
      subtitle: { zh: "战役四 · 用数据驱动进化", en: "Battle 4 · Data-driven Evolution" },
      start: "2025.08",
      end: "2025.11",
      summary: {
        zh: "搭建六层分级测评体系,覆盖常规样本与 Bad Case,用失败归因持续优化 agent 能力。",
        en: "Built a six-tier evaluation system covering regular samples and Bad Cases, driving agent improvement through failure attribution.",
      },
      challenge: {
        zh: "agent 能力评估覆盖度低、不稳定,优化缺少数据抓手。",
        en: "Agent capability evaluation had low coverage and stability — optimization lacked data leverage.",
      },
      solution: {
        zh: "围绕「意图识别 - 上下文管理 - Agent 执行 - 结果质量 - Skill 复用」完整链路拆解测评节点,建立任务完成率、结果采纳率、字段准确率、失败可解释率等核心指标,通过失败归因机制定位链路短板。",
        en: "Decomposed evaluation nodes across the full pipeline, built core metrics (task completion, result adoption, field accuracy, failure explainability), and located weaknesses via failure attribution.",
      },
      metrics: [mMultiTask, mAdoption, mFieldAcc],
      methods: [
        { zh: "Bad Case 分析", en: "Bad Case Analysis" },
        { zh: "失败归因", en: "Failure Attribution" },
        { zh: "六层分级测评", en: "Six-tier Evaluation" },
      ],
    },
  ],

  projectsIntro: {
    zh: "四个战役,每一场都从「问题」开始,以「数据」收尾。",
    en: "Four battles, each starting with a problem and ending with data.",
  },

  honors: [
    { id: "h-fudan-rank", name: { zh: "专业学分排名年级前 30%", en: "Top 30% by GPA" }, stage: "fudan", percentile: 30, level: "school" },
    { id: "h-fudan-scholar", name: { zh: "校级优秀奖学金", en: "University Excellence Scholarship" }, count: 2, stage: "fudan", level: "school" },
    { id: "h-fudan-leader", name: { zh: "优秀学生干部", en: "Outstanding Student Leader" }, count: 1, stage: "fudan", level: "school" },
    { id: "h-hust-rank", name: { zh: "专业学分排名年级前 30%", en: "Top 30% by GPA" }, stage: "hust", percentile: 30, level: "school" },
    { id: "h-hust-freshman", name: { zh: "新生优秀奖学金", en: "Freshman Scholarship" }, count: 1, stage: "hust", level: "school" },
    { id: "h-hust-third", name: { zh: "校级三等奖学金", en: "Third-class Scholarship" }, count: 1, stage: "hust", level: "school" },
    { id: "h-hust-league", name: { zh: "校级优秀共青团员", en: "Outstanding League Member" }, count: 2, stage: "hust", level: "school" },
    { id: "h-hust-classleader", name: { zh: "优秀班干部", en: "Outstanding Class Leader" }, count: 1, stage: "hust", level: "school" },
    { id: "h-hust-innovation", name: { zh: "大学生创新创业大赛省级立项", en: "Provincial Innovation & Entrepreneurship Project" }, stage: "hust", level: "provincial" },
  ],

  skills: [
    { id: "sk-mysql", name: { zh: "MySQL", en: "MySQL" }, level: 85, category: "data", radar: true },
    { id: "sk-r", name: { zh: "R", en: "R" }, level: 80, category: "data", radar: true },
    { id: "sk-codex", name: { zh: "Codex", en: "Codex" }, level: 75, category: "ai" },
    { id: "sk-claude", name: { zh: "Claude Code", en: "Claude Code" }, level: 75, category: "ai", radar: true },
    { id: "sk-agent", name: { zh: "Agent 搭建", en: "Agent Building" }, level: 85, category: "ai", radar: true },
    { id: "sk-vibe", name: { zh: "Vibe Coding", en: "Vibe Coding" }, level: 80, category: "ai", radar: true },
    { id: "sk-modaoke", name: { zh: "墨刀", en: "MockingBot" }, level: 70, category: "design" },
    { id: "sk-figma", name: { zh: "Figma", en: "Figma" }, level: 70, category: "design", radar: true },
  ],

  traits: [
    {
      id: "trait-logic",
      title: { zh: "注重逻辑拆解", en: "Logical Decomposition" },
      body: {
        zh: "习惯从业务目标、用户场景、链路转化和数据指标出发拆解问题,推进前先反问「为什么需要这么做」。",
        en: "Decomposes problems from business goals, user scenarios, conversion paths and data metrics — always asking \"why\" before acting.",
      },
    },
    {
      id: "trait-pressure",
      title: { zh: "压力场里的务实选手", en: "Pragmatic Under Pressure" },
      body: {
        zh: "面对高压力、复杂任务时保持稳定节奏与结果导向,把精力放在解决问题上。",
        en: "Keeps a steady rhythm and result orientation under pressure, focusing energy on solving problems.",
      },
    },
    {
      id: "trait-music",
      title: { zh: "预备役音乐主理人", en: "Music Curator-in-Reserve" },
      body: {
        zh: "热爱音乐,对小提琴、大提琴和架子鼓尤其着迷,期待未来逐步解锁喜欢的乐器。",
        en: "A music lover fascinated by violin, cello and drums — planning to unlock them one day.",
      },
      emoji: "🎻",
    },
  ],

  chapters: [
    {
      id: "hero",
      index: "00",
      title: { zh: "开场", en: "Prologue" },
      subtitle: { zh: "一份跨界简历的数据叙事", en: "A data narrative of a crossover resume" },
      accent: "teal",
    },
    {
      id: "medical",
      index: "01",
      title: { zh: "医学生", en: "The Medical Student" },
      subtitle: { zh: "数据思维,从医学统计开始", en: "Data thinking, starting from medical statistics" },
      accent: "teal",
    },
    {
      id: "crossover",
      index: "02",
      title: { zh: "跨界", en: "The Crossover" },
      subtitle: { zh: "商业产品的第一次实战", en: "First real-world practice in commercial products" },
      accent: "violet",
    },
    {
      id: "projects",
      index: "03",
      title: { zh: "AI 实战", en: "AI Battles" },
      subtitle: { zh: "夸克 AI 浏览器的四个战役", en: "Four battles of the Quark AI Browser" },
      accent: "blue",
    },
    {
      id: "honors",
      index: "04",
      title: { zh: "荣誉与技能", en: "Honors & Skills" },
      subtitle: { zh: "数据之外,还有生活", en: "Beyond data, there is life" },
      accent: "gold",
    },
  ],
};
