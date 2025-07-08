// components/outlets/SalesGraph.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangeSelector } from "@/components/ui/date-picker";
import LineGraph from "@/components/ui/lineGraph";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import { dataset2 } from "@/components/utils/dataset";
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

export default function SalesGraph() {
  return (
    <div>
      <div className="flex flex-wrap md:space-x-4 mb-4 items-center">
        <div className="flex items-center space-x-2">
          <h3>Sales with Advayu</h3>
          <Select>
            <SelectTrigger className="w-[180px] border border-black">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DateRangeSelector />
      </div>

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

      <div className="hidden md:block mt-6">
        <LineGraph dataset={dataset2} />
      </div>
    </div>
  );
}
