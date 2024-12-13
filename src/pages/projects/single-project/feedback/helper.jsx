import { useQuery } from 'react-query';
import _ from 'lodash';

import Checkbox from 'components/checkbox';
import Permissions from 'components/permissions';
import Highlighter from 'components/highlighter';

import { getAllProjectsMilestonesFeatures } from 'api/v1/projects/projects';
import { getUsers } from 'api/v1/settings/user-management';

import { formattedDate } from 'utils/date-handler';

import style from './test.module.scss';
import Icon from '../../../../components/icon/themed-icon';

export function useProjectOptions() {
  return useQuery({
    queryKey: ['projectsOptions'],
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
        { label: 'Not Tested', value: 'Not Tested', checkbox: true },
        { label: 'Blocked', value: 'Blocked', checkbox: true },
        { label: 'Failed', value: 'Failed', checkbox: true },
        { label: 'Passed', value: 'Passed', checkbox: true },
      ];

      const weighageOptions = [
        { label: 1, value: 1, checkbox: true },
        { label: 2, value: 2, checkbox: true },
        { label: 3, value: 3, checkbox: true },
        { label: 4, value: 4, checkbox: true },
        { label: 5, value: 5, checkbox: true },
      ];

      const bugTypeOptions = [
        { label: 'Functionality', value: 'Functionality', checkbox: true },
        { label: 'Performance', value: 'Performance', checkbox: true },
        { label: 'UI', value: 'UI', checkbox: true },
        { label: 'Security', value: 'Security', checkbox: true },
      ];

      const testTypeOptions = [
        {
          label: 'Functionality Testing',
          value: 'Functionality',
          checkbox: true,
        },
        { label: 'Performance Testing', value: 'Performance', checkbox: true },
        { label: 'Security Testing', value: 'Security', checkbox: true },
        { label: 'UI Testing', value: 'UI', checkbox: true },
      ];

      const testingTypeOptions = [
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
        projectOptions,
        severityOptions,
        bugTypeOptions,
        mileStonesOptions,
        featuresOptions,
        statusOptions,
        weighageOptions,
        testTypeOptions,
        testingTypeOptions,
        assignedToOptions: users
          .filter((x) => x.role === 'Developer')
          .map((x) => ({
            label: x.name,
            ...(x?.profilePicture && { image: x?.profilePicture }),
            ...(!x?.profilePicture && { imagAlt: _.first(x?.name) }),
            value: x._id,
            checkbox: true,
          })),
        createdByOptions: users.map((x) => ({
          label: x.name,
          ...(x?.profilePicture && { image: x?.profilePicture }),
          ...(!x?.profilePicture && { imagAlt: _.first(x?.name) }),
          value: x._id,
          checkbox: true,
        })),
        lastTestedBy: users.map((x) => ({
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

export const columnsData = ({
  feedbacks,
  setSelectedRecords,
  selectedRecords,
  setDelModal,
  setReportBug,
  setEditRecord,
  role,
  activePlan,
  searchedText,
}) => [
  {
    name: (
      <Checkbox
        checked={feedbacks?.some((feedback) => selectedRecords.includes(feedback._id))}
        partial={
          feedbacks?.some((feedback) => selectedRecords.includes(feedback._id)) &&
          feedbacks?.length !== selectedRecords?.length
        }
        handleChange={(e) => {
          setSelectedRecords(() => (e.target.checked ? feedbacks.map((x) => x._id) : []));
        }}
      />
    ),
    key: 'actions',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '50px', height: '36px' },
    widthInEditMode: { width: '182px' },
    displayIcon: true,

    render: ({ row }) => {
      return (
        <div className={style.imgDiv1}>
          <Checkbox
            checked={selectedRecords.includes(row._id)}
            name={row?._id}
            handleChange={() => {
              setSelectedRecords((pre) =>
                pre.includes(row._id) ? pre.filter((x) => x !== row._id) : [...pre, row._id],
              );
            }}
          />
        </div>
      );
    },
  },
  {
    name: 'Title',
    key: 'title',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '182px' },
    displayIcon: true,

    render: ({ row }) => {
      return (
        <div
          className={style.imgDiv}
          style={{
            cursor: 'pointer',
          }}
        >
          <p className={style.userName}>
            <Highlighter search={searchedText}>{row?.title ? row?.title : '-'}</Highlighter>
          </p>
        </div>
      );
    },
  },
  {
    name: 'Description',
    key: 'description',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '182px' },
    displayIcon: true,

    render: ({ row }) => {
      return (
        <div
          className={style.imgDiv}
          style={{
            cursor: 'pointer',
          }}
        >
          <p className={style.userName}>
            <Highlighter search={searchedText}>{row?.description ? row?.description : '-'}</Highlighter>
          </p>
        </div>
      );
    },
  },

  {
    name: 'Reported at',
    key: 'reportedAt',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '115px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>
            {row?.reportedAt ? formattedDate(row.reportedAt, 'dd-MMM-yy') : '-'}
          </Highlighter>{' '}
        </p>
      </div>
    ),
  },

  {
    name: 'Actions',
    key: 'actions',
    hidden: false,
    type: 'text',
    editable: true,
    widthAndHeight: { width: '110px', height: '36px' },
    widthInEditMode: { width: '56px' },
    displayIcon: false,
    render: ({ row }) => (
      <>
        <Permissions allowedRoles={['Admin', 'Project Manager', 'QA']} currentRole={role}>
          <div className={style.imgDiv}>
            <div className={style.img}>
              <div onClick={() => window.open(row?.attachment, '_blank')}>
                <Icon name={'AttachPill'} iconClass={style.iconStroke1} />
              </div>

              <div className={style.tooltip}>
                <p>Link</p>
              </div>
            </div>
            <Permissions
              allowedRoles={['Admin', 'Project Manager', 'QA', 'Developer']}
              currentRole={role}
              locked={activePlan === 'Free'}
            >
              <div className={style.img}>
                <div
                  onClick={() => {
                    setReportBug(true);
                    setEditRecord(row._id);
                  }}
                >
                  <Icon name={'BugReportingIcon'} iconClass={style.iconStroke1} />
                </div>

                <div className={style.tooltip}>
                  <p>Report Bug</p>
                </div>
              </div>
            </Permissions>
            <div className={style.img} onClick={() => setDelModal({ open: true, id: row?._id })}>
              <div className={style.imgDel}>
                <Icon name={'DelIcon'} iconClass={style.iconStroke} />
              </div>
              <div className={style.tooltip}>
                <p>Delete</p>
              </div>
            </div>
          </div>
        </Permissions>
      </>
    ),
  },
];
