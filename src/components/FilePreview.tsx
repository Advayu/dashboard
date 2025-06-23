import { useFilePreview } from "@/hooks/ use-filepreview";
import Image from "next/image";

export function FilePreview({
  file,
  fallback = "/placeholder.png",
  width = 100,
  height = 100,
  alt = "Preview",
}: {
  file?: FileList | null;
  fallback?: string;
  width?: number;
  height?: number;
  alt?: string;
}) {
  const previewUrl = useFilePreview(file);

  return (
    <Image
      src={previewUrl ?? fallback}
      width={width}
      height={height}
      alt={alt}
      className="object-cover rounded"
    />
  );
}

{
  /* <button className="absolute top-0 right-0 bg-[#0000004D] rounded-full transform translate-x-1/2 -translate-y-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button> */
}
