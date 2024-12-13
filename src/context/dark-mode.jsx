import React, { createContext } from 'react';

import { useToaster } from 'hooks/use-toaster';

import { useDarkMoodToggle } from 'api/v1/settings/user-management';

import { useAppContext } from './app-context';

const ModeContext = createContext();

const ModeProvider = ({ children }) => {
  const { toastError } = useToaster();

  const { userDetails, setUserDetails } = useAppContext();

  const { mutateAsync: _darkModeToggle } = useDarkMoodToggle();

  const toggleMode = async () => {
    try {
      const res = await _darkModeToggle(userDetails?.id);
      const userData = { ...userDetails, darkMode: res.darkMode };
      localStorage.setItem('user', JSON.stringify(userData));
      setUserDetails(userData);
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <ModeContext.Provider value={{ isDarkMode: userDetails.darkMode, toggleMode }}>{children}</ModeContext.Provider>
  );
};

const useMode = () => {
  const context = React.useContext(ModeContext);

  if (context === undefined) {
    throw new Error('useDarkContext can only be used inside DarkProvider');
  }

  return context;
};

export { ModeProvider, useMode };
