import React, { useState } from 'react';
import {
  GitFork,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  ArrowRight,
  ShieldCheck,
  Check,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useEmergenx } from '../../context/EmergenxContext';
import { GoogleCityMap } from '../map/GoogleCityMap';

export const ConflictResolverView: React.FC = () => {
  const { conflictScenario, resolveConflict, currentUser, intersections } = useEmergenx();
  const [currentStep, setCurrentStep] = useState<number>(4);
  const [isRunningSim, setIsRunningSim] = useState<boolean>(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const steps = [
    { num: 1, title: 'Route Overlap Detection', desc: 'Identified converging GPS trajectories toward MG Road & Brigade Rd (INT-01).' },
    { num: 2, title: 'Conflicting ETA Calculation', desc: '3 authorized units arriving within a tight 35-second collision/blockage window.' },
    { num: 3, title: 'Priority Policy Evaluation', desc: 'Applied Section 42-A Motor Vehicles Act (Life Threat > Structural Blaze > Escort).' },
    { num: 4, title: 'Road Congestion Check', desc: 'Civilian queue on cross-street assessed at 145m (28 queued vehicles).' },
    { num: 5, title: 'Intersection Phase Schedule', desc: 'Phase 1: Amb-01 (Green 30s) -> Phase 2: Fire-21 (Green 45s) -> Phase 3: Civilian Recovery.' },
    { num: 6, title: 'Traffic Controller Sign-off', desc: 'Authorized supervisory action required to execute signal override schedule.' },
  ];

  const runStepByStepSim = () => {
    setIsRunningSim(true);
    setCurrentStep(1);
    setActionFeedback(null);

    let step = 1;
    const interval = setInterval(() => {
      step++;
      setCurrentStep(step);
      if (step >= 6) {
        clearInterval(interval);
        setIsRunningSim(false);
      }
    }, 700);
  };

  const handleApprove = () => {
    resolveConflict('controller_approved');
    setActionFeedback('Resolution APPROVED: Signal phase schedule deployed to INT-01.');
  };

  const handleReject = () => {
    resolveConflict('rejected');
    setActionFeedback('Resolution REJECTED: Manual junction control engaged.');
  };

  const targetIntersection = intersections.find((i) => i.id === conflictScenario.intersectionId);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-orange-950/80 border border-orange-700 text-orange-400">
              <GitFork className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Multiple Emergency Conflict Resolver</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-950 text-orange-400 border border-orange-800 font-semibold uppercase">
              Convergence Scenario Alpha
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Deconflicts simultaneous emergency vehicle approaches at complex urban junctions through dynamic time-slot scheduling and statutory policy arbitration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={runStepByStepSim}
            disabled={isRunningSim}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Play className={`w-4 h-4 ${isRunningSim ? 'animate-spin' : ''}`} />
            <span>{isRunningSim ? 'Evaluating Steps...' : 'Run Conflict Simulation'}</span>
          </button>
        </div>
      </div>

      {/* Action feedback */}
      {actionFeedback && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs font-mono flex items-center justify-between">
          <span>{actionFeedback}</span>
          <span className="text-[10px] text-emerald-400">Logged to Security Audit Trail</span>
        </div>
      )}

      {/* 6-Step Decision Pipeline Visualizer */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-200 uppercase font-mono">
            Automated Deconfliction Pipeline (Step {currentStep} of 6)
          </span>
          <span className="text-slate-400 font-mono text-[11px]">
            {currentStep === 6 ? 'Awaiting Controller Authorization' : 'Processing Simulation Grid...'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {steps.map((st) => {
            const isCompleted = st.num < currentStep;
            const isCurrent = st.num === currentStep;

            return (
              <div
                key={st.num}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  isCurrent
                    ? 'bg-blue-950/60 border-blue-500 shadow-sm'
                    : isCompleted
                    ? 'bg-slate-950 border-slate-800 text-slate-400'
                    : 'bg-slate-950/40 border-slate-900 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono ${
                      isCurrent
                        ? 'bg-blue-500 text-white'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isCompleted ? '✓' : st.num}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">0{st.num}</span>
                </div>
                <h4 className="text-[11px] font-bold text-slate-200 line-clamp-1">{st.title}</h4>
                <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{st.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Left Map + Right Conflict Execution Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Visual Map of Intersection Conflict */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-100">
                Junction Convergence: {conflictScenario.intersectionName}
              </span>
              <span className="text-xs text-slate-400 block">
                Signal Status: <strong className="text-emerald-400">{targetIntersection?.currentSignal}</strong> · Queue: {targetIntersection?.queueLengthMeters}m
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 font-semibold uppercase">
              {conflictScenario.conflictType.replace('_', ' ')}
            </span>
          </div>

          <div className="h-[440px] w-full rounded-xl overflow-hidden border border-slate-800 shadow-md">
            <GoogleCityMap conflictMode={true} />
          </div>
        </div>

        {/* Right 1 Col: Generated Priority Schedule & Controller Controls */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-xs text-white">Staggered Clearance Schedule</h3>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                  conflictScenario.resolutionStatus === 'controller_approved'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : conflictScenario.resolutionStatus === 'rejected'
                    ? 'bg-red-950 text-red-300 border border-red-800'
                    : 'bg-yellow-950 text-yellow-300 border border-yellow-800'
                }`}
              >
                {conflictScenario.resolutionStatus.replace('_', ' ')}
              </span>
            </div>

            {/* Step-by-Step Vehicle Priority Sequence */}
            <div className="space-y-3">
              {/* Slot 1 */}
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-600/70 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px] font-bold">1</span>
                    MEDIC-101 (Ambulance)
                  </span>
                  <span className="text-[10px] font-mono text-emerald-300 bg-emerald-900/60 px-1.5 py-0.5 rounded font-bold">
                    PRIORITY GREEN (30s)
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Critical STEMI patient in resuscitation window. First right of way.
                </p>
              </div>

              {/* Slot 2 */}
              <div className="p-3 rounded-lg bg-orange-950/30 border border-orange-700/60 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-orange-400 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-orange-500 text-slate-950 flex items-center justify-center text-[10px] font-bold">2</span>
                    BRONTO-01 (Fire Tender)
                  </span>
                  <span className="text-[10px] font-mono text-orange-300 bg-orange-900/60 px-1.5 py-0.5 rounded font-bold">
                    STAGGERED (+45s)
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Held at stop line on Mayo approach for 45s, then awarded exclusive 40s Green Wave.
                </p>
              </div>

              {/* Slot 3 */}
              <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-700/60 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-400 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-blue-500 text-slate-950 flex items-center justify-center text-[10px] font-bold">3</span>
                    TRAFFIC-HAWK-1 (Police)
                  </span>
                  <span className="text-[10px] font-mono text-blue-300 bg-blue-900/60 px-1.5 py-0.5 rounded font-bold">
                    JUNCTION SHIELD
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Assigned to halt cross-traffic on Southbound Brigade Rd, securing clear path.
                </p>
              </div>
            </div>

            {/* Statutory Legal Explanation Box */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1 text-slate-300">
              <span className="font-bold text-slate-200 block text-[11px]">Mitigation Protocol:</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {conflictScenario.recommendation.mitigationStrategy}
              </p>
            </div>

            {/* Controller Approval & Rejection Handlers */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-[11px] font-mono text-slate-400 block">
                Controller: {currentUser.name} ({currentUser.badgeNumber})
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleReject}
                  className="py-2 px-3 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-red-400 border border-red-900/40 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={handleApprove}
                  className="py-2 px-3 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve Schedule</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
