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

  { label: 'Test Type', name: 'testType', required: false, shouldAutoMap: true },
  { label: 'Test Objective', name: 'testObjective', required: false, shouldAutoMap: false },
  { label: 'Pre Conditions', name: 'preConditions', required: false, shouldAutoMap: false },
  { label: 'Test Steps', name: 'testSteps', required: false, shouldAutoMap: false },
  { label: 'Expected Result', name: 'expectedResult', required: false, shouldAutoMap: false },

  {
    label: 'Weightage',
    name: 'weightage',
    required: false,
    shouldAutoMap: true,
  },
  {
    label: 'Status',
    name: 'status',
    required: false,
    shouldAutoMap: true,
  },
  {
    label: 'State',
    name: 'state',
    required: false,
    shouldAutoMap: true,
  },

  { label: 'Created Date', name: 'createdDate', required: false, shouldAutoMap: false },
  {
    label: 'Created By',
    name: 'createdBy',
    required: false,
    shouldAutoMap: true,
  },
];

const finalMapping = {
  milestoneId: 'milestones',
  featureId: 'features',
  testType: 'testType',
  testObjective: 'testObjective',
  preConditions: 'preConditions',
  testSteps: 'testSteps',
  expectedResults: 'expectedResult',
  weightage: 'weightage',
  status: 'status',
  state: 'state',
  createdDate: 'createdDate',
  createdBy: 'createdBy',
};
export { crossCheckFields, finalMapping };
