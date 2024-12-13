import { useQuery } from 'react-query';

import { getAllProjectsMilestonesFeatures } from 'api/v1/projects/projects';

export function useBugsFiltersOptions() {
  return useQuery({
    queryKey: ['BugsOptions'],
    queryFn: async () => {
      const _getProjectsMilestonesFeatures = await getAllProjectsMilestonesFeatures();

      const projectOptions =
        _getProjectsMilestonesFeatures?.allProjects?.map((x) => ({
          label: x.name,
          value: x._id,
          checkbox: true,
        })) || [];

      return {
        projectOptions,
      };
    },
    refetchOnWindowFocus: false,
  });
}

export const notificationsOptions = [
  {
    label: 'Project related',
    children: [
      { label: 'Add Project' },
      { label: 'Update Project' },
      { label: 'archived Project' },
      { label: 'unarchived Project' },
      { label: 'Add Member' },
      { label: 'Remove Member' },
      { label: 'Delete Project' },
      { label: 'Bug Form Config' },
      { label: 'Test Case Form Config' },
      { label: 'Add Tested Environment' },
      { label: 'Update Tested Environment' },
      { label: 'Delete Tested Environment' },
    ],
  },
  {
    label: 'Milestone related',
    children: [{ label: 'Add Milestone' }, { label: 'Rename Milestone' }, { label: 'Delete Milestone' }],
  },
  {
    label: 'Feature related',
    children: [{ label: 'Add Feature' }, { label: 'Rename Feature' }, { label: 'Delete Feature' }],
  },
  {
    label: 'Bugs Reporting related',
    children: [
      { label: 'Add Bug' },
      { label: 'Update Bug' },
      { label: 'Retest Bug Closed' },
      { label: 'Retest Bug Reproducible' },
      { label: 'Retest Bug Blocked' },
      { label: 'Retest Bug Need To Discuss' },
      { label: 'Retest Bug Reopen' },
      { label: 'Delete Bug' },
      { label: 'Import Bugs' },
      { label: 'Change Bug Severity Critical' },
      { label: 'Change Bug Severity High' },
      { label: 'Change Bug Severity Medium' },
      { label: 'Change Bug Severity Low' },
    ],
  },
  {
    label: 'Test Case related',
    children: [
      { label: 'Add Test Case' },
      { label: 'Update Test Case' },
      { label: 'Status Passed' },
      { label: 'Status Failed' },
      { label: 'Status Not Tested' },
      { label: 'Status Blocked' },
      { label: 'Delete Test Case' },
      { label: 'Import Test Cases' },
    ],
  },
  {
    label: 'Test Run related',
    children: [
      { label: 'Add Test Run' },
      { label: 'Update Test Run' },
      { label: 'Close Test Run' },
      { label: 'Delete Test Run' },
      { label: 'Time Tracked' },
      { label: 'Manual Time Tracked' },
      { label: 'Deleted Time Tracked' },
      { label: 'Updated Time Tracked' },
      { label: 'Change Run Priority Low' },
      { label: 'Change Run Priority Medium' },
      { label: 'Change Run Priority High' },
    ],
  },
  {
    label: 'Feedback related',
    children: [{ label: 'Submit Feedback' }, { label: 'Delete Feedback' }],
  },
  {
    label: 'Task related',
    children: [{ label: 'Add Task' }, { label: 'Update Task' }, { label: 'Delete Task' }],
  },
  {
    label: 'Bug comments related',
    children: [{ label: 'Add Comment' }, { label: 'Update Comment' }, { label: 'Delete Comment' }],
  },
  {
    label: 'Tags related',
    children: [{ label: 'Add Tag' }, { label: 'Rename Tag' }, { label: 'Delete tag' }],
  },
  {
    label: 'Files related',
    children: [{ label: 'Upload File' }, { label: 'Rename File' }, { label: 'Delete File' }],
  },
];
