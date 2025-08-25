import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import { ToastProvider } from './components.tsx';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbGb4XsANv9TC8Mq4Ier_n5VIO64r0oww",
  authDomain: "t-bahk.firebaseapp.com",
  projectId: "t-bahk",
  storageBucket: "t-bahk.firebasestorage.app",
  messagingSenderId: "106861767355",
  appId: "1:106861767355:web:a8bb7bd3b738e1b612d79e",
  measurementId: "G-2QME0RJ3BB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ToastProvider>
        <App auth={auth} />
      </ToastProvider>
    </React.StrictMode>
  );
}