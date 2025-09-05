import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";


// cookies has brand email, brand id, userId 
export const decodeJWT = async () => {
    const cookieStore = await cookies();
    console.log("cookieStore>>>", cookieStore);
    const token = cookieStore.get("access_token")?.value;
    console.log("token>>>", token);

    if (!token) return null;

    try {
        const decodedToken = jwtDecode<any>(token);
        console.log("decodedToken>>>", decodedToken);
        return decodedToken;
    } catch (e) {
        console.error("Failed to decode JWT:", e);
        return null;
    }
};
