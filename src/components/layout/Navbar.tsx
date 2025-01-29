"use client"
import React, { useState, useEffect } from 'react';
import Logo from '../../app/utility/Logo';
import HamburgerIcon from './HamburgerIcon';
import NavLinks from './NavLinks';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <nav className={`fixed top-0 left-0 w-full pt-66 px-4 z-50 transition-all duration-300 bg-white bg-opacity-90 ${isScrolled ? 'backdrop-blur-xl' : ''}`}>
            <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-white to-transparent"></div>

            <div className="py-2 flex justify-between items-center">
                <div className="flex-shrink-0 flex items-center">
                    <Logo />
                    <div className="hidden md:flex flex-col ml-2.5">
                        <h1 className="font-satoshi-medium font-black text-2xl">Advayu.Club</h1>
                        <p className="text-base">Unlocking Value</p>
                    </div>
                </div>
                <div className="md:hidden">
                    <HamburgerIcon isOpen={isMenuOpen} toggleMenu={toggleMenu} />
                </div>
                <div className="hidden md:flex">
                    <NavLinks isMenuOpen={true} />

                </div>
            </div>
            <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
                <NavLinks isMenuOpen={isMenuOpen} />
            </div>
        </nav>
    );
};

export default Navbar;