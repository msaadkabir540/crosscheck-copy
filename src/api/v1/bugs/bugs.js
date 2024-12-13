import { useMutation, useQuery } from 'react-query';

import client from 'api/axios-config';

export const useGetBugsByFilter = () => {
  return useMutation((filters) => {
    return client.post('/api/bugs/get-all-bugs', filters, {
      params: {
        search: filters.search || '',
        page: filters.page || 0,
        perPage: filters.perPage,
      },
    });
  });
};

export const useGetBugById = (id) => {
  return useQuery({
    queryKey: ['bug', id],
    queryFn: () => {
      return client.get(`/api/bugs/get-bug/${id}`);
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

export const getBugSubtype = () => {
  return client.get(`/api/bugs/get-bug-subtypes`);
};

export const getTestedEnvironment = () => {
  return client.get(`/api/bugs/unique-tested-environments`);
};

export const getTestedVersion = () => {
  return client.get(`/api/bugs/unique-tested-version`);
};

export const getTestedDevices = () => {
  return client.get(`/api/bugs/unique-tested-devices`);
};

export const useCreateBug = () => {
  return useMutation((body) => {
    return client.post('/api/bugs/add-bug', body);
  });
};

export const useUpdateBug = () => {
  return useMutation(({ id, body }) => {
    return client.put(`api/bugs/edit-bug/${id}`, body);
  });
};

export const useRetestBug = () => {
  return useMutation(({ id, body }) => {
    return client.put(`/api/bugs/retest-bug/${id}`, body);
  });
};

export const useDeleteBug = () => {
  return useMutation(({ body }) => {
    return client.delete(`/api/bugs/delete-bugs`, {
      data: body,
    });
  });
};

export const useUpdateSeverityBug = () => {
  return useMutation(({ id, body }) => {
    return client.put(`/api/bugs/change-severity/${id}`, body);
  });
};

export const useBulkEditBugs = () => {
  return useMutation(({ body }) => {
    return client.put(`/api/bugs/bulk-edit-bugs`, body);
  });
};

export const useGetComments = (bugId) => {
  return useQuery({
    queryKey: ['comments', bugId],
    queryFn: () => {
      return client.get(`/api/comments/${bugId}`);
    },
    enabled: !!bugId,
    refetchOnWindowFocus: false,
  });
};

export const useAddComment = () => {
  return useMutation(({ body }) => {
    return client.post(`/api/comments/`, body);
  });
};

export const useEditComment = () => {
  return useMutation(({ commentId, body }) => {
    return client.put(`/api/comments/${commentId}`, body);
  });
};

export const useDeleteComment = () => {
  return useMutation(({ commentId }) => {
    return client.delete(`/api/comments/${commentId}`);
  });
};

export const useExportBugs = () => {
  return useMutation((filters) => {
    return client.post('/api/bugs/get-all-bugs', filters, {
      params: {
        search: filters.search || '',
        page: filters.page || 0,
        perPage: filters.perPage,
        isExporting: true,
      },
    });
  });
};

export const useImportBugs = () => {
  return useMutation(({ body, id }) => {
    return client.post(`/api/bugs/import-all-bugs/${id}`, body);
  });
};

export const useGetProjectDetails = (projectId) => {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => {
      return client.get(`/get-project-details/${projectId}`);
    },
    enabled: !!projectId,
    refetchOnWindowFocus: false,
  });
};
