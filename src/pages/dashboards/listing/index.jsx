import { useCallback, useMemo, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppContext } from 'context/app-context';

import Button from 'components/button';
import TextField from 'components/text-field';
import GenericTable from 'components/generic-table';
import Loader from 'components/loader';
import DeleteModal from 'components/delete-modal';
import Permissions from 'components/permissions';

import { useToaster } from 'hooks/use-toaster';

import { useGetCustomDashboards, useDeleteDashboard } from 'api/v1/custom-dashboard/custom-dashboard';

import ROUTES from 'constants/routes';
import { debounce as _debounce } from 'utils/lodash';

import searchIcon from 'assets/search.svg';
import clearIcon from 'assets/cross.svg';

import { columnsData } from '../helper';
import ShareMemberModal from '../share-with-members';
import CreateDashboardModal from '../create-dashboard';
import style from './style.module.scss';
import Icon from '../../../components/icon/themed-icon';

const Index = ({ type, setCount }) => {
  const containerRef = useRef();

  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDashboardDelete, setIsDashboardDelete] = useState(false);
  const [search, setSearch] = useState('');
  const [isShareMemberModalOpen, setIsShareMemberModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState('');
  const [isHoveringName, setIsHoveringName] = useState({});
  const [openMenu, setOpenMenu] = useState({});

  const {
    data: _dashboards,
    isLoading: _isDashboardLoading,
    isFetching: _isDashboardFetching,
    refetch,
  } = useGetCustomDashboards();
  const { toastSuccess, toastError } = useToaster();
  const { userDetails } = useAppContext();

  const { mutateAsync: _deleteDashboardHandler, isLoading: _isDeleteDashboardLoading } = useDeleteDashboard();

  const menu = useMemo(() => {
    return [
      {
        title: 'Rename',
        compo: (
          <div className={style.editColor}>
            <Icon name={'RenameIcon'} />
          </div>
        ),
        click: () => {
          setEditRecord(openMenu?._id);
          setIsCreateModalOpen(true);
          setOpenMenu({});
        },
      },

      {
        title: 'Share',
        compo: (
          <div className={style.editColor}>
            <Icon name={'ShareIconBlack'} />
          </div>
        ),
        click: () => {
          setEditRecord(openMenu?._id);
          setIsShareMemberModalOpen(true);
          setOpenMenu({});
        },
      },
      {
        title: 'Delete',
        compo: (
          <div className={style.editColor}>
            <Icon name={'DelIcon'} />
          </div>
        ),
        click: () => {
          setEditRecord(openMenu?._id);
          setIsDashboardDelete(true);

          setOpenMenu({});
        },
      },
    ];
  }, [openMenu]);

  const selectedDashboardsData = useMemo(() => {
    const typedDashboardData = _dashboards?.dashboardsData?.[type];

    const filteredData = typedDashboardData?.filter((x) =>
      x.dashboardName?.toLowerCase()?.includes(search.toLowerCase()),
    );
    setCount(_dashboards?.dashboardsData?.['all']?.length || 0);

    return search ? filteredData : typedDashboardData || [];
  }, [type, _dashboards, search, setCount]);

  const onDeleteDashboard = useCallback(async () => {
    try {
      const res = await _deleteDashboardHandler({ id: editRecord });

      if (res?.msg) {
        refetch();
        setEditRecord('');
        setIsDashboardDelete(false);
        toastSuccess(res?.msg);
      }
    } catch (error) {
      console.error(error);
      toastError(error);
    }
  }, [toastError, refetch, setEditRecord, toastSuccess, setIsDashboardDelete, _deleteDashboardHandler, editRecord]);

  const onNavigate = (id) => {
    navigate(`${ROUTES.SINGLE_DASHBOARD.replace(':id', id)}`);
  };

  const onShareWithClickHandler = (id) => {
    setEditRecord(id);
    setIsShareMemberModalOpen(true);
  };

  const handleSearchChange = _debounce((e) => {
    setSearch(e?.target?.value);
  }, 1000);

  const handleCreateModalOpen = useCallback(() => {
    setIsCreateModalOpen(true);
  }, [setIsCreateModalOpen]);

  const handleMenuClose = useCallback(() => {
    setOpenMenu({});
  }, [setOpenMenu]);

  const handleDelModalClose = useCallback(() => {
    setEditRecord('');
    setIsDashboardDelete(false);
  }, []);

  return (
    <>
      <div className={style.main}>
        <div className={style.header}>
          <TextField
            searchField
            icon={searchIcon}
            startIconClass={style.startIcon}
            clearIcon={clearIcon}
            placeholder="Search..."
            onClear={_debounce(() => {
              setSearch('');
            }, 1000)}
            onChange={handleSearchChange}
          />
          <Permissions
            allowedRoles={['Admin', 'Project Manager', 'QA', 'Developer']}
            currentRole={userDetails?.role}
            locked={userDetails?.activePlan === 'Free'}
          >
            <Button text={'Create Dashboard'} onClick={handleCreateModalOpen} type={'button'} />{' '}
          </Permissions>
        </div>

        {_isDashboardLoading ? (
          <Loader />
        ) : (
          <div className={style.tableWidth}>
            <GenericTable
              ref={containerRef}
              columns={columnsData({
                searchedText: '',
                isHoveringName,
                setIsHoveringName,
                menu,
                openMenu,
                setOpenMenu,
                onNavigate,
                onShareWithClickHandler,
                userDetails,
              })}
              dataSource={selectedDashboardsData || []}
              height={'calc(100vh - 205px)'}
              selectable={true}
              classes={{
                table: style.table,
                thead: style.thead,
                th: style.th,
                containerClass: style.checkboxContainer,
                tableBody: style.tableRow,
              }}
            />
            {_isDashboardFetching && <Loader tableMode />}
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <CreateDashboardModal
          open={isCreateModalOpen}
          setOpen={setIsCreateModalOpen}
          backClass={''}
          refetch={refetch}
          isEditable={!!editRecord}
          editRecordId={editRecord}
          setEditRecord={setEditRecord}
        />
      )}
      {isDashboardDelete && (
        <DeleteModal
          openDelModal={isDashboardDelete}
          setOpenDelModal={handleDelModalClose}
          name="Record"
          clickHandler={onDeleteDashboard}
          cancelText="No, Keep this Record"
          isLoading={_isDeleteDashboardLoading}
        />
      )}
      {isShareMemberModalOpen && (
        <ShareMemberModal
          open={isShareMemberModalOpen}
          setOpen={setIsShareMemberModalOpen}
          backClass={''}
          refetch={refetch}
          isEditable={!!editRecord}
          editRecordId={editRecord}
          setEditRecord={setEditRecord}
        />
      )}

      {openMenu?._id && <div className={style.backdropDiv} onClick={handleMenuClose}></div>}
    </>
  );
};

export default Index;
