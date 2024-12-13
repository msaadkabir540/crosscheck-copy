import { useQuery } from 'react-query';
import _ from 'lodash';

import { getAllProjectsMilestonesFeatures } from 'api/v1/projects/projects';
import { getUsers } from 'api/v1/settings/user-management';
import { getBugSubtype, getTestedDevices, getTestedEnvironment, getTestedVersion } from 'api/v1/bugs/bugs';

export function useBugsFiltersOptions() {
  return useQuery({
    queryKey: ['BugsOptions'],
    queryFn: async () => {
      const _getProjectsMilestonesFeatures = await getAllProjectsMilestonesFeatures();
      const { bugSubTypes } = await getBugSubtype();
      const { testedEnvironments } = await getTestedEnvironment();
      const { testedVersions } = await getTestedVersion();
      const { testedDevice } = await getTestedDevices();

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
        { label: 'Reopen', value: 'Reopen', checkbox: true },
      ];

      const testedEnvironmentOptions = [
        ...(testedEnvironments?.map((x) => ({
          label: x?.name,
          value: x?._id,
          checkbox: true,
          projectId: x?.projectId,
        })) || []),
      ];

      const testedVersionOptions = [
        ...(testedVersions?.map((x) => ({
          label: x?.name,
          value: x?._id,
          checkbox: true,
          projectId: x?.projectId,
        })) || []),
      ];

      const testedDevicesOptions =
        testedDevice?.map((x) => ({
          label: x,
          value: x,
          checkbox: true,
        })) || [];

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

      const issueTypeOptions = [
        { label: 'New Bug', value: 'New Bug', checkbox: true },
        { label: 'Reopened Bug', value: 'Reopened Bug', checkbox: true },
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
        issueTypeOptions,
        testTypeOptions,
        testedVersionOptions,
        testedEnvironmentOptions,
        testedDevicesOptions,
        reportedByOptions: users
          ?.filter((x) => x.role !== 'Developer' && x.status)
          .map((x) => ({
            label: x.name,
            ...(x?.profilePicture && { image: x?.profilePicture }),
            ...(!x?.profilePicture && { imagAlt: _.first(x?.name) }),
            value: x._id,
            checkbox: true,
          })),
        bugByOptions: users
          ?.filter((x) => x.role === 'Developer' && x.status)
          ?.map((x) => ({
            label: x.name,
            ...(x?.profilePicture && { image: x?.profilePicture }),
            ...(!x?.profilePicture && { imagAlt: _.first(x?.name) }),
            value: x._id,
            checkbox: true,
          })),

        assignedToOptions: [
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
          {
            label: 'Unassigned',
            value: 'Unassigned',
            checkbox: true,
          },
        ],
      };
    },
    refetchOnWindowFocus: false,
  });
}
