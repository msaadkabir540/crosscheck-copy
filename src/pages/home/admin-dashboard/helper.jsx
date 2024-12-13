import _ from 'lodash';
import { useQuery } from 'react-query';

import { getUsers } from 'api/v1/settings/user-management';

export const initialFilter = {
  allQaUsersIds: [],
};

export function useProjectOptions() {
  return useQuery({
    queryKey: ['projectsOptions'],
    queryFn: async () => {
      const { users = [] } = await getUsers({
        sortBy: '',
        sort: '',
        search: '',
      });

      return {
        createdByOptions: [
          {
            label: 'Select All',
            value: '-select-all-',
            checkbox: true,
          },
          ...users
            .filter((x) => x.status && x.role === 'QA')
            .map((x) => ({
              label: x.name,
              ...(x?.profilePicture && { image: x?.profilePicture }),
              ...(!x?.profilePicture && { imagAlt: _.first(x?.name) }),
              value: x._id,
              checkbox: true,
            })),
        ],
        devOptions: [
          {
            label: 'Select All',
            value: '-select-all-',
            checkbox: true,
          },
          ...users
            .filter((x) => x.status && x.role === 'Developer')
            .map((x) => ({
              label: x.name,
              ...(x?.profilePicture && { image: x?.profilePicture }),
              ...(!x?.profilePicture && { imagAlt: _.first(x?.name) }),
              value: x._id,
              checkbox: true,
            })),
        ],
      };
    },
    refetchOnWindowFocus: false,
  });
}
