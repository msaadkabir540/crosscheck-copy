const crossCheckFields = [
  {
    label: 'Milestones',
    name: 'milestones',
    required: true,
    shouldAutoMap: true,
    isCreateAble: true,
  },
  {
    label: 'Features',
    name: 'features',
    required: true,
    shouldAutoMap: true,
    isHierarchy: true,
    isCreateAble: true,
  },

  { label: 'Feedback', name: 'feedback', required: false, shouldAutoMap: false },
  { label: 'Steps to Reproduce', name: 'stepsToReproduce', required: false, shouldAutoMap: false },
  { label: 'Ideal Behaviour', name: 'idealBehaviour', required: false, shouldAutoMap: false },
  {
    label: 'Severity',
    name: 'severity',
    required: false,
    shouldAutoMap: true,
  },
  {
    label: 'Bug Type',
    name: 'bugType',
    required: false,
    shouldAutoMap: true,
  },
  {
    label: 'Bug Subtype',
    name: 'bugSubtype',
    required: false,
    shouldAutoMap: true,
    isCreateAble: true,
  },

  { label: 'Developer Name', name: 'developerName', required: false, shouldAutoMap: true },
  { label: 'Task ID', name: 'taskId', required: false, shouldAutoMap: false },
  { label: 'Tested Version', name: 'testedVersion', required: false, shouldAutoMap: false },
  {
    label: 'Testing Type',
    name: 'testType',
    required: true,
    shouldAutoMap: true,
  },
  {
    label: 'Tested Device',
    name: 'testedDevice',
    required: false,
    shouldAutoMap: true,
    isCreateAble: true,
  },

  {
    label: 'Tested environment',
    name: 'testedEnvironment',
    required: false,
    shouldAutoMap: true,
    isCreateAble: true,
  },

  { label: 'Test Evidence', name: 'testEvidence', required: false, shouldAutoMap: false },
  { label: 'Status', name: 'status', required: false, shouldAutoMap: true },
  { label: 'Reported Date', name: 'reportedDate', required: false, shouldAutoMap: false },
  {
    label: 'Reported By',
    name: 'reportedBy',
    required: false,
    shouldAutoMap: true,
  },
];

const finalMapping = {
  milestoneId: 'milestones',
  featureId: 'features',
  feedback: 'feedback',
  reproduceSteps: 'stepsToReproduce',
  idealBehaviour: 'idealBehaviour',
  severity: 'severity',
  bugType: 'bugType',
  bugSubType: 'bugSubtype',
  developerId: 'developerName',
  taskId: 'taskId',
  testedVersion: 'testedVersion',
  testingType: 'testType',
  testedDevice: 'testedDevice',
  testedEnvironment: 'testedEnvironment',
  testEvidence: 'testEvidence',
  status: 'status',
  reportedBy: 'reportedBy',
  reportedAt: 'reportedDate',
};
export { crossCheckFields, finalMapping };
