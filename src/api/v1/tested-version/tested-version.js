import { useMutation, useQuery } from 'react-query';

import client from 'api/axios-config';

const initialRoute = '/api/tested-versions';

export function useTestedVersionPerProject({ id, search }) {
  return useQuery({
    queryKey: ['testedVersionPerProject', id],
    queryFn: async () => {
      const res = await client.get(`${initialRoute}/tested-versions-by-project/${id}`, {
        params: { search: search || '' },
      });

      return res;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
}

export function useVersionFormCountForBulkUpdate({ id }) {
  return useQuery({
    queryKey: ['testedVersionFormCount', id],

    queryFn: async () => {
      return await client.get(`${initialRoute}/count-for-bulk-update/${id}`);
    },

    enabled: !!id,
    refetchOnWindowFocus: false,
  });
}

export function useUniqueTestedVersion() {
  return useQuery({
    queryKey: ['uniqueTestedVersion'],

    queryFn: async () => {
      return await client.get(`/api/bugs/unique-tested-versions`);
    },

    refetchOnWindowFocus: false,
  });
}

export function useAddTestedVersion() {
  return useMutation((body) => {
    return client.post(`${initialRoute}/add-tested-version`, body);
  });
}

export function useEditTestedVersion() {
  return useMutation(({ id, body }) => {
    return client.put(`${initialRoute}/edit-tested-version/${id}`, body);
  });
}

export function useDeleteTestedVersion() {
  return useMutation(({ id, body }) => {
    return client.delete(`${initialRoute}/delete-tested-version/${id}`, body);
  });
}

export function useMigrateTestedVersionBugs() {
  return useMutation(() => {
    return client.put(`${initialRoute}/migrate-bugs-tested-version`);
  });
}

export function useMigrateTestedVersionTestCases() {
  return useMutation(() => {
    return client.put(`${initialRoute}/migrate-testcases-tested-version`);
  });
}

export function useMigrateTestedVersionBugsHistory() {
  return useMutation(() => {
    return client.put(`${initialRoute}/migrate-bugs-history-tested-version`);
  });
}
