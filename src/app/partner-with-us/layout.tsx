'use client'
import PartnerNav from "./PartnerNav";
import { Provider } from "react-redux";
import { EmailProvider } from "@/context/EmailContext"; //
import { onboardingStore } from "@/store/onboardingStore";
import { Toaster } from "@/components/ui/toaster"



const PartnerOnBoardingLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <EmailProvider>
        <Provider store={onboardingStore}>
        <PartnerNav />
        <Toaster /> 

        {children}

        </Provider>
      </EmailProvider>


    </>
  );
}

export default PartnerOnBoardingLayout;