
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon, getCoupon, getCouponByOfferId } from '@/services/coupon-service';


// Create a new coupon

export function useCreateCoupon() {
    const queryClient = useQueryClient();

    const {
        mutate,
        mutateAsync,
        error,
        isPending,
        isSuccess,
    } = useMutation({
        mutationFn: (newCoupon: any) => createCoupon(newCoupon),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['coupons'] });
        },
    });

    return {
        mutate,        // use this for immediate calls
        mutateAsync,   // use this for async/await flow
        error,
        isLoading: isPending,
        isSuccess,
    };
}

// Update an existing coupon by ID
export function useUpdateCoupon() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => updateCoupon(id, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['coupons'] });
            queryClient.invalidateQueries({ queryKey: ['coupon', variables.id] });
        },
    });
}

// Delete a coupon by ID
export function useDeleteCoupon() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteCoupon(id),
        onSuccess: (_data, id) => {
            queryClient.invalidateQueries({ queryKey: ['coupons'] });
            queryClient.invalidateQueries({ queryKey: ['coupon', id] });
        },
    });
}

export function useGetCoupons(brand_id: string) {
    return useQuery({
        queryKey: ['coupons', brand_id],
        queryFn: () => getCoupons(brand_id),
        enabled: !!brand_id,
        staleTime: 5 * 60 * 1000, // cache for 5 minutes, tweak as needed
        retry: 1, // retry once on failure
    });
}

export function useGetCoupon(id: string) {
    return useQuery({
        queryKey: ['coupon', id],
        queryFn: () => getCoupon(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // cache for 5 minutes, tweak as needed
        retry: 1, // retry once on failure
    });
}

export function useGetCouponsByOfferId(id: string) {
    return useQuery({
        queryKey: ['couponsByOfferId', id],
        queryFn: () => getCouponByOfferId(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // cache for 5 minutes, tweak as needed
        retry: 1, // retry once on failure
    });
}