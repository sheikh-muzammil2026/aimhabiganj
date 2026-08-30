"use client";
import React, { useState, useEffect, useCallback } from 'react';
import {
  Printer,
  Calendar,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

import Overview from './components/Overview';
import IncomeEntry from './components/IncomeEntry';
import ExpenseEntry from './components/ExpenseEntry';
import MonthlyReport from './components/MonthlyReport';

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
  "আপ্যায়ন",
  "যাতায়াত",
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

// Parser helper for splitting combined payerName format: "donorName / studentId"
const parsePayerName = (payerName = '') => {
  if (!payerName) return { donorName: 'N/A', studentId: '' };
  if (payerName.includes(' / ')) {
    const parts = payerName.split(' / ');
    return {
      donorName: parts[0] || 'N/A',
      studentId: parts[1] || ''
    };
  }
  return {
    donorName: payerName,
    studentId: ''
  };
};

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

  // Pending transactions states
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(false);

  // Edit states
  const [editingId, setEditingId] = useState(null);
  const [editingType, setEditingType] = useState(null);

  // Income Form States (Updated to separate fields)
  const [incomeForm, setIncomeForm] = useState({
    receiptNo: '',
    donorName: '',
    studentId: '',
    date: today.toISOString().split('T')[0],
    month: `${currentYear}-${currentMonthNum}`,
    paymentMethod: 'Cash',
    description: '',
    items: [{ head: INCOME_HEADS[0], amount: '' }]
  });

  // Expense Form States (Renamed Recipient placeholder to Spender)
  const [expenseForm, setExpenseForm] = useState({
    voucherNo: '',
    receiverName: '', // Maps to Spender Name
    advanceAmount: '',
    chequeNo: '',
    date: today.toISOString().split('T')[0],
    month: `${currentYear}-${currentMonthNum}`,
    description: '',
    items: [{ head: EXPENSE_HEADS[0], amount: '' }]
  });

  // Print Preview / Media Print State
  const [printData, setPrintData] = useState(null);

  // Alert Handler Helper
  const triggerNotification = useCallback((type, msg) => {
    if (type === 'success') {
      setSuccessMsg(msg);
      setErrorMsg('');
      setTimeout(() => setSuccessMsg(''), 5000);
    } else {
      setErrorMsg(msg);
      setSuccessMsg('');
      setTimeout(() => setErrorMsg(''), 5000);
    }
  }, []);

  const fetchSummary = useCallback(async () => {
    await Promise.resolve(); // yield to microtask to prevent sync setState in useEffect
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
  }, [reportMonth, reportYear, triggerNotification, setLoading, setSummaryData]);

  const fetchTransactions = useCallback(async () => {
    await Promise.resolve(); // yield to microtask to prevent sync setState in useEffect
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
  }, [txPage, txFilterType, txStartDate, txEndDate, txSearch, triggerNotification, setLoading, setTransactions, setTxTotalPages]);

  const fetchPendingTransactions = useCallback(async () => {
    try {
      setPendingLoading(true);
      const res = await fetch(API_BASE_URL + '/api/finance/transactions?limit=1000&status=pending');
      const data = await res.json();
      if (data.success) {
        setPendingTransactions(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching pending transactions:", err);
    } finally {
      setPendingLoading(false);
    }
  }, [setPendingLoading, setPendingTransactions]);

  const handleApprove = async (txId, type) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই লেনদেনটি অনুমোদন করতে চান?')) return;
    try {
      setLoading(true);
      const res = await fetch(API_BASE_URL + '/api/finance/approve', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: txId, type })
      });
      const data = await res.json();
      if (data.success) {
        triggerNotification('success', 'লেনদেনটি সফলভাবে অনুমোদন করা হয়েছে!');
        fetchSummary();
        fetchTransactions();
        fetchPendingTransactions();
      } else {
        triggerNotification('error', data.message || 'অনুমোদন করা যায়নি।');
      }
    } catch (err) {
      console.error(err);
      triggerNotification('error', 'সার্ভারে রিকোয়েস্ট পাঠাতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tx) => {
    setEditingId(tx._id);
    setEditingType(tx.type);
    if (tx.type === 'income') {
      const parsed = parsePayerName(tx.payerName);
      setIncomeForm({
        receiptNo: tx.receiptNo || '',
        payerType: tx.payerType || (parsed.studentId ? 'student' : 'donor'),
        donorName: tx.donorName || parsed.donorName || '',
        studentId: tx.studentId || parsed.studentId || '',
        studentName: tx.studentName || (parsed.studentId ? parsed.donorName : ''),
        className: tx.className || '',
        discount: tx.discount !== undefined ? tx.discount.toString() : '',
        date: tx.date || today.toISOString().split('T')[0],
        month: tx.month || (currentYear + '-' + currentMonthNum),
        paymentMethod: tx.paymentMethod || 'Cash',
        description: tx.description || '',
        items: tx.items && tx.items.length > 0 ? tx.items.map(it => ({ head: it.head, amount: it.amount.toString() })) : [{ head: INCOME_HEADS[0], amount: '' }]
      });
      setActiveTab('income');
    } else {
      setExpenseForm({
        voucherNo: tx.voucherNo || '',
        receiverName: tx.receiverName || '',
        advanceAmount: tx.advanceAmount !== undefined ? tx.advanceAmount.toString() : '',
        chequeNo: tx.chequeNo || '',
        date: tx.date || today.toISOString().split('T')[0],
        month: tx.month || (currentYear + '-' + currentMonthNum),
        description: tx.description || '',
        items: tx.items && tx.items.length > 0 ? tx.items.map(it => ({
          head: it.head,
          amount: it.amount.toString(),
          institutionName: it.institutionName || '',
          shopVoucher: it.shopVoucher || ''
        })) : [{ head: EXPENSE_HEADS[0], amount: '', institutionName: '', shopVoucher: '' }],
        reimbursement: tx.reimbursement || { method: 'Cash', date: today.toISOString().split('T')[0], status: 'unpaid' }
      });
      setActiveTab('expense');
    }
  };

  // Fetch Summary and Transactions on load or filter change
  useEffect(() => {
    Promise.resolve().then(() => {
      fetchSummary();
    });
  }, [fetchSummary]);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchTransactions();
      fetchPendingTransactions();
    });
  }, [fetchTransactions, fetchPendingTransactions]);

  // Submit Handlers
  const handleIncomeSubmit = async (e) => {
    e.preventDefault();
    if (incomeForm.payerType === 'donor' && !incomeForm.donorName) {
      triggerNotification('error', 'দাতার নাম পূরণ করা আবশ্যক।');
      return;
    }
    if (incomeForm.payerType === 'student' && (!incomeForm.studentId || !incomeForm.studentName || !incomeForm.className)) {
      triggerNotification('error', 'শিক্ষার্থীর আইডি, নাম এবং ক্লাসের নাম পূরণ করা আবশ্যক।');
      return;
    }
    const validItems = incomeForm.items.filter(item => item.amount !== '' && parseFloat(item.amount) > 0);
    if (validItems.length === 0) {
      triggerNotification('error', 'কমপক্ষে একটি খাতে সঠিক টাকার পরিমাণ দিতে হবে।');
      return;
    }

    // Combine separate fields into single payerName for backend schema compatibility
    const payerNamePayload = incomeForm.payerType === 'student'
      ? incomeForm.studentName + ' / ' + incomeForm.studentId
      : incomeForm.donorName;

    try {
      setLoading(true);
      const url = editingId && editingType === 'income'
        ? API_BASE_URL + '/api/finance/income/' + editingId
        : API_BASE_URL + '/api/finance/income';
      const method = editingId && editingType === 'income' ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiptNo: incomeForm.receiptNo,
          payerName: payerNamePayload,
          payerType: incomeForm.payerType,
          donorName: incomeForm.donorName,
          studentId: incomeForm.studentId,
          studentName: incomeForm.studentName,
          className: incomeForm.className,
          discount: incomeForm.discount,
          date: incomeForm.date,
          month: incomeForm.month,
          paymentMethod: incomeForm.paymentMethod,
          description: incomeForm.description,
          items: validItems
        })
      });
      const data = await res.json();
      if (data.success) {
        triggerNotification('success', editingId ? 'আয়ের তথ্য সফলভাবে আপডেট করা হয়েছে!' : 'আয়ের তথ্য সফলভাবে সংরক্ষণ করা হয়েছে!');
        // Reset form
        setIncomeForm({
          receiptNo: '',
          payerType: 'donor',
          donorName: '',
          studentId: '',
          studentName: '',
          className: '',
          discount: '',
          date: today.toISOString().split('T')[0],
          month: currentYear + '-' + currentMonthNum,
          paymentMethod: 'Cash',
          description: '',
          items: [{ head: INCOME_HEADS[0], amount: '' }]
        });
        setEditingId(null);
        setEditingType(null);
        fetchSummary();
        fetchTransactions();
        fetchPendingTransactions();
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
    const validItems = expenseForm.items.filter(item => item.amount !== '' && parseFloat(item.amount) > 0);
    if (validItems.length === 0) {
      triggerNotification('error', 'কমপক্ষে একটি খাতে সঠিক ব্যয়ের পরিমাণ দিতে হবে।');
      return;
    }

    try {
      setLoading(true);
      const url = editingId && editingType === 'expense'
        ? API_BASE_URL + '/api/finance/expense/' + editingId
        : API_BASE_URL + '/api/finance/expense';
      const method = editingId && editingType === 'expense' ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...expenseForm,
          items: validItems
        })
      });
      const data = await res.json();
      if (data.success) {
        triggerNotification('success', editingId ? 'ব্যয় ভাউচার সফলভাবে আপডেট করা হয়েছে!' : 'ব্যয় ভাউচার সফলভাবে সংরক্ষণ করা হয়েছে!');
        // Reset form
        setExpenseForm({
          voucherNo: '',
          receiverName: '',
          advanceAmount: '',
          chequeNo: '',
          date: today.toISOString().split('T')[0],
          month: currentYear + '-' + currentMonthNum,
          description: '',
          items: [{ head: EXPENSE_HEADS[0], amount: '', institutionName: '', shopVoucher: '' }],
          reimbursement: { method: 'Cash', date: today.toISOString().split('T')[0], status: 'unpaid' }
        });
        setEditingId(null);
        setEditingType(null);
        fetchSummary();
        fetchTransactions();
        fetchPendingTransactions();
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

  return (
    <>
      <style>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
          }
          @page {
            size: A5 portrait;
            margin: 10mm !important;
          }
        }
      `}</style>

      {/* 1. Main Dashboard Area (Hidden when printing) */}
      <div className="space-y-6 w-full max-w-full overflow-x-hidden print:hidden bg-transparent">

        {/* Messages Alerts */}
        {successMsg && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-lg border border-emerald-400 animate-slide-in max-w-[calc(100vw-2rem)]">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-semibold truncate">{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-red-500 text-white px-4 py-3 rounded-xl shadow-lg border border-red-400 animate-slide-in max-w-[calc(100vw-2rem)]">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-semibold truncate">{errorMsg}</span>
          </div>
        )}

        {/* Top Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-900/10 pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-emerald-950 flex items-center gap-2 flex-wrap">
              <span>🕌</span> <span>আর্থিক ব্যবস্থাপনা মডিউল</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">মাদরাসার দৈনন্দিন আয় এবং ব্যয় ভাউচার এন্ট্রি, ট্র্যাকিং ও হিসাব নিকাশ</p>
          </div>

          {/* Month/Year Selection for Overview */}
          {activeTab === 'overview' && (
            <div className="flex items-center justify-between sm:justify-start gap-2 bg-white p-2 rounded-xl border border-emerald-900/10 shadow-xs shrink-0 w-full sm:w-auto">
              <div className="flex items-center gap-2 min-w-0">
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
              <button
                onClick={fetchSummary}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors shrink-0"
                title="রিফ্রেশ"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          )}
        </div>

        {/* Modern Tabs Navigation */}
        <div className="flex border-b border-slate-200 overflow-x-auto gap-1 sm:gap-2 pb-px scrollbar-none max-w-full">
          {[
            { id: 'overview', label: '📊 ওভারভিউ ড্যাশবোর্ড' },
            { id: 'income', label: '📥 আয় এন্ট্রি (রসিদ)' },
            { id: 'expense', label: '📤 ব্যয় এন্ট্রি (ভাউচার)' },
            { id: 'report', label: '📋 আর্থিক বিবরণী' },
            { id: 'pending', label: '⏳ পেন্ডিং ভাউচার/রসিদ' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2.5 sm:py-3 px-3 sm:px-5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all duration-200 rounded-t-lg shrink-0 ${activeTab === tab.id
                  ? 'border-emerald-750 text-emerald-950 bg-emerald-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab contents */}
        {activeTab === 'overview' && (
          <Overview
            summaryData={summaryData}
            reportMonth={reportMonth}
            reportYear={reportYear}
            getMonthLabel={getMonthLabel}
            formatBanglaNumber={formatBanglaNumber}
            loading={loading}
            fetchSummary={fetchSummary}
            transactions={transactions}
            txPage={txPage}
            txTotalPages={txTotalPages}
            setTxPage={setTxPage}
            txFilterType={txFilterType}
            setTxFilterType={setTxFilterType}
            txSearch={txSearch}
            setTxSearch={setTxSearch}
            txStartDate={txStartDate}
            setTxStartDate={setTxStartDate}
            txEndDate={txEndDate}
            setTxEndDate={setTxEndDate}
            onPrint={(tx) => setPrintData(tx)}
            onEdit={handleEdit}
          />
        )}

        {activeTab === 'income' && (
          <IncomeEntry
            incomeForm={incomeForm}
            setIncomeForm={setIncomeForm}
            INCOME_HEADS={INCOME_HEADS}
            loading={loading}
            onSubmit={handleIncomeSubmit}
            setActiveTab={setActiveTab}
            formatBanglaNumber={formatBanglaNumber}
          />
        )}

        {activeTab === 'expense' && (
          <ExpenseEntry
            expenseForm={expenseForm}
            setExpenseForm={setExpenseForm}
            EXPENSE_HEADS={EXPENSE_HEADS}
            loading={loading}
            onSubmit={handleExpenseSubmit}
            setActiveTab={setActiveTab}
            formatBanglaNumber={formatBanglaNumber}
          />
        )}

        {activeTab === 'report' && (
          <MonthlyReport
            reportYear={reportYear}
            setReportYear={setReportYear}
            reportMonth={reportMonth}
            setReportMonth={setReportMonth}
            summaryData={summaryData}
            BANGAL_MONTHS={BANGAL_MONTHS}
            getMonthLabel={getMonthLabel}
            formatBanglaNumber={formatBanglaNumber}
            loading={loading}
            fetchSummary={fetchSummary}
            onPrintReport={(reportJob) => setPrintData(reportJob)}
          />
        )}

        {activeTab === 'pending' && (
          <div className="bg-white rounded-2xl border border-emerald-900/10 shadow-xs p-4 sm:p-6 space-y-4 font-sans">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-emerald-955">পেন্ডিং ভাউচার/রসিদ তালিকা</h3>
              <p className="text-xs text-slate-400 font-medium">অনুমোদনের জন্য অপেক্ষারত আয় ও ব্যয়ের সাম্প্রতিক এন্ট্রিসমূহ</p>
            </div>

            {pendingLoading ? (
              <div className="flex flex-col items-center py-12 gap-2">
                <Loader2 className="w-8 h-8 text-emerald-800 animate-spin" />
                <span className="text-xs text-slate-500 font-bold">লোড হচ্ছে...</span>
              </div>
            ) : pendingTransactions.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-400 font-medium">
                কোনো পেন্ডিং লেনদেন পাওয়া যায়নি।
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="min-w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-650 font-bold">
                      <th className="p-3 text-center w-12">প্রকার</th>
                      <th className="p-3">তারিখ</th>
                      <th className="p-3">রসিদ/ভাউচার নং</th>
                      <th className="p-3">নাম (দাতা/গ্রহীতা)</th>
                      <th className="p-3">খাত ও বিবরণ</th>
                      <th className="p-3 text-right">টাকার পরিমাণ</th>
                      <th className="p-3 text-center w-36">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {pendingTransactions.map((tx) => (
                      <tr key={tx._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 text-center font-bold">
                          {tx.type === 'income' ? (
                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-850 border border-emerald-100 rounded-full font-bold inline-block">আয়</span>
                          ) : (
                            <span className="px-2.5 py-1 bg-rose-50 text-rose-850 border border-rose-100 rounded-full font-bold inline-block">ব্যয়</span>
                          )}
                        </td>
                        <td className="p-3">{formatBanglaNumber(tx.date)}</td>
                        <td className="p-3 font-mono font-bold text-emerald-955">
                          {tx.type === 'income' ? tx.receiptNo : tx.voucherNo}
                        </td>
                        <td className="p-3 font-semibold text-slate-800">
                          {tx.type === 'income' ? tx.payerName : tx.receiverName}
                        </td>
                        <td className="p-3">
                          <div className="text-slate-800 font-bold">
                            {tx.items.map(it => it.head).join(', ')}
                          </div>
                          {tx.description && (
                            <span className="text-[10px] text-slate-400 block font-normal mt-0.5">{tx.description}</span>
                          )}
                        </td>
                        <td className="p-3 text-right font-black text-slate-900">
                          ৳ {formatBanglaNumber((tx.totalIncome || tx.totalExpense || 0).toLocaleString('bn-BD'))}
                        </td>
                        <td className="p-3 text-center flex justify-center gap-1.5">
                          <button
                            onClick={() => handleApprove(tx._id, tx.type)}
                            className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-950 text-white rounded-lg text-[10px] font-black transition-colors"
                          >
                            অনুমোদন
                          </button>
                          <button
                            onClick={() => handleEdit(tx)}
                            className="px-2.5 py-1.5 bg-blue-800 hover:bg-blue-950 text-white rounded-lg text-[10px] font-black transition-colors"
                          >
                            সম্পাদনা
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. On-Screen Print Preview Modal (Hidden when printing) */}
      {printData && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 print:hidden">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-xs font-bold text-slate-800">
                {printData.type === 'report' ? 'রিপোর্ট প্রিন্ট প্রিভিউ' : (printData.type === 'income' ? 'রসিদ প্রিন্ট প্রিভিউ' : 'ভাউচার প্রিন্ট প্রিভিউ')}
              </h3>
              <button
                onClick={() => setPrintData(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold leading-none p-1 transition-colors"
                title="বন্ধ করুন"
              >
                &times;
              </button>
            </div>

            {/* Modal Body (Scrollable preview) */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-100/50">
              <div className="bg-white border border-slate-250 p-8 shadow-sm rounded-xl max-w-xl mx-auto">
                {printData.type === 'report' ? (
                  <ReportPrintLayout title={printData.title} period={printData.period} data={printData.data} formatBanglaNumber={formatBanglaNumber} getMonthLabel={getMonthLabel} />
                ) : (
                  <VoucherPrintLayout tx={printData} formatBanglaNumber={formatBanglaNumber} parsePayerName={parsePayerName} />
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
              <button
                onClick={() => setPrintData(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-650 hover:bg-slate-100 transition-colors"
              >
                বন্ধ করুন
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-950 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Printer className="w-4 h-4" /> প্রিন্ট করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Hidden Print-ready layout (Shown only when printing) */}
      <div className="hidden print:block w-full bg-white text-black p-0 m-0 print:border-none print:shadow-none">
        {printData && (
          printData.type === 'report' ? (
            <ReportPrintLayout title={printData.title} period={printData.period} data={printData.data} formatBanglaNumber={formatBanglaNumber} getMonthLabel={getMonthLabel} />
          ) : (
            <VoucherPrintLayout tx={printData} formatBanglaNumber={formatBanglaNumber} parsePayerName={parsePayerName} />
          )
        )}
      </div>
    </>
  );
}

// Print layouts
function VoucherPrintLayout({ tx, formatBanglaNumber, parsePayerName }) {
  const isIncome = tx.type === 'income';
  const parsed = parsePayerName(tx.payerName);

  const title = isIncome ? 'আয় আদায় রসিদ' : 'ব্যয় পরিশোধ ভাউচার';
  const idLabel = isIncome ? 'রসিদ নম্বর ' : 'ভাউচার নম্বর';
  const idValue = isIncome ? tx.receiptNo : tx.voucherNo;
  const dateValue = tx.date;
  const totalAmount = isIncome ? tx.totalIncome : tx.totalExpense;

  const isStudent = isIncome && (tx.payerType === 'student' || !!tx.studentId || (tx.payerName && tx.payerName.includes(' / ')));
  const deficit = !isIncome && tx.totalExpense > tx.advanceAmount ? tx.totalExpense - tx.advanceAmount : 0;

  return (
    <div className="space-y-4 text-black bg-white w-full max-w-full font-sans leading-relaxed text-xs">
      {/* Organisation Header */}
      <div className="text-center border-b-2 border-slate-400 pb-2">
        <h2 className="text-lg sm:text-xl font-black text-emerald-955">আস-সালাম আইডিয়াল মাদরাসা (এইম)</h2>
        <p className="text-[10px] text-slate-500 font-bold mt-0.5">হবিগঞ্জ সদর, হবিগঞ্জ</p>
        <p className="text-[9px] text-slate-400 font-medium">মোবাইল: ০১৭১২-৩৪৫৬৭৮ | ইমেইল: info@aim.com</p>

        <div className="inline-block border border-emerald-950 font-black text-[10px] uppercase px-4 py-1 rounded-md mt-2 tracking-wider bg-slate-50">
          {title}
        </div>
      </div>

      {/* Metadata Section */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] border-b border-dashed border-slate-300 pb-2">
        <div>
          <span className="font-bold text-slate-500">{idLabel}: </span>
          <span className="font-mono font-black text-emerald-955">{idValue}</span>
        </div>
        <div className="text-right">
          <span className="font-bold text-slate-500">তারিখ (Date): </span>
          <span className="font-bold">{formatBanglaNumber(dateValue)}</span>
        </div>

        {isIncome ? (
          isStudent ? (
            <>
              <div>
                <span className="font-bold text-slate-500">শিক্ষার্থীর নাম : </span>
                <span className="font-bold text-slate-800">{tx.studentName || parsed.donorName || 'N/A'}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-500">আইডি ও শ্রেণী: </span>
                <span className="font-bold text-slate-800">{tx.studentId || parsed.studentId || 'N/A'} ({tx.className || 'N/A'})</span>
              </div>
            </>
          ) : (
            <>
              <div>
                <span className="font-bold text-slate-500">দাতার নাম : </span>
                <span className="font-bold text-slate-800">{tx.donorName || parsed.donorName || 'N/A'}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-500">ধরণ: </span>
                <span className="font-bold text-slate-800">দাতা / অনুদানকারী</span>
              </div>
            </>
          )
        ) : (
          <>
            <div>
              <span className="font-bold text-slate-500">খরচকারির নাম: </span>
              <span className="font-bold text-slate-800">{tx.receiverName || 'N/A'}</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-500">চেক নং: </span>
              <span className="font-mono font-bold text-slate-800">{tx.chequeNo || 'N/A'}</span>
            </div>
          </>
        )}

        <div>
          <span className="font-bold text-slate-500">পেমেন্ট পদ্ধতি: </span>
          <span className="font-bold">{tx.paymentMethod || 'Cash'}</span>
        </div>
        {!isIncome && tx.advanceAmount > 0 && (
          <div className="text-right">
            <span className="font-bold text-slate-500">অগ্রীম গৃহীত: </span>
            <span className="font-bold">৳ {formatBanglaNumber(tx.advanceAmount.toLocaleString('bn-BD'))}</span>
          </div>
        )}
        {deficit > 0 && (
          <div className="sm:col-span-2 text-right">
            <span className="font-bold text-slate-500">ঘাটতি/ঋণ: </span>
            <span className="font-bold text-rose-900">৳ {formatBanglaNumber(deficit.toLocaleString('bn-BD'))}</span>
            {tx.reimbursement?.status === 'paid' && (
              <span className="text-emerald-600 font-bold ml-1.5">(paid)</span>
            )}
          </div>
        )}
      </div>

      {/* Particulars Table */}
      <table className="w-full text-[10px] text-left border border-collapse border-slate-300 font-medium">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-350 text-slate-700 font-bold">
            <th className="p-1.5 border border-slate-300 text-center w-10">ক্রমিক</th>
            <th className="p-1.5 border border-slate-300">হিসাবের খাত</th>
            <th className="p-1.5 border border-slate-300 text-right w-28">টাকার পরিমাণ</th>
          </tr>
        </thead>
        <tbody>
          {tx.items?.map((item, index) => (
            <tr key={index} className="border-b border-slate-200">
              <td className="p-1.5 border border-slate-300 text-center">{formatBanglaNumber(index + 1)}</td>
              <td className="p-1.5 border border-slate-300 font-semibold">
                <div>{item.head}</div>
                {!isIncome && (item.institutionName || item.shopVoucher) && (
                  <div className="text-[8px] text-slate-500 font-normal mt-0.5">
                    {item.institutionName && "সরবরাহকারী প্রতিষ্ঠান: " + item.institutionName}
                    {item.shopVoucher && " | মেমো নং: " + item.shopVoucher}
                  </div>
                )}
              </td>
              <td className="p-1.5 border border-slate-300 text-right font-bold">৳ {formatBanglaNumber(item.amount.toLocaleString('bn-BD'))}</td>
            </tr>
          ))}
          {isIncome && tx.discount > 0 && (
            <>
              <tr className="bg-slate-50/50 font-bold">
                <td colSpan="2" className="p-1.5 border border-slate-300 text-right">আসল মোট (Subtotal):</td>
                <td className="p-1.5 border border-slate-300 text-right">৳ {formatBanglaNumber((tx.totalIncome + tx.discount).toLocaleString('bn-BD'))}</td>
              </tr>
              <tr className="bg-slate-50/50 text-rose-800 font-bold">
                <td colSpan="2" className="p-1.5 border border-slate-300 text-right font-bold">ছাড় (Discount):</td>
                <td className="p-1.5 border border-slate-300 text-right font-bold">- ৳ {formatBanglaNumber(tx.discount.toLocaleString('bn-BD'))}</td>
              </tr>
            </>
          )}
          <tr className="bg-slate-50/50 font-black">
            <td colSpan="2" className="p-1.5 border border-slate-300 text-right">সর্বমোট (Total Amount):</td>
            <td className="p-1.5 border border-slate-300 text-right text-xs">৳ {formatBanglaNumber(totalAmount.toLocaleString('bn-BD'))}</td>
          </tr>
        </tbody>
      </table>

      {/* Remarks Section */}
      {tx.description && (
        <div className="text-[10px] bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          <span className="font-bold text-slate-500">বিবরণ / মন্তব্য: </span>
          <span className="text-slate-700 font-medium">{tx.description}</span>
        </div>
      )}

      {/* Signature Lines */}
      <div className="grid grid-cols-3 gap-6 pt-12 text-center text-[9px] font-bold text-slate-500">
        <div className="border-t border-slate-400 pt-1.5">
          <p>{isIncome ? 'আদায়কারী' : 'খরচকারী / গ্রহীতা'}</p>
          <span className="text-[7px] text-slate-400 block font-normal mt-0.5">স্বাক্ষর ও তারিখ</span>
        </div>
        <div className="border-t border-slate-400 pt-1.5">
          <p>হিসাবরক্ষক</p>
          <span className="text-[7px] text-slate-400 block font-normal mt-0.5">ক্যাশিয়ার / মুহাসিব</span>
        </div>
        <div className="border-t border-slate-400 pt-1.5">
          <p>অনুমোদনকারী</p>
          <span className="text-[7px] text-slate-400 block font-normal mt-0.5">মুহতামিম / অধ্যক্ষ</span>
        </div>
      </div>
    </div>
  );
}

function ReportPrintLayout({ title, period, data, formatBanglaNumber, getMonthLabel }) {
  return (
    <div className="space-y-6 text-black bg-white w-full max-w-full font-sans leading-relaxed">
      {/* Logo/Header */}
      <div className="text-center pb-6 border-b border-slate-400">
        <h2 className="text-xl sm:text-2xl font-black text-emerald-950">আস-সালাম আইডিয়াল মাদরাসা (এইম)</h2>
        <p className="text-xs text-slate-500 font-bold mt-0.5">হবিগঞ্জ সদর, হবিগঞ্জ</p>
        <h3 className="text-sm font-black bg-slate-50 border border-slate-300 inline-block px-6 py-1.5 rounded-full text-slate-700 mt-4 tracking-wide">
          {title}
        </h3>
        <p className="text-xs text-emerald-800 font-extrabold mt-3 tracking-wider uppercase">
          {period}
        </p>
      </div>

      {/* Dual Column Sheet (Income vs Expense) */}
      <div className="grid grid-cols-2 gap-px bg-slate-200 border border-slate-300 mt-6 w-full">

        {/* Income Column */}
        <div className="bg-white p-4 space-y-4">
          <h4 className="text-xs font-extrabold text-emerald-900 uppercase tracking-widest border-b border-slate-200 pb-2 flex justify-between">
            <span>📥 আয়ের খাতসমূহ (Income Sector)</span>
            <span className="text-[9px] text-slate-400">টাকা (৳)</span>
          </h4>

          {!data.incomeBreakdown || data.incomeBreakdown.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">কোনো আয়ের এন্ট্রি নেই</p>
          ) : (
            <div className="divide-y divide-slate-100 font-semibold text-slate-700 text-xs">
              {data.incomeBreakdown.map((item, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                  <span className="pr-4">{item.head}</span>
                  <span className="font-bold text-slate-900 whitespace-nowrap">৳ {formatBanglaNumber(item.amount.toLocaleString('bn-BD'))}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Expense Column */}
        <div className="bg-white p-4 space-y-4">
          <h4 className="text-xs font-extrabold text-rose-900 uppercase tracking-widest border-b border-slate-200 pb-2 flex justify-between">
            <span>📤 ব্যয়ের খাতসমূহ (Expense Sector)</span>
            <span className="text-[9px] text-slate-400">টাকা (৳)</span>
          </h4>

          {!data.expenseBreakdown || data.expenseBreakdown.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">কোনো ব্যয়ের এন্ট্রি নেই</p>
          ) : (
            <div className="divide-y divide-slate-100 font-semibold text-slate-700 text-xs">
              {data.expenseBreakdown.map((item, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                  <span className="pr-4">{item.head}</span>
                  <span className="font-bold text-slate-900 whitespace-nowrap">৳ {formatBanglaNumber(item.amount.toLocaleString('bn-BD'))}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Calculations / Summary Footer Row */}
      <div className="grid grid-cols-3 gap-px bg-slate-350 border border-slate-300 text-xs font-black">
        <div className="bg-emerald-50 p-3 text-emerald-950 flex justify-between items-center gap-2">
          <span>সর্বমোট আয়:</span>
          <span className="text-xs font-black whitespace-nowrap">৳ {formatBanglaNumber(data.totalIncome.toLocaleString('bn-BD'))}</span>
        </div>
        <div className="bg-rose-50 p-3 text-rose-950 flex justify-between items-center gap-2">
          <span>সর্বমোট ব্যয়:</span>
          <span className="text-xs font-black whitespace-nowrap">৳ {formatBanglaNumber(data.totalExpense.toLocaleString('bn-BD'))}</span>
        </div>
        <div className={`p-3 flex justify-between items-center gap-2 ${data.netBalance >= 0 ? 'bg-blue-50 text-blue-950' : 'bg-amber-50 text-amber-950'}`}>
          <span>নেট ব্যালেন্স (উদ্বৃত্ত):</span>
          <span className="text-xs font-black whitespace-nowrap">৳ {formatBanglaNumber(data.netBalance.toLocaleString('bn-BD'))}</span>
        </div>
      </div>

      {/* Signature Area */}
      <div className="grid grid-cols-3 gap-6 pt-16 text-center text-[10px] font-bold text-slate-500">
        <div className="border-t border-slate-300 pt-2">
          <p>হিসাবরক্ষক</p>
          <span className="text-[8px] text-slate-400 block font-normal mt-0.5">ক্যাশিয়ার / মুহাসিব</span>
        </div>
        <div className="border-t border-slate-300 pt-2">
          <p>যাচাইকারী</p>
          <span className="text-[8px] text-slate-400 block font-normal mt-0.5">অর্থ সম্পাদক</span>
        </div>
        <div className="border-t border-slate-300 pt-2">
          <p>অনুমোদনকারী</p>
          <span className="text-[8px] text-slate-400 block font-normal mt-0.5">মুহতামিম / অধ্যক্ষ</span>
        </div>
      </div>
    </div>
  );
}
