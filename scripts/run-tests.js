import { strict as assert } from 'node:assert';

import { actions } from '../src/data/actions.js';
import {
  buildFocusMessage,
  calculateProjection,
  estimateCommitmentImpact,
  formatImpact,
  getRecommendedActions,
  getTagOptions
} from '../src/lib/recommendations.js';

function testCalculateProjection() {
  const projection = calculateProjection(24);
  assert.equal(projection.footprint, 24);
  assert.equal(projection.target, 14);
  assert.equal(projection.reductionNeeded, 10);
  assert.equal(projection.weeklyReduction, 70);
  assert.equal(projection.yearlyReduction, 3650);
}

function testGetRecommendedActions() {
  const focusResults = getRecommendedActions(actions, { focus: 'home' });
  assert.ok(focusResults.every((action) => action.category === 'home'));
  assert.ok(focusResults.length >= 1);

  const filtered = getRecommendedActions(actions, {
    focus: 'food',
    effort: 'low',
    time: 'habit'
  });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, 'plant-rich-meals');
}

function testFormatImpact() {
  assert.equal(formatImpact(12.345), '12.3 kg CO₂e');
  assert.equal(formatImpact(0), '0 kg CO₂e');
}

function testTagOptions() {
  const tags = getTagOptions(actions);
  assert.ok(tags.includes('insulation'));
  assert.ok(tags.includes('policy'));
  assert.ok(new Set(tags).size === tags.length);
}

function testBuildFocusMessage() {
  const message = buildFocusMessage('home', actions);
  assert.ok(message.includes('home energy'));
  assert.ok(/\d/.test(message));
}

function testEstimateCommitmentImpact() {
  const total = estimateCommitmentImpact([
    { impactKg: 5 },
    { impactKg: 2.5 },
    { impactKg: 0 }
  ]);
  assert.equal(total, 7.5);
}

function run() {
  testCalculateProjection();
  testGetRecommendedActions();
  testFormatImpact();
  testTagOptions();
  testBuildFocusMessage();
  testEstimateCommitmentImpact();
  console.log('✅ All tests passed.');
}

run();
