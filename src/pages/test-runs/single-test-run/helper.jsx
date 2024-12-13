import { useCallback, useRef } from 'react';

import { useQuery } from 'react-query';
import _ from 'lodash';

import Tags from 'components/tags';
import UserName from 'components/user-name';
import Checkbox from 'components/checkbox';

import { getAllProjectsMilestonesFeatures } from 'api/v1/projects/projects';
import { getUsers } from 'api/v1/settings/user-management';

import { formattedDate } from 'utils/date-handler';

import style from './test-run.module.scss';

export const columnsData = ({
  setViewTestCase,
  isHoveringName,
  setIsHoveringName,
  setViewTestCaseIndex,
  testRuns,
  handleReminder,
  selectedRecords,
  setStatusUpdateTestCaseId,
  setSelectedRecords,
}) => [
  {
    name: <RenderMainCheck {...{ testRuns, selectedRecords, setSelectedRecords }} />,
    key: 'actions',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '60px', height: '36px' },
    widthInEditMode: { width: '182px' },

    render: ({ row }) => <RenderInitialActions {...{ row, setSelectedRecords, selectedRecords }} />,
  },
  {
    name: 'Test Case ID',
    key: 'testCaseId.testCaseId',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '150px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,
    render: ({ row }) => <RenderTestCaseId {...{ row, setViewTestCaseIndex, setViewTestCase, handleReminder }} />,
  },
  {
    name: 'Project',
    key: 'testCaseId.projectId.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '110px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.testCaseId?.projectId?.name}</p>
      </div>
    ),
  },
  {
    name: 'Milestone',
    key: 'testCaseId.milestoneId.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '110px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.testCaseId?.milestoneId?.name}</p>
      </div>
    ),
  },
  {
    name: 'Feature',
    key: 'testCaseId.featureId.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '110px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.testCaseId?.featureId?.name}</p>
      </div>
    ),
  },
  {
    name: 'Test Type',
    key: 'testCaseId.testType',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.testCaseId?.testType}</p>
      </div>
    ),
  },
  {
    name: 'Test Objective',
    key: 'testCaseId.testObjective.text',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '140px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.testCaseId?.testObjective?.text}</p>
      </div>
    ),
  },
  {
    name: 'Pre Conditions',
    key: 'testCaseId.preConditions.text',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '140px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.testCaseId?.preConditions?.text}</p>
      </div>
    ),
  },
  {
    name: 'Test Steps',
    key: 'testCaseId.testSteps.text',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '150px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.testCaseId?.testSteps?.text}</p>
      </div>
    ),
  },
  {
    name: 'Expected Results',
    key: 'testCaseId.expectedResults.text',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '160px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.testCaseId?.expectedResults?.text}</p>
      </div>
    ),
  },
  {
    name: 'Weightage',
    key: 'testCaseId.weightage',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.testCaseId?.weightage}</p>
      </div>
    ),
  },
  {
    name: 'Status',
    key: 'testCaseId.status',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => <RenderState {...{ row, setStatusUpdateTestCaseId, setViewTestCaseIndex, handleReminder }} />,
  },
  {
    name: 'State',
    key: 'testCaseId.state',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.testCaseId?.state}</p>
      </div>
    ),
  },
  {
    name: 'Test Status',
    key: 'testCaseStatus',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p
          className={`${style.userName} ${style.testedClass}`}
          style={{ background: row?.tested ? '#34C369' : '#F96E6E' }}
        >
          {row?.tested ? 'Tested' : 'Not Tested'}
        </p>
      </div>
    ),
  },
  {
    name: 'Related Ticket ID',
    key: 'testCaseId.relatedTicketId',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '155px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.testCaseId?.relatedTicketId}</p>
      </div>
    ),
  },
  {
    name: 'Last Tested at',
    key: 'testCaseId.lastTestedAt',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '150px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{formattedDate(row?.testCaseId?.lastTestedAt, 'dd-MMM-yy')}</p>
      </div>
    ),
  },
  {
    name: 'Last Tested by',
    key: 'testCaseId.lastTestedBy',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '140px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <RenderTestCaseUserName {...{ setIsHoveringName, row, isHoveringName, user: row?.testCaseId?.lastTestedBy }} />
    ),
  },
  {
    name: 'Created at',
    key: 'testCaseId.createdAt',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '110px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{formattedDate(row?.testCaseId?.createdAt, 'dd-MMM-yy')}</p>
      </div>
    ),
  },
  {
    name: 'Created by',
    key: 'testCaseId.createdBy.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '110px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <RenderTestCaseUserName {...{ setIsHoveringName, row, isHoveringName, user: row?.testCaseId?.createdBy }} />
    ),
  },
];

export function useProjectOptions() {
  return useQuery({
    queryKey: ['testRunOptions'],
    queryFn: async () => {
      const _getProjectsMilestonesFeatures = await getAllProjectsMilestonesFeatures();

      const { users = [] } = await getUsers({
        sortBy: '',
        sort: '',
        search: '',
      });

      const projectOptions =
        _getProjectsMilestonesFeatures?.allProjects?.map((x) => ({
          label: x.name,
          value: x._id,
          checkbox: true,
        })) || [];

      const mileStonesOptions =
        _getProjectsMilestonesFeatures?.allMilestones?.map((x) => ({
          ...x,
          label: x.name,
          value: x._id,
          checkbox: true,
        })) || [];

      const featuresOptions =
        _getProjectsMilestonesFeatures?.allFeatures?.map((x) => ({
          ...x,
          label: x.name,
          value: x._id,
          checkbox: true,
        })) || [];

      const statusOptions = [
        { label: 'Open', value: 'Open', checkbox: true },
        { label: 'Closed', value: 'Closed', checkbox: true },
      ];

      const priorityOptions = [
        { label: 'High', value: 'High', checkbox: true },
        { label: 'Medium', value: 'Medium', checkbox: true },
        { label: 'Low', value: 'Low', checkbox: true },
      ];

      const bugTypeOptions = [
        { label: 'Functionality', value: 'Functionality', checkbox: true },
        { label: 'Performance', value: 'Performance', checkbox: true },
        { label: 'UI', value: 'UI', checkbox: true },
        { label: 'Security', value: 'Security', checkbox: true },
      ];

      const testTypeOptions = [
        {
          label: 'Functional Testing',
          value: 'Functional Testing',
          checkbox: true,
        },
        {
          label: 'Regression Testing',
          value: 'Regression Testing',
          checkbox: true,
        },
        {
          label: 'Integration Testing',
          value: 'Integration Testing',
          checkbox: true,
        },
        {
          label: 'User Acceptance Testing',
          value: 'User Acceptance Testing',
          checkbox: true,
        },
      ];

      const severityOptions = [
        { label: 'Critical', value: 'Critical', checkbox: true },
        { label: 'High', value: 'High', checkbox: true },
        { label: 'Medium', value: 'Medium', checkbox: true },
        { label: 'Low', value: 'Low', checkbox: true },
      ];

      return {
        priorityOptions,
        bugTypeOptions,
        testTypeOptions,
        severityOptions,
        projectOptions,
        mileStonesOptions,
        featuresOptions,
        statusOptions,
        createdByOptions: users
          .filter((x) => x.role !== 'Developer')
          .map((x) => ({
            label: x.name,
            ...(x?.profilePicture && { image: x?.profilePicture }),
            ...(!x?.profilePicture && { imagAlt: _.first(x?.name) }),
            value: x._id,
            checkbox: true,
          })),
        assignedTo: users.map((x) => ({
          label: x.name,
          ...(x?.profilePicture && { image: x?.profilePicture }),
          ...(!x?.profilePicture && { imagAlt: _.first(x?.name) }),
          value: x._id,
          checkbox: true,
        })),
      };
    },
    refetchOnWindowFocus: false,
  });
}

export const columnsBugsData = ({
  setViewTestCase,
  isHoveringName,
  setIsHoveringName,
  setViewTestCaseIndex,
  handleReminder,
  runBugs,
  selectedRecords,
  setSelectedRecords,
  setRetestOpen,
}) => [
  {
    name: <RenderBugsCheck {...{ runBugs, selectedRecords, setSelectedRecords }} />,
    key: 'actions',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '60px', height: '36px' },
    widthInEditMode: { width: '182px' },

    render: ({ row }) => <RenderInitialBugsActions {...{ row, setSelectedRecords, selectedRecords }} />,
  },
  {
    name: 'Bug #',
    key: 'bugId.bugId',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '182px' },
    displayIcon: true,

    render: ({ row }) => <RenderProjectName {...{ setViewTestCaseIndex, setViewTestCase, handleReminder, row }} />,
  },
  {
    name: 'Project',
    key: 'bugId.projectId.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '140px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.bugId?.projectId?.name}</p>
      </div>
    ),
  },
  {
    name: 'Milestone',
    key: 'bugId.milestoneId.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.bugId?.milestoneId?.name}</p>
      </div>
    ),
  },
  {
    name: 'Feature',
    key: 'bugId.featureId.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '160px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.bugId?.featureId?.name}</p>
      </div>
    ),
  },
  {
    name: 'Bug Feedback',
    key: 'bugId.feedback.text',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '190px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.bugId?.feedback?.text}</p>
      </div>
    ),
  },

  {
    name: 'Steps to Reproduce',
    key: 'bugId.reproduceSteps.text',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.bugId?.reproduceSteps?.text}</p>
      </div>
    ),
  },
  {
    name: 'Ideal Behaviour',
    key: 'bugId.idealBehaviour.text',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '240px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.bugId?.idealBehaviour?.text}</p>
      </div>
    ),
  },
  {
    name: 'Bug Type',
    key: 'bugId.bugType',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '150px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.bugId?.bugType}</p>
      </div>
    ),
  },
  {
    name: 'Severity',
    key: 'bugId.severity',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <div className={style.pointerClass}>
            <Tags
              menu={[
                {
                  title: 'Low',
                },
                {
                  title: 'Medium',
                },
                {
                  title: 'High',
                },

                {
                  title: 'Critical',
                },
              ]}
              text={row?.bugId?.severity}
              colorScheme={{
                Low: '#4F4F6E',
                High: '#F96E6E',
                Medium: '#B79C11',
                Critical: '#F80101',
              }}
            />
          </div>
        </p>
      </div>
    ),
  },
  {
    name: 'Status',
    key: 'bugId.status',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => <RenderBugStatus {...{ row, setRetestOpen, setViewTestCaseIndex, handleReminder }} />,
  },
  {
    name: 'Test Status',
    key: 'bugStatus',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p
          className={`${style.userName} ${style.bugStatusClass}`}
          style={{
            background: row?.tested ? '#34C369' : '#F96E6E',
          }}
        >
          {row?.tested ? 'Tested' : 'Not Tested'}
        </p>
      </div>
    ),
  },
  {
    name: 'Testing Type',
    key: 'bugId.testingType',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '210px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.bugId?.testingType}</p>
      </div>
    ),
  },

  {
    name: 'Task ID',
    key: 'bugId.taskId',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.bugId?.taskId}</p>
      </div>
    ),
  },
  {
    name: 'Developer Name',
    key: 'bugId.developerId.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '160px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,
    render: ({ row }) => (
      <RenderBugUserName {...{ row, isHoveringName, setIsHoveringName, user: row?.bugId?.developerId }} />
    ),
  },

  {
    name: 'Bug Sub Type',
    key: 'bugId.bugSubType',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '190px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.bugId?.bugSubType}</p>
      </div>
    ),
  },

  {
    name: 'Version',
    key: 'bugId.testedVersion',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '230px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.bugId?.testedVersion}</p>
      </div>
    ),
  },
  {
    name: 'Test Evidence',
    key: 'bugId.testEvidence',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '230px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          {row?.bugId?.history
            ? row?.bugId?.history[row?.bugId?.history?.length - 1]?.reTestEvidence
            : row?.bugId?.testEvidence}
        </p>
      </div>
    ),
  },
  {
    name: 'Reported Date',
    key: 'bugId.reportedAt',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '200px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          {row?.bugId?.reportedAt ? formattedDate(row?.bugId?.reportedAt, 'dd MMM, yy') : '-'}
        </p>
      </div>
    ),
  },
  {
    name: 'Reported By',
    key: 'bugId.reportedBy.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '200px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <RenderReporterName
        {...{ row, setIsHoveringName, isHoveringName, user: row?.bugId?.reportedBy, columnName: 'Reported By' }}
      />
    ),
  },

  {
    name: 'Assigned to',
    key: 'bugId.taskHistory.0.assignedTo.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '150px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <RenderBugUserName
        {...{ row, isHoveringName, setIsHoveringName, user: row?.bugId?.taskHistory?.[0]?.assignedTo }}
      />
    ),
  },
  {
    name: 'Assigned Task ID',
    key: 'bugId.taskHistory.0.taskId.customId' || 'bugId.taskHistory.0.taskId.id',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <a
            href={row?.bugId?.taskHistory?.[0]?.taskId?.url}
            target="_blank"
            className={style.taskIdClass}
            rel="noreferrer"
          >
            {row?.bugId?.taskHistory
              ? row?.bugId?.taskHistory?.[0]?.taskId?.customId || row?.bugId?.taskHistory?.[0]?.taskId?.id
              : '-'}
          </a>
        </p>
      </div>
    ),
  },
  {
    name: 'Last Retest Date',
    key: 'bugId.history.0.reTestDate',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          {row?.bugId?.history
            ? formattedDate(row?.bugId?.history[_.findLastIndex(row?.bugId?.history)]?.reTestDate, 'dd MMM, yy')
            : '-'}
        </p>
      </div>
    ),
  },
  {
    name: 'Last Retest by',
    key: 'bugId.history.0.reTestBy.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <RenderReporterName
        {...{
          row,
          setIsHoveringName,
          isHoveringName,
          user: row?.bugId?.history[_.findLastIndex(row?.bugId?.history)]?.reTestBy,
          columnName: 'Last Retest by',
        }}
      />
    ),
  },
  {
    name: 'Closed Date',
    key: 'bugId.closed.date',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '180px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}> {formattedDate(row?.bugId?.closed?.date, 'dd MMM, yy')}</p>
      </div>
    ),
  },
  {
    name: 'Closed Version',
    key: 'bugId.closed.version',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '170px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.bugId?.closed?.version}</p>
      </div>
    ),
  },
  {
    name: 'Closed By',
    key: 'bugId.closed.by.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <RenderReporterName
        {...{ row, setIsHoveringName, isHoveringName, user: row?.bugId?.closed?.by, columnName: 'Closed By' }}
      />
    ),
  },
];

const RenderBugsCheck = ({ runBugs, selectedRecords, setSelectedRecords }) => {
  const handleChange = useCallback(
    (e) => {
      setSelectedRecords(() => (e.target.checked ? runBugs?.map((x) => x?.bugId?._id) : []));
    },
    [setSelectedRecords, runBugs],
  );

  return (
    <Checkbox
      checked={runBugs?.length > 0 && runBugs?.every((testRun) => selectedRecords?.includes(testRun?.bugId?._id))}
      partial={
        runBugs.some((testRun) => selectedRecords?.includes(testRun?.bugId?._id)) &&
        runBugs?.length !== selectedRecords?.length
      }
      handleChange={handleChange}
    />
  );
};

const RenderInitialBugsActions = ({ row, setSelectedRecords, selectedRecords }) => {
  const handleChange = useCallback(() => {
    setSelectedRecords((prevSelected) =>
      prevSelected?.includes(row?.bugId?._id)
        ? prevSelected?.filter((id) => id !== row?.bugId?._id)
        : [...prevSelected, row?.bugId?._id],
    );
  }, [setSelectedRecords, row]);

  return (
    <div className={`${style.imgDiv} ${style.minTestCaseId}`}>
      <Checkbox
        checked={selectedRecords?.includes(row?.bugId?._id)}
        name={row?.bugId?._id}
        handleChange={handleChange}
      />
    </div>
  );
};

const RenderMainCheck = ({ testRuns, selectedRecords, setSelectedRecords }) => {
  const handleChange = useCallback(
    (e) => {
      setSelectedRecords(() => (e.target.checked ? testRuns.map((x) => x?.testCaseId?._id) : []));
    },
    [setSelectedRecords, testRuns],
  );

  return (
    <Checkbox
      checked={testRuns?.length > 0 && testRuns.every((testRun) => selectedRecords.includes(testRun.testCaseId._id))}
      partial={
        testRuns.some((testRun) => selectedRecords.includes(testRun?.testCaseId._id)) &&
        testRuns?.length !== selectedRecords?.length
      }
      handleChange={handleChange}
    />
  );
};

const RenderInitialActions = ({ row, setSelectedRecords, selectedRecords }) => {
  const handleChange = useCallback(() => {
    setSelectedRecords((prevSelected) =>
      prevSelected?.includes(row?.testCaseId?._id)
        ? prevSelected?.filter((id) => id !== row?.testCaseId?._id)
        : [...prevSelected, row?.testCaseId?._id],
    );
  }, [setSelectedRecords, row]);

  return (
    <div className={`${style.imgDiv} ${style.minTestCaseId}`}>
      <Checkbox
        checked={selectedRecords?.includes(row?.testCaseId?._id)}
        name={row?.testCaseId?._id}
        handleChange={handleChange}
      />
    </div>
  );
};

const RenderTestCaseId = ({ row, setViewTestCaseIndex, setViewTestCase, handleReminder }) => {
  const onClick = useCallback(() => {
    setViewTestCaseIndex(row.index);
    setViewTestCase(true);
    handleReminder();
  }, [handleReminder, row, setViewTestCase, setViewTestCaseIndex]);

  return (
    <div className={`${style.imgDiv} ${style.pointerClass}`} onClick={onClick}>
      <p className={` ${style.clickable} ${style.userName}`}>{row?.testCaseId?.testCaseId}</p>
    </div>
  );
};

const RenderState = ({ row, setStatusUpdateTestCaseId, setViewTestCaseIndex, handleReminder }) => {
  const onClick = useCallback(() => {
    setStatusUpdateTestCaseId(row?.testCaseId?._id);
    setViewTestCaseIndex(row.index);
    handleReminder();
  }, [handleReminder, row, setStatusUpdateTestCaseId, setViewTestCaseIndex]);

  return (
    <div className={style.imgDiv} onClick={onClick}>
      <p className={style.userName}>
        <Tags
          text={row?.testCaseId?.status}
          colorScheme={{
            Failed: '#F96E6E',
            Passed: '#34C369',
            Blocked: '#F80101',
            'Not Tested': '#656F7D',
          }}
        />
      </p>
    </div>
  );
};

const RenderTestCaseUserName = ({ setIsHoveringName, row, isHoveringName, user }) => {
  const hoverTimeout = useRef(null);

  const handleMouseEnter = useCallback(() => {
    clearTimeout(hoverTimeout.current);

    hoverTimeout.current = setTimeout(() => {
      setIsHoveringName({
        userId: user?._id,
        rowId: row?._id,
      });
    }, 1500);
  }, [setIsHoveringName, row, user]);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(hoverTimeout);
    setIsHoveringName({ userId: null, rowId: null });
  }, [hoverTimeout, setIsHoveringName]);

  return (
    <div className={`${style.imgDiv} ${style.pointerClass}`}>
      <p className={style.userName} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <UserName
          user={user}
          isHovering={
            isHoveringName?.userId === user?._id && isHoveringName?.rowId === row?._id ? isHoveringName?.userId : null
          }
        />
      </p>
    </div>
  );
};

const RenderProjectName = ({ setViewTestCaseIndex, setViewTestCase, handleReminder, row }) => {
  const onClick = useCallback(() => {
    setViewTestCaseIndex(row.index);
    setViewTestCase(true);
    handleReminder();
  }, [handleReminder, row, setViewTestCase, setViewTestCaseIndex]);

  return (
    <div className={`${style.imgDiv} ${style.pointerClass}`} onClick={onClick}>
      <p className={`${style.clickable} ${style.userName}`}>{row?.bugId?.bugId}</p>
    </div>
  );
};

const RenderBugUserName = ({ row, isHoveringName, setIsHoveringName, user }) => {
  const hoverTimeout = useRef(null);

  const handleMouseEnter = useCallback(() => {
    clearTimeout(hoverTimeout.current);

    hoverTimeout.current = setTimeout(() => {
      setIsHoveringName({
        userId: user?._id,
        rowId: row?._id,
      });
    }, 1500);
  }, [setIsHoveringName, row, user]);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(hoverTimeout);
    setIsHoveringName({ userId: null, rowId: null });
  }, [hoverTimeout, setIsHoveringName]);

  return (
    <div className={style.imgDiv}>
      <p
        className={`${style.userName} ${style.pointerClass}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <UserName
          user={user}
          isHovering={
            isHoveringName?.userId === user?._id && isHoveringName?.rowId === row?.bugId?._id
              ? isHoveringName?.userId
              : null
          }
        />
      </p>
    </div>
  );
};

const RenderReporterName = ({ row, setIsHoveringName, isHoveringName, user, columnName }) => {
  const hoverTimeout = useRef(null);

  const handleMouseEnter = useCallback(() => {
    clearTimeout(hoverTimeout.current);

    hoverTimeout.current = setTimeout(() => {
      setIsHoveringName({
        userId: user?._id,
        rowId: row?.bugId?._id,
        columnName,
      });
    }, 1500);
  }, [setIsHoveringName, row, user, columnName]);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(hoverTimeout);
    setIsHoveringName({ userId: null, rowId: null });
  }, [hoverTimeout, setIsHoveringName]);

  return (
    <div className={style.imgDiv}>
      <p
        className={`${style.userName} ${style.pointerClass}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <UserName
          user={user}
          isHovering={
            isHoveringName?.userId === user?._id &&
            isHoveringName?.rowId === row?.bugId?._id &&
            isHoveringName?.columnName === columnName
              ? isHoveringName?.userId
              : null
          }
        />
      </p>
    </div>
  );
};

const RenderBugStatus = ({ row, setRetestOpen, setViewTestCaseIndex, handleReminder }) => {
  const onClick = useCallback(() => {
    setRetestOpen(() => ({ open: true, id: row?.bugId?._id }));
    setViewTestCaseIndex(row?.index);
    handleReminder();
  }, [handleReminder, row, setRetestOpen, setViewTestCaseIndex]);

  return (
    <div className={style.imgDiv}>
      <p className={style.userName}></p>
      <div className={style.pointerClass} onClick={onClick}>
        <Tags
          text={row?.bugId?.status}
          colorScheme={{
            Closed: '#34C369',
            Open: '#F96E6E',
            Blocked: '#F80101',
            Reproducible: '#FF9843',
            Reopen: '#DEBB00',
            'Need To Discuss': '#879DFF',
          }}
        />
      </div>
    </div>
  );
};

//NOTE: bug Reported Columns

const RenderBugReportedId = ({ setViewTestCaseIndex, setViewReportedBugs, row }) => {
  const onClick = useCallback(() => {
    setViewTestCaseIndex(row.index);
    setViewReportedBugs(true);
  }, [row.index, setViewReportedBugs, setViewTestCaseIndex]);

  return (
    <div className={`${style.imgDiv} ${style.pointerClass} `} onClick={onClick}>
      <p className={` ${style.clickable} ${style.userName}`}>{row?.bugId} </p>
    </div>
  );
};

export const columnsBugsReportedData = ({
  isHoveringName,
  setIsHoveringName,
  setViewTestCaseIndex,
  setViewReportedBugs,
}) => [
  {
    name: 'Bug #',
    key: 'bugId.bugId',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '182px' },
    displayIcon: true,

    render: ({ row }) => <RenderBugReportedId {...{ setViewTestCaseIndex, setViewReportedBugs, row }} />,
  },

  {
    name: 'Milestone',
    key: 'bugId.milestoneId.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.milestoneId?.name}</p>
      </div>
    ),
  },
  {
    name: 'Feature',
    key: 'bugId.featureId.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '160px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.featureId?.name}</p>
      </div>
    ),
  },
  {
    name: 'Bug Feedback',
    key: 'bugId.feedback.text',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '190px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.feedback?.text}</p>
      </div>
    ),
  },

  {
    name: 'Steps to Reproduce',
    key: 'bugId.reproduceSteps.text',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.reproduceSteps?.text}</p>
      </div>
    ),
  },

  {
    name: 'Ideal Behaviour',
    key: 'bugId.idealBehaviour.text',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '240px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.idealBehaviour?.text}</p>
      </div>
    ),
  },
  {
    name: 'Bug Type',
    key: 'bugId.bugType',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '150px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.bugType}</p>
      </div>
    ),
  },
  {
    name: 'Severity',
    key: 'bugId.severity',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <div className={style.pointerClass}>
            <Tags
              droppable
              menu={[
                {
                  title: 'Low',
                },
                {
                  title: 'Medium',
                },
                {
                  title: 'High',
                },

                {
                  title: 'Critical',
                },
              ]}
              text={row?.severity}
              colorScheme={{
                Low: '#4F4F6E',
                High: '#F96E6E',
                Medium: '#B79C11',
                Critical: '#F80101',
              }}
            />
          </div>
        </p>
      </div>
    ),
  },
  {
    name: 'Status',
    key: 'bugId.status',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}></p>
        <div className={style.pointerClass}>
          <Tags
            text={row?.status}
            colorScheme={{
              Closed: '#34C369',
              Open: '#F96E6E',
              Blocked: '#F80101',
              Reproducible: '#FF9843',
              Reopen: '#DEBB00',
              'Need To Discuss': '#879DFF',
            }}
          />
        </div>
      </div>
    ),
  },
  {
    name: 'Testing Type',
    key: 'bugId.testingType',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '210px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.testingType}</p>
      </div>
    ),
  },

  {
    name: 'Task ID',
    key: 'bugId.taskId',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.taskId}</p>
      </div>
    ),
  },
  {
    name: 'Developer Name',
    key: 'bugId.developerId.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '160px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,
    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={`${style.userName} ${style.pointerClass}`}>{row?.developerId?.name}</p>
      </div>
    ),
  },

  {
    name: 'Bug Sub Type',
    key: 'bugId.bugSubType',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '190px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.bugSubType}</p>
      </div>
    ),
  },

  {
    name: 'Version',
    key: 'bugId.testedVersion',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '230px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.testedVersion?.name}</p>
      </div>
    ),
  },
  {
    name: 'Reported Date',
    key: 'bugId.reportedAt',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '200px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.reportedAt ? formattedDate(row?.reportedAt, 'dd MMM, yy') : '-'}</p>
      </div>
    ),
  },
  {
    name: 'Reported By',
    key: 'bugId.reportedBy.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '200px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.reportedBy?.name}</p>
      </div>
    ),
  },
  {
    name: 'Assigned to',
    key: 'bugId.taskHistory.0.assignedTo.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '150px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.taskHistory?.[0]?.assignedTo}</p>
      </div>
    ),
  },

  {
    name: 'Assigned Task ID',
    key: 'bugId.taskHistory.0.taskId.customId' || 'bugId.taskHistory.0.taskId.id',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <a href={row?.taskHistory?.[0]?.taskId?.url} target="_blank" className={style.taskIdClass} rel="noreferrer">
            {row?.taskHistory ? row?.taskHistory?.[0]?.taskId?.customId || row?.taskHistory?.[0]?.taskId?.id : '-'}
          </a>
        </p>
      </div>
    ),
  },
  {
    name: 'Last Retest Date',
    key: 'bugId.history.0.reTestDate',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          {row?.history ? formattedDate(row?.history[_.findLastIndex(row?.history)]?.reTestDate, 'dd MMM, yy') : '-'}
        </p>
      </div>
    ),
  },
  {
    name: 'Last Retest by',
    key: 'bugId.history.0.reTestBy.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <RenderReporterName
        {...{
          row,
          setIsHoveringName,
          isHoveringName,
          user: row?.history[_.findLastIndex(row?.history)]?.reTestBy,
          columnName: 'Last Retest by',
        }}
      />
    ),
  },
  {
    name: 'Closed Date',
    key: 'bugId.closed.date',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '180px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}> {formattedDate(row?.closed?.date, 'dd MMM, yy')}</p>
      </div>
    ),
  },
  {
    name: 'Closed Version',
    key: 'bugId.closed.version',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '170px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        {' '}
        <p className={style.userName}>{row?.closed?.version}</p>{' '}
      </div>
    ),
  },
  {
    name: 'Closed By',
    key: 'bugId.closed.by.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <RenderReporterName
        {...{ row, setIsHoveringName, isHoveringName, user: row?.closed?.by, columnName: 'Closed By' }}
      />
    ),
  },
];
