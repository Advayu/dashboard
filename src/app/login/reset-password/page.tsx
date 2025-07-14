"use client";
import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import Mail from "@/components/icons/Mail";
import logo from "../../../../public/logo/advayuClubLogo.svg";

import { motion } from "motion/react";

import { Mail as MailIcon, Phone } from "lucide-react";
import Link from "next/link";
import { useResetPassword } from "@/hooks/use-auth";

const Page = () => {
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const { mutateAsync: resetPassword, isPending } = useResetPassword({
    onError: (error: any) => {
      setError(error.response.data.message);
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    await resetPassword(email);
    setEmailSent(true);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white via-[#A1F6FF] to-[#189EAC]/80 px-6">
      <motion.div
        initial={{ scale: 0.3 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg shadow-gray-500/40">
        <div className="flex flex-col items-center justify-center pb-4">
          <Image
            src={logo}
            width={170}
            height={14}
            alt="Advayu Club Logo"
            priority
          />
        </div>

        {emailSent ? (
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Replace with your custom SVG or use lucide-react */}
            <Mail className="w-16 h-16 " color="#189eaccc" />
            <h2 className="text-lg font-semibold text-gray-800">
              Check your email
            </h2>
            <p className="text-sm text-gray-600">
              We've sent a recovery link to <strong>{email}</strong>. <br />
              Please check your inbox and follow the instructions.
            </p>

            <Link
              href="/login"
              className="text-sm text-blueTilt font-semibold hover:underline">
              ← Return to login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-bold text-center my-4">
              Recover your account
            </h1>
            <form onSubmit={handleSubmit} className="mt-4">
              <label className="text-sm font-bold text-gray-600">
                We'll send a recovery link to:
              </label>
              <div className="relative w-full mt-1 ">
                <Mail
                  color="#199ead"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                />
                <Input
                  required
                  autoFocus
                  autoComplete="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="pl-10 w-full border rounded-md text-sm"
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <button
                disabled={isPending}
                type="submit"
                className="w-full px-4 py-2 font-bold text-white bg-[#199EAD] rounded-lg hover:bg-[#1A9EB0]/50 transition-all duration-300 mt-2">
                {isPending ? "Sending..." : "Send recovery link"}
              </button>
              <Link
                href="/login"
                className="text-sm text-blueTilt flex justify-end items-center mt-3 gap-1">
                <span className="transform group-hover:-translate-x-1 transition-transform ease-in-out">
                  ←
                </span>
                <span className="font-semibold group-hover:underline">
                  Return to login
                </span>
              </Link>
            </form>
          </>
        )}
      </motion.div>

      <Contact className="mt-4 text-center flex" />
    </div>
  );
};

export default Page;
type ContactProps = {
  className?: string;
};

const Contact: React.FC<ContactProps> = ({ className = "" }) => {
  return (
    <div
      className={` items-center text-gray-600/70  gap-4 md:text-lg text-xs  ${className}`}>
      <div className="flex flex-row  items-center md:space-x-2 space-x-1 ">
        <MailIcon className="w-5 h-5 " />
        <a href="mailto:support@advayu.club" className="underline">
          support@advayu.club
        </a>
      </div>
      <div className="flex flex-row items-center md:space-x-2 space-x-1">
        <Phone className="w-5 h-5 " />{" "}
        <a href="tel:+919660657811" className="underline">
          +91 9660657811
        </a>
      </div>
    </div>
  );
};
