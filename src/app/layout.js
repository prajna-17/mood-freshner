"use client";

import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>

      <body>
        <GoogleOAuthProvider clientId="96657188171-rjsohnkkm0gjcp0iodluc9523tknctrf.apps.googleusercontent.com">
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
