import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export const useRole = () => {
    const role = useSelector((state: RootState) => state.brandUser.role);
    return {
        role,
        isAdmin: role === "admin",
        isBrandUser: role === "brand_user",
    };
};