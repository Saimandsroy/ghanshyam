import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function BarChart({ labels = [], datasets = [], options = {}, height = 260 }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { grid: { color: 'rgba(148,163,184,0.1)' }, ticks: { color: '#9AA4B2' } },
          y: { grid: { color: 'rgba(148,163,184,0.1)' }, ticks: { color: '#9AA4B2' } },
        },
        plugins: {
          legend: { labels: { color: '#D1D5DB' } },
          title: { display: false },
          tooltip: { enabled: true },
        },
        ...options,
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [labels, datasets, options]);

  return <canvas ref={canvasRef} style={{ height }} />;
}
