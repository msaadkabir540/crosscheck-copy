import { useMemo, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { useAppContext } from 'context/app-context';

import CreateDashboardModal from 'pages/dashboards/create-dashboard';
import ShareMemberModal from 'pages/dashboards/share-with-members';

import MainWrapper from 'components/layout/main-wrapper';
import Switch from 'components/switch';
import Button from 'components/button';
import DeleteModal from 'components/delete-modal';
import Menu from 'components/menu';
import GridLayout from 'components/grid-layout';
import ChartCard from 'components/chart/chart-card';
import Loader from 'components/loader';
import Icon from 'components/icon/themed-icon';

import { useToaster } from 'hooks/use-toaster';

import { useGetCustomDashboardsById, useDeleteDashboard } from 'api/v1/custom-dashboard/custom-dashboard';
import { useDeleteWidget } from 'api/v1/custom-dashboard/single-dashboard';

import { formattedDate } from 'utils/date-handler';
import ROUTES from 'constants/routes';

import { useUpdateDashboardLayout } from '../../api/v1/custom-dashboard/custom-dashboard';
import { findMaxY } from './add-widget/helper';
import AddWidgetModal from './add-widget';
import style from './style.module.scss';
import Filters from './filters-modal';

const Index = () => {
  const { control } = useForm();
  const { id } = useParams();
  const { userDetails } = useAppContext();
  const [isLayoutEdit, setIsLayoutEdit] = useState(false);
  const [editRecord, setEditRecord] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isShareMemberModalOpen, setIsShareMemberModalOpen] = useState(false);
  const [isDashboardDelete, setIsDashboardDelete] = useState(false);
  const [isWidgetDelete, setIsWidgetDelete] = useState({ open: false, id: '' });
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [isFiltersActive, setIsFiltersActive] = useState({ open: false, type: '' });
  const [filters, setFilters] = useState({});
  const [newLayout, setNewLayout] = useState([]);

  const { toastSuccess, toastError } = useToaster();

  const navigate = useNavigate();

  const { data: _dashboardData, isFetching, refetch } = useGetCustomDashboardsById(id);
  const { mutateAsync: _deleteDashboardHandler, isLoading: _isDeleteDashboardLoading } = useDeleteDashboard();
  const { mutateAsync: _layoutChangeHandler, isLoading: _isLayoutLoading } = useUpdateDashboardLayout();

  const { mutateAsync: _deleteWidgetHandler, isLoading: _isDeleteWidgetLoading } = useDeleteWidget();

  const layout = useMemo(() => {
    return _dashboardData?.dashboard?.layout;
  }, [_dashboardData]);

  const maxY = useMemo(() => {
    const grids = (layout || []).map((x) => x?.dataGrid);

    return findMaxY(grids);
  }, [layout]);

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
          setEditRecord(id);
          setIsCreateModalOpen(true);
          setOpenMenu(false);
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
          setEditRecord(id);
          setIsShareMemberModalOpen(true);
          setOpenMenu(false);
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
          setEditRecord(id);
          setIsDashboardDelete(true);
          setOpenMenu(false);
        },
      },
    ];
  }, [openMenu]);

  const onDeleteDashboard = async () => {
    try {
      const res = await _deleteDashboardHandler({ id: editRecord });

      if (res?.msg) {
        setEditRecord('');
        setIsDashboardDelete(false);
        toastSuccess(res?.msg);

        navigate(ROUTES.DASHBOARDS);
      }
    } catch (error) {
      console.error(error);
      toastError(error);
    }
  };

  const onDeleteWidget = async () => {
    try {
      const res = await _deleteWidgetHandler({ id, widgetId: isWidgetDelete.id || '' });

      if (res?.msg) {
        toastSuccess(res?.msg);
        refetch();
        setIsWidgetDelete({ open: false, id: '' });
      }
    } catch (error) {
      console.error(error);
      toastError(error);
    }
  };

  const onLayoutChange = async (e) => {
    try {
      setNewLayout(e);
    } catch (error) {
      console.error(error);
    }
  };

  const onSaveLayout = async () => {
    try {
      const updatedLayout = layout?.reduce((acc, x, index) => {
        const newObject = {
          ...x,
          dataGrid: newLayout[index],
        };
        acc.push(newObject);

        return acc;
      }, []);

      const body = {
        layout: updatedLayout,
      };

      const res = await _layoutChangeHandler({ id, body });

      if (res?.msg) {
        toastSuccess(res?.msg);
        setIsLayoutEdit(true);
      }
    } catch (error) {
      console.error(error);
      toastError(error);
    }
  };

  const isSharedWith = useMemo(() => {
    return _dashboardData?.dashboard?.createdBy?._id === userDetails?.id || false;
  }, [_dashboardData, userDetails]);

  return (
    <MainWrapper title="Dashboards" date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}>
      <div className={style.header}>
        <div className={style.title}>
          <span
            onClick={() => {
              navigate(ROUTES.DASHBOARDS);
            }}
          >
            <Icon name={'ArrowLeft'} />
          </span>
          <h2>{_dashboardData?.dashboard?.dashboardName}</h2>
        </div>

        {isSharedWith && (
          <div className={style.buttons}>
            <div> Edit Mode</div>
            <Switch
              id={'editMode'}
              control={control}
              name={'editMode'}
              onChange={() => setIsLayoutEdit((pre) => !pre)}
            />
            <Button
              text="Share"
              type={'button'}
              btnClass={style.btn}
              handleClick={() => {
                setEditRecord(id);
                setIsShareMemberModalOpen(true);
                setOpenMenu(false);
              }}
            />

            <Button
              text="Add Widget"
              type={'button'}
              onClick={() => {
                setIsAddWidgetOpen(true);
              }}
            />

            {isLayoutEdit && (
              <div className={style.divWrapper}>
                <Button
                  text="Discard"
                  type={'button'}
                  btnClass={style.btn}
                  disabled={isFetching}
                  handleClick={() => {
                    document.getElementById('editMode').click();
                    refetch();
                  }}
                />

                <Button text="Save Layout" type={'button'} onClick={onSaveLayout} disabled={_isLayoutLoading} />
              </div>
            )}

            <div
              className={style.img}
              onClick={() => {
                setOpenMenu(true);
              }}
              role="presentation"
            >
              <Icon name={'MoreInvertIcon'} width={26} height={26} />
            </div>
            {openMenu && (
              <div className={style.menuDiv}>
                <Menu menu={menu} />
              </div>
            )}
          </div>
        )}
      </div>
      <div className={style.gridLayout}>
        {isFetching ? (
          <Loader />
        ) : layout?.length ? (
          <GridLayout
            layout={layout}
            isAllowEditing={isLayoutEdit}
            onLayoutChange={onLayoutChange}
            Component={ChartCard}
            componentProps={{
              isSharedWith,
              setDelete: setIsWidgetDelete,
              setEditWidget: (id) => {
                setEditRecord(id);
                setIsAddWidgetOpen(true);
              },
              isFiltersActive,
              filters,
              setFilterActive: ({ open, id, type }) => {
                setIsFiltersActive({ open, id, type });
              },
            }}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '60vh',
            }}
          >
            <Icon name={'NoDataIcon'} />
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
          setOpenDelModal={() => {
            setEditRecord('');
            setIsDashboardDelete(false);
          }}
          name="Record"
          clickHandler={(e) => onDeleteDashboard(e)}
          cancelText="No, Keep this Record"
          isLoading={_isDeleteDashboardLoading}
        />
      )}

      {isWidgetDelete.open && (
        <DeleteModal
          openDelModal={isWidgetDelete.open}
          setOpenDelModal={() => {
            setIsWidgetDelete({ open: false, id: '' });
          }}
          name="Widget"
          clickHandler={(e) => onDeleteWidget(e)}
          cancelText="No, Keep this Widget"
          isLoading={_isDeleteWidgetLoading}
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

      {isFiltersActive.open && (
        <Filters
          open={isFiltersActive?.open}
          setOpen={(e) => {
            setIsFiltersActive({ open: e });
          }}
          id={isFiltersActive?.id}
          type={isFiltersActive?.type}
          onApplyFilters={(filters) => {
            setFilters(filters);
            setIsFiltersActive((pre) => ({ ...pre, open: false }));
          }}
        />
      )}

      {isAddWidgetOpen && (
        <AddWidgetModal
          open={isAddWidgetOpen}
          setOpen={setIsAddWidgetOpen}
          backClass={''}
          maxY={maxY}
          refetch={refetch}
          isEditable={!!editRecord}
          editRecordId={editRecord}
          setEditRecord={setEditRecord}
        />
      )}
      {openMenu && <div className={style.backdropDiv} onClick={() => setOpenMenu(false)}></div>}
    </MainWrapper>
  );
};

export default Index;
