// hooks/useOutletOffers.ts
import { useState, useEffect } from "react";
import { getOfferByOutletId } from "@/services/offer-service";

export function useOutletOffers(outletId: string) {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 4;

    const fetchOffers = async (page: number) => {
        setLoading(true);
        try {
            const res = await getOfferByOutletId(outletId, limit, page);
            setOffers(res.data);
            setTotalPages(Math.ceil(res.total / limit));
            setCurrentPage(page);
        } catch (err) {
            console.error("Offer fetch error", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOffers(1);
    }, [outletId]);

    return {
        offers,
        loading,
        currentPage,
        totalPages,
        nextPage: () => fetchOffers(currentPage + 1),
        prevPage: () => fetchOffers(currentPage - 1),
    };
}
