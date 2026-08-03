"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

type RevenueItem = {
  _id: {
    year: number;
    month: number;
  };
  revenue: number;
};

type Props = {
  data: RevenueItem[];
};

export default function RevenueChart({ data }: Props) {
  const monthNames = [
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

  const labels = data.map(
    (item) => monthNames[item._id.month - 1]
  );

  const revenue = data.map(
    (item) => item.revenue
  );

  const chartData = {
    labels,

    datasets: [
      {
        label: "Revenue",

        data: revenue,

        borderColor: "#D4AF37",

        backgroundColor: "rgba(212,175,55,0.25)",

        fill: true,

        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,

    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-10">
      <h2 className="text-2xl font-bold mb-6">
        📈 Revenue Overview
      </h2>

      <Line
        data={chartData}
        options={options}
      />
    </div>
  );
}