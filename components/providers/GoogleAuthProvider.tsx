'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';

export default function GoogleAuthProvider({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // We only wrap with the provider if we have a client ID.
  // The ContinueWithGoogle component is now smart enough to detect 
  // the missing ID and avoid calling hooks that would cause a crash.
  if (!clientId) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[GoogleAuthProvider] Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID. Google features will be disabled.');
    }
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
