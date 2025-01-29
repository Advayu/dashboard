import React from 'react';

interface HamburgerIconProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const HamburgerIcon: React.FC<HamburgerIconProps> = ({ isOpen, toggleMenu }) => {
  return (
    <button onClick={toggleMenu} className="focus:outline-none">
      {isOpen ? (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      ) : (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      )}
    </button>
  );
};

export default HamburgerIcon;