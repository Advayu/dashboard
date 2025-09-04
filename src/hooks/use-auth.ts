// hooks/useAuth.ts
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { login, logout, passwordResetConfirm, resetPassword } from "@/services/auth-service";
import { toast } from "@/hooks/use-toast"; // Assuming you're using ShadCN or similar
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

// Replace `any` with your actual user type
type User = {
  id: string;
  email: string;
  name: string;
  role: string;
};

type LoginVariables = {
  email: string;
  password: string;
};

type LoginResponse = {
  access_token: string;
  // user: User;
};


// login
export function useLogin() {


  return useMutation<LoginResponse, Error, LoginVariables>({
    mutationFn: login,

    // onSuccess: (data) => {

    // console.log("data", data);
    // decode the token 
    // const user = jwtDecode<any>(data.access_token);
    // console.log("user", user)
    // localStorage.setItem("brandUser", JSON.stringify(user));

    // },

  });
}


// logout 
export function useLogout() {
  const router = useRouter();
  const clearSession = useCallback(() => {
    localStorage.clear();
  }, []);

  return useMutation<void, Error, void>({
    mutationFn: logout,

    onSuccess: () => {
      clearSession();


      router.replace("/login")

    },

    onError: (error) => {
      clearSession();
      console.error("Logout error:", error);
      router.replace("/login")
    },
  });
}


// reset password

export function useResetPassword(
  options?: UseMutationOptions<void, Error, string>
) {
  return useMutation<void, Error, string>({
    mutationFn: resetPassword,

    onSuccess: (...args) => {
      toast({
        title: "Password Reset",
        description:
          "You have received an email with instructions to reset your password.",
        variant: "success",
      });

      options?.onSuccess?.(...args); // Custom behavior if passed
    },

    onError: (error, ...args) => {
      const message =
        (error as any)?.response?.data?.message ||
        error.message ||
        "Something went wrong.";

      toast({
        title: "Password Reset Failed",
        description: message,
        variant: "destructive",
      });

      console.error("Password reset error:", error);

      options?.onError?.(error, ...args); // Forward to custom handler if passed
    },

    ...options,
  });
}


// confirm password reset

type ResetPasswordInput = {
  token: string;
  password: string;
};


export function useConfirmPasswordReset(
  options?: UseMutationOptions<void, Error, ResetPasswordInput>
) {
  return useMutation<void, Error, ResetPasswordInput>({
    mutationFn: ({ token, password }) => passwordResetConfirm(token, password),

    onSuccess: (...args) => {
      toast({
        title: "Password Reset Confirmed",
        description: "Your password has been reset successfully.",
        variant: "success",
      });

      // Call custom onSuccess handler if provided
      options?.onSuccess?.(...args);
    },

    onError: (error, ...args) => {
      const message =
        (error as any)?.response?.data?.message ||
        error.message ||
        "Something went wrong.";

      toast({
        title: "Password Reset Failed",
        description: message,
        variant: "destructive",
      });

      console.error("Password reset error:", error);

      // Call custom onError handler if provided
      options?.onError?.(error, ...args);
    },

    ...options, // Spread last to allow overriding other options like retry, etc.
  });
}
