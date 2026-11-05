import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  Printer,
  FileSpreadsheet,
  TrendingDown,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useEmergenx } from '../../context/EmergenxContext';

export const AnalyticsReportsView: React.FC = () => {
  const { journeys } = useEmergenx();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredJourneys = journeys.filter((j) => {
    if (selectedCategory !== 'all' && j.category !== selectedCategory) return false;
    return true;
  });

  // Chart data: Without Priority vs Simulated Journey Time
  const comparisonData = filteredJourneys.map((j) => ({
    name: j.vehicleCallSign.split(' ')[0],
    withoutPriority: j.timeWithoutPriorityMinutes,
    simulatedActual: j.actualSimulatedMinutes,
    simulatedSaved: j.simulatedTimeSavedMinutes,
  }));

  // Aggregate Category Breakdown
  const categoryData = [
    { category: 'Ambulance', avgSaved: 6.6, count: 1 },
    { category: 'Fire Engine', avgSaved: 3.9, count: 1 },
    { category: 'Blood Transport', avgSaved: 6.7, count: 1 },
    { category: 'Police Patrol', avgSaved: 3.7, count: 1 },
  ];

  const handleDownloadCsv = () => {
    const headers = [
      'Journey ID',
      'Vehicle Call Sign',
      'Category',
      'Start Time',
      'End Time',
      'Distance (km)',
      'Without Priority (min)',
      'Simulated Actual (min)',
      'Simulated Saved (min)',
      'Intersections Cleared',
      'Hospital Destination',
    ];

    const rows = filteredJourneys.map((j) => [
      j.id,
      j.vehicleCallSign,
      j.category,
      j.startTime,
      j.endTime,
      j.totalDistanceKm,
      j.timeWithoutPriorityMinutes,
      j.actualSimulatedMinutes,
      j.simulatedTimeSavedMinutes,
      j.intersectionsCleared,
      `"${j.hospitalDelivered}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `emergenx_journey_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-blue-950/80 border border-blue-700 text-blue-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Emergency Journey Analytics & Reports</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-semibold uppercase">
              Demonstration Records
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Audit-grade performance metrics for completed emergency transits. All efficiency gains are labeled as simulation values.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Total Analyzed Runs</span>
          <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">{journeys.length}</div>
          <span className="text-[10px] text-slate-500 font-mono">Simulated transits</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Avg Time Saved (Simulated)</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">5.2 mins</div>
          <span className="text-[10px] text-slate-500 font-mono">vs unprioritized transit</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Avg Intersection Wait</span>
          <div className="text-2xl font-bold font-mono text-blue-400 mt-1 tabular-nums">5.8 secs</div>
          <span className="text-[10px] text-slate-500 font-mono">During green wave hold</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Congestion Avoidance</span>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">4.1 mins</div>
          <span className="text-[10px] text-slate-500 font-mono">Saved via bypass routes</span>
        </div>
      </div>

      {/* Recharts Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Time Comparison */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-white uppercase font-mono">
              Unprioritized vs Simulated Transit Time (Minutes)
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Lower is faster</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="withoutPriority" fill="#ef4444" name="Without Priority (min)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="simulatedActual" fill="#10b981" name="Simulated Green Corridor (min)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category Average Simulated Savings */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-white uppercase font-mono">
              Average Simulated Time Saved by Category (Minutes)
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Efficiency Gain</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="avgSaved" fill="#3b82f6" name="Simulated Minutes Saved" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Journey Ledger Table */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs text-white uppercase font-mono">Completed Journey Log</h3>
          <span className="text-[11px] font-mono text-slate-400">All data clearly simulated</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[10px] uppercase font-mono text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Time Window</th>
                <th className="px-4 py-3">Distance</th>
                <th className="px-4 py-3">Standard Transit</th>
                <th className="px-4 py-3">Simulated Transit</th>
                <th className="px-4 py-3">Simulated Saved</th>
                <th className="px-4 py-3">Nodes Crossed</th>
                <th className="px-4 py-3">Destination</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredJourneys.map((j) => (
                <tr key={j.id} className="hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-bold text-slate-200">{j.vehicleCallSign}</td>
                  <td className="px-4 py-3 text-slate-400">{j.startTime} - {j.endTime}</td>
                  <td className="px-4 py-3">{j.totalDistanceKm} km</td>
                  <td className="px-4 py-3 text-red-400">{j.timeWithoutPriorityMinutes}m</td>
                  <td className="px-4 py-3 text-emerald-400 font-bold">{j.actualSimulatedMinutes}m</td>
                  <td className="px-4 py-3 text-blue-400 font-bold">-{j.simulatedTimeSavedMinutes}m</td>
                  <td className="px-4 py-3">{j.intersectionsCleared} Signals</td>
                  <td className="px-4 py-3 text-slate-300 font-sans">{j.hospitalDelivered}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
