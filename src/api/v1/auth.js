import { useMutation } from 'react-query';

import client from 'api/axios-config';

export const useLogin = () => {
  return useMutation((body) => {
    return client.post(`/api/auth/login`, body);
  });
};

export const useLogout = () => {
  return useMutation(() => {
    return client.post(`/api/auth/logout`);
  });
};

export const useSignup = () => {
  return useMutation((body) => {
    return client.post(`/api/auth/sign-up`, body);
  });
};

export const useResendOtp = () => {
  return useMutation((body) => {
    return client.post(`/api/auth/resend-otp`, body);
  });
};

export const useActivate = () => {
  return useMutation((body) => {
    return client.post(`/api/auth/activate-account`, body);
  });
};

export const useOnboarding = () => {
  return useMutation((body) => {
    return client.post(`/api/auth/onboarding`, body);
  });
};

export const useForgotPassword = () => {
  return useMutation((body) => {
    return client.post(`/api/users/forgot-password`, body);
  });
};

export const useResetPassword = () => {
  return useMutation((body) => {
    return client.post(`/api/users/set-new-password`, body);
  });
};

export const useAcceptInvite = () => {
  return useMutation((body) => {
    return client.post(`/api/users/accept-invite`, body);
  });
};

export const useRejectInvite = () => {
  return useMutation((body) => {
    return client.post(`/api/users/reject-invite`, body);
  });
};

export function googleSignIn(body) {
  return client.post(`/api/auth/google-login`, body);
}

export const useGoogleSignIn = () => {
  return useMutation((body) => {
    return client.post(`/api/auth/google-login`, body);
  });
};
