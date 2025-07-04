// hooks/use-preview-url.ts
import { useState, useEffect } from "react";
import { useFilePreview } from "@/hooks/use-filepreview";
import { getImageUrlByFileKey } from "@/services/image-service";

export function usePreviewUrl(
    file?: File | string | null,
    bucket?: string,
    url?: string
): string | null {
    const isFile = file instanceof File;
    const filePreview = useFilePreview(isFile ? file : undefined);

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!file) {
            setPreviewUrl(null);
            return;
        }

        if (isFile) {
            // For new File uploads
            setPreviewUrl(filePreview);
        } else if (typeof file === "string" && bucket && url) {
            // For file keys from backend
            getImageUrlByFileKey(file, bucket, url)
                .then((res) => {

                    setPreviewUrl(res.fileUrl);
                })
                .catch((err) => {
                    console.error("Failed to fetch preview URL", err);
                    setPreviewUrl(null);
                });
        }
    }, [file, filePreview, bucket, url]);

    return previewUrl;
}
