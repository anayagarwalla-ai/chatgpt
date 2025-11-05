import { actions as defaultActions } from '../data/actions.js';

const CATEGORY_TARGETS = {
  all: 30,
  home: 8,
  food: 6,
  transport: 10,
  community: 6
};

export function calculateProjection(currentFootprintKg) {
  const footprint = Math.max(0, Number(currentFootprintKg) || 0);
  const target = 14; // kg CO2e per person per day for a 1.5°C-aligned pathway
  const reductionNeeded = Math.max(0, footprint - target);
  const weeklyReduction = reductionNeeded * 7;
  const yearlyReduction = reductionNeeded * 365;

  return {
    footprint,
    target,
    reductionNeeded,
    weeklyReduction,
    yearlyReduction
  };
}

export function formatImpact(value) {
  const rounded = Math.round(value * 10) / 10;
  return `${rounded.toLocaleString(undefined, { maximumFractionDigits: 1 })} kg CO₂e`;
}

export function getTagOptions(dataset = defaultActions) {
  const tagSet = new Set();
  dataset.forEach((action) => {
    action.tags.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
}

export function getRecommendedActions(
  dataset = defaultActions,
  { focus = 'all', effort = 'all', time = 'all', tags = [] } = {}
) {
  const activeTags = Array.isArray(tags) ? tags.filter(Boolean) : [];
  return dataset
    .filter((action) => {
      const focusMatch = focus === 'all' || action.category === focus;
      const effortMatch = effort === 'all' || action.effort === effort;
      const timeMatch = time === 'all' || action.time === time;
      const tagMatch =
        activeTags.length === 0 || activeTags.every((tag) => action.tags.includes(tag));
      return focusMatch && effortMatch && timeMatch && tagMatch;
    })
    .sort((a, b) => b.impactKg - a.impactKg);
}

export function summarizeFocus(focus, dataset = defaultActions) {
  const actionsForFocus = dataset.filter((action) =>
    focus === 'all' ? true : action.category === focus
  );

  const totalImpact = actionsForFocus.reduce((total, action) => total + action.impactKg, 0);
  const averageImpact = actionsForFocus.length ? totalImpact / actionsForFocus.length : 0;
  const focusTarget = CATEGORY_TARGETS[focus] ?? CATEGORY_TARGETS.all;

  return {
    count: actionsForFocus.length,
    totalImpact,
    averageImpact,
    focusTarget
  };
}

export function buildFocusMessage(focus, dataset = defaultActions) {
  const summary = summarizeFocus(focus, dataset);
  if (summary.count === 0) {
    return 'We are gathering more ideas for this focus area—check back soon!';
  }

  const focusLabel =
    focus === 'all'
      ? 'balanced plan'
      : {
          home: 'home energy',
          food: 'food choices',
          transport: 'transportation',
          community: 'community influence'
        }[focus] ?? focus;

  const averageImpactText = formatImpact(summary.averageImpact);
  const totalImpactText = formatImpact(summary.totalImpact);
  const targetText = formatImpact(summary.focusTarget);

  return `A ${focusLabel} focus offers ${summary.count} high-impact moves averaging ${averageImpactText}. Tackling three of them this month can remove about ${targetText} from your footprint.`;
}

export function estimateCommitmentImpact(commitments) {
  return commitments.reduce((total, item) => total + (item.impactKg || 0), 0);
}
