import React from 'react';
import {
  Truck,
  Activity,
  Flame,
  CheckCircle,
  Timer,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  GitFork,
} from 'lucide-react';
import { useEmergenx } from '../../context/EmergenxContext';
import { GoogleCityMap } from '../map/GoogleCityMap';
import { VehicleCategory, EmergencySeverity } from '../../types';

export const OverviewDashboard: React.FC<{
  onNavigate: (viewId: string) => void;
  onOpenActivationModal: () => void;
}> = ({ onNavigate, onOpenActivationModal }) => {
  const {
    vehicles,
    requests,
    intersections,
    journeys,
    categoryFilter,
    setCategoryFilter,
    severityFilter,
    setSeverityFilter,
    approveRequestPriority,
  } = useEmergenx();

  // Metrics calculations
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter((v) => v.status === 'en_route' || v.status === 'transporting').length;
  const activeRequests = requests.filter((r) => r.status === 'active').length;
  const pendingApprovalRequests = requests.filter((r) => r.status === 'pending_approval').length;
  const completedJourneysCount = journeys.length;
  const averageResponseTimeMin = (
    journeys.reduce((acc, j) => acc + j.actualSimulatedMinutes, 0) / (journeys.length || 1)
  ).toFixed(1);
  const averageSavedTimeMin = (
    journeys.reduce((acc, j) => acc + j.simulatedTimeSavedMinutes, 0) / (journeys.length || 1)
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Banner: Smart City Mobility Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-white">Central Emergency Mobility Command</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 font-semibold uppercase">
              Bangalore Urban Grid
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Coordinated multi-emergency prioritization across 10 arterial intersections & 3 trauma centers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('conflicts')}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <GitFork className="w-4 h-4 text-orange-400" />
            <span>Run Conflict Simulation</span>
          </button>
          <button
            onClick={onOpenActivationModal}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Dispatch Emergency</span>
          </button>
        </div>
      </div>

      {/* 7 Core KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Metric 1 */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-medium">Fleet Vehicles</span>
            <Truck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white tabular-nums">{totalVehicles}</div>
          <span className="text-[10px] text-slate-500 font-mono">16 Registered</span>
        </div>

        {/* Metric 2 */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-medium">Active En-Route</span>
            <Activity className="w-4 h-4 text-red-400 animate-pulse" />
          </div>
          <div className="text-xl font-bold font-mono text-red-400 tabular-nums">{activeVehicles}</div>
          <span className="text-[10px] text-slate-500 font-mono">High priority transit</span>
        </div>

        {/* Metric 3 */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-medium">Active Incidents</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-xl font-bold font-mono text-orange-400 tabular-nums">{activeRequests}</div>
          <span className="text-[10px] text-slate-500 font-mono">Corridors cleared</span>
        </div>

        {/* Metric 4 */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-medium">Pending Approval</span>
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-xl font-bold font-mono text-yellow-400 tabular-nums">{pendingApprovalRequests}</div>
          <span className="text-[10px] text-slate-500 font-mono">Controller review</span>
        </div>

        {/* Metric 5 */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-medium">Congestion Index</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-400 tabular-nums">64%</div>
          <span className="text-[10px] text-slate-500 font-mono">Moderate / Peak flow</span>
        </div>

        {/* Metric 6 */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-medium">Completed Runs</span>
            <CheckCircle className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-xl font-bold font-mono text-teal-400 tabular-nums">{completedJourneysCount}</div>
          <span className="text-[10px] text-slate-500 font-mono">Zero collisions</span>
        </div>

        {/* Metric 7 */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-medium">Avg Sim Response</span>
            <Timer className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">{averageResponseTimeMin}m</div>
          <span className="text-[10px] text-slate-500 font-mono">Saved {averageSavedTimeMin}m sim</span>
        </div>
      </div>

      {/* Main Interactive Grid: Map + Active Corridors Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Map */}
        <div className="lg:col-span-2 space-y-3">
          {/* Map Header & Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-200">Interactive Urban Grid</span>
              <span className="text-xs text-slate-500 font-mono">· Central Bangalore</span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {(
                [
                  { id: 'all', label: 'All Units' },
                  { id: 'ambulance', label: 'Ambulance' },
                  { id: 'fire_engine', label: 'Fire' },
                  { id: 'police', label: 'Police' },
                  { id: 'blood_transport', label: 'Blood' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setCategoryFilter(f.id as VehicleCategory | 'all')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    categoryFilter === f.id
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Google Maps Platform Frame */}
          <div className="h-[460px] w-full rounded-xl overflow-hidden border border-slate-800 shadow-md">
            <GoogleCityMap />
          </div>
        </div>

        {/* Right 1 Col: Active Emergency Missions & Green Corridors */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Active Emergency Missions</h2>
            <button
              onClick={() => onNavigate('requests')}
              className="text-xs text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              All Requests <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[510px] pr-1">
            {requests
              .filter((r) => r.status === 'active' || r.status === 'pending_approval')
              .map((req) => {
                const assignedVehicle = vehicles.find((v) => v.id === req.vehicleId);
                return (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            req.severity === 'critical'
                              ? 'bg-red-500 animate-ping'
                              : req.severity === 'high'
                              ? 'bg-orange-500'
                              : 'bg-yellow-500'
                          }`}
                        />
                        <span className="font-bold text-xs text-white">
                          {assignedVehicle?.callSign || 'Emergency Unit'}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold uppercase">
                        {req.severity}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-200 line-clamp-1">{req.incidentType}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{req.description}</p>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <div>
                        <span className="text-slate-500 block">Current ETA</span>
                        <span className="font-bold text-emerald-400">{req.currentEtaMinutes} mins</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Priority Score</span>
                        <span className="font-bold text-blue-400">{req.priorityScore}/100</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400 font-mono">
                        Dest: {req.destinationAddress.split(',')[0]}
                      </span>
                      <button
                        onClick={() => onNavigate('green_corridor')}
                        className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                      >
                        Corridor View →
                      </button>
                    </div>
                  </div>
                );
              })}

            {/* Quick Conflict Resolver Callout Card */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-900 to-blue-950/40 border border-blue-900/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
                <GitFork className="w-4 h-4 text-blue-400" />
                <span>AI Conflict Decision Engine</span>
              </div>
              <p className="text-xs text-slate-300">
                Triple-emergency junction convergence active at MG Road & Brigade Road junction.
              </p>
              <button
                onClick={() => onNavigate('conflicts')}
                className="w-full py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer text-center"
              >
                Inspect Conflict Engine Resolution
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
