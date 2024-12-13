import _ from 'lodash';
import { useQuery } from 'react-query';

import { getBugSubtype } from 'api/v1/bugs/bugs';
import { getAllProjectsMilestonesFeatures } from 'api/v1/projects/projects';
import { getUsers } from 'api/v1/settings/user-management';

export const initialFilter = {
  milestones: [],
  features: [],
  testingType: [],
  status: [],
  bugType: [],
  developers: [],
  reportedBy: [],
  severity: [],
  assignedTo: [],
  testedVersion: [],
  testedEnvironment: [],
};

export function useBugsFiltersOptions() {
  return useQuery({
    queryKey: ['BugsOptions'],
    queryFn: async () => {
      const _getProjectsMilestonesFeatures = await getAllProjectsMilestonesFeatures();
      const { bugSubTypes } = await getBugSubtype();

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
        { label: 'Reproducible', value: 'Reproducible', checkbox: true },
        { label: 'Blocked', value: 'Blocked', checkbox: true },
        { label: 'Need To Discuss', value: 'Need To Discuss', checkbox: true },
      ];

      const severityOptions = [
        { label: 'Critical', value: 'Critical', checkbox: true },
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

      const bugSubtypeOptions =
        bugSubTypes?.map((x) => ({
          label: x,
          value: x,
          checkbox: true,
        })) || [];

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

      return {
        projectOptions,
        mileStonesOptions,
        featuresOptions,
        statusOptions,
        severityOptions,
        bugTypeOptions,
        bugSubtypeOptions,
        testTypeOptions,
        reportedByOptions: users.map((x) => ({
          label: x.name,
          ...(x?.profilePicture && { image: x?.profilePicture }),
          ...(!x?.profilePicture && { imagAlt: _.first(x?.name) }),
          value: x._id,
          checkbox: true,
        })),
        bugByOptions: users.map((x) => ({
          label: x.name,
          ...(x?.profilePicture && { image: x?.profilePicture }),
          ...(!x?.profilePicture && { imagAlt: _.first(x?.name) }),
          value: x._id,
          checkbox: true,
        })),
        developersOptions: users
          .filter((x) => x.role === 'Developer' && x.status)
          .map((x) => ({
            label: x.name,
            ...(x?.profilePicture && { image: x?.profilePicture }),
            ...(!x?.profilePicture && { imagAlt: _.first(x?.name) }),
            value: x._id,
            checkbox: true,
          })),
        assignedToOptions: [
          {
            label: 'Un Assigned',
            value: 'Unassigned',
            checkbox: true,
          },
          ...(Array.isArray(users)
            ? users
                .filter((x) => x.role === 'Developer' && x.status)
                .map((x) => ({
                  label: x.name,
                  ...(x.profilePicture && { image: x.profilePicture }),
                  ...(!x.profilePicture && { imagAlt: _.first(x.name) }),
                  value: x._id,
                  checkbox: true,
                }))
            : []),
        ],
      };
    },
    refetchOnWindowFocus: false,
  });
}
