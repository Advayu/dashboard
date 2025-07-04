
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getIndustries, getCategoriesByIndustry } from '@/services/industry-service';

export function useGetIndustries() {
    return useQuery({
        queryKey: ['industries'],
        queryFn: () => getIndustries(),
        enabled: true,
        staleTime: 5 * 60 * 1000, // cache for 5 minutes, tweak as needed
        retry: 1, // retry once on failure
    });
}

export function useGetCategoriesByIndustry(industry_name: string) {
    return useQuery({
        queryKey: ['categories', industry_name],
        queryFn: () => getCategoriesByIndustry(industry_name),
        enabled: !!industry_name,
        staleTime: 5 * 60 * 1000, // cache for 5 minutes, tweak as needed
        retry: 1, // retry once on failure
    });
}