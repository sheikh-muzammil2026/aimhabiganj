import React, { useState, useEffect } from 'react';
import { Printer, Calendar, RefreshCw, Loader2 } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_SERVER_API || 'http://localhost:8000';

// Aggregate transactions list into income/expense breakdowns (pure helper defined outside)
const aggregateTransactions = (txList) => {
  let totalIncome = 0;
  let totalExpense = 0;
  const incomeMap = {};
  const expenseMap = {};

  txList.forEach(tx => {
    if (tx.type === 'income') {
      const amount = tx.totalIncome || 0;
      totalIncome += amount;
      tx.items?.forEach(item => {
        incomeMap[item.head] = (incomeMap[item.head] || 0) + (parseFloat(item.amount) || 0);
      });
    } else if (tx.type === 'expense') {
      const amount = tx.totalExpense || 0;
      totalExpense += amount;
      tx.items?.forEach(item => {
        expenseMap[item.head] = (expenseMap[item.head] || 0) + (parseFloat(item.amount) || 0);
      });
    }
  });

  const incomeBreakdown = Object.entries(incomeMap)
    .map(([head, amount]) => ({ head, amount }))
    .sort((a, b) => b.amount - a.amount);

  const expenseBreakdown = Object.entries(expenseMap)
    .map(([head, amount]) => ({ head, amount }))
    .sort((a, b) => b.amount - a.amount);

  const netBalance = totalIncome - totalExpense;

  return {
    totalIncome,
    totalExpense,
    netBalance,
    incomeBreakdown,
    expenseBreakdown
  };
};

export default function MonthlyReport({
  reportYear,
  setReportYear,
  reportMonth,
  setReportMonth,
  summaryData, // parent monthly summary
  BANGAL_MONTHS,
  getMonthLabel,
  formatBanglaNumber,
  loading: parentLoading,
  fetchSummary,
  onPrintReport
}) {
  const [subTab, setSubTab] = useState('monthly'); // daily, weekly, monthly
  const [localLoading, setLocalLoading] = useState(false);

  // Daily report states
  const todayStr = new Date().toISOString().split('T')[0];
  const [dailyDate, setDailyDate] = useState(todayStr);

  // Weekly report states
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6);
  const [weeklyStartDate, setWeeklyStartDate] = useState(sevenDaysAgo.toISOString().split('T')[0]);
  const [weeklyEndDate, setWeeklyEndDate] = useState(todayStr);

  // Local aggregated summary data for daily/weekly
  const [localSummaryData, setLocalSummaryData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    incomeBreakdown: [],
    expenseBreakdown: []
  });

  // Refetch when report criteria change
  useEffect(() => {
    const fetchAndAggregate = async (start, end) => {
      try {
        setLocalLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/finance/transactions?limit=2000&startDate=${start}&endDate=${end}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const aggregated = aggregateTransactions(data.data);
          setLocalSummaryData(aggregated);
        } else {
          console.error("Failed to fetch transactions for report:", data.message);
        }
      } catch (err) {
        console.error("Error in report aggregation fetch:", err);
      } finally {
        setLocalLoading(false);
      }
    };

    if (subTab === 'daily') {
      fetchAndAggregate(dailyDate, dailyDate);
    } else if (subTab === 'weekly') {
      fetchAndAggregate(weeklyStartDate, weeklyEndDate);
    }
  }, [subTab, dailyDate, weeklyStartDate, weeklyEndDate]);

  const activeData = subTab === 'monthly' ? summaryData : localSummaryData;
  const isLoading = subTab === 'monthly' ? parentLoading : localLoading;

  const handleLocalPrint = () => {
    let reportTitle = '';
    let reportPeriod = '';
    
    if (subTab === 'daily') {
      reportTitle = 'দৈনিক আয় ও ব্যয় বিবরণী';
      reportPeriod = `তারিখ: ${formatBanglaNumber(dailyDate)}`;
    } else if (subTab === 'weekly') {
      reportTitle = 'সাপ্তাহিক আয় ও ব্যয় বিবরণী';
      reportPeriod = `তারিখ সীমা: ${formatBanglaNumber(weeklyStartDate)} থেকে ${formatBanglaNumber(weeklyEndDate)}`;
    } else {
      reportTitle = 'মাসিক আয় ও ব্যয় বিবরণী';
      reportPeriod = `মাস: ${getMonthLabel(reportMonth)} | বছর: ${formatBanglaNumber(reportYear)}`;
    }

    onPrintReport({
      type: 'report',
      title: reportTitle,
      period: reportPeriod,
      data: activeData
    });
  };

  return (
    <div className="space-y-6">
      {/* Controls for filtering/printing */}
      <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4 bg-white p-4 rounded-xl border border-emerald-900/10 shadow-xs print:hidden">
        {/* Report Sub-Tabs Selection */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-full xl:w-auto">
          {[
            { id: 'daily', label: '📅 দৈনিক বিবরণী' },
            { id: 'weekly', label: '📅 साप्ताहिक বিবরণী' },
            { id: 'monthly', label: '📅 মাসিক বিবরণী' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`flex-1 xl:flex-none py-1.5 px-4 text-xs font-bold rounded-lg transition-all ${
                subTab === tab.id
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Filters depending on Selected Tab */}
        <div className="flex flex-wrap items-center gap-3">
          {subTab === 'daily' && (
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-600">তারিখ:</label>
              <input
                type="date"
                value={dailyDate}
                onChange={(e) => setDailyDate(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-700"
              />
            </div>
          )}

          {subTab === 'weekly' && (
            <div className="flex items-center gap-2 flex-wrap">
              <label className="text-xs font-bold text-slate-600">তারিখ সীমা:</label>
              <input
                type="date"
                value={weeklyStartDate}
                onChange={(e) => setWeeklyStartDate(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-700"
              />
              <span className="text-xs text-slate-400 font-bold">থেকে</span>
              <input
                type="date"
                value={weeklyEndDate}
                onChange={(e) => setWeeklyEndDate(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-700"
              />
            </div>
          )}

          {subTab === 'monthly' && (
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <Calendar className="w-4 h-4 text-emerald-800 shrink-0" />
              <select
                value={reportMonth}
                onChange={(e) => setReportMonth(e.target.value)}
                className="text-xs font-bold text-slate-700 bg-transparent border-none focus:outline-none cursor-pointer"
              >
                {BANGAL_MONTHS.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              <select
                value={reportYear}
                onChange={(e) => setReportYear(e.target.value)}
                className="text-xs font-bold text-slate-700 bg-transparent border-none focus:outline-none cursor-pointer"
              >
                {["২০২৫", "২০২৬", "২০২৭", "২০২৮"].map(yr => {
                  const engYear = yr.replace(/[০-৯]/g, d => "০১২৩৪৫৬৭৮৯".indexOf(d));
                  return <option key={engYear} value={engYear}>{yr}</option>;
                })}
              </select>
            </div>
          )}

          {/* Refresh Action */}
          <button 
            onClick={() => {
              if (subTab === 'monthly') fetchSummary();
              else fetchAndAggregate(
                subTab === 'daily' ? dailyDate : weeklyStartDate,
                subTab === 'daily' ? dailyDate : weeklyEndDate
              );
            }}
            disabled={isLoading}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors border border-slate-200 shrink-0"
            title="রিফ্রেশ"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* Print Action */}
          <button
            onClick={handleLocalPrint}
            disabled={isLoading}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-950 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            <Printer className="w-4 h-4" /> প্রিন্ট করুন (A4 PDF)
          </button>
        </div>
      </div>

      {/* Physical Report Sheet Container */}
      <div className="bg-white border border-slate-200 p-4 sm:p-6 md:p-12 rounded-2xl shadow-xs print:border-none print:shadow-none print:p-0 print:m-0 overflow-x-auto relative min-h-[300px]">
        
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-2xl">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-emerald-800 animate-spin" />
              <span className="text-xs text-slate-500 font-bold">ডাটা লোড হচ্ছে...</span>
            </div>
          </div>
        )}

        {/* Logo/Header */}
        <div className="text-center pb-6 sm:pb-8 border-b border-emerald-900/15">
          <h2 className="text-xl sm:text-2xl font-black text-emerald-950">আস-সালাম আইডিয়াল মাদরাসা (এইম)</h2>
          <p className="text-xs text-slate-500 font-bold mt-1">হবিগঞ্জ সদর, হবিগঞ্জ</p>
          <h3 className="text-sm sm:text-base font-black bg-slate-100 border border-slate-200 inline-block px-4 sm:px-6 py-1.5 rounded-full text-slate-700 mt-3 sm:mt-4 tracking-wide">
            {subTab === 'daily' ? 'দৈনিক' : subTab === 'weekly' ? 'সাপ্তাহিক' : 'মাসিক'} আয় ও ব্যয় বিবরণী
          </h3>
          <p className="text-xs text-emerald-800 font-extrabold mt-3 tracking-wider">
            {subTab === 'daily' && `তারিখ: ${formatBanglaNumber(dailyDate)}`}
            {subTab === 'weekly' && `তারিখ সীমা: ${formatBanglaNumber(weeklyStartDate)} থেকে ${formatBanglaNumber(weeklyEndDate)}`}
            {subTab === 'monthly' && `মাস: ${getMonthLabel(reportMonth)} | বছর: ${formatBanglaNumber(reportYear)}`}
          </p>
        </div>

        {/* Dual Column Sheet (Income vs Expense) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 border-x border-b border-slate-200 mt-6 print:grid-cols-2">
          
          {/* Income Column */}
          <div className="bg-white p-4 sm:p-5 space-y-4">
            <h4 className="text-xs font-extrabold text-emerald-900 uppercase tracking-widest border-b-2 border-emerald-100 pb-2 flex items-center justify-between">
              <span>📥 আয়ের খাতসমূহ (Income Sector)</span>
              <span className="text-[10px] text-slate-400">টাকা (৳)</span>
            </h4>
            
            {activeData.incomeBreakdown?.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">কোনো আয়ের এন্ট্রি নেই</p>
            ) : (
              <div className="divide-y divide-slate-100 font-semibold text-slate-700 text-xs">
                {activeData.incomeBreakdown?.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-2.5">
                    <span className="pr-4">{item.head}</span>
                    <span className="font-bold text-slate-900 whitespace-nowrap">৳ {formatBanglaNumber(item.amount.toLocaleString('bn-BD'))}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Expense Column */}
          <div className="bg-white p-4 sm:p-5 space-y-4">
            <h4 className="text-xs font-extrabold text-rose-900 uppercase tracking-widest border-b-2 border-rose-100 pb-2 flex items-center justify-between">
              <span>📤 ব্যয়ের খাতসমূহ (Expense Sector)</span>
              <span className="text-[10px] text-slate-400">টাকা (৳)</span>
            </h4>

            {activeData.expenseBreakdown?.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">কোনো ব্যয়ের এন্ট্রি নেই</p>
            ) : (
              <div className="divide-y divide-slate-100 font-semibold text-slate-700 text-xs">
                {activeData.expenseBreakdown?.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-2.5">
                    <span className="pr-4">{item.head}</span>
                    <span className="font-bold text-slate-900 whitespace-nowrap">৳ {formatBanglaNumber(item.amount.toLocaleString('bn-BD'))}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Calculations / Summary Footer Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-slate-200 border-x border-b border-slate-200 text-xs font-black print:grid-cols-3">
          <div className="bg-emerald-50/50 p-3 sm:p-4 text-emerald-950 flex justify-between items-center gap-2">
            <span>সর্বমোট আয়:</span>
            <span className="text-xs sm:text-sm whitespace-nowrap">৳ {formatBanglaNumber(activeData.totalIncome.toLocaleString('bn-BD'))}</span>
          </div>
          <div className="bg-rose-50/50 p-3 sm:p-4 text-rose-950 flex justify-between items-center gap-2">
            <span>সর্বমোট ব্যয়:</span>
            <span className="text-xs sm:text-sm whitespace-nowrap">৳ {formatBanglaNumber(activeData.totalExpense.toLocaleString('bn-BD'))}</span>
          </div>
          <div className={`p-3 sm:p-4 flex justify-between items-center gap-2 ${activeData.netBalance >= 0 ? 'bg-blue-50/60 text-blue-950' : 'bg-amber-50/60 text-amber-950'}`}>
            <span>নেট ব্যালেন্স (উদ্বৃত্ত):</span>
            <span className="text-xs sm:text-sm whitespace-nowrap">৳ {formatBanglaNumber(activeData.netBalance.toLocaleString('bn-BD'))}</span>
          </div>
        </div>

        {/* Signature Area */}
        <div className="grid grid-cols-3 gap-2 sm:gap-6 pt-12 sm:pt-16 text-center text-[10px] sm:text-xs font-bold text-slate-500 mt-6 sm:mt-10 print:mt-14">
          <div className="border-t border-slate-300 pt-2 mx-1 sm:mx-4">
            <p>হিসাবরক্ষক</p>
            <span className="text-[9px] sm:text-[10px] text-slate-400 block font-normal mt-0.5 sm:mt-1">ক্যাশিয়ার / মুহাসিব</span>
          </div>
          <div className="border-t border-slate-300 pt-2 mx-1 sm:mx-4">
            <p>যাচাইকারী</p>
            <span className="text-[9px] sm:text-[10px] text-slate-400 block font-normal mt-0.5 sm:mt-1">অর্থ সম্পাদক</span>
          </div>
          <div className="border-t border-slate-300 pt-2 mx-1 sm:mx-4">
            <p>অনুমোদনকারী</p>
            <span className="text-[9px] sm:text-[10px] text-slate-400 block font-normal mt-0.5 sm:mt-1">মুহতামিম / অধ্যক্ষ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
