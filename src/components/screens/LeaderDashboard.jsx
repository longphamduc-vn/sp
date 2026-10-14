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
  CheckCircle2
} from 'lucide-react';

export function LeaderDashboard() {
  const { setActiveTab, addToast, t, language } = useApp();

  const handleActionClick = (item) => {
    if (item.code === 'SP-2024-M08') {
      setActiveTab('warehouse');
      addToast(
        language === 'vi' ? "Điều hướng sang Kho vận" : "Navigated to Warehouse",
        t('dashboard.toastNavWarehouse'),
        "info"
      );
    } else if (item.code === 'SP-2024-E12') {
      setActiveTab('po_lifecycle');
      addToast(
        language === 'vi' ? "Điều hướng sang Vòng đời PO" : "Navigated to PO Lifecycle",
        t('dashboard.toastNavPo'),
        "info"
      );
    } else if (item.code === 'SP-9021') {
      setActiveTab('workspace');
      addToast(
        language === 'vi' ? "Điều hướng sang Bàn làm việc" : "Navigated to Workspace",
        t('dashboard.toastNavWorkspace'),
        "info"
      );
    } else {
      setActiveTab('pic_review');
      addToast(
        language === 'vi' ? "Điều hướng sang Duyệt PIC" : "Navigated to PIC Review",
        t('dashboard.toastNavPic', { code: item.code }),
        "info"
      );
    }
  };

  // Localized chart data
  const localizedProgressData = PROGRESS_BREAKDOWN_DATA.map((item) => {
    let stageLabel = item.stage;
    if (language === 'vi') {
      if (item.stage === 'PIC Review') stageLabel = 'Duyệt PIC';
      else if (item.stage === 'EMS Quote') stageLabel = 'Báo giá EMS';
      else if (item.stage === 'PO Lifecycle') stageLabel = 'Vòng đời PO';
      else if (item.stage === 'Completed/Issued') stageLabel = 'Đã xuất kho';
    }
    return { ...item, stage: stageLabel };
  });

  const localizedInterlockData = INTERLOCK_CAUSES_DATA.map((item) => {
    let nameLabel = item.name;
    if (language === 'vi') {
      if (item.name.includes('Stock Interlock')) nameLabel = 'Khóa tồn kho (Có trong kho)';
      else if (item.name.includes('Stop PO')) nameLabel = 'Dừng PO (2 năm chưa dùng)';
      else if (item.name.includes('Price Mismatch')) nameLabel = 'Lệch giá / Rủi ro giá';
      else if (item.name.includes('Target System')) nameLabel = 'Từ chối trên Target System';
    }
    return { ...item, name: nameLabel };
  });

  const localizedSpendData = SPEND_TREND_DATA.map((item) => {
    let monthLabel = item.month;
    if (language === 'vi') {
      if (item.month === 'May') monthLabel = 'Tháng 5';
      else if (item.month === 'Jun') monthLabel = 'Tháng 6';
      else if (item.month === 'Jul') monthLabel = 'Tháng 7';
      else if (item.month === 'Aug') monthLabel = 'Tháng 8';
      else if (item.month === 'Sep') monthLabel = 'Tháng 9';
      else if (item.month.includes('Oct')) monthLabel = 'Tháng 10 (MTD)';
    }
    return { ...item, month: monthLabel };
  });

  // Helper for bottleneck row translations
  const translateRisk = (risk) => {
    if (language !== 'vi') return risk;
    if (risk.includes('Critical')) return 'Khẩn cấp (8.5 giờ/tuần)';
    if (risk.includes('High')) return 'Cao (Dừng máy do báo lỗi)';
    if (risk.includes('Medium') && risk.includes('Fixture')) return 'Trung bình (Độ rơ đồ gá)';
    if (risk.includes('Medium') && risk.includes('Exhaust')) return 'Trung bình (Rung quạt hút)';
    if (risk.includes('Low')) return 'Thấp (Dự phòng định kỳ)';
    return risk;
  };

  const translateReason = (reason) => {
    if (language !== 'vi') return reason;
    if (reason.includes('Stop PO')) return 'Mã Dừng PO + Khóa tồn kho chờ xuất';
    if (reason.includes('Price Risk')) return 'Rủi ro mất giá ($210 -> $245) chờ Purchaser báo giá lại';
    if (reason.includes('Logic Clarification')) return 'PIC yêu cầu giải trình căn cứ tính toán';
    if (reason.includes('Price Revise')) return 'Cần điều chỉnh giá + Có tồn tại Kho B';
    if (reason.includes('Dock Receiving')) return 'Đang chờ kiểm định QC tại Cổng tiếp nhận 2';
    return reason;
  };

  const translateAction = (act) => {
    if (language !== 'vi') return act;
    if (act.includes('Withdrawal')) return 'Duyệt xuất kho từ Kho A';
    if (act.includes('Sign-off')) return 'Lãnh đạo ký duyệt lệch ngân sách';
    if (act.includes('Reply')) return 'Người đề xuất phản hồi giải trình';
    if (act.includes('Bin C-12')) return 'Sử dụng tồn kho tại Kệ C-12';
    if (act.includes('QC Inspection')) return 'Thủ kho bấm xác nhận đạt QC';
    return act;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {t('dashboard.title')}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
              {t('dashboard.plantSubtitle')}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            {t('dashboard.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 font-mono">
          <Factory className="w-4 h-4 text-indigo-600" />
          <span>{t('dashboard.plantName')}</span>
        </div>
      </div>

      {/* Top 4 KPI Metric Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-subtle">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {t('dashboard.kpiSpendTitle')}
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 font-mono">
              $38,420
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowDownRight className="w-3.5 h-3.5" /> {t('dashboard.kpiSpendDiff')}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {t('dashboard.kpiSpendPlan')}
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-subtle">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {t('dashboard.kpiBottleneckTitle')}
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-red-600 font-mono">
              {t('dashboard.kpiBottleneckCount')}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
              {t('dashboard.kpiBottleneckBadge')}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {t('dashboard.kpiBottleneckSub')}
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-subtle">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {t('dashboard.kpiSavingsTitle')}
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-indigo-600 font-mono">
              $14,280
            </span>
            <span className="text-xs font-semibold text-indigo-700">
              {t('dashboard.kpiSavingsBadge')}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {t('dashboard.kpiSavingsSub')}
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-subtle">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {t('dashboard.kpiLeadTimeTitle')}
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {t('dashboard.kpiLeadTimeVal')}
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowDownRight className="w-3.5 h-3.5" /> {t('dashboard.kpiLeadTimeDiff')}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {t('dashboard.kpiLeadTimeSub')}
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
                {t('dashboard.chartProgressTitle')}
              </h3>
              <p className="text-[11px] text-slate-500">
                {t('dashboard.chartProgressSub')}
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              {t('dashboard.totalItemsBadge')}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={localizedProgressData}
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
                  formatter={(value) => [`${value}%`, t('dashboard.volumeShare')]}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    borderColor: '#E2E8F0',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                  {localizedProgressData.map((entry, index) => (
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
                {t('dashboard.chartInterlockTitle')}
              </h3>
              <p className="text-[11px] text-slate-500">
                {t('dashboard.chartInterlockSub')}
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              {t('dashboard.stockInWarehouseBadge')}
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={localizedInterlockData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {localizedInterlockData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}%`, language === 'vi' ? 'Tỷ lệ' : 'Share']}
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
              {t('dashboard.chartSpendTitle')}
            </h3>
            <p className="text-[11px] text-slate-500">
              {t('dashboard.chartSpendSub')}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded-sm bg-indigo-600" />
              {t('dashboard.actualSpend')}
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-3 rounded-sm bg-slate-300" />
              {t('dashboard.budgetPlan')}
            </span>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={localizedSpendData}
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
                formatter={(v) => [`$${v.toLocaleString()}`, language === 'vi' ? 'Số tiền' : 'Amount']}
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
                {t('dashboard.bottleneckTableTitle')}
              </h3>
              <p className="text-xs text-slate-500">
                {t('dashboard.bottleneckTableSub')}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded bg-red-100 text-red-700">
            {t('dashboard.immediateAction')}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/60 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">{t('dashboard.thPart')}</th>
                <th className="py-3 px-4">{t('dashboard.thLine')}</th>
                <th className="py-3 px-4">{t('dashboard.thDowntimeRisk')}</th>
                <th className="py-3 px-4">{t('dashboard.thBottleneck')}</th>
                <th className="py-3 px-4">{t('dashboard.thDaysImpact')}</th>
                <th className="py-3 px-4 text-right">{t('dashboard.thActionNeeded')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {BOTTLENECK_SPARE_PARTS.map((item) => (
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
                      {translateRisk(item.downtimeRisk)}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {translateReason(item.bottleneckReason)}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {t('dashboard.daysDelay', { days: item.impactDays })}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleActionClick(item)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>{translateAction(item.actionNeeded)}</span>
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
