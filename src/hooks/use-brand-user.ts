// hooks/useUpdateBrandUser.ts

import { useMutation, UseMutationResult, useQuery, useQueryClient } from '@tanstack/react-query';
import { BrandUserResponse, BrandUserUpdateInput, deleteBrandUser, getBrandUser, getBrandUsers, inviteBrandUser, putBrandUser, setBrandUserStatus, transferAdmin } from '@/services/brand-user-service';
import { toast } from '@/hooks/use-toast';
import { Axios, AxiosError } from 'axios';

export const useGetBrandUsers = () => {
    return useQuery({
        queryKey: ["brand-users"],
        queryFn: async () => {
            const data = await getBrandUsers();
            console.log("Fetched brand users:", data);
            return data;
        },
        staleTime: 0,
    });
};



export const useGetBrandUser = (brandId: string) => {
    return useQuery({
        queryKey: ['brand-user', brandId],
        queryFn: () => getBrandUser(brandId),
        enabled: !!brandId,
    });
};


export const useDeleteBrandUser = () => {
    return useMutation<BrandUserResponse, Error, string>({
        mutationFn: (id: string) => deleteBrandUser(id),
        onSuccess: (data) => {
            toast({
                title: "User Deleted",
                description: `${data.name} was deleted successfully.`,
                variant: "success",
            });
        },
        onError: (error) => {
            toast({
                title: "Delete Failed",
                description: error.message,
                variant: "destructive",
            });
        },
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

// Type definitions for better DX
type InviteBrandUserInput = {
    brand_id: string;
    email: string;
};

type InviteBrandUserResponse = {
    email: string;
    // Add more if your API returns more
};

type UseInviteBrandUserOptions = {
    onSuccess?: (data: InviteBrandUserResponse) => void;
    onError?: (error: Error) => void;
};

export const useInviteBrandUser = (options?: UseInviteBrandUserOptions) => {
    return useMutation<InviteBrandUserResponse, Error, InviteBrandUserInput>({
        mutationFn: ({ brand_id, email }) => inviteBrandUser({ brand_id, email }),

        onSuccess: (data) => {
            toast({
                title: "Invite Sent",
                description: `${data.email} was invited successfully.`,
                variant: "success",
            });

            // Optional external handler
            options?.onSuccess?.(data);
        },

        onError: (error: any) => {
            console.log("error", error);
            toast({
                title: "Invite Failed",
                description: error.response.data.message,
                variant: "destructive",
            });

            // Optional external error handler
            options?.onError?.(error);
        },
    });
};

// Type declarations
type SetBrandUserStatusInput = {
    id: string;
    status: boolean;
};

type SetBrandUserStatusResponse = {
    id: string;
    name: string;
    status: boolean;
};

type UseSetBrandUserStatusOptions = {
    onSuccess?: (data: SetBrandUserStatusResponse) => void;
    onError?: (error: Error) => void;
};

export const useSetBrandUserStatus = (options?: UseSetBrandUserStatusOptions) => {
    const queryClient = useQueryClient();

    return useMutation<SetBrandUserStatusResponse, Error, SetBrandUserStatusInput>({
        mutationFn: ({ id, status }) => setBrandUserStatus({ id, status }),

        onSuccess: (data) => {
            toast({
                title: "User Status Updated",
                description: `${data.name}'s status has been updated successfully.`,
                variant: "success",
            });

            // Invalidate brand-users query to refetch updated data
            queryClient.invalidateQueries({ queryKey: ["brand-users"] });

            // Optional external callback
            options?.onSuccess?.(data);
        },

        onError: (error) => {
            toast({
                title: "Update Failed",
                description: error.message,
                variant: "destructive",
            });

            // Optional external error handler
            options?.onError?.(error);
        },


    });
};

type TransferAdminParams = {
    id: string;
    newAdminId: string;
};

type TransferAdminResponse = {
    name: string;
    // ...add more if needed
};
export const useTransferAdmin = (options?: {
    onSuccess?: (data: TransferAdminResponse) => void;
    onError?: (error: Error) => void;
}) => {
    return useMutation<TransferAdminResponse, Error, TransferAdminParams>({
        mutationFn: ({ id, newAdminId }) => transferAdmin({ id, newAdminId }),
        onSuccess: (data) => {
            toast({
                title: "Admin Transferred",
                description: `${data.name} was transferred successfully.`,
                variant: "success",
            });

            if (options?.onSuccess) {
                options.onSuccess(data);
            }
        },
        onError: (error) => {
            toast({
                title: "Transfer Failed",
                description: error.message,
                variant: "destructive",
            });

            if (options?.onError) {
                options.onError(error);
            }
        },
    });
};