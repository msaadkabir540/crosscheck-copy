import { useCallback, useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import { useAppContext } from 'context/app-context';

import DeleteModal from 'components/delete-modal';
import Permissions from 'components/permissions';
import Loader from 'components/loader';
import Icon from 'components/icon/themed-icon';
import TextField from 'components/text-field';

import { useToaster } from 'hooks/use-toaster';

import {
  useAddTestedEnvironment,
  useEditTestedEnvironment,
  useDeleteTestedEnvironment,
  useTestedEnvironmentPerProject,
} from 'api/v1/tested-environment/tested-environment';

import { debounce as _debounce } from 'utils/lodash';

import clearIcon from 'assets/cross.svg';
import noFound from 'assets/no-found.svg';

import AddEnvironment from './add-environment';
import style from './environment.module.scss';

const EnvironmentTab = () => {
  const { id } = useParams();
  const [search, setSearch] = useState();
  const [selectedTestedEnvironment, setSelectedTestedEnvironment] = useState('');
  const [openDelModal, setOpenDelModal] = useState(false);
  const { userDetails } = useAppContext();

  const [openAddModal, setOpenAddModal] = useState(false);
  const { toastSuccess, toastError } = useToaster();

  const { data: _testedEnvironments, refetch, isLoading: _isLoading } = useTestedEnvironmentPerProject({ id, search });

  const { mutateAsync: _addTestedEnvironmentHandler } = useAddTestedEnvironment();
  const { mutateAsync: _editTestedEnvironmentHandler } = useEditTestedEnvironment();
  const { mutateAsync: _deleteTestedEnvironmentHandler } = useDeleteTestedEnvironment();

  const onAddTestedEnvironment = useCallback(
    async (data, testedEnvironmentId, setError) => {
      try {
        const res = testedEnvironmentId
          ? await _editTestedEnvironmentHandler({
              id: testedEnvironmentId,
              body: { ...data },
            })
          : await _addTestedEnvironmentHandler({ ...data, projectId: id });

        toastSuccess(res.msg);
        setOpenAddModal({ open: false });
        refetch();
      } catch (error) {
        toastError(error, setError);
      }
    },
    [_addTestedEnvironmentHandler, _editTestedEnvironmentHandler, id, refetch, toastError, toastSuccess],
  );

  const onDeleteTestedEnvironment = useCallback(async () => {
    try {
      const res = await _deleteTestedEnvironmentHandler({
        id: openDelModal?._id,
        body: { name: openDelModal?.name, projectId: id },
      });

      if (selectedTestedEnvironment?.id === openDelModal?._id) {
        setSelectedTestedEnvironment('');
      }

      if (res.msg) {
        toastSuccess(res.msg);
        setOpenDelModal({ open: false });
        refetch();
      }
    } catch (error) {
      toastError(error);
    }
  }, [_deleteTestedEnvironmentHandler, openDelModal, refetch, id, selectedTestedEnvironment, toastError, toastSuccess]);

  useEffect(() => {
    refetch();
  }, [id, search, refetch]);

  const handleSearchChange = _debounce((e) => {
    setSearch(e?.target?.value);
  }, 1000);

  const handleClear = _debounce(() => {
    setSearch('');
  }, 1000);

  const handleAddNew = useCallback(() => setOpenAddModal({ open: true }), [setOpenAddModal]);

  const handleCloseDelModal = useCallback(() => setOpenDelModal({ open: false }), []);

  const handleCloseAddModal = useCallback(() => setOpenAddModal({ open: false }), [setOpenAddModal]);

  return (
    <>
      {' '}
      <div className={style.left}>
        {_isLoading ? (
          <Loader />
        ) : (
          <>
            <div className={style.flex}>
              <h6>Environments</h6>
              <Permissions allowedRoles={['Admin', 'Project Manager', 'QA']} currentRole={userDetails?.role}>
                <div data-cy="project-add-tested-environment" className={style.innerFlex} onClick={handleAddNew}>
                  <p> + Add New</p>
                </div>
              </Permissions>
            </div>
            <div className={style.searchDiv}>
              <TextField
                searchField
                searchIcon={true}
                clearIcon={clearIcon}
                onClear={handleClear}
                placeholder="Search..."
                onChange={handleSearchChange}
                startIconClass={style.startIcon}
              />
            </div>
            {_testedEnvironments?.testedEnvironments?.length ? (
              _testedEnvironments?.testedEnvironments?.map((ele, index) => (
                <EnvironmentRow
                  {...{
                    ele,
                    index,
                    toastError,
                    userDetails,
                    setOpenAddModal,
                    setOpenDelModal,
                    selectedTestedEnvironment,
                    setSelectedTestedEnvironment,
                  }}
                  key={ele?._id}
                />
              ))
            ) : (
              <div className={style.center}>
                <img src={noFound} alt="" />
              </div>
            )}
          </>
        )}
      </div>
      <DeleteModal
        name={'Environment'}
        openDelModal={!!openDelModal?.open}
        setOpenDelModal={handleCloseDelModal}
        clickHandler={onDeleteTestedEnvironment}
        secondLine={'This tested environment will be removed from all associated bugs and test cases.'}
      />
      <AddEnvironment
        id={openAddModal?._id}
        defaultValue={openAddModal}
        data-cy="project-add-environment"
        openAddModal={!!openAddModal?.open}
        clickHandler={onAddTestedEnvironment}
        setOpenAddModal={handleCloseAddModal}
      />
    </>
  );
};

export default EnvironmentTab;

const EnvironmentRow = ({
  ele,
  index,
  toastError,
  userDetails,
  setOpenAddModal,
  setOpenDelModal,
  selectedTestedEnvironment,
  setSelectedTestedEnvironment,
}) => {
  const onSelectTestEnvironment = useCallback(
    () => setSelectedTestedEnvironment({ id: ele?._id, name: ele?.name }),
    [setSelectedTestedEnvironment, ele],
  );

  const onPreventDefault = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const onEditIcon = useCallback(() => {
    setOpenAddModal({ open: true, ...ele });
  }, [ele, setOpenAddModal]);

  const onLinkIcon = useCallback(
    () => (ele?.url ? window.open(ele?.url, '_blank') : toastError({ msg: 'No Url Found!' })),
    [ele, toastError],
  );

  const onDelIcon = useCallback(() => {
    setOpenDelModal({ open: true, ...ele });
  }, [setOpenDelModal, ele]);

  return (
    <div
      className={`${style.flex1} ${selectedTestedEnvironment?.id === ele?._id && style.selected}`}
      key={ele?._id}
      id={ele?._id}
      onClick={onSelectTestEnvironment}
    >
      <div className={style.testEnvName}>
        <p className={style.p}>{ele.name}</p>
      </div>
      <Permissions allowedRoles={['Admin', 'Project Manager', 'QA']} currentRole={userDetails?.role}>
        <div data-cy={`tested-environment-threedots-icon${index}`} onClick={onPreventDefault}>
          <div className={style.editIconClass}>
            <div data-cy="environment-edit-option" onClick={onEditIcon}>
              <Icon name={'EditIconGrey'} />
            </div>
            <div data-cy="environment-edit-option" onClick={onLinkIcon}>
              <Icon name={'Link'} />
            </div>

            <div data-cy="environment-del-option" onClick={onDelIcon} className={style.imgDel}>
              <Icon name={'DelIcon'} />
            </div>
          </div>
        </div>
      </Permissions>
    </div>
  );
};
