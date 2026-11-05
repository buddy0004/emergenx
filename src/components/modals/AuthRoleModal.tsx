import React, { useState } from 'react';
import { UserCheck, Shield, KeyRound, UserPlus, X, LogIn } from 'lucide-react';
import { useEmergenx } from '../../context/EmergenxContext';
import { DEMO_USERS } from '../../data/seedData';
import { UserRole } from '../../types';

export const AuthRoleModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { currentUser, switchUserRole } = useEmergenx();
  const [activeTab, setActiveTab] = useState<'roles' | 'login' | 'register' | 'forgot'>('roles');

  // Form states for login/register/forgot
  const [loginEmail, setLoginEmail] = useState('rajesh.btp@karnataka.gov.in');
  const [loginPassword, setLoginPassword] = useState('••••••••••');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRoleSelect = (role: UserRole) => {
    switchUserRole(role);
    setStatusMessage(`Switched active role to ${role.replace('_', ' ').toUpperCase()}`);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('Authenticated successfully via Smart City SSO.');
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('Reset instructions dispatched to registered Department email.');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('Registration submitted for Traffic Authority supervisor sign-off.');
  };

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden text-slate-100">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-950/60 border border-blue-800 text-blue-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">Authentication & Role Governance</h3>
              <p className="text-xs text-slate-400 font-mono">EMERGENX Security Access Module</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6">
          <button
            onClick={() => {
              setActiveTab('roles');
              setStatusMessage(null);
            }}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'roles'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Demo Role Switcher
          </button>
          <button
            onClick={() => {
              setActiveTab('login');
              setStatusMessage(null);
            }}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'login'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              setStatusMessage(null);
            }}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'register'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Register Operator
          </button>
          <button
            onClick={() => {
              setActiveTab('forgot');
              setStatusMessage(null);
            }}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'forgot'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Forgot Password
          </button>
        </div>

        {/* Status Toast inside modal */}
        {statusMessage && (
          <div className="mx-6 mt-4 p-2.5 rounded-lg bg-blue-950/70 border border-blue-700/60 text-blue-300 text-xs font-mono">
            {statusMessage}
          </div>
        )}

        {/* Tab 1: Demo Role Switcher */}
        {activeTab === 'roles' && (
          <div className="p-6 space-y-3">
            <p className="text-xs text-slate-400 mb-2">
              Select any role to test role-specific dashboard views, permissions, and workflow actions:
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              {DEMO_USERS.map((user) => {
                const isSelected = currentUser.id === user.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => handleRoleSelect(user.role)}
                    className={`w-full p-3.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between group ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 shadow-sm'
                        : 'bg-slate-800/80 border-slate-700 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-slate-100">{user.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-blue-400 uppercase font-semibold">
                          {user.role.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{user.department}</p>
                      <p className="text-[11px] font-mono text-slate-400 mt-1">Badge: {user.badgeNumber}</p>
                    </div>

                    <div className="shrink-0 ml-3">
                      {isSelected ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                          <UserCheck className="w-4 h-4" /> Active
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 group-hover:text-blue-400 transition-colors">
                          Switch →
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Login */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Official Email / ID</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Access Token / Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-slate-800 border-slate-700" />
                <span>Keep session persistent</span>
              </label>
              <button
                type="button"
                onClick={() => setActiveTab('forgot')}
                className="text-blue-400 hover:underline"
              >
                Reset Key
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" /> Authenticate & Enter Command Console
            </button>
          </form>
        )}

        {/* Tab 3: Register */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  defaultValue="Officer K. Ramesh"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Badge ID</label>
                <input
                  type="text"
                  required
                  defaultValue="BTP-8841"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Emergency Department</label>
              <select className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs focus:ring-1 focus:ring-blue-500 outline-none">
                <option>Bangalore Traffic Police - Central Operations</option>
                <option>108 Emergency Medical Services</option>
                <option>Karnataka State Fire & Rescue Services</option>
                <option>Hospital Trauma Center Triage</option>
                <option>Disaster Management Authority</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Official Gov / Hospital Email</label>
              <input
                type="email"
                required
                defaultValue="k.ramesh@trafficpolice.gov.in"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" /> Submit for Identity Verification
            </button>
          </form>
        )}

        {/* Tab 4: Forgot Password */}
        {activeTab === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="p-6 space-y-4">
            <p className="text-xs text-slate-400">
              Enter your registered official email or Department Badge Number to receive an encrypted security recovery code.
            </p>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Department Identifier</label>
              <input
                type="text"
                required
                defaultValue="rajesh.btp@karnataka.gov.in"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" /> Dispatch Recovery Token
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
