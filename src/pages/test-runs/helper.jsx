import { useCallback } from 'react';

import { useQuery } from 'react-query';
import _ from 'lodash';

import { useMode } from 'context/dark-mode';

import MultiColorProgressBar from 'components/progress-bar';
import Checkbox from 'components/checkbox';
import Tags from 'components/tags';
import Icon from 'components/icon/themed-icon';
import Permissions from 'components/permissions';
import UserName from 'components/user-name';
import Highlighter from 'components/highlighter';

import { getUsers } from 'api/v1/settings/user-management';
import { getTestedEnvironment, getTestedVersion } from 'api/v1/bugs/bugs';
import { getAllProjectsMilestonesFeatures } from 'api/v1/projects/projects';

import { formattedDate } from 'utils/date-handler';

import style from './test-runs.module.scss';

export const initialFilter = {
  search: '',
  status: [],
  assignedTo: [],
  createdBy: [],
  projectId: [],
  page: 1,
  perPage: 25,
};

export function useProjectOptions() {
  return useQuery({
    queryKey: ['testRunOptions'],
    queryFn: async () => {
      const _getProjectsMilestonesFeatures = await getAllProjectsMilestonesFeatures();
      const { testedVersions } = await getTestedVersion();
      const { testedEnvironments } = await getTestedEnvironment();

      const { users = [] } = await getUsers({
        sortBy: '',
        sort: '',
        search: '',
      });

      const projectOptions =
        _getProjectsMilestonesFeatures?.allProjects?.map((x) => ({
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

      const statusOptions = [
        { label: 'Open', value: 'Open', checkbox: true },
        { label: 'Closed', value: 'Closed', checkbox: true },
      ];

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
        statusOptions,
        priorityOptions,
        bugTypeOptions,
        testTypeOptions,
        severityOptions,
        projectOptions,
        featuresOptions,
        mileStonesOptions,
        testedVersionOptions,
        testedEnvironmentOptions,
        createdByOptions: users
          ?.filter((x) => x.role !== 'Developer')
          ?.map((x) => ({
            label: x.name,
            ...(x?.profilePicture && { image: x?.profilePicture }),
            ...(!x?.profilePicture && { imagAlt: _.first(x?.name) }),
            value: x._id,
            checkbox: true,
          })),
        assignedTo: users
          ?.filter((x) => x.role !== 'Developer')
          ?.map((x) => ({
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

const OverallCheckbox = ({ testRuns, selectedRecords, setSelectedRecords }) => {
  const handleChange = useCallback(
    (e) => {
      setSelectedRecords(() => (e.target.checked ? testRuns.map((x) => x._id) : []));
    },
    [testRuns, setSelectedRecords],
  );

  return (
    <Checkbox
      checked={testRuns?.some((testRun) => selectedRecords.includes(testRun._id))}
      partial={
        testRuns?.some((testRun) => selectedRecords.includes(testRun._id)) &&
        testRuns?.length !== selectedRecords?.length
      }
      handleChange={handleChange}
    />
  );
};

const RenderMainActions = ({ selectedRecords, setSelectedRecords, row }) => {
  const handleChange = useCallback(() => {
    setSelectedRecords((pre) => (pre.includes(row._id) ? pre.filter((x) => x !== row._id) : [...pre, row._id]));
  }, [setSelectedRecords, row]);

  return (
    <div className={`${style.imgDiv} ${style.imgWrapper}`}>
      <Checkbox checked={selectedRecords.includes(row._id)} name={row?._id} handleChange={handleChange} />
    </div>
  );
};

const RenderRunId = ({ row, noHeader, navigate, setSearchParams, searchParams, searchedText }) => {
  const handleClick = useCallback(
    () =>
      !noHeader
        ? navigate(`/test-run/${row?._id}`)
        : setSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            testRun: 'view',
            runId: `${row?._id}`,
          }),
    [row, navigate, noHeader, searchParams, setSearchParams],
  );

  return (
    <div className={style.imgDiv}>
      <p className={`${style.userName} ${style.pointerClass} ${style.clickable}`} onClick={handleClick}>
        <Highlighter search={searchedText}>{row?.runId}</Highlighter>
      </p>
    </div>
  );
};

const RenderTitle = ({ row, noHeader, navigate, setSearchParams, searchParams, searchedText }) => {
  const handleClick = useCallback(
    () =>
      !noHeader
        ? navigate(`/test-run/${row?._id}`)
        : setSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            testRun: 'view',
            runId: `${row?._id}`,
          }),
    [row, navigate, noHeader, searchParams, setSearchParams],
  );

  return (
    <div className={style.imgDiv}>
      <p className={`${style.userName} ${style.pointerClass}`} onClick={handleClick}>
        <Highlighter search={searchedText}>{row?.name}</Highlighter>
      </p>
    </div>
  );
};

const RenderAssigneeName = ({ row, handleMouseEnter, handleMouseLeave, isHoveringName }) => {
  return (
    <div className={style.imgDiv}>
      <p
        className={`${style.userName} ${style.pointerClass}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <UserName
          user={row?.assignee}
          isHovering={
            isHoveringName?.userId === row?.assignee?._id &&
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

const RenderCreatedBy = ({ row, handleMouseEnter, handleMouseLeave, isHoveringName }) => {
  return (
    <div className={style.imgDiv}>
      <p
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`${style.userName} ${style.pointerClass}`}
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

const RenderActions = ({ row, role, userDetails }) => {
  const { isDarkMode } = useMode();

  return (
    <>
      <Permissions
        allowedRoles={['Admin', 'Project Manager']}
        currentRole={role}
        accessParticular={role === 'QA' && userDetails?.id === row?.createdBy?._id}
      >
        <div className={style.imgDiv1}>
          <div className={style.img}>
            <Icon name={'MoreInvertIcon'} iconClass={style.iconColor} />
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
  navigate,
  testRuns,
  searchedText,
  setSelectedRecords,
  selectedRecords,
  isHoveringName,
  setIsHoveringName,
  noHeader,
  searchParams,
  setSearchParams,
  role,
  onChangePriority,
  userDetails,
}) => [
  {
    name: <OverallCheckbox {...{ testRuns, selectedRecords, setSelectedRecords }} />,
    key: 'actions',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '36px', height: '36px' },
    widthInEditMode: { width: '182px' },

    render: ({ row }) => {
      return <RenderMainActions {...{ selectedRecords, setSelectedRecords, row }} />;
    },
  },

  {
    name: 'Run ID',
    key: 'runId',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => <RenderRunId {...{ row, noHeader, navigate, setSearchParams, searchParams, searchedText }} />,
  },
  {
    name: 'Run Title',
    key: 'name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '225px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => <RenderTitle {...{ row, noHeader, navigate, setSearchParams, searchParams, searchedText }} />,
  },
  {
    name: 'Run Type',
    key: 'runType',
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
          <Highlighter search={searchedText}>{row?.runType}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Test Cases / Bugs',
    key: 'bug_testcase_count',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '170px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>
            {row?.runType === 'Bugs' ? row?.bugs?.length : row?.testCases?.length}
          </Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Time Tracked',
    key: 'timeEntriesSum',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '150px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.totalDuration !== '00:00:00' ? row?.totalDuration : '-'}</p>
      </div>
    ),
  },
  {
    name: 'Progress',
    key: 'testedCount',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '210px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={`${style.multi} ${style.progressMinWidth}`}>
        <p className={`${style.userName} ${style.progressMinWidth}`}>
          <MultiColorProgressBar
            readings={
              !row?.testedCount && !row?.notTestedCount
                ? [
                    {
                      name: 'No Test Case',
                      value: 100,
                      color: '#D6D6D6',
                      tooltip: `No test case`,
                    },
                  ]
                : [
                    row?.testedCount && {
                      name: 'testedCount',
                      value: (row.testedCount / (row?.runType === 'Bugs' ? row?.bugs : row?.testCases)?.length) * 100,
                      color: '#34C369',
                      tooltip: `Tested (${row.testedCount})`,
                    },
                    row?.notTestedCount && {
                      name: 'notTestedCount',
                      value:
                        (row.notTestedCount / (row?.runType === 'Bugs' ? row?.bugs : row?.testCases)?.length) * 100,
                      color: '#F96E6E',
                      tooltip: `Not Tested (${row.notTestedCount})`,
                    },
                  ]
            }
          />
        </p>
      </div>
    ),
  },
  {
    name: 'Due Date',
    key: 'dueDate',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{formattedDate(row.dueDate, 'dd-MMM-yy')}</p>
      </div>
    ),
  },
  {
    name: 'Priority',
    key: 'priority',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <div className={style.pointerClass}>
          {' '}
          <Tags
            droppable
            menu={[
              {
                title: 'Low',
                click: () => {
                  onChangePriority(row?._id, 'Low');
                },
              },
              {
                title: 'Medium',
                click: () => {
                  onChangePriority(row?._id, 'Medium');
                },
              },
              {
                title: 'High',
                click: () => {
                  onChangePriority(row?._id, 'High');
                },
              },
            ]}
            text={row?.priority}
            colorScheme={{
              Low: '#879DFF',
              High: '#F96E6E',
              Medium: '#FF9843',
              Critical: '#F80101',
              Trivial: '#656F7D',
            }}
          />
        </div>
      </div>
    ),
  },
  {
    name: 'Assigned to',
    key: 'assigneeName',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => {
      let hoverTimeout;

      const handleMouseEnter = () => {
        clearTimeout(hoverTimeout);

        hoverTimeout = setTimeout(() => {
          setIsHoveringName({
            userId: row?.assignee?._id,
            rowId: row?._id,
            columnName: 'Assigned to',
          });
        }, 1500);
      };

      const handleMouseLeave = () => {
        clearTimeout(hoverTimeout);
        setIsHoveringName({ userId: null, rowId: null });
      };

      return <RenderAssigneeName {...{ row, handleMouseEnter, handleMouseLeave, isHoveringName }} />;
    },
  },
  {
    name: 'Created by',
    key: 'createdByName',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '125px', height: '36px' },
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
    name: 'Created at',
    key: 'createdAt',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '125px', height: '36px' },
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
    name: 'Status',
    key: 'status',
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
          {' '}
          <Tags
            text={row.status}
            colorScheme={{
              Open: '#F96E6E',
              Passed: '#34C369',
              Closed: '#34C369',
              Blocked: '#F96E6E',
              'Not Tested': '#8B909A',
              Failed: '#F96E6E',
            }}
          />
        </p>
      </div>
    ),
  },
  {
    name: 'Closed Date',
    key: 'closedDate',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{formattedDate(row.closedDate, 'dd-MMM-yy')}</p>
      </div>
    ),
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
    render: ({ row }) => <RenderActions {...{ row, role, userDetails }} />,
  },
];

export const menuData = [
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
    bodyData: [
      {
        icon: <Icon name={'DelIcon'} iconClass={style.editColor1} />,
        text: 'Delete',
      },
    ],
  },
];
