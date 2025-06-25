import { useFilePreview } from "@/hooks/use-filepreview";
import Image from "next/image";

export function FilePreview({
  file,
  fallback = "/placeholder.png",
  width = 100,
  height = 100,
  alt = "Preview",
  onRemove,
}: {
  file?: File | null;
  fallback?: string;
  width?: number;
  height?: number;
  alt?: string;
  onRemove?: () => void; // 🆕 Optional remove handler
}) {
  const previewUrl = useFilePreview(file);

  return (
    <div className="relative inline-block">
      {/* Cross button */}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-0 right-0 bg-black text-white rounded-full w-5 h-5 text-xs flex items-center justify-center z-10 translate-x-1/2 -translate-y-1/2 hover:bg-red-600 transition"
          aria-label="Remove image">
          ×
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
