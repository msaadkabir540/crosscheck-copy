import _ from 'lodash';
import { useQuery } from 'react-query';

import { getUsers } from 'api/v1/settings/user-management';

export function useProjectOptions() {
  return useQuery({
    queryKey: ['testRunOptions'],
    queryFn: async () => {
      const { users = [] } = await getUsers({
        sortBy: '',
        sort: '',
        search: '',
      });

      const applicationOptions = [
        { label: 'Jira', value: 'Jira', checkbox: true },
        { label: 'ClickUp', value: 'ClickUp', checkbox: true },
      ];

      const taskTypeOptions = [
        { label: 'Bug', value: 'Bug', checkbox: true },
        { label: 'Test Case', value: 'Test Case', checkbox: true },
      ];

      return {
        taskTypeOptions,
        applicationOptions,
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
