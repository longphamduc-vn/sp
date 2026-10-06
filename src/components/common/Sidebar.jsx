import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Inbox,
  FilePlus2,
  CheckSquare,
  BarChart3,
  Truck,
  PackageCheck,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Boxes,
  Cpu,
  HelpCircle
} from 'lucide-react';

export function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    tasks,
    items
  } = useApp();

  const pendingTasksCount = tasks.filter((t) => !t.read || t.type === 'clarification').length;
  const picReviewCount = items.filter((i) => i.stage === 'pic_review' || i.status === 'In Review').length;
  const qcPendingCount = items.filter((i) => i.stage === 'po_receiving' && !i.qcPassed).length;

  const navItems = [
    {
      id: 'workspace',
      label: 'Workspace & Tasks',
      icon: Inbox,
      badge: pendingTasksCount > 0 ? pendingTasksCount : null,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'wizard',
      label: 'Item Request Form',
      icon: FilePlus2,
      badge: null
    },
    {
      id: 'pic_review',
      label: 'PIC Review Hub',
      icon: CheckSquare,
      badge: picReviewCount > 0 ? picReviewCount : null,
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'appraisal',
      label: 'Monthly Appraisal',
      icon: BarChart3,
      badge: 'OCT'
    },
    {
      id: 'po_lifecycle',
      label: 'PO Lifecycle Board',
      icon: Truck,
      badge: '4 Stages'
    },
    {
      id: 'warehouse',
      label: 'Warehouse & WO',
      icon: PackageCheck,
      badge: qcPendingCount > 0 ? `${qcPendingCount} QC` : null,
      badgeColor: 'bg-red-100 text-red-700'
    },
    {
      id: 'dashboard',
      label: 'Leader Dashboard',
      icon: TrendingUp,
      badge: 'Analytics'
    }
  ];

  return (
    <aside
      className={`bg-white border-r border-slate-200 flex flex-col justify-between transition-all duration-300 z-40 select-none ${
        isSidebarCollapsed ? 'w-18' : 'w-64'
      }`}
      style={{ width: isSidebarCollapsed ? '72px' : '260px' }}
    >
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center px-4 border-b border-slate-200 justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <Boxes className="w-5 h-5" />
            </div>
            {!isSidebarCollapsed && (
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-tight text-slate-900">
                    SP-FLOW
                  </span>
                  <span className="text-[10px] font-semibold px-1 py-0.2 bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
                    Enterprise
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono tracking-tight">
                  Procurement Tracker v2.6
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Section */}
        <div className="p-3 space-y-1">
          {!isSidebarCollapsed && (
            <div className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Procurement Lifecycle
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={isSidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group relative ${
                  isActive
                    ? 'bg-indigo-50/80 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-indigo-600 rounded-r-md" />
                )}
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-700'
                  }`}
                />
                {!isSidebarCollapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
                {!isSidebarCollapsed && item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                      item.badgeColor || 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer & Collapse Toggle */}
      <div className="p-3 border-t border-slate-200 space-y-2">
        {!isSidebarCollapsed && (
          <div className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-200/80">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
              <span className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                EMS Node
              </span>
              <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Internal SAP/EMS Connector
            </div>
          </div>
        )}

        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
          title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
