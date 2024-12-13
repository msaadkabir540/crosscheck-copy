import { useState, useRef, useMemo, useCallback } from 'react';

import _ from 'lodash';
import { CSVLink } from 'react-csv';

import { useAppContext } from 'context/app-context';

import MainWrapper from 'components/layout/main-wrapper';
// NOTE: components
import Button from 'components/button';
// NOTE: styles
import Loader from 'components/loader';
import Permissions from 'components/permissions';
import TextField from 'components/text-field';
import GenericTable from 'components/generic-table';
import DeleteModal from 'components/delete-modal';

import { useToaster } from 'hooks/use-toaster';

import { useDeleteFeedBacks, useGetFeedBacks } from 'api/v1/projects/feedbacks';
// NOTE: import _ from 'lodash';
import { useGetWidgetConfig } from 'api/v1/projects/widget';

import { debounce as _debounce } from 'utils/lodash';
import { formattedDate } from 'utils/date-handler';

import noData from 'assets/no-found.svg';
import deleteBtn from 'assets/deleteButton.svg';
import clearIcon from 'assets/cross.svg';

import { columnsData, useProjectOptions } from './helper';
import styles from './test.module.scss';
import style from './tasks.module.scss';
import WidgetConfig from './widget-configrations';
import ReportBug from './report-bug';
import Icon from '../../../../components/icon/themed-icon';

const FeedBack = ({ noHeader, projectId }) => {
  const [widget, setWidget] = useState(false);
  const containerRef = useRef();
  const { userDetails } = useAppContext();
  const { toastError, toastSuccess } = useToaster();

  const { data = {} } = useProjectOptions();

  const [selectedRecords, setSelectedRecords] = useState([]);
  const [delModal, setDelModal] = useState(false);
  const [, setOpenTaskModal] = useState(false);
  const [search, setSearch] = useState('');
  const [reportBug, setReportBug] = useState(false);
  const [editRecord, setEditRecord] = useState('');

  const [sortFilters, setSortFilters] = useState({
    sortBy: '',
    sort: '',
  });

  const { data: _widgetConfig, refetch } = useGetWidgetConfig(projectId);
  const { mutateAsync: _deleteFeedbackHandler, isLoading: _isDeleteLoading } = useDeleteFeedBacks();

  const {
    data: _feedbacks,
    refetch: _refetchFeedbacks,
    isLoading: _isLoading,
    isFetching: _isFetching,
  } = useGetFeedBacks({ projectId, search, sortFilters });

  const onDelete = useCallback(async () => {
    const bulk = delModal.bulk;

    try {
      const res = await _deleteFeedbackHandler({
        toDelete: bulk ? selectedRecords : [delModal?.id],
      });
      toastSuccess(res.msg);
      await _refetchFeedbacks();
      setDelModal(() => ({ open: false }));
      bulk && setSelectedRecords([]);
    } catch (error) {
      toastError(error);
    }
  }, [
    delModal,
    toastError,
    setDelModal,
    toastSuccess,
    selectedRecords,
    _refetchFeedbacks,
    setSelectedRecords,
    _deleteFeedbackHandler,
  ]);

  const csvData = useMemo(() => {
    return _feedbacks?.feedBacks?.length > 0
      ? _feedbacks?.feedBacks?.map((x) => ({
          title: x.title,
          description: x.description,

          attachment: x.attachment,
          reportedAt: formattedDate(x?.reportedAt, 'dd MMM , yy') || '',
        }))
      : [];
  }, [_feedbacks]);

  const copyToClipboard = useCallback(() => {
    const textToWrite = `
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
      rel="stylesheet"
    />
    <script type="module" src="${_widgetConfig?.widgetFound?.widgetLink}">
    </script>`;

    navigator.clipboard.writeText(textToWrite);
  }, [_widgetConfig]);

  const handleClearDebounce = _debounce(() => {
    setSearch('');
  }, 1000);

  const handleFilterChange = _.debounce(({ sortBy = '', sort = '' }) => {
    setSortFilters((pre) => ({
      ...pre,
      sortBy,
      sort,
    }));
  }, 1000);

  const handleSearchDebounce = _debounce((e) => {
    setSearch(e?.target?.value);
  }, 1000);

  const handleSetWidget = useCallback(() => {
    setWidget(true);
  }, [setWidget]);

  const handleOpenTaskModal = useCallback(() => {
    setOpenTaskModal({ open: true });
  }, [setOpenTaskModal]);

  const handleExportNoData = useCallback(() => {
    toastError({ msg: 'No Data available to export' });
  }, [toastError]);

  const handleDeleteRecords = useCallback(() => {
    if (selectedRecords.length > 0) {
      setDelModal({ open: true, bulk: true });
    } else {
      toastError({ msg: 'Select Test Cases to delete' });
    }
  }, [selectedRecords, setDelModal, toastError]);

  const handleCloseDelModal = useCallback(() => {
    setDelModal({ open: false });
  }, [setDelModal]);

  return (
    <>
      <div
        className={style.mainWrapper}
        style={{
          height: !noHeader ? '100vh' : '92vh',
        }}
      >
        <MainWrapper title={'FeedBacks'} noHeader={noHeader}>
          {!widget ? (
            <>
              <div className={style.main}>
                <Permissions
                  allowedRoles={['Admin', 'Project Manager', 'QA']}
                  currentRole={userDetails?.role}
                  locked={userDetails?.activePlan === 'Free'}
                >
                  <div className={style.mainClassContainer}>
                    <TextField
                      searchField
                      searchIcon={true}
                      clearIcon={clearIcon}
                      startIconClass={style.startIcon}
                      placeholder="Type and search..."
                      onClear={handleClearDebounce}
                      onChange={handleSearchDebounce}
                    />
                  </div>
                </Permissions>
                <div className={style.widgetBtnDiv}>
                  <Button text="Feedback Widget" handleClick={handleSetWidget} btnClass={style.btnMain} />
                  {_widgetConfig?.widgetFound?._id && (
                    <Button text="Copy Code </>" btnClass={style.btn} handleClick={copyToClipboard} />
                  )}
                  {csvData.length > 0 ? (
                    <Permissions
                      allowedRoles={['Admin', 'Project Manager', 'QA', 'Developer']}
                      currentRole={userDetails?.role}
                      locked={userDetails?.activePlan === 'Free'}
                    >
                      <CSVLink data={csvData} filename={`Feedback Export File ${new Date()}`}>
                        <Button text="Export" startCompo={<Icon name={'ExportIcon'} />} btnClass={style.btn} />
                      </CSVLink>
                    </Permissions>
                  ) : (
                    <Permissions
                      allowedRoles={['Admin', 'Project Manager', 'QA', 'Developer']}
                      currentRole={userDetails?.role}
                      locked={userDetails?.activePlan === 'Free'}
                    >
                      <Button
                        text="Export"
                        startCompo={<Icon name={'ExportIcon'} />}
                        btnClass={style.btn}
                        handleClick={handleExportNoData}
                      />
                    </Permissions>
                  )}
                </div>
              </div>

              {_isLoading || _isFetching ? (
                <Loader />
              ) : (
                <>
                  {_feedbacks?.feedBacks?.length ? (
                    <div>
                      <div className={style.mainClass}>
                        <h6>
                          FeedBacks ({selectedRecords.length ? `${selectedRecords.length}/` : ''}
                          {_feedbacks?.feedBacks?.length})
                        </h6>
                        <div className={style.flex}>
                          {selectedRecords.length > 0 && projectId && (
                            <div onClick={handleOpenTaskModal} className={style.addTask}>
                              <Icon name={'PlusIcon'} />
                              <span>Task</span>
                            </div>
                          )}
                          {selectedRecords.length > 0 && (
                            <Permissions
                              allowedRoles={['Admin', 'Project Manager', 'QA']}
                              currentRole={userDetails?.role}
                            >
                              <div
                                className={style.change}
                                src={deleteBtn}
                                id={'deleteButton'}
                                alt=""
                                onClick={handleDeleteRecords}
                              >
                                <div className={style.imgDel}>
                                  <Icon name={'DelIcon'} />
                                </div>
                                <div className={style.tooltip}>
                                  <p>Delete</p>
                                </div>
                              </div>
                            </Permissions>
                          )}
                        </div>
                      </div>
                      <div className={style.tableWidth}>
                        <GenericTable
                          ref={containerRef}
                          columns={columnsData({
                            feedbacks: _feedbacks?.feedBacks,
                            setSelectedRecords,
                            selectedRecords,
                            delModal,
                            setDelModal,
                            setReportBug,
                            setEditRecord,
                            searchedText: search,
                            role: userDetails?.role,
                            activePlan: userDetails?.role,
                          })}
                          dataSource={_feedbacks?.feedBacks || []}
                          height={noHeader ? 'calc(100vh - 240px)' : 'calc(100vh - 267px)'}
                          selectable={true}
                          classes={{
                            test: styles.test,
                            table: styles.table,
                            thead: styles.thead,
                            th: styles.th,
                            containerClass: styles.checkboxContainer,
                            tableBody: styles.tableRow,
                          }}
                          filters={sortFilters}
                          onClickHeader={handleFilterChange}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className={style.nodataImg}>
                      <img src={noData} alt="" />
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <WidgetConfig
              refetch={refetch}
              _widgetConfig={_widgetConfig}
              setWidget={setWidget}
              projectId={projectId}
              copyToClipboard={copyToClipboard}
            />
          )}
        </MainWrapper>
      </div>

      {reportBug && (
        <ReportBug
          noHeader={noHeader}
          options={data}
          editRecord={editRecord}
          setReportBug={setReportBug}
          setEditRecord={setEditRecord}
        />
      )}

      <DeleteModal
        openDelModal={!!delModal.open}
        setOpenDelModal={handleCloseDelModal}
        name="Feedback"
        clickHandler={onDelete}
        cancelText="No, Keep this Feedback"
        isLoading={_isDeleteLoading}
      />
    </>
  );
};

export default FeedBack;
