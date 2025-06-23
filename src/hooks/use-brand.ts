import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBrand, createBrand, updateBrand, deleteBrand } from '@/services/brand-service';



export function useGetBrand(id: string) {
    return useQuery({
        queryKey: ['brand', id],
        queryFn: () => getBrand(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // cache for 5 minutes, tweak as needed
        retry: 1, // retry once on failure
    });
}

// Create a new brand
export function useCreateBrand() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newBrand: any) => createBrand(newBrand),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['brands'] });
        },
    });
}

// Update an existing brand by ID
export function useUpdateBrand() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => updateBrand(id, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['brands'] });
            queryClient.invalidateQueries({ queryKey: ['brand', variables.id] });
        },
    });
}

// Delete a brand by ID
export function useDeleteBrand() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteBrand(id),
        onSuccess: (_data, id) => {
            queryClient.invalidateQueries({ queryKey: ['brands'] });
            queryClient.invalidateQueries({ queryKey: ['brand', id] });
        },
    });
}