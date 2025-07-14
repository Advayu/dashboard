"use client";
import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import Lock from "@/components/icons/Lock";
import logo from "../../../../public/logo/advayuClubLogo.svg";

import { motion } from "motion/react";

import { Mail, Mail as MailIcon, Phone } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

import { CheckCircle, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useConfirmPasswordReset } from "@/hooks/use-auth";

const Page = () => {
  const [passwordChanged, setPasswordChanged] = useState(false);

  const { mutateAsync: confirmPasswordReset } = useConfirmPasswordReset({
    onSuccess() {
      setPasswordChanged(true);
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  console.log("token", token);
  const criteria = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const passedCriteria = Object.values(criteria).filter(Boolean).length;

  const getStrengthColor = () => {
    switch (passedCriteria) {
      case 0:
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-orange-400";
      case 3:
        return "bg-yellow-400";
      case 4:
        return "bg-blue-400";
      case 5:
        return "bg-green-500";
      default:
        return "bg-gray-200";
    }
  };

  const criteriaLabels = [
    { label: "At least 8 characters", valid: criteria.length },
    { label: "One uppercase letter (A-Z)", valid: criteria.upper },
    { label: "One lowercase letter (a-z)", valid: criteria.lower },
    { label: "One number (0-9)", valid: criteria.number },
    { label: "One special character (!@#$...)", valid: criteria.special },
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    confirmPasswordReset({ token, password });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white via-[#A1F6FF] to-[#189EAC]/80 px-6">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ scale: 0.3 }}
        animate={{ scale: 1, animationDuration: 0.3 }}
        transition={{ type: "spring" }}
        className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg shadow-gray-500/40">
        <div className="flex flex-col items-center justify-center pb-2">
          <Image
            src={logo}
            width={170}
            height={14}
            alt="Advayu Club Logo"
            priority
          />
        </div>
        {passwordChanged ? (
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Replace with your custom SVG or use lucide-react */}
            <h1 className="text-3xl">🎉</h1>
            <h2 className="text-lg font-semibold text-gray-800">
              Congratulation
            </h2>
            <p className="text-sm text-gray-600">
              You have successfully changed your password.
              <br />
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
              Choose a new password
            </h1>

            <div className="relative w-full mb-3">
              <Lock
                color="#199ead"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
              />
              <Input
                autoFocus
                required
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="pl-10 pr-10 w-full border rounded-md text-sm"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none"
                onClick={() => setShowPassword((v) => !v)}>
                <EyeIcon open={showPassword} />
              </button>
            </div>

            {/* Strength Bar */}
            <div className="w-full h-2 bg-gray-200 rounded-md overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(passedCriteria / 5) * 100}%` }}
                className={clsx(
                  "h-full transition-all duration-300",
                  getStrengthColor()
                )}
              />
            </div>

            {/* Animated Checklist */}
            <ul className="text-xs text-gray-600 space-y-1 mb-4">
              {criteriaLabels.map(({ label, valid }, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={clsx("flex items-center gap-1", {
                    "text-green-600": valid,
                    "text-red-500": !valid,
                  })}>
                  {valid ? (
                    <CheckCircle size={14} className="text-green-500" />
                  ) : (
                    <XCircle size={14} className="text-red-400" />
                  )}
                  {label}
                </motion.li>
              ))}
            </ul>

            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-[#199EAD] rounded-lg hover:bg-[#1A9EB0]/50 transition-all duration-300">
              Continue
            </button>

            <Link
              href="/login"
              className="text-sm text-blueTilt group inline-flex justify-end items-center mt-3 gap-1">
              <span className="transform group-hover:-translate-x-1 transition-transform ease-in-out">
                ←
              </span>
              <span className="text-sm font-semibold group-hover:underline">
                Return to login
              </span>
            </Link>
          </>
        )}
      </motion.form>

      <Contact className="mt-4 text-center flex" />
    </div>
  );
};

export default Page;

const EyeIcon = ({
  open,
  ...props
}: { open: boolean } & React.HTMLProps<HTMLSpanElement>) => (
  <span {...props}>
    {open ? (
      // Eye open SVG
      <svg
        className="w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M1.5 12s4-7.5 10.5-7.5S22.5 12 22.5 12s-4 7.5-10.5 7.5S1.5 12 1.5 12z"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={2} />
      </svg>
    ) : (
      // Eye closed SVG
      <svg
        className="w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.94 17.94A10.97 10.97 0 0 1 12 19.5C5.5 19.5 1.5 12 1.5 12a21.77 21.77 0 0 1 4.73-6.11M9.88 9.88A3 3 0 0 1 12 9c1.66 0 3 1.34 3 3 0 .39-.08.76-.21 1.09M3 3l18 18"
        />
      </svg>
    )}
  </span>
);

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
