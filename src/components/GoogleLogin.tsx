"use client";

import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";

const LoginWithGoogle: React.FC = () => {
  const handleSuccess = async (credentialResponse: any) => {
    console.log("🟢 Google login success:", credentialResponse);

    const idToken = credentialResponse.credential;
    console.log("🪪 ID Token:", idToken);

    try {
      const res = await fetch(
        "http://localhost:4200/brand-users/google-login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: idToken, brandName: "Advayu" }),
        }
      );

      const data = await res.json();
      console.log("✅ Login success response:", data);

      // Optional: store token, redirect, etc.
      localStorage.setItem("token", data.jwt);
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
