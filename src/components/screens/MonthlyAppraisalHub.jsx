import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import {
  Download,
  FileCheck2,
  DollarSign,
  AlertCircle,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Building2,
  Paperclip,
  UploadCloud,
  FileText
} from 'lucide-react';

export function MonthlyAppraisalHub() {
  const {
    appraisal,
    exportExcelReport,
    setIsManagementModalOpen,
    filteredItems,
    t,
    language,
    translateCategory,
    translateStatus
  } = useApp();

  const totalPlan = appraisal.totalBudgetPlan || 45000;
  const actualCost = appraisal.actualRequestedCost || 38420;
  const percentUtilized = Math.min(100, Math.round((actualCost / totalPlan) * 100));

  const isOverBudget = actualCost > totalPlan;

  return (
    <div className="space-y-6">
      {/* Header & Main Management Action Controls */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {t('appraisal.title')}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
              {t('appraisal.cycleTitle')}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            {t('appraisal.subtitle')}
          </p>
        </div>

        {/* Management Controls Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={exportExcelReport}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            📥 {t('appraisal.exportExcelBtn')}
          </button>

          <button
            onClick={() => setIsManagementModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
          >
            <FileCheck2 className="w-4 h-4" />
            📝 {t('appraisal.inputResultBtn')}
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* KPI 1: Budget Progress */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('appraisal.kpiTotalBudget')}
            </span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">
              ${actualCost.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              / ${totalPlan.toLocaleString()}
            </span>
          </div>

          {/* Visual Progress Bar */}
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 font-medium">{t('appraisal.kpiBudgetConsumed')}</span>
              <span
                className={`font-mono font-bold ${
                  percentUtilized > 90 ? 'text-red-600' : 'text-indigo-600'
                }`}
              >
                {percentUtilized}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  percentUtilized > 90
                    ? 'bg-gradient-to-r from-amber-500 to-red-500'
                    : 'bg-gradient-to-r from-indigo-500 to-indigo-600'
                }`}
                style={{ width: `${percentUtilized}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
              <span>{language === 'vi' ? 'Còn lại' : 'Remaining'}: ${(totalPlan - actualCost).toLocaleString()}</span>
              <span>{language === 'vi' ? 'Hạn mức' : 'Ceiling'}: $45,000</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Over-budget Flagged Items */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('appraisal.kpiOverbudgetItems')}
            </span>
            <div className="p-2 rounded-lg bg-red-50 text-red-600">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-red-600 font-mono">
              {appraisal.overbudgetCount}
            </span>
            <span className="text-xs font-semibold text-red-600/80">
              {language === 'vi' ? 'Chuyền phát sinh biến động chi phí' : 'Lines Triggering Cost Variance'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            {language === 'vi'
              ? 'Chuyền Sơn phủ Line 01 vượt hạn mức định kỳ +12.5% do thay thế biến tần & vòng bi sự cố khẩn cấp.'
              : 'Coating Line 01 exceeded planned ceiling by +12.5% due to inverter & bearing emergency spares.'}
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-red-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {language === 'vi' ? 'Yêu cầu Hội đồng Điều hành ký duyệt' : 'Requires Executive Committee Sign-off'}
          </div>
        </div>

        {/* KPI 3: Management Appraisal Result */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('appraisal.kpiReviewStatus')}
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-lg font-bold text-slate-900">
              {appraisal.reviewStatus === 'Pending Management Sign-off'
                ? t('appraisal.pendingSignOff')
                : appraisal.reviewStatus}
            </div>
            {appraisal.meetingMinutesFile ? (
              <div className="mt-2 p-2 bg-slate-50 rounded border border-slate-200 flex items-center gap-2 text-xs text-indigo-700">
                <Paperclip className="w-3.5 h-3.5" />
                <span className="truncate font-mono font-medium">
                  {appraisal.meetingMinutesFile}
                </span>
              </div>
            ) : (
              <p className="text-xs text-slate-400 mt-1">
                {language === 'vi'
                  ? 'Chưa đính kèm biên bản đã ký. Nhấp "Nhập Kết Quả Ký Duyệt" để tải lên.'
                  : 'No signed minutes attached yet. Click "Input Management Result" to upload.'}
              </p>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>{language === 'vi' ? 'Chủ trì: Giám đốc Khối Sản xuất' : 'Executive Chair: Production Director'}</span>
            <span className="text-indigo-600 font-medium">{language === 'vi' ? 'Đã đủ biểu quyết' : 'Quorum Met'}</span>
          </div>
        </div>
      </div>

      {/* Department Budget Breakdown Cards */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-subtle">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-indigo-600" />
          {t('appraisal.departmentBreakdown')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {appraisal.departments.map((dept) => {
            const pct = Math.round((dept.requested / dept.allocated) * 100);
            const isDeptOver = dept.requested > dept.allocated;

            return (
              <div
                key={dept.name}
                className="p-4 rounded-lg bg-slate-50/70 border border-slate-200"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-800">
                    {dept.name}
                  </span>
                  <Badge variant={isDeptOver ? 'danger' : 'success'}>
                    {isDeptOver
                      ? (language === 'vi' ? 'Vượt định mức (+12.5%)' : dept.status)
                      : (language === 'vi' ? 'Trong định mức' : dept.status)}
                  </Badge>
                </div>

                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-sm font-bold font-mono text-slate-900">
                    ${dept.requested.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {language === 'vi' ? 'Kế hoạch:' : 'Plan:'} ${dept.allocated.toLocaleString()}
                  </span>
                </div>

                <div className="mt-2 w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isDeptOver ? 'bg-red-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{dept.count} {language === 'vi' ? 'Yêu cầu' : 'Requisitions'}</span>
                  <span>{pct}% {language === 'vi' ? 'đã dùng' : 'utilized'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Appraisal Items Detail Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {t('appraisal.itemsRequiringAppraisal')}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'vi'
                ? 'Các linh kiện nằm trong diện đánh giá mua sắm tháng hiện tại'
                : 'Items included in current monthly procurement evaluation'}
            </p>
          </div>
          <button
            onClick={exportExcelReport}
            className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            <FileSpreadsheet className="w-4 h-4" />
            {language === 'vi' ? 'Tải toàn bộ bảng tính (.csv)' : 'Download Complete Ledger (.csv)'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/60 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">{t('common.itemCode')}</th>
                <th className="py-3 px-4">{t('common.itemName')}</th>
                <th className="py-3 px-4">{t('common.line')}</th>
                <th className="py-3 px-4">{t('common.qty')}</th>
                <th className="py-3 px-4">{t('common.unitPrice')}</th>
                <th className="py-3 px-4">{t('common.totalCost')}</th>
                <th className="py-3 px-4">{language === 'vi' ? 'Đánh giá ngân sách' : 'Budget Impact'}</th>
                <th className="py-3 px-4">{t('common.status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => {
                const totalItemCost = item.requestedQty * item.unitPrice;
                const isOverItem = item.priceRiskAlert || item.unitPrice > 200;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                      {item.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{item.name}</div>
                      <div className="text-[10px] text-slate-400">{translateCategory(item.category)}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{item.line}</td>
                    <td className="py-3 px-4 font-mono">
                      {item.requestedQty} {item.unit}
                    </td>
                    <td className="py-3 px-4 font-mono">${item.unitPrice}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      ${totalItemCost.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      {isOverItem ? (
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-red-100 text-red-700">
                          {language === 'vi' ? '🔴 Cảnh báo lệch giá' : '🔴 Variance Alert'}
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-emerald-50 text-emerald-700">
                          {language === 'vi' ? 'Trong chuẩn' : 'Within Standard'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge>{translateStatus(item.status)}</Badge>
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
