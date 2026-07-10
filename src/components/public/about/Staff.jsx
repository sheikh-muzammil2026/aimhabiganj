// components/about/Staff.jsx
"use client";

export default function Staff({ data }) {
  const fallbackData = {
    title: "কর্মকর্তা ও কর্মচারী",
    subtitle: "মাদরাসার প্রশাসনিক ও সার্বিক ব্যবস্থাপনায় নিয়োজিত টিম",
    list: [
      { id: 1, name: "জনাব হাফেজ মো: নোমান", role: "অফিস সহকারী ও হিসাবরক্ষক", contact: "017XXXXXXXX" },
      { id: 2, name: "জনাব মো: আব্দুল করিম", role: "আবাসিক তত্ত্বাবধায়ক (নাযেম-এ-লিল্লাহ)", contact: "018XXXXXXXX" },
      { id: 3, name: "জনাব মো: সোলায়মান", role: "প্রধান বাবুর্চি", contact: "নন-পাবলিক" }
    ]
  };

  const staffData = data || fallbackData;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 dark:text-emerald-400 flex items-center justify-center gap-3">
          <span className="hidden sm:inline text-amber-500">❖</span>
          {staffData.title}
          <span className="hidden sm:inline text-amber-500">❖</span>
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{staffData.subtitle}</p>
        <div className="w-24 h-1 bg-amber-500 mx-auto mt-4 rounded-full relative">
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-emerald-800 rotate-45 border border-amber-400"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffData.list?.map((staff, index) => (
          <div key={staff.id || index} className="bg-white dark:bg-slate-800 border-l-4 border-amber-500 p-5 rounded-r-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-slate-700 rounded-full flex items-center justify-center text-xl text-emerald-900 dark:text-emerald-400 font-bold flex-shrink-0">
              {index + 1}
            </div>
            <div>
              <h4 className="text-base font-bold text-emerald-950 dark:text-emerald-300">{staff.name}</h4>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">{staff.role}</p>
              <p className="text-[11px] text-emerald-700 dark:text-amber-500/80 mt-1 font-mono">📞 {staff.contact}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
