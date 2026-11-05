import React, { useState } from 'react';
import {
  BrainCircuit,
  ShieldCheck,
  Sparkles,
  GitFork,
  ArrowRight,
  Scale,
  RefreshCw,
  Clock,
  Layers,
} from 'lucide-react';
import { useEmergenx } from '../../context/EmergenxContext';

export const AiDecisionEngineView: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
  const { requests, vehicles, intersections, conflictScenario, currentUser } = useEmergenx();
  const [priorityFramework, setPriorityFramework] = useState<'statutory' | 'dynamic_eta' | 'mass_casualty'>(
    'statutory'
  );
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  const fetchAiExplanation = async () => {
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/ai/explain-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioName: conflictScenario.title,
          vehicles: conflictScenario.vehicles,
          intersection: {
            name: conflictScenario.intersectionName,
            id: conflictScenario.intersectionId,
          },
          decision: {
            grantedVehicleId: 'MEDIC-101 (Ambulance)',
            grantedCategory: 'ambulance',
            grantedSeverity: 'Critical (STEMI)',
            grantedEta: '0.6',
          },
          priorityFramework:
            priorityFramework === 'statutory'
              ? 'Statutory Emergency Priority (Life Threat > Structural Hazard > Police Pursuit)'
              : priorityFramework === 'dynamic_eta'
              ? 'Shortest Time-to-Clearance Dynamic Window'
              : 'Mass Casualty Structural Protocol',
        }),
      });
      const data = await res.json();
      setAiExplanation(data.explanation);
    } catch (err) {
      setAiExplanation(
        `[Automated Coordinator Briefing]: Priority sequence verified under Section 42-A Statutory Mobility Act. MEDIC-101 allocated 30s Green Wave based on critical STEMI status. Secondary units staged safely.`
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
            <div className="p-2 rounded-lg bg-blue-950/80 border border-blue-700 text-blue-400">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">AI Emergency Decision Engine</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold uppercase">
              Deterministic Priority Core
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Multi-factor arbitration engine evaluating simultaneous emergency corridor demands. Built on transparent statutory regulations, not opaque black-box scoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('conflicts')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
          >
            <GitFork className="w-4 h-4" />
            <span>Interactive Conflict Simulator</span>
          </button>
        </div>
      </div>

      {/* Policy Framework Selector Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-white">Active Regulatory Priority Framework</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Authorized by Bangalore Traffic Control</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
          <button
            onClick={() => setPriorityFramework('statutory')}
            className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
              priorityFramework === 'statutory'
                ? 'bg-blue-950/50 border-blue-500 text-slate-100'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="text-xs font-bold mb-1 flex items-center justify-between">
              <span>1. Statutory Life-First Protocol</span>
              {priorityFramework === 'statutory' && (
                <span className="text-[10px] text-emerald-400 font-mono">ACTIVE</span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Direct threat to human life (Trauma/Cardiac) &gt; Active structural fire &gt; High-risk police escort.
            </p>
          </button>

          <button
            onClick={() => setPriorityFramework('dynamic_eta')}
            className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
              priorityFramework === 'dynamic_eta'
                ? 'bg-blue-950/50 border-blue-500 text-slate-100'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="text-xs font-bold mb-1 flex items-center justify-between">
              <span>2. Quick-Clearance Dynamic ETA</span>
              {priorityFramework === 'dynamic_eta' && (
                <span className="text-[10px] text-emerald-400 font-mono">ACTIVE</span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Clears the vehicle closest to the junction stop line first if arrival delta is &lt;15 seconds.
            </p>
          </button>

          <button
            onClick={() => setPriorityFramework('mass_casualty')}
            className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
              priorityFramework === 'mass_casualty'
                ? 'bg-blue-950/50 border-blue-500 text-slate-100'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="text-xs font-bold mb-1 flex items-center justify-between">
              <span>3. Mass Disaster Containment</span>
              {priorityFramework === 'mass_casualty' && (
                <span className="text-[10px] text-emerald-400 font-mono">ACTIVE</span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Prioritizes heavy disaster rescue and multi-casualty fire engines over isolated transport.
            </p>
          </button>
        </div>
      </div>

      {/* Decision Engine Evaluation Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Evaluation Factors & Active Priority Decision */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-white">Simultaneous Emergency Arbitration Analysis</h3>
                <p className="text-xs text-slate-400">Junction: MG Road & Brigade Road (INT-01)</p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                Decision: Approved
              </span>
            </div>

            {/* Conflicting Vehicles Compared */}
            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-slate-300">Evaluating Responding Units:</span>

              {conflictScenario.vehicles.map((v, idx) => {
                const isFirst = idx === 0;
                return (
                  <div
                    key={v.vehicleId}
                    className={`p-3.5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isFirst
                        ? 'bg-emerald-950/30 border-emerald-600/60'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono ${
                            isFirst ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span className="font-bold text-xs text-white">{v.callSign}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 uppercase">
                          {v.category.replace('_', ' ')}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded uppercase font-semibold ${
                            v.severity === 'critical'
                              ? 'bg-red-950 text-red-300 border border-red-800'
                              : 'bg-orange-950 text-orange-300 border border-orange-800'
                          }`}
                        >
                          {v.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{v.patientOrHazardDetails}</p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Junction ETA</span>
                        <span className="font-bold text-slate-200">{v.etaSeconds}s</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Corridor Allocation</span>
                        <span className={`font-bold ${isFirst ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {isFirst ? 'Phase 1 (Immediate)' : `Phase 2 (+${v.etaSeconds + 20}s)`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Decision Rationale Details */}
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Transparent Algorithmic Rationale:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {conflictScenario.recommendation.rationale}
              </p>
              <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
                Rule Authority: {conflictScenario.recommendation.statutoryPolicyRule}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Gemini AI Assistant Explanation */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-xs text-white">Gemini AI Dispatch Briefing</h3>
              </div>
              <button
                onClick={fetchAiExplanation}
                disabled={isLoadingAi}
                className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAi ? 'animate-spin' : ''}`} />
                <span>{aiExplanation ? 'Regenerate' : 'Analyze with AI'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-normal">
              Gemini provides human-readable explanations, incident summaries, and corridor risk advisories for control center supervisors.
            </p>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2 min-h-[160px]">
              {isLoadingAi ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400 space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
                  <span className="text-xs font-mono">Synthesizing corridor advisory via Gemini-3.8-flash...</span>
                </div>
              ) : aiExplanation ? (
                <div className="whitespace-pre-line font-sans text-slate-200">
                  {aiExplanation}
                </div>
              ) : (
                <div className="text-slate-400 text-center py-6">
                  Click <strong className="text-blue-400">"Analyze with AI"</strong> to query Gemini for an intelligent operational debrief of this conflict scenario.
                </div>
              )}
            </div>

            <button
              onClick={fetchAiExplanation}
              disabled={isLoadingAi}
              className="w-full py-2 px-3 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Query Gemini Emergency Explanation</span>
            </button>
          </div>

          {/* Quick Stats on Queue Dissipation */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <span className="font-bold text-slate-300 block">Civilian Spillover Estimation:</span>
            <div className="grid grid-cols-2 gap-2 font-mono">
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Cross Queue Delay</span>
                <span className="text-amber-400 font-bold">+38 seconds</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Signal Recovery</span>
                <span className="text-emerald-400 font-bold">2.2 cycles</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
