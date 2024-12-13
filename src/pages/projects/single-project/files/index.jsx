import { useRef, useState, useMemo, useCallback } from 'react';

import _ from 'lodash';
import { useForm } from 'react-hook-form';

import DragDrop from 'components/drag-drop';
import GenericTable from 'components/generic-table';
import TextField from 'components/text-field';
import DeleteModal from 'components/delete-modal';
import Loader from 'components/loader';
import MainWrapper from 'components/layout/main-wrapper';
import { FileInput } from 'components/form-fields';

import { useToaster } from 'hooks/use-toaster';

import {
  useDeleteProjectFile,
  useGetProjectFiles,
  useRenameProjectFile,
  useUploadProjectFiles,
} from 'api/v1/projects/files';

import { fileCaseHandler } from 'utils/file-handler';
import { debounce as _debounce } from 'utils/lodash';

import clearIcon from 'assets/cross.svg';

import RenameFile from './rename-file';
import style from './file.module.scss';
import { columnsData } from './helper';

const FilesSection = ({ noHeader, projectId }) => {
  const { control, watch, setValue, reset, setError } = useForm();
  const { toastSuccess, toastError } = useToaster();
  const [search, setSearch] = useState('');

  const [sortFilters, setSortFilters] = useState({
    sortBy: '',
    sort: '',
  });

  const {
    data: _projectFiles,
    refetch,
    isLoading: _loadingFetch,
    isFetching: _isFilesFetching,
  } = useGetProjectFiles({ projectId, search, sortFilters });

  const { mutateAsync: _uploadFileHandler, isLoading: _loadingUpload } = useUploadProjectFiles();
  const { mutateAsync: _renameFileHandler, isLoading: _loadingRename } = useRenameProjectFile();
  const { mutateAsync: _deleteFileHandler, isLoading: _loadingDelete } = useDeleteProjectFile();
  const ref = useRef();

  const [openRenameModal, setOpenRenameModal] = useState({});
  const [openDelModal, setOpenDelModal] = useState('');

  const uploadFiles = useCallback(
    async (files) => {
      try {
        const res = await _uploadFileHandler({
          id: projectId,
          body: {
            ...files[0],
            type: fileCaseHandler(files[0].type),
          },
        });
        toastSuccess(res.msg);
        reset();
        refetch();
      } catch (error) {
        toastError(error, setError);
      }
    },
    [projectId, reset, refetch, setError, _uploadFileHandler, toastError, toastSuccess],
  );

  const onRename = useCallback(
    async (id, body, setError) => {
      try {
        const res = await _renameFileHandler({ id, body });
        toastSuccess(res.msg);
        setOpenRenameModal({});
        refetch();
      } catch (error) {
        toastError(error, setError);
      }
    },
    [setOpenRenameModal, refetch, _renameFileHandler, toastError, toastSuccess],
  );

  const onDelete = useCallback(
    async (id) => {
      try {
        const res = await _deleteFileHandler(id);
        toastSuccess(res.msg);
        setOpenDelModal({});
        refetch();
      } catch (error) {
        toastError(error);
      }
    },
    [setOpenDelModal, refetch, _deleteFileHandler, toastError, toastSuccess],
  );

  const handleFilterChange = _.debounce(({ sortBy = '', sort = '' }) => {
    setSortFilters((pre) => ({
      ...pre,
      sortBy,
      sort,
    }));
  }, 1000);

  const columns = useMemo(() => {
    return columnsData({
      setOpenRenameModal,
      setOpenDelModal,
      searchedText: search,
    });
  }, [search]);

  const onOpenRenameModal = useCallback(() => setOpenRenameModal({}), [setOpenRenameModal]);

  const handleSubmitFile = useCallback(
    (body, setError) => onRename(openRenameModal?._id, body, setError),
    [onRename, openRenameModal],
  );

  const clickHandler = useCallback(() => {
    onDelete(openDelModal?._id);
  }, [onDelete, openDelModal]);

  const onChangeHandler = useCallback(
    (files) => {
      setValue('projectFile', files);
    },
    [setValue],
  );

  return (
    <>
      <MainWrapper title={'Files'} noHeader={noHeader}>
        <div className={style.main}>
          <FileInput
            name={'projectFile'}
            control={control}
            maxSize={10 * 1024 * 1024}
            multiple={false}
            accept={{
              'application/*': ['.docx', '.pdf', '.doc', '.pptx', '.ppt', '.xlsx'],
              'text/*': ['.txt', '.csv'],
            }}
            onChangeHandler={onChangeHandler}
          >
            <DragDrop type="file" files={watch('projectFile')} handleSubmit={uploadFiles} isLoading={_loadingUpload} />
          </FileInput>

          <div className={style.titleDiv}>
            <h5>Files ({_projectFiles?.files?.length || 0})</h5>

            <TextField
              searchField
              searchIcon={true}
              clearIcon={clearIcon}
              startIconClass={style.startIcon}
              placeholder="Search .."
              onClear={_debounce(() => {
                setSearch('');
              }, 1000)}
              onChange={_debounce((e) => {
                setSearch(e?.target?.value);
              }, 1000)}
            />
          </div>
          {_loadingFetch || _isFilesFetching ? (
            <Loader />
          ) : (
            <div className={style.tableWidth}>
              <GenericTable
                ref={ref}
                columns={columns}
                dataSource={_projectFiles?.files || []}
                height={'calc(100vh - 335px)'}
                classes={{
                  test: style.test,
                  table: style.table,
                  thead: style.thead,
                  th: style.th,
                  containerClass: style.checkboxContainer,
                  tableBody: style.tableRow,
                }}
                filters={sortFilters}
                onClickHeader={handleFilterChange}
              />
            </div>
          )}
        </div>
      </MainWrapper>

      <RenameFile
        openRenameModal={!!openRenameModal?._id}
        setOpenRenameModal={onOpenRenameModal}
        defaultValue={openRenameModal?.name}
        handleSubmitFile={handleSubmitFile}
        isLoading={_loadingRename}
      />
      <DeleteModal
        openDelModal={!!openDelModal?._id}
        setOpenDelModal={setOpenDelModal}
        name={'File'}
        isLoading={_loadingDelete}
        backClass={style.modal}
        clickHandler={clickHandler}
      />
    </>
  );
};

export default FilesSection;
