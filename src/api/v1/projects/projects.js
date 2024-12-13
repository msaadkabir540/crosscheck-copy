import { useMutation, useQuery } from 'react-query';

import client from 'api/axios-config';

export function useGetProjects(filter) {
  return useQuery({
    queryKey: ['allProjects', filter],
    queryFn: () => {
      return client.get('/api/projects/get-all-projects', {
        params: filter,
      });
    },

    refetchOnWindowFocus: false,
  });
}

export function useGetProjectsForMainWrapper(filter, icon) {
  return useQuery({
    queryKey: ['allProjects', filter, icon],
    queryFn: () => {
      return client.get('/api/projects/get-all-projects', {
        params: filter,
      });
    },
    enabled: !!icon,
    refetchOnWindowFocus: false,
  });
}

export function useGetProjectById(id) {
  return useQuery({
    queryKey: ['project', id],
    enabled: !!id,
    queryFn: () => {
      return client.get(`/api/projects/get-project/${id}`);
    },

    refetchOnWindowFocus: false,
  });
}

export const getAllProjectsMilestonesFeatures = () => {
  return client.get('/api/projects/get-all-projects-milestones-features');
};

export function useCreateProject() {
  return useMutation(({ body }) => {
    return client.post(`/api/projects/add-project`, body);
  });
}

export function useUpdateProject() {
  return useMutation(({ id, body }) => {
    return client.put(`/api/projects/edit-project/${id}`, body);
  });
}

export function useDeleteProject() {
  return useMutation(({ id, body }) => {
    return client.delete(`/api/projects/delete-project/${id}`, body);
  });
}

export function useFavoritesToggle() {
  return useMutation((id) => {
    return client.put(`/api/projects/favorites-toggle/${id}`);
  });
}

export function useArchiveToggle() {
  return useMutation((id) => {
    return client.put(`/api/projects/archive-toggle/${id}`);
  });
}

export function useAddMembers() {
  return useMutation(({ id, body }) => {
    return client.put(`/api/projects/add-members/${id}`, body);
  });
}

export function useDeleteMembers() {
  return useMutation(({ id, body }) => {
    return client.put(`/api/projects/remove-member/${id}`, body);
  });
}

export const useProjectBugsFormConfiguration = () => {
  return useMutation(({ id, body }) => {
    return client.put(`/api/projects/bug-form-config/${id}`, body);
  });
};

export const useProjectTestCasesFormConfiguration = () => {
  return useMutation(({ id, body }) => {
    return client.put(`/api/projects/test-case-form-config/${id}`, body);
  });
};

export const useProjectFormConfiguration = (id) => {
  return useQuery({
    queryKey: ['formConfiguration', id],
    queryFn: () => {
      return client.get(`/api/projects/form-config/${id}`);
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};
