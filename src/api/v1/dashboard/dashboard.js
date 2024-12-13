import { useMutation, useQuery } from 'react-query';

import client from 'api/axios-config';

import { getUserData } from 'utils/user-data';

const activePlan = getUserData()?.activePlan;

export const useGetQaReport = () => {
  return useMutation((filters) => {
    return activePlan !== 'Free' ? client.post('api/reports/get-qa-reports', filters) : ``;
  });
};

export const useGetDevReport = () => {
  return useMutation((filters) => {
    return activePlan !== 'Free' ? client.post('/api/widgets/developer-reports', filters) : ``;
  });
};

export const getOverallAnalytics = () => {
  return client.get(`/api/widgets/admin-analytics-widget/`);
};

export function useGetOverallAnalytics({ viewAs, onSuccess = () => {} }) {
  return useQuery({
    queryKey: ['allAnalytics', viewAs],
    queryFn: () => {
      return client.get('/api/widgets/admin-analytics-widget/', {
        params: {
          viewAs,
        },
      });
    },
    refetchOnWindowFocus: false,
    onSuccess,
  });
}

// NOTE: Developer Dashboard

export function useGetDevAnalytics({ viewAs, onSuccess = () => {} }) {
  return useQuery({
    queryKey: ['devAnalytics', viewAs],
    queryFn: () => {
      return client.get('/api/widgets/developer-analytics-widget', {
        params: {
          viewAs,
        },
      });
    },
    refetchOnWindowFocus: false,
    onSuccess,
  });
}

export function useGetHighSeverityBugsWidget({ page, viewAs, perPage, onSuccess = () => {} }) {
  return useQuery({
    queryKey: ['highSeverityBugs', page, viewAs, perPage],
    queryFn: () => {
      return client.get('/api/widgets/high-severity-bugs-widget', {
        params: {
          page: page || 0,
          perPage,
          viewAs,
        },
      });
    },
    refetchOnWindowFocus: false,
    onSuccess,
  });
}

export function useGetReproducibleBugsWidget({ page, viewAs, perPage, onSuccess = () => {} }) {
  return useQuery({
    queryKey: ['reproducibleBugs', page, viewAs, perPage],
    queryFn: () => {
      return client.get('/api/widgets/recent-reproducible-bugs-widget', {
        params: {
          page: page || 0,
          perPage,
          viewAs,
        },
      });
    },
    refetchOnWindowFocus: false,
    onSuccess,
  });
}

export function useGetAssignedBugsWidget({ page, viewAs, perPage, onSuccess = () => {} }) {
  return useQuery({
    queryKey: ['assignedBugs', page, viewAs, perPage],
    queryFn: () => {
      return client.get('/api/widgets/recent-assigned-bugs-widget', {
        params: {
          page: page || 0,
          perPage,
          viewAs,
        },
      });
    },
    refetchOnWindowFocus: false,
    onSuccess,
  });
}

export function useGetOpenedBugsWidget({ page, viewAs, perPage, onSuccess = () => {} }) {
  return useQuery({
    queryKey: ['openedBugs', page, perPage, viewAs],
    queryFn: () => {
      return client.get('/api/widgets/recent-opened-bugs-widget', {
        params: {
          page: page || 0,
          perPage,
          viewAs,
        },
      });
    },
    refetchOnWindowFocus: false,
    onSuccess,
  });
}

// NOTE: QA Dashboard

export const getQaAnalytics = () => {
  return client.get(`/api/widgets/qa-analytics-widget/`);
};

export function useGetQaAnalytics({ viewAs, onSuccess = () => {} }) {
  return useQuery({
    queryKey: ['qaAnalytics', viewAs],
    queryFn: () => {
      return client.get('/api/widgets/qa-analytics-widget', {
        params: {
          viewAs,
        },
      });
    },
    refetchOnWindowFocus: false,
    onSuccess,
  });
}

export function useGetMyReportedBugsWidget({ page, viewAs, perPage, onSuccess = () => {} }) {
  return useQuery({
    queryKey: ['MyReportedBugs', page, viewAs, perPage],
    queryFn: () => {
      return client.get('/api/widgets/qa-reported-bugs-widget', {
        params: {
          page: page || 0,
          perPage,
          viewAs,
        },
      });
    },
    refetchOnWindowFocus: false,
    onSuccess,
  });
}
