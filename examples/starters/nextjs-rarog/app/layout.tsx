import React from "react";
import "./globals.css";

// Rarog CSS (full build or JIT build, в реальном проекте импортируется из node_modules/rarog)
import "rarog/dist/rarog-core.min.css";
import "rarog/dist/rarog-utilities.min.css";
import "rarog/dist/rarog-components.min.css";
import "rarog/dist/rarog.jit.css";

import { RarogProvider } from "@rarog/react";

export const metadata = {
  title: "Rarog + Next.js starter",
  description: "Next.js 14 app router + Rarog CSS/JS + @rarog/react wrappers"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="theme-default">
      <body>
        <RarogProvider>
          {children}
        </RarogProvider>
      </body>
    </html>
  );
}
