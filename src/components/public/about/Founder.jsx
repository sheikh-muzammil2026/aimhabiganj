// components/about/Founder.jsx
"use client";

export default function Founder({ data }) {
  // ডাটাবেজ থেকে ডাটা না আসা পর্যন্ত দেখানোর জন্য ডামি ডাটা (Fallback Data)
  const fallbackData = {
    title: "প্রতিষ্ঠাতা পরিচিতি",
    name: "হাফেজ মাওলানা মুফতি আব্দুল্লাহ",
    designation: "প্রতিষ্ঠাতা ও প্রধান পরিচালক",
    image: "", // যদি মঙ্গোডিবিতে ইমেজের ইউআরএল থাকে, তবে এখানে বসবে
    messageTitle: "🖋️ প্রতিষ্ঠাতার বাণী",
    message: "আমাদের লক্ষ্য শুধুমাত্র কিছু হাফেজে কুরআন তৈরি করা নয়, বরং এমন একদল মুখলিস (নিষ্ঠাবান) উলামা ও নাগরিক তৈরি করা, যারা আধুনিক চ্যালেঞ্জ মোকাবেলা করে সমাজকে ইসলামের সঠিক বার্তা পৌঁছে দিতে পারে। আমরা নিয়তের বিশুদ্ধতা এবং সুন্নাহর পরিপূর্ণ অনুসরণের মাধ্যমে এই প্রতিষ্ঠানটিকে একটি আদেশ দ্বীনি মারকায হিসেবে গড়ে তুলতে বদ্ধপরিকর।",
    qualificationsLabel: "শিক্ষাগত যোগ্যতা",
    qualifications: "দওরায়ে হাদীস (টাইটেল), ইফতা (দারুল উলুম দেওবন্দ/তাত্পর্যপূর্ণ প্রতিষ্ঠান)",
    otherRolesLabel: "অন্যান্য দায়িত্ব",
    otherRoles: "খতীব, কেন্দ্রীয় জামে মসজিদ ও সদস্য, বেফাকুল মাদারিসিল আরাবিয়া।"
  };

  const founder = data || fallbackData;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* হেডিং সেকশন */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 dark:text-emerald-400 flex items-center justify-center gap-3">
          <span className="hidden sm:inline text-amber-500">❖</span>
          {founder.title}
          <span className="hidden sm:inline text-amber-500">❖</span>
        </h2>
        <div className="w-24 h-1 bg-amber-500 mx-auto mt-4 rounded-full relative">
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-emerald-800 rotate-45 border border-amber-400"></div>
        </div>
      </div>

      {/* প্রতিষ্ঠাতা প্রোফাইল লেআউট */}
      <div className="bg-white dark:bg-slate-800 border border-emerald-100 dark:border-slate-700/50 rounded-2xl shadow-lg p-6 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 dark:bg-emerald-950/20 rounded-bl-full -z-0 opacity-50"></div>

        {/* ইমেজ বা প্রফাইল সেকশন */}
        <div className="md:col-span-4 flex flex-col items-center text-center z-10">
          <div className="w-44 h-44 rounded-full p-1.5 border-4 border-emerald-800 dark:border-emerald-600 shadow-xl overflow-hidden bg-emerald-50 dark:bg-slate-700 flex items-center justify-center relative">
            {founder.image ? (
              <img src={founder.image} alt={founder.name} className="w-full h-full object-cover rounded-full" />
            ) : (
              <span className="text-4xl text-emerald-900 dark:text-emerald-400 font-bold select-none">
                মুফতি
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-emerald-950 dark:text-emerald-400 mt-4 mb-1">
            {founder.name}
          </h3>
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-900/50">
            {founder.designation}
          </p>
        </div>

        {/* জীবনবৃত্তান্ত ও বাণী */}
        <div className="md:col-span-8 space-y-4 z-10">
          <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-400 flex items-center gap-2">
            {founder.messageTitle}
          </h4>
          <p className="text-gray-600 dark:text-gray-300 text-justify leading-relaxed italic whitespace-pre-line">
            "{founder.message}"
          </p>
          
          <div className="pt-4 border-t border-gray-100 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-gray-400 dark:text-gray-500 block text-xs uppercase font-bold">
                {founder.qualificationsLabel}:
              </span>
              <p className="text-gray-700 dark:text-gray-200 font-medium">
                {founder.qualifications}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-gray-400 dark:text-gray-500 block text-xs uppercase font-bold">
                {founder.otherRolesLabel}:
              </span>
              <p className="text-gray-700 dark:text-gray-200 font-medium">
                {founder.otherRoles}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
