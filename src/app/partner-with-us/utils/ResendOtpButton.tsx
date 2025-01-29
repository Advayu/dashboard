// components/OtpTimer.tsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/onboardingStore";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface ResendOtpButtonProps {
  email: string;
}

const ResendOtpButton: React.FC<ResendOtpButtonProps> = ({ email }) => {
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [isResendAvailable, setIsResendAvailable] = useState(false);
  // const email = useSelector((state: RootState) => state.user.email);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | false>(false);
  const { toast } = useToast();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendAvailable(true);
    }
  }, [timeLeft]);

  const resendOtp = async () => {
    setTimeLeft(120); // Reset the timer
    setIsResendAvailable(false);

    // Add logic to resend OTP here
    const payload = { toEmail: email };

    try {
      if (email) {
        const response = await axios.post(
          "${LAMBDA_URL}/auth/email/otp/send",
          payload
        );

        console.log("response", response);

        if (response.status === 201) {
          toast({
            variant: "success",
            title: "OTP sent successfully",
          });
          setError(null);
          setSuccess(true);
          console.log("OTP resent successfully");
        } else {
          toast({
            variant: "destructive",
            title: "Failed to send OTP, please try again",
          });
          setError("Failed to resend OTP. Please try again later.");
          setSuccess(false);
          console.error("Unexpected server response:", response.data);
        }
      }
    } catch (error) {
      setError(
        "An error occurred while resending OTP. Please check your network connection and try again."
      );
      setSuccess(false);
      console.error("Error resending OTP:", error);
    }
  };
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex space-x-2 otp-timer">
      <button
        disabled={!isResendAvailable}
        onClick={resendOtp}
        className={`resend-btn underline ${!isResendAvailable ? "text-gray-500 cursor-not-allowed" : ""}`}
      >
        Resend OTP
      </button>
      {!isResendAvailable && <span>in {formatTime(timeLeft)}</span>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default ResendOtpButton;
