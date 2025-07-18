import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FilePreview } from "./FilePreview";

export type UploadableImage = File | string; // string = pre-uploaded URL

interface ImageUploadProps {
  name: string;
  multiple?: boolean;
}
const MAX_FILE_SIZE_MB = 3;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ImageUploader: React.FC<ImageUploadProps> = ({
  name,
  multiple = false,
}) => {
  const { control, setError, clearErrors } = useFormContext();

  const handleFileInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    existingFiles: UploadableImage[],
    onChange: (files: UploadableImage[]) => void,
    allowMultiple: boolean
  ) => {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length === 0) return;
    const validFiles = newFiles.filter(
      (file) => file.size <= MAX_FILE_SIZE_BYTES
    );
    const invalidFiles = newFiles.filter(
      (file) => file.size > MAX_FILE_SIZE_BYTES
    );

    if (invalidFiles.length > 0) {
      setError(name, {
        type: "manual",
        message: `${invalidFiles.length} file(s) were too large and not added. Max size is ${MAX_FILE_SIZE_MB}MB.`,
      });
    } else {
      clearErrors(name);
    }
    const updatedFiles = allowMultiple
      ? [...existingFiles, ...validFiles]
      : validFiles.slice(0, 1);

    onChange(updatedFiles);
    e.target.value = "";
  };

  const handleRemove = (
    index: number,
    files: UploadableImage[],
    onChange: (files: UploadableImage[]) => void
  ) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    onChange(updatedFiles);
  };

  return (
    <div className="flex flex-col">
      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field: { value, onChange } }) => {
          const files = Array.isArray(value) ? value : value ? [value] : [];

          return (
            <>
              <input
                id={name}
                type="file"
                multiple={multiple}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileInput(e, files, onChange, multiple)}
              />

              <label
                htmlFor={name}
                className="border border-black text-black px-4 rounded cursor-pointer my-1 w-fit">
                Attach image
              </label>

              {files.length > 0 && (
                <div className="mt-2 space-y-2">
                  <p className="text-sm font-medium">Selected Images:</p>
                  <ul className="list-disc list-inside flex flex-wrap gap-2 w-74">
                    {files.map((item, index) => (
                      <FilePreview
                        key={index}
                        file={item}
                        onRemove={() => handleRemove(index, files, onChange)}
                      />
                    ))}
                  </ul>
                </div>
              )}
            </>
          );
        }}
      />
    </div>
  );
};

export default ImageUploader;
