import React, { useState } from 'react';
import {
  Wifi,
  WifiOff,
  Radio,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Clock,
  ShieldAlert,
  Server,
} from 'lucide-react';
import { useEmergenx } from '../../context/EmergenxContext';

export const NetworkResilienceView: React.FC = () => {
  const { networkStatus, setNetworkStatus, gpsStaleSeconds, vehicles, addNotification } = useEmergenx();
  const [queuedPackets, setQueuedPackets] = useState<number>(networkStatus === 'offline' ? 14 : 0);

  const handleSimulateStatus = (status: 'normal' | 'weak' | 'offline') => {
    setNetworkStatus(status);
    if (status === 'offline') {
      setQueuedPackets(18);
      addNotification({
        type: 'network',
        severity: 'critical',
        title: 'Cellular Network Interruption',
        message: 'Primary transponder uplink dropped. Displaying last verified telemetry with stale timer.',
      });
    } else if (status === 'weak') {
      setQueuedPackets(6);
      addNotification({
        type: 'network',
        severity: 'warning',
        title: 'Weak Cellular Telemetry',
        message: 'Packet latency exceeding 1200ms. Compression protocol engaged.',
      });
    } else {
      setQueuedPackets(0);
      addNotification({
        type: 'network',
        severity: 'success',
        title: 'Network Telemetry Restored',
        message: 'All queued transponder packets successfully synchronized with Command Center.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-blue-950/80 border border-blue-700 text-blue-400">
              <Wifi className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Network Resilience & GPS Continuity</h1>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                networkStatus === 'normal'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : networkStatus === 'weak'
                  ? 'bg-yellow-950 text-yellow-300 border border-yellow-800'
                  : 'bg-red-950 text-red-300 border border-red-800'
              }`}
            >
              Status: {networkStatus}
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Simulates cellular telemetry interruptions, packet retransmission buffers, and stale GPS safeguards to prevent misleading coordinate display during outages.
          </p>
        </div>

        {/* Simulation Control Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSimulateStatus('normal')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              networkStatus === 'normal'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Normal (Live)
          </button>
          <button
            onClick={() => handleSimulateStatus('weak')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              networkStatus === 'weak'
                ? 'bg-yellow-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Weak (High Latency)
          </button>
          <button
            onClick={() => handleSimulateStatus('offline')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              networkStatus === 'offline'
                ? 'bg-red-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Offline (Blackout)
          </button>
        </div>
      </div>

      {/* Warning Alert if offline */}
      {networkStatus === 'offline' && (
        <div className="p-4 rounded-xl bg-red-950/80 border border-red-700 text-red-200 text-xs space-y-2 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2 font-bold text-red-400 text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>CRITICAL TELEMETRY SAFEGUARD ACTIVE</span>
          </div>
          <p className="leading-relaxed">
            All 16 emergency vehicle positions are currently frozen at their last verified transponder coordinates.
            Coordinates are explicitly flagged as <strong>STALE ({gpsStaleSeconds} seconds old)</strong> to prevent traffic controllers from making dispatch assumptions on outdated tracking data.
          </p>
        </div>
      )}

      {/* Telemetry Architecture Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Preserved Coordinates</span>
            <Radio className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">16 / 16</div>
          <p className="text-[11px] text-slate-400">
            Last verified GPS packets cached in local transponder memory.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Stale GPS Timer</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-400 tabular-nums">
            {networkStatus === 'normal' ? '0s (Live)' : `${gpsStaleSeconds}s Stale`}
          </div>
          <p className="text-[11px] text-slate-400">
            Elapsed time since last valid bidirectional cryptographic handshake.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Offline Queue Buffer</span>
            <Server className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
            {networkStatus === 'normal' ? '0 Packets' : `${queuedPackets} Buffered`}
          </div>
          <p className="text-[11px] text-slate-400">
            Telemetry updates stored on transponder flash awaiting cellular reconnect.
          </p>
        </div>
      </div>

      {/* Vehicle Stale Status Table */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="font-bold text-xs text-white uppercase font-mono">
          Vehicle Transponder Uplink Health Inspector
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[10px] uppercase font-mono text-slate-400 bg-slate-950/80 border-b border-slate-800">
              <tr>
                <th className="px-3 py-2">Call Sign</th>
                <th className="px-3 py-2">Last Known Lat/Lng</th>
                <th className="px-3 py-2">Last Verified Timestamp</th>
                <th className="px-3 py-2">Data Quality</th>
                <th className="px-3 py-2">Buffered Packets</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {vehicles.slice(0, 6).map((v) => {
                const isStale = networkStatus !== 'normal';
                return (
                  <tr key={v.id} className="hover:bg-slate-800/40">
                    <td className="px-3 py-2 font-bold text-slate-200">{v.callSign}</td>
                    <td className="px-3 py-2 text-slate-400">
                      {v.currentLocation.lat.toFixed(4)}°N, {v.currentLocation.lng.toFixed(4)}°E
                    </td>
                    <td className="px-3 py-2 text-slate-300">
                      {isStale ? `${gpsStaleSeconds}s ago` : 'Real-time (<1s)'}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isStale
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {isStale ? 'STALE SAFEGUARD' : 'NOMINAL (LIVE)'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-slate-400">
                      {isStale ? `${Math.round(queuedPackets / 2)} telemetry frames` : 'Synchronized'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
