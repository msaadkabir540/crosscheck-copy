import { useMutation } from 'react-query';

import client from 'api/axios-config';

export const useAddAnonymousCheckComment = () => {
  return useMutation(({ body }) => {
    return client.post(`/api/guest-comment/`, body);
  });
};

export const useInviteUsers = () => {
  return useMutation(({ checkId, body }) => {
    return client.put(`/api/checks/invite-users/${checkId}`, body);
  });
};

export const useRemoveUserFromCheck = () => {
  return useMutation(({ checkId, body }) => {
    return client.delete(`/api/checks/remove-user/${checkId}`, { data: body });
  });
};

export const useRequestAccess = () => {
  return useMutation(({ checkId, body }) => {
    return client.post(`/api/checks/request-access/${checkId}`, { data: body });
  });
};

export const useGrantCheckAccess = () => {
  return useMutation(({ checkId, body }) => {
    return client.put(`/api/checks/grant-access/${checkId}`, body);
  });
};

export const useRejectAccess = () => {
  return useMutation(({ checkId, body }) => {
    return client.put(`/api/checks/reject-access/${checkId}`, body);
  });
};

export const useActivatePublicLink = () => {
  return useMutation(({ checkId }) => {
    return client.put(`/api/checks/activate-public-link/${checkId}`);
  });
};

export const useDeactivePublicLink = () => {
  return useMutation(({ checkId }) => {
    return client.put(`/api/checks/deactivate-public-link/${checkId}`);
  });
};
