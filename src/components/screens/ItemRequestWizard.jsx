import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EMS_CATALOG } from '../../data/mockData';
import {
  FilePlus2,
  Cpu,
  Search,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldAlert,
  Info,
  Package,
  Clock,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { Badge } from '../common/Badge';

export function ItemRequestWizard() {
  const { addItemRequest, setActiveTab, addToast } = useApp();

  // Form State
  const [purchaseReason, setPurchaseReason] = useState('Routine Maintenance');
  const [category, setCategory] = useState('Electrical');
  const [process, setProcess] = useState('SMT High-Speed Mounter');
  const [lineNumber, setLineNumber] = useState('Line 02 - SMT');

  const [logicRationale, setLogicRationale] = useState('');
  const [requestedQty, setRequestedQty] = useState(5);
  const [unit, setUnit] = useState('Pcs');
  const [expectedDate, setExpectedDate] = useState('2026-10-25');

  // EMS Fetcher State
  const [itemCodeInput, setItemCodeInput] = useState('SP-2024-M08');
  const [isFetchingEms, setIsFetchingEms] = useState(false);
  const [fetchedEmsData, setFetchedEmsData] = useState({
    code: 'SP-2024-M08',
    name: 'SMC Air Cylinder CDQ2B',
    specs: 'Compact Cylinder, Double Acting, Single Rod, Bore 32mm, Stroke 25mm, Magnet built-in',
    moq: 2,
    leadTimeDays: 21,
    unitPrice: 92,
    stockAvailable: 5,
    stockLocation: 'Warehouse A (Bin A-04)',
    status: 'Stop PO (2 Years No Use)',
    category: 'Mechanical',
    image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=400&h=300&q=80'
  });

  // Interlock State
  const [bypassJustification, setBypassJustification] = useState('');
  const [isBypassChecked, setIsBypassChecked] = useState(false);

  const handleFetchEMS = (overrideCode) => {
    const code = (overrideCode || itemCodeInput).trim().toUpperCase();
    if (!code) return;

    setIsFetchingEms(true);
    setTimeout(() => {
      setIsFetchingEms(false);
      if (EMS_CATALOG[code]) {
        const item = EMS_CATALOG[code];
        setFetchedEmsData({
          code,
          ...item,
          image: code.includes('C01')
            ? 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&h=300&q=80'
            : code.includes('E12')
            ? 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&h=300&q=80'
            : code.includes('K04')
            ? 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&h=300&q=80'
            : 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=400&h=300&q=80'
        });
        setCategory(item.category || category);
        addToast("EMS Catalog Synced", `Loaded active specifications for ${code}.`, "info");
      } else {
        // Fallback generator for test custom codes
        setFetchedEmsData({
          code,
          name: `Industrial Component (${code})`,
          specs: `Custom factory component cataloged under EMS spec Rev 2.4. Operating voltage 24VDC.`,
          moq: 1,
          leadTimeDays: 14,
          unitPrice: 110,
          stockAvailable: 0,
          stockLocation: 'None',
          status: 'Active',
          category,
          image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&h=300&q=80'
        });
        addToast("EMS Record Generated", `Fetched general master spec for ${code}.`, "info");
      }
    }, 450);
  };

  const hasInterlock = fetchedEmsData && fetchedEmsData.stockAvailable > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!logicRationale.trim()) {
      addToast("Validation Warning", "Please provide a logic explanation / calculation rationale.", "warning");
      return;
    }

    if (hasInterlock && !isBypassChecked) {
      addToast(
        "Interlock Violation Blocked",
        "Stock is currently available in the warehouse! Check the bypass box or create a Material Issue request instead.",
        "danger"
      );
      return;
    }

    const newItem = {
      id: fetchedEmsData ? fetchedEmsData.code : `SP-2024-${Math.floor(100 + Math.random() * 900)}`,
      name: fetchedEmsData ? fetchedEmsData.name : `Custom Component (${itemCodeInput})`,
      category,
      reason: purchaseReason,
      process,
      line: lineNumber,
      logic: logicRationale + (isBypassChecked ? ` [Leader Override]: ${bypassJustification}` : ''),
      codeStatus: fetchedEmsData ? fetchedEmsData.status : "Active",
      priceStatus: "Quoted",
      unitPrice: fetchedEmsData ? fetchedEmsData.unitPrice : 75,
      previousPrice: fetchedEmsData ? fetchedEmsData.unitPrice : 75,
      interlockStatus: hasInterlock ? `⚠️ ${fetchedEmsData.stockAvailable} pcs Stock Found` : "OK",
      availableStock: fetchedEmsData ? fetchedEmsData.stockAvailable : 0,
      requestedQty: Number(requestedQty),
      unit,
      needByDate: expectedDate,
      leadTimeDays: fetchedEmsData ? fetchedEmsData.leadTimeDays : 14,
      moq: fetchedEmsData ? fetchedEmsData.moq : 1,
      image: fetchedEmsData?.image,
      specs: fetchedEmsData?.specs || "Industrial factory part"
    };

    addItemRequest(newItem);
    setActiveTab('workspace');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Spare Part Registration Wizard
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
              Form 102-EMS
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Register new spare parts, verify master EMS item parameters, run live warehouse interlock detection, and route request to PIC Review.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('workspace')}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Cancel & Return
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Classification & Location */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-subtle">
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Classification & Factory Location
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Purchase Reason */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Purchase Reason *
              </label>
              <select
                value={purchaseReason}
                onChange={(e) => setPurchaseReason(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              >
                <option value="Routine Maintenance">Routine Maintenance</option>
                <option value="Breakdown Replacement">Breakdown Replacement</option>
                <option value="Line Improvement">Line Improvement</option>
                <option value="Safety Standard Compliance">Safety Standard Compliance</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              >
                <option value="Mechanical">Mechanical</option>
                <option value="Electrical">Electrical</option>
                <option value="Pneumatic">Pneumatic</option>
                <option value="Consumables">Consumables</option>
                <option value="Hydraulics">Hydraulics</option>
              </select>
            </div>

            {/* Process */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Target Process *
              </label>
              <input
                type="text"
                value={process}
                onChange={(e) => setProcess(e.target.value)}
                placeholder="e.g. SMT Mounting, Final Assembly"
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            {/* Line Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Line Number *
              </label>
              <select
                value={lineNumber}
                onChange={(e) => setLineNumber(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              >
                <option value="Line 01 - Coating">Line 01 - Coating</option>
                <option value="Line 02 - SMT">Line 02 - SMT</option>
                <option value="Line 03 - SMT">Line 03 - SMT</option>
                <option value="Line 04 - Packaging">Line 04 - Packaging</option>
                <option value="Line 05 - Assembly">Line 05 - Assembly</option>
                <option value="Line 06 - Stamping">Line 06 - Stamping</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Logic & Quantity (Free-Text Logic) */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-subtle">
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Logic & Quantity Calculation Rationale
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Logic Textarea (2 cols) */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Logic Explanation / Calculation Rationale *
                </label>
                <span className="text-[11px] text-slate-400">
                  Required by PIC Code Master
                </span>
              </div>
              <textarea
                rows={4}
                value={logicRationale}
                onChange={(e) => setLogicRationale(e.target.value)}
                placeholder="Enter detailed calculation logic, machine frequency, or necessity (e.g. 6-month routine breakdown replacement cycle for component pickup verifier. Prevents false reject alarms on Station 4)..."
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-3 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 leading-relaxed font-sans"
              />
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] text-slate-500">Quick template:</span>
                <button
                  type="button"
                  onClick={() =>
                    setLogicRationale(
                      "Preventive 6-month overhaul cycle. Machine running time logged: 4,200 hrs. Component friction loss exceeds 0.08mm tolerance."
                    )
                  }
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  Preventive Overhaul
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setLogicRationale(
                      "Emergency breakdown replacement: Station 3 actuator failed to latch fixture causing 22 min line stoppage. Zero spares in line buffer."
                    )
                  }
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  Emergency Stoppage
                </button>
              </div>
            </div>

            {/* Quantity, Unit & Date (1 col) */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Quantity Requested *
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={1}
                    value={requestedQty}
                    onChange={(e) => setRequestedQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-24 bg-[#F8FAFC] border border-slate-200 rounded-lg px-2 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none"
                  >
                    <option value="Pcs">Pcs</option>
                    <option value="Set">Set</option>
                    <option value="Box">Box</option>
                    <option value="Roll">Roll</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Expected Date of Use *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Item Fetching Simulator (EMS Endpoint Mock) */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-subtle">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Item Fetching Simulator (EMS Master Catalog)
              </h2>
            </div>
            <span className="text-xs text-indigo-600 font-medium flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" />
              Mock Endpoint: /api/v2/ems/item-master
            </span>
          </div>

          {/* Search bar & quick simulation items */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={itemCodeInput}
                  onChange={(e) => setItemCodeInput(e.target.value)}
                  placeholder="Enter Item Code (e.g. SP-2024-M08, SP-2024-C01, SP-2024-E12)..."
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg pl-3 pr-8 py-2.5 text-xs font-mono font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
              <button
                type="button"
                onClick={() => handleFetchEMS()}
                disabled={isFetchingEms}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isFetchingEms ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Querying EMS...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Load EMS Details
                  </>
                )}
              </button>
            </div>

            {/* Quick Pill presets */}
            <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
              <span className="text-[11px] font-medium">Quick Test Codes:</span>
              {[
                { code: 'SP-2024-M08', note: 'Trigger Interlock (5 pcs in stock)' },
                { code: 'SP-2024-C01', note: 'Normal Active (0 stock)' },
                { code: 'SP-2024-E12', note: 'Price Risk item' },
                { code: 'SP-2024-B09', note: 'Stop PO (12 pcs in stock)' }
              ].map((p) => (
                <button
                  key={p.code}
                  type="button"
                  onClick={() => {
                    setItemCodeInput(p.code);
                    handleFetchEMS(p.code);
                  }}
                  className={`px-2 py-1 rounded text-[11px] font-mono border transition-all ${
                    itemCodeInput === p.code
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-bold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {p.code} <span className="text-[9px] opacity-75 font-sans">({p.note})</span>
                </button>
              ))}
            </div>

            {/* Simulated Result Preview Card */}
            {fetchedEmsData && (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 animate-fade-in">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="w-24 h-24 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <img
                      src={fetchedEmsData.image}
                      alt={fetchedEmsData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400">
                        Item Identification
                      </span>
                      <div className="font-mono font-bold text-indigo-600 text-sm mt-0.5">
                        {fetchedEmsData.code}
                      </div>
                      <p className="text-xs font-semibold text-slate-800 mt-0.5">
                        {fetchedEmsData.name}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400">
                        Technical Specs
                      </span>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed line-clamp-2">
                        {fetchedEmsData.specs}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400">
                        Order Constraints
                      </span>
                      <div className="text-xs text-slate-700 mt-0.5">
                        <strong>MOQ:</strong> {fetchedEmsData.moq} pcs
                      </div>
                      <div className="text-xs text-slate-700">
                        <strong>Lead Time:</strong> {fetchedEmsData.leadTimeDays} days
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400">
                        EMS Master Status
                      </span>
                      <div className="mt-1 flex items-center gap-1.5">
                        <Badge>{fetchedEmsData.status}</Badge>
                      </div>
                      <div className="text-xs text-slate-700 font-medium mt-1">
                        Est. Unit: ${fetchedEmsData.unitPrice}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Live Interlock Warning Card (Simulated Alert) */}
        {hasInterlock && (
          <div className="rounded-xl p-5 bg-amber-50/70 border-2 border-amber-300 shadow-sm animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-700 flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                    ⚠️ INTERLOCK DETECTED: Stock Available in Factory Warehouse
                  </h3>
                  <span className="px-2 py-0.2 text-[10px] font-bold rounded-full bg-amber-200 text-amber-900">
                    High Cost Efficiency Gate
                  </span>
                </div>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  Stock is currently available in{' '}
                  <strong className="font-semibold text-amber-950">
                    {fetchedEmsData.stockLocation} ({fetchedEmsData.stockAvailable} pcs available)
                  </strong>
                  . Enterprise policy mandates submitting a{' '}
                  <strong>Material Issue Request (Xuất Kho theo WO)</strong> before placing a new purchase requisition.
                </p>

                {/* Quick actions for interlock */}
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('warehouse')}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
                  >
                    <Package className="w-3.5 h-3.5" />
                    Go to Warehouse Work Order Issue
                  </button>

                  <label className="flex items-center gap-2 text-xs text-amber-900 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isBypassChecked}
                      onChange={(e) => setIsBypassChecked(e.target.checked)}
                      className="rounded border-amber-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Bypass with Line Leader Emergency Justification</span>
                  </label>
                </div>

                {isBypassChecked && (
                  <div className="mt-3 animate-fade-in">
                    <input
                      type="text"
                      value={bypassJustification}
                      onChange={(e) => setBypassJustification(e.target.value)}
                      placeholder="Enter Line Leader name & emergency override reason (e.g. Line 05 buffer stock reserved for Night Shift overhaul)..."
                      className="w-full bg-white border border-amber-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Form Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('workspace')}
            className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-medium transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            Submit Request to PIC Review Hub
          </button>
        </div>
      </form>
    </div>
  );
}
