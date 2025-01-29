import axiosInstance from "@/utils/axiosInstance";


export const uploadImageToBucket = async ({
    file,
    bucket_name,
    url,
    maxFileSize = 5 * 1024 * 1024, // Default 5 MB
}: {
    file: File;
    bucket_name: string;
    url: string;
    maxFileSize?: number;
}) => {

    console.log("file", file);
    try {
        if (!file) {
            throw new Error('No file provided for upload.');
        }

        // Validate file size
        if (file.size > maxFileSize) {
            throw new Error(`File size exceeds the limit of ${maxFileSize / (1024 * 1024)} MB.`);
        }

        // Prepare FormData
        const formData = new FormData();
        formData.append('file', file, file.name);

        const endpoint = `${url}?bucket=${bucket_name}`;
        // console.log("endpoint", endpoint);

        // Perform the upload
        const response = await axiosInstance.post(endpoint, formData, {
            headers: {
                accept: '*/*',
                'Content-Type': 'multipart/form-data',
            },
            timeout: 15000, // Set timeout for production robustness
        });

        // console.log('Image uploaded successfully:', response.data);
        return response.data;
    } catch (error) {
        // console.error('Image upload failed:', error);
        throw error;
    }
};


export const getImageURlByFileKey = async (
    fileKey: string,
    bucket: string,
    url: string
) => {
    try {
        // Construct the endpoint URL

        // Perform the GET request
        const response = await axiosInstance.get(url, {
            params: { fileKey, bucket }, // Send query parameters
            headers: {
                accept: '*/*', // Accept all types of responses
            },
            timeout: 15000, // Timeout for production-grade robustness
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching file:', error);
        throw error;
    }
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
    url: string,
) => {
    try {
        if (!fileKey) {
            throw new Error('No file key provided for deletion.');
        }

        if (!bucket) {
            throw new Error('No bucket name provided for deletion.');
        }

        // Construct the endpoint with query parameters
        const endpoint = `${url}?fileKey=${encodeURIComponent(fileKey)}&bucket=${encodeURIComponent(bucket)}`;

        // Perform the DELETE request
        const response = await axiosInstance.delete(endpoint, {

            timeout: 15000, // Optional: timeout for production robustness
        });

        console.log('Image deleted successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Image deletion failed:', error);
        throw error;
    }
};


export const getFileFromBucket = async (
    fileKey: string,
    bucket: string,
    url: string
) => {
    try {
        // Construct the endpoint URL

        console.log(url);
        // Perform the GET request
        const response = await axiosInstance.get(url, {
            params: { fileKey, bucket }, // Send query parameters
            headers: {
                accept: '*/*', // Accept all types of responses
            },
            timeout: 15000, // Timeout for production-grade robustness
        });

        console.log('File fetched successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching file:', error);

        throw error;
    }
};
