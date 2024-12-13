import { useCallback, useEffect, useRef } from 'react';

import { useUpdateFCMToken } from 'api/v1/settings/fcm';

import { getFirebaseToken, messageInitialization } from 'config/firebase';

const useNotification = () => {
  const ref = useRef(false);

  const { mutateAsync: _fcmTokenHandler } = useUpdateFCMToken();

  // NOTE: Function to update the token on the backend
  const updateTokenOnBackend = useCallback(
    async (newToken) => {
      try {
        await _fcmTokenHandler({ fcmToken: newToken });
      } catch (err) {
        throw new Error('An error occurred while sending token to backend');
      }
    },
    [_fcmTokenHandler],
  );

  const tokenGeneration = useCallback(async () => {
    try {
      getFirebaseToken()
        .then(async (firebaseToken) => {
          console.log('in use-notification.jsx (tokenGen fnc.)', { firebaseToken });

          if (firebaseToken) {
            await updateTokenOnBackend(firebaseToken); // NOTE: #TODO: send Token to Backend, use thisFunction updateTokenOnBackend()
            initializeMessaging();
          }
        })
        .catch((err) => console.error('An error occurred while retrieving firebase token. ', err));
    } catch (error) {
      console.error('Error during token generation:', error);
    }
  }, [updateTokenOnBackend]);

  const getNewTokenHandler = useCallback(async () => {
    try {
      if (Notification.permission === 'default' || Notification.permission === 'granted') {
        await tokenGeneration();
      }

      if (Notification.permission === 'denied') {
        console.warn('Notification Permission Denied ');
      }
    } catch (error) {
      console.error('Error getting permission or token:', error);
    }
  }, [tokenGeneration]);

  // NOTE: Function to initialize messaging for receiving messages
  const initializeMessaging = async () => {
    // NOTE: Implement initialization logic using 'onMessage' function
    messageInitialization()
      .then(() => {
        // NOTE: messaging is initialized
        console.log('hook message initilized');
      })
      .catch((err) => {
        console.log('hook message error', err);

        console.error('An error occured while retrieving foreground message. ', err);
      });
  };

  useEffect(() => {
    if (!ref.current) {
      // NOTE: Call the function to handle permission and token retrieval on component mount
      getNewTokenHandler();
      ref.current = true;
    }
  }, [getNewTokenHandler]);

  // NOTE: #todo:  make some function to remove message listening and remove serverWorker and return them
};

export default useNotification;
