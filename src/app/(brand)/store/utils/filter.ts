// utils/filter.ts
export function filterOutlets(outlets: any[], query: string) {
    return outlets.filter((outlet) =>
        outlet.name.toLowerCase().includes(query.toLowerCase())
    );
}
