import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Scale, 
  Search, 
  Printer, 
  Calendar, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';

export default function Overview({
  summaryData,
  reportMonth,
  reportYear,
  getMonthLabel,
  formatBanglaNumber,
  loading,
  fetchSummary,
  transactions,
  txPage,
  txTotalPages,
  setTxPage,
  txFilterType,
  setTxFilterType,
  txSearch,
  setTxSearch,
  txStartDate,
  setTxStartDate,
  txEndDate,
  setTxEndDate,
  onPrint
}) {
  return (
    <div className="space-y-6 print:hidden">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Income */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-emerald-900/10 shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] sm:text-xs font-extrabold text-slate-500 tracking-wider uppercase">মোট আয় ({getMonthLabel(reportMonth)})</p>
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-900 mt-1.5 sm:mt-2">
                ৳ {formatBanglaNumber(summaryData.totalIncome.toLocaleString('bn-BD'))}
              </h3>
            </div>
            <div className="p-3 sm:p-4 bg-emerald-50 rounded-2xl group-hover:bg-emerald-100 transition-colors shrink-0">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-705" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 text-[11px] sm:text-xs font-bold text-emerald-800 flex items-center gap-1">
            <span>🎯</span> মোট আয়ের খাত: {formatBanglaNumber(summaryData.incomeBreakdown?.length || 0)} টি
          </div>
        </div>

        {/* Total Expense */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-emerald-900/10 shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] sm:text-xs font-extrabold text-slate-500 tracking-wider uppercase">মোট ব্যয় ({getMonthLabel(reportMonth)})</p>
              <h3 className="text-2xl sm:text-3xl font-black text-rose-900 mt-1.5 sm:mt-2">
                ৳ {formatBanglaNumber(summaryData.totalExpense.toLocaleString('bn-BD'))}
              </h3>
            </div>
            <div className="p-3 sm:p-4 bg-rose-50 rounded-2xl group-hover:bg-rose-100 transition-colors shrink-0">
              <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-rose-700" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 text-[11px] sm:text-xs font-bold text-rose-800 flex items-center gap-1">
            <span>🎯</span> মোট ব্যয়ের খাত: {formatBanglaNumber(summaryData.expenseBreakdown?.length || 0)} টি
          </div>
        </div>

        {/* Net Balance */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-emerald-900/10 shadow-xs hover:shadow-md transition-all group sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] sm:text-xs font-extrabold text-slate-500 tracking-wider uppercase">উদ্বৃত্ত/চলতি ব্যালেন্স</p>
              <h3 className={`text-2xl sm:text-3xl font-black mt-1.5 sm:mt-2 ${summaryData.netBalance >= 0 ? 'text-blue-900' : 'text-amber-900'}`}>
                ৳ {formatBanglaNumber(summaryData.netBalance.toLocaleString('bn-BD'))}
              </h3>
            </div>
            <div className={`p-3 sm:p-4 rounded-2xl transition-colors shrink-0 ${summaryData.netBalance >= 0 ? 'bg-blue-50 group-hover:bg-blue-100' : 'bg-amber-50 group-hover:bg-amber-100'}`}>
              <Scale className={`w-5 h-5 sm:w-6 sm:h-6 ${summaryData.netBalance >= 0 ? 'text-blue-700' : 'text-amber-700'}`} />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 text-[11px] sm:text-xs font-bold flex items-center gap-1">
            {summaryData.netBalance >= 0 ? (
              <span className="text-blue-700">🟢 উদ্বৃত্ত তহবিল রয়েছে</span>
            ) : (
              <span className="text-amber-700">🔴 ঘাটতি রয়েছে</span>
            )}
          </div>
        </div>
      </div>

      {/* Transactions History and Search */}
      <div className="bg-white rounded-2xl border border-emerald-900/10 shadow-xs p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-emerald-955">লেনদেনের ইতিহাস</h3>
            <p className="text-xs text-slate-400 font-medium">আয় ও ব্যয়ের সাম্প্রতিক এন্ট্রিসমূহ</p>
          </div>

          {/* Filtering Controls */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 w-full xl:w-auto">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="রসিদ/ভাউচার নং বা দাতা/গ্রহীতা"
                value={txSearch}
                onChange={(e) => {
                  setTxSearch(e.target.value);
                  setTxPage(1);
                }}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
              />
            </div>

            {/* Filter Type */}
            <select
              value={txFilterType}
              onChange={(e) => {
                setTxFilterType(e.target.value);
                setTxPage(1);
              }}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-emerald-700 w-full sm:w-auto"
            >
              <option value="all">সকল লেনদেন</option>
              <option value="income">শুধুমাত্র আয় (Income)</option>
              <option value="expense">শুধুমাত্র ব্যয় (Expense)</option>
            </select>

            {/* Date range filter */}
            <div className="flex items-center gap-1.5 text-xs w-full sm:w-auto justify-between sm:justify-start">
              <input
                type="date"
                value={txStartDate}
                onChange={(e) => {
                  setTxStartDate(e.target.value);
                  setTxPage(1);
                }}
                className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs w-full sm:w-auto"
              />
              <span className="text-slate-400 shrink-0">থেকে</span>
              <input
                type="date"
                value={txEndDate}
                onChange={(e) => {
                  setTxEndDate(e.target.value);
                  setTxPage(1);
                }}
                className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs w-full sm:w-auto"
              />
            </div>

            <button 
              onClick={() => {
                setTxSearch('');
                setTxStartDate('');
                setTxEndDate('');
                setTxFilterType('all');
                setTxPage(1);
              }}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-600 transition-colors w-full sm:w-auto text-center"
              title="ফিল্টার মুছে ফেলুন"
            >
              মুছে ফেলুন
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto rounded-xl border border-slate-100 -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-600 font-bold">
                  <th className="p-3 sm:p-4 text-center w-12 whitespace-nowrap">প্রকার</th>
                  <th className="p-3 sm:p-4 whitespace-nowrap">তারিখ</th>
                  <th className="p-3 sm:p-4 whitespace-nowrap">রসিদ/ভাউচার নং</th>
                  <th className="p-3 sm:p-4 whitespace-nowrap">নাম (দাতা/গ্রহীতা)</th>
                  <th className="p-3 sm:p-4 min-w-[150px]">খাত ও বিবরণ</th>
                  <th className="p-3 sm:p-4 text-right whitespace-nowrap">টাকার পরিমাণ</th>
                  <th className="p-3 sm:p-4 text-center whitespace-nowrap w-16">প্রিন্ট</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-slate-400">
                      কোনো লেনদেনের তথ্য পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 sm:p-4 text-center whitespace-nowrap">
                        {tx.type === 'income' ? (
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full font-bold inline-block">আয়</span>
                        ) : (
                          <span className="px-2.5 py-1 bg-rose-50 text-rose-800 border border-rose-100 rounded-full font-bold inline-block">ব্যয়</span>
                        )}
                      </td>
                      <td className="p-3 sm:p-4 whitespace-nowrap">{formatBanglaNumber(tx.date)}</td>
                      <td className="p-3 sm:p-4 font-mono font-bold text-emerald-950 whitespace-nowrap">
                        {tx.type === 'income' ? tx.receiptNo : tx.voucherNo}
                      </td>
                      <td className="p-3 sm:p-4 font-semibold text-slate-800 whitespace-nowrap">
                        {tx.type === 'income' ? tx.payerName : tx.receiverName}
                      </td>
                      <td className="p-3 sm:p-4">
                        <div className="text-slate-800 font-bold">
                          {tx.items.map(it => it.head).join(', ')}
                        </div>
                        {tx.description && (
                          <span className="text-[10px] text-slate-400 block font-normal mt-0.5">{tx.description}</span>
                        )}
                      </td>
                      <td className={`p-3 sm:p-4 text-right font-black text-sm whitespace-nowrap ${tx.type === 'income' ? 'text-emerald-800' : 'text-rose-800'}`}>
                        ৳ {formatBanglaNumber((tx.totalIncome || tx.totalExpense || 0).toLocaleString('bn-BD'))}
                      </td>
                      <td className="p-3 sm:p-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => onPrint(tx)}
                          className="p-1 hover:bg-slate-100 rounded-lg text-emerald-800 transition-colors"
                          title="প্রিন্ট করুন"
                        >
                          <Printer className="w-4.5 h-4.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {txTotalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 pt-4 gap-3">
            <p className="text-xs text-slate-500 font-bold">
              পৃষ্ঠা {formatBanglaNumber(txPage)} / {formatBanglaNumber(txTotalPages)}
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={txPage === 1}
                onClick={() => setTxPage(prev => Math.max(prev - 1, 1))}
                className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={txPage === txTotalPages}
                onClick={() => setTxPage(prev => Math.min(prev + 1, txTotalPages))}
                className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
