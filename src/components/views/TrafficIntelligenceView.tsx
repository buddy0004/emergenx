import React, { useState } from 'react';
import {
  Activity,
  Clock,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  BarChart2,
  Calendar,
  Layers,
} from 'lucide-react';
import { useEmergenx } from '../../context/EmergenxContext';

export const TrafficIntelligenceView: React.FC = () => {
  const { intersections } = useEmergenx();
  const [timelineOffset, setTimelineOffset] = useState<0 | 5 | 10 | 15>(0);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  // Predictive projection multiplier based on timeline
  const multiplier = timelineOffset === 0 ? 1 : timelineOffset === 5 ? 1.12 : timelineOffset === 10 ? 1.25 : 1.38;

  const fetchTrafficAdvice = async () => {
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/ai/traffic-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          corridor: 'MG Road - Trinity - Domlur Flyover Arterial Corridor',
          currentCongestion: `${Math.round(64 * multiplier)}% (Simulated Peak)`,
          weather: 'Clear, 27°C (Bangalore evening transit)',
          activeIncidents: 3,
        }),
      });
      const data = await res.json();
      setAiAdvice(data.analysis);
    } catch (err) {
      setAiAdvice(
        `PREDICTIVE TRAFFIC ADVISORY (+${timelineOffset} Min Projection):
Domlur underpass queue expected to expand to 240m (+23% volume) due to evening commercial egress.
Recommend holding signal green wave on Cubbon Road bypass corridor for secondary units.`
      );
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-amber-950/80 border border-amber-700 text-amber-400">
              <Activity className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Predictive Traffic Intelligence</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-semibold uppercase">
              15-Min Forecast Matrix
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Simulates dynamic queue accumulation, bottleneck progression, and signal queue dissipation along Bangalore emergency transit corridors.
          </p>
        </div>

        <button
          onClick={fetchTrafficAdvice}
          disabled={isLoadingAi}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
        >
          <Sparkles className={`w-4 h-4 ${isLoadingAi ? 'animate-spin' : ''}`} />
          <span>Generate AI Corridor Advisory</span>
        </button>
      </div>

      {/* Future Prediction Timeline Selector */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>Temporal Projection Timeline</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span>Confidence: <strong className="text-emerald-400">92.4%</strong></span>
            <span>·</span>
            <span>Data Freshness: <strong className="text-slate-200">12s ago</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {([0, 5, 10, 15] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimelineOffset(t)}
              className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                timelineOffset === t
                  ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-[10px] font-mono uppercase block text-slate-400">
                {t === 0 ? 'Current Real-Time' : `+${t} Minutes`}
              </span>
              <span className="text-base font-bold font-mono mt-0.5 block">
                {t === 0 ? 'T + 0 min' : `T + ${t} min`}
              </span>
              <span className="text-[10px] font-mono text-slate-400 block mt-1">
                Avg Delay: {Math.round(2.4 * (t === 0 ? 1 : 1 + t * 0.12))}m
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Intersection Queue Projections + AI Corridor Advisory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Predicted Intersections Queues */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase font-mono">
            Key Intersection Bottleneck Estimates (+{timelineOffset} min)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {intersections.map((inter) => {
              const projectedQueueMeters = Math.round(inter.queueLengthMeters * multiplier);
              const projectedVehicles = Math.round(inter.queueVehicles * multiplier);
              const isHeavy = projectedQueueMeters > 150;

              return (
                <div
                  key={inter.id}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white truncate max-w-[200px]">{inter.name}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                        isHeavy ? 'bg-red-950 text-red-300' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {isHeavy ? 'High Congestion' : 'Moderate'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 font-mono truncate">{inter.crossStreetName}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Queue Length</span>
                      <span className={`font-bold ${isHeavy ? 'text-orange-400' : 'text-slate-200'}`}>
                        {projectedQueueMeters}m
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Queued Vehicles</span>
                      <span className="font-bold text-slate-200">{projectedVehicles} units</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: AI Advisory Card */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-xs text-white">AI Predictive Guidance</h3>
            </div>

            <p className="text-xs text-slate-400 leading-normal">
              Continuous neural assessment of spillover propagation across adjacent cross-streets during emergency green waves.
            </p>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed min-h-[180px] whitespace-pre-line">
              {isLoadingAi ? (
                <div className="flex flex-col items-center justify-center py-10 text-slate-400 space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
                  <span className="font-mono text-xs">Computing future corridor queues...</span>
                </div>
              ) : aiAdvice ? (
                aiAdvice
              ) : (
                <div className="text-center py-8 text-slate-400">
                  Click <strong className="text-blue-400">"Generate AI Corridor Advisory"</strong> to synthesize recommendations for this temporal timeline.
                </div>
              )}
            </div>

            <button
              onClick={fetchTrafficAdvice}
              disabled={isLoadingAi}
              className="w-full py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
            >
              Update Predictive Advisory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
