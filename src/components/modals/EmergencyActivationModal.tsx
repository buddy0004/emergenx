import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, X } from 'lucide-react';
import { useEmergenx } from '../../context/EmergenxContext';
import { EmergencySeverity } from '../../types';

export const EmergencyActivationModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { vehicles, hospitals, activateEmergency, currentUser } = useEmergenx();

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    vehicles.find((v) => v.status === 'idle')?.id || vehicles[0]?.id || ''
  );
  const [incidentType, setIncidentType] = useState<string>('Acute Cardiac Arrest (STEMI)');
  const [description, setDescription] = useState<string>(
    'Patient in critical ventricular tachycardia; CPR in progress, immediate catheterization lab transit required.'
  );
  const [severity, setSeverity] = useState<EmergencySeverity>('critical');
  const [destinationHospitalId, setDestinationHospitalId] = useState<string>(hospitals[0]?.id || '');
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }

    const targetHosp = hospitals.find((h) => h.id === destinationHospitalId);
    const newReqId = activateEmergency({
      vehicleId: selectedVehicleId,
      incidentType,
      description,
      severity,
      destinationHospitalId,
      destinationAddress: targetHosp ? targetHosp.name : 'Designated Emergency Facility',
    });

    setSuccessId(newReqId);
    setIsConfirming(false);
  };

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-950/60 border border-red-800 text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">Activate Emergency Priority</h3>
              <p className="text-xs text-slate-400">Authorized Urban Mobility Corridor Dispatch</p>
            </div>
          </div>
          <button
            onClick={() => {
              setSuccessId(null);
              setIsConfirming(false);
              onClose();
            }}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success confirmation view */}
        {successId ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-600 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-slate-100">Emergency Transit Dispatched</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              Request ID: <span className="text-emerald-400 font-bold">{successId}</span>
              <br />
              Corridor signal priority wave initiated across 5 Bangalore intersections.
              Hospital trauma bay notified.
            </p>
            <button
              onClick={() => {
                setSuccessId(null);
                onClose();
              }}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer w-full"
            >
              Return to Live Map
            </button>
          </div>
        ) : (
          <form onSubmit={handleActivate} className="p-6 space-y-4">
            {/* Safety Confirmation Banner */}
            {isConfirming && (
              <div className="p-3.5 rounded-lg bg-red-950/80 border border-red-700 text-red-200 text-xs space-y-1.5 animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2 font-bold text-red-400">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>AUTHORIZATION CONFIRMATION REQUIRED</span>
                </div>
                <p className="text-[11px] text-red-300">
                  You are activating an authorized emergency green corridor for{' '}
                  <strong>{selectedVehicle?.callSign}</strong>. Traffic signals will dynamically adapt to clear cross-traffic.
                </p>
              </div>
            )}

            {/* Vehicle Selection */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Select Responding Emergency Unit
              </label>
              <select
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.callSign} ({v.category.replace('_', ' ').toUpperCase()}) - Status: {v.status}
                  </option>
                ))}
              </select>
            </div>

            {/* Severity Rating */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Emergency Severity</label>
              <div className="grid grid-cols-4 gap-2">
                {(['critical', 'high', 'medium', 'low'] as EmergencySeverity[]).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg capitalize border transition-colors cursor-pointer ${
                      severity === sev
                        ? sev === 'critical'
                          ? 'bg-red-600/30 text-red-300 border-red-500'
                          : sev === 'high'
                          ? 'bg-orange-600/30 text-orange-300 border-orange-500'
                          : sev === 'medium'
                          ? 'bg-yellow-600/30 text-yellow-300 border-yellow-500'
                          : 'bg-blue-600/30 text-blue-300 border-blue-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Incident Type & Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Incident Category</label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                >
                  <option value="Acute Cardiac Arrest (STEMI)">Cardiac Emergency (STEMI)</option>
                  <option value="Severe Road Collision Trauma">Highway Collision Trauma</option>
                  <option value="Commercial Structural Fire">3-Alarm Structural Fire</option>
                  <option value="Urgent Rare Cryo-Blood Transit">Urgent Blood / Organ Transit</option>
                  <option value="Hazardous Chemical Containment">Hazmat Containment</option>
                  <option value="Armed Pursuit Intervention">Police Priority Escort</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Destination Facility</label>
                <select
                  value={destinationHospitalId}
                  onChange={(e) => setDestinationHospitalId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                >
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name.split(',')[0]} (Trauma Bays: {h.availableTraumaBeds})
                    </option>
                  ))}
                  <option value="fire_brigade_scene">Brigade Road Fire Incident Ground</option>
                </select>
              </div>
            </div>

            {/* Incident Description */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Incident Brief & Medical Notes</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Operator Signature Preview */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span>Authorized Dispatcher: {currentUser.name}</span>
              <span className="text-blue-400">{currentUser.badgeNumber}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsConfirming(false);
                  onClose();
                }}
                className="flex-1 py-2 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer ${
                  isConfirming
                    ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isConfirming ? 'Confirm & Deploy Priority' : 'Review & Dispatch'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
