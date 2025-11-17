const BASE_PLANS = [
  {
    id: "plan-7",
    name: "7-Day Plan",
    subtitle: "Starter daily income",
    durationDays: 7,
    durationLabel: "7 days",
    dailyRate: 0.025,
    featured: false,
    minCapital: 100,
    maxCapital: 999,
    referralBonus: 0.1,
  },
  {
    id: "plan-14",
    name: "14-Day Plan",
    subtitle: "Bi-weekly growth",
    durationDays: 14,
    durationLabel: "14 days",
    dailyRate: 0.03,
    featured: true,
    minCapital: 600,
    maxCapital: 4999,
    referralBonus: 0.1,
  },
  {
    id: "plan-90",
    name: "3-Month Plan",
    subtitle: "Quarterly compounding",
    durationDays: 90,
    durationLabel: "3 months (90 days)",
    dailyRate: 0.035,
    featured: false,
    minCapital: 5000,
    maxCapital: 9999,
    referralBonus: 0.1,
  },
  {
    id: "plan-180",
    name: "6-Month Plan",
    subtitle: "Half-year growth",
    durationDays: 180,
    durationLabel: "6 months (180 days)",
    dailyRate: 0.04,
    featured: false,
    minCapital: 10000,
    maxCapital: null,
    referralBonus: 0.1,
  },
];

const withComputedFields = BASE_PLANS.map((plan) => {
  const minCapital = plan.minCapital ?? 100;
  const maxCapital = Number.isFinite(plan.maxCapital) ? plan.maxCapital : null;
  const referralBonus = typeof plan.referralBonus === "number" ? plan.referralBonus : 0;
  const sampleEarning = parseFloat((minCapital * plan.dailyRate * plan.durationDays).toFixed(2));
  const totalReturnPercent = parseFloat((plan.dailyRate * plan.durationDays * 100).toFixed(1));

  return {
    ...plan,
    minCapital,
    maxCapital,
    referralBonus,
    sampleEarning,
    totalReturnPercent,
  };
});

export const PLAN_CONFIG = withComputedFields;

export const PLAN_CONFIG_MAP = PLAN_CONFIG.reduce((acc, plan) => {
  acc[plan.name] = plan;
  return acc;
}, {});

export const formatPercent = (rate) => {
  if (typeof rate !== "number") return "0%";
  const percent = rate * 100;
  const formatted = Number.isInteger(percent) ? percent.toFixed(0) : percent.toFixed(1);
  return `${formatted}%`;
};

export const getPlanByName = (name) => PLAN_CONFIG_MAP[name] || PLAN_CONFIG[0];

export const projectEarnings = (capital, planName) => {
  const plan = getPlanByName(planName);
  const amount = typeof capital === "number" && !Number.isNaN(capital) ? capital : plan.minCapital;
  return parseFloat((amount * plan.dailyRate * plan.durationDays).toFixed(2));
};

export const LEGACY_PLAN_RULES = {
  silver: { roiMultiplier: 5, bonusMultiplier: 5 },
  gold: { roiMultiplier: 5, bonusMultiplier: 8 },
  diamond: { roiMultiplier: 5, bonusMultiplier: 10 },
};
