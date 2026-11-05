import React, { useState } from 'react';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  Flame,
  Hospital,
  Wifi,
  Trash2,
  CheckCheck,
} from 'lucide-react';
import { useEmergenx } from '../../context/EmergenxContext';
import { NotificationItem } from '../../types';

export const NotificationCenterView: React.FC = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useEmergenx();
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = notifications.filter((n) => {
    if (filterType !== 'all' && n.type !== filterType) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-blue-950/80 border border-blue-700 text-blue-400">
              <Bell className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Central Notification & Alert Hub</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-semibold uppercase">
              {notifications.filter((n) => !n.read).length} Unread
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time feed of emergency activations, route recommendations, congestion bottlenecks, and hospital triage acknowledgments.
          </p>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
        >
          <CheckCheck className="w-4 h-4 text-emerald-400" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Filter Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
        {(
          [
            { id: 'all', label: 'All Alerts' },
            { id: 'activation', label: 'Emergency Activations' },
            { id: 'priority', label: 'Corridor Preemptions' },
            { id: 'congestion', label: 'Congestion Warnings' },
            { id: 'hospital', label: 'Hospital Alerts' },
            { id: 'network', label: 'Network & GPS' },
            { id: 'completion', label: 'Completions' },
          ] as const
        ).map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              filterType === f.id
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs bg-slate-900 rounded-xl border border-slate-800">
            No notifications in this category.
          </div>
        ) : (
          filtered.map((item) => {
            return (
              <div
                key={item.id}
                onClick={() => markNotificationAsRead(item.id)}
                className={`p-4 rounded-xl border transition-colors cursor-pointer flex items-start justify-between gap-4 ${
                  item.read
                    ? 'bg-slate-900/60 border-slate-800 opacity-75'
                    : 'bg-slate-900 border-slate-700 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                      item.severity === 'critical'
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : item.severity === 'warning'
                        ? 'bg-orange-950 text-orange-400 border border-orange-800'
                        : item.severity === 'success'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-blue-950 text-blue-400 border border-blue-800'
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-white">{item.title}</h4>
                      <span className="text-[10px] font-mono uppercase text-slate-500 bg-slate-950 px-1.5 py-0.2 rounded">
                        {item.type}
                      </span>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-normal">{item.message}</p>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-500 whitespace-nowrap shrink-0">
                  {item.timestamp}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
