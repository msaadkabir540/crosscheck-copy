import { validateDescription } from 'utils/validations';

const InitialRules = {
  projectId: {
    required: {
      value: true,
      message: 'Required',
    },
  },
  milestoneId: {},
  featureId: {},
  feedback: {},
  reproduceSteps: {},
  idealBehaviour: {},
  severity: {},
  bugType: {},
  bugSubType: {},
  developerId: {},
  taskId: {},
  testedVersion: {},
  testingType: {},
  testedDevice: {},
  testedEnvironment: {},
  tags: {},
  testEvidence: {},
};

const imageValidation = (e) => {
  if (!e.base64) {
    return 'Required';
  }

  try {
    new URL(e.base64);

    return true;
  } catch (err) {
    return 'Not a valid URL';
  }
};

const description = ['feedback', 'reproduceSteps', 'idealBehaviour'];
const images = ['testEvidence'];

const validationHandler = (rulesConfig) => {
  const keys = Object.keys(InitialRules);

  const rules = keys.reduce((acc, key) => {
    if (rulesConfig[key]) {
      acc[key] = { required: { value: true, message: 'Required' } };
    }

    if (rulesConfig[key] && description.includes(key)) {
      acc[key] = { required: { value: true, message: 'Required' }, validate: validateDescription };
    }

    if (rulesConfig[key] && images.includes(key)) {
      acc[key] = { required: { value: true, message: 'Required' }, validate: imageValidation };
    }

    return acc;
  }, {});

  return rules;
};

export { InitialRules, validationHandler };
