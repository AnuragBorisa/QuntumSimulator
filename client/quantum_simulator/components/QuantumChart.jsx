'use client';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function QuantumChart({ data, chartType }) {
  const labels = Object.keys(data);  // ['110', '101', ...]
  const values = Object.values(data);  // [110, 148, ...]

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Quantum Simulation Results',
        data: values,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="chart-container">
      {chartType === 'bar' ? (
        <Bar data={chartData} options={options} />
      ) : (
        <Pie data={chartData} />
      )}
    </div>
  );
}
