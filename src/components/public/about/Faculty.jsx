// components/about/Faculty.jsx
"use client";

export default function Faculty({ data }) {
  const fallbackData = {
    title: "আমাদের শিক্ষকমণ্ডলী",
    subtitle: "দ্বীন ও আধুনিক শিক্ষার সমন্বয়ে শিক্ষার্থীদের গড়ে তুলছেন যাঁরা",
    list: [
      { id: 1, name: "মাওলানা কারী ওবায়দুল্লাহ", designation: "প্রধান শিক্ষক (হিফজ বিভাগ)", education: "হাফেজ, ক্বারী, দাওরায়ে হাদীস", image: "" },
      { id: 2, name: "মুফতি তারিক জামিল", designation: "সিনিয়র শিক্ষক (কিতাব বিভাগ)", education: "ইফতা (উচ্চতর ফিকহ), এম.এ", image: "" },
      { id: 3, name: "জনাব আশরাফুল ইসলাম", designation: "সহকারী শিক্ষক (জেনারেল বিভাগ)", education: "বি.এস.সি (গণিত), ঢাবি", image: "" }
    ]
  };

  const facultyData = data || fallbackData;

  return (
    <div id="faculty" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
      {/* এখানে id="faculty" এবং scroll-mt-24 যোগ করা হয়েছে */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 dark:text-emerald-4 flex items-center justify-center gap-3">
          <span className="hidden sm:inline text-amber-500">❖</span>
          {facultyData.title}
          <span className="hidden sm:inline text-amber-500">❖</span>
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{facultyData.subtitle}</p>
        <div className="w-24 h-1 bg-amber-500 mx-auto mt-4 rounded-full relative">
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-emerald-800 rotate-45 border border-amber-400"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {facultyData.list?.map((teacher, index) => (
          <div key={teacher.id || index} className="bg-white dark:bg-slate-800 border border-emerald-100/70 dark:border-slate-700 rounded-2xl p-6 text-center shadow-md relative overflow-hidden group">
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-emerald-900/10 to-transparent dark:from-emerald-950/40"></div>
            
            <div className="w-28 h-28 rounded-full mx-auto p-1.5 border-4 border-emerald-800 dark:border-emerald-600 bg-white dark:bg-slate-700 flex items-center justify-center overflow-hidden shadow-md relative z-10 mb-4">
              {teacher.image ? (
                <img src={teacher.image} alt={teacher.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="text-3xl text-emerald-900 dark:text-emerald-400 font-bold select-none">উস্তাদ</span>
              )}
            </div>

            <div className="relative z-10 space-y-1">
              <h4 className="text-lg font-bold text-emerald-950 dark:text-emerald-300">{teacher.name}</h4>
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-3 py-1 rounded-full inline-block border border-amber-100 dark:border-amber-900/30">
                {teacher.designation}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-slate-700/60 mt-2">
                🎓 {teacher.education}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
