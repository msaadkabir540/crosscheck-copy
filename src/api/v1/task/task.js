import { useMutation, useQuery } from 'react-query';

import client from 'api/axios-config';

export const useGetLocation = () => {
  return useMutation(() => {
    return client.get(`/api/tasks/get-location`);
  });
};

export const useGetAllMembers = () => {
  return useMutation((listId) => {
    return client.get('/api/tasks/get-members', {
      params: {
        listId: listId || '',
      },
    });
  });
};

export const useGetTaskTypes = () => {
  return useMutation((teamId) => {
    return client.get('/api/tasks/clickup-task-types', {
      params: {
        teamId: teamId || '',
      },
    });
  });
};

export const useGetParentsTasks = () => {
  return useMutation((listId) => {
    return client.get('/api/tasks/clickup-parent-tasks', {
      params: {
        listId: listId || '',
      },
    });
  });
};

export const useGetCustomFields = () => {
  return useMutation((listId) => {
    return client.get('/api/tasks/clickup-custom-fields', {
      params: {
        listId: listId || '',
      },
    });
  });
};

export const useGetClickUpTags = () => {
  return useMutation((spaceId) => {
    return client.get('/api/tasks/clickup-tags', {
      params: {
        spaceId: spaceId || '',
      },
    });
  });
};

export const useGetJiraSites = () => {
  return useMutation(() => {
    return client.get(`/api/tasks/get-jira-sites`);
  });
};

export const useCreateTask = () => {
  return useMutation((body) => {
    return client.post('/api/tasks/create-task', body);
  });
};

export const useGetTaskById = (id) => {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => {
      return client.get(`/api/tasks/task-details/${id}`);
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

export const useCreateJiraTask = () => {
  return useMutation(({ id, body }) => {
    return client.post(`/api/tasks/create-jira-issue/${id}`, body);
  });
};

export const useGetTasksByFilter = () => {
  return useMutation(({ id, filters }) => {
    return client.post(`/api/tasks/project-tasks/${id}`, filters, {
      params: {
        search: filters.search || '',
        page: filters.page || 0,
        perPage: filters.perPage,
      },
    });
  });
};

export const useRefreshToken = () => {
  return useMutation(() => {
    return client.post(`/api/tasks/refresh-jira-token`);
  });
};

export const useJiraProjects = () => {
  return useMutation((id) => {
    return client.get(`api/tasks/get-jira-site-projects/${id}`);
  });
};

export const useGetIssuesType = () => {
  return useMutation(({ id, projectId }) => {
    return client.get(`/api/tasks/get-issue-type-for-a-project/${id}`, {
      params: {
        projectId: projectId || '',
      },
    });
  });
};

export const useGetJiraUsers = () => {
  return useMutation(({ id, projectId }) => {
    return client.get(`/api/tasks/get-members-for-a-project/${id}`, {
      params: {
        projectId: projectId || '',
      },
    });
  });
};

export const useDeleteClickUpTask = () => {
  return useMutation(({ id, body }) => {
    return client.delete(`/api/tasks/delete-task/${id}`, { data: body });
  });
};

export const useUpdateClickUpTask = () => {
  return useMutation(({ id, body }) => {
    return client.put(`/api/tasks/clickup-task/${id}`, body);
  });
};

export const useUpdateJiraTask = () => {
  return useMutation(({ id, body }) => {
    return client.put(`/api/tasks/jira-task/${id}`, body);
  });
};
