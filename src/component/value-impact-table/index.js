import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StackedBarChart = () => {
  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
    ],
    datasets: [
      {
        label: "Excellent",
        data: [21, 19, 24, 20, 15, 17, 22, 25, 48],
        backgroundColor: "blue",
        stack: "Stack 0",
      },
      {
        label: "Good performance",
        data: [14, 12, 10, 16, 9, 7, 11, 25, 48],
        backgroundColor: "green",
        stack: "Stack 0",
      },
      {
        label: "Bad performance",
        data: [2, 1, 3, 4, 1, 5, 4, 25, 48],
        backgroundColor: "red",
        stack: "Stack 1",
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: "Stacked Bar Chart",
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default StackedBarChart;
