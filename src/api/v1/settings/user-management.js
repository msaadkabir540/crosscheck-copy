import { useInfiniteQuery, useMutation, useQuery } from 'react-query';

import client from 'api/axios-config';

import { getUserData } from 'utils/user-data';

const activePlan = getUserData()?.activePlan;

export const getUsers = ({ sortBy, sort, search, page, perPage }) => {
  return client.get('/api/users/get-users', {
    params: {
      sortBy,
      sort,
      search,
      page: page || 0,
      perPage,
    },
  });
};

export const changeWorkspace = (id) => {
  client.defaults.headers.common['last-accessed-workspace'] = id;

  return client.post(`/api/auth/change-workspace`);
};

export function useGetUsers({ sortBy, sort, search, page, perPage, onSuccess = () => {} }) {
  return useQuery({
    queryKey: ['allUser', sortBy, sort, search, page, perPage],
    queryFn: () => {
      return client.get('/api/users/get-users', {
        params: {
          sortBy,
          sort,
          search,
          page: page || 0,
          perPage,
        },
      });
    },

    refetchOnWindowFocus: false,
    onSuccess,
  });
}

export function useGetInfiniteUsers({ sortBy, sort, search, page, perPage, getNextPageParam }) {
  return useInfiniteQuery({
    queryKey: ['paginatedDataForUsers', search, sortBy, sort, page],
    queryFn: () => {
      return client.get('/api/users/get-users', {
        params: { sortBy, sort, search, page, perPage },
      });
    },
    refetchOnWindowFocus: false,
    getNextPageParam,
  });
}

export function useGetUserById(id) {
  return useQuery({
    queryKey: `user${id}`,
    queryFn: () => {
      return client.get(`/api/users/get-user-by-id/${id}`);
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
}

export function useCreateUser() {
  return useMutation((body) => {
    return client.post('/api/users/add-user', body);
  });
}

export function useDeleteUser() {
  return useMutation((id) => {
    return client.delete(`/api/users/delete-user/${id}`);
  });
}

export function useDarkMoodToggle() {
  return useMutation((id) => {
    return client.put(`/api/users/dark-mode-toggle/${id}`);
  });
}

export function useUpdateUser() {
  return useMutation(({ id, body }) => {
    return client.put(`/api/users/edit-user/${id}`, body);
  });
}

export function useUpdateUserPassword() {
  return useMutation(({ id, body }) => {
    return client.put(`/api/users/change-password/${id}`, body);
  });
}

export function useToggleUserStatus() {
  return useMutation(({ id, user }) => {
    return client.put(`/api/users/toggle/${id}`, user);
  });
}

export function useUpdateAccount() {
  return useMutation(({ body }) => {
    return client.put(`/api/users/account-setting`, body);
  });
}

export function useDeleteWorkspace() {
  return useMutation(({ body }) => {
    return client.delete(`/api/auth/delete-workspace`, { data: body });
  });
}

export function useUpdateWorkspace() {
  return useMutation(({ body }) => {
    return client.put(`/api/auth/edit-workspace`, body);
  });
}

export function useVerifyEmail() {
  return useMutation(({ id, otp }) => {
    return client.put(`/api/users/verify-email-link/${id}`, { otp });
  });
}

export const useConnectClickUp = () => {
  return useMutation((body) => {
    return activePlan ? client.post('/api/tasks/authorize-clickup-user', body) : ``;
  });
};

export const useConnectJira = () => {
  return useMutation((body) => {
    return activePlan ? client.post('/api/tasks/authorize-jira-user', body) : ``;
  });
};

export const useConnectGoogleDrive = () => {
  return useMutation((body) => {
    return activePlan ? client.post('/api/default-storage/integrate-google-drive', body) : ``;
  });
};

export const useConnectGoogleDriveUserLevel = () => {
  return useMutation((body) => {
    return client.post('/api/users/integrate-user-google-drive', body);
  });
};

export const useChangeDefaultStorage = () => {
  return useMutation((body) => {
    return client.post('/api/users/switch-user-default-storage', body);
  });
};

export const useConnectOneDrive = () => {
  return useMutation((body) => {
    return activePlan ? client.post('/api/default-storage/integrate-one-drive', body) : ``;
  });
};

export const useConnectSlack = () => {
  return useMutation((body) => {
    return activePlan ? client.post('/api/slack/integrate-slack', body) : ``;
  });
};

export function useUpdateUserRole() {
  return useMutation(({ id, body }) => {
    return client.put(`/api/users/change-role/${id}`, body);
  });
}

export function useRemoveUser() {
  return useMutation(({ body }) => {
    return client.post(`/api/users/remove-member`, body);
  });
}

export function useInviteUser() {
  return useMutation(({ body }) => {
    return client.post(`/api/users/invite-member`, body);
  });
}

export function useSetSlackNotification() {
  return useMutation(({ body }) => {
    return client.post(`/api/slack/slack-notification`, body);
  });
}

export function useUpdateSlackNotification() {
  return useMutation(({ id, body }) => {
    return client.put(`/api/slack/slack-notification/${id}`, body);
  });
}

export const useUpdateClickUp = () => {
  return useMutation(({ id, body }) => {
    return client.put(`/api/users/change-clickup-id/${id}`, body);
  });
};

export const useChangeWorkspace = () => {
  return useMutation((id) => {
    client.defaults.headers.common['last-accessed-workspace'] = id;

    return client.post(`/api/auth/change-workspace`);
  });
};

export const useGetMyWorkspaces = (signUpMode) => {
  return useQuery({
    queryKey: ['workspace'],
    queryFn: () => {
      return signUpMode !== 'Extension' && client.get(`/api/auth/my-workspaces`);
    },
    enabled: !!signUpMode,
    refetchOnWindowFocus: false,
  });
};

export const useGetInvitees = () => {
  return useMutation(() => {
    return client.get(`/api/users/get-invitees`);
  });
};

export const useGetSlackIntegrations = () => {
  return useMutation(() => {
    return client.get(`/api/slack/my-slack-integrations`);
  });
};

export const useGetSlackWorkflow = (slackId) => {
  return useQuery({
    queryKey: ['slackNotifications', slackId],
    queryFn: () => {
      return client.get(`/api/slack/slack-notification-workflows?slackId=${slackId}`);
    },
    enabled: !!slackId,
    refetchOnWindowFocus: false,
  });
};

export const useGetSlackChannels = (id) => {
  return useQuery({
    queryKey: ['slackChannels', id],
    queryFn: () => {
      return client.get(`/api/slack/channels/${id}`);
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

export function useDeleteWorkflow() {
  return useMutation((id) => {
    return client.delete(`/api/slack/remove-workflow/${id}`);
  });
}

export function useDisconnectSlack() {
  return useMutation((id) => {
    return client.delete(`/api/slack/disconnect-slack/${id}`);
  });
}
