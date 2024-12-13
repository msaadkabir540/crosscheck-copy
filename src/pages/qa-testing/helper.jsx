import { useCallback } from 'react';

import _ from 'lodash';

import { useMode } from 'context/dark-mode';

import Tags from 'components/tags';
import Checkbox from 'components/checkbox';
import Permissions from 'components/permissions';
import UserName from 'components/user-name';
import Highlighter from 'components/highlighter';

import { formattedDate } from 'utils/date-handler';

import Icon from '../../components/icon/themed-icon';
import style from './testing.module.scss';

export const initialFilters = {
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
  tags: [],
  testedDevice: [],
  testedEnvironment: [],
  page: 1,
  perPage: 25,
  reportedAt: { start: null, end: null },
  closedDate: { start: null, end: null },
  reTestDate: { start: null, end: null },
  taskId: '',
};

const OverallCheckbox = ({ selectedRecords, bugs, setSelectedRecords, setSelectedBugs, setSelectedRunRecords }) => {
  const handleChange = useCallback(
    (e) => {
      setSelectedRecords(() => (e.target.checked ? bugs?.map((x) => x._id) : []));
      setSelectedBugs(() => (e.target.checked ? bugs?.map((x) => x) : []));
      setSelectedRunRecords(() => (e.target.checked ? bugs?.map((x) => x) : []));
    },
    [bugs, setSelectedBugs, setSelectedRecords, setSelectedRunRecords],
  );

  return (
    <Checkbox
      checked={bugs?.some((bug) => selectedRecords.includes(bug?._id))}
      partial={bugs?.some((bug) => selectedRecords.includes(bug?._id)) && bugs?.length !== selectedRecords?.length}
      handleChange={handleChange}
      data-cy="overallcheckbox"
    />
  );
};

const ActionCheckbox = ({ row, selectedRecords, setSelectedRecords, setSelectedBugs, setSelectedRunRecords }) => {
  const handleChange = useCallback(
    (e) => {
      setSelectedRecords((pre) => (pre.includes(row?._id) ? pre.filter((x) => x !== row?._id) : [...pre, row?._id]));

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
    <div className={style.actionCheck}>
      <Checkbox
        checked={selectedRecords?.includes(row?._id)}
        name={row?._id}
        handleChange={handleChange}
        data-cy={`bug-table-checkbox${row?.index}`}
      />
    </div>
  );
};

const RenderBugNo = ({ row, searchedText, setSearchParams }) => {
  const onClick = useCallback(() => {
    setSearchParams({
      bugId: row?.bugId,
    });
  }, [row, setSearchParams]);

  return (
    <div className={`${style.imgDiv} `} onClick={onClick} data-cy={`bud-testid-column${row?.index}`}>
      <p className={`${style.clickable} ${style.userName}`}>
        <Highlighter search={searchedText}>{row?.bugId}</Highlighter>
      </p>
    </div>
  );
};

const RenderDeveloperName = ({ row, searchedText, handleMouseEnter, handleMouseLeave, isHoveringName }) => {
  return (
    <div className={`${style.imgDiv} ${style.pointerClass}`}>
      <p className={style.userName} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <UserName
          searchedText={searchedText}
          user={row?.developerId}
          isHovering={
            isHoveringName?.userId === row?.developerId?._id && isHoveringName?.rowId === row?._id
              ? isHoveringName?.userId
              : null
          }
        />
      </p>
    </div>
  );
};

const RenderReportedByName = ({ row, searchedText, handleMouseEnter, handleMouseLeave, isHoveringName }) => {
  return (
    <div className={style.imgDiv}>
      <p
        className={`${style.userName} ${style.pointerClass}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <UserName
          searchedText={searchedText}
          user={row?.reportedBy}
          isHovering={
            isHoveringName?.userId === row?.reportedBy?._id &&
            isHoveringName?.rowId === row?._id &&
            isHoveringName?.columnName === 'Reported By'
              ? isHoveringName?.userId
              : null
          }
        />
      </p>
    </div>
  );
};

const RenderStatus = ({ row, setRetestOpen }) => {
  const onClick = useCallback(() => setRetestOpen(() => ({ open: true, id: row?._id })), [setRetestOpen, row]);

  return (
    <div className={style.imgDiv} onClick={onClick}>
      <p className={style.userName}></p>
      <div className={style.pointerClass}>
        <Tags
          text={row?.status}
          colorScheme={{
            Closed: '#34C369',
            Open: '#F96E6E',
            Blocked: '#F80101',
            Reproducible: '#FF9843',
            Reopen: '#DEBB00',
            'Need To Discuss': '#879DFF',
            'Not Tested': '#8B909A',
          }}
        />
      </div>
    </div>
  );
};

const RenderAssignedTo = ({ row, handleMouseEnter, handleMouseLeave, isHoveringName, searchedText }) => {
  return (
    <div className={style.imgDiv}>
      <p
        className={`${style.userName} ${style.pointerClass}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <UserName
          searchedText={searchedText}
          user={row?.taskHistory?.[0]?.assignedTo}
          isHovering={
            isHoveringName?.userId === row?.taskHistory?.[0]?.assignedTo?._id && isHoveringName?.rowId === row?._id
              ? isHoveringName?.userId
              : null
          }
        />
      </p>
    </div>
  );
};

const RenderRetestBy = ({ row, handleMouseEnter, handleMouseLeave, isHoveringName }) => {
  return (
    <div className={style.imgDiv}>
      <p
        className={`${style.userName} ${style.pointerClass}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <UserName
          user={row?.history[_.findLastIndex(row?.history)]?.reTestBy}
          isHovering={
            isHoveringName?.userId === row?.history[_.findLastIndex(row?.history)]?.reTestBy?._id &&
            isHoveringName?.rowId === row?._id &&
            isHoveringName?.columnName === 'Last Retest by'
              ? isHoveringName?.userId
              : null
          }
        />
      </p>
    </div>
  );
};

const RenderClosedBy = ({ isHoveringName, row, handleMouseEnter, handleMouseLeave }) => {
  return (
    <div className={style.imgDiv}>
      <p
        className={`${style.userName} ${style.pointerClass}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <UserName
          user={row?.closed?.by}
          isHovering={
            isHoveringName?.userId === row?.closed?.by?._id &&
            isHoveringName?.rowId === row?._id &&
            isHoveringName?.columnName === 'Closed By'
              ? isHoveringName?.userId
              : null
          }
        />
      </p>
    </div>
  );
};

const RenderAction = ({ role }) => {
  const { isDarkMode } = useMode();

  return (
    <>
      <Permissions allowedRoles={['Admin', 'Project Manager', 'QA']} currentRole={role}>
        <div className={style.imgDiv1}>
          <div className={style.img}>
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
  setSearchParams,
  bugs,
  isHoveringName,
  setIsHoveringName,
  setSelectedBugs,
  selectedRecords,
  setSelectedRecords,
  searchedText,
  setRetestOpen,
  role,
  setSelectedRunRecords,
  onChangeSeverity,
  noHeader,
}) => [
  {
    name: (
      <OverallCheckbox {...{ selectedRecords, bugs, setSelectedRecords, setSelectedBugs, setSelectedRunRecords }} />
    ),
    key: 'actions',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '35px', height: '36px' },
    widthInEditMode: { width: '182px' },
    displayIcon: true,

    render: ({ row }) => (
      <ActionCheckbox {...{ row, setSelectedRecords, selectedRecords, setSelectedBugs, setSelectedRunRecords }} />
    ),
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

    render: (props) => <RenderBugNo {...{ ...props, searchedText, setSearchParams }} />,
  },
  !noHeader && {
    name: 'Project',
    key: 'projectName',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '140px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.projectId?.name}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Milestone',
    key: 'milestoneName',
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
    widthAndHeight: { width: '160px', height: '36px' },
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
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.feedback?.text}</Highlighter>
        </p>
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
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.reproduceSteps?.text}</Highlighter>
        </p>
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
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.idealBehaviour?.text}</Highlighter>
        </p>
      </div>
    ),
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
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.bugType}</Highlighter>
        </p>
      </div>
    ),
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
                  click: () => {
                    onChangeSeverity(row?._id, 'Low');
                  },
                },
                {
                  title: 'Medium',
                  click: () => {
                    onChangeSeverity(row?._id, 'Medium');
                  },
                },
                {
                  title: 'High',
                  click: () => {
                    onChangeSeverity(row?._id, 'High');
                  },
                },

                {
                  title: 'Critical',
                  click: () => {
                    onChangeSeverity(row?._id, 'Critical');
                  },
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
    widthAndHeight: { width: '145px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => <RenderStatus {...{ row, setRetestOpen }} />,
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
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.testingType}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Task ID',
    key: 'taskId',
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
          <Highlighter search={searchedText}>{row?.taskId}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Developer Name',
    key: 'developerName',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '160px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,
    render: ({ row }) => {
      let hoverTimeout;

      const handleMouseEnter = () => {
        clearTimeout(hoverTimeout);

        hoverTimeout = setTimeout(() => {
          setIsHoveringName({
            userId: row?.developerId?._id,
            rowId: row?._id,
          });
        }, 1500);
      };

      const handleMouseLeave = () => {
        clearTimeout(hoverTimeout);
        setIsHoveringName({ userId: null, rowId: null });
      };

      return <RenderDeveloperName {...{ row, handleMouseEnter, handleMouseLeave }} />;
    },
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
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.bugSubType}</Highlighter>
        </p>
      </div>
    ),
  },

  {
    name: 'Tested Device',
    key: 'testedDevice',
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
          <Highlighter search={searchedText}>{row?.testedDevice}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Tested Environment',
    key: 'testedEnvironment',
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
          <Highlighter search={searchedText}>{row?.testedEnvironment?.name}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Version',
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
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.testedVersion?.name}</Highlighter>
        </p>
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
          <Highlighter search={searchedText}>
            {row?.history[row?.history?.length - 1]?.reTestEvidence || row?.testEvidence}
          </Highlighter>
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
        <p className={style.userName}>
          <Highlighter search={searchedText}>
            {row?.reportedAt ? formattedDate(row?.reportedAt, 'dd MMM, yy') : '-'}
          </Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Reported By',
    key: 'reportedByName',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '200px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => {
      let hoverTimeout;

      const handleMouseEnter = () => {
        clearTimeout(hoverTimeout);

        hoverTimeout = setTimeout(() => {
          setIsHoveringName({
            userId: row?.reportedBy?._id,
            rowId: row?._id,
            columnName: 'Reported By',
          });
        }, 1500);
      };

      const handleMouseLeave = () => {
        clearTimeout(hoverTimeout);
        setIsHoveringName({ userId: null, rowId: null });
      };

      return <RenderReportedByName {...{ row, searchedText, handleMouseEnter, handleMouseLeave, isHoveringName }} />;
    },
  },

  {
    name: 'Assigned to',
    key: 'taskHistoryAssignedToName',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '150px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => {
      let hoverTimeout;

      const handleMouseEnter = () => {
        clearTimeout(hoverTimeout);

        hoverTimeout = setTimeout(() => {
          setIsHoveringName({
            userId: row?.taskHistory?.[0]?.assignedTo?._id,
            rowId: row?._id,
          });
        }, 1500);
      };

      const handleMouseLeave = () => {
        clearTimeout(hoverTimeout);
        setIsHoveringName({ userId: null, rowId: null });
      };

      return <RenderAssignedTo {...{ row, handleMouseEnter, handleMouseLeave, isHoveringName, searchedText }} />;
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
          <a href={row?.taskHistory?.[0]?.taskId?.url} target="_blank" className={style.history} rel="noreferrer">
            <Highlighter search={searchedText}>
              {row?.taskHistory?.[0]?.taskId?.customId || row?.taskHistory?.[0]?.taskId?.id}
            </Highlighter>
          </a>
        </p>
      </div>
    ),
  },
  {
    name: 'Last Retest Date',
    key: 'history.reTestDate',
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
          {formattedDate(row?.history[_.findLastIndex(row?.history)]?.reTestDate, 'dd MMM, yy')}
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
      let hoverTimeout;

      const handleMouseEnter = () => {
        clearTimeout(hoverTimeout);

        hoverTimeout = setTimeout(() => {
          setIsHoveringName({
            userId: row?.history[_.findLastIndex(row?.history)]?.reTestBy?._id,
            rowId: row?._id,
            columnName: 'Last Retest by',
          });
        }, 1500);
      };

      const handleMouseLeave = () => {
        clearTimeout(hoverTimeout);
        setIsHoveringName({ userId: null, rowId: null });
      };

      return <RenderRetestBy {...{ row, handleMouseEnter, handleMouseLeave, isHoveringName }} />;
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
        <p className={style.userName}> {formattedDate(row?.closed?.date, 'dd MMM, yy')}</p>
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
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.closed?.version}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Closed By',
    key: 'closedByName',
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
            userId: row?.closed?.by?._id,
            rowId: row?._id,
            columnName: 'Closed By',
          });
        }, 1500);
      };

      const handleMouseLeave = () => {
        clearTimeout(hoverTimeout);
        setIsHoveringName({ userId: null, rowId: null });
      };

      return <RenderClosedBy {...{ isHoveringName, row, handleMouseEnter, handleMouseLeave }} />;
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
    render: ({ row }) => (
      <RenderAction
        {...{
          row,
          role,
        }}
      />
    ),
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
      {
        icon: <Icon name={'RetestIcon'} iconClass={style.editColor} backClass1={style.retestColor} />,
        text: 'Retest',
      },
      {
        icon: <Icon name={'EvidenceLink'} iconClass={style.editColor} />,
        text: 'View Evidence',
      },
      {
        icon: <Icon name={'Copy1Icon'} iconClass={style.editColor} />,
        text: 'Copy Evidence Link',
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
      {
        icon: <Icon name={'ConvertIcon'} iconClass={style.editColor} />,
        text: 'Convert to Test Case',
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
