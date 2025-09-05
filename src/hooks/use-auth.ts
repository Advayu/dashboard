// hooks/useAuth.ts
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { login, logout, passwordResetConfirm, resetPassword } from "@/services/auth-service";
import { toast } from "@/hooks/use-toast"; // Assuming you're using ShadCN or similar
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { setBrandUser } from "@/store/globalSlice/brandUserSlice";
import { useDispatch } from "react-redux";
import { create } from 'zustand';



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
  const dispatch = useDispatch();

  return useMutation<LoginResponse, Error, LoginVariables>({
    mutationFn: login,

    onSuccess: (data) => {

      // console.log("data", data);
      // decode the token 
      const user = jwtDecode<any>(data.access_token);
      //   {
      //     "email": "",
      //     "brand_id": "",
      //     "role": "",
      //     "isActive": boolean,
      //     "brandName": "",
      //     "userId": "",
      //     "iat": ,
      //     "exp": 
      // }
      console.log("user", user)
      useAuth.getState().setAuthenticated(true)
      dispatch(setBrandUser({
        id: user.userId,
        brand_id: user.brand_id,
        name: user.brandName,
        email: user.email,
        phone: "",
        role: user.role,
        is_password_changed: false,
        is_active: true,
      }));
    },

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

      useAuth.getState().setAuthenticated(false)
      router.replace("/login")

    },

    onError: (error) => {
      clearSession();
      useAuth.getState().setAuthenticated(false)
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


interface AuthStore {
  isAuthenticated: boolean;
  loading: boolean;
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
}

export const useAuth = create<AuthStore>((set: any) => ({
  isAuthenticated: false,
  loading: true,
  setAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
  setLoading: (value: boolean) => set({ loading: value }),
}));