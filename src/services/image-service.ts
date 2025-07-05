import axiosInstance from "@/utils/axiosInstance";
import { AWS_IMAGE_UPLOAD_URL, LAMBDA_URL } from "@/utils/constants";



export const uploadImageToBucket = async ({
    file,
    bucket,
    maxFileSize = 5 * 1024 * 1024, // Default 5 MB
}: {
    file: File;
    bucket: string;
    maxFileSize?: number;
}) => {
    if (!file) {
        throw new Error('No file provided for upload.');
    }


    if (file.size > maxFileSize) {
        throw new Error(
            `File size exceeds the limit of ${maxFileSize / (1024 * 1024)} MB.`
        );
    }


    const formData = new FormData();
    formData.append('file', file);

    const endpoint = `${LAMBDA_URL}/upload/image?bucket=${encodeURIComponent(
        bucket
    )}`;

    try {
        const response = await axiosInstance.post(endpoint, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Axios will handle the boundary
            },
        });

        return response.data;
    } catch (error: any) {
        // Optional: improve error handling or rethrow
        throw error?.response?.data || error;
    }
};



export const getImageUrlByFileKey = async (
    fileKey: string,
    bucket: string,
    url: string
): Promise<any> => {
    if (!fileKey || !bucket || !url) {
        throw new Error('Missing required parameters to fetch image URL.');
    }

    const response = await axiosInstance.get("/upload/url", {
        params: { fileKey, bucket },
    });

    return response.data;
};






export const getImagePath = (imageFile: File): string | null => {
    if (!imageFile) {
        console.error("No image file provided.");
        return null;
    }

    // Validate that the input is an image
    if (!imageFile.type.startsWith("image/")) {
        console.error("The provided file is not an image.");
        return null;
    }

    // Create a local URL for the image
    return URL.createObjectURL(imageFile);
};




export const deleteImageFromBucket = async (
    fileKey: string,
    bucket: string,
    url: string
): Promise<any> => {
    if (!fileKey) {
        throw new Error('Missing file key for deletion.');
    }

    if (!bucket) {
        throw new Error('Missing bucket name for deletion.');
    }

    const endpoint = `${url}?fileKey=${encodeURIComponent(fileKey)}&bucket=${encodeURIComponent(bucket)}`;

    const response = await axiosInstance.delete(endpoint);

    return response.data;
};


export const getFileFromBucket = async (
    fileKey: string,
    bucket: string,
    url: string
): Promise<any> => {
    if (!fileKey || !bucket || !url) {
        throw new Error('Missing required parameters for fetching file.');
    }

    const response = await axiosInstance.get(url, {
        params: { fileKey, bucket },
    });

    return response.data;
};
