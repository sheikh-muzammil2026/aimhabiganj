import Image from "next/image";

export default function CalendarPage() {
    const monthsData = [
        {
            id: "07",
            name: "July",
            banglaSub: "আষাঢ়-শ্রাবণ ১৪৩৩ বাংলা",
            hijriSub: "মুহাররম-সফর ১৪৪৮ হিজরি",
            daysInMonth: 31,
            startDayOffset: 3, // Wednesday
            redDays: [3, 4, 10, 11, 17, 18, 24, 25, 31], // Fri & Sat highlight
        },
        {
            id: "08",
            name: "August",
            banglaSub: "শ্রাবণ-ভাদ্র ১৪৩৩ বাংলা",
            hijriSub: "সফর-রবিউল আউয়াল ১৪৪৮ হিজরি",
            daysInMonth: 31,
            startDayOffset: 6, // Saturday
            redDays: [1, 7, 8, 14, 15, 21, 22, 28, 29],
        },
        {
            id: "09",
            name: "September",
            banglaSub: "ভাদ্র-আশ্বিন ১৪৩৩ বাংলা",
            hijriSub: "রবিউল আউয়াল-সানি ১৪৪৮ হিজরি",
            daysInMonth: 30,
            startDayOffset: 2, // Tuesday
            redDays: [4, 5, 11, 12, 18, 19, 25, 26],
        },
        {
            id: "10",
            name: "October",
            banglaSub: "আশ্বিন-কার্তিক ১৪৩৩ বাংলা",
            hijriSub: "রবিউস সানি-জুমাদাল উলা ১৪৪৮ হিজরি",
            daysInMonth: 31,
            startDayOffset: 4, // Thursday
            redDays: [2, 3, 9, 10, 16, 17, 23, 24, 30, 31],
        },
        {
            id: "11",
            name: "November",
            banglaSub: "কার্তিক-অগ্রহায়ণ ১৪৩৩ বাংলা",
            hijriSub: "জুমাদাল উলা-উস সানি ১৪৪৮ হিজরি",
            daysInMonth: 30,
            startDayOffset: 0, // Sunday
            redDays: [6, 7, 13, 14, 20, 21, 27, 28],
        },
        {
            id: "12",
            name: "December",
            banglaSub: "অগ্রহায়ণ-পৌষ ১৪৩৩ বাংলা",
            hijriSub: "জুমাদাল সানি-রজব ১৪৪৮ হিজরি",
            daysInMonth: 31,
            startDayOffset: 2, // Tuesday
            redDays: [4, 5, 11, 12, 18, 19, 25, 26],
        },
    ];

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="max-w-[1200px] mx-auto p-4 bg-white text-gray-800 font-sans shadow-2xl border my-6">
            {/* Top Header Section */}
            <header className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b-2 border-emerald-800 pb-4">
                {/* Left Logo */}
                <div className="md:col-span-2 flex justify-center">
                    <Image
                        src="/aimlogo1.png"
                        alt="AIM Logo"
                        width={120}
                        height={120}
                        priority
                        className="object-contain"
                    />
                </div>

                {/* Center Title */}
                {/* <div className="md:col-span-7 text-center space-y-1">
                    <p className="text-xl font-bold text-gray-700 tracking-wide">
                        مدرسة السلام النموذجية
                    </p>
                    <h1 className="text-3xl font-extrabold text-red-700">
                        আস-সালাম আইডিয়াল মাদ্রাসা <span className="text-emerald-800">(এইম)</span>
                    </h1>
                    <h2 className="text-2xl font-bold text-emerald-900 tracking-tight">
                        As-Salam Ideal Madrasah
                    </h2>
                    <p className="text-sm font-semibold text-emerald-700 italic">
                        A I M For Ultimate Success
                    </p>
                </div> */}
                <div className="md:col-span-10 relative h-60 w-full  overflow-hidden">
                    <Image
                        src="/banner_routine.png"
                        alt="As-Salam Ideal Madrasah Campus Banner"
                        fill
                        sizes="(max-width: 768px) 100vw, 66vw"
                        className="object-fill object-center"
                        priority
                    />
                </div>

                {/* Right Info Box */}
                {/* <div className="md:col-span-3 bg-red-900 text-white p-3 rounded-lg text-xs space-y-1">
                    <p className="font-bold text-yellow-300 text-center border-b border-red-700 pb-1">
                        যে কোনো প্রয়োজনে সহযোগিতা করুন
                    </p>
                    <p>
                        <strong>Ac Name:</strong> As-Salam Ideal Madrasah
                    </p>
                    <p>
                        <strong>Ac No:</strong> 190712100000675
                    </p>
                    <p className="text-[10px] text-gray-200">
                        Shahjalal Islami Bank, Habiganj Branch
                    </p>
                    <div className="bg-pink-700 text-center py-1 mt-1 rounded font-bold">
                        বিকাশ / নগদ (Personal): 01748-868161
                    </div>
                    <p className="text-[11px] text-center text-yellow-200 pt-1 font-semibold">
                        আবাসিক শিক্ষার্থীদের সাথে যোগাযোগ: 01314-738585
                    </p>
                </div> */}
            </header>

            {/* Hero / Banner Image & Year Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 my-4 items-center bg-gray-50 p-2 rounded-md">
                <div className="md:col-span-4 text-center md:text-left">
                    <div className="text-6xl font-black text-red-600 tracking-tighter">2026</div>
                    <p className="text-lg font-bold text-gray-700">১৪৩২-৩৩ বাংলা</p>
                    <p className="text-lg font-bold text-emerald-800">১৪৪৭-৪৮ হিজরি</p>
                </div>

                {/* Building Banner Image (Next.js Optimized) */}
                {/* <div className="md:col-span-8 relative h-48 w-full rounded-lg overflow-hidden shadow">
                    <Image
                        src="/banner.png"
                        alt="As-Salam Ideal Madrasah Campus Banner"
                        fill
                        sizes="(max-width: 768px) 100vw, 66vw"
                        className="object-cover object-center"
                        priority
                    />
                </div> */}
            </div>

            {/* Calendar Months Grid (6 Months) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                {monthsData.map((month) => {
                    // Empty days offset padding
                    const emptySlots = Array.from({ length: month.startDayOffset });
                    const daysArray = Array.from({ length: month.daysInMonth }, (_, i) => i + 1);

                    return (
                        <div
                            key={month.id}
                            className="border border-emerald-700 rounded-md overflow-hidden bg-white shadow-sm"
                        >
                            {/* Month Header */}
                            <div className="bg-emerald-800 text-white p-2 flex justify-between items-center">
                                <div className="flex items-baseline space-x-1">
                                    <span className="text-2xl font-bold">{month.id}</span>
                                    <span className="text-xl font-bold">{month.name}</span>
                                </div>
                                <div className="text-[10px] text-right leading-tight text-emerald-100">
                                    <p>{month.banglaSub}</p>
                                    <p>{month.hijriSub}</p>
                                </div>
                            </div>

                            {/* Day Headers */}
                            <div className="grid grid-cols-7 text-center text-xs font-bold bg-emerald-100 border-b py-1">
                                {daysOfWeek.map((day, idx) => (
                                    <span
                                        key={day}
                                        className={idx === 5 || idx === 6 ? "text-red-600" : "text-emerald-900"}
                                    >
                                        {day}
                                    </span>
                                ))}
                            </div>

                            {/* Dates Grid */}
                            <div className="grid grid-cols-7 text-center text-sm p-1 gap-y-1">
                                {emptySlots.map((_, index) => (
                                    <div key={`empty-${index}`} className="h-7"></div>
                                ))}
                                {daysArray.map((day) => {
                                    const isRed = month.redDays.includes(day);
                                    return (
                                        <div
                                            key={day}
                                            className={`h-7 flex items-center justify-center font-bold rounded ${isRed ? "text-red-600 bg-red-50" : "text-gray-800"
                                                }`}
                                        >
                                            {day}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Academic Routine & Holiday Table */}
            <section className="mt-8 border-2 border-emerald-800 rounded-lg overflow-hidden">
                <div className="bg-emerald-800 text-white text-center py-2 text-lg font-bold">
                    একাডেমিক কার্যক্রম ও ছুটির তালিকা
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 text-xs bg-gray-50">
                    {/* Term 1 */}
                    <div className="border p-3 rounded bg-white shadow-sm space-y-2">
                        <h3 className="font-bold text-emerald-800 border-b pb-1">
                            ১ম সেমিস্টারের সময়সীমা: ১ জানুয়ারি থেকে ৭ ফেব্রুয়ারি
                        </h3>
                        <ul className="space-y-1 text-gray-700">
                            <li>• শিক্ষক প্রশিক্ষণ: ১১ জানুয়ারি থেকে ০৪ মে</li>
                            <li>• ১ম সাময়িক পরীক্ষা: ৭ মে থেকে ১৯ মে</li>
                            <li>• ফলাফল প্রকাশ: ৩০ জুন</li>
                        </ul>
                        <div className="bg-red-100 p-2 rounded mt-2">
                            <p className="font-bold text-red-700 mb-1">১ম সেমিস্টারের অবকাশ:</p>
                            <p>• স্বাধীনতা ও জাতীয় দিবস (২৬ মার্চ): ০১ দিন</p>
                            <p>• রমজান ও ঈদুল ফিতর: ২৬ দিন</p>
                        </div>
                    </div>

                    {/* Term 2 */}
                    <div className="border p-3 rounded bg-white shadow-sm space-y-2">
                        <h3 className="font-bold text-emerald-800 border-b pb-1">
                            ২য় সেমিস্টারের সময়সীমা: ৮ জুন থেকে ১৫ সেপ্টেম্বর
                        </h3>
                        <ul className="space-y-1 text-gray-700">
                            <li>• বই বিতরণ: ১ জানুয়ারি</li>
                            <li>• ২য় সাময়িক পরীক্ষা: ২৩ আগস্ট থেকে ৭ সেপ্টেম্বর</li>
                            <li>• অভিভাবক মতবিনিময়: ৪ সেপ্টেম্বর</li>
                        </ul>
                        <div className="bg-red-100 p-2 rounded mt-2">
                            <p className="font-bold text-red-700 mb-1">২য় সেমিস্টারের অবকাশ:</p>
                            <p>• আশুরা: ০১ দিন</p>
                            <p>• ঈদুল আযহা: ১০ দিন</p>
                        </div>
                    </div>

                    {/* Term 3 */}
                    <div className="border p-3 rounded bg-white shadow-sm space-y-2">
                        <h3 className="font-bold text-emerald-800 border-b pb-1">
                            ৩য় সেমিস্টারের সময়সীমা: ১৬ সেপ্টেম্বর থেকে ৩১ ডিসেম্বর
                        </h3>
                        <ul className="space-y-1 text-gray-700">
                            <li>• ৩য় সাময়িক পরীক্ষা: ২২ নভেম্বর থেকে ৬ ডিসেম্বর</li>
                            <li>• ফলাফল প্রকাশ ও পুরস্কার বিতরণ: ১২ ডিসেম্বর</li>
                            <li>• ভর্তি ফর্ম বিতরণ: ০১ ডিসেম্বর থেকে ২৬ ডিসেম্বর</li>
                        </ul>
                        <div className="bg-red-100 p-2 rounded mt-2">
                            <p className="font-bold text-red-700 mb-1">৩য় সেমিস্টারের অবকাশ:</p>
                            <p>• বার্ষিক পরীক্ষা উত্তর ছুটি: ১২ দিন</p>
                            <p>• সর্বমোট ছুটি: ৫৭ দিন</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Info Banner */}
            <footer className="mt-4 bg-emerald-900 text-white p-4 rounded-lg flex flex-col md:flex-row justify-between items-center text-xs space-y-2 md:space-y-0">
                <div>
                    <p className="font-bold text-emerald-200">
                        এইম ক্যাম্পাস, দক্ষিণ শ্যামলী আ/এ, হবিগঞ্জ-৩৩০০
                    </p>
                    <p>মোবাইল (অফিস): 01316 209 201, 01748 868 161</p>
                </div>
                <div className="text-right">
                    <p>www.aimhabiganj.com</p>
                    <p>aimhabiganj@gmail.com</p>
                </div>
            </footer>
        </div>
    );
}