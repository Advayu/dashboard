import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FilePreview } from "./FilePreview";

export type UploadableImage = File | string; // string = pre-uploaded URL

interface ImageUploadProps {
  name: string;
  multiple?: boolean;
}

const ImageUploader: React.FC<ImageUploadProps> = ({
  name,
  multiple = false,
}) => {
  const { control } = useFormContext();

  const handleFileInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    existingFiles: UploadableImage[],
    onChange: (files: UploadableImage[]) => void,
    allowMultiple: boolean
  ) => {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length === 0) return;

    const updatedFiles = allowMultiple
      ? [...existingFiles, ...newFiles]
      : [newFiles[0]];

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
