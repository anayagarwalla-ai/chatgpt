export const actions = [
  {
    id: 'home-energy-audit',
    title: 'Book a home energy audit',
    category: 'home',
    effort: 'medium',
    time: 'weekend',
    impactKg: 18,
    description:
      'Identify where your home is leaking energy and create a prioritized upgrade plan with a certified professional.',
    tags: ['insulation', 'efficiency', 'planning']
  },
  {
    id: 'smart-thermostat',
    title: 'Install smart thermostat schedules',
    category: 'home',
    effort: 'low',
    time: 'quick',
    impactKg: 5,
    description:
      'Program energy-saving schedules that match your routine and lower heating/cooling emissions by up to 10%.',
    tags: ['automation', 'heating', 'cooling']
  },
  {
    id: 'led-upgrade',
    title: 'Swap household bulbs for LEDs',
    category: 'home',
    effort: 'medium',
    time: 'weekend',
    impactKg: 7,
    description:
      'Replace remaining incandescent or CFL bulbs with efficient LEDs to cut lighting energy use by 75%.',
    tags: ['lighting', 'retrofit']
  },
  {
    id: 'plant-rich-meals',
    title: 'Plan three plant-rich meals this week',
    category: 'food',
    effort: 'low',
    time: 'habit',
    impactKg: 6,
    description:
      'Swap out meat-centered meals with plant-based proteins to slash emissions and reduce food costs.',
    tags: ['nutrition', 'meal prep']
  },
  {
    id: 'food-waste-audit',
    title: 'Conduct a household food waste audit',
    category: 'food',
    effort: 'medium',
    time: 'weekend',
    impactKg: 4,
    description:
      'Track discarded food for a week to identify the biggest waste culprits and adjust your shopping list.',
    tags: ['tracking', 'behavior change']
  },
  {
    id: 'bike-commute',
    title: 'Bike or walk for short commutes',
    category: 'transport',
    effort: 'high',
    time: 'habit',
    impactKg: 10,
    description:
      'Replace at least two short car trips each week with active transport to reduce fuel emissions and improve health.',
    tags: ['active travel', 'health']
  },
  {
    id: 'transit-pass',
    title: 'Switch to a public transit pass',
    category: 'transport',
    effort: 'medium',
    time: 'habit',
    impactKg: 12,
    description:
      'Commit to transit for commute days by purchasing a monthly pass and planning routes ahead of time.',
    tags: ['commute', 'planning']
  },
  {
    id: 'community-solar',
    title: 'Join a community solar program',
    category: 'community',
    effort: 'high',
    time: 'weekend',
    impactKg: 25,
    description:
      'Subscribe to a local solar farm to offset household electricity emissions without rooftop panels.',
    tags: ['renewables', 'advocacy']
  },
  {
    id: 'policy-advocacy',
    title: 'Support a local climate policy',
    category: 'community',
    effort: 'medium',
    time: 'weekend',
    impactKg: 8,
    description:
      'Call or email local representatives about current climate legislation and join a community meeting.',
    tags: ['civic action', 'policy']
  }
];

export const tagDescriptions = {
  insulation: 'Upgrade walls, attics, or windows to minimize heat loss.',
  efficiency: 'Use less energy to get the same comfort and productivity.',
  planning: 'Lay out the steps, incentives, and budget to move faster.',
  automation: 'Let smart devices optimize your energy use automatically.',
  heating: 'Reduce emissions from keeping your home warm.',
  cooling: 'Cool smarter with lower emissions.',
  lighting: 'Cut lighting energy use and extend bulb lifespan.',
  retrofit: 'Improve what you already have instead of buying new.',
  nutrition: 'Eat in ways that support health and the planet.',
  'meal prep': 'Plan ahead so climate-friendly choices are easy.',
  tracking: 'Collect data to spot trends and opportunities.',
  'behavior change': 'Build habits that stick.',
  'active travel': 'Move your body and cut tailpipe emissions.',
  health: 'Climate action that improves wellbeing.',
  commute: 'Rethink how you get to work or school.',
  renewables: 'Switch to energy from wind, water, or sun.',
  advocacy: 'Share your voice so big systems shift.',
  'civic action': 'Influence decisions beyond your household.',
  policy: 'Support climate-smart rules and investments.'
};
