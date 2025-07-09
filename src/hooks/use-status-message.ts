import { useEffect, useState } from "react";

export const useStatusMessage = ({
    isSuccess,
    isError,
    duration = 3000,
}: {
    isSuccess: boolean;
    isError: boolean;
    duration?: number;
}) => {
    const [message, setMessage] = useState<null | {
        type: "success" | "error";
        text: string;
    }>(null);

    useEffect(() => {
        if (isSuccess) {
            setMessage({ type: "success", text: "Offer updated successfully" });
        } else if (isError) {
            setMessage({ type: "error", text: "Failed to update the offer!" });
        }

        const timer = setTimeout(() => {
            setMessage(null);
        }, duration);

        return () => clearTimeout(timer);
    }, [isSuccess, isError, duration]);

    return message;
};
