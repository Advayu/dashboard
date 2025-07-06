import { createOffer, deleteOffer, getOffer, getOffers, updateOffer } from "@/services/offer-service";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const useGetOffers = (brand_id: string) => {
    const { data, error, isLoading } = useQuery({
        queryKey: ['offers', brand_id],
        queryFn: () => getOffers(brand_id),
        enabled: !!brand_id,
    });
    return { offers: data, error, isLoading };
};

export const useGetOffer = (id: string) => {
    const { data, error, isLoading } = useQuery({
        queryKey: ['offer', id],
        queryFn: () => getOffer(id),
        enabled: !!id,
    });
    return { offer: data, error, isLoading };
};


export const useCreateOffer = () => {
    const {
        mutate,
        mutateAsync,
        error,
        isPending,
        isSuccess,
    } = useMutation({
        mutationFn: createOffer, // your API function
    });

    return {
        mutate,            // for fire-and-forget use
        mutateAsync,       // for async/await usage
        error,
        isLoading: isPending,
        isSuccess,
    };
};


export const useUpdateOffer = () => {
    const { mutate, error, isPending, isSuccess } = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => updateOffer(id, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['offers'] });
            queryClient.invalidateQueries({ queryKey: ['offer', variables.id] });
        },
    });
    return { mutate, error, isLoading: isPending, isSuccess };
};

export const useDeleteOffer = () => {
    const { mutate, error, isPending, isSuccess } = useMutation({
        mutationFn: (id: string) => deleteOffer(id),
        onSuccess: (_data, id) => {
            queryClient.invalidateQueries({ queryKey: ['offers'] });
            queryClient.invalidateQueries({ queryKey: ['offer', id] });
        },
    });
    return { mutate, error, isLoading: isPending, isSuccess };
};

