"use client";
import { useState } from "react";
import RoutinePreview from "../../../../components/dashboard/academics/RoutinePreview";
import { toast } from "react-toastify";

export default function AdminRoutineForm() {
    const [activeTab, setActiveTab] = useState("form");
    const [examTitle, setExamTitle] = useState("");
    const [hijriYear, setHijriYear] = useState("1446 - 1447");
    const [gregorianYear, setGregorianYear] = useState("2025 - 2025");
    const [note, setNote] = useState("সকল বিভাগের পরীক্ষার সময় সকাল ৯:০০ থেকে ১১:৩০ মিনিট পর্যন্ত");

    const [selectedDivision, setSelectedDivision] = useState("all")
    const [selectedAcademyType, setSelectedAcademyType] = useState('all');
    const [selectedClass, setSelectedClass] = useState('all');


    const getAcademyClasses = (type) => {
        if (type === 'হিফজ') return []
        if (type === 'প্রাক-প্রাথমিক') return ['প্লে', 'নার্সারি'];
        if (type === 'প্রাথমিক') return ['প্রথম', 'দ্বিতীয়', 'তৃতীয়', 'চতুর্থ', 'পঞ্চম'];
        if (type === 'মাধ্যমিক') return ['ষষ্ঠ', 'সপ্তম', 'অষ্টম', 'নবম', 'দশম'];
        if (type === 'উচ্চমাধ্যমিক') return ['১১শ শ্রেণি', '১২ব শ্রেণি'];
        return [];
    };

    const getClassOptions = () => {
        if (selectedDivision === 'preHifz') {
            return ['কায়দা/আমপারা', 'নাজেরা'];
        }
        if (selectedDivision === 'hifz') {
            return ['সবক', 'শুনানি'];
        }
        if (selectedDivision === 'academy') {
            if (selectedAcademyType !== 'all') {
                return getAcademyClasses(selectedAcademyType);
            }
            return [
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
                'নবম',
                'দশম',
                '১১শ শ্রেণি',
                '১২ব শ্রেণি',
            ];
        }
        return [];
    };

    const [dates, setDates] = useState([
        { id: "col_1", hijri: "23/02/1447", gregorian: "18/08/2025", day: "সোমবার" },
        { id: "col_2", hijri: "24/02/1447", gregorian: "19/08/2025", day: "মঙ্গলবার" }
    ]);

    const [classes, setClasses] = useState(['প্রথম', 'দ্বিতীয়']);
    const [routineMatrix, setRoutineMatrix] = useState({});

    const handleAcademyTypeChange = (type) => {
        setAcademyType(type);
        const defaultClasses = getAcademyClasses(type);
        if (defaultClasses.length > 0) {
            setClasses(defaultClasses);
        }
    };

    const addDateColumn = () => {
        const newId = `col_${Date.now()}`;
        setDates((prev) => [...prev, { id: newId, hijri: "", gregorian: "", day: "সোমবার" }]);
    };

    const removeDateColumn = (id) => {
        setDates((prev) => prev.filter((d) => d.id !== id));
        // Clean up date column from matrix
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

        // Clean up deleted class from matrix
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
                    className={`px-4 py-2 font-bold rounded-t ${activeTab === "form" ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-700"
                        }`}
                >
                    📝 রুটিন ইনপুট ফরম (Admin)
                </button>
                <button
                    onClick={() => setActiveTab("preview")}
                    className={`px-4 py-2 font-bold rounded-t ${activeTab === "preview" ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-700"
                        }`}
                >
                    👁️ প্রিভিউ ও প্রিন্ট (Preview & Print)
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

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                বিভাগ
                            </label>
                            <select
                                value={selectedDivision}
                                onChange={(e) => {
                                    setSelectedDivision(e.target.value);
                                    setSelectedAcademyType('all');
                                    setSelectedClass('all');
                                }}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">সকল বিভাগ</option>
                                <option value="preHifz">প্রি-হিফজ</option>
                                <option value="hifz">হিফজ</option>
                                <option value="academy">একাডেমিক</option>
                            </select>
                        </div>

                        {selectedDivision === 'academy' && (
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    একাডেমি টাইপ
                                </label>
                                <select
                                    value={selectedAcademyType}
                                    onChange={(e) => {
                                        setSelectedAcademyType(e.target.value);
                                        setSelectedClass('all');
                                    }}
                                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">সকল টাইপ</option>
                                    <option value="প্রাক-প্রাথমিক">প্রাক-প্রাথমিক</option>
                                    <option value="প্রাথমিক">প্রাথমিক</option>
                                    <option value="মাধ্যমিক">মাধ্যমিক</option>
                                    <option value="উচ্চমাধ্যমিক">উচ্চমাধ্যমিক</option>
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                শ্রেণি
                            </label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                disabled={selectedDivision === 'all'}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            >
                                <option value="all">সকল শ্রেণি</option>
                                {getClassOptions().map((cls) => (
                                    <option key={cls} value={cls}>
                                        {cls}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
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
                            {dates.map((d, index) => (
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
                                        <input
                                            type="text"
                                            placeholder="হিজরী (যেমন: 23/02/1447)"
                                            value={d.hijri}
                                            onChange={(e) => updateDate(d.id, "hijri", e.target.value)}
                                            className="w-full border p-1 text-sm rounded"
                                        />
                                        <input
                                            type="text"
                                            placeholder="ঈসায়ী (যেমন: 18/08/2025)"
                                            value={d.gregorian}
                                            onChange={(e) => updateDate(d.id, "gregorian", e.target.value)}
                                            className="w-full border p-1 text-sm rounded"
                                        />
                                        <select
                                            value={d.day}
                                            onChange={(e) => updateDate(d.id, "day", e.target.value)}
                                            className="w-full border p-1 text-sm rounded"
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
                            ))}
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