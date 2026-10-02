"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  CreditCard,
  CheckCircle2,
  Calendar,
  Clock,
  Printer,
  ExternalLink,
  RefreshCw,
  ArrowLeft,
  Building2,
  Smartphone,
  ShieldCheck,
  FileText,
  AlertCircle,
  Copy,
  Check,
  X,
  User,
  Sparkles,
  QrCode,
} from "lucide-react";
import { toast } from "react-toastify";

const API_BASE =
  process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000";

const FEE_HEADS = [
  "মাসিক টিউশন ফি",
  "ভর্তি / সেশন ফি",
  "পরীক্ষা ফি",
  "আবাসিক বোর্ডিং ফি (থাকা+খাওয়া)",
  "শিক্ষা সামগ্রী ও কিতাব ফি",
  "অন্যান্য সেবা ফি",
];

const MONTHS = [
  { value: "2026-10", label: "অক্টোবর ২০২৬" },
  { value: "2026-11", label: "নভেম্বর ২০২৬" },
  { value: "2026-12", label: "ডিসেম্বর ২০২৬" },
  { value: "2026-09", label: "সেপ্টেম্বর ২০২৬" },
];

export default function ParentPaymentsPage() {
  const [data, setData] = useState(null);
  const [children, setChildren] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [loading, setLoading] = useState(true);

  // Payment Form States
  const [paymentMethod, setPaymentMethod] = useState("bKash"); // "bKash" | "Nagad" | "Bank"
  const [feeHead, setFeeHead] = useState("মাসিক টিউশন ফি");
  const [amount, setAmount] = useState("2500");
  const [month, setMonth] = useState("2026-10");
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [bankName, setBankName] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Printable Voucher Modal State
  const [activeVoucher, setActiveVoucher] = useState(null);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [copiedText, setCopiedText] = useState("");

  const printAreaRef = useRef(null);

  // Copy helper
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    toast.success("নম্বর কপি করা হয়েছে!");
    setTimeout(() => setCopiedText(""), 2500);
  };

  // Fetch children list
  const fetchChildren = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/parent/children`, {
        cache: "no-store",
      });
      const json = await res.json();
      if (json.success && json.children && json.children.length > 0) {
        setChildren(json.children);
        if (!selectedStudentId) {
          setSelectedStudentId(json.children[0].studentId);
        }
      }
    } catch (err) {
      console.warn("Children fetch error:", err);
    }
  };

  // Fetch payments & dues
  const fetchPaymentsData = async (studentId) => {
    try {
      setLoading(true);
      const url = studentId
        ? `${API_BASE}/api/parent/payments?studentId=${studentId}`
        : `${API_BASE}/api/parent/payments`;

      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        toast.error(json.message || "পেমেন্ট ডাটা পাওয়া যায়নি");
      }
    } catch (err) {
      console.error("Payments data fetch error:", err);
      toast.error("সার্ভার থেকে পেমেন্ট হিস্টোরি লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    fetchPaymentsData(selectedStudentId);
  }, [selectedStudentId]);

  // Execute Payment
  const handleExecutePayment = async (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      toast.warn("অনুগ্রহ করে সঠিক টাকার পরিমাণ লিখুন।");
      return;
    }

    if (paymentMethod === "bKash" || paymentMethod === "Nagad") {
      if (!senderNumber || !transactionId) {
        toast.warn("মোবাইল নম্বর ও ট্রানজেকশন আইডি (TrxID) প্রদান করুন।");
        return;
      }
    } else if (paymentMethod === "Bank") {
      if (!transactionId) {
        toast.warn("ব্যাংক ডিপোজিট স্লিপ বা রেফারেন্স নম্বর প্রদান করুন।");
        return;
      }
    }

    try {
      setSubmitting(true);
      const payload = {
        studentId: selectedStudentId || data?.student?.studentId,
        amount: parseFloat(amount),
        paymentMethod,
        transactionId,
        senderNumber,
        bankName,
        head: feeHead,
        month,
        note,
      };

      const res = await fetch(`${API_BASE}/api/parent/payments/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        toast.success(result.message);
        // Reset form
        setTransactionId("");
        setSenderNumber("");
        setBankName("");
        setNote("");

        // Refresh transactions list
        fetchPaymentsData(selectedStudentId);

        // Open Printable Voucher Modal automatically!
        if (result.voucher) {
          setActiveVoucher(result.voucher);
          setIsVoucherModalOpen(true);
        }
      } else {
        toast.error(result.message || "পেমেন্ট ব্যর্থ হয়েছে");
      }
    } catch (err) {
      console.error("Payment execution error:", err);
      toast.error("পেমেন্ট প্রক্রিয়াকরণে ত্রুটি হয়েছে");
    } finally {
      setSubmitting(false);
    }
  };

  // Convert English number to Bengali Words for receipt
  const numberToBanglaWords = (num) => {
    const n = parseInt(num) || 0;
    if (n === 2500) return "দুই হাজার পাঁচশত টাকা মাত্র";
    if (n === 2000) return "দুই হাজার টাকা মাত্র";
    if (n === 1000) return "এক হাজার টাকা মাত্র";
    if (n === 3500) return "তিন হাজার পাঁচশত টাকা মাত্র";
    if (n === 5000) return "পাঁচ হাজার টাকা মাত্র";
    return `${n} টাকা মাত্র`;
  };

  const student = data?.student;
  const dues = data?.dues;
  const transactions = data?.transactions || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 font-sans space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-800/40 relative overflow-hidden print:hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <Link
              href="/dashboard/parent"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:underline mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>অভিভাবক ড্যাশবোর্ডে ফিরে যান</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                ফি ও অনলাইন পেমেন্ট
              </span>
              {children.length > 1 && (
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="bg-black/40 text-white text-xs px-2.5 py-1 rounded-xl border border-white/20 focus:outline-none cursor-pointer"
                >
                  {children.map((c) => (
                    <option key={c.studentId} value={c.studentId} className="text-slate-900">
                      {c.studentNameBangla || c.studentNameEnglish} ({c.previousClass || c.className})
                    </option>
                  ))}
                </select>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              অনলাইন ফি পরিশোধ ও একাউন্টিং ভাউচার
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80">
              {student?.name ? `${student.name} (আইডি: ${student.studentId} | শ্রেণি: ${student.className})` : "শিক্ষার্থীর ফি পোর্টাল"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchPaymentsData(selectedStudentId)}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-colors backdrop-blur-sm"
              title="রিফ্রেশ"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Dues & Balance Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
        {/* Due Balance */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">চলতি মাসের প্রদেয় ফি</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
              {dues?.dueMonth || "অক্টোবর"}
            </span>
          </div>
          <div className="my-2">
            <p className="text-3xl font-black text-rose-600">
              ৳ {dues?.totalDue || 0}
            </p>
          </div>
          <span className="text-[11px] text-slate-400">
            পরিশোধের শেষ তারিখ: {dues?.dueDate || "১৫ই অক্টোবর"}
          </span>
        </div>

        {/* Payment Status */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">পেমেন্ট স্ট্যাটাস</span>
          <div className="my-2 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                dues?.totalDue === 0
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-800 animate-pulse"
              }`}
            >
              {dues?.totalDue === 0 ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>সম্পূর্ণ পরিশোধিত</span>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4" />
                  <span>বকেয়া রয়েছে</span>
                </>
              )}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">একাউন্টিং ডাটাবেজের সাথে সিঙ্কড</span>
        </div>

        {/* Total Payments Logged */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">সর্বমোট পরিশোধের সংখ্যা</span>
          <div className="my-2">
            <p className="text-3xl font-black text-emerald-600">{transactions.length}</p>
          </div>
          <span className="text-[11px] text-slate-400">অনলাইন ও অফিস ভাউচার</span>
        </div>

        {/* Supported Channels */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">সক্রিয় পেমেন্ট মাধ্যম</span>
          <div className="my-2 flex items-center gap-2">
            <span className="px-2 py-1 bg-pink-100 text-pink-700 font-bold rounded-lg text-xs">বিকাশ</span>
            <span className="px-2 py-1 bg-orange-100 text-orange-700 font-bold rounded-lg text-xs">নগদ</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 font-bold rounded-lg text-xs">ব্যাংক</span>
          </div>
          <span className="text-[11px] text-slate-400">স্বয়ংক্রিয় রসিদ তৈরি</span>
        </div>
      </div>

      {/* Main Payment Checkout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:hidden">
        {/* Left Form: Select & Fill Details */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                অনলাইন ফি পেমেন্ট ইন্টারফেস
              </h2>
            </div>
            <span className="text-xs text-slate-400">ধাপ ১/২</span>
          </div>

          <form onSubmit={handleExecutePayment} className="space-y-4">
            {/* Fee Head & Month */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  ফি-এর খাত (Fee Head) *
                </label>
                <select
                  value={feeHead}
                  onChange={(e) => setFeeHead(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {FEE_HEADS.map((head) => (
                    <option key={head} value={head}>
                      {head}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  মাসের নির্বাচন (Month) *
                </label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {MONTHS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Amount Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                পরিশোধের পরিমাণ (Amount in BDT) *
              </label>
              <div className="flex items-center gap-2 mb-2">
                {["1000", "2000", "2500", "3500", "5000"].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      amount === val
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400"
                    }`}
                  >
                    ৳{val}
                  </button>
                ))}
              </div>
              <input
                type="number"
                required
                min="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="টাকার পরিমাণ লিখুন..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Payment Method Selector Tabs */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                পেমেন্ট গেটওয়ে মাধ্যম নির্বাচন করুন *
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("bKash")}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === "bKash"
                      ? "bg-pink-50 dark:bg-pink-950/40 border-pink-500 text-pink-700 dark:text-pink-300 ring-2 ring-pink-500/20 shadow-sm"
                      : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-pink-300"
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-pink-600" />
                  <span className="text-xs font-bold">bKash (বিকাশ)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("Nagad")}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === "Nagad"
                      ? "bg-orange-50 dark:bg-orange-950/40 border-orange-500 text-orange-700 dark:text-orange-300 ring-2 ring-orange-500/20 shadow-sm"
                      : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-orange-300"
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-orange-600" />
                  <span className="text-xs font-bold">Nagad (নগদ)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("Bank")}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === "Bank"
                      ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20 shadow-sm"
                      : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-300"
                  }`}
                >
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <span className="text-xs font-bold">ব্যাংক হিসাব</span>
                </button>
              </div>
            </div>

            {/* Gateway Specific Input Fields */}
            {(paymentMethod === "bKash" || paymentMethod === "Nagad") && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    প্রেরকের {paymentMethod === "bKash" ? "বিকাশ" : "নগদ"} নম্বর *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="০১৭১২-৩৪৫৬৭৮"
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    ট্রানজেকশন আইডি (TrxID) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: 9X824176"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono uppercase"
                  />
                </div>
              </div>
            )}

            {paymentMethod === "Bank" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    প্রেরক ব্যাংক ও শাখা
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: ইসলামী ব্যাংক, হবিগঞ্জ শাখা"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    ডিপোজিট স্লিপ / রেফারেন্স নং *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: DEP-89123"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>
            )}

            {/* Note */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                মন্তব্য বা বিবরণ (ঐচ্ছিক)
              </label>
              <input
                type="text"
                placeholder="যেমন: অক্টোবর মাসের ফি এবং পরীক্ষার ফি বাবদ..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm rounded-2xl shadow-lg transition-all shadow-emerald-900/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-amber-300" />
              )}
              <span>
                {submitting
                  ? "পেমেন্ট প্রসেসিং হচ্ছে..."
                  : "পেমেন্ট নিশ্চিত করুন এবং ভাউচার তৈরি করুন"}
              </span>
            </button>
          </form>
        </div>

        {/* Right Info: Payment Gateway Instructions */}
        <div className="lg:col-span-5 space-y-4">
          {paymentMethod === "bKash" && (
            <div className="bg-gradient-to-br from-pink-600 to-rose-700 text-white p-6 sm:p-7 rounded-3xl shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-white/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  bKash Payment Guide
                </span>
                <span className="text-xl font-bold font-mono">বিকাশ</span>
              </div>

              <div>
                <p className="text-xs text-pink-100">মাদরাসার অফিশিয়াল বিকাশ নম্বর:</p>
                <div className="flex items-center justify-between bg-black/20 p-3 rounded-2xl mt-1">
                  <span className="font-mono text-lg font-bold tracking-wider">01750239001</span>
                  <button
                    onClick={() => handleCopy("01750239001")}
                    className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    title="কপি করুন"
                  >
                    {copiedText === "01750239001" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="text-xs space-y-1.5 text-pink-100/90 pt-1">
                <p>১. আপনার বিকাশ অ্যাপ ওপেন করুন অথবা *247# ডায়াল করুন।</p>
                <p>২. <strong>Send Money</strong> অথবা <strong>Payment</strong> অপশন সিলেক্ট করুন।</p>
                <p>৩. উপরের নম্বরে নির্ধারিত ফি <strong>৳ {amount || "২,৫০০"}</strong> সেন্ড করুন।</p>
                <p>৪. ট্রানজেকশন সফল হলে প্রাপ্ত <strong>TrxID</strong> বামপাশের ফর্মে লিখে সাবমিট করুন।</p>
              </div>

              <div className="bg-black/30 p-3 rounded-xl text-[11px] text-pink-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 flex-shrink-0 text-amber-300" />
                <span>পেমেন্ট সফল হলে সাথে সাথে অফিসিয়াল একাউন্টিং রসিদ ডাউনলোড করতে পারবেন।</span>
              </div>
            </div>
          )}

          {paymentMethod === "Nagad" && (
            <div className="bg-gradient-to-br from-orange-600 to-amber-700 text-white p-6 sm:p-7 rounded-3xl shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-white/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Nagad Payment Guide
                </span>
                <span className="text-xl font-bold font-mono">নগদ</span>
              </div>

              <div>
                <p className="text-xs text-orange-100">মাদরাসার অফিশিয়াল নগদ নম্বর:</p>
                <div className="flex items-center justify-between bg-black/20 p-3 rounded-2xl mt-1">
                  <span className="font-mono text-lg font-bold tracking-wider">01750239002</span>
                  <button
                    onClick={() => handleCopy("01750239002")}
                    className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    title="কপি করুন"
                  >
                    {copiedText === "01750239002" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="text-xs space-y-1.5 text-orange-100/90 pt-1">
                <p>১. নগদ অ্যাপে লগইন করুন অথবা *167# ডায়াল করুন।</p>
                <p>২. <strong>Send Money</strong> সিলেক্ট করে প্রাপক নম্বরে উপরের নম্বরটি লিখুন।</p>
                <p>৩. টাকার পরিমাণ <strong>৳ {amount || "২,৫০০"}</strong> লিখে পিন দিয়ে কনফার্ম করুন।</p>
                <p>৪. ফিরতি এসএমএসের <strong>TrxID</strong> বামপাশের ফর্মে দিন।</p>
              </div>
            </div>
          )}

          {paymentMethod === "Bank" && (
            <div className="bg-gradient-to-br from-blue-700 to-indigo-900 text-white p-6 sm:p-7 rounded-3xl shadow-lg space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-white/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Bank Transfer Details
                </span>
                <Building2 className="w-5 h-5 text-blue-200" />
              </div>

              <div className="space-y-1.5 text-xs text-blue-100">
                <p>ব্যাংকের নাম: <strong className="text-white text-sm block">ইসলামী ব্যাংক বাংলাদেশ পিএলসি (IBBL)</strong></p>
                <p>হিসাবের নাম: <strong className="text-white block">আস-সালাম আইডিয়াল মাদরাসা</strong></p>
                <div className="flex items-center justify-between bg-black/20 p-2.5 rounded-xl mt-1">
                  <div>
                    <span className="text-[10px] text-blue-200 block">হিসাব নম্বর:</span>
                    <strong className="font-mono text-base text-amber-300">২০৫০১২৩৪৫৬৭৮৯০</strong>
                  </div>
                  <button
                    onClick={() => handleCopy("20501234567890")}
                    className="p-1.5 bg-white/20 rounded-lg"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p>শাখা: <strong>হবিগঞ্জ শাখা</strong> | রাউটিং নং: <strong>১২৫২৫০১৮০</strong></p>
              </div>

              <p className="text-[11px] text-blue-200/80 pt-2 border-t border-white/10">
                যেকোনো ব্যাংক বা অনলাইন অ্যাপ থেকে সরাসরি ফান্ড ট্রান্সফার করে ডিপোজিট স্লিপ নম্বর বা রেফারেন্স দিন।
              </p>
            </div>
          )}

          {/* Security & Sync Guarantee Note */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>একাউন্টিং অটোমেশন গ্যারান্টি</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              পেমেন্ট সফল হওয়ার সাথে সাথে মাদরাসার মূল ফাইন্যান্স ডাটাবেজে (একাউন্টেন্ট ড্যাশবোর্ড) ভাউচারটি নিবন্ধিত হবে। পরবর্তীতে কোনো কারণে ভাউচার হারালে অভিভাবক পোর্টাল থেকে যেকোনো সময় পুনরায় প্রিন্ট করা যাবে।
            </p>
          </div>
        </div>
      </div>

      {/* Payment History & Voucher Archive Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden print:hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
              পরিশোধিত ফি ও ভাউচার হিস্টোরি
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              এখান থেকে সকল ফি পরিশোধের রসিদ ও ভাউচার প্রিন্ট অথবা ডাউনলোড করতে পারবেন।
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            মোট রেকর্ড: {transactions.length}টি
          </span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-500">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-500 mb-3" />
            <p>পেমেন্ট হিস্টোরি লোড হচ্ছে...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            কোনো পূর্ববর্তী পেমেন্ট রেকর্ড পাওয়া যায়নি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">ভাউচার ও রসিদ নং</th>
                  <th className="py-3.5 px-4">তারিখ ও মাস</th>
                  <th className="py-3.5 px-4">ফি-এর খাত</th>
                  <th className="py-3.5 px-4">পেমেন্ট মাধ্যম</th>
                  <th className="py-3.5 px-4">পরিমাণ</th>
                  <th className="py-3.5 px-4 text-center">স্ট্যাটাস</th>
                  <th className="py-3.5 px-4 text-right">পদক্ষেপ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
                {transactions.map((tx) => (
                  <tr
                    key={tx._id || tx.receiptNo}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                        {tx.receiptNo}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {tx.voucherNo || "অফিস ভাউচার"}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      <div>{tx.date}</div>
                      <span className="text-[11px] text-slate-400">{tx.month}</span>
                    </td>

                    <td className="py-4 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {tx.items?.[0]?.head || tx.head || "মাসিক টিউশন ফি"}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-bold rounded-lg ${
                          tx.paymentMethod === "bKash"
                            ? "bg-pink-100 text-pink-700"
                            : tx.paymentMethod === "Nagad"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {tx.paymentMethod}
                      </span>
                      {tx.transactionId && (
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                          {tx.transactionId}
                        </p>
                      )}
                    </td>

                    <td className="py-4 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      ৳ {tx.totalIncome || tx.amount || 2500}
                    </td>

                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>অনুমোদিত / পেইড</span>
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          setActiveVoucher(tx);
                          setIsVoucherModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-xl transition-all border border-emerald-200 dark:border-emerald-800"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>ভাউচার প্রিন্ট</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Official Printable Voucher / Money Receipt Modal */}
      {isVoucherModalOpen && activeVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-6 border border-slate-200">
            {/* Modal Top Actions (Hidden in Print) */}
            <div className="p-4 bg-slate-100 flex items-center justify-between border-b border-slate-200 print:hidden">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>অফিসিয়াল একাউন্টিং মানি রসিদ ও ভাউচার</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>প্রিন্ট / ডাউনলোড PDF</span>
                </button>
                <button
                  onClick={() => setIsVoucherModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Voucher Body (Formatted to Print Perfectly) */}
            <div ref={printAreaRef} className="p-8 sm:p-10 space-y-6 bg-white text-slate-900 print:p-0">
              {/* Institution Header */}
              <div className="text-center space-y-1 border-b-2 border-emerald-800 pb-4">
                <p className="text-xs font-bold text-emerald-800 tracking-wider font-sans">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
                <h1 className="text-xl sm:text-2xl font-black text-emerald-950 font-shalda">
                  আস-সালাম আইডিয়াল মাদরাসা (এইম)
                </h1>
                <p className="text-xs font-semibold text-slate-700 font-sans">
                  হবিগঞ্জ, বাংলাদেশ | ইমেইল: info@assalam.edu.bd | মোবাইল: +৮৮০ ১২৩৪-৫৬৭৮৯০
                </p>
                <div className="inline-block mt-2 px-4 py-1 bg-emerald-900 text-white text-xs font-extrabold uppercase rounded-full tracking-widest shadow-sm">
                  অফিসিয়াল মানি রসিদ ও ফি ভাউচার (Money Receipt)
                </div>
              </div>

              {/* Receipt & Voucher Meta */}
              <div className="flex flex-wrap justify-between items-center text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <p>রসিদ নং (Receipt No): <strong className="font-mono text-sm text-emerald-900">{activeVoucher.receiptNo}</strong></p>
                  <p className="text-slate-500 mt-0.5">ভাউচার নং: <strong className="font-mono">{activeVoucher.voucherNo || "VOUCH-AUTO"}</strong></p>
                </div>
                <div className="text-right">
                  <p>তারিখ: <strong>{activeVoucher.date}</strong></p>
                  <p className="text-slate-500 mt-0.5">সেশন: <strong>২০২৬</strong></p>
                </div>
              </div>

              {/* Student Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <div>
                  <p className="text-slate-500">শিক্ষার্থীর নাম:</p>
                  <p className="font-bold text-sm text-slate-800 mt-0.5">{activeVoucher.studentName || student?.name}</p>
                </div>
                <div>
                  <p className="text-slate-500">শিক্ষার্থী আইডি (ID):</p>
                  <p className="font-mono font-bold text-sm text-slate-800 mt-0.5">{activeVoucher.studentId || student?.studentId}</p>
                </div>
                <div>
                  <p className="text-slate-500">শ্রেণি ও বিভাগ:</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{activeVoucher.className || student?.className}</p>
                </div>
                <div>
                  <p className="text-slate-500">অভিভাবকের নাম:</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{activeVoucher.payerName || student?.fatherName}</p>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
                    <tr>
                      <th className="py-2.5 px-4">নং</th>
                      <th className="py-2.5 px-4">ফি-এর বিবরণ (Description)</th>
                      <th className="py-2.5 px-4 text-right">পরিমাণ (BDT)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeVoucher.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-3 px-4 font-mono">{idx + 1}</td>
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {item.head} ({activeVoucher.month || "অক্টোবর ২০২৬"})
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-slate-900">
                          ৳ {item.amount}
                        </td>
                      </tr>
                    )) || (
                      <tr>
                        <td className="py-3 px-4 font-mono">1</td>
                        <td className="py-3 px-4 font-semibold text-slate-800">মাসিক টিউশন ফি</td>
                        <td className="py-3 px-4 text-right font-bold text-slate-900">৳ {activeVoucher.totalIncome || 2500}</td>
                      </tr>
                    )}
                    <tr className="bg-slate-50 font-bold border-t border-slate-200 text-sm">
                      <td colSpan={2} className="py-3 px-4 text-right">সর্বমোট (Total Paid):</td>
                      <td className="py-3 px-4 text-right text-emerald-800 font-black">
                        ৳ {activeVoucher.totalIncome || activeVoucher.amount || 2500}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Words & Payment Channel Details */}
              <div className="space-y-2 text-xs">
                <p>
                  কথায় (In Words): <strong className="text-slate-800 underline">{numberToBanglaWords(activeVoucher.totalIncome || 2500)}</strong>
                </p>
                <div className="flex flex-wrap items-center justify-between text-slate-500 pt-2 border-t border-dashed border-slate-200">
                  <span>পেমেন্ট গেটওয়ে: <strong className="text-slate-800">{activeVoucher.paymentMethod}</strong></span>
                  <span>ট্রানজেকশন আইডি: <strong className="font-mono text-slate-800">{activeVoucher.transactionId}</strong></span>
                  <span className="text-emerald-700 font-bold">✓ একাউন্টিং ভেরিফাইড</span>
                </div>
              </div>

              {/* Signatures & Seal */}
              <div className="pt-10 flex justify-between items-end text-center text-xs">
                <div>
                  <div className="w-32 border-b border-slate-400 mb-1" />
                  <p className="text-slate-600 font-medium">অভিভাবকের স্বাক্ষর</p>
                </div>

                <div className="border border-emerald-500/50 rounded-xl p-2 text-[10px] text-emerald-700 font-bold uppercase tracking-wider bg-emerald-50">
                  <p>আস-সালাম আইডিয়াল মাদরাসা</p>
                  <p className="text-emerald-800">★ PAID & VERIFIED ★</p>
                </div>

                <div>
                  <div className="w-36 border-b border-slate-400 mb-1" />
                  <p className="text-slate-600 font-medium">হিসাবরক্ষক / ক্যাশিয়ার</p>
                </div>
              </div>

              {/* Footer Notice */}
              <p className="text-[10px] text-center text-slate-400 border-t border-slate-100 pt-3">
                * এটি কম্পিউটার জেনারেটেড ডিজিটাল মানি রসিদ। কোনো স্বাক্ষরের প্রয়োজন নেই। আপনার লেনদেনটি মাদরাসা সেন্ট্রাল একাউন্টিং ডাটাবেজে স্থায়ীভাবে সংরক্ষিত রয়েছে।
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
