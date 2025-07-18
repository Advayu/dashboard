"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./ui/tooltip";
import { ToastProvider } from "./ui/toast";
import { Toaster } from "./ui/toaster";
import { ErrorBoundary } from "./ErrorBoundary";
import store, { persistor } from "@/store/store";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ConfirmDialogProvider } from "@/components/ui/confirm-dialog/ConfirmDialogProvider";

interface Props {
  children: React.ReactNode;
}

const UIProviders = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>
    <TooltipProvider>
      <ConfirmDialogProvider>
        <Toaster />
        {children}
      </ConfirmDialogProvider>
    </TooltipProvider>
  </ToastProvider>
);

const AppProviders = ({ children }: Props) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    // <ErrorBoundary>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <UIProviders>{children}</UIProviders>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </PersistGate>
    </Provider>

    // </ErrorBoundary>
  );
};

export default AppProviders;
