import Tags from 'components/tags';
import UserName from 'components/user-name';

import { formattedDate } from 'utils/date-handler';

import style from './history.module.scss';

export const columnsData = ({ isHoveringName, setIsHoveringName }) => [
  {
    name: 'Retest Date',
    key: 'testDate',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '125px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={`${style.userName} ${style.pointerClass}`}>{formattedDate(row.reTestDate, 'dd MMM, yy')}</p>
      </div>
    ),
  },

  {
    name: 'Retest Version',
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
        <p className={style.userName}>{row?.reTestVersion?.name}</p>
      </div>
    ),
  },
  {
    name: 'Retest By',
    key: 'testedBy',
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
            userId: row?.reTestBy?._id,
            rowId: row?._id,
          });
        }, 1500);
      };

      const handleMouseLeave = () => {
        clearTimeout(hoverTimeout);
        setIsHoveringName({ userId: null, rowId: null });
      };

      return <RenderRetestBy {...{ handleMouseEnter, handleMouseLeave, isHoveringName, row }} />;
    },
  },
  {
    name: 'Retest Status',
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
          <Tags
            text={row.reTestStatus}
            colorScheme={{
              Closed: '#34C369',
              Open: '#F96E6E',
              Blocked: '#F96E6E',
              Reproducible: '#B79C11',
              'Need To Discuss': '#11103D',
            }}
          ></Tags>
        </p>
      </div>
    ),
  },

  {
    name: 'Retest Evidence',
    key: 'reTestEvidence',
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
          <a href={row?.reTestEvidence} target="_blank" className={style.evidenceClass} rel="noreferrer">
            {row.reTestEvidenceKey}
          </a>
        </p>
      </div>
    ),
  },
  {
    name: 'Remarks',
    key: 'remarks',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '125px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.remarks || 'None'}</p>
      </div>
    ),
  },
];

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

const RenderRetestBy = ({ handleMouseEnter, handleMouseLeave, isHoveringName, row }) => {
  return (
    <div className={style.imgDiv}>
      <p
        className={`${style.userName} ${style.pointerClass}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <UserName
          user={row?.reTestBy}
          isHovering={
            isHoveringName?.userId === row?.reTestBy?._id && isHoveringName?.rowId === row?._id
              ? isHoveringName?.userId
              : null
          }
        />
      </p>
    </div>
  );
};
