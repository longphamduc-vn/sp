import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import {
  RefreshCw,
  Mail,
  CheckCircle,
  AlertTriangle,
  FileCheck,
  Send,
  MessageSquarePlus,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  CheckSquare2,
  ExternalLink
} from 'lucide-react';

export function PicReviewHub() {
  const {
    filteredItems,
    syncMasterCodes,
    requestActiveCode,
    sendReviseEmail,
    setIsCreateTaskModalOpen,
    setTaskTargetItem,
    advancePoStage,
    addToast,
    t,
    language,
    translateStatus
  } = useApp();

  const [selectedIds, setSelectedIds] = useState([]);
  const [filterCodeStatus, setFilterCodeStatus] = useState('ALL');
  const [filterPriceStatus, setFilterPriceStatus] = useState('ALL');
  const [expandedLogicId, setExpandedLogicId] = useState(null);

  // Toggle selection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredItems.map((i) => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk Create EMS Quote Request
  const handleBulkQuoteRequest = () => {
    if (selectedIds.length === 0) {
      addToast(
        language === 'vi' ? "Yêu cầu chọn vật tư" : "Selection Required",
        language === 'vi' ? "Vui lòng chọn ít nhất một vật tư từ danh sách." : "Please select at least one item from the grid.",
        "warning"
      );
      return;
    }
    addToast(
      language === 'vi' ? "Đã gửi báo giá EMS hàng loạt" : "EMS Quotation Batch Dispatched",
      language === 'vi'
        ? `Đã chuyển yêu cầu RFQ tới cổng mua sắm EMS cho ${selectedIds.length} vật tư (${selectedIds.slice(0, 3).join(', ')}${selectedIds.length > 3 ? '...' : ''}).`
        : `Dispatched bulk RFQ tickets to EMS Procurement portal for ${selectedIds.length} items (${selectedIds.slice(0, 3).join(', ')}${selectedIds.length > 3 ? '...' : ''}).`,
      "success"
    );
    setSelectedIds([]);
  };

  // Filter items
  const gridItems = filteredItems.filter((item) => {
    if (filterCodeStatus !== 'ALL') {
      if (filterCodeStatus === 'STOP_PO' && !item.codeStatus.includes('Stop PO')) return false;
      if (filterCodeStatus === 'ACTIVE' && !item.codeStatus.includes('Active')) return false;
    }
    if (filterPriceStatus !== 'ALL') {
      if (filterPriceStatus === 'NEED_REVISE' && !item.priceStatus.includes('Need Revise')) return false;
      if (filterPriceStatus === 'PRICE_RISK' && !item.priceStatus.includes('Price Risk')) return false;
      if (filterPriceStatus === 'UNQUOTED' && !item.priceStatus.includes('Unquoted')) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and KPI summary */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {t('pic.title')}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-blue-50 text-blue-700 border border-blue-200">
              Interactive Workspace
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            {t('pic.subtitle')}
          </p>
        </div>

        {/* Top Action Bar Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => syncMasterCodes()}
            className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-indigo-600" />
            {t('pic.syncMasterCodes')}
          </button>

          <button
            onClick={handleBulkQuoteRequest}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
          >
            <Mail className="w-4 h-4" />
            {t('pic.bulkQuoteBtn')} ({selectedIds.length})
          </button>
        </div>
      </div>

      {/* Filter and Grid Controls */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="text-xs font-bold text-slate-900">
              Interactive Master Code Data Grid
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
              {gridItems.length} items
            </span>
            {selectedIds.length > 0 && (
              <span className="text-xs text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                {selectedIds.length} selected for batch
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap text-xs">
            <div className="flex items-center gap-1.5 text-slate-500">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{t('pic.filterCodeStatus')}:</span>
              <select
                value={filterCodeStatus}
                onChange={(e) => setFilterCodeStatus(e.target.value)}
                className="bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800 focus:outline-none"
              >
                <option value="ALL">{t('pic.allCodes')}</option>
                <option value="ACTIVE">{t('pic.activeOnly')}</option>
                <option value="STOP_PO">{t('pic.stopPoOnly')}</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-slate-500">
              <span>{t('pic.filterPriceStatus')}:</span>
              <select
                value={filterPriceStatus}
                onChange={(e) => setFilterPriceStatus(e.target.value)}
                className="bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800 focus:outline-none"
              >
                <option value="ALL">{t('pic.allPrices')}</option>
                <option value="NEED_REVISE">{t('pic.needReviseOnly')}</option>
                <option value="PRICE_RISK">{t('pic.priceRiskOnly')}</option>
                <option value="UNQUOTED">{t('pic.unquotedOnly')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      gridItems.length > 0 && selectedIds.length === gridItems.length
                    }
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="py-3 px-4">{t('pic.thItem')}</th>
                <th className="py-3 px-4 min-w-[200px]">{t('common.specs')}</th>
                <th className="py-3 px-4">{t('common.line')}</th>
                <th className="py-3 px-4 max-w-sm">{t('pic.thLogic')}</th>
                <th className="py-3 px-4">{t('pic.thCodeStatus')}</th>
                <th className="py-3 px-4">{t('pic.thPriceStatus')}</th>
                <th className="py-3 px-4">{t('pic.thInterlock')}</th>
                <th className="py-3 px-4 text-right">{t('pic.thActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {gridItems.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                const isStopPo = item.codeStatus.includes('Stop PO');
                const isNeedRevise = item.priceStatus.includes('Need Revise');
                const isPriceRisk = item.priceStatus.includes('Price Risk');
                const isExpanded = expandedLogicId === item.id;

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      isSelected ? 'bg-indigo-50/40' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(item.id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>

                    {/* Item Code */}
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-indigo-600 bg-indigo-50/80 px-2 py-0.5 rounded border border-indigo-100">
                        {item.id}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1 font-mono">
                        {item.poNumber || 'PO Not Assigned'}
                      </div>
                    </td>

                    {/* Specs & Image */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Layers className="w-4 h-4 text-slate-400 m-auto mt-3" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 leading-snug">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            {item.specs}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {t('common.vendor')}: {item.vendor || 'Master EMS Vendor'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Line / Process */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{item.line}</div>
                      <div className="text-[11px] text-slate-500">{item.process}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {t('common.requestor')}: {item.requestor}
                      </div>
                    </td>

                    {/* Logic Justification (Truncated + Expand) */}
                    <td className="py-3 px-4 max-w-sm">
                      <div
                        className={`text-[11px] text-slate-700 bg-slate-50 p-2 rounded border border-slate-100 cursor-pointer ${
                          !isExpanded ? 'line-clamp-2' : ''
                        }`}
                        onClick={() => setExpandedLogicId(isExpanded ? null : item.id)}
                        title="Click to expand/collapse full justification"
                      >
                        {item.logic}
                      </div>
                      <button
                        onClick={() => setExpandedLogicId(isExpanded ? null : item.id)}
                        className="text-[10px] text-indigo-600 hover:text-indigo-800 mt-1 font-medium"
                      >
                        {isExpanded ? t('pic.showLess') : t('pic.showMore')}
                      </button>
                    </td>

                    {/* Code Status */}
                    <td className="py-3 px-4">
                      <Badge>{translateStatus(item.codeStatus)}</Badge>
                      {isStopPo && (
                        <div className="text-[10px] text-red-600 mt-1 font-semibold">
                          {language === 'vi' ? 'Ngưng dùng > 730 ngày' : 'Inactive 730+ Days'}
                        </div>
                      )}
                    </td>

                    {/* Price Status */}
                    <td className="py-3 px-4">
                      <Badge>{translateStatus(item.priceStatus)}</Badge>
                      <div className="text-[11px] font-semibold text-slate-800 mt-1">
                        ${item.unitPrice} / {item.unit}
                      </div>
                    </td>

                    {/* Interlock Status */}
                    <td className="py-3 px-4">
                      <Badge>{item.interlockStatus}</Badge>
                      {item.availableStock > 0 && (
                        <div className="text-[10px] text-amber-700 mt-1">
                          {item.stockLocation || (language === 'vi' ? 'Tồn kho khả dụng' : 'Warehouse Stock')}
                        </div>
                      )}
                    </td>

                    {/* Contextual Row Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex flex-col items-end gap-1.5">
                        {/* Context Action 1: If Stop PO (2 Years No Use) */}
                        {isStopPo && (
                          <button
                            onClick={() => requestActiveCode(item.id)}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded font-semibold text-[11px] transition-colors flex items-center gap-1 shadow-2xs whitespace-nowrap"
                          >
                            <Mail className="w-3 h-3 text-amber-700" />
                            {t('pic.requestCodeActive')}
                          </button>
                        )}

                        {/* Context Action 2: If Need Revise */}
                        {isNeedRevise && (
                          <button
                            onClick={() => sendReviseEmail(item.id)}
                            className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded font-semibold text-[11px] transition-colors flex items-center gap-1 shadow-2xs whitespace-nowrap"
                          >
                            <Send className="w-3 h-3 text-red-600" />
                            {t('pic.sendReviseEmail')}
                          </button>
                        )}

                        {/* Context Action 3: Create Task for Requestor */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setTaskTargetItem(item);
                              setIsCreateTaskModalOpen(true);
                            }}
                            className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded text-[11px] font-medium transition-colors flex items-center gap-1"
                            title="Create Clarification Task for Requestor"
                          >
                            <MessageSquarePlus className="w-3.5 h-3.5 text-indigo-600" />
                            {t('pic.requestClarification')}
                          </button>

                          <button
                            onClick={() => advancePoStage(item.id, 'po_request')}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-[11px] font-semibold transition-colors flex items-center gap-1"
                            title="Approve & Send to PO Request"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            {language === 'vi' ? 'Duyệt PO' : 'Approve'}
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
