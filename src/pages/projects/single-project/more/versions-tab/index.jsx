import { useCallback, useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import { useAppContext } from 'context/app-context';

import DeleteModal from 'components/delete-modal';
import Permissions from 'components/permissions';
import Loader from 'components/loader';
import Button from 'components/button';
import Icon from 'components/icon/themed-icon';
import TextField from 'components/text-field';

import { useToaster } from 'hooks/use-toaster';

import {
  useAddTestedVersion,
  useEditTestedVersion,
  useDeleteTestedVersion,
  useTestedVersionPerProject,
  useVersionFormCountForBulkUpdate,
} from 'api/v1/tested-version/tested-version';
import { useTestedEnvironmentPerProject } from 'api/v1/tested-environment/tested-environment';

import { debounce as _debounce } from 'utils/lodash';

import clearIcon from 'assets/cross.svg';
import noFound from 'assets/no-found.svg';

import AddVersion from './add-version';
import style from './version.module.scss';

const VersionTab = () => {
  const { id } = useParams();
  const [search, setSearch] = useState();
  const [openDelModal, setOpenDelModal] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState();
  const { userDetails } = useAppContext();

  const [openAddModal, setOpenAddModal] = useState(false);
  const { toastSuccess, toastError } = useToaster();

  const { data: _formCounts, refetch: refetchCounts } = useVersionFormCountForBulkUpdate({ id });
  const { data: _testedEnvironments } = useTestedEnvironmentPerProject({ id, search });
  const { data: _testedVersions, refetch, isLoading: _isLoading } = useTestedVersionPerProject({ id, search });

  const { mutateAsync: _addTestedVersionHandler } = useAddTestedVersion();
  const { mutateAsync: _editTestedVersionHandler } = useEditTestedVersion();
  const { mutateAsync: _deleteTestedVersionHandler } = useDeleteTestedVersion();

  const onAddVersion = useCallback(
    async (data, testedVersionId, setError, reset) => {
      try {
        const res = testedVersionId
          ? await _editTestedVersionHandler({
              id: testedVersionId,
              body: { ...data },
            })
          : await _addTestedVersionHandler({ ...data, projectId: id });

        toastSuccess(res.msg);
        setOpenAddModal({ open: false });
        reset();
        refetch();
        refetchCounts();
      } catch (error) {
        toastError(error, setError);
      }
    },
    [_addTestedVersionHandler, _editTestedVersionHandler, id, refetch, refetchCounts, toastError, toastSuccess],
  );

  const onDeleteVersion = useCallback(async () => {
    try {
      const res = await _deleteTestedVersionHandler({
        id: openDelModal?._id,
        body: { name: openDelModal?.name, projectId: id },
      });

      if (selectedVersion?.id === openDelModal?._id) {
        setSelectedVersion('');
      }

      if (res.msg) {
        toastSuccess(res.msg);
        console.log({ open: false });
        setOpenDelModal({ open: false });
        refetch();
      }
    } catch (error) {
      console.error(error);
    }
  }, [_deleteTestedVersionHandler, openDelModal, refetch, id, selectedVersion, toastSuccess]);

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
              <h6>Versions</h6>
              <Permissions allowedRoles={['Admin', 'Project Manager', 'QA']} currentRole={userDetails?.role}>
                <div data-cy="project-add-tested-version" className={style.innerFlex} onClick={handleAddNew}>
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
              <div className={style.groupBtn}>
                <Button
                  type={'button'}
                  text={'Group by enviroments'}
                  btnClass={style.btnClassUncheckModal}
                  data-cy="task-integration-discard-btn"
                />
              </div>
            </div>
            <div className={style.flex1}>
              <div className={style.testEnvName}>
                <p className={style.columnHead}>Name</p>
              </div>
              <div className={style.testEnvName1}>
                <p className={style.columnHead}>Status</p>
              </div>
            </div>
            {_testedVersions?.testedVersions?.length ? (
              _testedVersions?.testedVersions?.map((ele, index) => (
                <VersionRow
                  {...{
                    ele,
                    index,
                    userDetails,
                    setOpenAddModal,
                    setOpenDelModal,
                    selectedVersion,
                    setSelectedVersion,
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
        name={'Version'}
        clickHandler={onDeleteVersion}
        openDelModal={!!openDelModal?.open}
        setOpenDelModal={handleCloseDelModal}
        secondLine={'This version will be removed from all associated bugs and test cases.'}
      />
      <AddVersion
        id={openAddModal?._id}
        _formCounts={_formCounts}
        defaultValue={openAddModal}
        clickHandler={onAddVersion}
        data-cy="project-add-version"
        openAddModal={!!openAddModal?.open}
        setOpenAddModal={handleCloseAddModal}
        enivronmentOptions={_testedEnvironments?.testedEnvironments}
      />
    </>
  );
};

export default VersionTab;

const VersionRow = ({
  ele,
  index,
  userDetails,
  setOpenAddModal,
  setOpenDelModal,
  selectedVersion,
  setSelectedVersion,
}) => {
  const onSelectVersion = useCallback(
    () => setSelectedVersion({ id: ele?._id, name: ele?.name }),
    [setSelectedVersion, ele],
  );

  const onPreventDefault = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const onEditIcon = useCallback(() => {
    setOpenAddModal({ open: true, ...ele });
  }, [ele, setOpenAddModal]);

  const onDelIcon = useCallback(() => {
    setOpenDelModal({ open: true, ...ele });
  }, [setOpenDelModal, ele]);

  return (
    <div
      className={`${style.flex1} ${selectedVersion?.id === ele?._id && style.selected}`}
      key={ele?._id}
      id={ele?._id}
      onClick={onSelectVersion}
    >
      <div className={style.testEnvName}>
        <p className={style.p}>{ele.name}</p>
      </div>
      <Permissions allowedRoles={['Admin', 'Project Manager', 'QA']} currentRole={userDetails?.role}>
        <div className={style.innerRight} data-cy={`tested-version-threedots-icon${index}`} onClick={onPreventDefault}>
          <div className={style.testEnvName}>
            <p className={style.status} style={{ color: getColouredStatus(ele.status) }}>
              {ele.status}
            </p>
          </div>
          <div className={style.editIconClass}>
            <div data-cy="version-edit-option" onClick={onEditIcon}>
              <Icon name={'EditIconGrey'} />
            </div>

            <div data-cy="version-del-option" onClick={onDelIcon} className={style.imgDel}>
              <Icon name={'DelIcon'} />
            </div>
          </div>
        </div>
      </Permissions>
    </div>
  );
};

const getColouredStatus = (status) => {
  switch (status) {
    case 'Active':
      return '#34C369';
    case 'Outdated':
      return '#DEBB00';
    case 'Achieved':
      return '#5E5E5E';
    default:
      return '#5E5E5E';
  }
};
