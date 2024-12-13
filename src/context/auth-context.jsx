import React from 'react';

// NOTE: third party
import { jwtDecode } from 'jwt-decode';

// NOTE: utils
import { setToken, getToken, removeToken } from 'utils/token';

const AuthContext = React.createContext();

export function AuthContextProvider({ children }) {
  const [authState, setAuthState] = React.useState(null);

  const setAuthToken = (token) => {
    if (token) {
      setToken(token);
      setAuthState(jwtDecode(token));
    } else {
      removeToken();
      setAuthState(null);
    }
  };

  React.useEffect(() => {
    const accessToken = getToken();
    setAuthToken(accessToken);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token: authState,
        setAuthToken,
        // NOTE: @Todo remove below variables after completion 2.0
        userData: authState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = React.useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuthContext can only be used inside AuthProvider');
  }

  return context;
}
