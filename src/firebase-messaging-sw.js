importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyCgBVUqbGmguPEMOOI-ja5Pj4mLOhIOU00",
    authDomain: "easymeet-93346.firebaseapp.com",
    projectId: "easymeet-93346",
    storageBucket: "easymeet-93346.appspot.com", // Cambiado aquí
    messagingSenderId: "371173407",
    appId: "1:371173407:android:3c1c3677ff7974e0ca4d2a", // Cambiado aquí
    packageName: "com.nni.easy_meet"
});

const messaging = firebase.messaging();