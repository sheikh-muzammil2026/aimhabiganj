"use client";

import React, { useEffect, useState } from 'react';

const AdmitCard = ({ studentId }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdmitCard = async () => {
            try {
                setLoading(true);
                setError(null);

                // Express Backend Server URL (আপনার পোর্ট অনুযায়ী পরিবর্তন করতে পারেন)
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API/api/admit-card/${studentId}`);
                
                if (!response.ok) {
                    throw new Error("এডমিট কার্ডের তথ্য লোড করতে সমস্যা হয়েছে।");
                }

                const result = await response.json();

                if (result.success) {
                    setData(result.data);
                } else {
                    setError(result.message || "শিক্ষার্থী খুঁজে পাওয়া যায়নি।");
                }
            } catch (err) {
                console.error("Fetch Admit Card Error:", err);
                setError("সার্ভার থেকে ডাটা আনতে সমস্যা হয়েছে।");
            } finally {
                setLoading(false);
            }
        };

        if (studentId) {
            fetchAdmitCard();
        }
    }, [studentId]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return <div className="text-center p-10 font-bold text-gray-600">লোড হচ্ছে...</div>;
    }

    if (error || !data) {
        return <div className="text-center p-10 font-bold text-red-500">{error || "কোনো তথ্য পাওয়া যায়নি।"}</div>;
    }

    const { student, examInfo, routine } = data;

    return (
        <div className="p-4 flex flex-col items-center bg-gray-100 min-h-screen">
            {/* প্রিন্ট বাটন */}
            <button
                onClick={handlePrint}
                className="mb-4 print:hidden bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded shadow cursor-pointer transition"
            >
                প্রিন্ট করুন
            </button>

            {/* অ্যাডমিট কার্ড মেইন কার্ডের বর্ডার */}
            <div className="w-[210mm] bg-white border-2 border-gray-400 p-6 relative font-sans text-gray-800 shadow-lg print:shadow-none print:m-0 print:border-none">
                
                {/* ১. ওয়াটারমার্ক / লোগোর জ্বলছাপ (ইমেজের মত হুবহু সেন্টারে) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-10">
                    <img
                        src="/logo.png"
                        alt="Watermark Logo"
                        className="w-[340px] h-[340px] object-contain"
                    />
                </div>

                {/* ২. হেডার সেকশন */}
                <div className="flex justify-between items-center border-b pb-3 relative z-10">
                    {/* বাম পাশে লোগো */}
                    <div className="w-24 flex justify-start">
                        <img
                            src="/logo.png"
                            alt="Madrasah Logo"
                            className="w-24 h-24 object-contain"
                        />
                    </div>

                    {/* মাঝখানে মাদরাসার নাম ও স্লোগান */}
                    <div className="text-center flex-1 px-2">
                        <h1 className="text-2xl font-bold text-indigo-950 tracking-wide font-serif">
                            مدرسة السلام النموذجية
                        </h1>
                        <h2 className="text-2xl font-black text-red-600 leading-tight">
                            আছ-সালাম আইডিয়াল মাদ্রাসা (AIM)
                        </h2>
                        <h3 className="text-xl font-bold text-red-600">
                            As-Salam Ideal Madrasah
                        </h3>
                        <p className="text-xs font-semibold text-sky-600 tracking-wider mt-0.5">
                            <span className="text-cyan-500 font-bold">AiM</span> For Ultimate Success
                        </p>
                    </div>

                    {/* ডান পাশে শিক্ষার্থীর ছবি */}
                    <div className="w-24 flex justify-end">
                        <img
                            src={student.photoUrl || "/placeholder-student.jpg"}
                            alt="Student Photo"
                            className="w-24 h-28 object-cover border-2 border-green-500 p-0.5"
                        />
                    </div>
                </div>

                {/* ৩. এডমিট কার্ড ব্যাজ ও পরীক্ষার সাল */}
                <div className="relative z-10 my-3 text-center">
                    <span className="bg-cyan-100 text-cyan-900 text-sm font-bold px-4 py-1 rounded-md border border-cyan-300 inline-block">
                        এডমিট কার্ড
                    </span>
                    <p className="text-xs font-semibold mt-2 text-gray-800">
                        ({examInfo.examName} {examInfo.sessionYear})
                    </p>
                    <p className="text-base font-bold mt-1 text-gray-900">
                        শ্রেণি: {student.class}
                    </p>
                </div>

                {/* ৪. পরীক্ষার্থীর বিস্তারিত তথ্য গ্রিড */}
                <div className="relative z-10 grid grid-cols-2 gap-x-8 gap-y-2 my-4 text-sm font-semibold border-t border-b py-3 px-2">
                    <div className="flex"><span className="w-32 text-gray-700">পরীক্ষার্থীর নাম:</span> <span className="font-bold text-gray-900">{student.nameBangla}</span></div>
                    <div className="flex"><span className="w-24 text-gray-700">আইডি:</span> <span className="font-bold text-gray-900">{student.id}</span></div>

                    <div className="flex"><span className="w-32 text-gray-700">পিতার নাম:</span> <span className="font-bold text-gray-900">{student.fatherName}</span></div>
                    <div className="flex"><span className="w-24 text-gray-700">রোল নং:</span> <span className="font-bold text-gray-900">{student.roll}</span></div>

                    <div className="flex"><span className="w-32 text-gray-700">উপজেলা/থানা:</span> <span className="font-bold text-gray-900">{student.upazila}</span></div>
                    <div className="flex"><span className="w-24 text-gray-700">হল নং:</span> <span className="font-bold text-gray-900">{student.hallNo}</span></div>

                    <div className="flex"><span className="w-32 text-gray-700">জেলা:</span> <span className="font-bold text-gray-900">{student.district}</span></div>
                    <div className="flex"><span className="w-24 text-gray-700">সিট নং:</span> <span className="font-bold text-gray-900">{student.seatNo}</span></div>
                </div>

                {/* ৫. স্বাক্ষর সেকশন */}
                <div className="relative z-10 flex justify-between items-end my-6 px-8 text-xs font-bold">
                    <div className="text-center">
                        <div className="h-7 flex items-end justify-center">
                            {/* যদি স্বাক্ষরের ইমেজ থাকে তবে এখানে <img> বসবে */}
                        </div>
                        <p className="border-t border-gray-600 pt-1 text-gray-800">পরীক্ষা নিয়ন্ত্রক এর স্বাক্ষর</p>
                    </div>
                    <div className="text-center">
                        <div className="h-7 flex items-end justify-center">
                            {/* যদি স্বাক্ষরের ইমেজ থাকে তবে এখানে <img> বসবে */}
                        </div>
                        <p className="border-t border-gray-600 pt-1 text-gray-800">প্রিন্সিপাল এর স্বাক্ষর</p>
                    </div>
                </div>

                {/* ৬. পরীক্ষার রুটিন */}
                <div className="relative z-10 mt-4">
                    <h4 className="text-center font-bold text-base mb-2 text-gray-900">পরীক্ষার রুটিন</h4>
                    <table className="w-full border-collapse border border-gray-300 text-xs text-center">
                        <thead>
                            <tr className="bg-gray-100 font-bold">
                                <th className="border border-gray-300 p-1.5 w-1/4">তারিখ</th>
                                <th className="border border-gray-300 p-1.5 w-1/4">বার</th>
                                <th className="border border-gray-300 p-1.5 w-2/4">বিষয়</th>
                            </tr>
                        </thead>
                        <tbody>
                            {routine && routine.map((item, index) => (
                                <tr key={index} className="odd:bg-white even:bg-gray-50">
                                    <td className="border border-gray-300 p-1.5">{item.date}</td>
                                    <td className="border border-gray-300 p-1.5">{item.day}</td>
                                    <td className="border border-gray-300 p-1.5 font-medium">{item.subject}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ৭. বিশেষ নির্দেশাবলী ও ফুটার */}
                <div className="relative z-10 mt-4 text-[11px] leading-relaxed text-gray-800">
                    <p className="font-bold">দৃষ্টি আকর্ষণ: <span className="font-bold ml-4">বি: দ্র: সকল বিভাগের পরীক্ষার সময় {examInfo.examTime}</span></p>
                    
                    <ul className="list-disc list-inside mt-1 space-y-0.5 text-gray-900 font-medium">
                        <li>পরীক্ষা শুরু হওয়ার ২০ মিনিট পূর্বে পরীক্ষা কক্ষে প্রবেশ করে নিজ আসনে বসতে হবে</li>
                        <li>এডমিট কার্ড, আইডি কার্ড সাথে নিয়ে আসতে হবে</li>
                        <li>মাদরাসার ড্রেস পরে আসতে হবে</li>
                        <li>কলম/পেন্সিল, রাবারসহ প্রয়োজনীয় জিনিস সঙ্গে আনতে হবে</li>
                    </ul>

                    {/* যোগাযোগের ঠিকানা ও সোশ্যাল লিংক */}
                    <div className="mt-4 pt-2 border-t border-gray-200 flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-[10px] text-gray-700 font-medium">
                        <span>Contact: 01316-209201, 01748-868161</span>
                        <span>🌐 www.aimhabiganj.com</span>
                        <span>✉️ aimhabiganj@gmail.com</span>
                    </div>

                    {/* সফটওয়্যার ডেভলপার ক্রেডিট */}
                    <div className="text-center text-[9px] text-gray-400 mt-2">
                        Software developed by: GreenBangla21. Phone: +880 1720 646498
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdmitCard;
