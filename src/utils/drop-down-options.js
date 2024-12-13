import { useQuery } from 'react-query';

import { getAllProjectsMilestonesFeatures } from 'api/v1/projects/projects';
import { getUsers } from 'api/v1/settings/user-management';
import { getBugSubtype, getTestedDevices, getTestedEnvironment, getTestedVersion } from 'api/v1/bugs/bugs';

import { first as _first } from 'utils/lodash';

export const statusOptions = [
  {
    label: 'Open',
    value: 'Open',
  },
  {
    label: 'Closed',
    value: 'Closed',
  },
];

export const useUsersOptions = () => {
  return useQuery({
    queryKey: ['usersOptions'],
    queryFn: async () => {
      const { users = [] } = await getUsers({
        sortBy: '',
        sort: '',
        search: '',
      });

      return {
        usersOptions: users?.map((x) => ({
          label: x.name,
          email: x.email,
          ...(x?.profilePicture && { image: x?.profilePicture }),
          ...(!x?.profilePicture && { imagAlt: _first(x?.name) }),
          value: x._id,
          checkbox: true,
          role: x?.role,
        })),
      };
    },
    refetchOnWindowFocus: false,
  });
};

export function generateRandomString() {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';

  return Array.from({ length: 3 }, () => alphabet[Math.floor(Math.random() * alphabet.length)])
    .join('')
    .toLocaleUpperCase();
}

export function useBugsDropDownOptions() {
  return useQuery({
    queryKey: ['BugsOptions'],
    queryFn: async () => {
      const [
        testedVersionsResponse,
        testedEnvironmentsResponse,
        projectsMilestonesFeaturesResponse,
        bugSubtypeResponse,
        testedDevicesResponse,
        usersResponse,
      ] = await Promise.all([
        getTestedVersion(),
        getTestedEnvironment(),
        getAllProjectsMilestonesFeatures(),
        getBugSubtype(),
        getTestedDevices(),
        getUsers({ sortBy: '', sort: '', search: '' }),
      ]);

      const { testedVersions } = testedVersionsResponse;
      const { testedEnvironments } = testedEnvironmentsResponse;
      const { allProjects, allMilestones, allFeatures } = projectsMilestonesFeaturesResponse;
      const { bugSubTypes } = bugSubtypeResponse;
      const { testedDevice } = testedDevicesResponse;
      const { users = [] } = usersResponse;

      const projectOptions =
        allProjects?.map((x) => ({
          label: x.name,
          value: x._id,
          checkbox: true,
        })) || [];

      const mileStonesOptions =
        allMilestones?.map((x) => ({
          ...x,
          label: x.name,
          value: x._id,
          checkbox: true,
        })) || [];

      const featuresOptions =
        allFeatures?.map((x) => ({
          ...x,
          label: x.name,
          value: x._id,
          checkbox: true,
        })) || [];

      const testedEnvironmentOptions =
        testedEnvironments?.map((x) => ({
          ...x,
          label: x?.name,
          value: x?._id,
          checkbox: true,
        })) || [];

      const testedVersionOptions =
        testedVersions?.map((x) => ({
          ...x,
          label: x?.name,
          value: x?._id,
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
            ...(!x?.profilePicture && { imagAlt: _first(x?.name) }),
            value: x._id,
            checkbox: true,
          })),
        bugByOptions: users
          ?.filter((x) => x.role === 'Developer' && x.status)
          ?.map((x) => ({
            label: x.name,
            ...(x?.profilePicture && { image: x?.profilePicture }),
            ...(!x?.profilePicture && { imagAlt: _first(x?.name) }),
            value: x._id,
            checkbox: true,
          })),
        assignedToOptions: users
          .filter((x) => x.role === 'Developer' && x.status)
          .map((x) => ({
            label: x.name,
            ...(x?.profilePicture && { image: x?.profilePicture }),
            ...(!x?.profilePicture && { imagAlt: _first(x?.name) }),
            value: x._id,
            checkbox: true,
          })),
      };
    },
    refetchOnWindowFocus: false,
  });
}

export function useTestCasesDropDownOptions() {
  return useQuery({
    queryKey: ['testCasesOptions'],
    queryFn: async () => {
      const _getProjectsMilestonesFeatures = await getAllProjectsMilestonesFeatures();
      const { testedEnvironments } = await getTestedEnvironment();
      const { testedDevice } = await getTestedDevices();

      const { users = [] } = await getUsers({
        sortBy: '',
        sort: '',
        search: '',
      });

      const projectOptions =
        _getProjectsMilestonesFeatures?.allProjects?.map((x, i) => ({
          index: i,
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
        { label: '1', value: '1', checkbox: true },
        { label: '2', value: '2', checkbox: true },
        { label: '3', value: '3', checkbox: true },
        { label: '4', value: '4', checkbox: true },
        { label: '5', value: '5', checkbox: true },
      ];

      const testedEnvironmentOptions = [
        ...(testedEnvironments?.map((x) => ({
          label: x,
          value: x,
          checkbox: true,
        })) || []),
      ];

      const testedDevicesOptions =
        testedDevice?.map((x) => ({
          label: x,
          value: x,
          checkbox: true,
        })) || [];

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
          label: 'Functionality Testing',
          value: 'Functionality',
          checkbox: true,
        },
        { label: 'Performance Testing', value: 'Performance', checkbox: true },
        { label: 'Security Testing', value: 'Security', checkbox: true },
        { label: 'UI Testing', value: 'UI', checkbox: true },
      ];

      const stateOptions = [
        {
          label: 'Active',
          value: 'Active',
          checkbox: true,
        },
        { label: 'Obsolete', value: 'Obsolete', checkbox: true },
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
        testedDevicesOptions,
        testedEnvironmentOptions,
        severityOptions,
        bugTypeOptions,
        mileStonesOptions,
        priorityOptions,
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
            ...(!x?.profilePicture && { imagAlt: _first(x?.name) }),
            value: x._id,
            checkbox: true,
          })),
        createdByOptions: users.map((x) => ({
          label: x.name,
          ...(x?.profilePicture && { image: x?.profilePicture }),
          ...(!x?.profilePicture && { imagAlt: _first(x?.name) }),
          value: x._id,
          checkbox: true,
        })),
        stateOptions,
        lastTestedBy: users.map((x) => ({
          label: x.name,
          ...(x?.profilePicture && { image: x?.profilePicture }),
          ...(!x?.profilePicture && { imagAlt: _first(x?.name) }),
          value: x._id,
          checkbox: true,
        })),
      };
    },
    refetchOnWindowFocus: false,
  });
}
