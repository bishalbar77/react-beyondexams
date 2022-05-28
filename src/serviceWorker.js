// const check = () => {
//   if (!("serviceWorker" in navigator)) {
//     console.log("No Service Worker support!");
//     return false;
//   } else if (!("PushManager" in window)) {
//     console.log("No Push API Support!");
//     return false;
//   } else return true;
// };
// const registerSW = async () => {
//   await navigator.serviceWorker.register("./firebase-messaging-sw.js");
// };
// const notification = async () => {
//   if (!("Notification" in window)) {
//     console.log("This browser does not support desktop notification");
//   } else if (Notification.permission === "default") {
//     Notification.requestPermission().then(async (res) => {
//       if (res === "granted") {
//         console.log(res);
//         await registerSW();
//       }
//     });
//   }
// };
// export const register = async () => {
//   if (check()) {
//     await notification();
//   }
// };
