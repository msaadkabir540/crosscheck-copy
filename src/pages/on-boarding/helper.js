import style from './boarding.module.scss';

export const hearSelectOptions = [
  {
    label: 'Search Engine',
    value: 'Search Engine',
  },
  {
    label: 'Linkedin',
    value: 'Linkedin',
  },
  {
    label: 'Facebook / Instagram',
    value: 'Facebook / Instagram',
  },
  {
    label: 'Youtube',
    value: 'Youtube',
  },
  {
    label: 'Billboard',
    value: 'Billboard',
  },
  {
    label: 'Friend / Colleague',
    value: 'Friend / Colleague',
  },
  {
    label: 'Other',
    value: 'Other',
  },
];

export const hearTags = [
  { id: 1, name: 'Search Engine' },
  { id: 2, name: 'Linkedin' },
  { id: 3, name: 'Facebook / Instagram' },
  { id: 4, name: 'Youtube' },
  { id: 5, name: 'Billboard' },
  { id: 6, name: 'Friend / Colleague' },
  { id: 7, name: 'Other' },
];

export const workingPeopleOptions = [
  {
    label: 'Just Me',
    value: 'Just Me',
  },
  {
    label: '2-5',
    value: '2-5',
  },
  {
    label: '6-10',
    value: '6-10',
  },
  {
    label: '11-25',
    value: '11-25',
  },
  {
    label: '26-50',
    value: '26-50',
  },
  {
    label: '51-200',
    value: '51-200',
  },
  {
    label: '500+',
    value: '500+',
  },
  {
    label: `I don't know`,
    value: `I don't know`,
  },
];

export const workingPeopleData = [
  { id: 1, range: 'Just Me' },
  { id: 2, range: '2-5' },
  { id: 3, range: '6-10' },
  { id: 4, range: '11-25' },
  { id: 5, range: '26-50' },
  { id: 6, range: '51-200' },
  { id: 7, range: '500+' },
  { id: 8, range: "I don't know" },
];
export const planCards = [
  {
    heading: 'Free',
    color: '#34C369',
    subtitle: 'Best for personal use',

    price: '0',
    priceYearly: '0',
    btnText: 'Get started for free',
    cardBtn: style.btn1,
    activeButton: style.activeButton1,
    description: [
      '+ 25 Free Guest Seats',
      '3 Projects',
      '500 Bug Forms & Test Cases Per Project',
      '20 Test Runs Per Project',
      'Checks',
    ],
  },
  {
    heading: 'Basic',
    color: '#FD71AF',
    subtitle: 'Best for small size teams',

    price: '8',
    priceYearly: '6',
    btnText: 'Get started',
    cardBtn: style.btn2,
    activeButton: style.activeButton2,
    description: [
      '+ 5 Free Guest Seats Per Member',
      '5 Projects',
      '3,000 Bug Forms & Test Cases Per Project',
      '1,000 Test Runs Per Project',
      'Checks',
      'QA Report & Feedback Widget',
      'Clickup & Jira Intergations',
      'Activity / Audit Log & Trash',
    ],
  },
  {
    heading: 'Premium',
    color: '#49CCF9',
    price: '16',
    priceYearly: '12',
    subtitle: 'Best for medium size teams',

    btnText: 'Get started',
    cardBtn: style.btn3,
    activeButton: style.activeButton3,
    description: [
      '+ 5 Free Developer Role Seats per paid seat',
      `Unlimited Projects`,
      'Unlimited Bug Forms & Test Cases',
      'Unlimited Test Runs',
      'Checks',
      'QA Report & Feedback Widget',
      'Clickup & Jira Intergations',
      'Activity / Audit Log & Trash',
    ],
  },
];

export const hasFreePlanWorkspace = (workspaces) => {
  if (!workspaces || workspaces.length === 0) {
    return false;
  }

  if (workspaces?.length) {
    return workspaces?.some((workspace) => workspace?.plan === 'Free' || workspace?.initialPlan === 'Free');
  }
};

export const hasNoPlanWorkspace = (workspaces) => {
  if (!workspaces || workspaces.length === 0) {
    return false;
  }

  if (workspaces?.length) {
    return workspaces?.some((workspace) => workspace?.plan === 'No Plan' || workspace?.initialPlan === 'No Plan');
  }
};
