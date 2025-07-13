import {
    createOffer,
    deleteOffer,
    fetchOffers,
    getOffer,
    getOfferAnalytics,
    getOfferByOutletId,
    getOffers,
    updateOffer,
} from "@/services/offer-service";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { toast } from "./use-toast";

const queryClient = new QueryClient();

// ✅ 1. Hook to fetch offers with pagination
type getOffersParams = {
    brand_id: string;
    outlet_id?: string;
    start_date?: string;
    end_date?: string;
    status?: string;
    limit?: number;
    page?: number;
};

export const useGetOffers = (params: getOffersParams) => {
    const {
        brand_id,
        outlet_id,
        start_date,
        end_date,
        status,
        limit,
        page,
    } = params;

    const { data, error, isLoading } = useQuery({
        queryKey: [
            'offers',
            brand_id,
            outlet_id,
            start_date,
            end_date,
            status,
            limit,
            page,
        ],
        queryFn: () =>
            getOffers({ brand_id, outlet_id, start_date, end_date, status, limit, page }),
        enabled: !!brand_id,
    });

    return {
        offers: data ?? { data: [], totalPages: 1 },
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
            toast({ title: "Offer updated successfully", variant: "success" });
        },
        onError: (error) => {
            console.error(error);
            toast({ title: "Failed to update the offer", variant: "destructive" });
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
    page: number = 1,
    enabled: boolean = true // add this parameter

) => {
    const { data, error, isLoading } = useQuery({
        queryKey: ['offerByOutletId', outletId, limit, page],
        queryFn: () => getOfferByOutletId(outletId, limit, page),
        enabled: enabled && !!outletId,
    });

    return {
        offer: data,
        error,
        isLoading,
        totalPages: data?.totalPages || 0,
        currentPage: data?.currentPage || 0,
        page: data?.page || 0,
        total: data?.total || 0,
        pageSize: data?.pageSize || 0,


    };
};



export function useGetOfferUsingParams(params: any): any {
    const { searchType, filters, page, limit } = params;
    console.log("searchType", searchType);
    console.log("filters", filters);
    console.log("page", page);
    console.log("limit", limit);

    const { data, isLoading, error } = useQuery({
        queryKey: ['offers', searchType, filters, page, limit],
        queryFn: () => fetchOffers(params),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
    console.log(data)
    return {
        data: data?.data || [],
        isLoading,
        error,
        total: data?.total || 0,
    };
}

// offer analytics

export const useGetOfferAnalytics = (
    id: string,
    start?: string,
    end?: string,
    enabled: boolean = true
) => {
    return useQuery({
        queryKey: ["offer-analytics", id, start, end],
        queryFn: () => getOfferAnalytics(id, start, end),
        enabled: enabled && !!id, // only run if ID is valid and explicitly enabled
        staleTime: 1000 * 60 * 5, // optional: cache for 5 minutes
    });
};