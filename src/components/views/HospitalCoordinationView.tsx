import React, { useState } from 'react';
import {
  Hospital,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Bed,
  Phone,
  Shield,
  Flame,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { useEmergenx } from '../../context/EmergenxContext';

export const HospitalCoordinationView: React.FC = () => {
  const { hospitals, acknowledgeHospitalTriage, currentUser } = useEmergenx();
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(hospitals[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'hospitals' | 'fire_police'>('hospitals');

  const selectedHospital = hospitals.find((h) => h.id === selectedHospitalId) || hospitals[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-teal-950/80 border border-teal-700 text-teal-400">
              <Hospital className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Emergency Facility & Resource Coordination</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 font-semibold uppercase">
              Triage Integration Hub
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Direct telemetry link alerting receiving Emergency Departments of inbound patient hemodynamics and ETA for trauma bay preparation.
          </p>
        </div>

        {/* Tab switch between Hospitals vs Fire/Police Response Center */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-lg">
          <button
            onClick={() => setActiveTab('hospitals')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'hospitals' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hospital ER Triage
          </button>
          <button
            onClick={() => setActiveTab('fire_police')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'fire_police' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Fire & Police Dispatch
          </button>
        </div>
      </div>

      {activeTab === 'hospitals' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 1 Col: Hospital Selector & Bed Capacity */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase font-mono">Receiving Facilities</span>

            {hospitals.map((hosp) => {
              const isSelected = hosp.id === selectedHospitalId;
              return (
                <button
                  key={hosp.id}
                  onClick={() => setSelectedHospitalId(hosp.id)}
                  className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500/50'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-100">{hosp.name.split(',')[0]}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        hosp.status === 'Normal' ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'
                      }`}
                    >
                      {hosp.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-1">{hosp.address}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Trauma Bays</span>
                      <span className="font-bold text-emerald-400">{hosp.availableTraumaBeds} Free</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">ICU Beds</span>
                      <span className="font-bold text-blue-400">{hosp.availableIcuBeds} Free</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
                    <span>Inbound Units: {hosp.incomingAmbulances.length}</span>
                    <span className="text-teal-400">{hosp.contactPhone}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right 2 Cols: Inbound Ambulances & Triage Acknowledgement */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-white">{selectedHospital.name}</h3>
                  <p className="text-xs text-slate-400">Emergency Department Triage & Reception Desk</p>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  Total Capacity: <strong className="text-slate-200">{selectedHospital.totalBeds} Beds</strong>
                </span>
              </div>

              {selectedHospital.incomingAmbulances.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No active ambulances currently routed to this trauma facility.
                </div>
              ) : (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-300 block">
                    Inbound Ambulances ({selectedHospital.incomingAmbulances.length})
                  </span>

                  {selectedHospital.incomingAmbulances.map((amb) => (
                    <div
                      key={amb.requestId}
                      className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              amb.triageCategory === 'Red' ? 'bg-red-500 animate-ping' : 'bg-yellow-500'
                            }`}
                          />
                          <span className="font-bold text-xs text-slate-100">{amb.vehicleCallSign}</span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.2 rounded font-bold uppercase ${
                              amb.triageCategory === 'Red'
                                ? 'bg-red-950 text-red-300 border border-red-800'
                                : 'bg-yellow-950 text-yellow-300 border border-yellow-800'
                            }`}
                          >
                            Triage {amb.triageCategory}
                          </span>
                        </div>

                        <div className="text-xs font-mono text-emerald-400 font-bold">
                          ETA: {amb.etaMinutes} mins
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-900/60 p-2.5 rounded border border-slate-800">
                        {amb.patientCondition}
                      </p>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
                        <div className="text-[11px] text-slate-400 font-mono">
                          {amb.acknowledged ? (
                            <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Acknowledged: {amb.acknowledgedBy}
                            </span>
                          ) : (
                            <span className="text-amber-400 flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Pending Trauma Team Mobilization
                            </span>
                          )}
                        </div>

                        {!amb.acknowledged && (
                          <button
                            onClick={() => acknowledgeHospitalTriage(selectedHospital.id, amb.requestId)}
                            className="px-4 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors cursor-pointer"
                          >
                            Acknowledge & Reserve Trauma Bay
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Fire & Police Response Centre Panel */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
              <Flame className="w-5 h-5" />
              <span>Fire & Disaster Incident Dispatch Station</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Karnataka State Fire & Emergency Services Command. 3 active tenders assigned to structural fire scenario on Brigade Road. Water supply line coordinated with Bangalore Water Supply Board (BWSSB).
            </p>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
              <div>Incident: Commercial Complex Fire (Mayo Hall Area)</div>
              <div>Assigned Units: BRONTO-01, FOAM-02</div>
              <div>Water Hydrant Access: Brigade Rd Cross 4 (Operational)</div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <Shield className="w-5 h-5" />
              <span>Police Traffic Corridor Command Desk</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bangalore Traffic Police Ashok Nagar & Cubbon Park precinct interceptors. Static junctions pre-warned via wireless pilot channels for pedestrian containment.
            </p>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
              <div>Lead Escort: TRAFFIC-HAWK-1 (KA-01-PL-3001)</div>
              <div>Perimeter Clearing: Ashok Nagar Junction Point 2</div>
              <div>Corridor Protocol: Section 42-A Statutory Precedence</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
