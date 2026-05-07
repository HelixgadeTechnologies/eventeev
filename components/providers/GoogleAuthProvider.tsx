'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';

export default function GoogleAuthProvider({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    console.warn('[GoogleAuthProvider] NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing. Google Sign-In will be disabled.');
    // We still return children so the app doesn't crash, but we don't wrap in GoogleOAuthProvider
    // if we want to avoid the "Missing required parameter" error. 
    // However, @react-oauth/google usually needs to wrap everything that uses its hooks.
    // So we'll pass a dummy string but we'll handle the actual click in the button component.
    return (
      <GoogleOAuthProvider clientId="missing-config">
        {children}
      </GoogleOAuthProvider>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
