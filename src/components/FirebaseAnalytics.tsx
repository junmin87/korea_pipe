"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAnalytics,
  isSupported,
  logEvent,
  type Analytics,
} from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

function getFirebaseApp(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export default function FirebaseAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Firebase web config is public, but a missing API key means it isn't
    // configured for this environment — silently do nothing.
    if (!firebaseConfig.apiKey) {
      return;
    }

    let analytics: Analytics | null = null;

    isSupported()
      .then((supported) => {
        if (!supported) {
          return;
        }

        analytics = getAnalytics(getFirebaseApp());
        logEvent(analytics, "page_view", {
          page_path: pathname,
          page_location: window.location.href,
          page_title: document.title,
        });
      })
      .catch(() => {
        // Analytics is best-effort; never surface errors to the page.
      });
  }, [pathname]);

  return null;
}
