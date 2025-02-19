import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, LinearScale, CategoryScale, Tooltip } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register Chart.js components
ChartJS.register(BarElement, LinearScale, CategoryScale, Tooltip, ChartDataLabels);

const StackedTimeProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateProgress = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`); // Format HH:MM

      const start = new Date();
      start.setHours(7, 0, 0, 0); // Start time: 07:00
      const end = new Date();
      end.setHours(16, 0, 0, 0); // End time: 18:00

      if (now < start) {
        setProgress(0);
      } else if (now > end) {
        setProgress(100);
      } else {
        const elapsed = now - start;
        const total = end - start;
        setProgress((elapsed / total) * 100);
      }
    };

    updateProgress(); // Initial call
    const interval = setInterval(updateProgress, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const data = {
    labels: [""], // Single label
    datasets: [
        {
            label: "Current Progress",
            data: [progress], // Current progress (green) overlaps
            backgroundColor: "#4CAF50", // Green color
            borderRadius: 5, // Rounded edges
            stack: "stack1", // Same stack to overlap
        },
      {
        label: "Remaining Time",
        data: [100], // Full 100% bar (gray)
        backgroundColor: "gray", // Gray color
        borderRadius: 5, // Rounded edges
        stack: "stack1", // Stack group
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y", // Horizontal bar
    scales: {
      x: {
        min: 0,
        max: 100,
        stacked: true, // Stack bars
        display: false, // Hide X-axis
      },
      y: {
        stacked: true, // Stack bars
        display: false, // Hide Y-axis
      },
    },
    plugins: {
      tooltip: { enabled: false }, // Disable tooltips
      legend: { display: false }, // Hide legend
      datalabels: {
        color: "white", // Black text color
        font: { size: 24, weight: "bold" },
        anchor: "center",
        align: "center",
        formatter: () => `Time : ${currentTime}`, // Show current time inside progress bar
      },
    },
  };

  return (
    <div>
      <Bar data={data} options={options} height={40}/>
    </div>
  );
};

export default StackedTimeProgressBar;
