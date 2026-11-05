import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  UserCheck,
  AlertOctagon,
  FileText,
  Key,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import { useEmergenx } from '../../context/EmergenxContext';

export const SecurityVerificationView: React.FC = () => {
  const { auditLogs, vehicles, currentUser } = useEmergenx();
  const [flaggedInspectionOpen, setFlaggedInspectionOpen] = useState(false);

  // Simulated suspicious request
  const suspiciousRequest = {
    id: 'req_unauth_809',
    vehicleId: 'veh_unknown_priv',
    callSign: 'UNVERIFIED-VAN-88',
    regNumber: 'KA-51-Z-9999',
    timestamp: '10:02 AM',
    claimedType: 'VIP Corridor Request',
    flagReason: 'Missing verified cryptographic transponder key; unauthorized siren beacon pattern.',
    status: 'BLOCKED_PENDING_REVIEW',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-blue-950/80 border border-blue-700 text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Emergency Verification & Security Governance</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold uppercase">
              Zero-Trust Corridor Defense
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Enforces strict transponder cryptographic attestation, operator identity verification, and prevents spoofed or unverified vehicles from commanding urban signal preemption.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
          <span>Active Supervisor: </span>
          <strong className="text-slate-200">{currentUser.name}</strong>
        </div>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Verified Transponders</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">16 / 16</div>
          <p className="text-[11px] text-slate-400">
            All fleet transponders verified with Department Public Key Infrastructure (PKI).
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Suspicious Requests</span>
            <AlertOctagon className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-red-400">1 Flagged</div>
          <p className="text-[11px] text-slate-400">
            Signal preemption automatically inhibited pending manual supervisor audit.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Role-Based Access Control</span>
            <Lock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-400">Strict RBAC</div>
          <p className="text-[11px] text-slate-400">
            Signal priority commands restricted strictly to Traffic Police Control credentials.
          </p>
        </div>
      </div>

      {/* Flagged Suspicious Vehicle Banner */}
      <div className="p-4 rounded-xl bg-red-950/70 border border-red-800 text-red-200 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xs text-red-400">
            <AlertOctagon className="w-4 h-4" />
            <span>UNVERIFIED PRIORITY REQUEST INHIBITED</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-900/80 text-red-200 font-bold">
            {suspiciousRequest.status}
          </span>
        </div>

        <p className="text-xs text-red-300 leading-relaxed font-mono">
          Incident: {suspiciousRequest.id} · Vehicle: {suspiciousRequest.callSign} ({suspiciousRequest.regNumber})
          <br />
          Reason: {suspiciousRequest.flagReason}
        </p>

        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={() => setFlaggedInspectionOpen(!flaggedInspectionOpen)}
            className="px-3 py-1 text-xs font-semibold rounded bg-red-900 hover:bg-red-800 text-white transition-colors cursor-pointer"
          >
            {flaggedInspectionOpen ? 'Collapse Audit Details' : 'Inspect Security Evidence'}
          </button>
          <button
            onClick={() => alert('Vehicle permanently blocked from municipal priority grid.')}
            className="px-3 py-1 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-red-300 transition-colors cursor-pointer"
          >
            Confirm Permanent Block
          </button>
        </div>

        {flaggedInspectionOpen && (
          <div className="p-3 bg-slate-950 rounded-lg border border-red-900/60 text-xs font-mono text-slate-300 space-y-1.5 mt-2">
            <div>Cryptographic Certificate: NONE (Revoked or self-signed signature)</div>
            <div>Cellular Geo-fence: Triggered outside designated emergency corridors</div>
            <div>Action Taken: Preemption blocked; local precinct patrol notified for physical intercept.</div>
          </div>
        )}
      </div>

      {/* Security Audit Trail Log Table */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs text-white uppercase font-mono">
            Immutable Security Audit Trail
          </h3>
          <span className="text-[11px] font-mono text-slate-400">HMAC-SHA256 Signed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[10px] uppercase font-mono text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Operator / Badge</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Action Signature</th>
                <th className="px-4 py-3">Audit Details</th>
                <th className="px-4 py-3">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40">
                  <td className="px-4 py-3 text-slate-400">{log.timestamp}</td>
                  <td className="px-4 py-3 font-bold text-slate-200">{log.userName}</td>
                  <td className="px-4 py-3">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] uppercase">
                      {log.userRole.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-blue-400 font-bold">{log.action}</td>
                  <td className="px-4 py-3 text-slate-300 font-sans max-w-xs">{log.details}</td>
                  <td className="px-4 py-3 text-slate-400">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
