import React from 'react';
import { Route, CheckCircle, AlertTriangle, ShieldCheck, ArrowRight, Zap, Navigation } from 'lucide-react';
import { useEmergenx } from '../../context/EmergenxContext';
import { GoogleCityMap } from '../map/GoogleCityMap';

export const RouteOptimizationView: React.FC = () => {
  const { routes, activeRouteId, selectRoute } = useEmergenx();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-blue-950/80 border border-blue-700 text-blue-400">
              <Route className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">AI Smart Route Optimization</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold uppercase">
              Reliability-First Multi-Routing
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Evaluates alternative road vectors balancing distance, expected intersection queue delay, and signal priority synchronization. Clearly designated as simulation values.
          </p>
        </div>
      </div>

      {/* 3 Route Alternative Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {routes.map((rt) => {
          const isSelected = rt.id === activeRouteId;
          return (
            <div
              key={rt.id}
              onClick={() => selectRoute(rt.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500/50'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-slate-400 uppercase font-semibold">
                    {rt.id.replace('_', ' ').toUpperCase()}
                  </span>
                  {rt.recommended && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold uppercase">
                      Recommended
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-slate-100">{rt.name}</h3>
                <p className="text-xs text-slate-400 leading-normal">{rt.via}</p>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Est Time</span>
                    <span className="font-bold text-slate-100 text-sm">{rt.estimatedMinutes}m</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Distance</span>
                    <span className="font-bold text-slate-100 text-sm">{rt.distanceKm}km</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Reliability</span>
                    <span
                      className={`font-bold text-sm ${
                        rt.reliabilityScorePercent >= 90
                          ? 'text-emerald-400'
                          : rt.reliabilityScorePercent >= 75
                          ? 'text-yellow-400'
                          : 'text-orange-400'
                      }`}
                    >
                      {rt.reliabilityScorePercent}%
                    </span>
                  </div>
                </div>

                {/* Obstruction Warnings if any */}
                {rt.obstructionWarnings.length > 0 ? (
                  <div className="p-2 rounded bg-amber-950/40 border border-amber-800/60 text-[11px] text-amber-300 space-y-1">
                    <span className="font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Obstruction Risk:
                    </span>
                    {rt.obstructionWarnings.map((w, idx) => (
                      <div key={idx} className="text-[10px] text-amber-200/80">
                        • {w}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-2 rounded bg-emerald-950/30 border border-emerald-800/40 text-[11px] text-emerald-300 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Clean Corridor: Zero reported obstructions</span>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">
                  {rt.intersectionsCount} Controlled Intersections
                </span>
                <span
                  className={`text-xs font-semibold ${
                    isSelected ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {isSelected ? '✓ Selected Route' : 'Select This Route →'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Map Viewport showing active corridor */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200">
            Active Selected Green Wave Path: {routes.find((r) => r.id === activeRouteId)?.name}
          </span>
          <span className="text-[11px] font-mono text-emerald-400">
            Simulated Travel Time: {routes.find((r) => r.id === activeRouteId)?.estimatedMinutes} mins
          </span>
        </div>

        <div className="h-[420px] rounded-lg overflow-hidden border border-slate-800">
          <GoogleCityMap />
        </div>
      </div>
    </div>
  );
};
