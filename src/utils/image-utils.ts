/**
 * Resolves an uploadable image input to a file key.
 * - If it's a File, uploads it and returns the key
 * - If it's a string (existing key), returns it
 * - If undefined/null, returns empty string
 */
export type UploadableImage = File | string | undefined | null;

export const resolveImageUpload = async (
    input: UploadableImage,
    uploadFn: (file: File) => Promise<{ fileKey: string }>
): Promise<string> => {
    if (input instanceof File) {
        const result = await uploadFn(input);
        return result.fileKey;
    }
    if (typeof input === "string") {
        return input;
    }
    return "";
};
