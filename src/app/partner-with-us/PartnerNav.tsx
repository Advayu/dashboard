"use client";
import Image from "next/image";
import { useMediaQuery } from "@mui/material";
import Logo from "../../../public/logo/advayuClubLogo.svg";
import contact from "../../../public/image/contact.svg";

const PartnerNav = () => {
  const isSmallDevice = useMediaQuery("(max-width: 767px)");

  return (
    <nav className="flex justify-between items-center w-full px-4 md:px-8 py-12">
      {/* Logo section */}
      <div className="flex items-center">
        <Image src={Logo} alt="Advayu Club" priority className="pr-2" />
      </div>

      {/* Contact information section */}
      <div className="flex items-center">
        {isSmallDevice ? (
          <Image src={contact} alt="Contact" priority />
        ) : (
          <div className="flex items-center">
            <p className="px-4">support@advayu.club</p>
            <p>+91 9660657811</p>
          </div>
        )}
      </div>
    </nav>
  );
};

export default PartnerNav;
