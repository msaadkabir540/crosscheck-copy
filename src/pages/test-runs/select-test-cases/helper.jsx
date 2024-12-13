import { useCallback } from 'react';

import { useQuery } from 'react-query';

import Checkbox from 'components/checkbox';
import Tags from 'components/tags';

import { getAllProjectsMilestonesFeatures } from 'api/v1/projects/projects';

import { formattedDate } from 'utils/date-handler';
import { values as _values, findLastIndex as _findLastIndex } from 'utils/lodash';

import style from './modal.module.scss';

export function useProjectOptions() {
  return useQuery({
    queryKey: ['projectsOptions'],
    queryFn: async () => {
      const _getProjectsMilestonesFeatures = await getAllProjectsMilestonesFeatures();

      const projectOptions =
        _getProjectsMilestonesFeatures?.allProjects?.map((x) => ({
          label: x.name,
          value: x._id,
        })) || [];

      const mileStonesOptions =
        _getProjectsMilestonesFeatures?.allMilestones?.map((x) => ({
          ...x,
          label: x.name,
          value: x._id,
        })) || [];

      const featuresOptions =
        _getProjectsMilestonesFeatures?.allFeatures?.map((x) => ({
          ...x,
          label: x.name,
          value: x._id,
        })) || [];

      return {
        projectOptions,
        mileStonesOptions,
        featuresOptions,
      };
    },
    refetchOnWindowFocus: false,
  });
}

//NOTE: GENERIC

export const initialValueFilters = {
  filteredTestCases: [],
  filteredBugs: [],
  allTestCases: {},
  allBugs: {},
  milestoneOptions: {},
  totalCount: 0,
  selection: {},
  selectedTestCases: {},
  selectedBugs: {},
  selectionCount: 0,
  isFilteredTestCasesArePartialChecked: false,
  isFilteredBugsArePartialChecked: false,
  isFilteredBugsAreChecked: false,
};

export const resetHandler = () => {
  return {
    filteredTestCases: [],
    filteredBugs: [],
    allTestCases: {},
    allBugs: {},
    milestoneOptions: {},
    totalCount: 0,
    selection: {},
    selectedTestCases: {},
    selectedBugs: {},
    selectionCount: 0,
    isFilteredTestCasesArePartialChecked: false,
    isFilteredBugsArePartialChecked: false,
    isFilteredBugsAreChecked: false,
  };
};

export const onExpand = ({ state, data }) => {
  if (data.type === 'milestone') {
    state.milestoneOptions[data.id].expanded = !state.milestoneOptions[data.id].expanded;

    return { ...state };
  } else {
    return { ...state };
  }
};

export const unClickedAll = ({ state, data }) => {
  Object.keys(state.milestoneOptions).forEach((milestoneId) => {
    if (milestoneId !== data.id) {
      state.milestoneOptions[milestoneId].clicked = false;
    }
  });
  Object.keys(state.milestoneOptions).forEach((milestoneId) => {
    if (milestoneId !== data.id) {
      Object.keys(state.milestoneOptions[milestoneId].mileStonesFeaturesOptions).forEach((featureId) => {
        state.milestoneOptions[milestoneId].mileStonesFeaturesOptions[featureId].clicked = false;
      });
    }
  });

  return state;
};

//NOTE: TESTCASES
export const initialFilter = {
  search: '',
  projects: [],
  milestones: [],
  features: [],
  status: [],
  createdBy: [],
  lastTestedBy: [],
  state: [],
  weightage: [],
  testType: [],
  relatedTicketId: '',
};

export const columnsData = ({
  allPartialChecked,
  allChecked,
  allTestCases,
  viewSelected,
  allFilteredTestCases,
  testCaseChecked,
}) => [
  {
    name: <InitialAction {...{ viewSelected, allChecked, allPartialChecked, testCaseChecked, allFilteredTestCases }} />,
    key: 'actions',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '50px', height: '36px' },
    widthInEditMode: { width: '182px' },
    displayIcon: true,

    render: ({ row }) => {
      return <InitialActionRender {...{ row, allTestCases, testCaseChecked }} />;
    },
  },
  {
    name: 'Test Case ID',
    key: 'testCaseId',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '250px' },
    displayIcon: true,

    render: ({ row }) => {
      return (
        <div className={`${style.imgDiv} ${style.pointerClass}`}>
          <p className={style.userName}>{row?.testCaseId}</p>
        </div>
      );
    },
  },
  {
    name: 'Project',
    key: 'projectId',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '182px' },
    displayIcon: true,

    render: ({ row }) => {
      return (
        <div className={style.imgDiv}>
          <p className={style.userName}>{row?.projectId?.name}</p>
        </div>
      );
    },
  },
  {
    name: 'Milestone',
    key: 'milestoneId',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.milestoneId?.name}</p>
      </div>
    ),
  },

  {
    name: 'Feature',
    key: 'featureId',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.featureId?.name}</p>
      </div>
    ),
  },
  {
    name: 'Test Type',
    key: 'testType',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.testType}</p>
      </div>
    ),
  },
  {
    name: 'Test Objective',
    key: 'testObjective',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.testObjective?.text}</p>
      </div>
    ),
  },
  {
    name: 'Pre Conditions',
    key: 'preConditions',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.preConditions?.text}</p>
      </div>
    ),
  },
  {
    name: 'Test Steps',
    key: 'testSteps',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.testSteps?.text}</p>
      </div>
    ),
  },
  {
    name: 'Expected Results',
    key: 'expectedResults',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.expectedResults?.text}</p>
      </div>
    ),
  },
  {
    name: 'Weightage',
    key: 'weightage',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row.weightage}</p>
      </div>
    ),
  },
  {
    name: 'Status',
    key: 'status',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Tags text={row.status} />
        </p>
      </div>
    ),
  },
  {
    name: 'Related Ticket ID',
    key: 'relatedTicketId',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row.relatedTicketId}</p>
      </div>
    ),
  },

  {
    name: 'Last Tested at',
    key: 'lastTestedAt',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{formattedDate(row.lastTestedAt, 'dd-MMM-yy')}</p>
      </div>
    ),
  },
  {
    name: 'Last Tested by',
    key: 'lastTestedBy',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.lastTestedBy?.name}</p>
      </div>
    ),
  },
  {
    name: 'Created at',
    key: 'createdAt',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{formattedDate(row.createdAt, 'dd-MMM-yy')}</p>
      </div>
    ),
  },
  {
    name: 'Created by',
    key: 'createdBy',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.createdBy?.name}</p>
      </div>
    ),
  },
];

export const testCaseSelectionHandler = ({ state, data }) => {
  const { event, testCases } = data;

  const selection = testCases;
  const newState = { ...state };

  // NOTE: checking true all the values for testCases Getting
  for (const item of selection) {
    newState.allTestCases[item._id].checked = event.target.checked;

    if (event.target.checked) {
      newState.selectedTestCases[item._id] = item;
      state.milestoneOptions[item.milestoneId._id]?.selectedCount >= 0
        ? (state.milestoneOptions[item.milestoneId._id].selectedCount += 1)
        : null;
      state.milestoneOptions[item.milestoneId._id].selectedCount >= 0
        ? (state.milestoneOptions[item.milestoneId._id].mileStonesFeaturesOptions[item.featureId._id].selectedCount +=
            1)
        : '';
    } else if (!event.target.checked) {
      delete state.selectedTestCases[item._id];
      state.milestoneOptions[item.milestoneId._id].selectedCount
        ? (state.milestoneOptions[item.milestoneId._id].selectedCount -= 1)
        : '';
      state.milestoneOptions[item.milestoneId._id].mileStonesFeaturesOptions[item.featureId._id].selectedCount
        ? (state.milestoneOptions[item.milestoneId._id].mileStonesFeaturesOptions[item.featureId._id].selectedCount -=
            1)
        : '';
    }

    // NOTE: setting MileStone Partial or checked
    newState.milestoneOptions[item.milestoneId._id].checked =
      !!newState.milestoneOptions[item.milestoneId._id].selectedCount;
    newState.milestoneOptions[item.milestoneId._id].partial =
      !!newState.milestoneOptions[item.milestoneId._id].selectedCount &&
      newState.milestoneOptions[item.milestoneId._id].totalCount !==
        newState.milestoneOptions[item.milestoneId._id].selectedCount;

    // NOTE: setting feature Partial or checked
    newState.milestoneOptions[item.milestoneId._id].mileStonesFeaturesOptions[item.featureId._id].checked =
      !!newState.milestoneOptions[item.milestoneId._id].mileStonesFeaturesOptions[item.featureId._id].selectedCount;
    newState.milestoneOptions[item.milestoneId._id].mileStonesFeaturesOptions[item.featureId._id].partial =
      !!newState.milestoneOptions[item.milestoneId._id].mileStonesFeaturesOptions[item.featureId._id].selectedCount &&
      newState.milestoneOptions[item.milestoneId._id].mileStonesFeaturesOptions[item.featureId._id].totalCount !==
        newState.milestoneOptions[item.milestoneId._id].mileStonesFeaturesOptions[item.featureId._id].selectedCount;
  }

  // NOTE: setting filtered testCases Partial or Checked
  newState.isFilteredTestCasesArePartialChecked = newState.filteredTestCases.some(
    (x) => newState.allTestCases[x._id].checked === true,
  );
  newState.isFilteredTestCasesAreChecked = newState.filteredTestCases.every(
    (x) => newState.allTestCases[x._id].checked === true,
  );
  newState.selectionCount = _values(state.selectedTestCases).length;

  return { ...newState };
};

export const checkedHandler = ({ state, data }) => {
  const { e, type, id } = data;

  const testCases = _values(state.allTestCases).reduce((accumulator, testcase) => {
    const condition = type === 'milestone' ? testcase.milestoneId === id : testcase.featureId === id;

    if (condition) {
      accumulator.push(testcase.item);
    }

    return accumulator;
  }, []);
  const newState = testCaseSelectionHandler({ state, data: { event: e, testCases } });

  return { ...newState };
};

export const filteredTestCasesHandler = ({ state, data }) => {
  const newState = {
    ...state,
    totalCount: data.count,
    filteredTestCases: data.testcases || [],
  };

  return { ...newState };
};

export const updateCountHandler = ({ state, data }) => {
  if (data.subType === 'initialCount') {
    const newState = {
      ...state,
      mileStonesOptions: data.testcases.reduce(
        (acc, testcase) => {
          const milestoneId = testcase.milestoneId._id;
          const featureId = testcase.featureId._id;

          if (acc[milestoneId]) {
            acc[milestoneId].totalCount += 1;

            if (acc[milestoneId].mileStonesFeaturesOptions[featureId]) {
              acc[milestoneId].mileStonesFeaturesOptions[featureId].totalCount += 1;
            }
          }

          return acc;
        },
        { ...state.milestoneOptions },
      ),
    };

    return newState;
  } else {
    return state;
  }
};

//NOTE: Bugs

export const initialFiltersBugs = {
  search: '',
  projects: [],
  milestones: [],
  features: [],
  status: [],
  bugType: [],
  severity: [],
  testingType: [],
  assignedTo: [],
  reportedBy: [],
  bugBy: [],
  taskId: '',
};

export const columnsBugsData = ({ allPartialChecked, allChecked, allBugs, allFilteredBugs, bugsChecked }) => [
  {
    name: <BugActionName {...{ allFilteredBugs, bugsChecked, allChecked, allPartialChecked }} />,
    key: 'actions',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '50px', height: '36px' },
    widthInEditMode: { width: '182px' },
    displayIcon: true,

    render: ({ row }) => {
      return <BugActionRender {...{ allBugs, row, bugsChecked }} />;
    },
  },
  {
    name: 'Bug #',
    key: 'bugId',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '182px' },
    displayIcon: true,

    render: ({ row }) => {
      return (
        <div className={`${style.imgDiv} ${style.pointerClass}`}>
          <p className={style.userName}>{row?.bugId}</p>
        </div>
      );
    },
  },
  {
    name: 'Project',
    key: 'projectId.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '140px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.projectId?.name}</p>
      </div>
    ),
  },
  {
    name: 'Milestone',
    key: 'milestoneId.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.milestoneId?.name}</p>
      </div>
    ),
  },
  {
    name: 'Feature',
    key: 'featureId.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '160px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.featureId?.name}</p>
      </div>
    ),
  },
  {
    name: 'Testing Type',
    key: 'testingType',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '210px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.testingType}</p>
      </div>
    ),
  },

  {
    name: 'Developer Name',
    key: 'developerId.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '160px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,
    render: ({ row }) => {
      return (
        <div className={style.imgDiv}>
          <p className={style.userName}>{row?.developerId?.name}</p>
        </div>
      );
    },
  },
  {
    name: 'Bug Type',
    key: 'bugType',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '150px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.bugType}</p>
      </div>
    ),
  },
  {
    name: 'Bug Sub Type',
    key: 'bugSubType',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '190px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.bugSubType}</p>
      </div>
    ),
  },
  {
    name: 'Bug Feedback',
    key: 'feedback.text',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '190px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.feedback?.text}</p>
      </div>
    ),
  },

  {
    name: 'Steps to Reproduce',
    key: 'reproduceSteps.text',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.reproduceSteps?.text}</p>
      </div>
    ),
  },
  {
    name: 'Ideal Behaviour',
    key: 'idealBehaviour.text',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '240px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.idealBehaviour?.text}</p>
      </div>
    ),
  },
  {
    name: 'Tested Version',
    key: 'testedVersion',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '230px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.testedVersion?.name}</p>
      </div>
    ),
  },
  {
    name: 'Test Evidence',
    key: 'testEvidence',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '230px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          {row?.history ? row?.history[row?.history?.length - 1]?.reTestEvidence : row?.testEvidence}
        </p>
      </div>
    ),
  },
  {
    name: 'Reported Date',
    key: 'reportedAt',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '200px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.reportedAt ? formattedDate(row?.reportedAt, 'dd MMM, yy') : '-'}</p>
      </div>
    ),
  },
  {
    name: 'Reported By',
    key: 'reportedBy.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '200px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => {
      return (
        <div className={style.imgDiv}>
          <p className={style.userName}>{row?.reportedBy?.name}</p>
        </div>
      );
    },
  },
  {
    name: 'Severity',
    key: 'severity',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <div className={style.pointerClass}>
            <Tags
              droppable
              menu={[
                {
                  title: 'Low',
                },
                {
                  title: 'Medium',
                },
                {
                  title: 'High',
                },

                {
                  title: 'Critical',
                },
              ]}
              text={row?.severity}
              colorScheme={{
                Low: '#4F4F6E',
                High: '#F96E6E',
                Medium: '#B79C11',
                Critical: '#F80101',
              }}
            />
          </div>
        </p>
      </div>
    ),
  },
  {
    name: 'Status',
    key: 'status',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}></p>
        <div className={style.pointerClass}>
          <Tags
            text={row?.status}
            colorScheme={{
              Closed: '#34C369',
              Open: '#F96E6E',
              Blocked: '#F96E6E',
              Reproducible: '#B79C11',
              'Need To Discuss': '#11103D',
            }}
          />
        </div>
      </div>
    ),
  },
  {
    name: 'Assigned to',
    key: 'taskHistory.0.assignedTo.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '150px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => {
      return (
        <div className={style.imgDiv}>
          <p className={style.userName}>{row?.taskHistory?.[0]?.assignedTo?.name}</p>
        </div>
      );
    },
  },
  {
    name: 'Assigned Ticket ID',
    key: 'taskHistory.0.taskId.customId' || 'taskHistory.0.taskId.id',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <a
            href={row?.taskHistory?.[0]?.taskId?.url}
            target="_blank"
            className={style.disableTextDecoration}
            rel="noreferrer"
          >
            {row?.taskHistory ? row?.taskHistory?.[0]?.taskId?.customId || row?.taskHistory?.[0]?.taskId?.id : '-'}
          </a>
        </p>
      </div>
    ),
  },
  {
    name: 'Last Retest Date',
    key: 'history.0.reTestDate',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          {row?.history ? formattedDate(row?.history[_findLastIndex(row?.history)]?.reTestDate, 'dd MMM, yy') : '-'}
        </p>
      </div>
    ),
  },
  {
    name: 'Last Retest by',
    key: 'history.0.reTestBy.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => {
      return (
        <div className={style.imgDiv}>
          <p className={style.userName}>
            {row?.history?.length ? row?.history[_findLastIndex(row?.history)]?.reTestBy?.name : '-'}
          </p>
        </div>
      );
    },
  },
  {
    name: 'Closed Date',
    key: 'closed.date',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '180px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}> {row?.closed?.date ? formattedDate(row?.closed?.date, 'dd MMM, yy') : '-'}</p>
      </div>
    ),
  },
  {
    name: 'Closed Version',
    key: 'closed.version',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '170px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.closed?.version ? row?.closed?.version : '-'}</p>
      </div>
    ),
  },
  {
    name: 'Closed By',
    key: 'closed.by.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => {
      return (
        <div className={style.imgDiv}>
          <p className={style.userName}>{row?.by?.name ? row?.by?.name : '-'}</p>
        </div>
      );
    },
  },
];

export const filteredBugsHandler = ({ state, data }) => {
  const newState = {
    ...state,
    totalCount: data.count,
    filteredBugs: data.bugs || [],
  };

  return { ...newState };
};

export const updateBugsCountHandler = ({ state, data }) => {
  if (data.subType === 'initialCount') {
    const newState = {
      ...state,
      mileStonesOptions: data.bugs.reduce(
        (acc, bug) => {
          const milestoneId = bug.milestoneId._id;
          const featureId = bug.featureId._id;

          if (acc[milestoneId]) {
            acc[milestoneId].totalCount += 1;

            if (acc[milestoneId].mileStonesFeaturesOptions[featureId]) {
              acc[milestoneId].mileStonesFeaturesOptions[featureId].totalCount += 1;
            }
          }

          return acc;
        },
        { ...state.milestoneOptions },
      ),
    };

    return newState;
  } else {
    return state;
  }
};

export const bugsSelectionHandler = ({ state, data }) => {
  const { event, bugs } = data;

  const selection = bugs;
  const newState = { ...state };

  // NOTE: checking true all the values for testCases Getting
  for (const item of selection) {
    newState.allBugs[item._id].checked = event.target.checked;

    if (event.target.checked) {
      newState.selectedBugs[item._id] = item;
      state.milestoneOptions[item.milestoneId._id]?.selectedCount >= 0
        ? (state.milestoneOptions[item.milestoneId._id].selectedCount += 1)
        : null;
      state.milestoneOptions[item.milestoneId._id].selectedCount >= 0
        ? (state.milestoneOptions[item.milestoneId._id].mileStonesFeaturesOptions[item.featureId._id].selectedCount +=
            1)
        : '';
    } else if (!event.target.checked) {
      delete state.selectedBugs[item._id];
      state.milestoneOptions[item.milestoneId._id].selectedCount
        ? (state.milestoneOptions[item.milestoneId._id].selectedCount -= 1)
        : '';
      state.milestoneOptions[item.milestoneId._id].mileStonesFeaturesOptions[item.featureId._id].selectedCount
        ? (state.milestoneOptions[item.milestoneId._id].mileStonesFeaturesOptions[item.featureId._id].selectedCount -=
            1)
        : '';
    }

    // NOTE: setting MileStone Partial or checked
    newState.milestoneOptions[item.milestoneId._id].checked =
      !!newState.milestoneOptions[item.milestoneId._id].selectedCount;
    newState.milestoneOptions[item.milestoneId._id].partial =
      !!newState.milestoneOptions[item.milestoneId._id].selectedCount &&
      newState.milestoneOptions[item.milestoneId._id].totalCount !==
        newState.milestoneOptions[item.milestoneId._id].selectedCount;

    // NOTE: setting feature Partial or checked
    newState.milestoneOptions[item.milestoneId._id].mileStonesFeaturesOptions[item.featureId._id].checked =
      !!newState.milestoneOptions[item.milestoneId._id].mileStonesFeaturesOptions[item.featureId._id].selectedCount;
    newState.milestoneOptions[item.milestoneId._id].mileStonesFeaturesOptions[item.featureId._id].partial =
      !!newState.milestoneOptions[item.milestoneId._id].mileStonesFeaturesOptions[item.featureId._id].selectedCount &&
      newState.milestoneOptions[item.milestoneId._id].mileStonesFeaturesOptions[item.featureId._id].totalCount !==
        newState.milestoneOptions[item.milestoneId._id].mileStonesFeaturesOptions[item.featureId._id].selectedCount;
  }

  // NOTE: setting filtered testCases Partial or Checked
  newState.isFilteredBugsArePartialChecked = newState.filteredBugs.some(
    (x) => newState.allBugs[x._id].checked === true,
  );
  newState.isFilteredBugsAreChecked = newState.filteredBugs.every((x) => newState.allBugs[x._id].checked === true);
  newState.selectionCount = _values(state.selectedBugs).length;

  return { ...newState };
};

export const checkedBugsHandler = ({ state, data }) => {
  const { e, type, id } = data;

  const bugs = _values(state.allBugs).reduce((accumulator, bug) => {
    const condition = type === 'milestone' ? bug.milestoneId === id : bug.featureId === id;

    if (condition) {
      accumulator.push(bug.item);
    }

    return accumulator;
  }, []);
  const newState = bugsSelectionHandler({ state, data: { event: e, bugs } });

  return { ...newState };
};

const InitialAction = ({ viewSelected, allChecked, allPartialChecked, testCaseChecked, allFilteredTestCases }) => {
  const handleChange = useCallback(
    (e) => {
      testCaseChecked(e, allFilteredTestCases);
    },
    [allFilteredTestCases, testCaseChecked],
  );

  return (
    <Checkbox
      checked={viewSelected || allChecked}
      partial={!viewSelected && allPartialChecked}
      handleChange={handleChange}
    />
  );
};

const InitialActionRender = ({ row, allTestCases, testCaseChecked }) => {
  const handleChange = useCallback((e) => testCaseChecked(e, [row]), [testCaseChecked, row]);

  return (
    <div className={style.imgDiv}>
      <Checkbox checked={allTestCases[row?._id]?.checked} name={row?._id} handleChange={handleChange} />
    </div>
  );
};

const BugActionName = ({ allChecked, allPartialChecked, bugsChecked, allFilteredBugs }) => {
  const handleChange = useCallback(
    (e) => {
      bugsChecked(e, allFilteredBugs);
    },
    [bugsChecked, allFilteredBugs],
  );

  return <Checkbox checked={allChecked} partial={allPartialChecked} handleChange={handleChange} />;
};

const BugActionRender = ({ allBugs, row, bugsChecked }) => {
  const handleChange = useCallback((e) => bugsChecked(e, [row]), [bugsChecked, row]);

  return (
    <div className={style.imgDiv}>
      <Checkbox checked={allBugs[row?._id]?.checked} name={row?._id} handleChange={handleChange} />
    </div>
  );
};
