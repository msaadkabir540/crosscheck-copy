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
        <p className={style.userName} style={{ cursor: 'pointer' }}>
          {formattedDate(row?.testDate, 'dd MMM yy')}
        </p>
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

    render: ({ row }) => {
      let hoverTimeout;

      const handleMouseEnter = () => {
        clearTimeout(hoverTimeout);

        hoverTimeout = setTimeout(() => {
          setIsHoveringName({
            userId: row?.testedBy?._id,
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
    },
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
