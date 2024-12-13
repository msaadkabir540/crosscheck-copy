import _ from 'lodash';

import Tags from 'components/tags';
import UserName from 'components/user-name';
import MultiColorProgressBar from 'components/progress-bar';

import { formattedDate } from 'utils/date-handler';

import style from './table-modal.module.scss';

export const initialFilters = {
  projects: [],
  milestones: [],
  features: [],
  status: [],
  bugType: [],
  severity: [],
  testingType: [],
  createdBy: [],
  assignedTo: [],
  reportedBy: [],
  state: [],
  bugBy: [],
  issueType: [],
  lastTestedBy: [],
  weightage: [],
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
  taskId: '',
};

export const columnsData = ({ isHoveringName, setIsHoveringName, noHeader }) => [
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
        <div
          className={style.imgDiv}
          style={{
            cursor: 'pointer',
          }}
        >
          <p className={style.userName}>{row?.bugId}</p>
        </div>
      );
    },
  },
  !noHeader && {
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
    name: 'Issue Type',
    key: 'issueType',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '160px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.issueType}</p>
      </div>
    ),
  },
  {
    name: 'Ticket ID',
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
        <p className={style.userName}>{row?.taskId}</p>
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

      return (
        <div className={style.imgDiv}>
          <p
            className={style.userName}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'pointer' }}
          >
            <UserName
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
        <p className={style.userName}>{row?.testedVersion}</p>
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
        <p className={style.userName}>{row?.testEvidence}</p>
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
        <p className={style.userName}>{formattedDate(row?.reportedAt, 'dd MMM, yy')}</p>
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

      return (
        <div className={style.imgDiv}>
          <p
            className={style.userName}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'pointer' }}
          >
            <UserName
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
          <Tags
            droppable
            text={row?.severity}
            colorScheme={{
              Low: '#4F4F6E',
              High: '#F96E6E',
              Medium: '#B79C11',
              Critical: '#F80101',
            }}
          />
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

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}></p>
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

      return (
        <div className={style.imgDiv}>
          <p
            className={style.userName}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'pointer' }}
          >
            <UserName
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
            style={{
              textDecoration: 'underline',
              color: 'black',
            }}
            rel="noreferrer"
          >
            {row?.taskHistory?.[0]?.taskId?.customId || row?.taskHistory?.[0]?.taskId?.id}
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
          {formattedDate(row?.history[_?.findLastIndex(row?.history)]?.reTestDate, 'dd MMM, yy')}
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

      return (
        <div className={style.imgDiv}>
          <p
            className={style.userName}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'pointer' }}
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
        <p className={style.userName}>{row?.closed?.version}</p>
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

      return (
        <div className={style.imgDiv}>
          <p
            className={style.userName}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'pointer' }}
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
    },
  },
];

export const columnsDataTestCase = ({ isHoveringName, setIsHoveringName, noHeader }) => [
  {
    name: 'Test Case ID',
    key: 'testCaseId',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '182px' },
    displayIcon: true,

    render: ({ row }) => {
      return (
        <div
          className={style.imgDiv}
          style={{
            cursor: 'pointer',
          }}
        >
          <p className={style.userName}>{row?.testCaseId}</p>
        </div>
      );
    },
  },
  !noHeader && {
    name: 'Project',
    key: 'projectId.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
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
    key: 'milestoneId.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '100px', height: '36px' },
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
    key: 'featureId.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
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
    widthAndHeight: { width: '140px', height: '36px' },
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
        <p className={style.userName}>{row?.testObjective?.text}</p>
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
        <p className={style.userName}>{row?.preConditions?.text}</p>
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
        <p className={style.userName}>{row?.testSteps?.text}</p>
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
    widthAndHeight: { width: '110px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.weightage}</p>
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

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Tags text={row.status} />
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
        <p className={style.userName}>{row?.state}</p>
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
        <p className={style.userName}>{row?.relatedTicketId}</p>
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
        <p className={style.userName}>{formattedDate(row?.lastTestedAt, 'dd MMM,yyyy')}</p>
      </div>
    ),
  },
  {
    name: 'Last Tested by',
    key: 'lastTestedBy.name',
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

      return (
        <div className={style.imgDiv}>
          <p
            className={style.userName}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'pointer' }}
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
        <p className={style.userName}>{formattedDate(row?.createdAt, 'dd MMM,yyyy')}</p>
      </div>
    ),
  },
  {
    name: 'Created by',
    key: 'createdBy.name',
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

      return (
        <div className={style.imgDiv}>
          <p
            className={style.userName}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'pointer' }}
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
    },
  },
];

export const columnsDataTestRun = ({ isHoveringName, setIsHoveringName }) => [
  {
    name: 'Run ID',
    key: 'runId',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '90px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName} style={{ cursor: 'pointer' }}>
          {row?.runId}
        </p>
      </div>
    ),
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

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName} style={{ cursor: 'pointer' }}>
          {row?.name}
        </p>
      </div>
    ),
  },
  {
    name: 'Test Cases',
    key: 'testCases.length',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.testCases?.length}</p>
      </div>
    ),
  },
  {
    name: 'Progress',
    key: 'testedCount',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '200px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.multi}>
        <p className={style.userName}>
          <MultiColorProgressBar
            readings={[
              row?.testedCount && {
                name: 'testedCount',
                value: (row.testedCount / row?.testCases?.length) * 100,
                color: '#34C369',
                tooltip: `Tested (${row.testedCount})`,
              },
              row?.notTestedCount && {
                name: 'notTestedCount',
                value: (row.notTestedCount / row?.testCases?.length) * 100,
                color: '#F96E6E',
                tooltip: `Not Tested (${row.notTestedCount})`,
              },
            ]}
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
    widthAndHeight: { width: '100px', height: '36px' },
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
        <p className={style.userName}></p>
        <Tags
          droppable
          text={row?.priority}
          colorScheme={{
            Low: '#4F4F6E',
            High: '#F96E6E',
            Medium: '#B79C11',
            Critical: '#F80101',
          }}
        />
      </div>
    ),
  },
  {
    name: 'Assigned to',
    key: 'assignee.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
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
          });
        }, 1500);
      };

      const handleMouseLeave = () => {
        clearTimeout(hoverTimeout);
        setIsHoveringName({ userId: null, rowId: null });
      };

      return (
        <div className={style.imgDiv}>
          <p
            className={style.userName}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'pointer' }}
          >
            <UserName
              user={row?.assignee}
              isHovering={
                isHoveringName?.userId === row?.assignee?._id && isHoveringName?.rowId === row?._id
                  ? isHoveringName?.userId
                  : null
              }
            />
          </p>
        </div>
      );
    },
  },
  {
    name: 'Created by',
    key: 'createdBy.name',
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
          });
        }, 1500);
      };

      const handleMouseLeave = () => {
        clearTimeout(hoverTimeout);
        setIsHoveringName({ userId: null, rowId: null });
      };

      return (
        <div className={style.imgDiv}>
          <p
            className={style.userName}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'pointer' }}
          >
            <UserName
              user={row?.createdBy}
              isHovering={
                isHoveringName?.userId === row?.createdBy?._id && isHoveringName?.rowId === row?._id
                  ? isHoveringName?.userId
                  : null
              }
            />
          </p>
        </div>
      );
    },
  },
  {
    name: 'Created at',
    key: 'createdAt',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
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
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{formattedDate(row.closedDate, 'dd-MMM-yy')}</p>
      </div>
    ),
  },
];

export const columnsDataDeleted = ({ isHoveringName, setIsHoveringName }) => [
  {
    name: 'Deleted Item',
    key: 'name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '45px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName} style={{ cursor: 'pointer' }}>
          {row?.name || row?.testCaseId || row?.bugId || row?.runId}
        </p>
      </div>
    ),
  },
  {
    name: ' ',
    key: 'runId',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '200px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: () => (
      <div className={style.imgDiv}>
        <p className={style.userName} style={{ cursor: 'pointer' }}></p>
      </div>
    ),
  },
  {
    name: 'Location',
    key: 'location',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '80px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName} style={{ cursor: 'pointer' }}>
          {row?.path}
        </p>
      </div>
    ),
  },
  {
    name: 'Type',
    key: 'type',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '60px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName} style={{ cursor: 'pointer' }}>
          {row?.type}
        </p>
      </div>
    ),
  },
  {
    name: 'Deleted on',
    key: 'deletedOn',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '60px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName} style={{ cursor: 'pointer' }}>
          {formattedDate(row?.deletedOn, 'dd MMM-YYY, hh:mm a')}
        </p>
      </div>
    ),
  },
  {
    name: 'Deleted By',
    key: 'deletedBy',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '60px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => {
      let hoverTimeout;

      const handleMouseEnter = () => {
        clearTimeout(hoverTimeout);

        hoverTimeout = setTimeout(() => {
          setIsHoveringName({
            userId: row?.deletedBy?._id,
            rowId: row?._id,
          });
        }, 1500);
      };

      const handleMouseLeave = () => {
        clearTimeout(hoverTimeout);
        setIsHoveringName({ userId: null, rowId: null });
      };

      return (
        <div className={style.imgDiv}>
          <p
            className={style.userDiv}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ alignItems: 'center', cursor: 'pointer' }}
          >
            {row?.deletedBy?.profilePicture ? (
              <img
                alt=""
                src={row?.deletedBy?.profilePicture}
                style={{ width: '24px', height: '24px', borderRadius: '80%' }}
              />
            ) : (
              <div
                style={{
                  borderRadius: '80%',
                  background: '#11103d',
                  width: '24px',
                  height: '24px',
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {_.first(row?.deletedBy?.name)}
              </div>
            )}
            <UserName
              user={row?.deletedBy}
              isHovering={
                isHoveringName?.userId === row?.deletedBy?._id && isHoveringName?.rowId === row?._id
                  ? isHoveringName?.userId
                  : null
              }
            />
          </p>
        </div>
      );
    },
  },
];
