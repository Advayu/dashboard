import { ChevronLeft } from "lucide-react";
import React, { ReactNode } from "react";
import Image from "next/image";
import SupportIcon from "../../../../../../public/image/contact.svg";
import { navigateToPreviousPage } from "@/functions/function";

interface AddOutletLayoutProps {
  children: ReactNode;
}

const AddOutletLayout = ({ children }: AddOutletLayoutProps) => {
  return (
    <div className="grid grid-cols-1 w-full">
      {/* Header */}
      <Navbar />

      {/* Body (dynamic content) */}
      <div className="flex flex-col min-h-screen md:mx-[30vw]   mx-10">
        <div className="flex flex-col items-start">
          <h1 className="text-2xl md:text-4xl font-bold">Outlet Details</h1>
          <p className="mt-2 text-sm md:text-base">Name, store, and address</p>
        </div>
        {children}
      </div>
    </div>
  );
};

const Navbar = () => {
  return (
    <div className="flex justify-between my-10 mx-8 items-center">
      <div className="flex items-center">
        <button className="flex items-center">
          <ChevronLeft onClick={navigateToPreviousPage} />
          <h1 className="md:text-3xl font-black"> New Outlet</h1>
        </button>
      </div>
      <div className="md:flex hidden flex-col md:flex-row space-x-4 mx-2 items-center">
        <h3 className="md:text-xl text-xs">support@advayu.club</h3>
        <h3 className="md:text-xl text-xs">+91 9123456789</h3>
      </div>
      <Image className="md:hidden block" src={SupportIcon} alt="support" />
    </div>
  );
};

export default AddOutletLayout;
