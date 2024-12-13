import { useCallback, useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { useAppContext } from 'context/app-context';

import ReportBugModal from 'components/report-bug-modal';
import Loader from 'components/loader';
import Tags from 'components/tags';
import TabsMobile from 'components/tabs-mobile';

import { useToaster } from 'hooks/use-toaster';

import { useGetTestCaseById, useUpdateStatusTestCase } from 'api/v1/test-cases/test-cases';
import { useUpdateTestCaseOfRun } from 'api/v1/test-runs/test-runs';

import noData from 'assets/No-record.svg';

import style from './drawer.module.scss';
import Detail from './detail';
import More from './more';
import History from './history';
import Activities from './activities';
import StatusUpdateModel from '../../../test-cases/status-update-model';
import StartTestingModal from '../start-reporting-bugs';
import Icon from '../../../../components/icon/themed-icon';

const ViewTestCase = ({
  setDrawerOpen,
  setViewTestCaseIndex,
  viewTestCaseIndex,
  allData,
  noHeader,
  refetchAll,
  testRunStatus = false,
  testRunId,
  accessParticular,
  evidenceRequired,
  setEditRecord,
  editRecord,
  projectId = '',
}) => {
  const { setValue, setError } = useForm();

  const [bugModalData, setBugModalData] = useState(false);
  const [modalDismissed, setModalDismissed] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [statusUpdateTestCaseId, setStatusUpdateTestCaseId] = useState('');
  const [isReportBug, setIsReportBug] = useState({ open: false });

  const { toastError, toastSuccess } = useToaster();

  const {
    data: _testCaseData = {},
    refetch,
    isLoading,
  } = useGetTestCaseById(allData?.[viewTestCaseIndex]?.testCaseId?._id);

  const { testCase = {} } = _testCaseData;

  const { userDetails } = useAppContext();

  useEffect(() => {
    if (testCase && !_.isEmpty(testCase)) {
      setValue('testStatus', testCase?.status);
    }
  }, [setValue, testCase]);

  const { mutateAsync: _updateStatusTestCase, isLoading: _isStatusUpdating } = useUpdateStatusTestCase();
  const { mutateAsync: _updateStatusTestCaseOfRun } = useUpdateTestCaseOfRun();

  const statusUpdateHandler = useCallback(
    async (data) => {
      const body = {
        ...data,
        testEvidence: data?.testEvidence?.base64,
        source: 'Test Run',
        testRunId: testRunId,
      };

      try {
        const res = await _updateStatusTestCase({ id: statusUpdateTestCaseId, body });

        await _updateStatusTestCaseOfRun({
          id: testRunId,
          body: {
            testCaseId: statusUpdateTestCaseId,
            testCaseStatus: data?.testStatus,
          },
        });

        toastSuccess(res?.msg);
        setStatusUpdateTestCaseId('');
        refetch();
        refetchAll();

        setTimeout(() => {
          setViewTestCaseIndex((pre) => (pre < allData?.length - 1 ? pre + 1 : pre));
          setModalDismissed(false);
        }, 1000);
      } catch (error) {
        console.error(error);
      }
    },
    [
      _updateStatusTestCase,
      _updateStatusTestCaseOfRun,
      allData?.length,
      refetch,
      refetchAll,
      setViewTestCaseIndex,
      statusUpdateTestCaseId,
      testRunId,
      toastSuccess,
    ],
  );

  const onStatusUpdate = useCallback(
    async (data, setError) => {
      if (data?.testStatus === 'Failed' && !modalDismissed) {
        setBugModalData(data);
      } else {
        try {
          await statusUpdateHandler(data);
        } catch (error) {
          toastError(error, setError);
        }
      }
    },
    [modalDismissed, statusUpdateHandler, toastError],
  );

  const bugModelCloseHandler = useCallback(async () => {
    if (!bugModalData) return;

    setBugModalData(false);

    try {
      await statusUpdateHandler(bugModalData);
    } catch (error) {
      toastError(error, setError);
    }
  }, [bugModalData, setBugModalData, statusUpdateHandler, toastError, setError]);

  const handlePrev = useCallback(() => {
    setViewTestCaseIndex((pre) => (pre > 0 ? pre - 1 : pre));
  }, [setViewTestCaseIndex]);

  const handleNext = useCallback(() => {
    setViewTestCaseIndex((pre) => (pre < allData?.length - 1 ? pre + 1 : pre));
  }, [allData?.length, setViewTestCaseIndex]);

  const handleClose = useCallback(() => {
    setDrawerOpen(false);
    setViewTestCaseIndex(null);
  }, [setDrawerOpen, setViewTestCaseIndex]);

  const handleOpenDelModalClose = useCallback(() => {
    setBugModalData('');
  }, []);

  const freePlanHandler = useCallback(() => {
    bugModelCloseHandler(bugModalData);
  }, [bugModalData, bugModelCloseHandler]);

  const paidPlanHandler = useCallback(() => {
    setIsReportBug({ open: true });
    setEditRecord({
      id: statusUpdateTestCaseId,
      type: 'testCases',
      refetch: () => bugModelCloseHandler(bugModalData),
    });
    setModalDismissed(true);
  }, [bugModalData, bugModelCloseHandler, setIsReportBug, setEditRecord, setModalDismissed, statusUpdateTestCaseId]);

  const handleStatusClick = useCallback(
    (e) => {
      if (
        userDetails?.role !== 'Developer' ||
        accessParticular ||
        userDetails?.role === 'Admin' ||
        userDetails?.role === 'Project Manager'
      ) {
        e.preventDefault();
        setStatusUpdateTestCaseId(testCase._id);
      }
    },
    [userDetails, accessParticular, testCase._id],
  );

  const handleReportBugClose = useCallback(() => {
    setIsReportBug({ open: false });
  }, [setIsReportBug]);

  const ModelCloseHandler = useCallback(async () => {
    await bugModelCloseHandler(bugModalData);
  }, [bugModalData, bugModelCloseHandler]);

  return (
    <>
      <div className={style.main}>
        <div className={style.header}>
          <div className={style.headerInner}>
            <div id="prevButton" className={style.hover} onClick={handlePrev}>
              {/*TODO: <ArrowLeft type={viewTestCaseIndex === 0} /> */}
              <Icon name={'ArrowLeft'} />
              <div className={style.tooltip}>
                <p>Back</p>
              </div>
            </div>
            <span className={style.headerText}>{testCase?.testCaseId}</span>
            <div id="nextButton" className={style.hover} onClick={handleNext}>
              {}
              <Icon name={'ArrowRight24'} />
              <div className={style.tooltip}>
                <p>Next</p>
              </div>
            </div>
          </div>
          <div className={style.headerInner}>
            {testRunStatus && (
              <p className={`${allData?.[viewTestCaseIndex]?.tested ? style.tag2 : style.tag}`}>
                {allData?.[viewTestCaseIndex]?.tested ? 'Tested' : 'Not Tested'}
              </p>
            )}
            <div onClick={handleClose} className={style.hover1}>
              <Icon name={'CrossIcon'} />
              <div className={style.tooltip}>
                <p>Cross</p>
              </div>
            </div>
          </div>
        </div>

        {testCase?._id ? (
          <div
            className={style.body}
            style={{
              height: noHeader ? '78vh' : '90vh',
            }}
          >
            <div className={style.contentHeader}>
              <div className={style.innerLeft}>
                <span>Project</span>
              </div>
              <div className={style.innerRight}>
                <span>{testCase?.projectId?.name}</span>
              </div>
            </div>
            <div className={style.contentHeader}>
              <div className={style.innerLeft}>
                <span>Milestone</span>
              </div>
              <div className={style.innerRight}>
                <span>{testCase?.milestoneId?.name}</span>
              </div>
            </div>
            <div className={style.contentHeader}>
              <div className={style.innerLeft}>
                <span>Feature</span>
              </div>
              <div className={style.innerRight}>
                <span>{testCase?.featureId?.name}</span>
              </div>
            </div>
            <div className={style.contentHeader}>
              <div className={style.innerLeft}>
                <span>Test Type</span>
              </div>
              <div className={style.innerRight}>
                <span>{testCase?.testType}</span>
              </div>
            </div>
            <div className={style.contentHeader}>
              <div className={style.innerLeft}>
                <span>Weightage</span>
              </div>
              <div className={style.innerRight}>
                <span>{testCase?.weightage}</span>
              </div>
            </div>
            <div className={style.contentHeader}>
              <div className={style.innerLeft}>
                <span>Related Task ID</span>
              </div>
              <div className={style.innerRight}>
                <span>{testCase?.relatedTicketId}</span>
              </div>
            </div>
            <div className={style.contentHeader}>
              <div className={style.innerLeft}>
                <span>State</span>
              </div>
              <div className={`${style.innerRight2} ${style.innerRight}`}>
                <Tags
                  text={testCase?.state}
                  backClass={style.tagStyle}
                  colorScheme={{
                    Active: '#34C369',
                    Obsolete: '#8B909A',
                  }}
                />
              </div>
            </div>
            <div className={style.contentHeader}>
              <div className={style.innerLeft}>
                <span>Status</span>
              </div>
              <div className={style.innerRight}>
                {testCase?.status && !statusUpdateTestCaseId && (
                  <span onClick={handleStatusClick}>{testCase?.status}</span>
                )}
              </div>
            </div>

            <div className={style.tabsDiv}>
              <TabsMobile drawerMode pages={pages(testCase)} activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          </div>
        ) : isLoading ? (
          <div className={style.noData}>
            <Loader />
          </div>
        ) : (
          <div className={style.noData}>
            <img src={noData} alt="noDataIcon" />
          </div>
        )}

        {statusUpdateTestCaseId && (
          <StatusUpdateModel
            statusUpdateTestCaseId={statusUpdateTestCaseId}
            setStatusUpdateTestCaseId={setStatusUpdateTestCaseId}
            evidenceRequired={evidenceRequired}
            handleClick={onStatusUpdate}
            isLoading={_isStatusUpdating}
          />
        )}
        {bugModalData && (
          <ReportBugModal
            openDelModal={bugModalData}
            setOpenDelModal={handleOpenDelModalClose}
            noBackground
            closeHandler={ModelCloseHandler}
            setModalDismissed={setModalDismissed}
            clickHandler={userDetails?.activePlan === 'Free' ? freePlanHandler : paidPlanHandler}
            locked={userDetails?.activePlan === 'Free'}
          />
        )}
        {isReportBug?.open && (
          <StartTestingModal
            open={isReportBug.open}
            handleClose={handleReportBugClose}
            refetch={refetchAll}
            projectId={projectId}
            editRecord={editRecord}
            relatedRunId={testRunId}
            setEditRecord={setEditRecord}
          />
        )}
      </div>
    </>
  );
};

ViewTestCase.propTypes = {
  setDrawerOpen: PropTypes.func.isRequired,
  setViewTestCaseIndex: PropTypes.func.isRequired,
  viewTestCaseIndex: PropTypes.number.isRequired,
  allData: PropTypes.any.isRequired,
  noHeader: PropTypes.bool.isRequired,
  setReportBug: PropTypes.func.isRequired,
  setEditRecord: PropTypes.func.isRequired,
  refetchAll: PropTypes.func.isRequired,
  testRunStatus: PropTypes.any,
  testRunId: PropTypes.string,
  accessParticular: PropTypes.any.isRequired,
};
export default ViewTestCase;

const pages = (data) => [
  {
    tabTitle: 'Detail',
    content: <Detail data={data} />,
  },
  {
    tabTitle: 'History',
    content: <History data={data} />,
  },
  {
    tabTitle: 'Activities',
    content: <Activities noHeader testCaseId={data?._id} />,
  },
  {
    tabTitle: 'More',
    content: <More data={data} />,
  },
];
