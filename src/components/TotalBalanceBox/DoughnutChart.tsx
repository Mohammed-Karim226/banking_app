"use client";
import { DoughnutChartProps } from "@/src/types";
import { Chart as ChartJs, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJs.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ accounts }: DoughnutChartProps) => {
  const data = {
    datasets: [
      {
        label: "Banks",
        data: [1000, 2000, 3000, 1570, 400],
        backgroundColor: ["#0179FE", "#4893FF", "#85B7FF", "#BED9FF"],
      },
    ],
    labels: ["Bank 1", "Bank 2", "Bank 3"],
  };
  return (
    <Doughnut
      data={data}
      options={{
        cutout: "70%",
        plugins: {
          legend: {
            display: false,
          },
        },
      }}
    />
  );
};

export default DoughnutChart;
