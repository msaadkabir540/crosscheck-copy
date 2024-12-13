import { useCallback, useEffect, useRef, useState } from 'react';

import _ from 'lodash';
import { useForm } from 'react-hook-form';

import { useAppContext } from 'context/app-context';

import Button from 'components/button';
import GenericTable from 'components/generic-table';
import MainWrapper from 'components/layout/main-wrapper';
import Permissions from 'components/permissions';
import TextField from 'components/text-field';
import Loader from 'components/loader';
import Tabs from 'components/tabs';

import { useToaster } from 'hooks/use-toaster';

import { useRemoveUser, useToggleUserStatus, useGetInvitees, useGetUsers } from 'api/v1/settings/user-management';

import { formattedDate } from 'utils/date-handler';

import searchIcon from 'assets/search.svg';
import clearIcon from 'assets/cross.svg';

import { columnsData, columnsDataInvitees } from './helper';
import style from './user.module.scss';
import ChangeRole from './change-role-modal';
import ChangeClickupId from './change-clickup-id-modal';
import RemoveModal from './remove-modal';
import InviteModal from './invite-modal';
import SeatsFullModal from './seats-full';
import Icon from '../../components/icon/themed-icon';

const UserManagement = () => {
  const containerRef = useRef(null);
  const [changeRole, setChangeRole] = useState(null);
  const [inviteUser, setInviteUser] = useState(null);
  const [changeClickup, setChangeClickup] = useState(null);
  const [editUserId, setEditUserId] = useState(null);
  const [openMenu, setOpenMenu] = useState({});
  const [openMenuMobile, setopenMenuMobile] = useState(false);
  const [openMenuInviteMobile, setopenMenuInviteMobile] = useState(false);
  const [seatsFull, setSeatsFull] = useState(false);
  const [invitees, setInvitees] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [cancelInvite, setCancelInvite] = useState(false);

  const [addPopUp, setAddPopUp] = useState(false);
  const [setOpenDelModal] = useState(false);
  const [openRemoveModal, setOpenRemoveModal] = useState(false);

  const [filters, setFilters] = useState({
    sortBy: '',
    sort: '',
    search: '',
  });

  const { control, setError } = useForm();

  const { toastError, toastSuccess } = useToaster();
  const { userDetails } = useAppContext();
  const [users, setUsers] = useState({ count: 0, users: [] });
  const [page, setPage] = useState(1);

  const {
    data: _userData,
    isLoading: isRefetching,
    refetch,
  } = useGetUsers({
    ...filters,
    page,
    perPage: 25,
    onSuccess: (data) => {
      setUsers((pre) => ({
        ...pre,
        count: data.count,
        users: _.uniqBy([...data.users, ...(pre.users || [])], '_id'),
      }));
    },
  });

  useEffect(() => {
    const containerRefCurrent = containerRef.current;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = containerRefCurrent;

      if (scrollHeight - Math.ceil(scrollTop) === clientHeight && users.count !== users.users.length) {
        setPage((prev) => prev + 1);
      }
    };

    containerRefCurrent?.addEventListener('scroll', handleScroll);

    return () => {
      containerRefCurrent?.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef, _userData, users]);

  const { mutateAsync: _removeUSerHandler, isLoading: _isRemovingUser } = useRemoveUser();
  const { mutateAsync: _toggleStatusHandler } = useToggleUserStatus();
  const { mutateAsync: _getAllInvitees, isLoading: _isLoading } = useGetInvitees();

  // NOTE: get invitees
  const fetchInvitees = useCallback(async () => {
    try {
      const response = await _getAllInvitees();
      setInvitees(response?.invitees?.invitees);
    } catch (error) {
      toastError(error);
    }
  }, [_getAllInvitees, toastError]);

  useEffect(() => {
    fetchInvitees();
  }, [fetchInvitees]);

  // NOTE: for toggle             // NOTE: complete
  const handleSwitch = async (id, user) => {
    try {
      const res = await _toggleStatusHandler({ id, user });
      toastSuccess(res.status ? 'User Status set to Active' : 'User Status set to Not Active');
    } catch (error) {
      toastError(error, setError);
    }
  };

  // NOTE: for userRemoving     // NOTE: complete
  const handleUserRemove = useCallback(
    async (email) => {
      const memberEmail = {
        memberEmail: email,
      };

      try {
        const res = await _removeUSerHandler({ body: memberEmail });
        toastSuccess(res?.msg);
        setOpenRemoveModal(null);
        setOpenMenu(false);
        fetchInvitees();
        setUsers({});
        await refetch();
      } catch (error) {
        toastError(error);
      }

      setOpenDelModal(false);
    },
    [_removeUSerHandler, fetchInvitees, refetch, setOpenDelModal, toastError, toastSuccess],
  );

  // NOTE: update users on frontend when user is added  // NOTE: complete
  const resetHandler = useCallback(() => {
    setAddPopUp(false);
    setEditUserId(null);
  }, []);

  // NOTE: get users on frontend as per search query
  const handleFilterChange = _.debounce(({ sortBy = '', sort = '', search = '' }) => {
    setUsers({ count: 0, users: [] });
    setPage(() => 1);
    setFilters((pre) => ({
      ...pre,
      sortBy,
      sort,
      search,
    }));
  }, 1000);

  const onSearchChange = useCallback((e) => handleFilterChange({ search: e.target.value }), [handleFilterChange]);

  const handleOnClear = useCallback(() => handleFilterChange({ search: '' }), [handleFilterChange]);

  const onInviteBtn = useCallback(() => {
    setEditUserId(false);
    setInviteUser(true);
  }, []);

  const onBackDrop = useCallback(() => setOpenMenu(null), []);

  const handleInvite = useCallback(() => {
    setEditUserId(false);
    setInviteUser(true);
  }, []);

  const handleUpdatedUser = useCallback(() => {
    refetch();
    resetHandler();
  }, [refetch, resetHandler]);

  const handleCancelEvent = useCallback(() => editUserId && setEditUserId(null), [editUserId]);

  const menu = [
    {
      title: 'Edit Clickup ID',
      click: () => {
        setChangeClickup({ id: openMenu?._id, clickUpId: openMenu?.clickUpUserId });
        setOpenMenu(null);
      },
    },

    {
      title: 'Change Role',
      click: () => {
        setChangeRole({ id: openMenu?._id, role: openMenu?.role });
        setOpenMenu(null);
      },
    },
    {
      title: 'Remove User',
      click: () => {
        setOpenRemoveModal(openMenu?._id);
        setOpenMenu(openMenu?.email);
      },
    },
  ];

  const invitesMenu = [
    {
      title: 'Cancel Invite',
      click: () => {
        setCancelInvite(true);
        setOpenRemoveModal(openMenu?._id);
        setOpenMenu(openMenu?.email);
      },
    },
  ];

  const pages = [
    {
      tabTitle: 'Active User',
      content: (
        <>
          <div className={style.searchDiv}>
            <TextField
              searchField
              icon={searchIcon}
              clearIcon={clearIcon}
              placeholder="Type and search..."
              startIconClass={style.startIcon}
              onChange={onSearchChange}
              onClear={handleOnClear}
            />
            <div className={`${style.searchButtonWrapper}`}>
              <Permissions allowedRoles={['Admin']} currentRole={userDetails?.role}>
                <Button text="Invite User" handleClick={onInviteBtn} />
              </Permissions>
            </div>
          </div>
          <div className={style.header}>
            <h6>Total Users ({users?.count || 0})</h6>
            <div className={style.seatDiv}>
              <div className={style.info}>
                Seats({_userData?.userAnalytics})
                <span className={style.imgDivTooltip}>
                  <Icon name={'InfoIcon'} />
                  <div className={style.tooltip}>This includes seats in active users & invites</div>
                </span>
              </div>
              <div className={style.info}>
                <span className={style.imgDivTooltip}>
                  Developer Role({_userData?.devAnalytics})
                  <Icon name={'InfoIcon'} />
                  <div className={style.tooltip}>This includes seats in active users & invites</div>
                </span>
              </div>
            </div>
          </div>
          <div className={style.seatDivMobile}>
            <div className={style.info}>
              Seats({_userData?.userAnalytics})
              <span className={style.imgDivTooltip}>
                <Icon name={'InfoIcon'} />
                <div className={style.tooltip1}>This includes seats in active users & invites</div>
              </span>
            </div>
            <div className={style.info}>
              <span className={style.imgDivTooltip}>
                Developer Role({_userData?.devAnalytics})
                <Icon name={'InfoIcon'} />
                <div className={style.tooltip}>This includes seats in active users & invites</div>
              </span>
            </div>
          </div>
          {users.length <= 0 && isRefetching ? (
            <div className={style.loaderDiv}>
              <Loader />
            </div>
          ) : !users && page < 2 ? (
            <Loader />
          ) : (
            <div className={style.tableWidth}>
              <GenericTable
                ref={containerRef}
                columns={columnsData({
                  control,
                  handleSwitch,
                  users: users || [],
                  setEditUserId,
                  setChangeRole,
                  setOpenDelModal,
                  setAddPopUp,
                  openMenuMobile,
                  searchedText: filters?.search,
                  setopenMenuMobile,
                  changeClickup,
                  setChangeClickup,
                  userDetails,
                  openMenu,
                  menu,
                  setOpenMenu,
                })}
                dataSource={users?.users || []}
                addPopUp={addPopUp}
                height={'calc(100vh - 230px)'}
                classes={{
                  test: style.test,
                  table: style.table,
                  thead: style.thead,
                  th: style.th,
                  containerClass: style.checkboxContainer,
                  tableBody: style.tableRow,
                }}
                filters={filters}
                onClickHeader={handleFilterChange}
                isEditMode={true}
                editUserId={editUserId}
                cancelEvent={handleCancelEvent}
                handleUpdatedUser={handleUpdatedUser}
              />
              {isRefetching && <Loader tableMode />}
            </div>
          )}
        </>
      ),
    },
    {
      tabTitle: 'Invites',
      content: (
        <>
          <div className={style.searchDiv}>
            <TextField
              searchField
              icon={searchIcon}
              clearIcon={clearIcon}
              placeholder="Type and search..."
              startIconClass={style.startIcon}
              onChange={onSearchChange}
              onClear={handleOnClear}
            />
            <div className={`${style.searchButtonWrapper}`}>
              <Permissions allowedRoles={['Admin']} currentRole={userDetails?.role}>
                <Button text="Invite User" handleClick={handleInvite} />
              </Permissions>
            </div>
          </div>
          <div className={style.header}>
            <h6>Total Invites ({invitees?.length || 0})</h6>
          </div>
          {!invitees && page < 2 ? (
            <Loader />
          ) : (
            <div className={style.tableWidth}>
              <GenericTable
                ref={containerRef}
                columns={columnsDataInvitees({
                  control,
                  handleSwitch,
                  users: invitees || [],
                  setEditUserId,
                  setChangeRole,
                  setOpenDelModal,
                  openMenuInviteMobile,
                  setopenMenuInviteMobile,
                  setAddPopUp,
                  changeClickup,
                  setChangeClickup,
                  openMenu,
                  userDetails,
                  invitesMenu,
                  setOpenMenu,
                })}
                dataSource={(invitees && invitees) || []}
                addPopUp={addPopUp}
                height={'calc(100vh - 230px)'}
                classes={{
                  test: style.test,
                  table: style.table,
                  thead: style.thead,
                  th: style.th2,
                  containerClass: style.checkboxContainer,
                  tableBody: style.tableRow,
                }}
                filters={filters}
                onClickHeader={handleFilterChange}
                isEditMode={true}
                editUserId={editUserId}
                cancelEvent={handleCancelEvent}
                handleUpdatedUser={handleUpdatedUser}
              />
              {isRefetching && <Loader tableMode />}
            </div>
          )}
          ,
        </>
      ),
    },
  ];

  return (
    <MainWrapper title="User Management" date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}>
      <div className={style.userMain}>
        {!_isLoading && <Tabs pages={pages} activeTab={activeTab} setActiveTab={setActiveTab} />}

        {changeRole?.id && (
          <ChangeRole
            setUsers={setUsers}
            changeRole={changeRole}
            setChangeRole={setChangeRole}
            refetch={refetch}
            setOpenMenu={setOpenMenu}
          />
        )}
        {changeClickup?.id && (
          <ChangeClickupId
            changeClickup={changeClickup}
            setChangeClickup={setChangeClickup}
            setOpenMenu={setOpenMenu}
            refetch={refetch}
          />
        )}

        {openRemoveModal && (
          <RemoveModal
            icon={
              cancelInvite ? (
                <Icon name={'CancelInvite'} height={60} width={60} />
              ) : (
                <Icon name={'RemoveUserIcon'} height={60} width={60} />
              )
            }
            openRemoveModal={openRemoveModal}
            setOpenRemoveModal={setOpenRemoveModal}
            title={
              cancelInvite
                ? 'Are you sure you want cancel the invitation?'
                : 'Are you sure you want to remove this user?'
            }
            removeText={cancelInvite ? 'Yes, Cancel this Invitation' : 'Yes, Remove this User'}
            handleUserRemove={handleUserRemove}
            selectedUser={openMenu}
            loading={_isRemovingUser}
          />
        )}
      </div>
      {inviteUser && (
        <InviteModal
          inviteUser={inviteUser}
          setInviteUser={setInviteUser}
          refetchInvites={fetchInvitees}
          setSeatsFull={setSeatsFull}
        />
      )}
      {seatsFull && <SeatsFullModal setSeatsFull={setSeatsFull} seatsFull={seatsFull} />}
      {openMenu && <div className={style.backdropDiv} onClick={onBackDrop}></div>}
    </MainWrapper>
  );
};

export default UserManagement;
