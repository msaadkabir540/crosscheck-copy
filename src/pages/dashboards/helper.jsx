import { useCallback } from 'react';

import Highlighter from 'components/highlighter';
import UserName from 'components/user-name';
import Menu from 'components/menu';

import { formattedDate } from 'utils/date-handler';
import { first as _first } from 'utils/lodash';

import Icon from '../../components/icon/themed-icon';
import style from './listing/style.module.scss';

const UserNameComponent = ({ searchedText, user, isHovering }) => {
  return (
    <p className={style.userName} style={{ cursor: 'pointer' }}>
      <UserName searchedText={searchedText} user={user} isHovering={isHovering} />
    </p>
  );
};

const CreatedByColumn = ({ row, searchedText, setIsHoveringName, isHoveringName }) => {
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
    <div className={style.imgDiv} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <UserNameComponent
        searchedText={searchedText}
        user={row?.createdBy}
        isHovering={
          isHoveringName?.userId === row?.createdBy?._id && isHoveringName?.rowId === row?._id
            ? isHoveringName?.userId
            : null
        }
      />
    </div>
  );
};

const SharedWithColumn = ({ row, onShareWithClickHandler, userDetails }) => {
  const handleClick = useCallback(() => {
    row?.createdBy?._id === userDetails?.id ? onShareWithClickHandler(row._id) : null;
  }, [row?.createdBy?._id, userDetails?.id, onShareWithClickHandler]);

  return (
    <div className={style.imgDivShared} onClick={handleClick}>
      {row.shareWith
        .slice(0, 4)
        .map((x) =>
          x?.profilePicture ? (
            <img key={x?._id} src={x?.profilePicture} alt="" />
          ) : (
            <span key={x?._id}>{_first(x?.name)}</span>
          ),
        )}
      {row.shareWith.length > 4 && <p>{row.shareWith.length - 4}+</p>}
    </div>
  );
};

const ActionsColumn = ({ row, userDetails, setOpenMenu, openMenu, menu }) => {
  const handleOpenMenu = useCallback(() => {
    setOpenMenu(row);
  }, [setOpenMenu, row]);

  return (
    <>
      {row?.createdBy?._id === userDetails?.id && (
        <div className={style.imgDiv1}>
          <div className={style.img} onClick={handleOpenMenu} role="presentation">
            <Icon name={'MoreInvertIcon'} iconClass={style.iconClass} />
          </div>
          {openMenu?._id === row?._id && (
            <div className={style.menuDiv}>
              <Menu menu={menu} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export const columnsData = ({
  setIsHoveringName,
  isHoveringName,
  searchedText,
  setOpenMenu,
  openMenu,
  menu,
  onNavigate,
  onShareWithClickHandler,
  userDetails,
}) => [
  {
    name: 'Dashboard Name ',
    key: 'dashboardName',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '300px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,

    render: ({ row }) => {
      return (
        <div>
          <span
            className={style.userName}
            onClick={() => {
              onNavigate(row?._id);
            }}
          >
            <Highlighter search={searchedText}>{row?.dashboardName ? row?.dashboardName : '-'}</Highlighter>
          </span>
        </div>
      );
    },
  },

  {
    name: ' Date Created',
    key: 'createdAt',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '180px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>
            {row?.createdAt ? formattedDate(row.createdAt, 'dd-MMM-yy') : '-'}
          </Highlighter>{' '}
        </p>
      </div>
    ),
  },

  {
    name: 'Created By',
    key: 'createBy.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '180px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,
    render: ({ row }) => (
      <CreatedByColumn
        searchedText={searchedText}
        row={row}
        setIsHoveringName={setIsHoveringName}
        isHoveringName={isHoveringName}
      />
    ),
  },
  {
    name: 'Shared With ',
    key: 'shareWith.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '160px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,
    render: ({ row }) => (
      <SharedWithColumn row={row} onShareWithClickHandler={onShareWithClickHandler} userDetails={userDetails} />
    ),
  },

  {
    name: 'Actions',
    key: 'actions',
    hidden: false,
    widthAndHeight: { width: '100px', height: '36px' },
    render: ({ row }) => (
      <ActionsColumn row={row} userDetails={userDetails} setOpenMenu={setOpenMenu} openMenu={openMenu} menu={menu} />
    ),
  },
];
