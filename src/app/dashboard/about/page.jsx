// src/app/dashboard/admin/about/page.jsx
"use client";

import { useState, useEffect } from "react";

const sections = [
  { id: "profile", name: "প্রতিষ্ঠান পরিচিতি", hasList: false, label: "পরিচিতি বর্ণনা" },
  { id: "founder", name: "প্রতিষ্ঠাতা পরিচিতি", hasList: false, label: "জীবনবৃত্তান্ত ও বাণী" },
  { id: "vision", name: "লক্ষ্য ও উদ্দেশ্য", hasList: true, label: "পয়েন্টসমূহ", fields: ["title", "desc"] },
  { id: "committee", name: "পরিচালনা পর্ষদ", hasList: true, fields: ["name", "designation", "image"] },
  { id: "features", name: "আমাদের বৈশিষ্ট্য", hasList: true, fields: ["title", "desc"] },
  { id: "roadmap", name: "ভবিষ্যৎ পরিকল্পনা", hasList: true, fields: ["year", "plan"] },
  { id: "testimonials", name: "মতামত (শিক্ষার্থী ও উলামা)", hasList: true, fields: ["name", "role", "quote"] },
  { id: "policies", name: "নীতিমালা", hasList: true, fields: ["ruleNumber", "title", "details"] },
  { id: "faculty", name: "শিক্ষকমণ্ডলী", hasList: true, fields: ["name", "designation", "education", "image"] },
  { id: "staff", name: "কর্মকর্তা ও কর্মচারী", hasList: true, fields: ["name", "designation", "image"] },
  { id: "roster", name: "কর্মক্ষেত্র ও দায়িত্ব", hasList: true, fields: ["name", "duty", "time"] },
];

export default function AboutDashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({ title: "", subtitle: "", content: "", listItems: [] });
  const [newItem, setNewItem] = useState({});
  const [message, setMessage] = useState("");

  const currentSection = sections.find(s => s.id === activeTab);

  // ট্যাব পরিবর্তন হলে স্ট্যাটিক্যালি ফিল্ড ও স্টেট রিসেট হবে (API কল রিমুভড)
  useEffect(() => {
    setFormData({
      title: currentSection.name,
      subtitle: "",
      content: "",
      listItems: []
    });
    
    const initialFields = {};
    currentSection.fields?.forEach(f => initialFields[f] = "");
    setNewItem(initialFields);
  }, [activeTab]);

  // স্ট্যাটিক ফর্ম সাবমিট হ্যান্ডলার (API রিমুভড)
  const handleSave = (e) => {
    e.preventDefault();
    setMessage("সংরক্ষণ করা হচ্ছে (স্ট্যাটিক)...");
    
    // লোকাল স্টেটে ডাটা লক করার সাকসেস মেসেজ সিমুলেশন
    setTimeout(() => {
      setMessage("স্ট্যাটিক্যালি ফর্ম আপডেট হয়েছে! ✓");
      setTimeout(() => setMessage(""), 3000);
    }, 500);
  };

  // স্ট্যাটিক লিস্ট আইটেম অ্যাড করা
  const addListItem = () => {
    if (Object.values(newItem).some(val => val === "")) {
      alert("অনুগ্রহ করে সব ফিল্ড পূরণ করুন!");
      return;
    }
    const updatedList = [...(formData.listItems || []), { ...newItem, id: Date.now() }];
    setFormData({ ...formData, listItems: updatedList });
    
    // ফিল্ড খালি করা
    const clearedFields = {};
    currentSection.fields?.forEach(f => clearedFields[f] = "");
    setNewItem(clearedFields);
  };

  // স্ট্যাটিক লিস্ট থেকে আইটেম ডিলিট করা
  const deleteListItem = (id) => {
    const updatedList = formData.listItems.filter(item => item.id !== id);
    setFormData({ ...formData, listItems: updatedList });
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-4 sm:p-6 lg:p-8 text-slate-800 dark:text-slate-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-black text-emerald-900 dark:text-emerald-400 mb-6 border-b pb-3">
          🛠️ আমাদের সম্পর্কে (About Us) পেজ ম্যানেজমেন্ট ড্যাশবোর্ড
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* বাম পাশের ট্যাব সাব-মেনু */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-xl p-3 shadow-md space-y-1 h-fit">
            <p className="text-xs font-bold text-gray-400 px-3 uppercase tracking-wider mb-2">সেকশন সমূহ</p>
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveTab(sec.id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === sec.id
                    ? "bg-emerald-800 text-white shadow-md dark:bg-emerald-600"
                    : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                }`}
              >
                {sec.name}
              </button>
            ))}
          </div>

          {/* ডান পাশের ডাইনামিক এডিটর ফর্ম */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md relative">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>📝</span> {currentSection.name} এডিট করছেন
              </h2>
              {message && (
                <span className="text-sm bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold dark:bg-emerald-950 dark:text-emerald-300 animate-fade-in">
                  {message}
                </span>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* টাইটেল এবং সাবটাইটেল */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1.5 text-slate-500">সেকশন মেইন হেডিং (বাংলায়)</label>
                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 focus:outline-emerald-600 animate-none"
                    placeholder="উদা: আমাদের শিক্ষকমণ্ডলী"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1.5 text-slate-500">সেকশন সাব-হেডিং / স্লোগান</label>
                  <input
                    type="text"
                    value={formData.subtitle || ""}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 focus:outline-emerald-600 animate-none"
                    placeholder="উদা: দ্বীন ও আধুনিক শিক্ষার সমন্বয়ে..."
                  />
                </div>
              </div>

              {/* যদি সেকশনটি শুধু টেক্সট বেসড হয় */}
              {!currentSection.hasList && (
                <div>
                  <label className="block text-xs font-bold uppercase mb-1.5 text-slate-500">{currentSection.label}</label>
                  <textarea
                    rows="8"
                    value={formData.content || ""}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 focus:outline-emerald-600 animate-none"
                    placeholder="এখানে বিস্তারিত বিবরণ লিখুন..."
                  ></textarea>
                </div>
              )}

              {/* যদি সেকশনটি লিস্ট বেসড হয় */}
              {currentSection.hasList && (
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-sm font-bold text-amber-600 mb-3 uppercase tracking-wider">📋 তালিকা আইটেম যুক্ত করুন</h3>
                  
                  {/* ডাইনামিক ইনপুট জেনারেটর */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border dark:border-slate-700">
                    {currentSection.fields?.map((field) => (
                      <div key={field}>
                        <label className="block text-xs font-semibold text-slate-400 mb-1 capitalize">
                          {field === "name" ? "নাম" : field === "designation" ? "পদবি" : field === "image" ? "ছবির লিঙ্ক" : field === "education" ? "শিক্ষাগত যোগ্যতা" : field}
                        </label>
                        <input
                          type="text"
                          value={newItem[field] || ""}
                          onChange={(e) => setNewItem({ ...newItem, [field]: e.target.value })}
                          className="w-full px-3 py-1.5 text-sm border rounded bg-white dark:bg-slate-800 dark:border-slate-700 animate-none"
                          placeholder={`${field} লিখুন`}
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addListItem}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold py-2 px-4 rounded transition w-full md:w-auto h-fit"
                    >
                      ➕ যোগ করুন
                    </button>
                  </div>

                  {/* বর্তমান তালিকার প্রিভিউ ও ডিলিট টেবিল */}
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200">
                          <th className="p-2 border dark:border-slate-600">ক্রমিক</th>
                          {currentSection.fields?.map(f => (
                            <th key={f} className="p-2 border dark:border-slate-600 capitalize">{f}</th>
                          ))}
                          <th className="p-2 border dark:border-slate-600 text-center">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!formData.listItems || formData.listItems.length === 0 ? (
                          <tr>
                            <td colSpan={currentSection.fields ? currentSection.fields.length + 2 : 2} className="p-4 text-center text-gray-400">
                              তালিকায় কোনো ডাটা নেই। ওপর থেকে যোগ করুন।
                            </td>
                          </tr>
                        ) : (
                          formData.listItems.map((item, index) => (
                            <tr key={item.id || index} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                              <td className="p-2 border dark:border-slate-600 font-bold">{index + 1}</td>
                              {currentSection.fields?.map(f => (
                                <td key={f} className="p-2 border dark:border-slate-600 truncate max-w-[150px]">{item[f]}</td>
                              ))}
                              <td className="p-2 border dark:border-slate-600 text-center">
                                <button
                                  type="button"
                                  onClick={() => deleteListItem(item.id)}
                                  className="bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white text-xs font-bold px-2 py-1 rounded transition"
                                >
                                  ❌ ডিলিট
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* মেইন অ্যাকশন বাটন */}
              <div className="flex justify-end gap-3 border-t pt-4">
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-6 py-2.5 rounded-lg shadow-md transition transform hover:-translate-y-0.5"
                >
                  💾 ফর্ম আপডেট করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
