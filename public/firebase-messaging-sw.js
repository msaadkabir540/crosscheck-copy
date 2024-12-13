importScripts('https://www.gstatic.com/firebasejs/10.6.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.6.0/firebase-messaging-compat.js');

const firebaseConfig = JSON.parse(new URL(location).searchParams.get('firebaseconfig'));

const { messagingSenderId, projectId, apiKey, appId } = firebaseConfig;

firebase.initializeApp({ messagingSenderId, projectId, apiKey, appId });

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('BackgroundNotification', { payload });

  const notificationTitle = payload.data.title;

  const notificationOptions = { body: payload.data.body, icon: payload.data.actorImage };

  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    clients.matchAll({ includeUncontrolled: true, type: 'window' }).then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'notificationClicked',
          data: payload.data,
        });
      });
    });
  });
  return self.registration.showNotification(notificationTitle, notificationOptions);
});
