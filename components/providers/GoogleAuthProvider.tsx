'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';

export default function GoogleAuthProvider({ children }: { children: React.ReactNode }) {
  // Use the ID from env, or a fallback string if missing to prevent crashing
  // but allowing the Google buttons to render and be clickable for debugging.
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "missing-id-check-env-vars";

  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    console.warn('[GoogleAuthProvider] NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing. Google Sign-In will fail.');
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
