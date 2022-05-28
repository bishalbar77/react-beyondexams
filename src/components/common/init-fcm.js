import firebase from "firebase/app";
// import "firebase/messaging";
firebase.initializeApp({
  apiKey: "AIzaSyCgT-OOgQjmFCk8eLn35FBF7GOe2_pdYHA",
  authDomain: "learnwith.firebaseapp.com",
  databaseURL: "https://learnwith.firebaseio.com",
  projectId: "learnwithyoutube",
  storageBucket: "learnwithyoutube.appspot.com",
  messagingSenderId: "900314936887",
  appId: "1:900314936887:web:b53eb35e3f7d5f827971b2",
});

// messaging.usePublicVapidKey(
//   "BOe6ho-vNFU10Ebh5JDvTgVuHKoO2mgvGOM7ttB0TPhSg5Sw7BWGOIWH46dF8SFxeSJ17Kg9yQXDd691_vZ5TeY"
// );
// export default messaging;
export default firebase;
