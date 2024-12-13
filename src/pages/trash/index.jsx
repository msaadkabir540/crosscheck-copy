import { useEffect, useRef, useState } from 'react';

import { useForm } from 'react-hook-form';
import _ from 'lodash';
import { useSearchParams } from 'react-router-dom';

import { useAppContext } from 'context/app-context';

import Loader from 'components/loader';
import MobileMenu from 'components/mobile-menu';
import RestoreModal from 'components/restore-modal';
import DelForeverModal from 'components/delete-modal-forever';
import DeleteModal from 'components/delete-modal';
import GenericTable from 'components/generic-table';
import MainWrapper from 'components/layout/main-wrapper';
import Permissions from 'components/permissions';
import Menu from 'components/menu';

import { useToaster } from 'hooks/use-toaster';

import {
  useDeleteTrashAll,
  useDeleteTrashSingle,
  useGetAllTrash,
  useRestoreTrashAll,
  useRestoreTrashSingle,
} from 'api/v1/trash/trash';

import { formattedDate } from 'utils/date-handler';

import FilterHeader from './header';
import style from './trash.module.scss';
import { columnsData } from './helper';
import Icon from '../../components/icon/themed-icon';

const Trash = (noHeader) => {
  const ref = useRef();
  const { userDetails } = useAppContext();

  const [searchParams] = useSearchParams();
  const [delModal, setDelModal] = useState(false);
  const [restoreAll, setRestoreAll] = useState(false);
  const [menu, setMenu] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [trash, setTrash] = useState({});
  const [delModalForever, setDelModalForever] = useState(false);
  const [isHoveringName, setIsHoveringName] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const { control, register, watch, reset, setValue } = useForm();
  const { toastSuccess, toastError } = useToaster();

  const [filters, setFilters] = useState({
    searchType: [],
    deletedBy: [],
  });

  const onFilterApply = _.debounce(() => {
    setFilters((pre) => ({
      ...pre,
      ...(watch('deletedBy') && { deletedBy: watch('deletedBy') || [] }),
      ...(watch('searchType') && { searchType: watch('searchType') || [] }),
      ...(watch('deletedOn') &&
        watch('deletedOn.start') &&
        watch('deletedOn.end') && {
          deletedOn: {
            start: formattedDate(watch('deletedOn.start'), 'yyyy-MM-dd'),
            end: formattedDate(watch('deletedOn.end'), 'yyyy-MM-dd'),
          },
        }),
    }));
  }, 1000);

  const { mutateAsync: _getAllTrash, isLoading: _IsLoading } = useGetAllTrash();

  const fetchAllTrash = async (filters) => {
    try {
      const response = await _getAllTrash(filters);
      setTrash(response);
    } catch (error) {
      toastError(error);
    }
  };

  useEffect(() => {
    const _values = _.pick(Object.fromEntries([...searchParams]), [
      'reportedBy',
      'reportedAtStart',
      'reportedAtEnd',
      'searchType',
    ]);

    if (_values.reportedBy) {
      _values.deletedBy = _values?.reportedBy?.split(',') || [];
    }

    if (_values.searchType) {
      _values.searchType = _values?.searchType?.split(',') || [];
    }

    if (_values?.reportedAtStart && _values?.reportedAtEnd) {
      _values.deletedOn = {
        start: new Date(_values?.reportedAtStart),
        end: new Date(_values?.reportedAtEnd),
      };
    }

    delete _values.reportedBy;
    delete _values.reportedAtStart;
    delete _values.reportedAtEnd;

    Object.entries(_values).forEach(([key, val]) => {
      setValue(key, val);
    });
  }, []);

  useEffect(() => {
    fetchAllTrash({
      ...filters,
      ...(watch('deletedBy') && { deletedBy: watch('deletedBy') }),
      ...(watch('deletedOn.start') &&
        watch('deletedOn.end') && {
          deletedOn: {
            start: formattedDate(watch('deletedOn.start'), 'yyyy-MM-dd'),
            end: formattedDate(watch('deletedOn.end'), 'yyyy-MM-dd'),
          },
        }),
      ...(watch('searchType') && { searchType: watch('searchType') }),
    });
  }, [filters]);

  // NOTE: single delete
  const { mutateAsync: _deleteTrash, isLoading: _isTrashDeleting } = useDeleteTrashSingle();

  const onDelete = async (id, type) => {
    try {
      const res = await _deleteTrash({
        id,
        body: {
          type: type,
        },
      });
      toastSuccess(res.msg);
      await fetchAllTrash(filters);
      setDelModalForever(() => ({ open: false }));
    } catch (error) {
      toastError(error);
    }
  };

  // NOTE: delete all
  const { mutateAsync: _deleteAllTrash, isLoading: _isTrashAllDeleting } = useDeleteTrashAll();

  const onDeleteAll = async () => {
    try {
      const res = await _deleteAllTrash();
      toastSuccess(res.msg);
      await fetchAllTrash(filters);
      setDelModal(() => ({ open: false }));
    } catch (error) {
      toastError(error);
    }
  };

  // NOTE: single Restore
  const { mutateAsync: _restoreTrash } = useRestoreTrashSingle();

  const onRestore = async (id, type) => {
    try {
      const res = await _restoreTrash({
        id,
        body: {
          type: type,
        },
      });
      toastSuccess(res.msg);
      await fetchAllTrash(filters);
    } catch (error) {
      toastError(error);
    }
  };

  // NOTE: Restore All
  const { mutateAsync: _restoreTrashAll, isLoading: _isTrashRestoring } = useRestoreTrashAll();

  const onRestoreAll = async () => {
    try {
      const res = await _restoreTrashAll();
      toastSuccess(res.msg);
      setRestoreAll(() => ({ open: false }));
      await fetchAllTrash(filters);
    } catch (error) {
      toastError(error);
    }
  };

  const menuOptions = [
    {
      title: ' X   Clear All Trash',
      click: () => setDelModal({ open: true }),
    },
    {
      title: 'Restore All Trash',
      click: () => setRestoreAll({ open: true }),
    },
  ];

  return (
    <div
      style={{
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <MainWrapper title="Trash" date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}>
        <div className={style.main}>
          <div className={style.flexBetween}>
            <span>Items shown below will be automatically deleted forever after 30 days.</span>

            <div className={style.noneClass} onClick={() => setOpenMenu(true)}>
              <Icon name={'MoreInvertIcon'} />
            </div>

            {openMenu && (
              <div className={style.menuAbsolute}>
                <Menu menu={menuOptions} />
              </div>
            )}
            {openMenu && <div className={style.backdrop} onClick={() => setOpenMenu(false)} />}

            {trash?.allTrash?.length > 0 && (
              <Permissions allowedRoles={['Admin']} currentRole={userDetails?.role}>
                <div className={style.btnDivUp}>
                  <div className={style.clearBtn} onClick={() => setDelModal({ open: true })}>
                    X Clear All Trash
                  </div>
                  <div className={style.restoreBtn} onClick={() => setRestoreAll({ open: true })}>
                    <Icon name={'RestoreIcon'} />
                    Restore All Trash
                  </div>
                </div>
              </Permissions>
            )}
          </div>
        </div>
        <div className={style.headerDiv}>
          <FilterHeader
            {...{
              control,
              register,
              watch,
              setValue,
              _IsLoading,
              reset: () => {
                setFilters({
                  searchType: [],
                  deletedBy: [],
                });
                reset({
                  searchType: [],
                  deletedBy: [],
                });
              },
            }}
            onFilterApply={onFilterApply}
          />
        </div>
        <div className={style.headerDivMobile}>
          <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen}>
            <FilterHeader
              {...{
                control,
                register,
                watch,
                setValue,
                _IsLoading,
                reset: () => {
                  setFilters({
                    searchType: [],
                    deletedBy: [],
                  });
                  reset({
                    searchType: [],
                    deletedBy: [],
                  });
                  setIsOpen(false);
                },
              }}
              onFilterApply={onFilterApply}
            />
          </MobileMenu>
        </div>

        <div>
          <div
            className={style.mainClass}
            style={{
              marginTop: '20px',
            }}
          >
            <h6>Deleted Items ({trash?.allTrash?.length})</h6>
            <div className={style.menuIcon} onClick={() => setIsOpen(true)}>
              <Icon name={'MenuIcon'} />
            </div>
          </div>
          {_IsLoading ? (
            <Loader />
          ) : (
            <>
              <div className={style.tableWidth}>
                <GenericTable
                  ref={ref}
                  columns={columnsData({
                    menu,
                    setMenu,
                    setDelModalForever,
                    isHoveringName,
                    setIsHoveringName,
                    onRestore,
                    trash: trash,
                    role: userDetails.role,
                  })}
                  dataSource={trash?.allTrash || []}
                  height={noHeader ? 'calc(100vh - 330px)' : 'calc(100vh - 267px)'}
                  selectable={true}
                  classes={{
                    test: style.test,
                    table: style.table,
                    thead: style.thead,
                    th: style.th,
                    containerClass: style.checkboxContainer,
                    tableBody: style.tableRow,
                  }}
                />
              </div>
            </>
          )}
        </div>
      </MainWrapper>
      <DeleteModal
        openDelModal={!!delModal.open}
        setOpenDelModal={() => setDelModal({ open: false })}
        name="test case"
        clickHandler={() => onDeleteAll()}
        cancelText="Cancel"
        trashMode
        isLoading={_isTrashAllDeleting}
      />
      <DelForeverModal
        openDelModal={!!delModalForever.open}
        setOpenDelModal={() => setDelModalForever({ open: false })}
        clickHandler={() => onDelete(delModalForever?.id, delModalForever?.type)}
        cancelText="Cancel Deletion"
        isLoading={_isTrashDeleting}
      />
      <RestoreModal
        openDelModal={!!restoreAll.open}
        setOpenDelModal={() => setRestoreAll({ open: false })}
        clickHandler={() => onRestoreAll()}
        cancelText="Cancel"
        isLoading={_isTrashRestoring}
      />
    </div>
  );
};

export default Trash;
