import React from 'react';
import logo from '../../../public/logo/LogoDark.svg';
import Image from 'next/image';

const Logo = () => {
    return (
        <Image className='' src={logo} alt="logo" objectFit='cover' />

    );
}

export default Logo;