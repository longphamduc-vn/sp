import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import {
  Truck,
  Building,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Clock,
  DollarSign
} from 'lucide-react';

export function PoDetailModal() {
  const {
    selectedPoDetail,
    setSelectedPoDetail,
    advancePoStage,
    addToast
  } = useApp();

  if (!selectedPoDetail) return null;

  const item = selectedPoDetail;
  const isPriceRisk = item.priceRiskAlert || item.priceStatus?.includes('Price Risk');

  return (
    <Modal
      isOpen={!!selectedPoDetail}
      onClose={() => setSelectedPoDetail(null)}
      title={`PO Audit Inspector — ${item.poNumber || item.id}`}
      subtitle={`${item.name} (${item.id})`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4 text-xs">
        {/* Price Risk Alert Banner if active */}
        {isPriceRisk && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-red-900 uppercase tracking-wide">
                Price Volatility Alert (Mất Giá Alert)
              </span>
              <p className="text-red-700 mt-0.5 leading-snug">
                Unit price shifted from ${item.previousPrice || 150} to ${item.unitPrice} (+
                {Math.round(((item.unitPrice - (item.previousPrice || 150)) / (item.previousPrice || 150)) * 100)}%).
                Variance requires Purchaser reconciliation before PO Receiving release.
              </p>
            </div>
          </div>
        )}

        {/* Primary Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
              Current Stage
            </span>
            <div className="mt-1">
              <Badge>{item.status}</Badge>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
              Assigned Line
            </span>
            <strong className="text-slate-900 mt-1 block">{item.line}</strong>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
              Requestor
            </span>
            <span className="text-slate-800 mt-1 block truncate">
              {item.requestor}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
              Vendor Supplier
            </span>
            <strong className="text-slate-900 mt-1 block">{item.vendor}</strong>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
              Quantity / Unit
            </span>
            <strong className="text-slate-900 mt-1 block font-mono">
              {item.requestedQty} {item.unit}
            </strong>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
              Total Order Value
            </span>
            <strong className="text-slate-900 mt-1 block font-mono">
              ${(item.requestedQty * item.unitPrice).toFixed(2)}
            </strong>
          </div>
        </div>

        {/* Technical Specs */}
        <div>
          <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
            Master EMS Specification
          </span>
          <p className="mt-1 p-2.5 bg-white border border-slate-200 rounded text-slate-700 leading-relaxed font-mono text-[11px]">
            {item.specs}
          </p>
        </div>

        {/* Justification History */}
        <div>
          <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
            Calculation Justification Log
          </span>
          <div className="mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-700 leading-relaxed">
            {item.logic}
          </div>
        </div>

        {/* Shipment Tracking Progression */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px] block mb-2">
            Milestone Audit Trail
          </span>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Target System Requisition Registered ({item.requestDate})</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>PIC Master Code & Specification Validated</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <span className="w-3.5 h-3.5 rounded-full border border-indigo-600 flex items-center justify-center text-[9px] font-bold text-indigo-600">
                •
              </span>
              <span>PO Generated ({item.poNumber || 'PO-8801'}) with Supplier Confirmed Delivery</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setSelectedPoDetail(null)}
            className="px-3.5 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {item.stage === 'po_request' && (
              <button
                onClick={() => {
                  advancePoStage(item.id, 'po_standby');
                  setSelectedPoDetail(null);
                }}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow-2xs"
              >
                Send to PO Standby →
              </button>
            )}
            {item.stage === 'po_standby' && (
              <button
                onClick={() => {
                  advancePoStage(item.id, 'po_remained');
                  setSelectedPoDetail(null);
                }}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-2xs"
              >
                Issue PO (PO Remained) →
              </button>
            )}
            {item.stage === 'po_remained' && (
              <button
                onClick={() => {
                  advancePoStage(item.id, 'po_receiving');
                  setSelectedPoDetail(null);
                }}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-2xs"
              >
                Receive at Gate Dock →
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
