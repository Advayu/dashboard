"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LineGraph from "@/components/ui/lineGraph";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useRedemptionTraffic } from "@/hooks/use-outlet";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store"; // Adjust this to your actual store
import { subDays, format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion"; // 👈 Import motion

const BorderLinearProgress = styled(LinearProgress)(() => ({
  height: 10,
  borderRadius: 0,
  "&.MuiLinearProgress-colorPrimary": {
    backgroundColor: "#199EAD",
  },
  "& .MuiLinearProgress-bar": {
    backgroundColor: "#535353",
  },
}));

const fiscalYears = ["FY 22-23", "FY 23-24", "FY 24-25", "FY 25-26"];

export default function SalesGraph({ id }: { id: string }) {
  const brand_id = useSelector((state: RootState) => state.brandUser.brand_id);

  const today = new Date();
  const sevenDaysAgo = subDays(today, 7);

  const [formState, setFormState] = useState({
    startDate: format(sevenDaysAgo, "yyyy-MM-dd"),
    endDate: format(today, "yyyy-MM-dd"),
    fy: "FY 25-26",
  });

  const debouncedFormState = useDebounce(formState, 800);

  const { data, isLoading, error } = useRedemptionTraffic({
    brand_id,
    outlet_ids: [id],
    fy: debouncedFormState.fy,
    start: debouncedFormState.startDate,
    end: debouncedFormState.endDate,
  });

  const handleInputChange = (
    field: "startDate" | "endDate" | "fy",
    value: string
  ) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderDateInput = (field: "startDate" | "endDate") => (
    <input
      name={field}
      type="date"
      className="border border-black rounded-md px-4 py-2 text-center"
      value={formState[field]}
      onChange={(e) => handleInputChange(field, e.target.value)}
    />
  );

  const chartData = data?.[id] ?? [];

  return (
    <div className="min-w-[720px]">
      {/*  Filters */}
      <div className="flex flex-wrap md:space-x-4 mb-4 items-center">
        <div className="flex items-center space-x-2">
          <h3>Sales with Advayu</h3>
          <Select
            onValueChange={(val) => handleInputChange("fy", val)}
            value={formState.fy}>
            <SelectTrigger className="w-[180px] border border-black">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {fiscalYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year.replace("FY ", "")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          {renderDateInput("startDate")}
          <div className="h-[0.1rem] w-[1rem] bg-black rounded-full" />
          {renderDateInput("endDate")}
        </div>
      </div>

      {/*  Summary */}
      <div className="grid md:grid-cols-[1fr_4fr] gap-4 items-center mt-4">
        <p className="text-[#2AA000] text-3xl font-bold">+888.8%</p>
        <Stack spacing={2} sx={{ flexGrow: 1 }}>
          <BorderLinearProgress variant="determinate" value={70} />
        </Stack>
      </div>

      <div className="flex justify-between md:ml-40 items-center text-sm">
        <p>Other</p>
        <p className="md:mr-10">Advayu</p>
      </div>

      {/*  Graph / Loading / Error with Animation */}
      <div className="mt-6 hidden md:block min-h-[350px]">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.p
              key="loading"
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
              Loading...
            </motion.p>
          ) : error ? (
            <motion.p
              key="error"
              className="text-center text-red-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
              Something went wrong!
            </motion.p>
          ) : (
            <motion.div
              key="graph"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}>
              <LineGraph dataset={chartData} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// const dummyApiData: any = {
//   "e13b9a29-fb29-4232-b5ed-12776e234494": [
//     { month: "2025-07-01T00:00:00.000Z", total: 3 },
//     { month: "2025-08-01T00:00:00.000Z", total: 5 },
//     { month: "2025-09-01T00:00:00.000Z", total: 2 },
//     { month: "2025-10-01T00:00:00.000Z", total: 50 },
//     { month: "2025-11-01T00:00:00.000Z", total: 20 },
//     { month: "2025-12-01T00:00:00.000Z", total: 140 },
//   ],
// };
