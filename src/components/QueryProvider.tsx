"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Provider } from "react-redux";
import store, { persistor } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { ToastProvider } from "./ui/toast";
import { Toaster } from "./ui/toaster";

interface Props {
  children: React.ReactNode;
}

const QueryProvider = ({ children }: Props) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <ToastProvider>
              <Toaster />
              {children}
            </ToastProvider>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </>
  );
};

export default QueryProvider;
