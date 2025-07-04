// hooks/useAuth.ts
import { useMutation } from "@tanstack/react-query";
import { login, logout } from "@/services/auth-service";

type LoginVariables = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
  user: any; // replace with your user type
};

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginVariables>({
    mutationFn: login,
    onSuccess: (data) => {
      console.log("Login successful", data);
      window.location.href = "/";
    },
    onError: (error) => {
      console.error("Login failed", error.message);
    },
  });
}

export function useLogout() {
  return useMutation<void, Error, void>({
    mutationFn: logout,
    onSuccess: () => {
      window.location.href = "/login";
    },

    onError: (error: any) => {
      console.error("Logout failed", error);
      window.location.href = "/login";
    },
  });
}
