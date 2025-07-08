import {
    createOffer,
    deleteOffer,
    getOffer,
    getOfferByOutletId,
    getOffers,
    updateOffer,
} from "@/services/offer-service";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

// ✅ 1. Hook to fetch offers with pagination
export const useGetOffers = (
    brand_id: string,
    limit: number = 10,
    page: number = 1
) => {
    const { data, error, isLoading } = useQuery({
        queryKey: ['offers', brand_id, limit, page],
        queryFn: () => getOffers(brand_id, limit, page),
        enabled: !!brand_id,
    });

    return {
        offers: data,
        error,
        isLoading,
    };
};

// ✅ 2. Hook to fetch single offer
export const useGetOffer = (id: string) => {
    const { data, error, isLoading } = useQuery({
        queryKey: ['offer', id],
        queryFn: () => getOffer(id),
        enabled: !!id,
    });

    return {
        offer: data,
        error,
        isLoading,
    };
};

// ✅ 3. Hook to create offer
export const useCreateOffer = () => {
    const {
        mutate,
        mutateAsync,
        error,
        isPending,
        isSuccess,
    } = useMutation({
        mutationFn: createOffer,
    });

    return {
        mutate,
        mutateAsync,
        error,
        isLoading: isPending,
        isSuccess,
    };
};

// ✅ 4. Hook to update offer
export const useUpdateOffer = () => {
    const { mutate, error, isPending, isSuccess } = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => updateOffer(id, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['offers'] });
            queryClient.invalidateQueries({ queryKey: ['offer', variables.id] });
        },
    });

    return {
        mutate,
        error,
        isLoading: isPending,
        isSuccess,
    };
};

// ✅ 5. Hook to delete offer
export const useDeleteOffer = () => {
    const { mutate, error, isPending, isSuccess } = useMutation({
        mutationFn: (id: string) => deleteOffer(id),
        onSuccess: (_data, id) => {
            queryClient.invalidateQueries({ queryKey: ['offers'] });
            queryClient.invalidateQueries({ queryKey: ['offer', id] });
        },
    });

    return {
        mutate,
        error,
        isLoading: isPending,
        isSuccess,
    };
};

// ✅ 6. Hook to get offer by outlet ID with pagination
export const useGetOfferByOutletId = (
    outletId: string,
    limit: number = 10,
    page: number = 1
) => {
    const { data, error, isLoading } = useQuery({
        queryKey: ['offerByOutletId', outletId, limit, page],
        queryFn: () => getOfferByOutletId(outletId, limit, page),
        enabled: !!outletId,
    });

    return {
        offer: data,
        error,
        isLoading,
    };
};
