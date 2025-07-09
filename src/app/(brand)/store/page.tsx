// app/outlets/page.tsx or pages/outlets.tsx (depending on your Next.js version)
"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetOutlets } from "@/hooks/use-outlet";
import SearchBar from "./components/SearchBar";
import OutletAccordion from "./components//OutletAccordion";
import { Button } from "@/components/ui/button";
import { filterOutlets } from "./utils/filter";
import { useRouter } from "next/navigation";
import { RootState } from "@/store/store";

export default function Page() {
  const brand = useSelector((state: any) => state.brand);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOutlets, setFilteredOutlets] = useState<any[]>([]);
  const router = useRouter();

  // Get outlets from the API
  const brand_id = useSelector((state: RootState) => state.brandUser.brand_id);

  const { data: outlets = [], isLoading } = useGetOutlets(brand_id);

  useEffect(() => {
    if (outlets.length) {
      const filtered = filterOutlets(outlets, searchQuery);
      setFilteredOutlets(filtered);
    }
  }, [searchQuery, outlets]);

  const handleAddOutletClick = () => {
    router.push("/store/add");
  };

  return (
    <div className="md:w-[93%] w-full flex flex-col md:pl-10 md:mt-16 md:pr-4 mt-10 px-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-3xl font-bold">
          {brand?.name || "Brand"}
        </h1>
        <div className="flex gap-4 items-center">
          <Button variant="outline" onClick={handleAddOutletClick}>
            + Add Outlet
          </Button>
          <div className="hidden md:block">
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="block md:hidden mb-4">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Empty state */}
      {outlets.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center text-center py-16">
          <p className="mb-4">No outlets added yet.</p>
          <Button onClick={handleAddOutletClick}>+ Add Outlet</Button>
        </div>
      )}

      {/* Outlet List */}
      {filteredOutlets.map((outlet) => (
        <OutletAccordion key={outlet?.id} outlet={outlet} />
      ))}
    </div>
  );
}
