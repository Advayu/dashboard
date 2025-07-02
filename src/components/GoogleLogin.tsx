"use client";

import { toast } from "@/hooks/use-toast";
import { LAMBDA_URL } from "@/utils/constants";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";

const LoginWithGoogle: React.FC = () => {
  const router = useRouter();
  const handleSuccess = async (credentialResponse: any) => {
    console.log("🟢 Google login success:", credentialResponse);

    const idToken = credentialResponse.credential;
    console.log("🪪 ID Token:", idToken);

    try {
      const res = await axios.post(
        `${LAMBDA_URL}/brand-users/dashboard-brand-google-login`,
        {
          idToken: idToken,
        },
        { withCredentials: true }
      );

      const data = await res.data;
      console.log("✅ Login success response:", data);
      console.log("User data:", data);
      toast({
        variant: "success",
        title: "Login successful",
      });

      console.log("logged in user", res.data);

      router.replace(`/`);
    } catch (error) {
      console.error("❌ Error sending token to backend:", error);
    }
  };

  return (
    <div className="flex flex-col items-center mt-4 ">
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        {" "}
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.error("❌ Google Login Failed")}
        />
      </GoogleOAuthProvider>
    </div>
  );
};

export default LoginWithGoogle;
