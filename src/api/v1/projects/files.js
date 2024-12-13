import { useQuery, useMutation } from 'react-query';

import client from 'api/axios-config';

export function useGetProjectFiles({ projectId, search, sortFilters }) {
  return useQuery({
    queryKey: ['files', projectId, search, sortFilters],
    queryFn: () => {
      return client.get(`/api/projects/get-project-files/${projectId}`, { params: { search, ...sortFilters } });
    },
    enabled: !!projectId,
    refetchOnWindowFocus: false,
  });
}

export function useUploadProjectFiles() {
  return useMutation(({ id, body }) => {
    return client.post(`/api/projects/upload-project-file/${id}`, body);
  });
}

export function useRenameProjectFile() {
  return useMutation(({ id, body }) => {
    return client.put(`/api/projects/rename-project-file/${id}`, body);
  });
}

export function useDeleteProjectFile() {
  return useMutation((id) => {
    return client.delete(`/api/projects/delete-uploaded-file/${id}`);
  });
}
