import type { Answers, Question } from "@/lib/types";

const is = (answers: Answers, id: string, value: string | boolean | number) =>
  answers[id] === value;

const oneOf = (answers: Answers, id: string, values: Array<string | boolean | number>) =>
  values.includes(answers[id] as string | boolean | number);

export const questions: Question[] = [
  {
    id: "purpose",
    stage: "goal",
    type: "single_choice",
    required: true,
    title: {
      en: "What brings you to Hungary?",
      zh: "你来匈牙利的主要目的是什么？",
    },
    description: {
      en: "Choose the closest option. We will ask only the follow-up questions that matter.",
      zh: "请选择最接近的选项。之后只会询问相关问题。",
    },
    options: [
      {
        id: "visit",
        value: "visit",
        icon: "plane",
        label: { en: "Visit or business trip", zh: "旅行或商务访问" },
        description: { en: "Tourism, meetings, family visit, conference.", zh: "旅游、会议、探亲或商务活动。" },
      },
      {
        id: "work",
        value: "work",
        icon: "briefcase",
        label: { en: "Work in Hungary", zh: "在匈牙利工作" },
        description: { en: "Hungarian employer, transfer, posting, or seasonal work.", zh: "匈牙利雇主、调派、派遣或季节性工作。" },
      },
      {
        id: "study",
        value: "study",
        icon: "graduation",
        label: { en: "Study or training", zh: "学习或培训" },
        description: { en: "University, school, mobility, training, or internship.", zh: "大学、学校、交流、培训或实习。" },
      },
      {
        id: "family",
        value: "family",
        icon: "heart",
        label: { en: "Join family", zh: "与家人团聚" },
        description: { en: "Partner, spouse, child, or EEA family member.", zh: "配偶、伴侣、子女或欧盟/欧洲经济区家属。" },
      },
      {
        id: "business",
        value: "business",
        icon: "building",
        label: { en: "Business or self-employment", zh: "创业或自雇" },
        description: { en: "Run a company or independent activity.", zh: "经营公司或从事独立经济活动。" },
      },
      {
        id: "remote",
        value: "remote",
        icon: "laptop",
        label: { en: "Remote work", zh: "远程工作" },
        description: { en: "Digital nomad or foreign-company income.", zh: "数字游民或境外公司收入。" },
      },
      {
        id: "invest",
        value: "invest",
        icon: "landmark",
        label: { en: "Invest", zh: "投资" },
        description: { en: "Guest investor visa or residence route.", zh: "访客投资者签证或居留路径。" },
      },
      {
        id: "not_sure",
        value: "not_sure",
        icon: "sparkles",
        label: { en: "I am not sure yet", zh: "我还不确定" },
        description: { en: "Start broad and narrow it down.", zh: "先从大方向开始筛选。" },
      },
    ],
  },
  {
    id: "nationality",
    stage: "context",
    type: "country",
    required: true,
    title: { en: "What is your citizenship?", zh: "你的国籍是什么？" },
    description: {
      en: "This helps determine visa-free entry, work routes, and submission path.",
      zh: "这会影响免签、工作路径和递交方式。",
    },
    placeholder: { en: "Type your citizenship", zh: "请输入你的国籍" },
  },
  {
    id: "currentLocation",
    stage: "context",
    type: "single_choice",
    required: true,
    title: { en: "Where are you now?", zh: "你现在在哪里？" },
    options: [
      { id: "hungary", value: "hungary", icon: "map-pin", label: { en: "In Hungary", zh: "在匈牙利" } },
      { id: "eu", value: "eu", icon: "map", label: { en: "In another EU country", zh: "在另一个欧盟国家" } },
      { id: "outside_eu", value: "outside_eu", icon: "globe", label: { en: "Outside the EU", zh: "在欧盟以外" } },
    ],
  },
  {
    id: "visaFreeEntry",
    stage: "context",
    type: "single_choice",
    required: true,
    title: { en: "Can you enter Schengen visa-free?", zh: "你可以免签进入申根区吗？" },
    description: {
      en: "If you are not sure, choose the last option and we will mark it for review.",
      zh: "如果不确定，请选择最后一项，我们会标记为需确认。",
    },
    options: [
      { id: "yes", value: "yes", icon: "check", label: { en: "Yes", zh: "可以" } },
      { id: "no", value: "no", icon: "x", label: { en: "No", zh: "不可以" } },
      { id: "unknown", value: "unknown", icon: "help", label: { en: "I am not sure", zh: "不确定" } },
    ],
  },
  {
    id: "intendedStay",
    stage: "context",
    type: "single_choice",
    required: true,
    title: { en: "How long do you want to stay?", zh: "你计划停留多久？" },
    options: [
      { id: "transit", value: "transit", icon: "plane", label: { en: "Airport transit only", zh: "仅机场转机" } },
      { id: "short", value: "short", icon: "calendar", label: { en: "Up to 90 days", zh: "最多90天" } },
      { id: "long", value: "long", icon: "calendar-days", label: { en: "More than 90 days", zh: "超过90天" } },
      { id: "switch", value: "switch", icon: "refresh", label: { en: "Extend or switch status", zh: "延期或转换身份" } },
      { id: "permanent", value: "permanent", icon: "key", label: { en: "Long-term/permanent status", zh: "长期或永久身份" } },
    ],
  },
  {
    id: "hasHungarianPermit",
    stage: "context",
    type: "single_choice",
    required: true,
    title: { en: "Do you already have a Hungarian residence permit?", zh: "你已有匈牙利居留许可吗？" },
    options: [
      { id: "yes", value: "yes", icon: "badge", label: { en: "Yes", zh: "有" } },
      { id: "no", value: "no", icon: "badge-x", label: { en: "No", zh: "没有" } },
    ],
  },
  {
    id: "hasEuPermit",
    stage: "context",
    type: "single_choice",
    required: true,
    title: { en: "Do you hold another EU residence permit?", zh: "你是否持有其他欧盟国家居留许可？" },
    options: [
      { id: "yes", value: "yes", icon: "badge", label: { en: "Yes", zh: "有" } },
      { id: "no", value: "no", icon: "badge-x", label: { en: "No", zh: "没有" } },
    ],
  },
  {
    id: "hasHungarianEmployer",
    stage: "route_details",
    type: "single_choice",
    required: true,
    showIf: (answers) => oneOf(answers, "purpose", ["work", "not_sure"]),
    title: { en: "Do you have a Hungarian employer or job offer?", zh: "你是否有匈牙利雇主或工作机会？" },
    options: [
      { id: "contract", value: "contract", icon: "file-check", label: { en: "Yes, signed or nearly ready", zh: "有，合同已签或即将完成" } },
      { id: "talks", value: "talks", icon: "messages", label: { en: "In discussion", zh: "正在沟通中" } },
      { id: "no", value: "no", icon: "x", label: { en: "No", zh: "没有" } },
    ],
  },
  {
    id: "highQualification",
    stage: "route_details",
    type: "single_choice",
    required: true,
    showIf: (answers) => is(answers, "purpose", "work") || is(answers, "hasHungarianEmployer", "contract"),
    title: { en: "Is the role highly qualified or degree-based?", zh: "该职位是否需要高技能或学历？" },
    options: [
      { id: "yes", value: "yes", icon: "graduation", label: { en: "Yes", zh: "是" } },
      { id: "no", value: "no", icon: "briefcase", label: { en: "No or not sure", zh: "不是或不确定" } },
    ],
  },
  {
    id: "hasAdmission",
    stage: "route_details",
    type: "single_choice",
    required: true,
    showIf: (answers) => oneOf(answers, "purpose", ["study", "not_sure"]),
    title: { en: "Do you have admission from a Hungarian school or university?", zh: "你是否已获得匈牙利学校或大学录取？" },
    options: [
      { id: "yes", value: "yes", icon: "file-check", label: { en: "Yes", zh: "有" } },
      { id: "pending", value: "pending", icon: "clock", label: { en: "Pending", zh: "等待中" } },
      { id: "no", value: "no", icon: "x", label: { en: "No", zh: "没有" } },
    ],
  },
  {
    id: "hasFamilySponsor",
    stage: "route_details",
    type: "single_choice",
    required: true,
    showIf: (answers) => oneOf(answers, "purpose", ["family", "not_sure"]),
    title: { en: "Who is your family sponsor in Hungary or the EU?", zh: "你的匈牙利或欧盟家庭担保人是谁？" },
    options: [
      { id: "hungarian", value: "hungarian", icon: "heart", label: { en: "Hungarian citizen/resident", zh: "匈牙利公民或居民" } },
      { id: "eea", value: "eea", icon: "stars", label: { en: "EU/EEA/Swiss citizen", zh: "欧盟/欧洲经济区/瑞士公民" } },
      { id: "none", value: "none", icon: "x", label: { en: "No sponsor yet", zh: "暂无担保人" } },
    ],
  },
  {
    id: "businessStatus",
    stage: "route_details",
    type: "single_choice",
    required: true,
    showIf: (answers) => oneOf(answers, "purpose", ["business", "not_sure"]),
    title: { en: "What best describes your business plan?", zh: "哪项最符合你的商业计划？" },
    options: [
      { id: "existing_company", value: "existing_company", icon: "building", label: { en: "Hungarian company or ownership", zh: "匈牙利公司或股权" } },
      { id: "self_employed", value: "self_employed", icon: "briefcase", label: { en: "Self-employed activity", zh: "自雇活动" } },
      { id: "idea", value: "idea", icon: "sparkles", label: { en: "Only an idea for now", zh: "目前只是想法" } },
    ],
  },
  {
    id: "remoteWorkProfile",
    stage: "route_details",
    type: "single_choice",
    required: true,
    showIf: (answers) => oneOf(answers, "purpose", ["remote", "not_sure"]),
    title: { en: "What is your remote work setup?", zh: "你的远程工作情况是怎样的？" },
    options: [
      { id: "foreign_employer", value: "foreign_employer", icon: "laptop", label: { en: "Foreign employer or company", zh: "境外雇主或公司" } },
      { id: "hungarian_clients", value: "hungarian_clients", icon: "building", label: { en: "Hungarian clients/company", zh: "匈牙利客户或公司" } },
      { id: "unclear", value: "unclear", icon: "help", label: { en: "Not sure", zh: "不确定" } },
    ],
  },
  {
    id: "monthlyNetIncomeEur",
    stage: "route_details",
    type: "number",
    required: true,
    showIf: (answers) => is(answers, "purpose", "remote") || is(answers, "remoteWorkProfile", "foreign_employer"),
    title: { en: "Approximate monthly net income in EUR", zh: "每月净收入大约多少欧元？" },
    description: { en: "A higher verified income can improve White Card readiness.", zh: "较高且可证明的收入有助于白卡路径评估。" },
    placeholder: { en: "Example: 3000", zh: "例如：3000" },
  },
  {
    id: "investmentCapacity",
    stage: "route_details",
    type: "single_choice",
    required: true,
    showIf: (answers) => oneOf(answers, "purpose", ["invest", "not_sure"]),
    title: { en: "Which investment route could you document?", zh: "你可以证明哪种投资路径？" },
    options: [
      { id: "fund_250k", value: "fund_250k", icon: "landmark", label: { en: "EUR 250k real estate fund", zh: "25万欧元房地产基金" } },
      { id: "donation_1m", value: "donation_1m", icon: "landmark", label: { en: "EUR 1m higher education donation", zh: "100万欧元高等教育捐赠" } },
      { id: "not_ready", value: "not_ready", icon: "clock", label: { en: "Not ready yet", zh: "尚未准备好" } },
    ],
  },
  {
    id: "housingReady",
    stage: "readiness",
    type: "single_choice",
    required: true,
    title: { en: "Do you have proof of accommodation in Hungary?", zh: "你是否有匈牙利住宿证明？" },
    options: [
      { id: "yes", value: "yes", icon: "home", label: { en: "Yes", zh: "有" } },
      { id: "planned", value: "planned", icon: "clock", label: { en: "Planned", zh: "计划中" } },
      { id: "no", value: "no", icon: "x", label: { en: "No", zh: "没有" } },
    ],
  },
  {
    id: "financialProofReady",
    stage: "readiness",
    type: "single_choice",
    required: true,
    title: { en: "Can you document financial means?", zh: "你能否提供资金证明？" },
    options: [
      { id: "yes", value: "yes", icon: "wallet", label: { en: "Yes", zh: "可以" } },
      { id: "partial", value: "partial", icon: "clock", label: { en: "Partially", zh: "部分可以" } },
      { id: "no", value: "no", icon: "x", label: { en: "No", zh: "不可以" } },
    ],
  },
  {
    id: "insuranceReady",
    stage: "readiness",
    type: "single_choice",
    required: true,
    title: { en: "Do you have health insurance or cost coverage?", zh: "你是否有医疗保险或医疗费用保障？" },
    options: [
      { id: "yes", value: "yes", icon: "shield", label: { en: "Yes", zh: "有" } },
      { id: "planned", value: "planned", icon: "clock", label: { en: "Planned", zh: "计划中" } },
      { id: "no", value: "no", icon: "x", label: { en: "No", zh: "没有" } },
    ],
  },
  {
    id: "priorRefusalOrOverstay",
    stage: "readiness",
    type: "single_choice",
    required: true,
    title: { en: "Any prior refusal, overstay, deportation, or entry ban?", zh: "是否有拒签、逾期停留、遣返或入境禁令？" },
    options: [
      { id: "no", value: "no", icon: "check", label: { en: "No", zh: "没有" } },
      { id: "yes", value: "yes", icon: "alert", label: { en: "Yes", zh: "有" } },
      { id: "prefer_review", value: "prefer_review", icon: "help", label: { en: "I prefer manual review", zh: "希望人工审核" } },
    ],
  },
  {
    id: "deadlineUrgency",
    stage: "readiness",
    type: "single_choice",
    required: true,
    title: { en: "How urgent is your timeline?", zh: "你的时间安排有多紧急？" },
    options: [
      { id: "flexible", value: "flexible", icon: "calendar", label: { en: "Flexible", zh: "灵活" } },
      { id: "soon", value: "soon", icon: "clock", label: { en: "Within 1-3 months", zh: "1-3个月内" } },
      { id: "urgent", value: "urgent", icon: "alert", label: { en: "Very urgent", zh: "非常紧急" } },
    ],
  },
];

export function getVisibleQuestions(answers: Answers) {
  return questions.filter((question) => !question.showIf || question.showIf(answers));
}
