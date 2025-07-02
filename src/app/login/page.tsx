"use client";
import { useState, useEffect, FormEvent, use } from "react";

import LoginWithGoogle from "@/components/GoogleLogin";
import { useLogin } from "@/hooks/use-auth";
import Image from "next/image";
import OrDivider from "@/components/or-divider";
import { Input } from "@/components/ui/input";
import Mail from "@/components/icons/Mail";
import Lock from "@/components/icons/Lock";
import logo from "../../../public/logo/advayuClubLogo.svg";
import { useRouter } from "next/navigation";

const Auth = () => {
  const router = useRouter();
  const {
    mutate: login,
    data,
    isError,
    error: loginError,
    isPending,
    isSuccess,
  } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    login({ email, password });
    console.log(data);
  };
  isSuccess && router.push("/");
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white  via-[#A1F6FF] to-[#189EAC]/80">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg shadow-gray-500/40 ">
        <div className="flex items-center justify-center flex-row pb-2">
          <Image
            src={logo}
            width={170}
            height={14}
            alt="Advayu Club Logo"
            priority
          />
        </div>

        <div className="mt-4 space-y-4">
          <div className="relative w-full">
            <Mail
              color="#199ead"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
            />
            <Input
              required
              autoFocus
              aria-details="Enter your Email Id"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={` pl-10 w-full border  rounded-md text-sm`}
            />
          </div>
          <div className="relative w-full">
            <Lock
              color="#199ead"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
            />
            <Input
              aria-details="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={`pl-10 pr-10 w-full border rounded-md text-sm`}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none"
              onClick={() => setShowPassword((v) => !v)}>
              <EyeIcon open={showPassword} />
            </button>
          </div>
          {loginError && (
            <p className="mb-4 text-sm text-red-600">Incorrect Credients</p>
          )}
          <button
            disabled={isPending}
            type="submit"
            className={`w-full px-4 py-2 font-bold text-white bg-[#199EAD] rounded-lg hover:bg-[#1A9EB0]/50 transition-all duration-300`}>
            Sign in
          </button>
        </div>
        <OrDivider />

        <LoginWithGoogle />
      </form>
    </div>
  );
};

export default Auth;

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
