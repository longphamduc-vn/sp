import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import {
  PackageCheck,
  Truck,
  AlertTriangle,
  CheckCircle,
  ShieldCheck,
  Layers,
  History
} from 'lucide-react';

export function WarehouseWoHub() {
  const {
    items,
    workOrders,
    passQcAndStockIn,
    issueWorkOrderStock,
    addToast,
    t,
    language,
    translateStatus
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('receipt'); // 'receipt' | 'issue'

  // Goods Receipt items (items in receiving or arrived)
  const receivingItems = items.filter(
    (i) => i.stage === 'po_receiving' || i.status === 'PO Receiving' || i.qcPassed
  );

  // Work Order Form State
  const [woCode, setWoCode] = useState('WO-2026-8822');
  const [targetItemCode, setTargetItemCode] = useState('SP-2024-C01');
  const [woLine, setWoLine] = useState('Line 02 - SMT');
  const [requestedQty, setRequestedQty] = useState(6);
  const [actualIssuedQty, setActualIssuedQty] = useState(4); // default simulates mismatch
  const [issueReason, setIssueReason] = useState(
    language === 'vi'
      ? 'Thay thế hỏng hóc định chuẩn bộ cấp liệu Chuyền 02'
      : 'Line 02 feeder calibration breakdown replacement'
  );

  const selectedItemData = items.find((i) => i.id === targetItemCode);

  const isMismatch = Number(actualIssuedQty) < Number(requestedQty);
  const missingCount = Number(requestedQty) - Number(actualIssuedQty);

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    if (!targetItemCode) {
      addToast(t('warehouse.toastMissingItem'), t('warehouse.toastMissingItemDesc'), 'warning');
      return;
    }

    issueWorkOrderStock({
      woCode,
      targetItemCode,
      itemName: selectedItemData ? selectedItemData.name : `Component (${targetItemCode})`,
      line: woLine,
      requestedQty,
      issuedQty: actualIssuedQty,
      issueReason
    });

    // Reset with next WO#
    setWoCode(`WO-2026-${Math.floor(8823 + Math.random() * 50)}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {t('warehouse.title')}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
              {t('warehouse.gateTitle')}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            {t('warehouse.subtitle')}
          </p>
        </div>

        {/* Sub-tab navigation switch */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab('receipt')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${
              activeSubTab === 'receipt'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-4 h-4" />
            {t('warehouse.tabReceipt')}
          </button>
          <button
            onClick={() => setActiveSubTab('issue')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${
              activeSubTab === 'issue'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            {t('warehouse.tabIssue')}
          </button>
        </div>
      </div>

      {/* TAB 1: GOODS RECEIPT (NHẬP KHO) */}
      {activeSubTab === 'receipt' && (
        <div className="space-y-5 animate-fade-in">
          <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {t('warehouse.gateDocksideTitle')}
                </h3>
                <p className="text-xs text-slate-500">
                  {t('warehouse.gateDocksideDesc')}
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                {t('warehouse.dockSensorActive')}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/60 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">{t('warehouse.thPoItem')}</th>
                    <th className="py-3 px-4">{t('warehouse.thVendorSlip')}</th>
                    <th className="py-3 px-4">{t('warehouse.thArrivedQty')}</th>
                    <th className="py-3 px-4">{t('warehouse.thQcStatus')}</th>
                    <th className="py-3 px-4">{t('warehouse.thWarehouseStatus')}</th>
                    <th className="py-3 px-4 text-right">{t('warehouse.thAction')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {receivingItems.map((item) => {
                    const needsQc = item.qcRequired && !item.qcPassed;

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80">
                        {/* PO & Item */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Layers className="w-4 h-4 text-slate-400 m-auto mt-2" />
                              )}
                            </div>
                            <div>
                              <div className="font-mono font-bold text-indigo-600">
                                {item.poNumber || 'PO-8790'}
                              </div>
                              <div className="font-semibold text-slate-900 leading-tight">
                                {item.name}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                {item.id} • {item.line}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Vendor */}
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-800">{item.vendor}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Bill: BL-2026-{item.id.replace('SP-', '')}
                          </div>
                        </td>

                        {/* Qty */}
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm">
                          {item.requestedQty} {item.unit}
                        </td>

                        {/* QC Mandate Flag */}
                        <td className="py-3.5 px-4">
                          {needsQc ? (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-bold animate-pulse-subtle">
                              <span className="text-sm">🚩</span>
                              {t('warehouse.qcPendingBadge')}
                            </div>
                          ) : item.qcPassed ? (
                            <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <CheckCircle className="w-3.5 h-3.5" />
                              {t('warehouse.qcPassedBadge')}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-500 font-medium">
                              {t('warehouse.standardReceiving')}
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <Badge>{translateStatus(item.status)}</Badge>
                          {item.qcPassed && (
                            <div className="text-[10px] text-emerald-600 mt-1 font-medium">
                              {t('warehouse.readyForWo')}
                            </div>
                          )}
                        </td>

                        {/* Action */}
                        <td className="py-3.5 px-4 text-right">
                          {needsQc ? (
                            <button
                              onClick={() => passQcAndStockIn(item.id)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5 ml-auto"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              {t('warehouse.passQcBtn')}
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                addToast(
                                  t('warehouse.toastInventoryVerified'),
                                  t('warehouse.toastInventoryVerifiedDesc', { id: item.id }),
                                  'info'
                                )
                              }
                              className="px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-xs font-medium cursor-default ml-auto"
                            >
                              {t('warehouse.alreadyStocked')}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WORK ORDER STOCK ISSUE (XUẤT KHO THEO WO) */}
      {activeSubTab === 'issue' && (
        <div className="space-y-6 animate-fade-in">
          {/* Form Card */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-subtle">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
              <PackageCheck className="w-5 h-5 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                {t('warehouse.issueFormTitle')}
              </h2>
            </div>

            <form onSubmit={handleIssueSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* WO Code */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t('warehouse.woCodeLabel')}
                  </label>
                  <input
                    type="text"
                    value={woCode}
                    onChange={(e) => setWoCode(e.target.value)}
                    placeholder="WO-2026-XXXX"
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>

                {/* Target Spare Part Code */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t('warehouse.targetItemLabel')}
                  </label>
                  <select
                    value={targetItemCode}
                    onChange={(e) => {
                      setTargetItemCode(e.target.value);
                      const it = items.find((i) => i.id === e.target.value);
                      if (it) {
                        setWoLine(it.line);
                        setRequestedQty(it.requestedQty || 5);
                      }
                    }}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  >
                    {items.map((it) => (
                      <option key={it.id} value={it.id}>
                        {it.id} - {it.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Line */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t('warehouse.destinationLineLabel')}
                  </label>
                  <input
                    type="text"
                    value={woLine}
                    onChange={(e) => setWoLine(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Issue Cost */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t('warehouse.calculatedCostLabel')}
                  </label>
                  <div className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-800">
                    ${((selectedItemData?.unitPrice || 45) * Number(actualIssuedQty)).toFixed(2)} USD
                  </div>
                </div>
              </div>

              {/* Quantities & Issue Reason */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t('warehouse.requestedQtyLabel')}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={requestedQty}
                    onChange={(e) => setRequestedQty(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      {t('warehouse.actualIssuedQtyLabel')}
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {t('warehouse.physicalDispense')}
                    </span>
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={actualIssuedQty}
                    onChange={(e) => setActualIssuedQty(parseInt(e.target.value) || 1)}
                    className={`w-full bg-[#F8FAFC] border rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none ${
                      isMismatch ? 'border-amber-400 bg-amber-50/30' : 'border-slate-200'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t('warehouse.issueReasonLabel')}
                  </label>
                  <input
                    type="text"
                    value={issueReason}
                    onChange={(e) => setIssueReason(e.target.value)}
                    placeholder={t('warehouse.issueReasonPlaceholder')}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* AUTOMATIC ALERT SIMULATION: If Quantity Issued < Requested Quantity */}
              {isMismatch && (
                <div className="mt-3 p-4 rounded-xl bg-amber-50/80 border-2 border-amber-300 animate-fade-in">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                        {t('warehouse.mismatchTitle', { count: missingCount })}
                      </h4>
                      <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                        {language === 'vi' ? (
                          <>
                            Yêu cầu ban đầu là <strong>{requestedQty} cái</strong>, nhưng chỉ xuất <strong>{actualIssuedQty} cái</strong>. Có thể đã được ca bảo trì khác xuất hoặc do lệch tồn kho thực tế.
                          </>
                        ) : (
                          <>
                            Original request was for <strong>{requestedQty} pcs</strong>, but only <strong>{actualIssuedQty} pcs</strong> are being dispensed. Likely issued by another maintenance shift or bin count discrepancy.
                          </>
                        )}
                      </p>
                      <div className="mt-2 text-[11px] font-semibold text-amber-900 bg-amber-100/70 px-2.5 py-1 rounded inline-block">
                        {t('warehouse.mismatchAudit', { woCode })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
                >
                  <PackageCheck className="w-4 h-4" />
                  {t('warehouse.issueStockBtn')}
                </button>
              </div>
            </form>
          </div>

          {/* Work Order Issue Ledger History */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  {t('warehouse.workOrderLogTitle')}
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {t('warehouse.loggedIssuesCount', { count: workOrders.length })}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/60 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">{t('warehouse.thWoCode')}</th>
                    <th className="py-3 px-4">{t('warehouse.thWoItem')}</th>
                    <th className="py-3 px-4">{t('warehouse.thDestinationLine')}</th>
                    <th className="py-3 px-4">{t('warehouse.thRequestedVsIssued')}</th>
                    <th className="py-3 px-4">{t('warehouse.thCost')}</th>
                    <th className="py-3 px-4">{t('warehouse.thIssuedBy')}</th>
                    <th className="py-3 px-4">{t('warehouse.thWoStatus')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {workOrders.map((wo, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                        {wo.woCode}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{wo.itemName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {wo.targetItemCode}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">{wo.line}</td>
                      <td className="py-3.5 px-4 font-mono font-bold">
                        <span className={wo.issuedQty < wo.requestedQty ? 'text-amber-600' : 'text-emerald-600'}>
                          {wo.issuedQty}
                        </span>{' '}
                        / {wo.requestedQty} {language === 'vi' ? 'cái' : 'pcs'}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-800">
                        {wo.issueCost}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">{wo.issuedBy}</div>
                        <div className="text-[10px] text-slate-400">{wo.issueDate}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={wo.mismatchWarning ? 'warning' : 'success'}>
                          {translateStatus(wo.status)}
                        </Badge>
                        {wo.mismatchWarning && (
                          <div className="text-[10px] text-amber-700 mt-1 max-w-xs leading-snug">
                            {language === 'vi'
                              ? '⚠️ Lệch số lượng xuất: Thiếu 2 cái so với yêu cầu ban đầu (Có thể do ca khác đã xuất).'
                              : wo.mismatchWarning}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
