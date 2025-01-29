import React from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinksProps {
  isMenuOpen: boolean;
}

const NavLink = ({ href, children }: { href: string, children: string }) => {
  return (
    <Link href={href}>
      {children}
    </Link>
  );
}

const NavLinks: React.FC<NavLinksProps> = ({ isMenuOpen }) => {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <div className={`antialiased flex-1 justify-self-center pb-3 mt-8 md:mt-0 md:flex md:items-center ${isMenuOpen ? "block" : "hidden"} md:block`}>
      <ul className={`flex flex-col items-center space-y-8 md:flex-row md:space-x-6 md:space-y-0 ${isMenuOpen ? "h-full justify-center" : ""}`}>
        <li className={isActive('/') ? 'active' : ''}>
          <NavLink href="/">
            Home
          </NavLink>
        </li>
        <li className={`${isActive("/brand") ? "active" : ""} hover:active`}>
          <NavLink href="/brand">
            Partner with us
          </NavLink>
        </li>
        <li className='hover:active'>
          <NavLink href="/">
            Build with us
          </NavLink>
        </li>
        <li className='hover:active'>
          <NavLink href="/">
            Blogs
          </NavLink>
        </li>
        <li className='hover:active'>
          <NavLink href="/contact">
            Contact Us
          </NavLink>
        </li>
        <li className='hover:active'>
          <Button variant="rounded">
            Explore offers
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default NavLinks;