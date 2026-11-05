import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  Flame,
  Truck,
  BrainCircuit,
  Route,
  Activity,
  GitFork,
  Hospital,
  Wifi,
  BarChart3,
  FlaskConical,
  Bell,
  ShieldCheck,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';
import { useEmergenx } from '../../context/EmergenxContext';

interface SidebarProps {
  currentView: string;
  onNavigate: (viewId: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
}) => {
  const {
    currentUser,
    isSimulating,
    toggleSimulation,
    simulationSpeed,
    setSimulationSpeed,
    resetSimulation,
    requests,
    vehicles,
    notifications,
  } = useEmergenx();

  const activeVehiclesCount = vehicles.filter((v) => v.status === 'en_route').length;
  const activeRequestsCount = requests.filter((r) => r.status === 'active').length;
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const navItems = [
    { id: 'overview', label: 'Command Overview', icon: LayoutDashboard },
    { id: 'map', label: 'Live Emergency Map', icon: MapPin, count: activeVehiclesCount },
    { id: 'requests', label: 'Emergency Requests', icon: Flame, count: activeRequestsCount },
    { id: 'vehicles', label: 'Vehicle Management', icon: Truck },
    { id: 'ai_engine', label: 'AI Decision Engine', icon: BrainCircuit, badge: 'CORE' },
    { id: 'conflicts', label: 'Conflict Resolver', icon: GitFork, badge: 'KEY' },
    { id: 'routes', label: 'Route Optimization', icon: Route },
    { id: 'traffic', label: 'Predictive Traffic', icon: Activity },
    { id: 'green_corridor', label: 'Green Corridor Sim', icon: GitFork },
    { id: 'hospitals', label: 'Hospital Coordination', icon: Hospital },
    { id: 'network', label: 'Network & GPS Resilience', icon: Wifi },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'simulation_lab', label: 'Simulation Lab', icon: FlaskConical, badge: 'DEMO' },
    { id: 'notifications', label: 'Notifications', icon: Bell, count: unreadNotifsCount },
    { id: 'security', label: 'Verification & Security', icon: ShieldCheck },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-50 transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Navigation Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer group text-left ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-800 font-semibold">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-red-950 text-red-300 border border-red-800 font-semibold">
                      {item.count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Real-time Simulation Control Bar at bottom of sidebar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 select-none">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isSimulating ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              {isSimulating ? `LIVE SIM (${simulationSpeed}x)` : 'SIMULATION PAUSED'}
            </span>
            <button
              onClick={resetSimulation}
              title="Reset Simulation State"
              className="text-[10px] font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            <button
              onClick={() => toggleSimulation()}
              className={`col-span-2 flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                isSimulating
                  ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40 hover:bg-amber-600/30'
                  : 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30'
              }`}
            >
              {isSimulating ? (
                <>
                  <Pause className="w-3.5 h-3.5" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" /> Resume
                </>
              )}
            </button>

            <button
              onClick={() => setSimulationSpeed(simulationSpeed === 1 ? 2 : simulationSpeed === 2 ? 5 : 1)}
              className="col-span-2 py-1.5 px-2 text-xs font-mono font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors text-center cursor-pointer"
            >
              {simulationSpeed}x Speed
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
