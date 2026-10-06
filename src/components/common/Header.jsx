import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  UserCheck,
  ChevronDown,
  Layers,
  Sparkles,
  Check,
  Clock,
  ExternalLink,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { Badge } from './Badge';

export function Header() {
  const {
    activeRole,
    setActiveRole,
    searchQuery,
    setSearchQuery,
    notifications,
    unreadNotificationsCount,
    setActiveTab
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const roleDropdownRef = useRef(null);
  const notifDropdownRef = useRef(null);

  const roles = [
    {
      id: 'Requestor',
      label: 'Requestor (Engineer)',
      desc: 'Create requests, reply to logic clarifications, track user items',
      badge: 'Creator'
    },
    {
      id: 'PIC Review',
      label: 'PIC Review (Code Master)',
      desc: 'Active code validation, EMS quotation dispatch, logic approval',
      badge: 'Specialist'
    },
    {
      id: 'Leader / Management',
      label: 'Leader / Management',
      desc: 'Budget appraisal review, executive sign-off, downtime analytics',
      badge: 'Executive'
    },
    {
      id: 'Warehouse Keeper',
      label: 'Warehouse Keeper',
      desc: 'Goods receipt QC validation, work order stock issue & interlock control',
      badge: 'Operations'
    }
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target)) {
        setIsRoleDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
        setIsNotifDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-subtle">
      {/* Search Input */}
      <div className="flex items-center gap-3 w-96 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Global Search (Item Code, PO#, Requestor, WO#)..."
            className="w-full pl-9 pr-8 py-1.5 bg-[#F8FAFC] hover:bg-slate-100/80 focus:bg-white text-xs text-slate-800 placeholder-slate-400 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-medium"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Role Banner / Active Perspective */}
      <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-indigo-50/70 border border-indigo-100 rounded-full text-xs text-indigo-700">
        <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
        <span>Current Perspective:</span>
        <strong className="font-semibold text-indigo-900">{activeRole}</strong>
      </div>

      {/* Right Action Icons & Role Switcher */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative" ref={notifDropdownRef}>
          <button
            onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
            title="Task Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full animate-pulse-subtle shadow-sm">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Notifications Popover */}
          {isNotifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-84 bg-white rounded-lg shadow-popover border border-slate-200 py-2 z-50 animate-fade-in divide-y divide-slate-100" style={{ width: '340px' }}>
              <div className="px-4 py-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Pending Workflow Alerts
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {unreadNotificationsCount} unread
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (n.tabTarget) setActiveTab(n.tabTarget);
                      setIsNotifDropdownOpen(false);
                    }}
                    className={`px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors ${
                      !n.read ? 'bg-indigo-50/30' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-900 leading-snug">
                        {n.title}
                      </p>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {n.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      {n.desc}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-indigo-600">
                      <span>Jump to screen</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 bg-slate-50 text-center">
                <span className="text-[11px] text-slate-500">
                  Real-time EMS sync active • 0 delay
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher Dropdown */}
        <div className="relative" ref={roleDropdownRef}>
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 shadow-subtle transition-all"
          >
            <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              {activeRole.charAt(0)}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-[11px] text-slate-500 leading-none">Role View</div>
              <div className="font-semibold text-slate-900 leading-tight mt-0.5">
                {activeRole}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-popover border border-slate-200 py-1.5 z-50 animate-fade-in">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900">Switch User Perspective</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Simulate interactive workflows across enterprise stakeholders
                </p>
              </div>
              <div className="py-1">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setActiveRole(r.id);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 flex items-start gap-2.5 hover:bg-slate-50 transition-colors ${
                      activeRole === r.id ? 'bg-indigo-50/60' : ''
                    }`}
                  >
                    <div className="mt-0.5">
                      {activeRole === r.id ? (
                        <Check className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900">
                          {r.label}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                          {r.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        {r.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
