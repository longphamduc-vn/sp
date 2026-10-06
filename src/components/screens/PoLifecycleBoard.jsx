import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import {
  Truck,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  AlertTriangle,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  ShieldAlert,
  Info
} from 'lucide-react';

export function PoLifecycleBoard() {
  const {
    filteredItems,
    advancePoStage,
    setSelectedPoDetail,
    addToast
  } = useApp();

  const stages = [
    {
      id: 'po_request',
      title: '1. PO Request',
      subtitle: 'Target System Requirement Validation',
      accentColor: 'border-t-blue-500',
      badgeColor: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'po_standby',
      title: '2. PO Standby',
      subtitle: 'Held for Budget & Price Risk Clearance',
      accentColor: 'border-t-amber-500',
      badgeColor: 'bg-amber-100 text-amber-700'
    },
    {
      id: 'po_remained',
      title: '3. PO Remained',
      subtitle: 'PO Issued — Tracking Split Shipments',
      accentColor: 'border-t-indigo-600',
      badgeColor: 'bg-indigo-100 text-indigo-700'
    },
    {
      id: 'po_receiving',
      title: '4. PO Receiving',
      subtitle: 'Arrived at Gate Dock — Pending QC',
      accentColor: 'border-t-emerald-500',
      badgeColor: 'bg-emerald-100 text-emerald-700'
    }
  ];

  // Helper to get items in stage
  const getItemsByStage = (stageId) => {
    return filteredItems.filter((i) => {
      if (stageId === 'po_request') {
        return i.stage === 'po_request' || i.status === 'PO Request';
      }
      if (stageId === 'po_standby') {
        return i.stage === 'po_standby' || i.status === 'PO Standby';
      }
      if (stageId === 'po_remained') {
        return i.stage === 'po_remained' || i.status === 'PO Remained';
      }
      if (stageId === 'po_receiving') {
        return i.stage === 'po_receiving' || i.status === 'PO Receiving';
      }
      return false;
    });
  };

  const stageOrder = ['po_request', 'po_standby', 'po_remained', 'po_receiving'];

  const handleAdvance = (e, item, currentStageId) => {
    e.stopPropagation();
    const currentIndex = stageOrder.indexOf(currentStageId);
    if (currentIndex < stageOrder.length - 1) {
      const nextStage = stageOrder[currentIndex + 1];
      advancePoStage(item.id, nextStage);
    }
  };

  const handleRollback = (e, item, currentStageId) => {
    e.stopPropagation();
    const currentIndex = stageOrder.indexOf(currentStageId);
    if (currentIndex > 0) {
      const prevStage = stageOrder[currentIndex - 1];
      advancePoStage(item.id, prevStage);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              PO Lifecycle Board (4-Stage Procurement Pipeline)
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
              Active Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Trace spare part purchase orders across Target System checking, budget standby hold, open order delivery tracking, and receiving dock QC inspection.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
          <Info className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          <span>Click cards for full audit record, or use arrow buttons to advance stages.</span>
        </div>
      </div>

      {/* 4-Column Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
        {stages.map((stage, colIndex) => {
          const stageItems = getItemsByStage(stage.id);

          return (
            <div
              key={stage.id}
              className={`bg-slate-100/70 rounded-xl border border-slate-200/80 p-3.5 flex flex-col min-h-[580px] shadow-2xs border-t-4 ${stage.accentColor}`}
            >
              {/* Column Header */}
              <div className="pb-3 border-b border-slate-200/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      {stage.title}
                    </h3>
                    <span className={`text-[11px] font-mono font-bold px-1.5 py-0.2 rounded-full ${stage.badgeColor}`}>
                      {stageItems.length}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {stage.subtitle}
                  </p>
                </div>
              </div>

              {/* Card List */}
              <div className="mt-3 space-y-3 flex-1 overflow-y-auto">
                {stageItems.map((item) => {
                  const hasPriceRisk =
                    item.priceRiskAlert || item.priceStatus.includes('Price Risk');

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedPoDetail(item)}
                      className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-subtle hover:shadow-card transition-all cursor-pointer group hover:-translate-y-0.5"
                    >
                      {/* PO Number & Risk Badge */}
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          {item.poNumber || 'PO-DRAFT'}
                        </span>
                        {hasPriceRisk && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-red-100 text-red-700 rounded-full border border-red-200">
                            🔴 Mất Giá / Price Risk
                          </span>
                        )}
                      </div>

                      {/* Part Name & ID */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-10 h-10 rounded bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
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
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors truncate">
                            {item.name}
                          </h4>
                          <span className="text-[10px] font-mono text-indigo-600 font-semibold">
                            {item.id}
                          </span>
                          <p className="text-[10px] text-slate-500 truncate">
                            {item.line}
                          </p>
                        </div>
                      </div>

                      {/* Vendor & Due Date */}
                      <div className="mt-3 pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-600">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Vendor:</span>
                          <span className="font-medium text-slate-800 truncate max-w-[120px]">
                            {item.vendor || 'Authorized Distributor'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Need-by:</span>
                          <span className="font-medium text-slate-800 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {item.needByDate}
                          </span>
                        </div>
                      </div>

                      {/* Stage Specific Info */}
                      {stage.id === 'po_remained' && (
                        <div className="mt-2 p-2 bg-indigo-50/60 rounded border border-indigo-100 text-[11px]">
                          <div className="flex justify-between text-indigo-900 font-medium">
                            <span>Delivered:</span>
                            <span className="font-bold">{item.deliveredQty || 0} / {item.requestedQty} {item.unit}</span>
                          </div>
                          <div className="flex justify-between text-indigo-700 font-semibold mt-0.5">
                            <span>Remaining:</span>
                            <span className="font-bold text-amber-600">{item.remainingQty || item.requestedQty} {item.unit}</span>
                          </div>
                        </div>
                      )}

                      {stage.id === 'po_receiving' && (
                        <div className="mt-2 p-2 bg-emerald-50 rounded border border-emerald-100 text-[11px] flex items-center justify-between">
                          <span className="text-emerald-800 font-medium">Gate 2 Dock:</span>
                          {item.qcPassed ? (
                            <span className="font-bold text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> QC Passed
                            </span>
                          ) : (
                            <span className="font-bold text-amber-700 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Awaiting QC
                            </span>
                          )}
                        </div>
                      )}

                      {/* Card Stage Movement Controls */}
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          {colIndex > 0 ? (
                            <button
                              onClick={(e) => handleRollback(e, item, stage.id)}
                              className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded transition-colors"
                              title="Move back to previous stage"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <span className="w-3.5 h-3.5 inline-block" />
                          )}
                        </div>

                        <span className="text-[10px] text-slate-400 font-mono">
                          ${(item.requestedQty * item.unitPrice).toFixed(0)} Total
                        </span>

                        <div>
                          {colIndex < stages.length - 1 ? (
                            <button
                              onClick={(e) => handleAdvance(e, item, stage.id)}
                              className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded text-[10px] font-bold flex items-center gap-1 transition-colors"
                              title="Advance to next stage"
                            >
                              Advance <ArrowRight className="w-3 h-3" />
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToast("Item at Receiving", "Item ready for Warehouse QC Inspection.", "info");
                              }}
                              className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold"
                            >
                              At Gate
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {stageItems.length === 0 && (
                  <div className="h-40 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400 text-xs p-4 text-center">
                    <span>No PO items in this stage</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
