import { useEffect, useMemo, useState } from "react";

export function useFilePreview(fileList?: FileList | null): string | null {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!fileList || fileList.length === 0) {
            setPreviewUrl(null);
            return;
        }

        const file = fileList[0];
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [fileList]);

    return previewUrl;
}
