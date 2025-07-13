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

interface Props {
  children: React.ReactNode;
}

const UIProviders = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>
    <TooltipProvider>
      <Toaster />
      {children}
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
        </QueryClientProvider>
      </PersistGate>
    </Provider>
    // </ErrorBoundary>
  );
};

export default AppProviders;
