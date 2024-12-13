import { useMutation } from 'react-query';

import client from 'api/axios-config';

export const useCreateCheckTask = () => {
  return useMutation((body) => {
    return client.post('/api/tasks/create-check-task', body);
  });
};

export const useCreateCheckJiraTask = () => {
  return useMutation(({ id, body }) => {
    return client.post(`/api/tasks/create-check-jira-issue/${id}`, body);
  });
};
