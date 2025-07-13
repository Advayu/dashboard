"use client";
import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";

const formatValue = (value: number) => `${Math.round(value)}`;

const colors = ["#199EAD"];

interface GraphsProps {
  dataset: { month: string; total: number }[];
  year?: number; // Optional: default to current year
}

const LineGraph: React.FC<GraphsProps> = ({
  dataset = [],
  year = new Date().getFullYear(),
}) => {
  if (!dataset.length) return <p className="text-center">No data available!</p>;

  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthMap = new Map<number, number>();
  dataset.forEach((item) => {
    const date = new Date(item.month);
    if (date.getFullYear() === year) {
      const month = date.getMonth(); // 0 = Jan
      const currentTotal = monthMap.get(month) ?? 0;
      monthMap.set(month, currentTotal + item.total);
    }
  });

  const normalizedData = monthLabels.map((label, index) => ({
    month: label,
    total: monthMap.get(index) ?? 0,
  }));

  return (
    <div className=" border border-blueTilt/30 rounded-md">
      {" "}
      <p className="text-center font-semibold text-lg mb-2">
        Total Redemptions:{" "}
        {normalizedData.reduce((sum, item) => sum + item.total, 0)}
      </p>
      <LineChart
        xAxis={[{ dataKey: "month", scaleType: "band" }]}
        yAxis={[
          {
            valueFormatter: formatValue,
            label: "Total Redemptions",
            tickMinStep: 1,
          },
        ]}
        series={[
          {
            dataKey: "total",
            color: colors[0],
          },
        ]}
        dataset={normalizedData}
        width={688}
        height={400}
        margin={{ left: 70, right: 30, top: 30, bottom: 30 }}
        grid={{ vertical: true, horizontal: true }}
      />
    </div>
  );
};

export default LineGraph;

// "use client";
// import React, { useState } from "react";
// import { LineChart } from "@mui/x-charts/LineChart";
// import Checkbox from "@mui/joy/Checkbox";
// import { styled } from "@mui/system";

// type Series = { dataKey: string; label: string; color: string };

// interface GraphsProps {
//   dataset: { [key: string]: any }[];
//   toggle?: boolean;
// }

// const months = [
//   "Jan",
//   "Feb",
//   "Mar",
//   "Apr",
//   "May",
//   "Jun",
//   "Jul",
//   "Aug",
//   "Sep",
//   "Oct",
//   "Nov",
//   "Dec",
// ];

// const formatValue = (value: number) => {
//   return `${value / 1000}k`;
// };

// // Generate a color palette
// const colors = [
//   "#4682B4", // SteelBlue
//   "#800080", // Purple
//   "#FF6347", // Tomato
//   "#FFD700", // Gold
//   "#ADFF2F", // GreenYellow
//   "#00CED1", // DarkTurquoise
//   "#FF69B4", // HotPink
//   "#8A2BE2", // BlueViolet
//   "#7FFF00", // Chartreuse
//   "#DC143C", // Crimson
// ];

// const CustomCheckbox = styled(Checkbox)(({ theme, color }) => ({
//   color: color,
//   "&.Mui-checked": {
//     color: color,
//     border: `1px solid ${color}`,
//   },
//   "& .MuiSvgIcon-root": {
//     fill: color,
//   },
// }));

// const LineGraph: React.FC<GraphsProps> = ({ dataset, toggle = false }) => {
//   const seriesKeys = Object.keys(dataset[0]).filter((key) => key !== "month");
//   const [selectedSeries, setSelectedSeries] = useState<string[]>(seriesKeys);

//   const handleCheckboxChange = (series: string) => {
//     setSelectedSeries((prev) =>
//       prev.includes(series)
//         ? prev.filter((item) => item !== series)
//         : [...prev, series]
//     );
//   };

//   // Render series with label and color
//   const renderedSeries: Series[] = seriesKeys
//     .filter((key) => selectedSeries.includes(key))
//     .map((key, index) => ({
//       dataKey: key,
//       label: key, // Add a label property with the same value as the key
//       color: colors[index % colors.length],
//     }));

//   return (
//     <div>
//       {toggle && (
//         <div className="mb-4">
//           {seriesKeys.map((key, index) => (
//             <Checkbox
//               onChange={() => handleCheckboxChange(key)}
//               checked={selectedSeries.includes(key)}
//               // className={`checkbox-${index} mx-2`}
//               className="mx-2"
//               key={key}
//               disabled={false}
//               label={key}
//               variant="outlined"
//               color="danger"
//               sx={{
//                 "&.Mui-checked": {
//                   color: colors[index % colors.length],
//                 },
//                 "& .MuiSvgIcon-root": {
//                   fill: colors[index % colors.length],
//                   border: `1px solid ${colors[index % colors.length]}`,
//                   borderRadius: 4,
//                 },
//               }}
//             />
//           ))}
//         </div>
//       )}
//       <LineChart
//         xAxis={[
//           {
//             dataKey: "month",
//             valueFormatter: (value) => value.slice(0, 3), // Using the first 3 letters of the month
//             scaleType: "band",
//           },
//         ]}
//         yAxis={[
//           {
//             dataKey: "value",
//             valueFormatter: formatValue,
//           },
//         ]}
//         series={renderedSeries.map((series) => ({
//           dataKey: series.dataKey,
//           // label: series.label,
//           color: series.color,
//         }))}
//         dataset={dataset}
//         width={688}
//         height={311}
//         margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
//         grid={{ vertical: true, horizontal: true }}
//       />
//     </div>
//   );
// };

// export default LineGraph;
