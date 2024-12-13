import { initializeApp } from 'firebase/app';
import { getToken, getMessaging, onMessage } from 'firebase/messaging';

import { toastNotification } from 'hooks/use-toaster';

import { changeWorkspace } from 'api/v1/settings/user-management';

import { envObject } from 'constants/environmental';

import { getUserData } from '../utils/user-data';

const {
  FIREBASE_APPID,
  FIREBASE_APIKEY,
  FIREBASE_VAPIDKEY,
  FIREBASE_PROJECTID,
  FIREBASE_AUTHDOMAIN,
  FIREBASE_MEASUREMENTID,
  FIREBASE_STORAGEBUCKET,
  FIREBASE_MESSAGINGSENDERID,
} = envObject;

const firebaseConfig = {
  apiKey: FIREBASE_APIKEY,
  authDomain: FIREBASE_AUTHDOMAIN,
  projectId: FIREBASE_PROJECTID,
  storageBucket: FIREBASE_STORAGEBUCKET,
  messagingSenderId: FIREBASE_MESSAGINGSENDERID,
  appId: FIREBASE_APPID,
  measurementId: FIREBASE_MEASUREMENTID,
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const getOrRegisterServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    const serviceWorkerConfig = encodeURIComponent(JSON.stringify(firebaseConfig));

    return window.navigator.serviceWorker.getRegistration('/firebase-push-notification-scope').then((serviceWorker) => {
      if (serviceWorker) return serviceWorker;

      return window.navigator.serviceWorker.register(
        `./firebase-messaging-sw.js?firebaseconfig=${serviceWorkerConfig}`,
        {
          scope: '/firebase-push-notification-scope',
        },
      );
    });
  }

  throw new Error('The browser doesn`t support service worker.');
};

export const getFirebaseToken = () =>
  getOrRegisterServiceWorker().then((serviceWorkerRegistration) =>
    getToken(messaging, {
      vapidKey: FIREBASE_VAPIDKEY,
      serviceWorkerRegistration,
    }),
  );

export const messageInitialization = () => {
  console.log('i m HERE');

  return new Promise((resolve) => {
    console.log('INSIE PROMISE');
    onMessage(messaging, (payload) => {
      console.log('message Received');
      onForegroundMessage(payload);
    });
    console.log('after promise');

    navigator.serviceWorker.addEventListener('message', (event) => {
      const { type, data } = event.data;
      console.log('message Received in service Worker Registry');

      if (type === 'notificationClicked') {
        // NOTE: console.log('i am called from background Message');
        // NOTE: Call your updateWorkspace function with the data from the notification
        updateWorkspace(data);
      }
    });
    console.log('after service Worker Registry');

    resolve({ msg: 'Notification Initialized' });
    console.log('after resolve');
  });
};

export const onForegroundMessage = (payload) => {
  const { data } = payload;
  console.log('ForegroundNotification', { payload });

  const options = {
    hideProgressBar: false,
    icon: false,
    autoClose: 5000,
    newestOnTop: true,
    closeOnClick: false,
  };

  const NotificationOptions = {
    title: data.title || '',
    body: data.body || '',
    icon: data?.actorImage || '', // NOTE: Set the path to your custom icon
    onClick:
      payload?.data?.lastAccessedWorkspace &&
      payload?.data?.lastAccessedWorkspace !== getUserData()?.lastAccessedWorkspace
        ? () => updateWorkspace(data)
        : () => handleChangeWorkSpaceClick(data),
  };

  toastNotification({ options, ...NotificationOptions });
};

export const updateWorkspace = async (data) => {
  try {
    if (data?.lastAccessedWorkspace) {
      const userDetails = getUserData();

      const _getAllWorkspaces = userDetails.workspaces;

      if (!_getAllWorkspaces || !_getAllWorkspaces.length) {
        return false;
      }

      const newWorkspace = _getAllWorkspaces?.find((x) => x.workSpaceId === data.lastAccessedWorkspace);

      const res = await changeWorkspace(data.lastAccessedWorkspace);
      // NOTE: toastSuccess(res?.msg);

      if (res?.msg === 'Workspace changed successfully') {
        localStorage.setItem(
          'user',
          JSON.stringify({
            ...userDetails,
            role: newWorkspace.role,
            lastAccessedWorkspace: data.lastAccessedWorkspace,
            lastAccessedWorkspaceName: newWorkspace?.name,
            activePlan: newWorkspace.plan,
          }),
        );
        handleChangeWorkSpaceClick(data);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const handleChangeWorkSpaceClick = (data) => {
  const url = data.redirectUrl;
  window.location.href = url;
};
