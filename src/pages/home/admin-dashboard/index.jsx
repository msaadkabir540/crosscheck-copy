import React, { useState, useEffect, useCallback } from 'react';

import { useForm } from 'react-hook-form';
import { format, isPast, parseISO } from 'date-fns';
import { isEqual } from 'lodash';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Permissions from 'components/permissions';
import ValueBox from 'components/value-box';
import GenericModal from 'components/generic-modal';
import Icon from 'components/icon/themed-icon';
import SkeletonCard from 'components/skeleton-loaders/card-skeleton';

import { useToaster } from 'hooks/use-toaster';

import { useGetTestRunsByFilter } from 'api/v1/test-runs/test-runs';
import { useGetOverallAnalytics } from 'api/v1/dashboard/dashboard';
import { useGetUserById, useGetMyWorkspaces } from 'api/v1/settings/user-management';

import { calculateDaysPassed, formattedDate } from 'utils/date-handler';

import DevReport from './dev-report';
import Report from './report';
import Upcoming from './upcoming';
import style from './home.module.scss';

const AdminDashboard = ({ userDetails, viewAs }) => {
  const [searchParams] = useSearchParams();

  const initialLogin = searchParams.get('initialLogin') || false;
  const { toastError } = useToaster();
  const navigate = useNavigate();
  const { control, watch } = useForm();
  const [testRuns, setTestRuns] = useState({});
  const [allAnalytics, setAllAnalytics] = useState({});
  const [popUp, setPopUp] = useState(true);

  const queryString = window.location.search;
  const queryParams = queryString.substr(1).split('?');

  let OTP = null;

  queryParams.forEach((param) => {
    const [key, value] = param.split('=');

    if (key === 'otp') {
      OTP = value;
    }
  });

  const { mutateAsync: _getAllTestRuns, isLoading: _isLoading } = useGetTestRunsByFilter();
  const { data: _userDataById, isLoading: _isLoadingUser } = useGetUserById(userDetails?.id || userDetails?._id);
  const { data: workspacesData } = useGetMyWorkspaces(_userDataById?.user?.signUpType);

  const matchingWorkspace = workspacesData?.workspaces?.find(
    (workspace) => workspace?.workSpaceId === userDetails?.lastAccessedWorkspace,
  );

  const plan = matchingWorkspace?.plan;

  useEffect(() => {
    if (!OTP && !userDetails?.lastAccessedWorkspace) {
      const url = `/on-boarding/${userDetails?.email}?name=${userDetails?.name}`;
      window.location.href = url;
    }
  }, [userDetails, OTP]);

  const fetchTestRuns = useCallback(
    async (filters) => {
      try {
        const response = await _getAllTestRuns(filters);
        setTestRuns((pre) => ({
          ...(pre || {}),
          count: response?.count || 0,
          testruns: [...(pre?.testruns || []), ...(response?.testruns || [])],
        }));
      } catch (error) {
        toastError(error);
      }
    },
    [_getAllTestRuns, toastError],
  );

  useEffect(() => {
    fetchTestRuns({
      search: '',
      status: [],
      assignedTo: [],
      projectId: [],
      createdBy: [],
      overdue: true,
      page: 0,
    });
  }, [fetchTestRuns]);

  const { isLoading: _QaAnalyticsLoading } = useGetOverallAnalytics({
    ...(viewAs && { viewAs: viewAs }),
    onSuccess: (data) => {
      setAllAnalytics(data?.data);
    },
  });

  const handleGoToBilling = useCallback(() => {
    navigate('/billing');
  }, [navigate]);

  const handleGoToCompare = useCallback(() => {
    window.location.href = 'https://www.crosscheck.cloud/pricing';
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) {
      return 'Invalid date';
    }

    const date = new Date(dateString);

    if (isNaN(date)) {
      return 'Invalid date';
    }

    const day = date.getDate();
    const month = format(date, 'MMM');
    const year = date.getFullYear();

    return `${day}, ${month} ${year}`;
  };

  const updateUrl = useCallback(() => {
    if (!popUp) {
      window.history.replaceState(null, '', import.meta.env.VITE_REACT_APP_BASE_URL);
    }
  }, [popUp]);

  useEffect(() => {
    updateUrl();
  }, [popUp, updateUrl]);

  return (
    <>
      <div className={style.wrapper}>
        <div className={style.wrapperUpper}>
          <div className={style.left}>
            {_isLoading || _QaAnalyticsLoading ? (
              <SkeletonCard
                count={viewAs ? 4 : 5}
                wholeBoxClass={style.welcomeDivLoader}
                buttonClassName={style.welcomeDivLoaderBtn}
                containerClass={style.welcomeLoaderContainer}
              />
            ) : (
              <div className={style.welcomeDiv}>
                <ValueBox
                  link={'/projects'}
                  className={style.boxWidth}
                  heading={'Projects'}
                  value={allAnalytics?.projects}
                />
                <ValueBox
                  link={'/test-cases'}
                  className={style.boxWidth}
                  heading={'Test Cases'}
                  value={allAnalytics?.testCases}
                />
                <ValueBox link={'/qa-testing'} className={style.boxWidth} heading={'Bugs'} value={allAnalytics?.bugs} />
                <ValueBox
                  link={'/test-run'}
                  className={style.boxWidth}
                  heading={'Test Runs'}
                  value={allAnalytics?.testRuns}
                />
                {userDetails?.role === 'Admin' && !viewAs && (
                  <ValueBox
                    link={'/user-management'}
                    className={style.boxWidth}
                    heading={'Users'}
                    value={`${allAnalytics?.users ? allAnalytics?.users : '-'}/${
                      allAnalytics?.seatsAvailable ? allAnalytics?.seatsAvailable : '-'
                    }`}
                  />
                )}
              </div>
            )}

            {_isLoading || _QaAnalyticsLoading ? (
              <div className={style.bugsSectionLoader}>
                <SkeletonCard
                  count={1}
                  wholeBoxClass={style.welcomeDivLoader}
                  buttonClassName={style.welcomeDivLoaderBtn}
                  containerClass={style.welcomeLoaderContainer}
                />
              </div>
            ) : (
              <div className={style.bugsSection}>
                <div className={style.bugHeader}>
                  <span>Bugs</span>
                </div>
                <div className={style.lowerSection}>
                  <div className={style.innerBug}>
                    <div className={style.status}>Opened</div>
                    <span className={style.count}>
                      {allAnalytics?.BugsData?.open ? allAnalytics?.BugsData?.open : '-'}
                    </span>
                  </div>
                  <div className={style.innerBug}>
                    <div className={style.status}>Reproducible</div>
                    <span className={style.count}>
                      {allAnalytics?.BugsData?.reproducible ? allAnalytics?.BugsData?.reproducible : '-'}
                    </span>
                  </div>
                  <div className={style.innerBug}>
                    <div className={style.status}>Blocked</div>
                    <span className={style.count}>
                      {allAnalytics?.BugsData?.blocked ? allAnalytics?.BugsData?.blocked : '-'}
                    </span>
                  </div>
                  <div className={style.innerBug}>
                    <div className={style.status}>Need to Discuss</div>
                    <span className={style.count}>
                      {allAnalytics?.BugsData?.needToDiscuss ? allAnalytics?.BugsData?.needToDiscuss : '-'}
                    </span>
                  </div>
                  <div className={style.innerBug}>
                    <div className={style.status}>Closed</div>
                    <span className={style.count}>
                      {allAnalytics?.BugsData?.closed ? allAnalytics?.BugsData?.closed : '-'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {_isLoading || _QaAnalyticsLoading ? (
              <div className={style.bugsSectionLoader}>
                <SkeletonCard
                  count={1}
                  wholeBoxClass={style.welcomeDivLoader}
                  buttonClassName={style.welcomeDivLoaderBtn}
                  containerClass={style.welcomeLoaderContainer}
                />
              </div>
            ) : (
              <div className={style.midSection}>
                <div className={style.testCaseSection}>
                  <div className={style.bugHeader}>
                    <span>Test Cases</span>
                  </div>
                  <div className={style.lowerSection}>
                    <div className={style.innerBug}>
                      <div className={style.status}>Failed</div>
                      <span className={style.count}>
                        {allAnalytics?.testCasesData?.failed ? allAnalytics?.testCasesData?.failed : '-'}
                      </span>
                    </div>
                    <div className={style.innerBug}>
                      <div className={style.status}>Blocked</div>
                      <span className={style.count}>
                        {allAnalytics?.testCasesData?.blocked ? allAnalytics?.testCasesData?.blocked : '-'}
                      </span>
                    </div>
                    <div className={style.innerBug}>
                      <div className={style.status}>Not Tested</div>
                      <span className={style.count}>
                        {allAnalytics?.testCasesData?.notTested ? allAnalytics?.testCasesData?.notTested : '-'}
                      </span>
                    </div>

                    <div className={style.innerBug}>
                      <div className={style.status}>Passed</div>
                      <span className={style.count}>
                        {allAnalytics?.testCasesData?.passed ? allAnalytics?.testCasesData?.passed : '-'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={style.testRunsSection}>
                  <div className={style.bugHeader}>
                    <span>Test Runs</span>
                  </div>
                  <div className={style.lowerSection}>
                    <div className={style.innerBug}>
                      <div className={style.status}>Open</div>
                      <span className={style.count}>
                        {allAnalytics?.testRunsData?.open ? allAnalytics?.testRunsData?.open : '-'}
                      </span>
                    </div>
                    <div className={style.innerBug}>
                      <div className={style.status}>Closed</div>
                      <span className={style.count}>
                        {allAnalytics?.testRunsData?.closed ? allAnalytics?.testRunsData?.closed : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={style.right}>
            {_QaAnalyticsLoading || _isLoading ? (
              <SkeletonCard
                count={1}
                wholeBoxClass={style.welcomeDivLoader}
                buttonClassName={style.welcomeDivLoaderBtn}
                containerClass={style.rightLoaderContainer}
              />
            ) : (
              <div className={style.upcomingDiv}>
                <div className={style.upcomingHeader}>
                  <span>Overdue Test Runs </span>
                  <Icon name={'MoreInvertIcon'} height={24} width={24} iconClass={style.iconDark} />
                </div>
                <div className={style.upcomingInner}>
                  <Permissions
                    allowedRoles={['Admin', 'Project Manager', 'QA', 'Developer']}
                    currentRole={userDetails?.role}
                    // NOTE: accessParticular={userDetails?.current !== 'Free'}
                  >
                    {testRuns.testruns?.map((item) => (
                      <Upcoming
                        key={item?.runId}
                        id={item?._id}
                        testedCount={item?.testedCount}
                        testCases={item?.testCases}
                        notTestedCount={item?.notTestedCount}
                        title={item?.runId}
                        subTitle={item?.name}
                        date={formattedDate(new Date(item?.dueDate), 'dd MMM, yyyy')}
                        daysPassed={calculateDaysPassed(new Date(item?.dueDate))}
                        overDue={isPast(parseISO(item.dueDate))}
                        img={item?.assignee?.profilePicture}
                        name={item?.assignee?.name}
                        data={item}
                      />
                    ))}
                  </Permissions>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={style.wrapperLower}>
          <div className={style.reportSection}>
            {_isLoading || _QaAnalyticsLoading ? (
              <SkeletonCard
                count={1}
                wholeBoxClass={style.welcomeDivLoader}
                buttonClassName={style.welcomeDivLoaderBtn}
                containerClass={style.bottomLoaderContainer}
              />
            ) : (
              <Permissions
                allowedRoles={['Admin', 'Project Manager', 'QA']}
                currentRole={userDetails?.role}
                locked={userDetails?.activePlan === 'Free'}
              >
                <Report control={control} watch={watch} userDetails={userDetails} />
              </Permissions>
            )}
          </div>
          <div className={style.reportSection}>
            {_isLoading || _QaAnalyticsLoading ? (
              <SkeletonCard
                count={1}
                wholeBoxClass={style.welcomeDivLoader}
                buttonClassName={style.welcomeDivLoaderBtn}
                containerClass={style.bottomLoaderContainer}
              />
            ) : (
              <Permissions
                allowedRoles={['Admin', 'Project Manager', 'QA']}
                currentRole={userDetails?.role}
                locked={userDetails?.activePlan === 'Free'}
              >
                <DevReport control={control} watch={watch} userDetails={userDetails} />
              </Permissions>
            )}
          </div>
        </div>
      </div>

      {!_isLoadingUser && plan && initialLogin && (
        <GenericModal
          setOpenModal={setPopUp}
          openModal={popUp}
          mainIcon={<Icon name={'fireworks'} iconClass={style.iconClass} />}
          modalTitle={
            plan === 'Premium' && matchingWorkspace?.initialPlan
              ? `Welcome to your 30-Day Premium Free Trial!`
              : `Welcome to your 30-Day ${plan === 'No Plan' ? _userDataById?.user?.lastAccessedWorkspacePlan : plan} Free Trial!`
          }
          modalDynamicSubtitle={
            plan !== 'Free' &&
            !matchingWorkspace?.initialPlan &&
            `You now have access to all ${plan === 'No Plan' ? _userDataById?.user?.lastAccessedWorkspacePlan : plan} Plan features for 30 days. Make the most of this period and explore everything the ${plan === 'No Plan' ? _userDataById?.user?.lastAccessedWorkspacePlan : plan} Plan has to offer!`
          }
          trialEnd={formatDate(matchingWorkspace?.trialEnd)}
          cancelText={'Compare Plans'}
          saveText={'Buy Now'}
          modalClass={style.modalClass}
          hideButtons={plan !== 'Free' && !matchingWorkspace?.initialPlan}
          btnDivClass={style.btnDivClass}
          backClass={style.zindexClass}
          discardBtnClass={style.discardBtnClass}
          onLeftClick={handleGoToCompare}
          clickHandler={handleGoToBilling}
          iconDivClass={style.iconDivClass}
        />
      )}
    </>
  );
};

export default React.memo(AdminDashboard, (prevProps, nextProps) => isEqual(prevProps, nextProps));
