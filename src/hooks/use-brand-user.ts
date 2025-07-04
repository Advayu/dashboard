// hooks/useUpdateBrandUser.ts

import { useMutation, UseMutationResult, useQuery } from '@tanstack/react-query';
import { BrandUserResponse, BrandUserUpdateInput, getBrandUser, putBrandUser } from '@/services/brand-user-service';
import { toast } from '@/hooks/use-toast';


export const useGetBrandUser = (brandId: string) => {
    return useQuery({
        queryKey: ['brand-user', brandId],
        queryFn: () => getBrandUser(brandId),
        enabled: !!brandId,
    });
};




export const useUpdateBrandUser = (
    brand_user_id: string
): UseMutationResult<BrandUserResponse, Error, any> => {
    return useMutation({
        mutationFn: (data) => putBrandUser(data, brand_user_id),
        onSuccess: (data) => {
            toast({
                title: 'User Updated',
                description: `${data.name} was updated successfully.`,
                variant: 'success',
            });
        },
        onError: (error) => {
            toast({
                title: 'Update Failed',
                description: error.message,
                variant: 'destructive',
            });
        },
    });
};
