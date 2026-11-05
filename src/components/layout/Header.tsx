import React from 'react';
import { EmergenxLogo } from '../brand/EmergenxLogo';
import { useEmergenx } from '../../context/EmergenxContext';
import { UserRole } from '../../types';

interface HeaderProps {
  currentView: string;
  onNavigate: (viewId: string) => void;
  onOpenActivationModal: () => void;
  onOpenRoleModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenActivationModal,
  onOpenRoleModal,
}) => {
  const { currentUser, switchUserRole, notifications, networkStatus } = useEmergenx();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-900 border-b border-slate-800 text-slate-100 z-30 select-none">
      {/* Zone 1: Brand title wordmark */}
      <div 
        onClick={() => onNavigate('overview')} 
        className="cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2"
        role="button"
        tabIndex={0}
      >
        <EmergenxLogo size="md" />
      </div>

      {/* Zone 2: 4–5 single-line clean nav links */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={() => onNavigate('overview')}
          className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
            currentView === 'overview' ? 'text-blue-400 font-semibold' : 'hover:text-white'
          }`}
        >
          Command Center
        </button>
        <button
          onClick={() => onNavigate('map')}
          className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
            currentView === 'map' ? 'text-blue-400 font-semibold' : 'hover:text-white'
          }`}
        >
          Live Map
        </button>
        <button
          onClick={() => onNavigate('conflicts')}
          className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
            currentView === 'conflicts' ? 'text-blue-400 font-semibold' : 'hover:text-white'
          }`}
        >
          Conflict Resolver
        </button>
        <button
          onClick={() => onNavigate('green_corridor')}
          className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
            currentView === 'green_corridor' ? 'text-blue-400 font-semibold' : 'hover:text-white'
          }`}
        >
          Green Corridors
        </button>
        <button
          onClick={() => onNavigate('hospitals')}
          className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
            currentView === 'hospitals' ? 'text-blue-400 font-semibold' : 'hover:text-white'
          }`}
        >
          Hospital Triage
        </button>
      </nav>

      {/* Zone 3: 1 Primary Action + Quick Role / Notification Context */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Quick Role Switcher Pill */}
        <button
          onClick={onOpenRoleModal}
          title="Click to switch role or view credentials"
          className="hidden sm:flex items-center gap-2 px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          <span className="font-medium text-slate-200 truncate max-w-[140px]">{currentUser.name.split(' ')[0]}</span>
          <span className="text-[10px] text-slate-400 font-mono uppercase bg-slate-900 px-1 py-0.5 rounded">
            {currentUser.role.replace('_', ' ')}
          </span>
        </button>

        {/* Notifications badge */}
        <button
          onClick={() => onNavigate('notifications')}
          className="relative p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
          title="Open Notifications"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Primary Action Button: Activate Emergency */}
        <button
          onClick={onOpenActivationModal}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          <span>Activate Emergency</span>
        </button>
      </div>
    </header>
  );
};
