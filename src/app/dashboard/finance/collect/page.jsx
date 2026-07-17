"use client";

import React, { useState } from "react";

export default function CollectFeePage() {
  const [searchId, setSearchId] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [availableFees, setAvailableFees] = useState([]);
  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const serverApi = process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:8000";

  // আইডি দিয়ে স্টুডেন্ট সার্চ করা
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId) return;
    setLoading(true);
    setStudentData(null);
    setAvailableFees([]);
    setSelectedFee(null);

    try {
      const res = await fetch(`${serverApi}/api/finance/student-fees/${searchId}`);
      const data = await res.json();
      if (data.success) {
        setStudentData(data.student);
        setAvailableFees(data.fees);
        if (data.fees.length === 0) {
          setMessage({ type: "error", text: "এই ক্লাসের জন্য কোনো ফি স্ট্রাকচার এখনো সেটআপ করা হয়নি।" });
        } else {
          setMessage({ type: "", text: "" });
        }
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (err) {
      setMessage({ type: "error", text: "সার্ভার থেকে তথ্য আনা যায়নি।" });
    } finally {
      setLoading(false);
    }
  };

  // পেমেন্ট সাবমিট করা
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFee || !studentData) return;

    setLoading(true);
    try {
      const res = await fetch(`${serverApi}/api/finance/collect-fee`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: studentData.id,
          studentName: studentData.name,
          className: studentData.class,
          feeType: selectedFee.feeType,
          amount: selectedFee.amount,
          fundCode: selectedFee.fundCode,
          paymentMethod
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: `টাকা সফলভাবে জমা হয়েছে! রসিদ নম্বর: ${data.receiptNo}` });
        setStudentData(null);
        setAvailableFees([]);
        setSelectedFee(null);
        setSearchId("");
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (err) {
      setMessage({ type: "error", text: "পেমেন্ট প্রসেস করতে ব্যর্থ।" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-800">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-700">শিক্ষার্থী ফি কালেকশন</h1>
          <p className="text-sm text-gray-500 mt-1">শিক্ষার্থীর আইডি সার্চ করে মানি রসিদ জেনারেট করুন</p>
        </div>

        {message.text && (
          <div className={`p-4 mb-6 rounded-lg text-white font-medium ${message.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
            {message.text}
          </div>
        )}

        {/* সার্চ বার */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <form onSubmit={handleSearch} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">শিক্ষার্থীর আইডি</label>
              <input
                type="text"
                placeholder="যেমন: 65f1234abc..."
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition">
              {loading ? "খোঁজা হচ্ছে..." : "সার্চ করুন"}
            </button>
          </form>
        </div>

        {/* সার্চ রেজাল্ট */}
        {studentData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
              <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-700">ছাত্রের প্রোফাইল</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-400">নাম:</span> <strong className="text-gray-700 block text-base">{studentData.name}</strong></p>
                <p><span className="text-gray-400">শ্রেণী:</span> <span className="uppercase font-semibold">{studentData.class}</span></p>
                <p><span className="text-gray-400">রোল:</span> {studentData.roll}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-2">
              <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-700">ফি ও পেমেন্ট বিবরণ</h3>
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">ফি-এর খাত নির্বাচন করুন</label>
                  <select
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    onChange={(e) => {
                      const fee = availableFees.find(f => f._id === e.target.value);
                      setSelectedFee(fee);
                    }}
                    required
                  >
                    <option value="">খাত বাছুন...</option>
                    {availableFees.map((fee) => (
                      <option key={fee._id} value={fee._id}>
                        {fee.feeType.toUpperCase().replace(/_/g, ' ')} — ৳{fee.amount} (ফান্ড: {fee.fundCode})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedFee && (
                  <div className="bg-blue-50 p-4 rounded-lg grid grid-cols-2 gap-4 text-sm border border-blue-100">
                    <div>
                      <p className="text-gray-500">পরিশোধযোগ্য টাকা</p>
                      <p className="text-2xl font-bold text-blue-700">৳{selectedFee.amount}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">জমাকৃত গন্তব্য</p>
                      <p className="font-semibold text-gray-700 mt-2">{selectedFee.fundCode}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">পেমেন্ট মেথড</label>
                  <div className="flex gap-4">
                    {["Cash", "Bkash", "Bank"].map((method) => (
                      <label key={method} className="flex items-center gap-2 border p-2.5 rounded-lg flex-1 cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={paymentMethod === method}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <span>{method}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={loading || !selectedFee} className="w-full bg-green-600 hover:bg-green-700 text-white font-medium p-3 rounded-lg transition">
                  {loading ? "প্রসেস হচ্ছে..." : "ফি সফলভাবে গ্রহণ করুন"}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
