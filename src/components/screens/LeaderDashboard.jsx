import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  PROGRESS_BREAKDOWN_DATA,
  INTERLOCK_CAUSES_DATA,
  SPEND_TREND_DATA,
  BOTTLENECK_SPARE_PARTS
} from '../../data/mockData';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  AlertOctagon,
  Clock,
  DollarSign,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Factory,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Badge } from '../common/Badge';

export function LeaderDashboard() {
  const { setActiveTab, addToast } = useApp();

  const handleActionClick = (item) => {
    if (item.code === 'SP-2024-M08') {
      setActiveTab('warehouse');
      addToast("Navigated to Warehouse", "Reviewing stock availability for SMC Air Cylinder.", "info");
    } else if (item.code === 'SP-2024-E12') {
      setActiveTab('po_lifecycle');
      addToast("Navigated to PO Lifecycle", "Reviewing Price Risk on Mitsubishi Inverter.", "info");
    } else if (item.code === 'SP-9021') {
      setActiveTab('workspace');
      addToast("Navigated to Workspace", "Checking Koganei cylinder clarification task.", "info");
    } else {
      setActiveTab('pic_review');
      addToast("Navigated to PIC Review", `Inspecting item ${item.code}.`, "info");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Leader Executive Analytics Dashboard
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
              Plant Intelligence
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Real-time executive oversight across line downtime risks, procurement bottleneck analysis, interlock root cause distributions, and multi-month budget performance.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 font-mono">
          <Factory className="w-4 h-4 text-indigo-600" />
          <span>Plant 1 (SMT / Assembly / Coating)</span>
        </div>
      </div>

      {/* Top 4 KPI Metric Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-subtle">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            MTD Procurement Spend
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 font-mono">
              $38,420
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowDownRight className="w-3.5 h-3.5" /> -4.2% vs Plan
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Ceiling: $45,000 | 85.3% utilized
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-subtle">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Active Line Bottlenecks
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-red-600 font-mono">
              5 Items
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
              Critical
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            2 stopping lines; 3 high risk
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-subtle">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Interlock Savings MTD
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-indigo-600 font-mono">
              $14,280
            </span>
            <span className="text-xs font-semibold text-indigo-700">
              Stock Reused
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            17 duplicate orders prevented
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-subtle">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Average PO Lead Time
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 font-mono">
              16.4 Days
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowDownRight className="w-3.5 h-3.5" /> -2.1 Days
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            From Request to Gate Receiving
          </p>
        </div>
      </div>

      {/* Recharts Analytics Charts: Bar & Donut & Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Progress Breakdown */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Procurement Pipeline Progress Breakdown
              </h3>
              <p className="text-[11px] text-slate-500">
                Percentage distribution across procurement milestones
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              36 Total Items
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={PROGRESS_BREAKDOWN_DATA}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis
                  dataKey="stage"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  axisLine={{ stroke: '#E2E8F0' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  axisLine={{ stroke: '#E2E8F0' }}
                  unit="%"
                />
                <Tooltip
                  formatter={(value, name) => [`${value}%`, 'Volume Share']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    borderColor: '#E2E8F0',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                  {PROGRESS_BREAKDOWN_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Interlock Causes Donut Chart */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Interlock Root Cause Distribution
              </h3>
              <p className="text-[11px] text-slate-500">
                Categorization of blocked purchase requisitions
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              42% Stock In Warehouse
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={INTERLOCK_CAUSES_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {INTERLOCK_CAUSES_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Share']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    borderColor: '#E2E8F0',
                    fontSize: '12px'
                  }}
                />
                <Legend
                  formatter={(value) => (
                    <span className="text-xs text-slate-700 font-medium">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Spend Trend vs Budget Chart */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-subtle">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              6-Month Budget Plan vs Actual Spend Velocity
            </h3>
            <p className="text-[11px] text-slate-500">
              Expenditure trend against monthly plant threshold ($42k - $45k)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded-sm bg-indigo-600" />
              Actual Spend
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-3 rounded-sm bg-slate-300" />
              Budget Plan
            </span>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={SPEND_TREND_DATA}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#64748B' }}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748B' }}
                axisLine={{ stroke: '#E2E8F0' }}
                tickFormatter={(v) => `$${v / 1000}k`}
              />
              <Tooltip
                formatter={(v) => [`$${v.toLocaleString()}`, 'Amount']}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  borderColor: '#E2E8F0',
                  fontSize: '12px'
                }}
              />
              <Area
                type="monotone"
                dataKey="budget"
                stroke="#94A3B8"
                strokeDasharray="4 4"
                fill="transparent"
              />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#4F46E5"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#spendGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Red-Flag Table: Top 5 Bottleneck Spare Parts Delaying Line Production */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-red-50/30">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-100 text-red-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Top 5 Bottleneck Spare Parts Delaying Line Production
              </h3>
              <p className="text-xs text-slate-500">
                Critical path components directly impacting production schedules and machine run-time
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded bg-red-100 text-red-700">
            Immediate Action Required
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/60 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Item Code & Name</th>
                <th className="py-3 px-4">Impacted Line</th>
                <th className="py-3 px-4">Downtime Risk Level</th>
                <th className="py-3 px-4">Primary Bottleneck Cause</th>
                <th className="py-3 px-4">Lead Time Delay</th>
                <th className="py-3 px-4 text-right">Leadership Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {BOTTLENECK_SPARE_PARTS.map((item, idx) => (
                <tr key={item.code} className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-indigo-600">
                      {item.code}
                    </div>
                    <div className="font-semibold text-slate-900">
                      {item.name}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    {item.line}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        item.downtimeRisk.includes('Critical')
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : item.downtimeRisk.includes('High')
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {item.downtimeRisk}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {item.bottleneckReason}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    +{item.impactDays} Days
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleActionClick(item)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>{item.actionNeeded}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
