const STAGES = ['sale_processing', 'fulfillment', 'fulfilled'];

const STAGE_LABELS = {
  sale_processing: 'Sale Processing',
  fulfillment: 'Fulfillment',
  fulfilled: 'Fulfilled',
};

const VALID_TRANSITIONS = {
  sale_processing: ['fulfilled'],
  fulfillment: ['fulfilled'],
  fulfilled: [],
};

function isValidTransition(currentStage, newStage) {
  const allowed = VALID_TRANSITIONS[currentStage];
  if (!allowed) return false;
  return allowed.includes(newStage);
}

module.exports = { STAGES, STAGE_LABELS, VALID_TRANSITIONS, isValidTransition };
