
import { MutateFunction, useQueryClient, useQuery, useMutation, UseMutationResult } from "@tanstack/react-query";
import { deleteImageFromBucket, getImageUrlByFileKey, uploadImageToBucket } from "@/services/image-service";
import { toast } from "./use-toast";
import { formatApiError } from "@/utils/formatApiError";


// Todo: need to write types
/* upload image to bucket  */
export const useImageUpload = (
    url: string,
    bucket: string
): UseMutationResult<any, Error, File> => {
    return useMutation({
        mutationFn: (file: File) =>
            uploadImageToBucket({
                file,
                bucket,
                url,
                maxFileSize: 2 * 1024 * 1024,
            }),
        onSuccess: (_, file) => {
            toast({
                variant: 'success',
                title: 'Upload Successful',
                description: `${file.name} uploaded successfully.`,
            });
        },
        onError: (error) => {
            toast({
                variant: 'destructive',
                title: 'Upload Failed',
                description: formatApiError(error), // 👈 centralized error formatting
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