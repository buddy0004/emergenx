import React, { useEffect, useState } from 'react';
import { EmergenxLogo } from '../brand/EmergenxLogo';

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stepText, setStepText] = useState('Initializing urban road network graph...');

  useEffect(() => {
    const steps = [
      { at: 20, text: 'Synchronizing 10 Bangalore arterial traffic signals...' },
      { at: 45, text: 'Connecting 16 authorized emergency transponders...' },
      { at: 70, text: 'Loading AI Multi-Emergency Decision Matrix...' },
      { at: 90, text: 'Connecting predictive green corridor simulator...' },
      { at: 100, text: 'Command Center Ready.' },
    ];

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 5;
        const currentStep = steps.find((s) => s.at >= next);
        if (currentStep) {
          setStepText(currentStep.text);
        }
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 400);
          return 100;
        }
        return next;
      });
    }, 90);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-6 selection:bg-blue-600">
      {/* Background ambient grid */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="relative z-10 flex flex-col items-center max-w-md w-full text-center">
        {/* Brand Logo with gentle scale entrance */}
        <div className="mb-6 transform transition-transform duration-700 hover:scale-105">
          <EmergenxLogo size="xl" />
        </div>

        {/* Tagline */}
        <h2 className="text-xl font-bold tracking-tight text-slate-200 mb-2">
          AI-Powered Multi-Emergency Mobility & Coordination System
        </h2>
        <p className="text-sm font-medium text-blue-400 mb-8 font-mono">
          Every Emergency. Every Second. Every Road.
        </p>

        {/* Loading Progress Bar */}
        <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-2.5 overflow-hidden mb-3 p-0.5">
          <div
            className="bg-gradient-to-r from-blue-600 to-teal-400 h-full rounded-full transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step Text & Percentage */}
        <div className="flex items-center justify-between w-full text-xs font-mono text-slate-400 mb-6">
          <span className="truncate pr-2">{stepText}</span>
          <span className="text-slate-200 tabular-nums shrink-0">{progress}%</span>
        </div>

        {/* Skip button for quick evaluation */}
        <button
          onClick={onComplete}
          className="text-xs text-slate-400 hover:text-slate-200 underline underline-offset-4 transition-colors cursor-pointer"
        >
          Skip initialization and enter dashboard
        </button>
      </div>

      {/* Footer System Badge */}
      <div className="absolute bottom-6 text-center text-[11px] text-slate-400 font-mono">
        Bangalore Urban Smart Mobility Demonstration · Leaflet OSM & SUMO Compatible Simulation
      </div>
    </div>
  );
};
