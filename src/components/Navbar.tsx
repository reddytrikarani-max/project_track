import React, { useState } from 'react';
import { User, NotificationItem } from '../types';
import {
  ShieldAlert,
  Bell,
  MapPin,
  BarChart3,
  Layers,
  Sparkles,
  DollarSign,
  Plus,
  Camera,
  Check,
  ChevronDown,
  Menu,
  X,
  Search
} from 'lucide-react';

interface Props {
  currentUser: User;
  onSelectUser: (user: User) => void;
  availableUsers: User[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
  onOpenFieldUpdateModal: () => void;
  onOpenNewProjectModal: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<Props> = ({
  currentUser,
  onSelectUser,
  availableUsers,
  activeTab,
  setActiveTab,
  notifications,
  onOpenNotifications,
  onOpenFieldUpdateModal,
  onOpenNewProjectModal,
  searchQuery,
  setSearchQuery
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'tracker', label: 'Milestones & Progress', icon: Layers },
    { id: 'financials', label: 'Capex & Budget', icon: DollarSign },
    { id: 'risks', label: 'Early-Warning Radar', icon: ShieldAlert },
    { id: 'map', label: 'GIS Map View', icon: MapPin },
    { id: 'ai', label: 'Drishti AI Insights', icon: Sparkles, highlight: true }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-md">
      {/* Top subtle tricolor accent bar representing Government of India infrastructure portal */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white/80 to-emerald-500 opacity-90" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & National Portal Branding */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-emerald-500/20 border border-amber-500/40 shadow-inner">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <span className="text-white font-extrabold text-sm tracking-wider font-mono">दृ</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-slate-100 via-amber-200 to-orange-400 bg-clip-text text-transparent">
                  ProjectDrishti
                </span>
                <span className="hidden sm:inline-flex text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  PM GatiShakti AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none">
                National Mega Infrastructure Early-Warning Portal
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xs relative items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, NHAI, corridors..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-900/90 text-slate-100 placeholder-slate-500 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/40 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-slate-500 hover:text-slate-300 text-xs"
              >
                ×
              </button>
            )}
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  } ${item.highlight && !isActive ? 'text-amber-300/80 hover:text-amber-300' : ''}`}
                >
                  <Icon className={`w-3.5 h-3.5 ${item.highlight ? 'text-amber-400' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Role Switcher */}
          <div className="flex items-center gap-2">
            {/* Quick Action Buttons based on Role */}
            <button
              onClick={onOpenFieldUpdateModal}
              title="Submit Site Inspection Report"
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Site Report</span>
            </button>

            {(currentUser.role === 'admin' || currentUser.role === 'project_manager') && (
              <button
                onClick={onOpenNewProjectModal}
                title="Add New Infrastructure Project"
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors shadow-sm shadow-amber-500/20"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add Project</span>
              </button>
            )}

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
              title="Early Warning Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm shadow-rose-500/50">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-colors"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-amber-500/50"
                />
                <div className="hidden xl:block text-left leading-tight">
                  <div className="text-xs font-semibold text-slate-200 truncate max-w-[120px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-amber-400 font-medium">
                    {currentUser.roleTitle}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Role Switcher Menu */}
              {roleMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setRoleMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Switch Role (Demo Persona)
                    </span>
                    <p className="text-xs text-slate-300 font-medium mt-0.5">
                      Test permissions & perspectives
                    </p>
                  </div>

                  <div className="space-y-1">
                    {availableUsers.map((user) => {
                      const isSelected = user.id === currentUser.id;
                      return (
                        <button
                          key={user.id}
                          onClick={() => {
                            onSelectUser(user);
                            setRoleMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                            isSelected
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              : 'text-slate-300 hover:bg-slate-800/80'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700"
                            />
                            <div>
                              <div className="font-semibold text-slate-200">{user.name}</div>
                              <div className="text-[11px] text-amber-400/90 font-medium">
                                {user.roleTitle}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate max-w-[170px]">
                                {user.department}
                              </div>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-800/80 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  onOpenFieldUpdateModal();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Site Report</span>
              </button>
              <button
                onClick={() => {
                  onOpenNewProjectModal();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-amber-500 text-slate-950 font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
