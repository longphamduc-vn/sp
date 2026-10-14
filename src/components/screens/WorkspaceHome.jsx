import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import {
  PlusCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  Send,
  MessageSquare,
  DollarSign,
  Filter,
  CheckCircle,
  FileText,
  Search,
  ChevronRight,
  ArrowUpDown,
  SlidersHorizontal,
  Layers
} from 'lucide-react';

export function WorkspaceHome() {
  const {
    filteredItems,
    tasks,
    setActiveTab,
    setIsTaskDrawerOpen,
    setSelectedTask,
    setSelectedPoDetail,
    activeRole,
    t,
    translateCategory,
    translateStatus
  } = useApp();

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sortField, setSortField] = useState('requestDate');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Filter items
  const tableItems = filteredItems.filter((item) => {
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
    return true;
  }).sort((a, b) => {
    let valA = a[sortField] || '';
    let valB = b[sortField] || '';
    if (sortAsc) return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });

  const totalPages = Math.ceil(tableItems.length / pageSize) || 1;
  const paginatedItems = tableItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleOpenTask = (task) => {
    setSelectedTask(task);
    setIsTaskDrawerOpen(true);
  };

  const handleOpenPoDetail = (item) => {
    setSelectedPoDetail(item);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Quick Action */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {t('workspace.title')}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              {t('common.systemOnline')}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            {t('workspace.welcomeBack')}, <strong className="text-slate-800">{t(`roles.${activeRole}.label`) || activeRole}</strong>. {t('workspace.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => setActiveTab('wizard')}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all hover:shadow hover:-translate-y-0.5 active:translate-y-0"
          >
            <PlusCircle className="w-4 h-4" />
            {t('workspace.newRequestBtn')}
          </button>
        </div>
      </div>

      {/* Pending Task Banners (Interactive List) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {t('workspace.pendingActionTasks')}
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              {tasks.length} {t('workspace.requiresAction')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task) => {
            const isClarification = task.type === 'clarification';
            const isPriceAlert = task.type === 'price_alert';

            return (
              <div
                key={task.id}
                onClick={() => {
                  if (isClarification) {
                    handleOpenTask(task);
                  } else if (isPriceAlert) {
                    setActiveTab('po_lifecycle');
                  } else if (task.type === 'appraisal') {
                    setActiveTab('appraisal');
                  } else if (task.type === 'qc_check') {
                    setActiveTab('warehouse');
                  }
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-card hover:-translate-y-0.5 ${
                  task.severity === 'danger'
                    ? 'bg-red-50/40 border-red-200 hover:border-red-300'
                    : task.severity === 'warning'
                    ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
                    : 'bg-blue-50/40 border-blue-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg flex-shrink-0 ${
                        task.severity === 'danger'
                          ? 'bg-red-100 text-red-600'
                          : task.severity === 'warning'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {isPriceAlert ? (
                        <DollarSign className="w-4 h-4" />
                      ) : isClarification ? (
                        <MessageSquare className="w-4 h-4" />
                      ) : (
                        <AlertTriangle className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        {task.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500">
                        <span className="font-medium text-slate-700">{task.sender}</span>
                        <span>•</span>
                        <span>{task.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="text-[10px] font-semibold px-2 py-1 rounded bg-white text-indigo-700 border border-slate-200 flex items-center gap-1 shadow-2xs">
                      {task.actionRequired}
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Data Table: Active Spare Part Requests */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
        {/* Table Controls & Filter Bar */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-slate-900">
              {t('workspace.allRequestsLedger')}
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
              {tableItems.length} {t('common.items')}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span>{t('workspace.filterStatus')}:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
              >
                <option value="ALL">{t('workspace.allStatuses')}</option>
                <option value="In Review">{t('statuses.In Review')}</option>
                <option value="PIC Review">{t('statuses.PIC Review')}</option>
                <option value="PO Request">{t('statuses.PO Request')}</option>
                <option value="PO Standby">{t('statuses.PO Standby')}</option>
                <option value="PO Remained">{t('statuses.PO Remained')}</option>
                <option value="PO Receiving">{t('statuses.PO Receiving')}</option>
                <option value="Stocked In (Inventory)">{t('statuses.Stocked In (Inventory)')}</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>{t('workspace.filterCategory')}:</span>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
              >
                <option value="ALL">{t('workspace.allCategories')}</option>
                <option value="Electrical">{t('categories.Electrical')}</option>
                <option value="Mechanical">{t('categories.Mechanical')}</option>
                <option value="Pneumatic">{t('categories.Pneumatic')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/60 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">{t('common.itemCode')} & {t('common.specs')}</th>
                <th className="py-3 px-4">{t('common.line')}</th>
                <th className="py-3 px-4 max-w-xs">{t('wizard.calculationLogic')}</th>
                <th className="py-3 px-4">{t('common.qty')}</th>
                <th className="py-3 px-4">{t('common.totalCost')}</th>
                <th className="py-3 px-4">{t('common.interlockStatus')}</th>
                <th className="py-3 px-4">{t('common.status')}</th>
                <th className="py-3 px-4 text-right">{t('common.action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Code & Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Layers className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-indigo-600">
                            {item.id}
                          </span>
                          {item.priceRiskAlert && (
                            <span className="text-[10px] px-1 bg-red-100 text-red-700 font-bold rounded">
                              {t('po.cardPriceRisk')}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-900 font-medium leading-snug truncate max-w-xs">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate max-w-xs">
                          {item.specs}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Line & Process */}
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800">{item.line}</div>
                    <div className="text-[11px] text-slate-500">{item.process}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {t('common.needBy')}: {item.needByDate}
                    </div>
                  </td>

                  {/* Logic */}
                  <td className="py-3 px-4 max-w-xs">
                    <div className="text-[11px] text-slate-700 line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded border border-slate-100 font-sans">
                      {item.logic}
                    </div>
                    {item.clarificationRequested && (
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        ⚠️ {t('pic.requestClarification')}
                      </span>
                    )}
                  </td>

                  {/* Qty */}
                  <td className="py-3 px-4 font-mono font-medium text-slate-900">
                    {item.requestedQty} {item.unit}
                    <div className="text-[10px] text-slate-400 font-sans">
                      MOQ: {item.moq || 1}
                    </div>
                  </td>

                  {/* Cost */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">
                      ${(item.requestedQty * item.unitPrice).toFixed(2)}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      @${item.unitPrice}/{item.unit}
                    </div>
                  </td>

                  {/* Interlock */}
                  <td className="py-3 px-4">
                    <Badge variant={item.interlockStatus === 'OK' ? 'success' : 'warning'}>
                      {item.interlockStatus}
                    </Badge>
                  </td>

                  {/* Workflow Status */}
                  <td className="py-3 px-4">
                    <Badge>{translateStatus(item.status)}</Badge>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                      {item.poNumber || 'PO Not Assigned'}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {item.clarificationRequested ? (
                        <button
                          onClick={() => {
                            const relatedTask = tasks.find((t) => t.targetId === item.id) || {
                              id: 'TASK-101',
                              title: `Reply clarification for ${item.id}`,
                              targetId: item.id
                            };
                            handleOpenTask(relatedTask);
                          }}
                          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded font-medium text-[11px] transition-colors"
                        >
                          {t('workspace.replyToPic')}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenPoDetail(item)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded font-medium text-[11px] transition-colors"
                        >
                          {t('common.viewDetails')}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {paginatedItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    {t('workspace.noMatchingRecords')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="p-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
          <div>
            {t('common.showing')} {(currentPage - 1) * pageSize + 1} -{' '}
            {Math.min(currentPage * pageSize, tableItems.length)} {t('common.of')} {tableItems.length} {t('common.items')}
          </div>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 border border-slate-200 rounded bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-slate-700"
            >
              {t('common.previous')}
            </button>
            <span className="px-2 font-mono">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 border border-slate-200 rounded bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-slate-700"
            >
              {t('common.next')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
