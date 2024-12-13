import { useCallback, useRef } from 'react';

import Tags from 'components/tags';
import UserName from 'components/user-name';

import { formattedDate } from 'utils/date-handler';

import style from './history.module.scss';

export const columnsData = ({ isHoveringName, setIsHoveringName }) => [
  {
    name: 'Test Date',
    key: 'testDate',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '125px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={`${style.userName} ${style.pointerClass}`}>{formattedDate(row?.testDate, 'dd MMM yy')}</p>
      </div>
    ),
  },
  {
    name: 'Tested By',
    key: 'testedBy',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '125px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => <RenderTestedBy {...{ setIsHoveringName, row, isHoveringName }} />,
  },
  {
    name: 'Test Status',
    key: 'testStatus',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '125px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          {' '}
          <Tags text={row?.testStatus} />
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
    widthAndHeight: { width: '150px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <a href={row?.testEvidence} target="_blank" className={style.evidenceClass} rel="noreferrer">
            {row.testEvidence}
          </a>
        </p>
      </div>
    ),
  },

  {
    name: 'Tested Version',
    key: 'testedVersion',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '135px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.testedVersion?.name}</p>
      </div>
    ),
  },
  {
    name: 'Tested Environment',
    key: 'testedEnvironment',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '155px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.testedEnvironment?.name}</p>
      </div>
    ),
  },
  {
    name: 'Tested Device',
    key: 'testedDevice',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '135px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.testedDevice}</p>
      </div>
    ),
  },
  {
    name: 'Related Bug',
    key: 'relatedBy',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '125px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.relatedBug?.bugId}</p>
      </div>
    ),
  },
  {
    name: 'Related Run',
    key: 'relatedRun',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '135px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.relatedRun?.runId}</p>
      </div>
    ),
  },
  {
    name: 'Notes',
    key: '',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '150px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.notes || 'None'}</p>
      </div>
    ),
  },
];

const RenderTestedBy = ({ setIsHoveringName, row, isHoveringName }) => {
  const hoverTimeoutRef = useRef(null);

  const handleMouseEnter = useCallback(() => {
    clearTimeout(hoverTimeoutRef.current);

    hoverTimeoutRef.current = setTimeout(() => {
      setIsHoveringName({
        userId: row?.testedBy?._id,
        rowId: row?._id,
      });
    }, 1500);
  }, [setIsHoveringName, row]);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(hoverTimeoutRef.current);
    setIsHoveringName({ userId: null, rowId: null });
  }, [setIsHoveringName]);

  return (
    <div className={style.imgDiv}>
      <p
        className={`${style.userName} ${style.pointerClass}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <UserName
          user={row?.testedBy}
          isHovering={
            isHoveringName?.userId === row?.testedBy?._id && isHoveringName?.rowId === row?._id
              ? isHoveringName?.userId
              : null
          }
        />
      </p>
    </div>
  );
};

export const rows = [
  {
    testDate: '29 May 23',
    testedBy: 'John Doe',
    testStatus: <Tags color={'#34C369'} text={'Pass'} />,
    relatedBy: 'BUG-1119',
  },
  {
    testDate: '29 May 23',
    testedBy: 'John Doe',
    testStatus: <Tags color={'#34C369'} text={'Pass'} />,
    relatedBy: 'BUG-1119',
  },
  {
    testDate: '29 May 23',
    testedBy: 'John Doe',
    testStatus: <Tags color={'#F96E6E'} text={'Fail'} />,
    relatedBy: 'BUG-1119',
  },
];
