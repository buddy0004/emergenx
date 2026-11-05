import React, { useState } from 'react';
import {
  Layers,
  Search,
  Filter,
  Navigation,
  Compass,
  AlertCircle,
  Truck,
  Flame,
  Shield,
  Activity,
} from 'lucide-react';
import { useEmergenx } from '../../context/EmergenxContext';
import { GoogleCityMap } from '../map/GoogleCityMap';
import { VehicleCategory } from '../../types';

export const LiveEmergencyMapView: React.FC<{ onOpenActivation: () => void }> = ({ onOpenActivation }) => {
  const {
    vehicles,
    selectedVehicleId,
    setSelectedVehicleId,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    networkStatus,
    gpsStaleSeconds,
  } = useEmergenx();

  const [showCongestion, setShowCongestion] = useState(true);
  const [showIntersections, setShowIntersections] = useState(true);
  const [showHospitals, setShowHospitals] = useState(true);

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

  return (
    <div className="space-y-4">
      {/* Top Controls Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search call sign, registration..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {(
              [
                { id: 'all', label: 'All Fleet' },
                { id: 'ambulance', label: 'Ambulance' },
                { id: 'fire_engine', label: 'Fire Tender' },
                { id: 'police', label: 'Police Patrol' },
                { id: 'blood_transport', label: 'Blood Cryo' },
                { id: 'disaster_rescue', label: 'Disaster Rescue' },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id as VehicleCategory | 'all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  categoryFilter === cat.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Map Layer Toggles */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 cursor-pointer hover:bg-slate-700/60 transition-colors">
            <input
              type="checkbox"
              checked={showCongestion}
              onChange={(e) => setShowCongestion(e.target.checked)}
              className="rounded bg-slate-900 border-slate-600"
            />
            <span>Congestion</span>
          </label>
          <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 cursor-pointer hover:bg-slate-700/60 transition-colors">
            <input
              type="checkbox"
              checked={showIntersections}
              onChange={(e) => setShowIntersections(e.target.checked)}
              className="rounded bg-slate-900 border-slate-600"
            />
            <span>Signals</span>
          </label>
          <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 cursor-pointer hover:bg-slate-700/60 transition-colors">
            <input
              type="checkbox"
              checked={showHospitals}
              onChange={(e) => setShowHospitals(e.target.checked)}
              className="rounded bg-slate-900 border-slate-600"
            />
            <span>Hospitals</span>
          </label>
        </div>
      </div>

      {/* Map + Unit Inspector Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Map Viewport (3 cols) */}
        <div className="lg:col-span-3 h-[580px] rounded-xl overflow-hidden border border-slate-800 relative shadow-lg">
          <GoogleCityMap
            showCongestionOverlay={showCongestion}
            showIntersections={showIntersections}
            showHospitals={showHospitals}
            focusVehicleId={selectedVehicleId}
          />
        </div>

        {/* Tactical Fleet Tracker Panel (1 col) */}
        <div className="space-y-4 max-h-[580px] flex flex-col">
          {/* Focused Unit Card */}
          {selectedVehicle ? (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-semibold uppercase">
                  Focused Unit
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    selectedVehicle.status === 'en_route'
                      ? 'bg-red-950 text-red-300 border border-red-800 animate-pulse'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {selectedVehicle.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-white">{selectedVehicle.callSign}</h3>
                <p className="text-xs text-slate-400 font-mono">
                  {selectedVehicle.registrationNumber} · {selectedVehicle.assignedService}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px]">Speed</span>
                  <span className="font-bold text-slate-200">{selectedVehicle.currentSpeedKmh} km/h</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Telemetry</span>
                  <span className="font-bold text-emerald-400">{selectedVehicle.gpsStatus.toUpperCase()}</span>
                </div>
              </div>

              <div className="text-xs space-y-1 text-slate-300">
                <div>
                  <span className="text-slate-500">Driver:</span> {selectedVehicle.driverName}
                </div>
                <div>
                  <span className="text-slate-500">Base / Current:</span> {selectedVehicle.locationName}
                </div>
                {selectedVehicle.destinationName && (
                  <div>
                    <span className="text-slate-500">Destination:</span>{' '}
                    <strong className="text-emerald-400">{selectedVehicle.destinationName}</strong>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
              Select any vehicle marker on the map to inspect telemetry and corridor details.
            </div>
          )}

          {/* Quick Fleet Quick-Select List */}
          <div className="flex-1 overflow-y-auto p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-300 block mb-1">Fleet Quick-Select ({vehicles.length})</span>
            {vehicles.map((v) => {
              const isSelected = v.id === selectedVehicleId;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVehicleId(v.id)}
                  className={`w-full p-2.5 rounded-lg border text-left transition-colors cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="truncate">
                    <span className="font-bold text-xs text-slate-200 block truncate">{v.callSign}</span>
                    <span className="text-[10px] text-slate-400 font-mono truncate">{v.locationName}</span>
                  </div>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold shrink-0 ml-2 ${
                      v.status === 'en_route' ? 'bg-red-950 text-red-300' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {v.status}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
