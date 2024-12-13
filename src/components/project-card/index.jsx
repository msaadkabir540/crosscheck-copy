import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';

import { useAppContext } from 'context/app-context';

import MoreMenu from 'components/more-menu';
import Highlighter from 'components/highlighter';
import MobileMenu from 'components/mobile-menu';
import ClickUpMenu from 'components/click-up-menu';

import style from './project-card.module.scss';
import Icon from '../icon/themed-icon';

const ProjectCard = ({
  archive,
  data,
  favoriteToggle,
  archiveToggle,
  setOpenAddModal,
  index,
  favProjects,
  setOpenDelModal,
  searchedText,
  key,
  setOpenMenu,
  setOpenAllMembers,
  favoriteData,
}) => {
  const [open, setOpen] = useState(false);
  const { userDetails } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [points, setPoints] = useState({ x: 0, y: 0 });
  const [openRow, setOpenRow] = useState({});
  const menuRef = useRef(null);

  const isFavoriteProject = favProjects?.some((favProject) => favProject?._id === data?._id);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const menu = useMemo(() => {
    return menuItems({
      archive,
      setOpen,
      data,
      setOpenAddModal,
      setOpenDelModal,
      favoriteToggle,
      setOpenMenu,
      archiveToggle,
      isfavorite: isFavoriteProject,
      userDetails,
    });
  }, [
    archive,
    data,
    setOpenAddModal,
    setOpenDelModal,
    favoriteToggle,
    setOpenMenu,
    archiveToggle,
    isFavoriteProject,
    userDetails,
  ]);

  const navigate = useNavigate();

  const onContextMenu = useCallback(
    (e) => {
      e.preventDefault();
      setMenuOpen(true);
      setOpenRow(data);
      setPoints({
        x: e.pageX,
        y: e.pageY,
      });
    },
    [data],
  );

  const onMoreIcon = useCallback(() => setOpen(true), [setOpen]);

  const onProjectModule = useCallback(() => {
    navigate(`/projects/${data?._id}`);
  }, [navigate, data]);

  const onEditIcon = useCallback(() => {
    if (window.innerWidth <= 490) {
      setOpenMenu(data?._id);
    } else {
      setOpenAddModal(data?._id);
    }

    setOpen(false);
  }, [data, setOpenAddModal, setOpenMenu]);

  const onProjectCardEditIcon = useCallback(
    (e) => {
      favoriteToggle(e, data?._id);
      setOpen(false);
    },
    [favoriteToggle, data],
  );

  const onArchived = useCallback(
    (e) => {
      archiveToggle(e, data?._id);
      setOpen(false);
    },
    [archiveToggle, data],
  );

  const onBackDrop = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onDelIcon = useCallback(() => {
    setOpenDelModal((pre) => ({
      ...pre,
      id: data?._id,
      name: data.name,
    }));
  }, [data, setOpenDelModal]);

  const onClickUpMenu = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const optionMenu = [
    {
      bodyData: [
        {
          click: () => {
            setOpenAddModal(openRow?._id);
          },
          icon: <Icon name={'EditIconGrey'} iconClass={style.icon} />,
          text: 'Edit',
        },
      ],
    },
    {
      bodyData: [
        {
          click: (e) => {
            favoriteToggle(e, openRow?._id);
          },
          icon: <Icon name={isFavoriteProject ? 'Unfavorite' : 'StarIcon'} iconClass={style.icon} />,
          text: isFavoriteProject ? 'Unfavourite' : 'Favourite',
        },
      ],
    },
    {
      border: '1px solid var(--stroke-a)',
      bodyData: [
        {
          click: (e) => {
            archiveToggle(e, openRow?._id);
          },
          icon: <Icon name={'Archive'} iconClass={style.icon} />,
          text: openRow?.archive === true ? 'Unarchive' : 'Archive',
        },
      ],
    },
    {
      bodyData: [
        {
          click: () =>
            setOpenDelModal((pre) => ({
              ...pre,
              id: openRow?._id,
              name: openRow.name,
            })),
          icon: <Icon name={'DelIcon'} iconClass={style.iconRed} />,
          text: 'Delete',
          isDisabled: userDetails?.role === 'QA' || userDetails?.role === 'Developer' ? true : false,
        },
      ],
    },
  ];

  return (
    <>
      <div key={key} className={style.mainDiv} onContextMenu={onContextMenu}>
        <div className={style.header}>
          <p data-cy={`clickonprojectmodule${index}`} className={style.p} onClick={onProjectModule}>
            <Highlighter search={searchedText}>{data?.name}</Highlighter>
            {data?.name.length > 28 && (
              <span className={style.tooltip}>
                <Highlighter search={searchedText}>{data?.name}</Highlighter>
              </span>
            )}
          </p>
          <div onClick={onMoreIcon} data-cy={`projectcard-threedots-icon${index}`}>
            <Icon name={'MoreInvertIcon'} iconClass={style.iconMore} />
          </div>
          <div className={style.modalDiv}>{open && <MoreMenu menu={_.filter(menu, (obj) => !_.isEmpty(obj))} />}</div>

          {window.innerWidth <= 490 && (
            <div className={style.modalDivMobile}>
              <MobileMenu isOpen={open} setIsOpen={setOpen}>
                <div className={style.flexMain} onClick={onEditIcon}>
                  <Icon name={'EditIconGrey'} iconClass={style.icon} />
                  <p>Edit</p>
                </div>
                <div
                  className={style.flexMain}
                  onClick={onProjectCardEditIcon}
                  data-cy={`projectcard-edit-icon${index}`}
                >
                  <Icon name={'StarIcon'} iconClass={style.icon} />
                  <p>{favoriteData ? 'Unfavorite' : 'Favorite'}</p>
                </div>
                <div className={style.flexMain} onClick={onArchived}>
                  <Icon name={'Archive'} iconClass={style.icon} />
                  <p>{archive ? 'Unarchive' : 'Archive'}</p>
                </div>
                <div className={style.flexMain} onClick={onDelIcon}>
                  <div className={style.imgDel}>
                    <Icon name={'DelIcon'} iconClass={style.icon} />
                  </div>
                  <p>Delete</p>
                </div>
              </MobileMenu>
            </div>
          )}
        </div>
        <div className={style.info}>
          <div className={style.line}>
            <p>Milestones</p>
            <span>{data?.milestoneCount ?? 0}</span>
          </div>
          <div className={style.line}>
            <p>Features</p>
            <span>{data?.featureCount ?? '0'}</span>
          </div>
          <div className={style.line}>
            <p>Bugs</p>
            <span>{data?.bugsCount ?? '0'}</span>
          </div>
          <div className={style.line}>
            <p>Test Cases</p>
            <span>{data?.testCount ?? '0'}</span>
          </div>
          <div className={style.line}>
            <p>Test Runs</p>
            <span>{data?.testRunCount ?? '0'}</span>
          </div>
          <div className={style.line}>
            <p>Tasks</p>
            <span>{data?.taskCount ?? '0'}</span>
          </div>
          <div className={style.line}>
            <p>Feedback</p>
            <span>{data?.feedbackCount ?? '0'}</span>
          </div>
          <div className={style.line}>
            <p>Status</p>
            <span
              style={{ backgroundColor: data?.status == 'Open' ? '#F96E6E' : '#34C369' }}
              className={style.statusClass}
            >
              {data?.status ?? ''}
            </span>
          </div>
        </div>
        <div className={style.shared}>
          <p>Shared With</p>
          <div className={style.imgDiv} onClick={setOpenAllMembers}>
            {data.shareWith
              .slice(0, 4)
              .map((x) =>
                x?.profilePicture ? (
                  <img key={x.name} src={x?.profilePicture} alt="" />
                ) : (
                  <span key={x.name}>{_.first(x?.name)}</span>
                ),
              )}
            {data.shareWith.length > 4 && <p>{data.shareWith.length - 4}+</p>}
          </div>
        </div>
      </div>
      {open && <div className={style.backdrop} onClick={onBackDrop} />}

      {menuOpen &&
        optionMenu &&
        ReactDOM.createPortal(
          <div
            ref={menuRef}
            onClick={onClickUpMenu}
            className={style.rightClickMenu}
            style={{
              top: `${window.innerHeight - points.y < 300 ? window.innerHeight - 310 : points.y}px`,
              left: `${window.innerWidth - points.x < 266 ? window.innerWidth - 276 : points.x}px`,
            }}
          >
            <ClickUpMenu
              rightClickedRow={openRow}
              setOpenRow={setOpenRow}
              setMenuOpen={setMenuOpen}
              menuData={optionMenu ?? []}
            />
          </div>,
          document.body,
        )}
    </>
  );
};

export default ProjectCard;

const menuItems = ({
  archive,
  data,
  favoriteToggle,
  archiveToggle,
  setOpen,
  setOpenAddModal,
  isfavorite,
  setOpenMenu,
  setOpenDelModal,
  userDetails, // NOTE: Assuming you have userDetails with role in this object
}) => {
  const allowedRoles = ['Admin', 'Project Manager'];
  const allowedDelete = ['Admin', 'Project Manager'];
  const userRole = userDetails?.role;

  const canSeeButton = allowedRoles.includes(userRole);
  const canDelete = allowedDelete.includes(userRole);

  const items = [
    ...(canSeeButton
      ? [
          {
            title: 'Edit',
            compo: <Icon name={'EditIconGrey'} iconClass={style.icon} />,
            click: () => {
              if (window.innerWidth <= 490) {
                setOpenMenu(data?._id);
              } else {
                setOpenAddModal(data?._id);
              }

              setOpen(false);
            },
          },
        ]
      : []),

    ...(!data?.archive
      ? [
          {
            title: isfavorite ? 'Unfavorite' : 'Favorite',
            compo: <Icon name={isfavorite ? 'Unfavorite' : 'StarIcon'} iconClass={style.icon} />,
            click: (e) => {
              favoriteToggle(e, data?._id);
              setOpen(false);
            },
          },
        ]
      : []),

    ...(canSeeButton
      ? [
          {
            title: archive ? 'Unarchive' : 'Archive',
            compo: archive ? (
              <Icon name={'UnArchiveIcon'} iconClass={style.icon} />
            ) : (
              <Icon name={'Archive'} iconClass={style.icon} />
            ),
            click: (e) => {
              archiveToggle(e, data?._id);
              setOpen(false);
            },
          },
        ]
      : []),
    ...(canSeeButton && canDelete
      ? [
          {
            title: 'Delete',
            compo: <Icon name={'DelIcon'} iconClass={style.icon} />,
            click: () => {
              setOpenDelModal((pre) => ({
                ...pre,
                id: data?._id,
                name: data.name,
              }));
              setOpen(false);
            },
          },
        ]
      : []),
  ];

  return items;
};
