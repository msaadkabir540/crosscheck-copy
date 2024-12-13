export const getUserData = () => {
  const userDataString = localStorage?.getItem('user') && localStorage?.getItem('user');

  if (userDataString) {
    try {
      const userData = JSON.parse(userDataString);

      return userData;
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
    }
  }

  return null;
};
