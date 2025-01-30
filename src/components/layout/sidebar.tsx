import React, { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Logo from "../../../public/logo/Advayu_DarkSymbol.svg";
import LogoActive from "../../../public/logo/LogoActive.svg";
// SVG Icons
const CouponIcon: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-ticket-percent">
    <path d="M2 9a3 3 0 1 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
    <path d="M9 9h.01" />
    <path d="m15 9-6 6" />
    <path d="M15 15h.01" />
  </svg>
);

const SettingIcon: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-settings">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const StoreIcon: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-store">
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
    <path d="M2 7h20" />
    <path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7" />
  </svg>
);

const ComponentIcon: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-component">
    <path d="M5.5 8.5 9 12l-3.5 3.5L2 12l3.5-3.5Z" />
    <path d="m12 2 3.5 3.5L12 9 8.5 5.5 12 2Z" />
    <path d="M18.5 8.5 22 12l-3.5 3.5L15 12l3.5-3.5Z" />
    <path d="m12 15 3.5 3.5L12 22l-3.5-3.5L12 15Z" />
  </svg>
);

interface LogoIconProps {
  fill: string;
}

const LogoIcon: React.FC<LogoIconProps> = ({ fill }) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 57 57"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_857_597)">
      <path
        d="M28.0908 56.7844C43.564 56.7844 56.1075 44.241 56.1075 28.768C56.1075 13.2949 43.564 0.751465 28.0908 0.751465C12.6177 0.751465 0.0742188 13.2949 0.0742188 28.768C0.0742188 44.241 12.6177 56.7844 28.0908 56.7844Z"
        fill={fill}
      />
      <path
        d="M16.2959 23.0016C19.1042 23.0016 21.9125 23.0182 24.7208 23.0016C27.3297 22.985 28.3268 21.2901 27.147 18.9637C26.0336 16.7702 24.9203 14.5934 23.8235 12.3833C22.544 9.82424 23.2585 7.14888 25.5019 6.01891C27.9113 4.80586 30.4039 5.7198 31.7499 8.34531C37.1339 18.7975 42.5179 29.233 47.8852 39.6852C49.2312 42.3107 48.633 44.7535 46.3897 45.9C43.9968 47.1297 41.3214 46.1825 39.9754 43.6069C38.3802 40.5826 36.7683 37.5582 35.2229 34.5007C34.2757 32.6063 32.83 31.6758 30.703 31.7589C29.3404 31.8087 27.9778 31.7755 26.6152 31.7589C24.7042 31.7256 23.3749 32.6063 22.4941 34.2847C20.7826 37.5915 19.071 40.8983 17.293 44.1885C16.3624 45.9 14.5013 46.6478 12.4407 46.2822C10.7292 45.9831 9.33331 44.7202 9.15052 42.9588C9.05082 42.0116 9.23361 40.9315 9.6158 40.0508C10.43 38.2063 11.4437 36.4615 12.3909 34.6669C13.4378 32.6894 12.906 31.7589 10.7125 31.7589C9.6158 31.7589 8.51907 31.7589 7.42233 31.7422C4.76358 31.6924 2.91907 29.9974 2.90245 27.6046C2.88583 25.1452 4.84666 23.0182 7.33924 22.9684C10.3137 22.9518 13.3048 23.0016 16.2959 23.0016Z"
        fill="white"
        stroke="black"
        strokeWidth="1.12527"
        strokeMiterlimit="10"
      />
    </g>
    <defs>
      <clipPath id="clip0_857_597">
        <rect
          width="56"
          height="55.9997"
          fill="white"
          transform="translate(0.03125 0.734375)"
        />
      </clipPath>
    </defs>
  </svg>
);

interface SidebarItemProps {
  href: string;
  Icon: FC;
  altText: string;
}

const Sidebar: FC = () => {
  const pathname = usePathname();
  const isActive = pathname === "/";

  const items = [
    { href: "/offers", Icon: CouponIcon, altText: "Coupon" },
    { href: "/store", Icon: StoreIcon, altText: "Store" },
    // { href: "#", Icon: ComponentIcon, altText: "Component" },
    { href: "/setting", Icon: SettingIcon, altText: "Setting" },
  ];

  return (
    <>
      <aside className=" hidden md:flex flex-col items-center bg-gradient-to-b from-blueTilt/5 to-blueTilt/20 px-4 pt-16 w-24 h-[23rem] rounded-br-full">
        <Link href="/">
          {/* <Image
          src={isActive ? LogoActive : Logo} 
          alt="Advayu Logo"
          width={40}
          height={40}
        /> */}
          <LogoIcon fill={isActive ? "#199EAD" : "black"} />
        </Link>
        <ul className="list-none p-0 mt-9">
          {items.map(({ href, Icon, altText }) => (
            <SidebarItem key={href} href={href} Icon={Icon} altText={altText} />
          ))}
        </ul>
      </aside>
      {/* nav bar for small device that is fixed in the bottom */}
      <nav className="custom-shadow z-[1000] md:hidden fixed bottom-0 left-0 w-full bg-white px-4 py-3 flex justify-around items-center mx-auto ">
        {/* <LogoIcon fill={isActive ? "#199EAD" : "black"} /> */}
        <ul className="list-none flex justify-around items-center w-full bg-white">
          <li>
            <Link href="/">
              <LogoIcon fill={isActive ? "#199EAD" : "black"} />
            </Link>
          </li>
          {items.map(({ href, Icon, altText }) => (
            <SidebarItem key={href} href={href} Icon={Icon} altText={altText} />
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;

const SidebarItem: FC<SidebarItemProps> = ({ href, Icon, altText }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li
      className={`w-29 flex items-center p-2 my-2 rounded-lg cursor-pointer md:transition-colors duration-200 hover:text-blueTilt ${
        isActive ? "text-blueTilt" : "text-gray-700"
      }`}>
      <Link href={href} className="flex items-center">
        <Icon />
        <span className="sr-only">{altText}</span>
      </Link>
    </li>
  );
};
