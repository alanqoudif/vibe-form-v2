"use client";

import { ErrorBoundaryWrapper } from "@/components/error-boundary";
import { LocaleProvider } from "./locale-provider";

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundaryWrapper>
      <LocaleProvider>
        {children}
      </LocaleProvider>
    </ErrorBoundaryWrapper>
  );
}

