import React, { useState } from 'react';
import {
  Flame,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Filter,
  PlusCircle,
  AlertTriangle,
  ArrowRight,
  GitFork,
} from 'lucide-react';
import { useEmergenx } from '../../context/EmergenxContext';
import { EmergencySeverity } from '../../types';

export const EmergencyRequestsView: React.FC<{
  onOpenActivation: () => void;
  onNavigate: (view: string) => void;
}> = ({ onOpenActivation, onNavigate }) => {
  const { requests, vehicles, approveRequestPriority } = useEmergenx();
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending_approval' | 'completed'>('all');
  const [severityFilter, setSeverityFilter] = useState<EmergencySeverity | 'all'>('all');

  const filteredRequests = requests.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (severityFilter !== 'all' && r.severity !== severityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-red-950/80 border border-red-700 text-red-400">
              <Flame className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Emergency Coordination Requests</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-semibold uppercase">
              {requests.length} Total Incidents
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time emergency priority authorizations, hospital triage notifications, and green corridor approvals.
          </p>
        </div>

        <button
          onClick={onOpenActivation}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Emergency Request</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300">Status:</span>
          {(['all', 'active', 'pending_approval', 'completed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-xs font-medium rounded-lg capitalize transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300">Severity:</span>
          {(['all', 'critical', 'high', 'medium', 'low'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg capitalize transition-colors cursor-pointer ${
                severityFilter === sev
                  ? 'bg-red-600/30 text-red-300 border border-red-500'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRequests.map((req) => {
          const vehicle = vehicles.find((v) => v.id === req.vehicleId);
          return (
            <div
              key={req.id}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">{req.id.toUpperCase()}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      req.severity === 'critical'
                        ? 'bg-red-950 text-red-300 border border-red-800'
                        : req.severity === 'high'
                        ? 'bg-orange-950 text-orange-300 border border-orange-800'
                        : 'bg-yellow-950 text-yellow-300 border border-yellow-800'
                    }`}
                  >
                    {req.severity}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                    req.status === 'active'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : req.status === 'pending_approval'
                      ? 'bg-yellow-950 text-yellow-300 border border-yellow-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {req.status.replace('_', ' ')}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-100">{req.incidentType}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{req.description}</p>
              </div>

              {/* Vehicle & Corridor summary */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px]">Assigned Unit</span>
                  <span className="font-bold text-slate-200">{vehicle?.callSign || req.vehicleId}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Estimated Arrival</span>
                  <span className="font-bold text-emerald-400">{req.currentEtaMinutes} mins</span>
                </div>
              </div>

              <div className="text-xs text-slate-400 space-y-1">
                <div>
                  <span className="text-slate-500">Origin:</span> {req.pickupAddress}
                </div>
                <div>
                  <span className="text-slate-500">Destination:</span>{' '}
                  <strong className="text-slate-200">{req.destinationAddress}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">
                  Approved by: {req.approvedBy || 'Pending'}
                </span>

                <div className="flex items-center gap-2">
                  {req.status === 'pending_approval' && (
                    <button
                      onClick={() => approveRequestPriority(req.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      Authorize Wave
                    </button>
                  )}
                  <button
                    onClick={() => onNavigate('green_corridor')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 font-medium text-xs transition-colors cursor-pointer"
                  >
                    View Corridor →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
