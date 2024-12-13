import { useQuery } from 'react-query';

import { getAllProjectsMilestonesFeatures } from 'api/v1/projects/projects';
import { getUsers } from 'api/v1/settings/user-management';
import { getTestedDevices, getTestedEnvironment } from 'api/v1/bugs/bugs';

import { first as _first, isEmpty as _isEmpty } from 'utils/lodash';

const menu = [
  {
    title: 'Line Chart',
    icon: 'charts/line-chart-icon',
    subtypes: [
      {
        title: 'Basic',
        preview: 'charts/preview/line-chart-preview',
      },
      {
        title: 'Line With Data Labels',
        preview: 'charts/preview/line-chart-data-labels',
      },
      {
        title: 'Stepline',
        preview: 'charts/preview/step-line-chart',
      },
      {
        title: 'Missing / null values',
        preview: 'charts/preview/missing-null-line-chart',
      },
      {
        title: 'Zoomable Timeseries',
        preview: 'charts/preview/zoomable-time-series-line-chart',
      },
      {
        title: 'Line Chart with Annotations',
        preview: 'charts/preview/zoomable-time-series-line-chart',
      },
      {
        title: 'Synchronized Charts',
        preview: 'charts/preview/syncing-line-charts',
      },
      {
        title: 'Brush Chart',
        preview: 'charts/preview/realtime-line-chart',
      },

      {
        title: 'Gradient Line',
        preview: 'charts/preview/realtime-line-chart',
      },
      {
        title: 'Realtime',
        preview: 'charts/preview/realtime-line-chart',
      },
      {
        title: 'Dashed',
        preview: 'charts/preview/dashed-line-chart',
      },
    ],
  },
  {
    title: 'Bar Chart',
    icon: 'charts/bar-chart-icon',
    subtypes: [
      {
        title: 'Basic',
      },
      {
        title: 'Grouped',
      },
      {
        title: 'Stacked',
      },
      {
        title: 'Stacked 100',
      },
      {
        title: 'Grouped Stacked Bars',
      },
      {
        title: 'Bar with Negative Values',
      },
      {
        title: 'Bar with Markers',
      },
      {
        title: 'Reversed Bar Chart',
      },
      {
        title: 'Custom DataLabels Bar',
      },
      {
        title: 'Patterned',
      },
      {
        title: 'Bar with Images',
      },
    ],
  },
  {
    title: 'Pie Chart',
    icon: 'charts/pie-chart-icon',
    subtypes: [
      {
        title: 'Simple Pie',
        preview: 'charts/preview/gradient-donut-chart',
      },

      {
        title: 'Monochrome Pie',
        preview: 'charts/preview/monochrome-pie-chart',
      },

      {
        title: 'Pie with Image',
        preview: 'charts/preview/image-fill-pie-chart',
      },
    ],
  },
  {
    title: 'Donut Chart',
    icon: 'charts/pie-chart-icon',
    subtypes: [
      {
        title: 'Simple Donut',
        preview: 'charts/preview/simple-donut-chart',
      },
      {
        title: 'Donut Update',
        preview: 'charts/preview/updating-donut-chart',
      },

      {
        title: 'Gradient Donut',
        preview: 'charts/preview/gradient-donut-chart',
      },

      {
        title: 'Donut with Pattern',
        preview: 'charts/preview/patterned-donut-chart',
      },
    ],
  },
  {
    title: 'Area Chart',
    icon: 'charts/area-chart-icon',
    subtypes: [
      {
        title: 'Basic',
        preview: 'charts/preview/basic-area-chart',
      },
      {
        title: 'Spline Area',
        preview: 'charts/preview/spline-area-chart',
      },
      {
        title: 'Datetime X-axis',
        preview: 'charts/preview/datetime-x-axis-area-chart',
      },
      {
        title: 'Negative',
        preview: 'charts/preview/negative-values-area-chart',
      },
      {
        title: 'Github Style',
        preview: 'charts/preview/github-style-area-chart',
      },
      {
        title: 'Stacked',
        preview: 'charts/preview/stacked-area-chart',
      },
      {
        title: 'Irregular Timeseries',
        preview: 'charts/preview/irregular-timeseries-area-chart',
      },
      {
        title: 'Missing / Null values',
        preview: 'charts/preview/null-values-area-chart',
      },
    ],
  },
  {
    title: 'Combo Chart',
    icon: 'charts/combo-chart-icon',
    subtypes: [
      {
        title: 'Line & Column',
        preview: 'charts/preview/line-column-combo-chart',
      },
      {
        title: 'Multiple Y-axis',
        preview: 'charts/preview/multiple-y-axis-combo-chart',
      },
      {
        title: 'Line & Area',
        preview: 'charts/preview/line-area-combo-chart',
      },
      {
        title: 'Line, Column & Area',
        preview: 'charts/preview/line-area-combo-chart',
      },
    ],
  },
  {
    title: 'Radial Chart',
    icon: 'charts/radial-chart-icon',
    subtypes: [
      {
        title: 'Basic',
        preview: 'charts/preview/basic-radial-chart',
      },
      {
        title: 'Multiple',
        preview: 'charts/preview/custom-angle-radial-chart',
      },
      {
        title: 'Custom Angle Circle',
        preview: 'charts/preview/custom-angle-radial-chart',
      },
      {
        title: 'Gradient',
        preview: 'charts/preview/gradiant-radial-chart',
      },
      {
        title: 'Radial bar with Image',
        preview: 'charts/preview/image-radial-chart',
      },
      {
        title: 'Stroked Gauge',
        preview: 'charts/preview/stroked-gauge-radial-chart',
      },
      {
        title: 'Semi Circle Gauge',
        preview: 'charts/preview/semi-gauge-radial-chart',
      },
    ],
  },
  {
    title: 'Timeline Chart',
    icon: 'charts/timeline-chart-icon',
    subtypes: [
      {
        title: 'Basic',
        preview: 'charts/preview/basic-time-chart',
      },
      {
        title: 'Custom Colors',
        preview: 'charts/preview/different-color-time-chart',
      },
      {
        title: 'Multi-series',
        preview: 'charts/preview/group-row-time-chart',
      },
      {
        title: 'Advanced (Multi-range)',
        preview: 'charts/preview/advance-time-chart',
      },
      {
        title: 'Multiple series – Group rows',
        preview: 'charts/preview/group-row-time-chart',
      },
      {
        title: 'Dumbbell Chart (Horizontal)',
        preview: 'charts/preview/dumbbell-time-chart',
      },
    ],
  },
  {
    title: 'Tree Chart',
    icon: 'charts/treemap-chart-icon',
    subtypes: [
      {
        title: 'Basic',
        preview: 'charts/preview/basic-treemap-chart',
      },
      {
        title: 'Treemap Multiple Series',
        preview: 'charts/preview/color-ranges-treemap-chart',
      },
      {
        title: 'Color Range',
        preview: 'charts/preview/color-ranges-treemap-chart',
      },
      {
        title: 'Distributed',
        preview: 'charts/preview/distributed-treemap-chart',
      },
    ],
  },
  {
    title: 'Heat Chart',
    icon: 'charts/heat-chart-icon',
    subtypes: [
      {
        title: 'Basic',
        preview: 'charts/preview/color-range-heatmap-chart',
      },
      {
        title: 'Multiple Colors for each Series',
        preview: 'charts/preview/multiple-series-heatmap-chat',
      },

      {
        title: 'Color range',
        preview: 'charts/preview/color-range-heatmap-chart',
      },
      {
        title: 'Rounded (Range without shades)',
        preview: 'charts/preview/range-without-shades-heatmap-chart',
      },
    ],
  },
  {
    title: 'Table',
    icon: 'charts/table-icon',
    subtypes: [
      {
        title: 'Coming Soon',
      },
    ],
  },
  {
    title: 'Calculation',
    icon: 'charts/calculation-icon',
    subtypes: [
      {
        title: 'Coming Soon',
      },
    ],
  },
];

export function getPreviewValue(type, subtype) {
  const menuItem = menu.find((item) => item.title === type);

  if (!menuItem) {
    return null;
  }

  const subtypeItem = menuItem.subtypes.find((item) => item.title === subtype);

  if (!subtypeItem) {
    return null;
  }

  return subtypeItem.preview || null;
}

export const options = {
  category: [
    {
      value: 'Bugs Reporting',
      label: 'Bugs Reporting',
      'x-axis': [
        { value: 'project', label: 'Project' },
        { value: 'milestone', label: 'Milestone' },
        { value: 'feature', label: 'Feature' },
        { value: 'status', label: 'Status' },
        { value: 'bugType', label: 'Bug Type' },
        { value: 'testingType', label: 'Testing Type' },
        { value: 'developerName', label: 'Developer Name' },
        { value: 'bugSubtype', label: 'Bug Subtype' },
        { value: 'reportedBy', label: 'Reported By' },

        { value: 'severity', label: 'Severity' },
        { value: 'retestby', label: 'Retest By' },
        { value: 'retestDate', label: 'Retest Date' },
        { value: 'lasttaskcreateddate', label: 'Task Created Date' },
        { value: 'taskcreatedby', label: 'Task Created By' },

        { value: 'closeddate', label: 'Closed Date' },
        { value: 'closedby', label: 'Closed By' },
        { value: 'customtags', label: 'Custom Tag' },
      ],
      'y-axis': [
        { value: 'bugCount', label: 'Bug count' },

        { value: 'retestCount', label: 'Retest count' },
      ],
    },
    {
      value: 'Test Cases',
      label: 'Test Cases',
      'x-axis': [
        { value: 'project', label: 'Project' },
        { value: 'milestone', label: 'Milestone' },
        { value: 'feature', label: 'Feature' },
        { value: 'status', label: 'Status' },
        { value: 'state', label: 'State' },
        { value: 'testType', label: 'Test Type' },
        { value: 'createdBy', label: 'Created By' },
        { value: 'createdAt', label: 'Created At' },
        { value: 'lastTestedBy', label: 'Tested By' },
        { value: 'lastTestedAt', label: 'Tested Date' },
        { value: 'lastTaskCreatedDate', label: 'Task Created Date' },
        { value: 'taskCreatedBy', label: 'Task Created By' },
        { value: 'lastTaskAssignedTo', label: 'Assigned To' },
        { value: 'customTags', label: 'Custom Tag' },
      ],
      'y-axis': [
        { value: 'testCasesCount', label: 'Test cases count' },

        { value: 'avgWeightage', label: 'Avg of Weightage' },
        { value: 'testedCount', label: 'Tested count' },
      ],
    },
    {
      value: 'Test Run',
      label: 'Test Run',
      'x-axis': [
        { value: 'project', label: 'Project' },
        { value: 'runType', label: 'Run Type' },
        { value: 'dueDate', label: 'Due Date' },
        { value: 'priority', label: 'Priority' },
        { value: 'assignee', label: 'Assigned to' },
        { value: 'createdBy', label: 'Created By' },
        { value: 'createdAt', label: 'Created At' },
        { value: 'closedDate', label: 'Closed Date' },
        { value: 'status', label: 'Status' },
      ],
      'y-axis': [
        { value: 'timeEntriesSum', label: 'Sum of Time Entries' },
        { value: 'testRunsCount', label: 'Count of Test Runs' },
        { value: 'avgTestRunAge', label: 'Test Run Age' },
      ],
    },
    {
      value: 'Feedback',
      label: 'Feedback',
      'x-axis': [
        { value: 'project', label: 'Project' },
        { value: 'reportedDate', label: 'Reported Date' },
      ],
      'y-axis': [{ value: 'countOfFeedback', label: 'Count of Feedback' }],
    },
    {
      value: 'Tasks',
      label: 'Tasks',
      'x-axis': [
        { value: 'project', label: 'Project' },
        { value: 'application', label: 'Application' },
        { value: 'createdBy', label: 'Created By' },
        { value: 'createdDate', label: 'Created Date' },
        { value: 'taskType', label: 'Task Type' },
      ],
      'y-axis': [
        { value: 'countOfTasks', label: 'Count of Tasks' },
        { value: 'avgOfTasks', label: 'Avg of tasks' },
      ],
    },
    {
      value: 'Activities',
      label: 'Activities',
      'x-axis': [
        { value: 'project', label: 'Project' },
        { value: 'activityBy', label: 'Activity By' },
        { value: 'activityDate', label: 'Activity Date' },
        { value: 'activityType', label: 'Activity Type' },
      ],

      'y-axis': [
        { value: 'countOfActivities', label: 'Count of Activities' },
        { value: 'avgOfActivities', label: 'Avg of activities' },
      ],
    },
  ],
};

export const filters = {
  'Bugs Reporting': [
    {
      label: 'Projects',
      name: 'projects',
      options: [],
      isMulti: true,
      fieldType: 'select',
    },
    {
      label: 'Milestone',
      name: 'milestones',
      options: [],
      isMulti: true,
      fieldType: 'select',
    },
    {
      label: 'Features',
      name: 'features',
      options: [],
      isMulti: true,
      fieldType: 'select',
    },
    {
      label: 'Status',
      name: 'status',
      options: [
        { label: 'Open', value: 'Open', checkbox: true },
        { label: 'Closed', value: 'Closed', checkbox: true },
        { label: 'Reproducible', value: 'Reproducible', checkbox: true },
        { label: 'Blocked', value: 'Blocked', checkbox: true },
        { label: 'Need To Discuss', value: 'Need To Discuss', checkbox: true },
        { label: 'Reopen', value: 'Reopen', checkbox: true },
      ],
      isMulti: true,
      fieldType: 'select',
    },
    {
      label: 'Bug Type',
      name: 'bugType',
      options: [
        { label: 'Functionality', value: 'Functionality', checkbox: true },
        { label: 'Performance', value: 'Performance', checkbox: true },
        { label: 'UI', value: 'UI', checkbox: true },
        { label: 'Security', value: 'Security', checkbox: true },
      ],
      isMulti: true,
      fieldType: 'select',
    },
    {
      label: 'Severity',
      name: 'severity',
      options: [
        { label: 'Critical', value: 'Critical', checkbox: true },
        { label: 'High', value: 'High', checkbox: true },
        { label: 'Medium', value: 'Medium', checkbox: true },
        { label: 'Low', value: 'Low', checkbox: true },
      ],
      isMulti: true,
      fieldType: 'select',
    },
    {
      label: 'Testing Type',
      name: 'testingType',
      options: [
        {
          label: 'Functional Testing',
          value: 'Functional Testing',
          checkbox: true,
        },
        {
          label: 'Regression Testing',
          value: 'Regression Testing',
          checkbox: true,
        },
        {
          label: 'Integration Testing',
          value: 'Integration Testing',
          checkbox: true,
        },
        {
          label: 'User Acceptance Testing',
          value: 'User Acceptance Testing',
          checkbox: true,
        },
      ],
      isMulti: true,
      fieldType: 'select',
    },
    {
      label: 'Assigned To ',
      name: 'assignedTo',
      options: [],
      isMulti: true,
      fieldType: 'select',
    },
    {
      label: 'Reported By ',
      name: 'reportedBy',
      options: [],
      isMulti: true,
      fieldType: 'select',
    },
    {
      label: 'Reported Date ',
      name: 'reportedAt',
      fieldType: 'date',
    },
    {
      label: 'Developer',
      name: 'bugBy',
      options: [],
      fieldType: 'select',
    },
    {
      label: 'Tested Device',
      name: 'testedDevice',
      options: [],
      isMulti: true,
      fieldType: 'select',
    },
    {
      label: 'Tested Environment ',
      name: 'testedEnvironment',
      options: [],
      isMulti: true,
      fieldType: 'select',
    },

    {
      label: 'Retest Date',
      name: 'reTestDate',
      fieldType: 'date',
    },
    {
      label: 'Closed Date  ',
      name: 'closedDate',
      fieldType: 'date',
    },
  ],
  'Test Cases': [
    {
      label: 'Projects',
      name: 'projects',
      options: [],
      isMulti: true,
      fieldType: 'select',
    },
    {
      label: 'Milestone',
      name: 'milestones',
      options: [],
      isMulti: true,
      fieldType: 'select',
    },
    {
      label: 'Features',
      name: 'features',
      options: [],
      isMulti: true,
      fieldType: 'select',
    },
    {
      label: 'Assigned To ',
      name: 'assignedTo',
      options: [],
      isMulti: true,
      fieldType: 'select',
    },
    {
      label: 'State',
      name: 'state',
      options: [
        {
          label: 'Active',
          value: 'Active',
          checkbox: true,
        },
        { label: 'Obsolete', value: 'Obsolete', checkbox: true },
      ],
      isMulti: true,
      fieldType: 'select',
    },
    {
      label: 'Status',
      name: 'status',
      options: [
        { label: 'Not Tested', value: 'Not Tested', checkbox: true },
        { label: 'Blocked', value: 'Blocked', checkbox: true },
        { label: 'Failed', value: 'Failed', checkbox: true },
        { label: 'Passed', value: 'Passed', checkbox: true },
      ],
      isMulti: true,
      fieldType: 'select',
    },
    {
      label: 'Test Type',
      name: 'testType',
      options: [
        {
          label: 'Functionality Testing',
          value: 'Functionality',
          checkbox: true,
        },
        { label: 'Performance Testing', value: 'Performance', checkbox: true },
        { label: 'Security Testing', value: 'Security', checkbox: true },
        { label: 'UI Testing', value: 'UI', checkbox: true },
      ],
      isMulti: true,
      fieldType: 'select',
    },
    {
      label: 'Created Date',
      name: 'createdAt',
      fieldType: 'date',
    },

    {
      label: 'Created By',
      name: 'createdBy',
      options: [],
      isMulti: true,
      fieldType: 'select',
    },
    {
      label: 'Last Tested Date',
      name: 'reTestDate',
      fieldType: 'date',
    },
    {
      label: 'Last Tested By',
      name: 'lastTestedBy',
      options: [],
      isMulti: true,
      fieldType: 'select',
    },
  ],
  'Test Run': [
    {
      label: 'Projects',
      name: 'projects',
      options: [],
      isMulti: true,
      fieldType: 'select',
    },
    {
      label: 'Status',
      name: 'status',
      options: [
        { label: 'Open', value: 'Open', checkbox: true },
        { label: 'Closed', value: 'Closed', checkbox: true },
      ],
      isMulti: true,
      fieldType: 'select',
    },

    {
      label: 'Created Date',
      name: 'createdAt',
      fieldType: 'date',
    },

    {
      label: 'Created By',
      name: 'createdBy',
      options: [],
      isMulti: true,
      fieldType: 'select',
    },

    {
      label: 'Due Date',
      name: 'dueDate',
      fieldType: 'date',
    },
    {
      label: 'Assigned To ',
      name: 'assignedTo',
      options: [],
      isMulti: true,
      fieldType: 'select',
    },
  ],
  Feedback: [
    {
      label: 'Projects',
      name: 'projects',
      options: [],
      isMulti: true,
      fieldType: 'select',
    },

    {
      label: 'Reported At',
      name: 'reportedAt',
      fieldType: 'date',
    },
  ],
  Tasks: [
    {
      label: 'Application',
      name: 'applicationType',
      options: [
        { label: 'Jira', value: 'Jira', checkbox: true },
        { label: 'ClickUp', value: 'ClickUp', checkbox: true },
      ],
      isMulti: true,
      fieldType: 'select',
    },
    {
      label: 'Task Type',
      name: 'taskType',
      options: [
        { label: 'Bug', value: 'Bug', checkbox: true },
        { label: 'Test Case', value: 'Test Case', checkbox: true },
      ],
      isMulti: true,
      fieldType: 'select',
    },
    {
      label: 'Assignee',
      name: 'crossCheckAssignee',
      options: [],
      isMulti: true,
      fieldType: 'select',
    },
    {
      label: 'Created By',
      name: 'createdBy',
      options: [],
      isMulti: true,
      fieldType: 'select',
    },
    {
      label: 'Created Date',
      name: 'createdAt',
      fieldType: 'date',
    },
  ],
  Activities: [
    {
      label: 'Activity By',
      name: 'activityBy',
      options: [],
      isMulti: true,
      fieldType: 'select',
    },
    {
      label: 'Activity Type',
      name: 'activityType',
      options: [
        { label: 'Login', value: 'Login', checkbox: true },
        { label: 'User Management', value: 'User Management', checkbox: true },
        {
          label: 'Account Settings',
          value: 'Account Settings',
          checkbox: true,
        },
        { label: 'Test Cases', value: 'Test Cases', checkbox: true },
        { label: 'Bugs Reporting', value: 'Bugs Reporting', checkbox: true },
        { label: 'Test Runs', value: 'Test Runs', checkbox: true },
        { label: 'Projects', value: 'Projects', checkbox: true },
        { label: 'Trash', value: 'Trash', checkbox: true },
      ],
      isMulti: true,
      fieldType: 'select',
    },
    {
      label: 'Activity At',
      name: 'activityAt',
      fieldType: 'date',
    },
  ],
};

export function useDropDownOptionsForValues() {
  return useQuery({
    queryKey: ['chart-form-options'],
    queryFn: async () => {
      const _getProjectsMilestonesFeatures = await getAllProjectsMilestonesFeatures();
      const { testedEnvironments } = await getTestedEnvironment();
      const { testedDevice } = await getTestedDevices();

      const { users = [] } = await getUsers({
        sortBy: '',
        sort: '',
        search: '',
      });

      const projects =
        _getProjectsMilestonesFeatures?.allProjects?.map((x, i) => ({
          index: i,
          label: x.name,
          value: x._id,
          checkbox: true,
        })) || [];

      const milestones =
        _getProjectsMilestonesFeatures?.allMilestones?.map((x) => ({
          ...x,
          label: x.name,
          value: x._id,
          checkbox: true,
        })) || [];

      const features =
        _getProjectsMilestonesFeatures?.allFeatures?.map((x) => ({
          ...x,
          label: x.name,
          value: x._id,
          checkbox: true,
        })) || [];

      const testedEnvironment = [
        ...(testedEnvironments?.map((x) => ({
          label: x,
          value: x,
          checkbox: true,
        })) || []),
      ];

      const testedDevices =
        testedDevice?.map((x) => ({
          label: x,
          value: x,
          checkbox: true,
        })) || [];

      const usersOptions = users.map((x) => ({
        label: x.name,
        ...(x?.profilePicture && { image: x?.profilePicture }),
        ...(!x?.profilePicture && { imagAlt: _first(x?.name) }),
        value: x._id,
        checkbox: true,
      }));

      return {
        projects,
        milestones,
        features,
        testedEnvironment,
        testedDevices,
        assignedTo: usersOptions,
        createdBy: usersOptions,
        reportedBy: usersOptions,
        lastTestedBy: usersOptions,
        bugBy: usersOptions,
      };
    },
    refetchOnWindowFocus: false,
  });
}

export const findMaxY = (layout) => {
  const existingLayout = [...layout];

  let maxY = 0;
  existingLayout.forEach((item) => {
    if (item?.y && item?.h && item?.y + item?.h > maxY) {
      maxY = item.y + item.h;
    }
  });

  return maxY;
};

export const createDataGrid = (key, maxY) => {
  return {
    i: key,
    x: 0,
    y: maxY,
    w: 4,
    h: 10,
  };
};

const dateValues = ['reportedAt', 'reTestDate', 'closedDate', 'createdAt', 'dueDate', 'activityAt'];

export function getValidKeyValues(filters) {
  const validKeyValues = {};

  for (const key in filters) {
    if (filters[key] && !_isEmpty(filters[key])) {
      validKeyValues[key] = filters[key];
    }

    if (dateValues.includes(key) && filters[key] && !_isEmpty(filters[key])) {
      validKeyValues[key].start = validKeyValues[key].startDate;
      validKeyValues[key].end = validKeyValues[key].endDate;
      delete validKeyValues[key].startDate;
      delete validKeyValues[key].endDate;
    }
  }

  return validKeyValues;
}

export default menu;
