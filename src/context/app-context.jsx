import React from 'react';

const AppContext = React.createContext();

export function AppContextProvider({ children }) {
  const [userDetails, setUserDetails] = React.useState({});

  const setUserData = (data) => {
    if (data) {
      setUserDetails(data);
    } else {
      setUserDetails(null);
    }
  };

  const storedUserData = localStorage.getItem('user');

  React.useEffect(() => {
    const userData = localStorage.getItem('user');
    userData && setUserDetails(JSON.parse(userData));
  }, [storedUserData]);

  return (
    <AppContext.Provider
      value={{
        userDetails,

        // NOTE: @Todo remove below variables after completion 2.0
        setUserDetails: setUserData,
        updateUserDetails: setUserDetails,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = React.useContext(AppContext);

  if (context === undefined) {
    throw new Error('useAppContext can only be used inside AppProvider');
  }

  return context;
}
