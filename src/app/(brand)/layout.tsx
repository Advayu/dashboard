"use client";

import Sidebar from "@/components/layout/sidebar";
import CreateOffer from "./offers/add/page";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import store from "@/store/store";
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/protected-route";

const PartnerDashboard = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const pathname = usePathname();
  const condition1 = pathname.startsWith("/offers/");
  const condition2 = pathname.startsWith("/store/");
  const condition3 = pathname.startsWith("/brand/");

  const condition = condition1 || condition2 || condition3;
  const queryClient = new QueryClient();
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ProtectedRoute>
          <div className="flex pb-[calc(3rem+16px)]">
            {!condition && <Sidebar />}
            {children}
          </div>
        </ProtectedRoute>
      </QueryClientProvider>
    </Provider>
  );
};

export default PartnerDashboard;
