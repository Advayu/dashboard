"use client";
import Image from "next/image";
import Verification from "../../../public/verification.svg";

const VerificationPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center    md:p-4">
      <h1 className="text-3xl font-bold text-black mb-4">
        Successfully Verified
      </h1>
      <p className="text-gray-700 text-center mb-6 text-xl">
        We will get in touch over the registered email ID with the credentials
        shortly!
      </p>
      <div className="w-64 h-64 mt-14">
        <Image
          width={500}
          height={500}
          src={Verification}
          alt="Verification Illustration"
          layout="responsive"
        />
      </div>
    </div>
  );
};

export default VerificationPage;
