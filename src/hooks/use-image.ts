
import { MutateFunction, useQueryClient, useQuery, useMutation, UseMutationResult } from "@tanstack/react-query";
import { deleteImageFromBucket, getImageUrlByFileKey, uploadImageToBucket } from "@/services/image-service";
import { toast } from "./use-toast";
import { formatApiError } from "@/utils/formatApiError";


// Todo: need to write types
/* upload image to bucket  */
export const useImageUpload = (

    bucket: string
): UseMutationResult<{ fileKey: string }, Error, File> => {
    return useMutation({
        mutationFn: async (file: File) => {
            const response = await uploadImageToBucket({
                file,
                bucket,

                maxFileSize: 2 * 1024 * 1024,
            });

            return { fileKey: response.fileKey }; // ✅ return the key here
        },
        onSuccess: (_, file) => {
            toast({
                variant: "success",
                title: "Upload Successful",
                description: `${file.name} uploaded successfully.`,
            });
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: "Upload Failed",
                description: formatApiError(error),
            });
        },
    });
};


/* */

export const useGetImageUrl = (fileKey: string, bucket: string, url: string) => {
    return useQuery({
        queryKey: ['image', fileKey],
        queryFn: () => getImageUrlByFileKey(fileKey, bucket, url),
        enabled: !!fileKey,
        staleTime: 5 * 60 * 1000, // cache for 5 minutes, tweak as needed
        retry: 1, // retry once on failure
    });
}


export const useDeleteImage = (fileKey: string, bucket: string, url: string) => {
    return useMutation({
        mutationFn: (fileKey: string) => deleteImageFromBucket(fileKey, bucket, url),
        onSuccess: (_, fileKey) => {
            toast({
                variant: 'success',
                title: 'Image Deleted',
                description: `${fileKey} deleted successfully.`,
            });
        },
        onError: (error) => {
            toast({
                variant: 'destructive',
                title: 'Image Deletion Failed',
                description: formatApiError(error),
            });
        },
    });
}