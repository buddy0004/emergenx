import React, { useState } from 'react';
import {
  FlaskConical,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Flame,
  Truck,
  Shield,
  WifiOff,
  AlertTriangle,
  GitFork,
  Radio,
} from 'lucide-react';
import { useEmergenx } from '../../context/EmergenxContext';
import { GoogleCityMap } from '../map/GoogleCityMap';

export const SimulationLabView: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
  const {
    isSimulating,
    toggleSimulation,
    simulationSpeed,
    setSimulationSpeed,
    activeScenarioPreset,
    loadScenarioPreset,
    resetSimulation,
    vehicles,
    intersections,
  } = useEmergenx();

  // Lab configuration sliders
  const [ambulanceCount, setAmbulanceCount] = useState<number>(5);
  const [fireCount, setFireCount] = useState<number>(3);
  const [policeCount, setPoliceCount] = useState<number>(4);
  const [trafficDensity, setTrafficDensity] = useState<'Light' | 'Moderate' | 'Heavy' | 'Gridlock'>('Heavy');
  const [roadClosureActive, setRoadClosureActive] = useState<boolean>(true);

  const presets = [
    {
      key: 'preset_a_single',
      title: 'Scenario A: Single Ambulance Isolation',
      desc: 'Solitary ALS cardiac ambulance on empty arterial corridor with automated signal green wave.',
      icon: Truck,
      color: 'border-blue-500/60',
    },
    {
      key: 'preset_b_fire',
      title: 'Scenario B: Multi-Alarm Fire Response',
      desc: '3 heavy fire tenders and hydraulic platform converging on Brigade Road commercial high-rise.',
      icon: Flame,
      color: 'border-orange-500/60',
    },
    {
      key: 'preset_c_multiple',
      title: 'Scenario C: Triple-Emergency Intersection Conflict',
      desc: 'Ambulance + Fire Engine + Police Interceptor simultaneous arrival at MG Road & Brigade Road (INT-01).',
      icon: GitFork,
      color: 'border-red-500/60',
    },
    {
      key: 'preset_d_obstruction',
      title: 'Scenario D: Active Road Obstruction & Rerouting',
      desc: 'Water pipe rupture on Domlur flyover forces dynamic real-time diversion to Wind Tunnel bypass.',
      icon: AlertTriangle,
      color: 'border-amber-500/60',
    },
    {
      key: 'preset_e_network',
      title: 'Scenario E: Telemetry Interruption & GPS Blackout',
      desc: 'Cellular uplink failure triggers stale coordinate retention safeguard and local packet caching.',
      icon: WifiOff,
      color: 'border-purple-500/60',
    },
    {
      key: 'preset_f_deadlock',
      title: 'Scenario F: Quad Corridor Overlapping Deadlock',
      desc: '4 vehicles traversing cross-street corridors simultaneously under heavy civilian peak traffic.',
      icon: Sliders,
      color: 'border-teal-500/60',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-purple-950/80 border border-purple-700 text-purple-400">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Simulation Lab & Scenario Sandbox</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-semibold uppercase">
              Demonstration Testbed
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Configure stress parameters, induce infrastructure bottlenecks, trigger network drops, and evaluate multi-emergency deconfliction algorithms in real-time.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleSimulation()}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              isSimulating
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isSimulating ? 'Pause Simulation' : 'Resume Simulation'}</span>
          </button>

          <button
            onClick={resetSimulation}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={() => setSimulationSpeed(simulationSpeed === 1 ? 2 : simulationSpeed === 2 ? 5 : 1)}
            className="px-3 py-2 text-xs font-mono font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 transition-colors cursor-pointer"
          >
            {simulationSpeed}x Speed
          </button>
        </div>
      </div>

      {/* Preset Scenarios Strip */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-200 uppercase font-mono">Preset Scenarios (Click to Load)</span>
          <span className="text-slate-400 font-mono text-[11px]">
            Active Preset: <strong className="text-blue-400 uppercase">{activeScenarioPreset.replace('preset_', '').replace('_', ' ')}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {presets.map((sc) => {
            const Icon = sc.icon;
            const isLoaded = activeScenarioPreset === sc.key;
            return (
              <button
                key={sc.key}
                onClick={() => loadScenarioPreset(sc.key)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isLoaded
                    ? 'bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500/50'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-100 flex items-center gap-2">
                      <Icon className="w-4 h-4 text-blue-400" />
                      {sc.title}
                    </span>
                    {isLoaded && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold uppercase">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">{sc.desc}</p>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-800/80 text-[10px] text-blue-400 font-mono font-semibold flex items-center justify-end">
                  {isLoaded ? 'Loaded in Simulation ✓' : 'Load Scenario →'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sandbox Sliders & Live Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Dynamic Simulation Parameter Sliders */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-purple-400" />
            <h3 className="font-bold text-xs text-white uppercase font-mono">Sandbox Tuning Controls</h3>
          </div>

          <div className="space-y-4 text-xs font-mono">
            {/* Traffic Density */}
            <div>
              <div className="flex justify-between mb-1 text-slate-300">
                <span>Civilian Traffic Density</span>
                <span className="text-amber-400 font-bold">{trafficDensity}</span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {(['Light', 'Moderate', 'Heavy', 'Gridlock'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setTrafficDensity(d)}
                    className={`py-1 text-[10px] rounded transition-colors ${
                      trafficDensity === d
                        ? 'bg-amber-600 text-white font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Ambulance Count */}
            <div>
              <div className="flex justify-between mb-1 text-slate-300">
                <span>Active Ambulances</span>
                <span className="text-blue-400 font-bold">{ambulanceCount} Units</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={ambulanceCount}
                onChange={(e) => setAmbulanceCount(parseInt(e.target.value, 10))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Fire Tenders */}
            <div>
              <div className="flex justify-between mb-1 text-slate-300">
                <span>Active Fire Tenders</span>
                <span className="text-orange-400 font-bold">{fireCount} Units</span>
              </div>
              <input
                type="range"
                min={1}
                max={3}
                value={fireCount}
                onChange={(e) => setFireCount(parseInt(e.target.value, 10))}
                className="w-full accent-orange-500 cursor-pointer"
              />
            </div>

            {/* Police Escorts */}
            <div>
              <div className="flex justify-between mb-1 text-slate-300">
                <span>Police Interceptors</span>
                <span className="text-blue-400 font-bold">{policeCount} Units</span>
              </div>
              <input
                type="range"
                min={1}
                max={4}
                value={policeCount}
                onChange={(e) => setPoliceCount(parseInt(e.target.value, 10))}
                className="w-full accent-blue-400 cursor-pointer"
              />
            </div>

            {/* Road Closure Toggle */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Simulate Road Obstruction</span>
              <button
                onClick={() => setRoadClosureActive(!roadClosureActive)}
                className={`px-3 py-1 text-[11px] rounded font-bold cursor-pointer transition-colors ${
                  roadClosureActive
                    ? 'bg-red-950 text-red-300 border border-red-800'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {roadClosureActive ? 'Domlur Blocked' : 'Clear'}
              </button>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Live Simulation Map Viewport */}
        <div className="lg:col-span-2 h-[480px] rounded-xl overflow-hidden border border-slate-800 shadow-md">
          <GoogleCityMap />
        </div>
      </div>
    </div>
  );
};
