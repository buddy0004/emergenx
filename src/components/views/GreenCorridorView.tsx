import React, { useState } from 'react';
import {
  GitFork,
  CheckCircle2,
  Play,
  RotateCcw,
  ShieldCheck,
  AlertOctagon,
  ArrowRight,
  Radio,
  Zap,
} from 'lucide-react';
import { useEmergenx } from '../../context/EmergenxContext';

export const GreenCorridorView: React.FC = () => {
  const { intersections, vehicles, requests } = useEmergenx();
  const [corridorActive, setCorridorActive] = useState<boolean>(true);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(1);
  const [isAdvancing, setIsAdvancing] = useState<boolean>(false);

  // Focus on 5 key intersections along the primary corridor
  const corridorIntersections = intersections.slice(0, 5);
  const activeAmbulance = vehicles.find((v) => v.id === 'veh_amb_01') || vehicles[0];

  const handleSimulatePass = () => {
    setIsAdvancing(true);
    setTimeout(() => {
      setActiveStepIndex((prev) => (prev < 4 ? prev + 1 : 0));
      setIsAdvancing(false);
    }, 600);
  };

  const handleResetCorridor = () => {
    setActiveStepIndex(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Smart Green Corridor Simulation</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold uppercase">
              Closed Dynamic Model (SUMO Compatible)
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Simulates dynamic traffic signal preemption, approach detection windows, and automated recovery cycles.
            Does not interface with physical municipal signals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleResetCorridor}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Wave</span>
          </button>
          <button
            onClick={handleSimulatePass}
            disabled={isAdvancing}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Play className={`w-4 h-4 ${isAdvancing ? 'animate-spin' : ''}`} />
            <span>{isAdvancing ? 'Advancing Unit...' : 'Step Vehicle Forward'}</span>
          </button>
        </div>
      </div>

      {/* Transit Unit Status Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Active Preempted Unit: {activeAmbulance?.callSign}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-blue-950 text-blue-300 rounded border border-blue-800 uppercase">
                {activeAmbulance?.category}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Transit Route: Cubbon Road to Manipal Hospital (7.1 km)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-500 block text-[10px]">Corridor Preemption</span>
            <span className="text-emerald-400 font-bold">AUTHORIZED</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Estimated Arrival</span>
            <span className="text-slate-200 font-bold">5.8 mins</span>
          </div>
        </div>
      </div>

      {/* 5-Intersection Interactive Green Corridor Strip */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-200 uppercase font-mono">
            Sequential Signal Node Strip (Arterial Corridor)
          </span>
          <span className="text-slate-400 font-mono text-[11px]">
            Vehicle at Intersection Node #{activeStepIndex + 1}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {corridorIntersections.map((inter, idx) => {
            const isVehicleHere = idx === activeStepIndex;
            const isPassed = idx < activeStepIndex;
            const isUpcoming = idx > activeStepIndex;

            let signalBadge = 'bg-slate-800 text-slate-300';
            let signalState = 'STANDARD';
            let dotColor = 'bg-slate-500';

            if (isVehicleHere) {
              signalBadge = 'bg-emerald-950 text-emerald-300 border border-emerald-600';
              signalState = 'PRIORITY GREEN';
              dotColor = 'bg-emerald-400 animate-pulse';
            } else if (isPassed) {
              signalBadge = 'bg-slate-800 text-slate-400';
              signalState = 'RECOVERY CYCLE';
              dotColor = 'bg-blue-500';
            } else if (idx === activeStepIndex + 1) {
              signalBadge = 'bg-yellow-950 text-yellow-300 border border-yellow-700';
              signalState = 'PREEMPTING';
              dotColor = 'bg-yellow-400';
            }

            return (
              <div
                key={inter.id}
                className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                  isVehicleHere
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                    : isPassed
                    ? 'bg-slate-900/60 border-slate-800 opacity-80'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">NODE 0{idx + 1}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${signalBadge}`}>
                      {signalState}
                    </span>
                  </div>

                  <h3 className="font-bold text-xs text-white line-clamp-1">{inter.name}</h3>
                  <p className="text-[10px] text-slate-400 truncate">{inter.crossStreetName}</p>

                  {/* Signal Node Graphic */}
                  <div className="flex items-center justify-center p-3 bg-slate-950 rounded-lg border border-slate-800 my-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-3.5 h-3.5 rounded-full ${dotColor}`}></span>
                      <span className="text-xs font-mono font-bold text-slate-200">
                        {isVehicleHere ? 'GREEN HOLD (30s)' : isPassed ? 'RESTORED' : 'PRE-CLEAR'}
                      </span>
                    </div>
                  </div>

                  {/* Telemetry info */}
                  <div className="text-[11px] font-mono text-slate-400 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Queue:</span>
                      <span className="text-slate-200">{inter.queueLengthMeters}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Preempt Window:</span>
                      <span className="text-slate-200">+{35 * (idx + 1)}s</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-2 border-t border-slate-800/80 text-[10px] font-mono">
                  {isVehicleHere ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Radio className="w-3 h-3" /> Transponder Locked
                    </span>
                  ) : isPassed ? (
                    <span className="text-slate-400">✓ Unit Cleared</span>
                  ) : (
                    <span className="text-slate-400">Staged for Phase Hold</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
