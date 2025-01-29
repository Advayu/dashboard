"use client";
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import logo from "../../../../public/logo/Advayu_DarkSymbol.svg";
import map from "../../../../public/image/user/Map.svg";
import logoFull from "../../../../public/logo/advayuClubLogo.svg";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const Page: NextPage = () => {
    const [step, setStep] = useState(1);
    const [otpSent, setOtpSent] = useState(false);

    const handleProcess = () => {
        if (step === 1) {
            setStep(2);
        } else if (step === 2 && otpSent) {
            // Add logic to handle OTP verification
        }
    };

    const handleGetOtp = () => {
        setOtpSent(true);
        // Add logic to send OTP here
    };

    const handleResendOtp = () => {
        // Add logic to resend OTP here
    };

    return (
        <>
            {/* parent div */}
            <div className="md:flex md:items-start items-center md:pt-9 md:pr-3 md:pb-4  relative">
                {/* left side */}
                <div className="flex  flex-1 flex-col relative">
                    <div className="flex md:static absolute top-0 right-0 p-4">
                        <div className="hidden md:block ">
                            <Image src={logoFull} alt="Logo" width={211} height={56} />
                        </div>
                        <Link className="underline font-bold text-base md:hidden" href={"/"}>
                            skip
                        </Link>
                    </div>
                    <div className="md:grow-0 flex-grow flex-2 flex flex-col justify-start md:rounded-r-full md:rounded-tl-none md:bg-gradient-to-l rounded-t-full bg-gradient-to-b from-blueTilt/10 to-blueTilt/0 h-3/4 mx-2 md:mx-0 mt-10 md:pt-10 md:pb-20 pt-20">
                        <div className="flex flex-col items-center justify-center md:items-start">
                            <div>
                                <Image className="md:hidden" src={logo} alt="Logo" width={32} height={32} />
                            </div>
                            <h1 className="text-base font-black md:px-8">
                                Let's get started!
                            </h1>
                        </div>
                        <div className="mt-4 px-8 ">
                            {step === 1 && (
                                <>
                                    <Label className="font-bold">
                                        What's your name?
                                    </Label>
                                    <Input className="bg-white w-full md:w-2/3" placeholder="Enter your name here" />
                                </>
                            )}
                            {step === 2 && (
                                <>
                                    <Label className="font-bold">
                                        Enter your mobile number and email ID
                                    </Label>
                                    <Input className="bg-white w-full mt-2" placeholder="Enter your Email ID or Phone number" />
                                    {otpSent ? (
                                        <div className="py-3 space-y-2">
                                            <Label className="font-bold mt-4">
                                                Enter the OTP sent to your mobile number
                                            </Label>
                                            <div className="flex space-x-2">
                                                <Input className="bg-white w-full flex-1" placeholder="Enter OTP here" />
                                                <p className="underline flex-1 cursor-pointer" onClick={handleResendOtp}>
                                                    Resend OTP
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <Button className="w-full mt-4" onClick={handleGetOtp}>
                                            Get OTP
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>

                        {/* process button */}
                        <div className="md:flex md:static fixed bottom-0 left-0 right-0 bg-white p-4 md:px-8 md:bg-transparent space-x-2">
                            <Button className="flex-1 w-full" onClick={handleProcess}>
                                Process
                            </Button>
                            <Link className="flex-1 md:block hidden underline font-bold text-base" href={"/"}>
                                skip for now?
                            </Link>
                        </div>
                    </div>
                </div>
                {/* right side */}
                <div className="flex-1 hidden md:block -ml-20">
                    <Image src={map} alt="map" width={540} height={500} />
                </div>
            </div>
        </>
    );
};

export default Page;
