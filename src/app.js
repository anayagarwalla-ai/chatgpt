import { actions, tagDescriptions } from './data/actions.js';
import {
  buildFocusMessage,
  calculateProjection,
  estimateCommitmentImpact,
  formatImpact,
  getRecommendedActions,
  getTagOptions
} from './lib/recommendations.js';

const GOAL_IMPACT_KG = 30;

const initialCommitments = [
  {
    id: 'seed-plant-rich',
    text: 'Plan three plant-rich dinners for the week and prep ingredients on Sunday night.',
    impactKg: 6,
    sourceAction: 'Plan three plant-rich meals this week',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    completed: false
  },
  {
    id: 'seed-led-upgrade',
    text: 'Replace the hallway bulbs with LEDs before recycling day.',
    impactKg: 7,
    sourceAction: 'Swap household bulbs for LEDs',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    completed: true
  }
];

const state = {
  footprint: 24,
  focus: 'all',
  effort: 'all',
  time: 'all',
  tags: [],
  commitments: [...initialCommitments]
};

let fadeObserver;

const selectors = {
  heroActionsButton: document.getElementById('scroll-actions'),
  footprintRange: document.getElementById('footprint-range'),
  footprintValue: document.getElementById('footprint-value'),
  focusSelect: document.getElementById('focus-select'),
  projectionInsight: document.getElementById('projection-insight'),
  focusInsight: document.getElementById('focus-insight'),
  actionList: document.getElementById('action-list'),
  effortFilter: document.getElementById('effort-filter'),
  timeFilter: document.getElementById('time-filter'),
  tagChips: document.getElementById('tag-chips'),
  commitmentForm: document.getElementById('commitment-form'),
  commitmentInput: document.getElementById('commitment-input'),
  commitmentSelect: document.getElementById('commitment-action'),
  commitmentList: document.getElementById('commitment-list'),
  commitmentCount: document.getElementById('commitment-count'),
  completedCount: document.getElementById('completed-count'),
  impactTotal: document.getElementById('impact-total'),
  commitmentProgress: document.getElementById('commitment-progress'),
  progressLabel: document.getElementById('progress-label')
};

function setupPlanner() {
  const { footprintRange, footprintValue, focusSelect } = selectors;
  if (!footprintRange || !footprintValue || !focusSelect) return;

  footprintValue.textContent = `${state.footprint} kg CO₂e/day`;
  footprintRange.value = state.footprint;

  footprintRange.addEventListener('input', (event) => {
    state.footprint = Number(event.target.value);
    footprintValue.textContent = `${state.footprint} kg CO₂e/day`;
    renderInsights();
  });

  focusSelect.addEventListener('change', (event) => {
    state.focus = event.target.value;
    renderActions();
    renderInsights();
  });

  renderInsights();
}

function renderInsights() {
  const { projectionInsight, focusInsight } = selectors;
  const projection = calculateProjection(state.footprint);
  if (projectionInsight) {
    const weekly = formatImpact(projection.weeklyReduction);
    const yearly = formatImpact(projection.yearlyReduction);
    projectionInsight.innerHTML = `
      <strong>Your path to a 1.5°C lifestyle</strong><br />
      You are ${formatImpact(projection.reductionNeeded)} above the daily target.
      Shift just ${weekly} each week to stay on track, and lock in ${yearly} of avoided emissions this year.
    `;
  }

  if (focusInsight) {
    focusInsight.textContent = buildFocusMessage(state.focus, actions);
  }
}

function setupHero() {
  const { heroActionsButton } = selectors;
  if (!heroActionsButton) return;

  heroActionsButton.addEventListener('click', () => {
    const actionsSection = document.getElementById('actions');
    if (actionsSection) {
      actionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

function setupFilters() {
  const { effortFilter, timeFilter } = selectors;
  if (effortFilter) {
    effortFilter.addEventListener('change', (event) => {
      state.effort = event.target.value;
      renderActions();
      renderInsights();
    });
  }

  if (timeFilter) {
    timeFilter.addEventListener('change', (event) => {
      state.time = event.target.value;
      renderActions();
      renderInsights();
    });
  }

  renderTagChips();
}

function renderTagChips() {
  const { tagChips } = selectors;
  if (!tagChips) return;

  const tags = getTagOptions(actions);
  tagChips.innerHTML = '';

  tags.forEach((tag) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = `chip${state.tags.includes(tag) ? ' active' : ''}`;
    chip.textContent = tag;
    chip.title = tagDescriptions[tag] ?? 'Climate-positive idea';
    chip.addEventListener('click', () => {
      toggleTag(tag);
    });
    tagChips.appendChild(chip);
  });
}

function toggleTag(tag) {
  if (state.tags.includes(tag)) {
    state.tags = state.tags.filter((t) => t !== tag);
  } else {
    if (state.tags.length >= 3) {
      state.tags = [...state.tags.slice(1), tag];
    } else {
      state.tags = [...state.tags, tag];
    }
  }
  renderTagChips();
  renderActions();
  renderInsights();
}

function renderActions() {
  const { actionList } = selectors;
  if (!actionList) return;

  const filtered = getRecommendedActions(actions, {
    focus: state.focus,
    effort: state.effort,
    time: state.time,
    tags: state.tags
  });

  actionList.innerHTML = '';

  if (filtered.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'insight';
    emptyState.textContent =
      'We could not find any actions that match that filter combination yet. Try relaxing one of the filters.';
    actionList.appendChild(emptyState);
    return;
  }

  filtered.forEach((action) => {
    const card = document.createElement('article');
    card.className = 'action-card fade-in';

    const title = document.createElement('h3');
    title.textContent = action.title;

    const description = document.createElement('p');
    description.textContent = action.description;

    const impact = document.createElement('div');
    impact.className = 'impact';
    impact.innerHTML = `
      <span>Impact:</span>
      <strong>${formatImpact(action.impactKg)}</strong>
    `;

    const badges = document.createElement('div');
    badges.className = 'badges';
    badges.innerHTML = `
      <span class="badge">${action.category}</span>
      <span class="badge">${action.effort} effort</span>
      <span class="badge">${action.time}</span>
    `;

    const tagLine = document.createElement('div');
    tagLine.className = 'badges';
    action.tags.forEach((tag) => {
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = `#${tag}`;
      badge.title = tagDescriptions[tag] ?? 'Climate-positive idea';
      tagLine.appendChild(badge);
    });

    const button = document.createElement('button');
    button.className = 'primary-btn';
    button.type = 'button';
    button.dataset.actionId = action.id;
    button.textContent = 'Add to my commitments';
    button.addEventListener('click', () => addActionCommitment(action.id));

    card.append(title, description, impact, badges, tagLine, button);
    actionList.appendChild(card);
  });

  observeFadeIns();
}

function addActionCommitment(actionId) {
  const action = actions.find((item) => item.id === actionId);
  if (!action) return;

  const commitment = {
    id: `${actionId}-${Date.now()}`,
    text: `I will ${action.title.toLowerCase()}.`,
    impactKg: action.impactKg,
    sourceAction: action.title,
    createdAt: new Date().toISOString(),
    completed: false
  };

  state.commitments = [commitment, ...state.commitments];
  renderCommitments();
}

function setupCommitments() {
  const {
    commitmentForm,
    commitmentInput,
    commitmentSelect,
    commitmentList
  } = selectors;
  if (!commitmentForm || !commitmentInput || !commitmentSelect || !commitmentList) {
    return;
  }

  populateCommitmentSelect();

  commitmentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = commitmentInput.value.trim();
    const selectedActionId = commitmentSelect.value;
    if (!text) return;

    const matchedAction = actions.find((action) => action.id === selectedActionId);
    const defaultImpact = getRecommendedActions(actions, {
      focus: state.focus,
      effort: state.effort,
      time: state.time,
      tags: state.tags
    })[0];

    const commitment = {
      id: `custom-${Date.now()}`,
      text,
      impactKg: matchedAction?.impactKg ?? defaultImpact?.impactKg ?? 0,
      sourceAction: matchedAction?.title ?? defaultImpact?.title ?? 'Custom plan',
      createdAt: new Date().toISOString(),
      completed: false
    };

    state.commitments = [commitment, ...state.commitments];
    commitmentForm.reset();
    populateCommitmentSelect();
    renderCommitments();
  });

  commitmentList.addEventListener('change', (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.classList.contains('commitment-checkbox')) {
      const { commitmentId } = target.dataset;
      if (commitmentId) {
        toggleCommitmentCompletion(commitmentId, target.checked);
      }
    }
  });

  commitmentList.addEventListener('click', (event) => {
    const button = event.target instanceof HTMLElement ? event.target.closest('.commitment-remove') : null;
    if (button instanceof HTMLButtonElement) {
      const { commitmentId } = button.dataset;
      if (commitmentId) {
        removeCommitment(commitmentId);
      }
    }
  });
}

function populateCommitmentSelect() {
  const { commitmentSelect } = selectors;
  if (!commitmentSelect) return;

  commitmentSelect.innerHTML =
    '<option value="">Link it to a suggested action (optional)</option>';

  actions.forEach((action) => {
    const option = document.createElement('option');
    option.value = action.id;
    option.textContent = `${action.title} (${formatImpact(action.impactKg)})`;
    commitmentSelect.appendChild(option);
  });
}

function toggleCommitmentCompletion(commitmentId, completed) {
  state.commitments = state.commitments.map((commitment) =>
    commitment.id === commitmentId ? { ...commitment, completed } : commitment
  );
  renderCommitments();
}

function removeCommitment(commitmentId) {
  state.commitments = state.commitments.filter((commitment) => commitment.id !== commitmentId);
  renderCommitments();
}

function renderCommitments() {
  const { commitmentList } = selectors;
  if (!commitmentList) return;

  commitmentList.innerHTML = '';

  if (state.commitments.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'commitment-item';
    empty.textContent = 'Share your first commitment to inspire others.';
    commitmentList.appendChild(empty);
  } else {
    state.commitments.forEach((commitment) => {
      const item = document.createElement('li');
      item.className = `commitment-item fade-in${commitment.completed ? ' completed' : ''}`;

      const text = document.createElement('p');
      text.textContent = commitment.text;

      const meta = document.createElement('div');
      meta.className = 'commitment-meta';
      const timestamp = new Date(commitment.createdAt).toLocaleString();
      meta.innerHTML = `
        <span>${commitment.sourceAction}</span>
        <span>${formatImpact(commitment.impactKg)} • ${timestamp}</span>
      `;

      const actionsRow = document.createElement('div');
      actionsRow.className = 'commitment-actions';

      const toggleLabel = document.createElement('label');
      toggleLabel.className = 'commitment-toggle';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'commitment-checkbox';
      checkbox.dataset.commitmentId = commitment.id;
      checkbox.checked = Boolean(commitment.completed);
      const toggleText = document.createElement('span');
      toggleText.textContent = commitment.completed ? 'Completed' : 'Mark complete';
      toggleLabel.append(checkbox, toggleText);

      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.className = 'commitment-remove';
      removeButton.dataset.commitmentId = commitment.id;
      removeButton.textContent = 'Remove';

      actionsRow.append(toggleLabel, removeButton);

      item.append(text, meta, actionsRow);
      commitmentList.appendChild(item);
    });
  }

  updateCommitmentStats();

  observeFadeIns();
}

function updateCommitmentStats() {
  const {
    commitmentCount,
    completedCount,
    impactTotal,
    commitmentProgress,
    progressLabel
  } = selectors;

  const totalCommitments = state.commitments.length;
  const completed = state.commitments.filter((item) => item.completed).length;
  const totalImpact = estimateCommitmentImpact(state.commitments);
  const remainingImpact = Math.max(0, GOAL_IMPACT_KG - totalImpact);
  const progressValue = Math.min(totalImpact, GOAL_IMPACT_KG);
  const progressPercent = GOAL_IMPACT_KG
    ? Math.round((progressValue / GOAL_IMPACT_KG) * 100)
    : 0;

  if (commitmentCount) {
    commitmentCount.textContent = totalCommitments.toString();
  }

  if (completedCount) {
    completedCount.textContent = completed.toString();
  }

  if (impactTotal) {
    impactTotal.textContent = formatImpact(totalImpact);
  }

  if (commitmentProgress) {
    commitmentProgress.value = progressValue;
    commitmentProgress.textContent = `${progressPercent}%`;
  }

  if (progressLabel) {
    let message = "You're just getting started—log your first win!";
    if (totalCommitments === 0) {
      message = "You're just getting started—log your first win!";
    } else if (remainingImpact <= 0) {
      message = 'Goal met! Celebrate and invite a friend to join.';
    } else if (completed === 0) {
      message = `Add your first completion to unlock momentum. Only ${formatImpact(
        remainingImpact
      )} to reach this week's goal.`;
    } else {
      message = `Only ${formatImpact(remainingImpact)} to reach this week's goal. Keep going!`;
    }
    progressLabel.textContent = message;
  }
}

function setupAnimations() {
  if ('IntersectionObserver' in window) {
    fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2
      }
    );

    observeFadeIns();
  } else {
    document.querySelectorAll('.fade-in').forEach((element) => {
      element.classList.add('visible');
    });
  }
}

function observeFadeIns() {
  const elements = document.querySelectorAll('.fade-in:not(.visible)');
  if (fadeObserver) {
    elements.forEach((element) => {
      fadeObserver.observe(element);
    });
  } else {
    elements.forEach((element) => element.classList.add('visible'));
  }
}

function init() {
  setupHero();
  setupPlanner();
  setupFilters();
  renderActions();
  setupCommitments();
  renderCommitments();
  setupAnimations();
}

init();
