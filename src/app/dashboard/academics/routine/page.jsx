"use client";
import { useState } from "react";
import RoutinePreview from "../../../../components/dashboard/academics/RoutinePreview";
import { toast } from "react-toastify";

export default function AdminRoutineForm() {
    const [activeTab, setActiveTab] = useState("form");
    const [examTitle, setExamTitle] = useState("প্রথম সাময়িক পরীক্ষা");
    const [hijriYear, setHijriYear] = useState("1447");
    const [gregorianYear, setGregorianYear] = useState("2026");
    const [note, setNote] = useState("সকল বিভাগের পরীক্ষার সময় সকাল ৯:০০ থেকে ১১:৩০ মিনিট পর্যন্ত");

    const [dates, setDates] = useState([
        { id: "col_1", hijri: "1447/02/23", gregorian: "18/08/2025", day: "সোমবার" },
        { id: "col_2", hijri: "1447/02/24", gregorian: "19/08/2025", day: "মঙ্গলবার" }
    ]);

    // ম্যানুয়ালি সকল বিভাগের সকল শ্রেণির নাম ইনিশিয়াল স্টেট হিসেবে সেট করা
    const [classes, setClasses] = useState([
        'প্লে',
        'নার্সারি',
        'প্রথম',
        'দ্বিতীয়',
        'তৃতীয়',
        'চতুর্থ',
        'পঞ্চম',
        'ষষ্ঠ',
        'সপ্তম',
        'অষ্টম',
        'কায়দা/আমপারা',
        'নাজেরা',
        'সবক',
        'শুনানি',
    ]);

    const [routineMatrix, setRoutineMatrix] = useState({});

    // ১. Gregorian Date (YYYY-MM-DD) থেকে Hijri (YYYY/MM/DD) অটো-কনভার্ট করার ফাংশন
    const convertToHijri = (isoDateStr) => {
        if (!isoDateStr) return "";
        try {
            const [year, month, day] = isoDateStr.split('-').map(Number);
            if (!year || !month || !day) return "";

            // UTC Date তৈরি
            const dateObj = new Date(Date.UTC(year, month - 1, day));
            if (isNaN(dateObj.getTime())) return "";

            const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umaalqura', {
                timeZone: 'UTC',
                day: 'numeric',
                month: 'numeric',
                year: 'numeric'
            });

            const parts = formatter.formatToParts(dateObj);
            let hYear = "", hMonth = "", hDay = "";

            parts.forEach(p => {
                if (p.type === 'year') hYear = p.value;
                if (p.type === 'month') hMonth = p.value.padStart(2, '0');
                if (p.type === 'day') hDay = p.value.padStart(2, '0');
            });

            return hYear && hMonth && hDay ? `${hYear}/${hMonth}/${hDay}` : "";
        } catch (e) {
            return "";
        }
    };

    // ২. ঈসায়ী তারিখ পরিবর্তনের সাথে সাথে হিজরী ও বারের নাম অটো-সেট করার হ্যান্ডলার
    const handleGregorianChange = (id, rawValue) => {
        if (!rawValue) {
            setDates((prev) => prev.map((d) => d.id === id ? { ...d, gregorian: "", gregorianRaw: "", hijri: "" } : d));
            return;
        }

        // YYYY-MM-DD -> DD/MM/YYYY ফরম্যাট
        const parts = rawValue.split('-');
        const formattedGregorian = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : rawValue;

        // অটো হিজরী ক্যালকুলেশন
        const calculatedHijri = convertToHijri(rawValue);

        // অটো বার (Day) ক্যালকুলেশন
        const daysMap = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
        const dateObj = new Date(rawValue);
        const dayName = !isNaN(dateObj.getTime()) ? daysMap[dateObj.getDay()] : "";

        setDates((prev) => prev.map((d) => {
            if (d.id === id) {
                return {
                    ...d,
                    gregorianRaw: rawValue,
                    gregorian: formattedGregorian,
                    hijri: calculatedHijri, // হিজরী অটো আপডেট
                    day: dayName || d.day   // বার অটো আপডেট
                };
            }
            return d;
        }));
    };

    const addDateColumn = () => {
        const newId = `col_${Date.now()}`;
        setDates((prev) => [...prev, { id: newId, hijri: "", gregorian: "", day: "সোমবার" }]);
    };

    const removeDateColumn = (id) => {
        setDates((prev) => prev.filter((d) => d.id !== id));
        setRoutineMatrix((prev) => {
            const next = { ...prev };
            Object.keys(next).forEach((cls) => {
                if (next[cls]) {
                    const { [id]: _, ...rest } = next[cls];
                    next[cls] = rest;
                }
            });
            return next;
        });
    };

    const updateDate = (id, field, value) => {
        setDates((prev) => prev.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
    };



    const addClassRow = () => {
        setClasses((prev) => [...prev, `নতুন শ্রেণি ${prev.length + 1}`]);
    };

    const removeClassRow = (index) => {
        const targetClass = classes[index];
        setClasses((prev) => prev.filter((_, idx) => idx !== index));

        setRoutineMatrix((prev) => {
            const next = { ...prev };
            delete next[targetClass];
            return next;
        });
    };

    const updateClassName = (index, value) => {
        const oldName = classes[index];

        setClasses((prev) => {
            const updated = [...prev];
            updated[index] = value;
            return updated;
        });

        if (oldName && oldName !== value) {
            setRoutineMatrix((prev) => {
                const next = { ...prev };
                if (next[oldName]) {
                    next[value] = next[oldName];
                    delete next[oldName];
                }
                return next;
            });
        }
    };

    const handleSubjectChange = (className, dateId, subject) => {
        setRoutineMatrix((prev) => ({
            ...prev,
            [className]: {
                ...(prev[className] || {}),
                [dateId]: subject
            }
        }));
    };

    const preparePayload = () => {
        const formattedRoutineData = classes.map((c) => ({
            class: c,
            subjects: routineMatrix[c] || {}
        }));

        return {
            examTitle,
            hijriYear,
            gregorianYear,
            note,
            dates,
            routineData: formattedRoutineData
        };
    };

    const handleSave = async () => {
        const payload = preparePayload();
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/admin/routine`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                toast.success("রুটিন ডেটাবেসে সফলভাবে সেভ হয়েছে!");
                setActiveTab("preview");
            } else {
                toast.error("রুটিন সেভ করতে সমস্যা হয়েছে: " + (data.error || data.message));
            }
        } catch (err) {
            toast.error("Error: " + err.message);
        }
    };

    const currentRoutinePayload = preparePayload();

    return (
        <div className="p-6 max-w-[1400px] mx-auto bg-gray-50 min-h-screen">
            <div className="flex space-x-4 border-b mb-6 print:hidden">
                <button
                    onClick={() => setActiveTab("form")}
                    className={`px-4 py-2 font-bold rounded-t ${activeTab === "form" ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-700"}`}
                >
                    📝 রুটিন ইনপুট ফরম
                </button>
                <button
                    onClick={() => setActiveTab("preview")}
                    className={`px-4 py-2 font-bold rounded-t ${activeTab === "preview" ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-700"}`}
                >
                    👁️ প্রিভিউ ও প্রিন্ট
                </button>
            </div>

            {activeTab === "form" ? (
                <div className="space-y-6 bg-white p-6 rounded shadow border">
                    <h2 className="text-xl font-bold border-b pb-2 text-gray-800">পরীক্ষার তথ্য ও মেটাডেটা</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1">পরীক্ষার নাম:</label>
                            <select
                                value={examTitle}
                                onChange={(e) => setExamTitle(e.target.value)}
                                className="w-full border p-2 rounded bg-white"
                            >
                                <option value="প্রথম সাময়িক পরীক্ষা">প্রথম সাময়িক পরীক্ষা</option>
                                <option value="দ্বিতীয় সাময়িক পরীক্ষা">দ্বিতীয় সাময়িক পরীক্ষা</option>
                                <option value="বার্ষিক পরীক্ষা">বার্ষিক পরীক্ষা</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">হিজরী বছর:</label>
                            <input
                                type="text"
                                value={hijriYear}
                                onChange={(e) => setHijriYear(e.target.value)}
                                className="w-full border p-2 rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">ঈসায়ী বছর:</label>
                            <input
                                type="text"
                                value={gregorianYear}
                                onChange={(e) => setGregorianYear(e.target.value)}
                                className="w-full border p-2 rounded"
                            />
                        </div>

                        <div className="md:col-span-3">
                            <label className="block text-sm font-semibold mb-1">বিশেষ দ্রষ্টব্য:</label>
                            <input
                                type="text"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="w-full border p-2 rounded"
                            />
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-bold text-gray-800">পরীক্ষার তারিখসমূহ</h3>
                            <button
                                type="button"
                                onClick={addDateColumn}
                                className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded hover:bg-blue-700"
                            >
                                + নতুন তারিখ যোগ করুন
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                            {dates.map((d, index) => {
                                // DD/MM/YYYY ফরম্যাট থেকে YYYY-MM-DD ফরম্যাটে আনা input element এর জন্য
                                let inputDateValue = "";
                                if (d.gregorian) {
                                    if (d.gregorian.includes('/')) {
                                        const p = d.gregorian.split('/');
                                        if (p.length === 3) inputDateValue = `${p[2]}-${p[1]}-${p[0]}`;
                                    } else {
                                        inputDateValue = d.gregorian;
                                    }
                                }

                                return (
                                    <div key={d.id} className="border p-3 rounded bg-gray-50 relative">
                                        <span className="text-xs font-bold bg-gray-200 px-2 py-0.5 rounded">
                                            কলাম {index + 1}
                                        </span>
                                        {dates.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeDateColumn(d.id)}
                                                className="text-red-600 font-bold text-xs absolute top-2 right-2 hover:underline"
                                            >
                                                মুছে ফেলুন
                                            </button>
                                        )}
                                        <div className="mt-2 space-y-2">
                                            <div>
                                                <label className="block text-[10px] text-gray-500 font-bold mb-0.5">ঈসায়ী তারিখ :</label>
                                                <input
                                                    type="date"
                                                    value={inputDateValue}
                                                    onChange={(e) => handleGregorianChange(d.id, e.target.value)}
                                                    className="w-full border p-1 text-sm rounded bg-white"
                                                />
                                            </div>
                                            <div>
                                                <div className="flex justify-between items-center mb-0.5">
                                                    <label className="block text-[10px] text-gray-500 font-bold">হিজরী তারিখ:</label>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateDate(d.id, "hijri", convertToHijri(d.gregorian))}
                                                        className="text-[10px] text-emerald-600 underline font-semibold"
                                                    >
                                                        Auto Sync
                                                    </button>
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="হিজরী (যেমন: 1447/02/23)"
                                                    value={d.hijri}
                                                    onChange={(e) => updateDate(d.id, "hijri", e.target.value)}
                                                    className="w-full border p-1 text-sm rounded bg-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] text-gray-500 font-bold mb-0.5">দিন:</label>
                                                <select
                                                    value={d.day}
                                                    onChange={(e) => updateDate(d.id, "day", e.target.value)}
                                                    className="w-full border p-1 text-sm rounded bg-white"
                                                >
                                                    <option value="শনিবার">শনিবার</option>
                                                    <option value="রবিবার">রবিবার</option>
                                                    <option value="সোমবার">সোমবার</option>
                                                    <option value="মঙ্গলবার">মঙ্গলবার</option>
                                                    <option value="বুধবার">বুধবার</option>
                                                    <option value="বৃহস্পতিবার">বৃহস্পতিবার</option>
                                                    <option value="শুক্রবার">শুক্রবার</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-bold text-gray-800">বিষয় ম্যাট্রিক্স ইনপুট</h3>
                            <button
                                type="button"
                                onClick={addClassRow}
                                className="bg-emerald-600 text-white text-sm px-3 py-1.5 rounded hover:bg-emerald-700"
                            >
                                + নতুন শ্রেণি যোগ করুন
                            </button>
                        </div>

                        <div className="overflow-x-auto border rounded">
                            <table className="w-full border-collapse text-sm">
                                <thead>
                                    <tr className="bg-gray-100 border-b">
                                        <th className="p-2 border border-gray-300 w-48 text-left">শ্রেণি</th>
                                        {dates.map((d, idx) => (
                                            <th key={d.id} className="p-2 border border-gray-300 text-center min-w-[120px]">
                                                <div>কলাম {idx + 1}</div>
                                                <div className="text-xs text-gray-500">{d.gregorian || "তারিখ নাই"}</div>
                                            </th>
                                        ))}
                                        <th className="p-2 border border-gray-300 w-16">অ্যাকশন</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classes.map((cls, cIdx) => (
                                        <tr key={cIdx} className="hover:bg-gray-50">
                                            <td className="p-2 border border-gray-300">
                                                <input
                                                    type="text"
                                                    value={cls}
                                                    onChange={(e) => updateClassName(cIdx, e.target.value)}
                                                    className="w-full border p-1 font-bold rounded"
                                                />
                                            </td>
                                            {dates.map((d) => (
                                                <td key={d.id} className="p-1 border border-gray-300">
                                                    <input
                                                        type="text"
                                                        placeholder="বিষয়"
                                                        value={routineMatrix[cls]?.[d.id] || ""}
                                                        onChange={(e) => handleSubjectChange(cls, d.id, e.target.value)}
                                                        className="w-full border p-1 rounded text-center text-xs"
                                                    />
                                                </td>
                                            ))}
                                            <td className="p-2 border border-gray-300 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => removeClassRow(cIdx)}
                                                    className="text-red-500 font-bold hover:text-red-700"
                                                >
                                                    ✕
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => setActiveTab("preview")}
                            className="px-5 py-2.5 bg-gray-600 text-white font-semibold rounded hover:bg-gray-700"
                        >
                            👁️ লাইভ প্রিভিউ দেখুন
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded hover:bg-emerald-700"
                        >
                            💾 ডেটাবেসে সেভ করুন
                        </button>
                    </div>
                </div>
            ) : (
                <RoutinePreview routine={currentRoutinePayload} />
            )}
        </div>
    );
}