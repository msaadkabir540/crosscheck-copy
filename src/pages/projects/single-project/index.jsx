import { useEffect, useState, useMemo } from 'react';

import { useParams, useSearchParams } from 'react-router-dom';

import { useAppContext } from 'context/app-context';

// NOTE: component
import TestCases from 'pages/test-cases';
import QaTesting from 'pages/qa-testing';
import TestRuns from 'pages/test-runs';
import TestRunSingle from 'pages/test-runs/single-test-run';
import Activities from 'pages/activities';

import Tabs from 'components/tabs/tabs-second';
import MainWrapper from 'components/layout/main-wrapper';
import TabsMobile from 'components/tabs-mobile/tabs-second-mobile';

import { useDimensions } from 'hooks/use-dimensions';

import { useGetProjectById } from 'api/v1/projects/projects';

import { formattedDate } from 'utils/date-handler';

import More from './more';
import Milestone from './milestones';
import FilesSection from './files';
import Tasks from './tasks';
import Dashboard from './dashboard';
import 'split-pane-react/esm/themes/default.css';
import style from './single-project.module.scss';
import FeedBack from './feedback';

const SingleProject = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { userDetails } = useAppContext();
  const { data: _projectData } = useGetProjectById(id);
  const [activeTab, setActiveTab] = useState(0);

  //TODO: Discard Scenario

  const active = searchParams.get('active');
  const testCase = searchParams.get('testCase');
  const runId = searchParams.get('runId');
  const testRun = searchParams.get('testRun');
  const bug = searchParams.get('bugs');

  const paramFilters = useMemo(() => {
    const result = {};

    for (const paramName of filterNames) {
      if (['reportedAt', 'closedDate', 'reTestDate', 'createdAt', 'dueDate', 'lastTestedAt'].includes(paramName)) {
        const start = searchParams?.get(`${paramName}.start`);
        const end = searchParams?.get(`${paramName}.end`);

        if (start !== null || end !== null) {
          result[paramName] = { start: start || null, end: end || null };
        }
      } else {
        const paramValue = searchParams?.getAll(paramName);

        if (paramValue && (Array.isArray(paramValue) ? paramValue.length : Object.keys(paramValue).length)) {
          result[paramName] = paramValue;
        }
      }
    }

    return {
      ...result,
      reportedAt: result.reportedAt || { start: null, end: null },
      createdAt: result.createdAt || { start: null, end: null },
      closedDate: result.closedDate || { start: null, end: null },
      reTestDate: result.reTestDate || { start: null, end: null },
      lastTestedAt: result.lastTestedAt || { start: null, end: null },
      dueDate: result.dueDate || { start: null, end: null },
      taskId: '',
    };
  }, [searchParams, filterNames]);

  useEffect(() => {
    if (active) {
      setActiveTab(+active);
    }
  }, []);

  useEffect(() => {
    if (activeTab >= 0) {
      const nonEmptyFilters = Object.entries(paramFilters).reduce((acc, [key, value]) => {
        if (
          value !== null &&
          value !== undefined &&
          value !== '' &&
          !(Array.isArray(value) && value.length === 0) &&
          !(typeof value === 'object' && Object.keys(value).length === 0) &&
          !(typeof value === 'object' && value.start === null && value.end === null)
        ) {
          acc[key] = value;
        }

        return acc;
      }, {});

      setSearchParams({
        ...nonEmptyFilters,
        active: active || 0,
      });
    }
  }, [activeTab]);

  //TODO: Discard Scenario

  const pages = useMemo(() => {
    return [
      {
        id: 0,
        cypryssAttr: 'project-header-dashboard',
        tabTitle: 'Dashboard',
        content: activeTab === 0 && <Dashboard />,
      },
      {
        id: 1,
        cypryssAttr: 'project-header-testcases',
        tabTitle: 'Test Cases',
        content: <TestCases noHeader projectId={id} />,
      },
      {
        id: 2,
        cypryssAttr: 'project-header-bugs',
        tabTitle: 'Bugs',
        content: (
          <QaTesting
            noHeader
            projectId={id}
            //TODO: Discard Scenario
          />
        ),
      },

      {
        id: 3,
        cypryssAttr: 'project-header-testruns',
        tabTitle: 'Test Runs',
        content:
          activeTab === 3 &&
          (testRun !== 'view' ? (
            <TestRuns noHeader projectId={id} />
          ) : (
            <TestRunSingle noHeader projectId={id} runId={runId} />
          )),
      },
      {
        id: 4,
        cypryssAttr: 'project-header-milestone',
        tabTitle: 'Milestone',
        content: activeTab === 4 && <Milestone />,
      },
      {
        id: 5,
        cypryssAttr: 'project-header-tasks',
        tabTitle: 'Tasks',
        content: activeTab === 5 && <Tasks noHeader projectId={id} />,
      },
      {
        id: 6,
        cypryssAttr: 'project-header-feedback',
        tabTitle: 'Feedback',
        content: activeTab === 6 && <FeedBack noHeader projectId={id} />,
      },
      userDetails?.activePlan !== 'Free' && {
        id: 7,
        cypryssAttr: 'project-header-activities',
        tabTitle: 'Activities',
        content: activeTab === 7 && <Activities noHeader projectId={id} />,
      },
      {
        id: 8,
        cypryssAttr: 'project-header-files',
        tabTitle: 'Files',
        content: activeTab === 8 && <FilesSection noHeader projectId={id} />,
      },
      {
        id: 9,
        cypryssAttr: 'project-header-more',
        tabTitle: 'Settings',
        content: activeTab === 9 && <More />,
      },
    ];
  }, [id, testRun, bug, testCase, activeTab]);

  const { width } = useDimensions();

  return (
    <>
      <MainWrapper
        title={_projectData?.name}
        barIcon
        activeTab={active}
        date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}
        searchField={
          (pages?.find((x) => x.id === activeTab)?.tabTitle === 'Test Cases' ||
            pages?.find((x) => x.id === activeTab)?.tabTitle === 'Test Runs' ||
            pages?.find((x) => x.id === activeTab)?.tabTitle === 'Bugs' ||
            pages?.find((x) => x.id === activeTab)?.tabTitle === 'Tasks' ||
            pages?.find((x) => x.id === activeTab)?.tabTitle === 'Feedback') &&
          window.innerWidth <= 768
            ? true
            : false
        }
      >
        {width >= 550 ? (
          <div className={style.mainDiv}>
            <Tabs
              pages={pages?.filter((x) => x.tabTitle)}
              activeTab={activeTab}
              setActiveTab={(e) => {
                if (pages[e].tabTitle !== 'Bugs') {
                  //TODO: Discard Scenario
                  setActiveTab(e);
                  setSearchParams({
                    active: e,
                  });
                } else {
                  setActiveTab(e);
                  setSearchParams({
                    active: e,
                  });
                }
              }}
            />
          </div>
        ) : (
          <div className={style.mainDivMobile}>
            <TabsMobile
              pages={pages?.filter((x) => x.tabTitle)}
              activeTab={activeTab}
              setActiveTab={(e) => {
                if (pages[e].tabTitle !== 'Bugs') {
                  //TODO: Discard Scenario
                  setActiveTab(e);
                } else {
                  setActiveTab(e);
                }
              }}
            />
          </div>
        )}
      </MainWrapper>
    </>
  );
};

export default SingleProject;

const filterNames = [
  'projects',
  'search',
  'milestones',
  'features',
  'tags',
  'testedEnvironment',
  'testedDevice',
  'status',
  'reportedBy',
  'bugBy',
  'assignedTo',
  'testingType',
  'bugType',
  'severity',
  'issueType',
  'closedDate',
  'reportedAt',
  'reTestDate',
  'createdAt',
  'lastTestedAt',
  'dueDate',
  'createdBy',
  'projectId',
  'state',
  'lastTestedBy',
  'weightage',
  'testType',
  'applicationType',
  'crossCheckAssignee',
  'taskType',
  'activityBy',
  'activityType',
  'activityAt',
];
