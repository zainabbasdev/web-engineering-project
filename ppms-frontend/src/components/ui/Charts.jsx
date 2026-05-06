import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card } from './Card';

/**
 * Line Chart Component
 */
export const LineChartComponent = ({ data, title, dataKey, height = 300 }) => (
  <Card className="p-6">
    {title && <h3 className="text-lg font-bold mb-4 text-neutral-900">{title}</h3>}
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
        <Legend />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke="#0284c7"
          strokeWidth={2}
          dot={{ fill: '#0284c7', r: 4 }}
          activeDot={{ r: 6 }}
          animationDuration={500}
        />
      </LineChart>
    </ResponsiveContainer>
  </Card>
);

/**
 * Bar Chart Component
 */
export const BarChartComponent = ({ data, title, xAxisKey, bars, height = 300 }) => (
  <Card className="p-6">
    {title && <h3 className="text-lg font-bold mb-4 text-neutral-900">{title}</h3>}
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey={xAxisKey} stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
        <Legend />
        {bars.map((bar, idx) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            fill={bar.color || ['#0284c7', '#16a34a', '#dc2626'][idx]}
            animationDuration={500}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  </Card>
);

/**
 * Pie Chart Component
 */
export const PieChartComponent = ({ data, title, height = 300 }) => (
  <Card className="p-6">
    {title && <h3 className="text-lg font-bold mb-4 text-neutral-900">{title}</h3>}
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || '#0284c7'} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </Card>
);

/**
 * Gauge Card - Circular progress indicator for stock levels
 */
export const GaugeCard = ({ title, value, max = 100, unit, icon: Icon, color = 'primary' }) => {
  const percentage = (value / max) * 100;

  const colors = {
    primary: '#0284c7',
    success: '#16a34a',
    warning: '#eab308',
    danger: '#dc2626',
  };

  return (
    <Card className="p-6 flex flex-col items-center justify-center">
      {Icon && <Icon className="w-8 h-8 text-neutral-400 mb-4" />}
      <h3 className="text-sm text-neutral-600 mb-2">{title}</h3>

      <div className="relative w-24 h-24 mb-4">
        <svg width="100" height="100" className="transform -rotate-90">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={colors[color]}
            strokeWidth="8"
            strokeDasharray={`${(percentage / 100) * 283} 283`}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-bold text-neutral-900">{percentage.toFixed(0)}%</p>
          </div>
        </div>
      </div>

      <p className="text-xl font-bold text-neutral-900">
        {value} {unit}
      </p>
      <p className="text-sm text-neutral-600">of {max} {unit}</p>
    </Card>
  );
};

export default LineChartComponent;
