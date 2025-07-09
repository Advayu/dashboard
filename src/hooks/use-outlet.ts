import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOutlet, createOutlet, updateOutlet, deleteOutlet, getOutlets, getRedemptionTraffic } from '@/services/outlet-service';

export function useGetOutlets(brand_id: string) {
    return useQuery({
        queryKey: ['outlets', brand_id],
        queryFn: () => getOutlets(brand_id),
        enabled: !!brand_id,
        staleTime: 5 * 60 * 1000, // cache for 5 minutes, tweak as needed
        retry: 1, // retry once on failure
    });
}

export function useGetOutlet(id: string) {
    return useQuery({
        queryKey: ['outlet', id],
        queryFn: () => getOutlet(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // cache for 5 minutes, tweak as needed
        retry: 1, // retry once on failure
    });
}

// Create a new outlet
export function useCreateOutlet() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ brand_id, newOutlet }: { brand_id: string; newOutlet: any }) => {

            return createOutlet(brand_id, newOutlet);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['outlets'] });
        },
    });
}

// Update an existing outlet by ID
export function useUpdateOutlet() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => updateOutlet(id, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['outlets'] });
            queryClient.invalidateQueries({ queryKey: ['outlet', variables.id] });
            window.location.reload();
        },
    });
}

// Delete an outlet by ID
export function useDeleteOutlet() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteOutlet(id),
        onSuccess: (_data, id) => {
            queryClient.invalidateQueries({ queryKey: ['outlets'] });
            queryClient.invalidateQueries({ queryKey: ['outlet', id] });
        },
    });
}

// redemption traffic
interface TrafficParams {
    brand_id: string;
    outlet_ids?: string[];
    fy?: string;
    start?: string;
    end?: string;
}

export const useRedemptionTraffic = (params: TrafficParams) => {
    return useQuery({
        queryKey: [
            "redemptionTraffic",
            params.brand_id,
            params.outlet_ids,
            params.fy,
            params.start,
            params.end,
        ],
        queryFn: () => getRedemptionTraffic(params),
        enabled: !!params.brand_id,
    });
};