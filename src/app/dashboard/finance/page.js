"use client";
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Scale, 
  Search, 
  Plus, 
  Trash2, 
  Printer, 
  Calendar, 
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_SERVER_API || 'http://localhost:8000';

const INCOME_HEADS = [
  "জেনারেল ব্যাংক হিসাব-১৫",
  "এয়াতিম ফান্ড ব্যাংক হিসাব-৮০৪",
  "ডোনেশন ফান্ড ব্যাংক হিসাব-৬৭৪",
  "যাকাত ফান্ড ব্যাংক হিসাব-৬৭৫",
  "ব্যাংকে প্রফিট",
  "নগদ হাতে উদ্বৃত্ত",
  "করযে হাসানাহ",
  "ভর্তি ফরম ফি",
  "সেশন ভর্তি ফি",
  "সংস্থাপন ফি",
  "লাইব্রেরি ফি",
  "লকার চার্জ",
  "সফটওয়্যার চার্জ",
  "সেমিনার/আঞ্জুমান ফি",
  "উন্নয়ন ফি",
  "বোর্ডিং ফি (থাকা+খাওয়া)",
  "মাসিক টিউশন",
  "ডে-কেয়ার",
  "কোর্স/কোচিং",
  "পরীক্ষা ফি",
  "জরিমানা",
  "স্লিপিং বেড/ড্রেস",
  "খাতা/ডায়েরী/কিতাব/বেইজ/আইডি কার্ড",
  "শিক্ষা সফর",
  "ইনভেস্ট",
  "ভূমি/বিল্ডিং/পরিবহন",
  "সাদাকাহ",
  "ইয়াতিম অনুদান",
  "যাকাত/ইফতার",
  "অন্যান্য"
];

const EXPENSE_HEADS = [
  "বিজ্ঞাপন",
  "বোর্ডিং এর বাজার",
  "টিফিন",
  "বাড়ি ভাড়া",
  "আপ্যায়ন",
  "যাতায়াত",
  "শিক্ষক-স্টাফ বেতন",
  "ক্লিনিং সরঞ্জাম",
  "কম্পিউটার সরঞ্জাম",
  "বৈদ্যুতিক সরঞ্জাম",
  "ইউটিলিটি (বিদ্যুৎ, ইন্টারনেট, ইত্যাদি)",
  "অরফান",
  "আঞ্জুমান (সেমিনার)",
  "স্টেশনারীজ",
  "প্রিন্টিং এন্ড ফটোকপি",
  "পরিবহন",
  "ফার্নিচার/ডেকোরেশন",
  "ক্রোকারিজ",
  "সেনিটারি",
  "নির্মাণ",
  "চিকিৎসা",
  "যোগাযোগ",
  "লাইব্রেরি",
  "খেলাধুলা",
  "শিক্ষা সফর",
  "করযে হাসানাহ পরিশোধ",
  "অন্যান্য"
];

const BANGAL_MONTHS = [
  { value: "01", label: "জানুয়ারি" },
  { value: "02", label: "ফেব্রুয়ারি" },
  { value: "03", label: "মার্চ" },
  { value: "04", label: "এপ্রিল" },
  { value: "05", label: "মে" },
  { value: "06", label: "জুন" },
  { value: "07", label: "জুলাই" },
  { value: "08", label: "আগস্ট" },
  { value: "09", label: "সেপ্টেম্বর" },
  { value: "10", label: "অক্টোবর" },
  { value: "11", label: "নভেম্বর" },
  { value: "12", label: "ডিসেম্বর" }
];

export default function FinanceDashboard() {
  const [activeTab, setActiveTab] = useState('overview'); // overview, income, expense, report
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Date states
  const today = new Date();
  const currentYear = today.getFullYear().toString();
  const currentMonthNum = String(today.getMonth() + 1).padStart(2, '0');

  // Filter States for Overview & Reports
  const [reportYear, setReportYear] = useState(currentYear);
  const [reportMonth, setReportMonth] = useState(currentMonthNum);
  const [summaryData, setSummaryData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    incomeBreakdown: [],
    expenseBreakdown: []
  });

  // Overview transactions states
  const [transactions, setTransactions] = useState([]);
  const [txPage, setTxPage] = useState(1);
  const [txTotalPages, setTxTotalPages] = useState(1);
  const [txFilterType, setTxFilterType] = useState('all');
  const [txSearch, setTxSearch] = useState('');
  const [txStartDate, setTxStartDate] = useState('');
  const [txEndDate, setTxEndDate] = useState('');

  // Income Form States
  const [incomeForm, setIncomeForm] = useState({
    receiptNo: '',
    payerName: '',
    date: today.toISOString().split('T')[0],
    month: `${currentYear}-${currentMonthNum}`,
    paymentMethod: 'Cash',
    description: '',
    items: [{ head: INCOME_HEADS[0], amount: '' }]
  });

  // Expense Form States
  const [expenseForm, setExpenseForm] = useState({
    voucherNo: '',
    receiverName: '',
    advanceAmount: '',
    chequeNo: '',
    date: today.toISOString().split('T')[0],
    month: `${currentYear}-${currentMonthNum}`,
    description: '',
    items: [{ head: EXPENSE_HEADS[0], amount: '' }]
  });

  // Fetch Summary and Transactions on load or filter change
  useEffect(() => {
    fetchSummary();
  }, [reportMonth, reportYear]);

  useEffect(() => {
    fetchTransactions();
  }, [txPage, txFilterType, txStartDate, txEndDate, txSearch]);

  // Alert Handler Helper
  const triggerNotification = (type, msg) => {
    if (type === 'success') {
      setSuccessMsg(msg);
      setErrorMsg('');
      setTimeout(() => setSuccessMsg(''), 5000);
    } else {
      setErrorMsg(msg);
      setSuccessMsg('');
      setTimeout(() => setErrorMsg(''), 5000);
    }
  };

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/finance/summary?month=${reportMonth}&year=${reportYear}`);
      const data = await res.json();
      if (data.success) {
        setSummaryData(data.data);
      } else {
        triggerNotification('error', data.message || 'সারসংক্ষেপ লোড করতে ব্যর্থ হয়েছে।');
      }
    } catch (err) {
      console.error(err);
      triggerNotification('error', 'সার্ভারের সাথে সংযোগ স্থাপন করা যাচ্ছে না।');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      let url = `${API_BASE_URL}/api/finance/transactions?page=${txPage}&limit=10&type=${txFilterType}`;
      if (txSearch) url += `&search=${encodeURIComponent(txSearch)}`;
      if (txStartDate) url += `&startDate=${txStartDate}`;
      if (txEndDate) url += `&endDate=${txEndDate}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setTransactions(data.data);
        setTxTotalPages(data.totalPages || 1);
      } else {
        triggerNotification('error', data.message || 'লেনদেনের তালিকা লোড করতে ব্যর্থ হয়েছে।');
      }
    } catch (err) {
      console.error(err);
      triggerNotification('error', 'লেনদেনের তালিকা লোড করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  // Income Items handlers
  const handleAddIncomeRow = () => {
    setIncomeForm({
      ...incomeForm,
      items: [...incomeForm.items, { head: INCOME_HEADS[0], amount: '' }]
    });
  };

  const handleRemoveIncomeRow = (index) => {
    const newItems = [...incomeForm.items];
    newItems.splice(index, 1);
    setIncomeForm({ ...incomeForm, items: newItems });
  };

  const handleIncomeRowChange = (index, field, value) => {
    const newItems = [...incomeForm.items];
    newItems[index][field] = value;
    setIncomeForm({ ...incomeForm, items: newItems });
  };

  // Expense Items handlers
  const handleAddExpenseRow = () => {
    setExpenseForm({
      ...expenseForm,
      items: [...expenseForm.items, { head: EXPENSE_HEADS[0], amount: '' }]
    });
  };

  const handleRemoveExpenseRow = (index) => {
    const newItems = [...expenseForm.items];
    newItems.splice(index, 1);
    setExpenseForm({ ...expenseForm, items: newItems });
  };

  const handleExpenseRowChange = (index, field, value) => {
    const newItems = [...expenseForm.items];
    newItems[index][field] = value;
    setExpenseForm({ ...expenseForm, items: newItems });
  };

  // Submit Handlers
  const handleIncomeSubmit = async (e) => {
    e.preventDefault();
    // Validation
    const validItems = incomeForm.items.filter(item => item.amount !== '' && parseFloat(item.amount) > 0);
    if (validItems.length === 0) {
      triggerNotification('error', 'কমপক্ষে একটি খাতে সঠিক টাকার পরিমাণ দিতে হবে।');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/finance/income`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...incomeForm,
          items: validItems
        })
      });
      const data = await res.json();
      if (data.success) {
        triggerNotification('success', 'আয়ের তথ্য সফলভাবে সংরক্ষণ করা হয়েছে!');
        // Reset form
        setIncomeForm({
          receiptNo: '',
          payerName: '',
          date: today.toISOString().split('T')[0],
          month: `${currentYear}-${currentMonthNum}`,
          paymentMethod: 'Cash',
          description: '',
          items: [{ head: INCOME_HEADS[0], amount: '' }]
        });
        fetchSummary();
        fetchTransactions();
        setActiveTab('overview');
      } else {
        triggerNotification('error', data.message || 'ডাটা সেভ করা যায়নি।');
      }
    } catch (err) {
      console.error(err);
      triggerNotification('error', 'সার্ভারে রিকোয়েস্ট পাঠাতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    // Validation
    const validItems = expenseForm.items.filter(item => item.amount !== '' && parseFloat(item.amount) > 0);
    if (validItems.length === 0) {
      triggerNotification('error', 'কমপক্ষে একটি খাতে সঠিক ব্যয়ের পরিমাণ দিতে হবে।');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/finance/expense`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...expenseForm,
          items: validItems
        })
      });
      const data = await res.json();
      if (data.success) {
        triggerNotification('success', 'ব্যয় ভাউচার সফলভাবে সংরক্ষণ করা হয়েছে!');
        // Reset form
        setExpenseForm({
          voucherNo: '',
          receiverName: '',
          advanceAmount: '',
          chequeNo: '',
          date: today.toISOString().split('T')[0],
          month: `${currentYear}-${currentMonthNum}`,
          description: '',
          items: [{ head: EXPENSE_HEADS[0], amount: '' }]
        });
        fetchSummary();
        fetchTransactions();
        setActiveTab('overview');
      } else {
        triggerNotification('error', data.message || 'ভাউচার সেভ করা যায়নি।');
      }
    } catch (err) {
      console.error(err);
      triggerNotification('error', 'সার্ভারে রিকোয়েস্ট পাঠাতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  // Printing Layout
  const handlePrint = () => {
    window.print();
  };

  // Helper translations for dates & formats
  const formatBanglaNumber = (num) => {
    const englishToBangla = {
      '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
      '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
    };
    return String(num).split('').map(char => englishToBangla[char] || char).join('');
  };

  const getMonthLabel = (monthVal) => {
    const match = BANGAL_MONTHS.find(m => m.value === monthVal);
    return match ? match.label : monthVal;
  };

  // Dynamic calculations for preview
  const currentIncomeTotal = incomeForm.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const currentExpenseTotal = expenseForm.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const currentExpenseBalance = (parseFloat(expenseForm.advanceAmount) || 0) - currentExpenseTotal;

  return (
    <div className="space-y-6 w-full print:bg-white print:text-black">
      
      {/* Messages Alerts */}
      {successMsg && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-lg border border-emerald-400 animate-slide-in">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-semibold">{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-red-500 text-white px-4 py-3 rounded-xl shadow-lg border border-red-400 animate-slide-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* Top Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-900/10 pb-5 print:hidden">
        <div>
          <h1 className="text-2xl font-black text-emerald-950 flex items-center gap-2">
            <span>🕌</span> আর্থিক ব্যবস্থাপনা মডিউল (Income & Expense)
          </h1>
          <p className="text-sm text-slate-500 font-medium">মাদরাসার দৈনন্দিন আয় এবং ব্যয় ভাউচার এন্ট্রি, ট্র্যাকিং ও হিসাব নিকাশ</p>
        </div>
        
        {/* Month/Year Selection for Summary & Statement */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-emerald-900/10 shadow-xs">
          <Calendar className="w-4 h-4 text-emerald-800" />
          <select
            value={reportMonth}
            onChange={(e) => setReportMonth(e.target.value)}
            className="text-xs font-bold text-slate-700 bg-transparent border-none focus:outline-none"
          >
            {BANGAL_MONTHS.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <select
            value={reportYear}
            onChange={(e) => setReportYear(e.target.value)}
            className="text-xs font-bold text-slate-700 bg-transparent border-none focus:outline-none"
          >
            {["২০২৫", "২০২৬", "২০২৭", "২০২৮"].map(yr => {
              const engYear = yr.replace(/[০-৯]/g, d => "০১২৩৪৫৬৭৮৯".indexOf(d));
              return <option key={engYear} value={engYear}>{yr}</option>;
            })}
          </select>
          <button 
            onClick={fetchSummary}
            className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            title="রিফ্রেশ"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Modern Tabs Navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 pb-px print:hidden scrollbar-none">
        {[
          { id: 'overview', label: '📊 ওভারভিউ ড্যাশবোর্ড' },
          { id: 'income', label: '📥 আয় এন্ট্রি (রসিদ)' },
          { id: 'expense', label: '📤 ব্যয় এন্ট্রি (ভাউচার)' },
          { id: 'report', label: '📋 মাসিক আর্থিক বিবরণী' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-5 text-sm font-bold border-b-2 whitespace-nowrap transition-all duration-200 rounded-t-lg ${
              activeTab === tab.id
                ? 'border-emerald-750 text-emerald-950 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub-tab 1: Overview Dashboard */}
      {activeTab === 'overview' && (
        <div className="space-y-6 print:hidden">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Income */}
            <div className="bg-white p-6 rounded-2xl border border-emerald-900/10 shadow-xs hover:shadow-md transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-extrabold text-slate-500 tracking-wider uppercase">মোট আয় ({getMonthLabel(reportMonth)})</p>
                  <h3 className="text-3xl font-black text-emerald-900 mt-2">
                    ৳ {formatBanglaNumber(summaryData.totalIncome.toLocaleString('bn-BD'))}
                  </h3>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl group-hover:bg-emerald-100 transition-colors">
                  <TrendingUp className="w-6 h-6 text-emerald-705" />
                </div>
              </div>
              <div className="mt-4 text-xs font-bold text-emerald-800 flex items-center gap-1">
                <span>🎯</span> মোট আয়ের খাত: {formatBanglaNumber(summaryData.incomeBreakdown.length)} টি
              </div>
            </div>

            {/* Total Expense */}
            <div className="bg-white p-6 rounded-2xl border border-emerald-900/10 shadow-xs hover:shadow-md transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-extrabold text-slate-500 tracking-wider uppercase">মোট ব্যয় ({getMonthLabel(reportMonth)})</p>
                  <h3 className="text-3xl font-black text-rose-900 mt-2">
                    ৳ {formatBanglaNumber(summaryData.totalExpense.toLocaleString('bn-BD'))}
                  </h3>
                </div>
                <div className="p-4 bg-rose-50 rounded-2xl group-hover:bg-rose-100 transition-colors">
                  <TrendingDown className="w-6 h-6 text-rose-700" />
                </div>
              </div>
              <div className="mt-4 text-xs font-bold text-rose-800 flex items-center gap-1">
                <span>🎯</span> মোট ব্যয়ের খাত: {formatBanglaNumber(summaryData.expenseBreakdown.length)} টি
              </div>
            </div>

            {/* Net Balance */}
            <div className="bg-white p-6 rounded-2xl border border-emerald-900/10 shadow-xs hover:shadow-md transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-extrabold text-slate-500 tracking-wider uppercase">উদ্বৃত্ত/চলতি ব্যালেন্স</p>
                  <h3 className={`text-3xl font-black mt-2 ${summaryData.netBalance >= 0 ? 'text-blue-900' : 'text-amber-900'}`}>
                    ৳ {formatBanglaNumber(summaryData.netBalance.toLocaleString('bn-BD'))}
                  </h3>
                </div>
                <div className={`p-4 rounded-2xl transition-colors ${summaryData.netBalance >= 0 ? 'bg-blue-50 group-hover:bg-blue-100' : 'bg-amber-50 group-hover:bg-amber-100'}`}>
                  <Scale className={`w-6 h-6 ${summaryData.netBalance >= 0 ? 'text-blue-700' : 'text-amber-700'}`} />
                </div>
              </div>
              <div className="mt-4 text-xs font-bold flex items-center gap-1">
                {summaryData.netBalance >= 0 ? (
                  <span className="text-blue-700">🟢 উদ্বৃত্ত তহবিল রয়েছে</span>
                ) : (
                  <span className="text-amber-700">🔴 ঘাটতি রয়েছে</span>
                )}
              </div>
            </div>
          </div>

          {/* Transactions History and Search */}
          <div className="bg-white rounded-2xl border border-emerald-900/10 shadow-xs p-6 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-emerald-950">লেনদেনের ইতিহাস</h3>
                <p className="text-xs text-slate-400 font-medium">আয় ও ব্যয়ের সাম্প্রতিক এন্ট্রিসমূহ</p>
              </div>

              {/* Filtering Controls */}
              <div className="flex flex-wrap items-center gap-2">
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
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-emerald-700"
                >
                  <option value="all">সকল লেনদেন</option>
                  <option value="income">শুধুমাত্র আয় (Income)</option>
                  <option value="expense">শুধুমাত্র ব্যয় (Expense)</option>
                </select>

                {/* Date range filter */}
                <div className="flex items-center gap-1 text-xs">
                  <input
                    type="date"
                    value={txStartDate}
                    onChange={(e) => {
                      setTxStartDate(e.target.value);
                      setTxPage(1);
                    }}
                    className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                  <span className="text-slate-400">থেকে</span>
                  <input
                    type="date"
                    value={txEndDate}
                    onChange={(e) => {
                      setTxEndDate(e.target.value);
                      setTxPage(1);
                    }}
                    className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
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
                  className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-600 transition-colors"
                  title="ফিল্টার মুছে ফেলুন"
                >
                  মুছে ফেলুন
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-600 font-bold">
                    <th className="p-4 text-center w-12">প্রকার</th>
                    <th className="p-4">তারিখ</th>
                    <th className="p-4">রসিদ/ভাউচার নং</th>
                    <th className="p-4">নাম (দাতা/গ্রহীতা)</th>
                    <th className="p-4">খাত ও বিবরণ</th>
                    <th className="p-4 text-right">টাকার পরিমাণ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-400">
                        কোনো লেনদেনের তথ্য পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr key={tx._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 text-center">
                          {tx.type === 'income' ? (
                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full font-bold">আয়</span>
                          ) : (
                            <span className="px-2.5 py-1 bg-rose-50 text-rose-800 border border-rose-100 rounded-full font-bold">ব্যয়</span>
                          )}
                        </td>
                        <td className="p-4 whitespace-nowrap">{formatBanglaNumber(tx.date)}</td>
                        <td className="p-4 font-mono font-bold text-emerald-950">
                          {tx.type === 'income' ? tx.receiptNo : tx.voucherNo}
                        </td>
                        <td className="p-4 font-semibold text-slate-800">
                          {tx.type === 'income' ? tx.payerName : tx.receiverName}
                        </td>
                        <td className="p-4">
                          <div className="text-slate-800 font-bold">
                            {tx.items.map(it => it.head).join(', ')}
                          </div>
                          {tx.description && (
                            <span className="text-[10px] text-slate-400 block font-normal mt-0.5">{tx.description}</span>
                          )}
                        </td>
                        <td className={`p-4 text-right font-black text-sm whitespace-nowrap ${tx.type === 'income' ? 'text-emerald-800' : 'text-rose-800'}`}>
                          ৳ {formatBanglaNumber((tx.totalIncome || tx.totalExpense || 0).toLocaleString('bn-BD'))}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {txTotalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
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
      )}

      {/* Sub-tab 2: Add Income Form (আয় এন্ট্রি) */}
      {activeTab === 'income' && (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-emerald-900/10 shadow-xs p-6 md:p-8 print:hidden">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
            <div className="p-3 bg-emerald-50 text-emerald-850 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-emerald-955">আয় এন্ট্রি করুন (রসিদ ফরম)</h2>
              <p className="text-xs text-slate-400 font-medium">মাদরাসার আয়ের খাত অনুযায়ী সরাসরি কালেকশন এন্ট্রি</p>
            </div>
          </div>

          <form onSubmit={handleIncomeSubmit} className="space-y-6">
            {/* Metadata Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">রসিদ নম্বর (ইচ্ছাধীন)</label>
                <input
                  type="text"
                  placeholder="যেমন: REC-১২৩৪৫"
                  value={incomeForm.receiptNo}
                  onChange={(e) => setIncomeForm({ ...incomeForm, receiptNo: e.target.value })}
                  className="px-3 py-2.5 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">দাতা বা শিক্ষার্থীর নাম</label>
                <input
                  type="text"
                  placeholder="দাতার/শিক্ষার্থীর নাম লিখুন"
                  value={incomeForm.payerName}
                  onChange={(e) => setIncomeForm({ ...incomeForm, payerName: e.target.value })}
                  className="px-3 py-2.5 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">তারিখ</label>
                <input
                  type="date"
                  value={incomeForm.date}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    const parts = selectedDate.split('-');
                    setIncomeForm({
                      ...incomeForm,
                      date: selectedDate,
                      month: `${parts[0]}-${parts[1]}`
                    });
                  }}
                  className="px-3 py-2.5 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">পেমেন্ট মেথড</label>
                <select
                  value={incomeForm.paymentMethod}
                  onChange={(e) => setIncomeForm({ ...incomeForm, paymentMethod: e.target.value })}
                  className="px-3 py-2.5 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700"
                >
                  <option value="Cash">Cash (নগদ)</option>
                  <option value="Bank">Bank Account (ব্যাংক হিসাব)</option>
                  <option value="Cheque">Cheque (চেক)</option>
                  <option value="bKash">bKash (বিকাশ)</option>
                  <option value="Nagad">Nagad (নগদ মোবাইল ব্যাংকিং)</option>
                  <option value="Rocket">Rocket (রকেট)</option>
                </select>
              </div>
            </div>

            {/* Income Sector Fields */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">আয়ের খাতসমূহ ও টাকার পরিমাণ</h3>
                <button
                  type="button"
                  onClick={handleAddIncomeRow}
                  className="flex items-center gap-1 text-[11px] font-black text-emerald-800 hover:text-emerald-950 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> খাত যোগ করুন
                </button>
              </div>

              {incomeForm.items.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <div className="flex-1">
                    <select
                      value={item.head}
                      onChange={(e) => handleIncomeRowChange(idx, 'head', e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700"
                    >
                      {INCOME_HEADS.map(head => (
                        <option key={head} value={head}>{head}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="w-36 md:w-48">
                    <input
                      type="number"
                      placeholder="টাকা (৳)"
                      min="0"
                      value={item.amount}
                      onChange={(e) => handleIncomeRowChange(idx, 'amount', e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700 text-right"
                      required
                    />
                  </div>

                  {incomeForm.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveIncomeRow(idx)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Calculations and Description */}
            <div className="border-t border-slate-100 pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-xl">
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-600 block mb-1">মন্তব্য/বিবরণ (ঐচ্ছিক)</label>
                <textarea
                  placeholder="লেনদেন সংক্রান্ত অতিরিক্ত তথ্য"
                  value={incomeForm.description}
                  onChange={(e) => setIncomeForm({ ...incomeForm, description: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700 h-16 resize-none"
                />
              </div>

              <div className="text-right whitespace-nowrap min-w-[150px]">
                <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">সর্বমোট জমা (৳)</p>
                <p className="text-3xl font-black text-emerald-900 mt-1">
                  ৳ {formatBanglaNumber(currentIncomeTotal.toLocaleString('bn-BD'))}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                বাতিল করুন
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-950 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'সংরক্ষণ করুন'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sub-tab 3: Add Expense Form (ব্যয় এন্ট্রি/ভাউচার এন্ট্রি) */}
      {activeTab === 'expense' && (
        <div className="max-w-4xl mx-auto bg-white border-2 border-emerald-900/10 rounded-2xl shadow-xs overflow-hidden print:hidden">
          {/* Header Banner representing physical Madrasa Voucher header */}
          <div className="bg-emerald-900 text-white p-6 text-center space-y-1">
            <h2 className="text-xl font-black tracking-wide">আস-সালাম আইডিয়াল মাদরাসা</h2>
            <p className="text-xs text-emerald-100 font-medium">হবিগঞ্জ সদর, হবিগঞ্জ</p>
            <div className="inline-block bg-white text-emerald-950 font-black text-xs px-4 py-1.5 rounded-full mt-3 shadow-xs">
              খরচ ভাউচার ফর্ম (Voucher Entry)
            </div>
          </div>

          <form onSubmit={handleExpenseSubmit} className="p-6 md:p-8 space-y-6">
            {/* Voucher Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">ভাউচার নম্বর (ঐচ্ছিক)</label>
                <input
                  type="text"
                  placeholder="স্বয়ংক্রিয় তৈরি হবে"
                  value={expenseForm.voucherNo}
                  onChange={(e) => setExpenseForm({ ...expenseForm, voucherNo: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">গ্রহীতার নাম (Receiver Name)</label>
                <input
                  type="text"
                  placeholder="গ্রহীতার নাম লিখুন"
                  value={expenseForm.receiverName}
                  onChange={(e) => setExpenseForm({ ...expenseForm, receiverName: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">তারিখ</label>
                <input
                  type="date"
                  value={expenseForm.date}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    const parts = selectedDate.split('-');
                    setExpenseForm({
                      ...expenseForm,
                      date: selectedDate,
                      month: `${parts[0]}-${parts[1]}`
                    });
                  }}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">গৃহীত অগ্রীম টাকা (ঐচ্ছিক)</label>
                <input
                  type="number"
                  placeholder="যেমন: ৫০০০"
                  value={expenseForm.advanceAmount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, advanceAmount: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">চেক নং (ঐচ্ছিক)</label>
                <input
                  type="text"
                  placeholder="চেক নং (ব্যাংক হলে)"
                  value={expenseForm.chequeNo}
                  onChange={(e) => setExpenseForm({ ...expenseForm, chequeNo: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700"
                />
              </div>
            </div>

            {/* Voucher Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">ব্যয়ের হিসাব/খাতসমূহ</h3>
                <button
                  type="button"
                  onClick={handleAddExpenseRow}
                  className="flex items-center gap-1 text-[11px] font-black text-emerald-800 hover:text-emerald-950 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> খরচ খাত যোগ করুন
                </button>
              </div>

              {expenseForm.items.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <div className="flex-1">
                    <select
                      value={item.head}
                      onChange={(e) => handleExpenseRowChange(idx, 'head', e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700"
                    >
                      {EXPENSE_HEADS.map(head => (
                        <option key={head} value={head}>{head}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="w-36 md:w-48">
                    <input
                      type="number"
                      placeholder="টাকা (৳)"
                      min="0"
                      value={item.amount}
                      onChange={(e) => handleExpenseRowChange(idx, 'amount', e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700 text-right"
                      required
                    />
                  </div>

                  {expenseForm.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveExpenseRow(idx)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Calculations Banner */}
            <div className="border-t border-slate-100 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl">
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">মন্তব্য/খরচের অতিরিক্ত বিবরণ</label>
                <textarea
                  placeholder="ভাউচার বা খরচ সংক্রান্ত অতিরিক্ত নোট"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700 h-16 resize-none"
                />
              </div>

              <div className="flex flex-col justify-end text-right text-xs font-bold space-y-1">
                <div className="flex justify-between border-b border-slate-200/60 pb-1">
                  <span className="text-slate-500">মোট খরচ:</span>
                  <span className="text-rose-950 font-black">৳ {formatBanglaNumber(currentExpenseTotal.toLocaleString('bn-BD'))}</span>
                </div>
                {expenseForm.advanceAmount && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">উদ্বৃত্ত/ঋণ:</span>
                    <span className={`font-black ${currentExpenseBalance >= 0 ? 'text-emerald-800' : 'text-rose-850'}`}>
                      {currentExpenseBalance >= 0 ? 'উদ্বৃত্ত: ' : 'ঘাটতি/ঋণ: '} 
                      ৳ {formatBanglaNumber(Math.abs(currentExpenseBalance).toLocaleString('bn-BD'))}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                বাতিল করুন
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-rose-800 hover:bg-rose-950 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'ভাউচার সেভ করুন'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sub-tab 4: Monthly Financial Report (মাসিক আর্থিক বিবরণী) */}
      {activeTab === 'report' && (
        <div className="space-y-6">
          {/* Controls for filtering/printing */}
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-emerald-900/10 shadow-xs print:hidden">
            <div>
              <p className="text-xs text-slate-400 font-bold">বিবরণী ডাউনলোড ও প্রিন্ট করুন</p>
            </div>
            
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-950 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" /> প্রিন্ট করুন (A4 PDF)
            </button>
          </div>

          {/* Physical Report Sheet Container */}
          <div className="bg-white border border-slate-200 p-6 md:p-12 rounded-2xl shadow-xs print:border-none print:shadow-none print:p-0 print:m-0">
            {/* Logo/Header */}
            <div className="text-center pb-8 border-b border-emerald-900/15">
              <h2 className="text-2xl font-black text-emerald-950">আস-সালাম আইডিয়াল মাদরাসা</h2>
              <p className="text-xs text-slate-500 font-bold mt-1">হবিগঞ্জ সদর, হবিগঞ্জ</p>
              <h3 className="text-base font-black bg-slate-100 border border-slate-200 inline-block px-6 py-1.5 rounded-full text-slate-700 mt-4 tracking-wide">
                মাসিক আয় ও ব্যয় বিবরণী
              </h3>
              <p className="text-xs text-emerald-800 font-extrabold mt-3 tracking-wider">
                মাস: {getMonthLabel(reportMonth)} | বছর: {formatBanglaNumber(reportYear)}
              </p>
            </div>

            {/* Dual Column Sheet (Income vs Expense) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 border-x border-b border-slate-200 mt-6 print:grid-cols-2">
              
              {/* Income Column */}
              <div className="bg-white p-5 space-y-4">
                <h4 className="text-xs font-extrabold text-emerald-900 uppercase tracking-widest border-b-2 border-emerald-100 pb-2 flex items-center justify-between">
                  <span>📥 আয়ের খাতসমূহ (Income Sector)</span>
                  <span className="text-[10px] text-slate-400">টাকা (৳)</span>
                </h4>
                
                {summaryData.incomeBreakdown.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">কোনো আয়ের এন্ট্রি নেই</p>
                ) : (
                  <div className="divide-y divide-slate-100 font-semibold text-slate-700 text-xs">
                    {summaryData.incomeBreakdown.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-2.5">
                        <span className="pr-4">{item.head}</span>
                        <span className="font-bold text-slate-900 whitespace-nowrap">৳ {formatBanglaNumber(item.amount.toLocaleString('bn-BD'))}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Expense Column */}
              <div className="bg-white p-5 space-y-4">
                <h4 className="text-xs font-extrabold text-rose-900 uppercase tracking-widest border-b-2 border-rose-100 pb-2 flex items-center justify-between">
                  <span>📤 ব্যয়ের খাতসমূহ (Expense Sector)</span>
                  <span className="text-[10px] text-slate-400">টাকা (৳)</span>
                </h4>

                {summaryData.expenseBreakdown.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">কোনো ব্যয়ের এন্ট্রি নেই</p>
                ) : (
                  <div className="divide-y divide-slate-100 font-semibold text-slate-700 text-xs">
                    {summaryData.expenseBreakdown.map((item, idx) => (
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200 border-x border-b border-slate-200 text-xs font-black print:grid-cols-3">
              <div className="bg-emerald-50/50 p-4 text-emerald-950 flex justify-between items-center">
                <span>সর্বমোট আয়:</span>
                <span className="text-sm">৳ {formatBanglaNumber(summaryData.totalIncome.toLocaleString('bn-BD'))}</span>
              </div>
              <div className="bg-rose-50/50 p-4 text-rose-950 flex justify-between items-center">
                <span>সর্বমোট ব্যয়:</span>
                <span className="text-sm">৳ {formatBanglaNumber(summaryData.totalExpense.toLocaleString('bn-BD'))}</span>
              </div>
              <div className={`p-4 flex justify-between items-center ${summaryData.netBalance >= 0 ? 'bg-blue-50/60 text-blue-950' : 'bg-amber-50/60 text-amber-950'}`}>
                <span>নেট ব্যালেন্স (উদ্বৃত্ত):</span>
                <span className="text-sm">৳ {formatBanglaNumber(summaryData.netBalance.toLocaleString('bn-BD'))}</span>
              </div>
            </div>

            {/* Signature Area (Print only or at bottom of document) */}
            <div className="grid grid-cols-3 gap-6 pt-16 text-center text-xs font-bold text-slate-500 mt-10 print:mt-14">
              <div className="border-t border-slate-300 pt-2 mx-4">
                <p>হিসাবরক্ষক</p>
                <span className="text-[10px] text-slate-400 block font-normal mt-1">ক্যাশিয়ার / মুহাসিব</span>
              </div>
              <div className="border-t border-slate-300 pt-2 mx-4">
                <p>যাচাইকারী</p>
                <span className="text-[10px] text-slate-400 block font-normal mt-1">অর্থ সম্পাদক</span>
              </div>
              <div className="border-t border-slate-300 pt-2 mx-4">
                <p>অনুমোদনকারী</p>
                <span className="text-[10px] text-slate-400 block font-normal mt-1">মুহতামিম / অধ্যক্ষ</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
