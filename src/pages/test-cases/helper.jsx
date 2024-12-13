import { useCallback } from 'react';

import _ from 'lodash';
import { useQuery } from 'react-query';

import { useMode } from 'context/dark-mode';

import Tags from 'components/tags';
import Checkbox from 'components/checkbox';
import Permissions from 'components/permissions';
import UserName from 'components/user-name';
import Icon from 'components/icon/themed-icon';
import Highlighter from 'components/highlighter';

import { getAllProjectsMilestonesFeatures } from 'api/v1/projects/projects';
import { getUsers } from 'api/v1/settings/user-management';
import { getTestedDevices, getTestedEnvironment, getTestedVersion } from 'api/v1/bugs/bugs';

import { formattedDate } from 'utils/date-handler';

import style from './test.module.scss';

export const initialFilter = {
  search: '',
  projects: [],
  milestones: [],
  features: [],
  status: [],
  createdBy: [],
  state: [],
  lastTestedBy: [],
  weightage: [],
  tags: [],
  assignedTo: [],
  testType: [],
  page: 1,
  perPage: 25,
  createdAt: {
    start: null,
    end: null,
  },

  lastTestedAt: {
    start: null,
    end: null,
  },
  relatedTicketId: '',
};

export function useProjectOptions() {
  return useQuery({
    queryKey: ['projectsOptions'],
    queryFn: async () => {
      const _getProjectsMilestonesFeatures = await getAllProjectsMilestonesFeatures();
      const { testedDevice } = await getTestedDevices();
      const { testedVersions } = await getTestedVersion();
      const { testedEnvironments } = await getTestedEnvironment();

      const { users = [] } = await getUsers({
        sortBy: '',
        sort: '',
        search: '',
      });

      const projectOptions =
        _getProjectsMilestonesFeatures?.allProjects?.map((x, i) => ({
          index: i,
          label: x.name,
          value: x._id,
          checkbox: true,
        })) || [];

      const mileStonesOptions =
        _getProjectsMilestonesFeatures?.allMilestones?.map((x) => ({
          ...x,
          label: x.name,
          value: x._id,
          checkbox: true,
        })) || [];

      const featuresOptions =
        _getProjectsMilestonesFeatures?.allFeatures?.map((x) => ({
          ...x,
          label: x.name,
          value: x._id,
          checkbox: true,
        })) || [];

      const statusOptions = [
        { label: 'Not Tested', value: 'Not Tested', checkbox: true },
        { label: 'Blocked', value: 'Blocked', checkbox: true },
        { label: 'Failed', value: 'Failed', checkbox: true },
        { label: 'Passed', value: 'Passed', checkbox: true },
      ];

      const weighageOptions = [
        { label: '1', value: '1', checkbox: true },
        { label: '2', value: '2', checkbox: true },
        { label: '3', value: '3', checkbox: true },
        { label: '4', value: '4', checkbox: true },
        { label: '5', value: '5', checkbox: true },
      ];

      const testedEnvironmentOptions = [
        ...(testedEnvironments?.map((x) => ({
          label: x?.name,
          value: x?._id,
          checkbox: true,
          projectId: x?.projectId,
        })) || []),
      ];

      const testedVersionOptions = [
        ...(testedVersions?.map((x) => ({
          label: x?.name,
          value: x?._id,
          checkbox: true,
          projectId: x?.projectId,
        })) || []),
      ];

      const testedDevicesOptions =
        testedDevice?.map((x) => ({
          label: x,
          value: x,
          checkbox: true,
        })) || [];

      const priorityOptions = [
        { label: 'High', value: 'High', checkbox: true },
        { label: 'Medium', value: 'Medium', checkbox: true },
        { label: 'Low', value: 'Low', checkbox: true },
      ];

      const bugTypeOptions = [
        { label: 'Functionality', value: 'Functionality', checkbox: true },
        { label: 'Performance', value: 'Performance', checkbox: true },
        { label: 'UI', value: 'UI', checkbox: true },
        { label: 'Security', value: 'Security', checkbox: true },
      ];

      const testTypeOptions = [
        {
          label: 'Functionality Testing',
          value: 'Functionality',
          checkbox: true,
        },
        { label: 'Performance Testing', value: 'Performance', checkbox: true },
        { label: 'Security Testing', value: 'Security', checkbox: true },
        { label: 'UI Testing', value: 'UI', checkbox: true },
      ];

      const stateOptions = [
        {
          label: 'Active',
          value: 'Active',
          checkbox: true,
        },
        { label: 'Obsolete', value: 'Obsolete', checkbox: true },
      ];

      const testingTypeOptions = [
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
      ];

      const severityOptions = [
        { label: 'Critical', value: 'Critical', checkbox: true },
        { label: 'High', value: 'High', checkbox: true },
        { label: 'Medium', value: 'Medium', checkbox: true },
        { label: 'Low', value: 'Low', checkbox: true },
      ];

      return {
        projectOptions,
        testedDevicesOptions,
        testedVersionOptions,
        testedEnvironmentOptions,
        severityOptions,
        bugTypeOptions,
        mileStonesOptions,
        priorityOptions,
        featuresOptions,
        statusOptions,
        weighageOptions,
        testTypeOptions,
        testingTypeOptions,
        assignedToOptions: users
          .filter((x) => x.role === 'Developer')
          .map((x) => ({
            label: x.name,
            ...(x?.profilePicture && { image: x?.profilePicture }),
            ...(!x?.profilePicture && { imagAlt: _.first(x?.name) }),
            value: x._id,
            checkbox: true,
          })),
        createdByOptions: users.map((x) => ({
          label: x.name,
          ...(x?.profilePicture && { image: x?.profilePicture }),
          ...(!x?.profilePicture && { imagAlt: _.first(x?.name) }),
          value: x._id,
          checkbox: true,
        })),
        stateOptions,
        lastTestedBy: users.map((x) => ({
          label: x.name,
          ...(x?.profilePicture && { image: x?.profilePicture }),
          ...(!x?.profilePicture && { imagAlt: _.first(x?.name) }),
          value: x._id,
          checkbox: true,
        })),
      };
    },
    refetchOnWindowFocus: false,
  });
}

const OverallCheckbox = ({
  testCases,
  setSelectedRecords,
  setSelectedBugs,
  selectedRecords,
  setSelectedRunRecords,
}) => {
  const handleChange = useCallback(
    (e) => {
      setSelectedRecords(() => (e.target.checked ? testCases.map((x) => x._id) : []));
      setSelectedBugs(() => (e.target.checked ? testCases?.map((x) => x) : []));
      setSelectedRunRecords(() => (e.target.checked ? testCases?.map((x) => x) : []));
    },
    [testCases, setSelectedBugs, setSelectedRecords, setSelectedRunRecords],
  );

  return (
    <Checkbox
      checked={testCases?.some((testCase) => selectedRecords.includes(testCase?._id))}
      partial={
        testCases?.some((testCase) => selectedRecords.includes(testCase?._id)) &&
        testCases?.length !== selectedRecords?.length
      }
      handleChange={handleChange}
      data-cy="testcase-overall-checkbox"
    />
  );
};

const RenderMainAction = ({
  row,
  viewTestRun,
  setSelectedRecords,
  setSelectedBugs,
  selectedRecords,
  setSelectedRunRecords,
}) => {
  const handleChange = useCallback(
    (e) => {
      setSelectedRecords((pre) => (pre.includes(row._id) ? pre.filter((x) => x !== row._id) : [...pre, row._id]));

      if (e.target.checked) {
        setSelectedBugs((prev) => [...prev, row]);
        setSelectedRunRecords((prev) => [...prev, row]);
      } else {
        setSelectedBugs((prev) => prev.filter((selectedBug) => selectedBug?._id !== row?._id));
        setSelectedRunRecords((prev) => prev.filter((selectedBug) => selectedBug?._id !== row?._id));
      }
    },
    [row, setSelectedBugs, setSelectedRecords, setSelectedRunRecords],
  );

  return (
    <div className={`${style.imgDiv} ${style.actionIcon} `}>
      <Checkbox
        checked={selectedRecords.includes(row._id)}
        name={row?._id}
        handleChange={handleChange}
        disabledCheck={viewTestRun}
        dataCy={`checkbox-testcase-column${row?.index}`}
      />
    </div>
  );
};

const RenderTestCase = ({ row, searchedText, setSearchParams }) => {
  const onClick = useCallback(() => {
    setSearchParams({
      testCaseId: row?.testCaseId,
    });
  }, [row, setSearchParams]);

  return (
    <div
      className={`${style.imgDiv} ${style.pointerClass}`}
      onClick={onClick}
      data-cy={`testcase-table-id${row?.index}`}
    >
      <p className={`${style.clickable} ${style.userName}`}>
        <Highlighter search={searchedText}>{row?.testCaseId}</Highlighter>
      </p>
    </div>
  );
};

const RenderStatus = ({ row, role, setStatusUpdateTestCaseId, setViewTestCaseId }) => {
  const onClick = useCallback(() => {
    if (role !== 'Developer') {
      setStatusUpdateTestCaseId(row?._id);
      setViewTestCaseId(row?.testCaseId);
    }
  }, [role, row?._id, row?.testCaseId, setStatusUpdateTestCaseId, setViewTestCaseId]);

  return (
    <div className={style.imgDiv} onClick={onClick}>
      <p className={style.userName}>
        <Tags
          text={row.status}
          colorScheme={{
            Failed: '#F96E6E',
            Passed: '#34C369',
            Blocked: '#F80101',
            'Not Tested': '#656F7D',
          }}
        />
      </p>
    </div>
  );
};

const RenderAssignedTo = ({ row, handleMouseEnter, handleMouseLeave, isHoveringName }) => {
  return (
    <div className={style.imgDiv}>
      <p
        className={`${style.userName} ${style.pointerClass}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <UserName
          user={row?.taskHistory[0]?.assignedTo}
          isHovering={
            isHoveringName?.userId === row?.taskHistory[0]?.assignedTo?._id &&
            isHoveringName?.rowId === row?._id &&
            isHoveringName?.columnName === 'Assigned to'
              ? isHoveringName?.userId
              : null
          }
        />
      </p>
    </div>
  );
};

const RenderLastTestedBy = ({ row, handleMouseEnter, handleMouseLeave, isHoveringName }) => {
  return (
    <div className={style.imgDiv}>
      <p
        className={`${style.userName} ${style.pointerClass}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <UserName
          user={row?.lastTestedBy}
          isHovering={
            isHoveringName?.userId === row?.lastTestedBy?._id &&
            isHoveringName?.rowId === row?._id &&
            isHoveringName?.columnName === 'Last Tested by'
              ? isHoveringName?.userId
              : null
          }
        />
      </p>
    </div>
  );
};

const RenderCreatedBy = ({ row, handleMouseEnter, handleMouseLeave, isHoveringName }) => {
  return (
    <div className={style.imgDiv}>
      <p
        className={`${style.userName} ${style.pointerClass}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <UserName
          user={row?.createdBy}
          isHovering={
            isHoveringName?.userId === row?.createdBy?._id &&
            isHoveringName?.rowId === row?._id &&
            isHoveringName?.columnName === 'Created by'
              ? isHoveringName?.userId
              : null
          }
        />
      </p>
    </div>
  );
};

const RenderAction = ({ row, role }) => {
  const { isDarkMode } = useMode();

  return (
    <>
      <Permissions allowedRoles={['Admin', 'Project Manager', 'QA']} currentRole={role}>
        <div className={style.imgDiv1}>
          <div className={style.img} data-cy={`addtestcasepage-edit-icon${row?.index}`}>
            <div>
              <Icon name={'MoreInvertIcon'} iconClass={style.iconColor} />
            </div>
            <div className={style.tooltip}>
              <p style={{ color: isDarkMode ? 'white' : '' }}>Actions</p>
            </div>
          </div>
        </div>
      </Permissions>
    </>
  );
};

export const columnsData = ({
  testCases,
  setSearchParams,
  setSelectedRecords,
  selectedRecords,
  searchedText,
  setSelectedRunRecords,
  isHoveringName,
  viewTestRun,
  setIsHoveringName,
  setSelectedBugs,
  role,
  noHeader,
  setStatusUpdateTestCaseId,
  setViewTestCaseId,
}) => [
  {
    name: (
      <OverallCheckbox
        {...{
          testCases,
          setSelectedRecords,
          setSelectedBugs,
          selectedRecords,
          setSelectedRunRecords,
        }}
      />
    ),
    key: 'actions',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '50px', height: '36px' },
    widthInEditMode: { width: '182px' },
    displayIcon: true,

    render: ({ row }) => {
      return (
        <RenderMainAction
          {...{ row, setSelectedRecords, viewTestRun, setSelectedBugs, selectedRecords, setSelectedRunRecords }}
        />
      );
    },
  },
  {
    name: 'Test Case ID',
    key: 'testCaseId',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '135px', height: '36px' },
    widthInEditMode: { width: '182px' },
    displayIcon: true,

    render: ({ row }) => {
      return <RenderTestCase {...{ row, searchedText, setSearchParams }} />;
    },
  },
  !noHeader && {
    name: 'Project',
    key: 'projectName',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '182px' },
    displayIcon: true,

    render: ({ row }) => {
      return (
        <div className={style.imgDiv} data-cy={`addtestcase-row-table${row?.index}`}>
          <p className={style.userName}>
            <Highlighter search={searchedText}>{row?.projectId?.name}</Highlighter>
          </p>
        </div>
      );
    },
  },
  {
    name: 'Milestone',
    key: 'milestoneName',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '100px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.milestoneId?.name}</Highlighter>
        </p>
      </div>
    ),
  },

  {
    name: 'Feature',
    key: 'featureName',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.featureId?.name}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Test Type',
    key: 'testType',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '140px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.testType}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Test Objective',
    key: 'testObjective.text',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '200px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.testObjective?.text}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Pre Conditions',
    key: 'preConditions.text',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '200px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.preConditions?.text}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Test Steps',
    key: 'testSteps.text',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '200px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.testSteps?.text}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Expected Results',
    key: 'expectedResults.text',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '200px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.expectedResults?.text}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Weightage',
    key: 'weightage',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '110px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.weightage}</Highlighter>
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
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => <RenderStatus {...{ row, role, setStatusUpdateTestCaseId, setViewTestCaseId }} />,
  },
  {
    name: 'Tags',
    key: 'tags',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '230px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p>
          {row?.tags?.map((tag, index) => (
            <>
              {tag?.name}
              {index < row?.tags?.length - 1 && ', '}
            </>
          ))}
        </p>
      </div>
    ),
  },
  {
    name: 'State',
    key: 'state',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.state}</Highlighter>
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
    widthAndHeight: { width: '180px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.relatedTicketId}</Highlighter>
        </p>
      </div>
    ),
  },

  {
    name: 'Assigned to',
    key: 'assignedTo',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '180px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => {
      let hoverTimeout;

      const handleMouseEnter = () => {
        clearTimeout(hoverTimeout);

        hoverTimeout = setTimeout(() => {
          setIsHoveringName({
            userId: row?.taskHistory[0]?.assignedTo?._id,
            rowId: row?._id,
            columnName: 'Assigned to',
          });
        }, 1500);
      };

      const handleMouseLeave = () => {
        clearTimeout(hoverTimeout);
        setIsHoveringName({ userId: null, rowId: null });
      };

      return <RenderAssignedTo {...{ row, handleMouseEnter, handleMouseLeave, isHoveringName }} />;
    },
  },
  {
    name: 'Assigned Task ID',
    key: 'lastTaskIdName' || 'taskHistory.0.taskId.id',
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
            className={style.assignedIdCLass}
            rel="noreferrer"
          >
            <Highlighter search={searchedText}>
              {row?.taskHistory?.[0]?.taskId?.customId || row?.taskHistory?.[0]?.taskId?.id}
            </Highlighter>
          </a>
        </p>
      </div>
    ),
  },
  {
    name: 'Last Tested at',
    key: 'lastTestedAt',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '180px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{formattedDate(row.lastTestedAt, 'dd MMM,yyyy')}</p>
      </div>
    ),
  },
  {
    name: 'Last Tested by',
    key: 'lastTestedByName',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '180px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => {
      let hoverTimeout;

      const handleMouseEnter = () => {
        clearTimeout(hoverTimeout);

        hoverTimeout = setTimeout(() => {
          setIsHoveringName({
            userId: row?.lastTestedBy?._id,
            rowId: row?._id,
            columnName: 'Last Tested by',
          });
        }, 1500);
      };

      const handleMouseLeave = () => {
        clearTimeout(hoverTimeout);
        setIsHoveringName({ userId: null, rowId: null });
      };

      return <RenderLastTestedBy {...{ row, handleMouseEnter, handleMouseLeave, isHoveringName }} />;
    },
  },
  {
    name: 'Created at',
    key: 'createdAt',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '115px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{formattedDate(row.createdAt, 'dd MMM,yyyy')}</p>
      </div>
    ),
  },
  {
    name: 'Created by',
    key: 'createdByName',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '140px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => {
      let hoverTimeout;

      const handleMouseEnter = () => {
        clearTimeout(hoverTimeout);

        hoverTimeout = setTimeout(() => {
          setIsHoveringName({
            userId: row?.createdBy?._id,
            rowId: row?._id,
            columnName: 'Created by',
          });
        }, 1500);
      };

      const handleMouseLeave = () => {
        clearTimeout(hoverTimeout);
        setIsHoveringName({ userId: null, rowId: null });
      };

      return <RenderCreatedBy {...{ row, handleMouseEnter, handleMouseLeave, isHoveringName }} />;
    },
  },

  {
    name: 'Actions',
    key: 'actions',
    hidden: role === 'Developer' ? true : false,
    type: 'text',
    editable: true,
    lastCell: true,
    widthAndHeight: { width: '60px', height: '36px' },
    widthInEditMode: { width: '56px' },
    displayIcon: false,
    render: ({ row }) => <RenderAction {...{ row, role }} />,
  },
];

export const rows = [];

export const menuData = () => [
  {
    border: '1px solid #D6D6D6',
    bodyData: [
      {
        icon: <Icon name={'EditIconGrey'} iconClass={style.editColor} />,
        text: 'Edit',
      },
    ],
  },
  {
    border: '1px solid #D6D6D6',
    bodyData: [
      {
        icon: <Icon name={'CreateTask'} iconClass={style.editColor} />,
        text: 'Create Task',
      },
      {
        icon: <Icon name={'TestRunIcon'} iconClass={style.editColor} />,
        text: 'Create Test Run',
      },
    ],
  },

  {
    bodyData: [
      {
        icon: (
          <div className={style.editColor1}>
            <Icon name={'DelIcon'} />
          </div>
        ),
        text: 'Delete',
      },
    ],
  },
];
