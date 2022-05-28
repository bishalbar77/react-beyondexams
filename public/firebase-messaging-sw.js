// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.6.7/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.6.7/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyCgT-OOgQjmFCk8eLn35FBF7GOe2_pdYHA",
  authDomain: "learnwith.firebaseapp.com",
  databaseURL: "https://learnwith.firebaseio.com",
  projectId: "learnwithyoutube",
  storageBucket: "learnwithyoutube.appspot.com",
  messagingSenderId: "900314936887",
  appId: "1:900314936887:web:b53eb35e3f7d5f827971b2",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    badge: "https://api.beyondexams.org/images/instgram%20profile.jpg",
    icon: "https://api.beyondexams.org/images/instgram%20profile.jpg",
    image: "https://api.beyondexams.org/images/instgram%20profile.jpg",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
  // self.addEventListener("notificationclick", function (event) {
  //   let url = "https://www.beyondexams.org/";
  //   event.notification.close(); // Android needs explicit close.
  //   event.waitUntil(
  //     clients.matchAll({ type: "window" }).then((windowClients) => {
  //       // Check if there is already a window/tab open with the target URL
  //       for (var i = 0; i < windowClients.length; i++) {
  //         var client = windowClients[i];
  //         // If so, just focus it.
  //         if (client.url === url && "focus" in client) {
  //           return client.focus();
  //         }
  //       }
  //       // If not, then open the target URL in a new window/tab.
  //       if (clients.openWindow) {
  //         return clients.openWindow(url);
  //       }
  //     })
  //   );
  // });
});
