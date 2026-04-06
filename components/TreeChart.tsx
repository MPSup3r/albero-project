"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TreeChart({ data }: { data: any[] }) {
  const chartData = data && data.length > 0 ? data : [
    { date: 'Esempio 1', height_cm: 150, circumference_cm: 15 },
    { date: 'Esempio 2', height_cm: 180, circumference_cm: 22 },
  ];

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
          <Legend />
          <Line type="monotone" name="Altezza (cm)" dataKey="height_cm" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
          <Line type="monotone" name="Circonf. (cm)" dataKey="circumference_cm" stroke="#f59e0b" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}