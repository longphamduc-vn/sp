import React from 'react';

/**
 * Enterprise Pill Badge adhering strictly to spec:
 * - Active / Approved / Pass QC: Soft Green (#10B981, BG: #ECFDF5)
 * - Warning / Pending / Interlock / Standby: Soft Orange (#F59E0B, BG: #FEF3C7)
 * - Stop PO / Cancelled / Mất Giá (Price Risk) / Overdue: Soft Red (#EF4444, BG: #FEF2F2)
 * - Info / Processing / In-Review: Soft Blue (#3B82F6, BG: #EFF6FF)
 */
export function Badge({ children, variant, className = '' }) {
  let resolvedVariant = variant;

  if (!resolvedVariant && typeof children === 'string') {
    const text = children.toLowerCase();
    if (
      text.includes('active') ||
      text.includes('approved') ||
      text.includes('pass qc') ||
      text.includes('passed') ||
      text.includes('ok') ||
      text.includes('complete') ||
      text.includes('fully issued')
    ) {
      resolvedVariant = 'success';
    } else if (
      text.includes('warning') ||
      text.includes('pending') ||
      text.includes('interlock') ||
      text.includes('standby') ||
      text.includes('unquoted') ||
      text.includes('stock found') ||
      text.includes('partial')
    ) {
      resolvedVariant = 'warning';
    } else if (
      text.includes('stop po') ||
      text.includes('cancel') ||
      text.includes('mất giá') ||
      text.includes('risk') ||
      text.includes('overdue') ||
      text.includes('reject') ||
      text.includes('mismatch') ||
      text.includes('over-budget')
    ) {
      resolvedVariant = 'danger';
    } else {
      resolvedVariant = 'info';
    }
  }

  const styles = {
    success: 'bg-[#ECFDF5] text-[#10B981] border border-[#10B981]/20',
    warning: 'bg-[#FEF3C7] text-[#D97706] border border-[#F59E0B]/30',
    danger: 'bg-[#FEF2F2] text-[#EF4444] border border-[#EF4444]/25',
    info: 'bg-[#EFF6FF] text-[#3B82F6] border border-[#3B82F6]/25',
    neutral: 'bg-slate-100 text-slate-600 border border-slate-200'
  };

  const styleClass = styles[resolvedVariant] || styles.info;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${styleClass} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {children}
    </span>
  );
}
