"use client";

import React, { useState, useEffect } from "react";

export default function FeesSetupPage() {
  // ফর্ম স্টেটসমূহ
  const [fundData, setFundData] = useState({ name: "", code: "", initBalance: "" });
  const [feeData, setFeeData] = useState({ className: "", feeType: "", amount: "", fundCode: "" });
  const [savedSettings, setSavedSettings] = useState({ funds: [], feeStructures: [] });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // আপনার ইমেজ থেকে নেওয়া আয়ের খাতের ডেমো লিস্ট (ফি টাইপ ড্রপডাউনের জন্য)
  const incomeCategories = [
    { value: "admission_form_fee", label: "ভর্তি ফরম ফি" },
    { value: "session_admission_fee", label: "সেশন ভর্তি ফি" },
    { value: "monthly_tuition", label: "মাসিক টিউশন" },
    { value: "boarding_fee", label: "বোর্ডিং ফি (থাকা+খাওয়া)" },
    { value: "exam_fee", label: "পরীক্ষা ফি" },
    { value: "establishment_fee", label: "সংস্থাপন ফি" },
    { value: "library_fee", label: "লাইব্রেরি ফি" },
    { value: "software_charge", label: "সফটওয়্যার চার্জ" },
    { value: "development_fee", label: "উন্নয়ন ফি" },
    { value: "day_care", label: "ডে-কেয়ার" },
    { value: "coaching_fee", label: "কোর্স/কোচিং" },
    { value: "dress_fee", label: "ক্লিপিং বেড/ড্রেস" },
    { value: "stationery_kit", label: "খাতা/ডায়েরী/কিতাব/বাইজ/আইডি কার্ড" },
    { value: "sadakah", label: "সাদাকাহ" },
    { value: "yatim_donation", label: "ইয়াতিম অনুদান" },
    { value: "zakat_iftar", label: "যাকাত/ইফতার" },
  ];

  // ডাটাবেজ থেকে বর্তমান সেটিংস লোড করা
  const fetchSettings = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/finance/settings`);
      const data = await res.json();
      if (data.success) {
        setSavedSettings({ funds: data.funds, feeStructures: data.feeStructures });
      }
    } catch (err) {
      console.error("সেটিংস লোড করতে ব্যর্থ:", err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // নোটিফিকেশন মেসেজ হ্যান্ডলার
  const showNotification = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  // ১. নতুন ফান্ড বা আর্থিক খাত সাবমিট হ্যান্ডলার
  const handleFundSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/finance/funds`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fundData),
      });
      const data = await res.json();
      if (data.success) {
        showNotification("success", data.message);
        setFundData({ name: "", code: "", initBalance: "" });
        fetchSettings(); // ড্রপডাউন এবং টেবিল আপডেট করার জন্য
      } else {
        showNotification("error", data.message);
      }
    } catch (err) {
      showNotification("error", "সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না।");
    } finally {
      setLoading(false);
    }
  };

  // ২. ফি স্ট্রাকচার সাবমিট হ্যান্ডলার
  const handleFeeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/finance/fee-setup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feeData),
      });
      const data = await res.json();
      if (data.success) {
        showNotification("success", data.message);
        setFeeData({ className: "", feeType: "", amount: "", fundCode: "" });
        fetchSettings();
      } else {
        showNotification("error", data.message);
      }
    } catch (err) {
      showNotification("error", "সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-800">
      <div className="max-w-6xl mx-auto">
        
        {/* হেডার সেকশন */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-teal-700">হিসাব ও অর্থ কনফিগারেশন</h1>
          <p className="text-sm text-gray-500 mt-1">মাদরাসার তহবিল (ফান্ড) এবং ক্লাসভিত্তিক ফি এর পরিমাণ নির্ধারণ করুন</p>
        </div>

        {/* নোটিফিকেশন অ্যালার্ট */}
        {message.text && (
          <div className={`p-4 mb-6 rounded-lg text-white font-medium ${message.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* ফর্ম ১: নতুন তহবিল / ব্যাংক অ্যাকাউন্ট এন্ট্রি */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2 border-teal-100">
              📁 ১. নতুন তহবিল/ব্যাংক খাত যুক্ত করুন
            </h2>
            <form onSubmit={handleFundSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">খাত বা ব্যাংকের নাম</label>
                <input
                  type="text"
                  placeholder="যেমন: ইয়াতিম ফান্ড ব্যাংক হিসাব-৪০৪"
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  value={fundData.name}
                  onChange={(e) => setFundData({ ...fundData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">ইউনিক কোড (English)</label>
                  <input
                    type="text"
                    placeholder="যেমন: YATIM_BANK"
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none uppercase"
                    value={fundData.code}
                    onChange={(e) => setFundData({ ...fundData, code: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ব্যাংকে স্থিতি / নগদ উদ্বৃত্ত</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    value={fundData.initBalance}
                    onChange={(e) => setFundData({ ...fundData, initBalance: e.target.value })}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium p-2.5 rounded-lg transition"
              >
                {loading ? "সংরক্ষণ হচ্ছে..." : "তহবিল তৈরি করুন"}
              </button>
            </form>
          </div>

          {/* ফর্ম ২: ক্লাসভিত্তিক ফি কনফিগারেশন */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2 border-teal-100">
              ⚙️ ২. ক্লাসভিত্তিক ফি স্ট্রাকচার সেটআপ
            </h2>
            <form onSubmit={handleFeeSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">ক্লাস নির্বাচন করুন</label>
                  <select
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                    value={feeData.className}
                    onChange={(e) => setFeeData({ ...feeData, className: e.target.value })}
                    required
                  >
                    <option value="">ক্লাস বাছুন...</option>
                    <option value="nurani">নূরানী</option>
                    <option value="najera">নাজেরা</option>
                    <option value="hifz">হিফজ</option>
                    <option value="kitab">কিতাব বিভাগ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">আয়ের খাতের বিবরণ</label>
                  <select
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                    value={feeData.feeType}
                    onChange={(e) => setFeeData({ ...feeData, feeType: e.target.value })}
                    required
                  >
                    <option value="">খাত বাছুন...</option>
                    {incomeCategories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">টাকার পরিমাণ (৳)</label>
                  <input
                    type="number"
                    placeholder="যেমন: ২৫০০"
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    value={feeData.amount}
                    onChange={(e) => setFeeData({ ...feeData, amount: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">জমা হবে কোন তহবিলে?</label>
                  <select
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                    value={feeData.fundCode}
                    onChange={(e) => setFeeData({ ...feeData, fundCode: e.target.value })}
                    required
                  >
                    <option value="">তহবিল বাছুন...</option>
                    {savedSettings.funds.map((fund) => (
                      <option key={fund._id} value={fund.code}>{fund.name} ({fund.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-2.5 rounded-lg transition"
              >
                {loading ? "সংরক্ষণ হচ্ছে..." : "ফি স্ট্রাকচার সংরক্ষণ করুন"}
              </button>
            </form>
          </div>

        </div>

        {/* নিচের সেকশন: সংরক্ষিত তথ্য প্রদর্শন */}
        <div className="mt-12 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">📊 বর্তমান সচল ফি ও ফান্ডসমূহ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* ফান্ডের তালিকা */}
            <div>
              <h4 className="font-medium text-teal-600 mb-2">তহবিলের তালিকা ও ব্যালেন্স</h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="p-2">কোড</th>
                      <th className="p-2">ফান্ড নাম</th>
                      <th className="p-2 text-right">বর্তমান ব্যালেন্স</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savedSettings.funds.length === 0 ? (
                      <tr><td colSpan="3" className="p-3 text-center text-gray-400">কোন ফান্ড পাওয়া যায়নি</td></tr>
                    ) : (
                      savedSettings.funds.map((fund) => (
                        <tr key={fund._id} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-mono font-semibold">{fund.code}</td>
                          <td className="p-2">{fund.name}</td>
                          <td className="p-2 text-right font-medium text-green-600">৳{fund.currentBalance.toFixed(2)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ফি স্ট্রাকচারের তালিকা */}
            <div>
              <h4 className="font-medium text-blue-600 mb-2">সেটআপ করা ফি এর তালিকা</h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="p-2">ক্লাস</th>
                      <th className="p-2">ফি টাইপ</th>
                      <th className="p-2 text-right">পরিমাণ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savedSettings.feeStructures.length === 0 ? (
                      <tr><td colSpan="3" className="p-3 text-center text-gray-400">কোন ফি স্ট্রাকচার সেটআপ করা নেই</td></tr>
                    ) : (
                      savedSettings.feeStructures.map((fee, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-2 uppercase">{fee.className}</td>
                          <td className="p-2 capitalize">{fee.feeType.replace(/_/g, ' ')}</td>
                          <td className="p-2 text-right font-semibold">৳{fee.amount}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
