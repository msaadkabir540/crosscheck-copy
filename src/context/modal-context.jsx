import { createContext, useState, useContext, useEffect } from 'react';

import { useJwt } from 'react-jwt';

import { getToken } from '../utils/token';

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const token = getToken();
  const { decodedToken } = useJwt(token);

  const [isSessionExpired, setIsSessionExpired] = useState(false);

  const showSessionExpiredModal = () => setIsSessionExpired(true);

  useEffect(() => {
    if (token && decodedToken) {
      const expTime = decodedToken?.exp;

      const interval = setInterval(() => {
        const currentTime = Math.floor(Date.now() / 1000);

        if (currentTime > expTime) {
          showSessionExpiredModal();
        }
      }, 1000 * 60);

      return () => clearInterval(interval);
    }
  }, [token, decodedToken]);

  return (
    <SessionContext.Provider value={{ isSessionExpired, showSessionExpiredModal }}>{children}</SessionContext.Provider>
  );
};
