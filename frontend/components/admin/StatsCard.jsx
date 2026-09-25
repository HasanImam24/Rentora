import React from 'react';

export default function StatsCard({ title, value, icon: Icon, trend, trendLabel, color = 'indigo' }) {
  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600',
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
  };

  const badgeColor = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-3xl font-semibold text-gray-900">{value}</p>
          {trend && (
            <span className={`text-sm font-medium ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {trend}
            </span>
          )}
        </div>
        {trendLabel && <p className="mt-1 text-sm text-gray-500">{trendLabel}</p>}
      </div>
      {Icon && (
        <div className={`p-3 rounded-lg ${badgeColor}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}
