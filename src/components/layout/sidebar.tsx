import React, { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogoIcon,
  StoreIcon,
  SettingIcon,
  CouponIcon,
} from "@/components/icons";

interface SidebarItemProps {
  href: string;
  Icon: FC;
  altText: string;
}

const Sidebar: FC = () => {
  const pathname = usePathname();
  const isActive = pathname === "/";

  const items = [
    { href: "/", Icon: LogoIcon, altText: "Advayu Logo" },
    { href: "/offers", Icon: CouponIcon, altText: "Coupon" },
    { href: "/store", Icon: StoreIcon, altText: "Store" },
    { href: "/setting", Icon: SettingIcon, altText: "Setting" },
  ];

  return (
    <>
      <aside className=" hidden md:flex flex-col items-center bg-gradient-to-b from-blueTilt/5 to-blueTilt/20 px-4 pt-6 w-24 h-[25rem] rounded-br-full">
        <ul className="list-none p-0 mt-9 space-y-8">
          {items.map(({ href, Icon, altText }) => (
            <SidebarItem key={href} href={href} Icon={Icon} altText={altText} />
          ))}
        </ul>
      </aside>
      {/* nav bar for small device that is fixed in the bottom */}
      <nav className="custom-shadow z-[1000] md:hidden fixed bottom-0 left-0 w-full bg-white px-4 py-3 flex justify-around items-center mx-auto ">
        <ul className="list-none flex justify-around items-center w-full bg-white">
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
        isActive ? "text-blueTilt" : "text-black"
      }`}>
      <Link href={href} className="flex items-center">
        <Icon />

        <span className="sr-only">{altText}</span>
      </Link>
    </li>
  );
};
