"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Loader2, Coins, Edit } from 'lucide-react';

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
  "মাশুল",
  "স্লিপিং বেড/ড্রেস",
  "খাতা/ডায়েরী/কিতাব/বেইজ/আইডি কার্ড",
  "শিক্ষা সফর",
  "ইনভেস্ট",
  "ভূমি/বিল্ডিং",
  "পরিবহন",
  "সাদাকাহ",
  "ইয়াতিম অনুদান",
  "যাকাত/ইফতার",
  "অন্যান্য"
];

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [presetFee, setPresetFee] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Load categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/finance/categories`);
      const data = await res.json();
      if (data.success) {
        setCategories(data.data || []);
      } else {
        setErrorMsg(data.message || 'ক্যাটাগরি তালিকা লোড করতে ব্যর্থ হয়েছে।');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('সার্ভারের সাথে সংযোগ স্থাপন করা যাচ্ছে না।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchCategories();
    });
  }, []);

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

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      triggerNotification('error', 'খাতের নাম দেওয়া আবশ্যক।');
      return;
    }

    try {
      setSubmitting(true);

      // If editing, delete the old one first to perform an update
      if (editingId) {
        await fetch(`${API_BASE_URL}/api/finance/categories/${editingId}`, {
          method: 'DELETE'
        });
      }

      const res = await fetch(`${API_BASE_URL}/api/finance/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, presetFee: parseFloat(presetFee) || 0 })
      });
      const data = await res.json();
      if (data.success) {
        triggerNotification('success', editingId ? 'খাত সফলভাবে আপডেট হয়েছে!' : 'নতুন খাত সফলভাবে তৈরি হয়েছে!');
        setName('');
        setPresetFee('');
        setEditingId(null);
        fetchCategories();
      } else {
        triggerNotification('error', data.message || 'খাত সংরক্ষণ করা যায়নি।');
      }
    } catch (err) {
      console.error(err);
      triggerNotification('error', 'সার্ভারে রিকোয়েস্ট পাঠাতে সমস্যা হয়েছে।');
    } finally {
      setSubmitting(false);
    }
  };

  // Edit Click Handler
  const handleEditClick = (cat) => {
    setEditingId(cat._id);
    setName(cat.name);
    setPresetFee(cat.presetFee.toString());
  };

  // Delete Handler
  const handleDelete = async (id) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই খাতটি মুছে ফেলতে চান?')) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/finance/categories/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        triggerNotification('success', 'খাতটি সফলভাবে মুছে ফেলা হয়েছে।');
        if (editingId === id) {
          setName('');
          setPresetFee('');
          setEditingId(null);
        }
        fetchCategories();
      } else {
        triggerNotification('error', data.message || 'খাতটি মুছে ফেলা যায়নি।');
      }
    } catch (err) {
      console.error(err);
      triggerNotification('error', 'সার্ভারে রিকোয়েস্ট পাঠাতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const formatBanglaNumber = (num) => {
    const englishToBangla = {
      '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
      '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
    };
    return String(num).split('').map(char => englishToBangla[char] || char).join('');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
      {/* Top Navigation / Alerts */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/finance"
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-650 transition-colors border border-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-emerald-955 flex items-center gap-2">
              <Coins className="w-5 h-5 text-emerald-800" />
              <span>আয় খাত ও ফি ব্যবস্থাপনা (Category Management)</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">রসিদ তৈরির জন্য পূর্বনির্ধারিত ফি এবং আয় খাতসমূহ নির্ধারণ</p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-md text-xs font-bold">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="bg-red-500 text-white px-4 py-3 rounded-xl shadow-md text-xs font-bold">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Creation / Edit Form */}
        <div className="md:col-span-1 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-4 h-fit">
          <h2 className="text-sm font-bold text-slate-800 border-b pb-2">
            {editingId ? 'খাতের ফি ও কনফিগারেশন আপডেট' : 'নতুন খাত যোগ করুন'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">আয় খাত (Category Select)</label>
              <div className="space-y-2">
                <select
                  value={INCOME_HEADS.includes(name) ? name : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      setName(e.target.value);
                    }
                  }}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700 bg-white"
                >
                  <option value="">-- তালিকায় খুঁজুন বা নিচে টাইপ করুন --</option>
                  {INCOME_HEADS.map(head => (
                    <option key={head} value={head}>{head}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="অথবা নতুন খাতের নাম লিখুন"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">ফি এর পরিমাণ (৳) (নির্ধারিত ফি)</label>
              <input
                type="number"
                placeholder="যেমন: ৫০০"
                value={presetFee}
                onChange={(e) => setPresetFee(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700"
                min="0"
              />
            </div>
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2 bg-emerald-800 hover:bg-emerald-950 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> {editingId ? 'ফি আপডেট করুন' : 'খাত সংরক্ষণ করুন'}</>}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setName('');
                    setPresetFee('');
                    setEditingId(null);
                  }}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  বাতিল করুন
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right: Category List */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-sm font-bold text-slate-800">নির্ধারিত খাতের তালিকা</h2>
            <span className="text-[10px] font-bold text-slate-505 bg-slate-100 px-2.5 py-1 rounded-full">
              মোট: {formatBanglaNumber(categories.length)} টি
            </span>
          </div>

          {loading && categories.length === 0 ? (
            <div className="flex flex-col items-center py-12 gap-2">
              <Loader2 className="w-8 h-8 text-emerald-800 animate-spin" />
              <span className="text-xs text-slate-500 font-bold">লোড হচ্ছে...</span>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400 font-medium">
              কোনো নির্ধারিত খাত পাওয়া যায়নি। নতুন খাত তৈরি করুন।
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="min-w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-650 font-bold">
                    <th className="p-3">ক্রমিক</th>
                    <th className="p-3">খাতের নাম</th>
                    <th className="p-3 text-right">ফি এর পরিমাণ</th>
                    <th className="p-3 text-center w-24">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {categories.map((cat, idx) => (
                    <tr key={cat._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3">{formatBanglaNumber(idx + 1)}</td>
                      <td className="p-3 text-slate-900 font-bold">{cat.name}</td>
                      <td className="p-3 text-right font-black text-emerald-900">
                        {cat.presetFee > 0 ? `৳ ${formatBanglaNumber(cat.presetFee.toLocaleString('bn-BD'))}` : 'উন্মুক্ত'}
                      </td>
                      <td className="p-3 text-center flex justify-center items-center gap-1">
                        <button
                          onClick={() => handleEditClick(cat)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="সম্পাদনা করুন"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
