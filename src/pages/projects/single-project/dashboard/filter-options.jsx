import { useQuery } from 'react-query';

import { getTestedEnvironment, getTestedVersion } from 'api/v1/bugs/bugs';

export function useDashboardFiltersOptions() {
  return useQuery({
    queryKey: ['useDashboardOptions'],
    queryFn: async () => {
      let { testedVersions } = await getTestedVersion();
      let { testedEnvironments } = await getTestedEnvironment();

      const sortByCreatedAtDesc = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

      testedVersions = testedVersions?.sort(sortByCreatedAtDesc);
      testedEnvironments = testedEnvironments?.sort(sortByCreatedAtDesc);

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

      return { testedVersionOptions, testedEnvironmentOptions };
    },
    refetchOnWindowFocus: false,
  });
}
