import { useMutation, useQuery } from 'react-query';

import client from 'api/axios-config';

export function useTestedEnvironmentPerProject({ id, search }) {
  return useQuery({
    queryKey: ['testedEnvironmentPerProject', id],
    queryFn: async () => {
      return client.get(`/api/tested-environments/get-tested-environments-by-project/${id}`, {
        params: { search: search || '' },
      });
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
}

export function useUniqueTestedEnvironment() {
  return useQuery({
    queryKey: ['uniqueTestedEnvironment'],

    queryFn: async () => {
      return await client.get(`/api/bugs/unique-tested-environments`);
    },

    refetchOnWindowFocus: false,
  });
}

export function useAddTestedEnvironment() {
  return useMutation((body) => {
    return client.post(`/api/tested-environments/add-tested-environment`, body);
  });
}

export function useEditTestedEnvironment() {
  return useMutation(({ id, body }) => {
    return client.put(`/api/tested-environments/edit-tested-environment/${id}`, body);
  });
}

export function useDeleteTestedEnvironment() {
  return useMutation(({ id, body }) => {
    return client.delete(`/api/tested-environments/delete-tested-environment/${id}`, body);
  });
}

export function useMigrateTestedEnvironmentBugs() {
  return useMutation(() => {
    return client.put(`/api/tested-environments/migrate-bugs-tested-environment`);
  });
}
