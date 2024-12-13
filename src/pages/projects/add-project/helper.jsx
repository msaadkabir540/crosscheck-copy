import _ from 'lodash';
import { useQuery } from 'react-query';

import { getUsers } from 'api/v1/settings/user-management';

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
        sharedWith: users.map((x) => ({
          label: x.name,
          ...(x?.profilePicture && { image: x?.profilePicture }),
          ...(!x?.profilePicture && { imagAlt: _.first(x?.name) }),
          value: x._id,
          role: x.role,
          checkbox: true,
        })),
      };
    },
    refetchOnWindowFocus: false,
  });
}
