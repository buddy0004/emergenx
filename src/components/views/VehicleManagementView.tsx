import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  Wifi,
  Radio,
  ShieldCheck,
  Edit3,
  Power,
  X,
} from 'lucide-react';
import { useEmergenx } from '../../context/EmergenxContext';
import { EmergencyVehicle, VehicleCategory } from '../../types';

export const VehicleManagementView: React.FC = () => {
  const { vehicles, registerVehicle, updateVehicle } = useEmergenx();
  const [categoryFilter, setCategoryFilter] = useState<VehicleCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // New vehicle form state
  const [newReg, setNewReg] = useState('KA-01-EA-1006');
  const [newCallSign, setNewCallSign] = useState('MEDIC-106 (Apollo Rapid)');
  const [newCategory, setNewCategory] = useState<VehicleCategory>('ambulance');
  const [newService, setNewService] = useState('Apollo Hospitals Emergency Fleet');
  const [newDriver, setNewDriver] = useState('Harish Gowda');
  const [newPhone, setNewPhone] = useState('+91 98450 77112');

  const filteredVehicles = vehicles.filter((v) => {
    if (categoryFilter !== 'all' && v.category !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        v.callSign.toLowerCase().includes(q) ||
        v.registrationNumber.toLowerCase().includes(q) ||
        v.assignedService.toLowerCase().includes(q) ||
        v.driverName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerVehicle({
      registrationNumber: newReg,
      callSign: newCallSign,
      category: newCategory,
      assignedService: newService,
      driverName: newDriver,
      driverPhone: newPhone,
      currentLocation: { lat: 12.9716, lng: 77.5946 },
      locationName: 'Central Bangalore Hub Base',
      status: 'idle',
      gpsStatus: 'live',
      connectivity: 'normal',
      verificationStatus: 'verified',
      currentSpeedKmh: 0,
      batteryOrFuelPercent: 100,
    });
    setIsRegisterOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-blue-950/80 border border-blue-700 text-blue-400">
              <Truck className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Emergency Vehicle Fleet Management</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-semibold uppercase">
              {vehicles.length} Registered Units
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Registered vehicle inventory, transponder telemetry verification, driver assignments, and availability state.
          </p>
        </div>

        <button
          onClick={() => setIsRegisterOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register Vehicle</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search registration, driver, service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {(
            [
              { id: 'all', label: 'All Categories' },
              { id: 'ambulance', label: 'Ambulances' },
              { id: 'fire_engine', label: 'Fire Tenders' },
              { id: 'police', label: 'Police Patrols' },
              { id: 'disaster_rescue', label: 'Disaster Rescue' },
              { id: 'blood_transport', label: 'Blood Cryo' },
              { id: 'other', label: 'Other Authorized' },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              onClick={() => setCategoryFilter(f.id as VehicleCategory | 'all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
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

      {/* Vehicles Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] uppercase font-mono text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Vehicle Call Sign</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Assigned Service</th>
                <th className="px-4 py-3">Driver / Contact</th>
                <th className="px-4 py-3">Current Location</th>
                <th className="px-4 py-3">Speed</th>
                <th className="px-4 py-3">GPS / Telemetry</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredVehicles.map((v) => (
                <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-100 whitespace-nowrap">
                    <div>{v.callSign}</div>
                    <span className="text-[10px] text-slate-400 font-mono">{v.registrationNumber}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-[10px] font-mono uppercase bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                      {v.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-w-[180px] truncate">{v.assignedService}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div>{v.driverName}</div>
                    <span className="text-[10px] text-slate-400 font-mono">{v.driverPhone}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 max-w-[160px] truncate">{v.locationName}</td>
                  <td className="px-4 py-3 font-mono tabular-nums">{v.currentSpeedKmh} km/h</td>
                  <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px]">
                    <span
                      className={`inline-flex items-center gap-1 ${
                        v.gpsStatus === 'live' ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      <Radio className="w-3 h-3" />
                      {v.gpsStatus.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        v.status === 'en_route'
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() =>
                        updateVehicle(v.id, {
                          status: v.status === 'idle' ? 'en_route' : 'idle',
                          currentSpeedKmh: v.status === 'idle' ? 45 : 0,
                        })
                      }
                      title="Toggle Active Status"
                      className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                    >
                      {v.status === 'idle' ? 'Deploy' : 'Set Idle'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Vehicle Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-sm text-slate-100">Register New Emergency Vehicle</h3>
              <button
                onClick={() => setIsRegisterOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Registration Number</label>
                <input
                  type="text"
                  required
                  value={newReg}
                  onChange={(e) => setNewReg(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Call Sign</label>
                <input
                  type="text"
                  required
                  value={newCallSign}
                  onChange={(e) => setNewCallSign(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as VehicleCategory)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs outline-none"
                  >
                    <option value="ambulance">Ambulance</option>
                    <option value="fire_engine">Fire Engine</option>
                    <option value="police">Police Vehicle</option>
                    <option value="disaster_rescue">Disaster Rescue</option>
                    <option value="blood_transport">Emergency Blood</option>
                    <option value="other">Other Authorized</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Assigned Service</label>
                  <input
                    type="text"
                    required
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Driver Name</label>
                  <input
                    type="text"
                    required
                    value={newDriver}
                    onChange={(e) => setNewDriver(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Driver Phone</label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs font-mono outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Save Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
