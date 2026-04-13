"use client";

import { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

export default function TreeChart({ data }: { data: any[] }) {
  const chartRef = useRef<any>(null);

  const chartData = data && data.length > 0 ? data : [
    { date: 'Esempio 1', height_cm: 150, circumference_cm: 15 },
    { date: 'Esempio 2', height_cm: 180, circumference_cm: 22 },
  ];

  const labels = chartData.map((d: any) => d.date);
  const heightData = chartData.map((d: any) => d.height_cm);
  const circumferenceData = chartData.map((d: any) => d.circumference_cm);

  const resetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  const zoomIn = () => {
    if (chartRef.current) {
      chartRef.current.zoom(1.2);
    }
  };

  const zoomOut = () => {
    if (chartRef.current) {
      chartRef.current.zoom(0.8);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 20,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#000',
        bodyColor: '#333',
        borderColor: 'rgb(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy' as const,
        },
        zoom: {
          wheel: {
            enabled: false,
          },
          pinch: {
            enabled: true
          },
          mode: 'xy' as const,
        }
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        grid: {
          color: '#e2e8f0',
        },
        ticks: {
          color: '#64748b'
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b'
        }
      }
    }
  };

  const chartJsData = {
    labels,
    datasets: [
      {
        label: 'Altezza (cm)',
        data: heightData,
        borderColor: '#10b981',
        backgroundColor: '#10b981',
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.3,
        yAxisID: 'y',
      },
      {
        label: 'Circonf. (cm)',
        data: circumferenceData,
        borderColor: '#f59e0b',
        backgroundColor: '#f59e0b',
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.3,
        yAxisID: 'y',
      }
    ]
  };

  return (
    <div className="h-[500px] w-full flex flex-col relative bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      <div className="absolute z-10 top-4 right-4 flex gap-2">
        <button 
          onClick={zoomOut}
          className="bg-white/80 backdrop-blur border border-slate-200 text-slate-600 w-8 h-8 flex items-center justify-center text-lg rounded-md shadow-sm hover:bg-slate-50 transition-colors font-bold leading-none"
          title="Zoom Out"
        >
          -
        </button>
        <button 
          onClick={zoomIn}
          className="bg-white/80 backdrop-blur border border-slate-200 text-slate-600 w-8 h-8 flex items-center justify-center text-lg rounded-md shadow-sm hover:bg-slate-50 transition-colors font-bold leading-none"
          title="Zoom In"
        >
          +
        </button>
        <button 
          onClick={resetZoom}
          className="bg-white/80 backdrop-blur border border-slate-200 text-slate-600 px-3 h-8 text-sm rounded-md shadow-sm hover:bg-slate-50 transition-colors flex items-center"
        >
          Ripristina
        </button>
      </div>
      <div className="flex-1 w-full relative min-h-0">
        <Line ref={chartRef} options={chartOptions} data={chartJsData} />
      </div>
      <p className="text-xs text-slate-400 text-center mt-4">
        Usa i pulsanti o pizzica lo schermo per zoomare. Trascina per spostarti lungo il grafico.
      </p>
    </div>
  );
}