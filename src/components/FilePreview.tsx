import { useState } from "react";
import Image from "next/image";
import { usePreviewUrl } from "@/hooks/use-preview-url";
import { OUTLET_BUCKET_NAME, LAMBDA_URL } from "@/utils/constants";
import { useDeleteImage } from "@/hooks/use-image";

type UploadableImage = File | string;

interface FilePreviewProps {
  file?: UploadableImage | null;
  fallback?: string;
  width?: number;
  height?: number;
  alt?: string;
  onRemove?: () => void;
  enableRemoteDelete?: boolean;
  bucket?: string;
  url?: string;
}

export function FilePreview({
  file,
  fallback = "/placeholder.png",
  width = 100,
  height = 100,
  alt = "Preview",
  onRemove,
  enableRemoteDelete = false,
  bucket = OUTLET_BUCKET_NAME,
  url = LAMBDA_URL,
}: FilePreviewProps) {
  const previewUrl = usePreviewUrl(file, bucket, url);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteImageMutation = useDeleteImage(
    typeof file === "string" ? file : "", // safely pass fileKey if string
    bucket,
    url
  );

  const handleRemove = async () => {
    if (enableRemoteDelete && typeof file === "string") {
      try {
        setIsDeleting(true);
        await deleteImageMutation.mutateAsync(file);
      } catch (err) {
        console.error("S3 delete error:", err);
      } finally {
        setIsDeleting(false);
      }
    }

    onRemove?.();
  };

  return (
    <div className="relative inline-block">
      {onRemove && (
        <button
          type="button"
          onClick={handleRemove}
          disabled={isDeleting}
          className="absolute top-0 right-0 bg-black text-white rounded-full w-5 h-5 text-xs flex items-center justify-center z-10 translate-x-1/2 -translate-y-1/2 hover:bg-red-600 transition"
          aria-label="Remove image">
          {isDeleting ? "…" : "×"}
        </button>
      )}

      <Image
        src={previewUrl ?? fallback}
        width={width}
        height={height}
        alt={alt}
        className="object-cover rounded border-2 border-black aspect-square"
      />
    </div>
  );
}
