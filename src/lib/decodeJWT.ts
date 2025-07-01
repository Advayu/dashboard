import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

export const decodeJWT = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) return null;

    try {
        const decodedToken = jwtDecode<any>(token);
        return decodedToken;
    } catch (e) {
        console.error("Failed to decode JWT:", e);
        return null;
    }
};
