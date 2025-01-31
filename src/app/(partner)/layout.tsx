"use client";

import Sidebar from "@/components/layout/sidebar";
import CreateOffer from "./offers/add/page";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import store from "@/store/store";
import { Toaster } from "@/components/ui/toaster";

const PartnerDashboard = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const pathname = usePathname();
  const condition1 = pathname.startsWith("/offers/");
  const condition2 = pathname.startsWith("/store/");
  const condition3 = pathname.startsWith("/brand/");

  const condition = condition1 || condition2 || condition3;

  return (
    <Provider store={store}>
      <Toaster />
      <div className="flex pb-[calc(3rem+16px)]">
        {!condition && <Sidebar />}
        {children}
      </div>
    </Provider>
  );
};

export default PartnerDashboard;
