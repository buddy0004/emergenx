import React from 'react';

export const EmergenxLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl'; showTagline?: boolean }> = ({
  size = 'md',
  showTagline = false,
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-11 h-11',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-4xl',
  };

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Abstract connected road network + emergency shield symbol */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
          {/* Outer faceted geometric emergency shield */}
          <path
            d="M50 5 L88 22 V52 C88 74 50 95 50 95 C50 95 12 74 12 52 V22 L50 5Z"
            fill="#0F172A"
            stroke="#2563EB"
            strokeWidth="4"
          />
          {/* Inner multi-lane connected emergency corridor grid */}
          <path
            d="M50 16 V84 M22 50 H78"
            stroke="#38BDF8"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Diagonal coordinated express bypass lines */}
          <path
            d="M30 30 L70 70 M70 30 L30 70"
            stroke="#10B981"
            strokeWidth="2.5"
            strokeDasharray="4 3"
          />
          {/* Central Priority Green Hub Intersection */}
          <circle cx="50" cy="50" r="9" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="3.5" fill="#EF4444" />
          {/* Route pulse nodes */}
          <circle cx="50" cy="22" r="3" fill="#38BDF8" />
          <circle cx="78" cy="50" r="3" fill="#38BDF8" />
          <circle cx="50" cy="78" r="3" fill="#38BDF8" />
          <circle cx="22" cy="50" r="3" fill="#38BDF8" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-baseline gap-1.5 leading-none">
          <span className={`font-black tracking-tight text-white ${textSizes[size]}`}>
            EMERGEN<span className="text-blue-500">X</span>
          </span>
          <span className="text-[10px] font-mono text-blue-400 font-semibold tracking-wider uppercase hidden sm:inline">
            CORE
          </span>
        </div>
        {showTagline && (
          <span className="text-xs text-slate-400 font-medium tracking-normal mt-1">
            Every Emergency. Every Second. Every Road.
          </span>
        )}
      </div>
    </div>
  );
};
