importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: 'AIzaSyCEpwbu2Hi42Twgf4olerMbdY2mKCEm_PA',
  authDomain: 'kegel-app-94c37.firebaseapp.com',
  projectId: 'kegel-app-94c37',
  storageBucket: 'kegel-app-94c37.firebasestorage.app',
  messagingSenderId: '9827596791',
  appId: '1:9827596791:web:d8e649a6e5ca537d8496f2',
};

const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();