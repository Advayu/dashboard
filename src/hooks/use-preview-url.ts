import { useState, useEffect } from "react";
import { useFilePreview } from "@/hooks/use-filepreview";
import { getImageUrlByFileKey } from "@/services/image-service";

export function usePreviewUrl(
    file?: File | string | null,
    bucket?: string,
    url?: string
): { previewUrl: string | null; isLoading: boolean } {
    const isFile = file instanceof File;
    const filePreview = useFilePreview(isFile ? file : undefined);

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!file) {
            setPreviewUrl(null);
            setIsLoading(false);
            return;
        }

        if (isFile) {
            setPreviewUrl(filePreview);
            setIsLoading(false);
        } else if (typeof file === "string" && bucket && url) {
            setIsLoading(true);
            getImageUrlByFileKey(file, bucket, url)
                .then((res) => {
                    setPreviewUrl(res.fileUrl);
                })
                .catch((err) => {
                    console.error("Failed to fetch preview URL", err);
                    setPreviewUrl(null);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [file, filePreview, bucket, url]);

    return { previewUrl, isLoading };
}