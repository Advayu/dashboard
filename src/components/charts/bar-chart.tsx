"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A bar chart";

// const rawData = {
//   "313189d7-645e-4c19-9308-383b58702c27": [
//     { month: "2025-07-01T00:00:00.000Z", total: 9 },
//   ],
//   "717e7a0f-77dd-4dae-b8cc-746d385420d0": [
//     { month: "2025-07-01T00:00:00.000Z", total: 3 },
//   ],
//   "b73ebe53-b452-418e-af37-a9138d2f534a": [
//     { month: "2025-07-01T00:00:00.000Z", total: 4 },
//   ],
//   "e13b9a29-fb29-4232-b5ed-12776e234494": [
//     { month: "2025-07-01T00:00:00.000Z", total: 3 },
//   ],
//   "e13b9a29-fb29-4232-b5ed-2776e234494": [
//     { month: "2025-07-01T00:00:00.000Z", total: 3 },
//   ],
//   "e13b9a29-fb29-4232-b5ed-1276e234494": [
//     { month: "2025-07-01T00:00:00.000Z", total: 3 },
//   ],
//   "e13b9a29-fb29-4232-b5ed-12776e23494": [
//     { month: "2025-07-01T00:00:00.000Z", total: 3 },
//   ],
//   "e13b9a29-fb29-4232-b5ed-12776e2394": [
//     { month: "2025-07-01T00:00:00.000Z", total: 3 },
//   ],
// };

const chartConfig = {
  desktop: {
    label: "Outlet",
    color: "#189ead",
  },
} satisfies ChartConfig;

export function ChartBarDefault({ rawData }: any) {
  if (!rawData)
    return (
      <div className="text-center">
        <p>No data available for bar chart.</p>
      </div>
    );
  const chartData = Object.entries(rawData).map(([id, data]: any) => ({
    outlet: id, // or use a name map if available
    redemptions: data[0].total,
    name: data[0].outlet_name,
  }));
  return (
    <ChartContainer
      className="max-h-[20rem] w-full bg-blueTilt/10 p-4 rounded-md"
      config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 20,
        }}>
        <CartesianGrid vertical={true} />
        <XAxis
          dataKey="name"
          tickLine={true}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis allowDecimals={true} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar
          dataKey="redemptions"
          fill="var(--color-desktop)"
          radius={8}
          barSize={40}>
          <LabelList
            dataKey="redemptions"
            position="top"
            offset={12}
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
