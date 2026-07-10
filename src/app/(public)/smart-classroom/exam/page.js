// app/smart-classroom/exam/page.js
"use client";

export default function OnlineExamPage() {
  const exams = [
    { id: 1, title: "নাহব ও সরফ সাপ্তাহিক মূল্যায়ন পরীক্ষা", subject: "আরবি ব্যাকরণ", duration: "৩০ মিনিট", totalMarks: "৫০", status: "আসন্ন (আজ রাত ৯:০০ টা)" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-400">📝 অনলাইন পরীক্ষা পোর্টাল</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">ধারাবাহিক ও সাপ্তাহিক মূল্যায়নে অংশগ্রহণ করুন</p>
        </div>

        <div className="space-y-4">
          {exams.map((exam) => (
            <div key={exam.id} className="bg-white dark:bg-slate-800 border border-amber-200/60 dark:border-slate-700 p-6 rounded-2xl shadow-sm text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-md">{exam.subject}</span>
                <h3 className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-200 mt-1.5">{exam.title}</h3>
                <div className="flex flex-wrap gap-3 text-[11px] text-gray-400 mt-2 font-medium justify-center sm:justify-start">
                  <span>⏱️ সময়: {exam.duration}</span>
                  <span>💯 পূর্ণমান: {exam.totalMarks}</span>
                </div>
              </div>
              <button className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all w-full sm:w-auto">
                🔒 {exam.status}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
