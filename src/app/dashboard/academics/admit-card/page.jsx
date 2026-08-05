import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const AdmitCard = ({ studentId }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const componentRef = useRef();

    useEffect(() => {
        const fetchAdmitCard = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/admit-card/${studentId}`);
                if (res.data.success) {
                    setData(res.data.data);
                }
            } catch (err) {
                console.error("Failed to load admit card", err);
            } finally {
                setLoading(false);
            }
        };

        if (studentId) fetchAdmitCard();
    }, [studentId]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className="text-center p-10">লোড হচ্ছে...</div>;
    if (!data) return <div className="text-center p-10 text-red-500">এডমিট কার্ডের তথ্য পাওয়া যায়নি।</div>;

    const { student, examInfo, routine } = data;

    return (
        <div className="p-4 flex flex-col items-center bg-gray-100 min-h-screen">
            {/* প্রিন্ট বাটন */}
            <button 
                onClick={handlePrint}
                className="mb-4 print:hidden bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow"
            >
                প্রিন্ট করুন
            </button>

            {/* এডমিট কার্ড বক্স */}
            <div 
                ref={componentRef}
                className="w-[210mm] min-h-[297mm] bg-white border-2 border-gray-400 p-6 relative font-sans text-gray-800 shadow-lg print:shadow-none print:m-0"
            >
                {/* ১. হেডার সেকশন */}
                <div className="flex justify-between items-center border-b pb-3 relative z-10">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="Madrasah Logo" className="w-24 h-24 object-contain" />
                    </div>
                    <div className="text-center flex-1">
                        <h1 className="text-2xl font-bold text-indigo-900 tracking-wide" style={{ fontFamily: 'Arafat, sans-serif' }}>
                            مدرسة السلام النموذجية
                        </h1>
                        <h2 className="text-2xl font-bold text-red-600">আছ-সালাম আইডিয়াল মাদ্রাসা (AIM)</h2>
                        <h3 className="text-xl font-bold text-blue-700">As-Salam Ideal Madrasah</h3>
                        <p className="text-xs font-semibold text-sky-600 tracking-wider">AIM For Ultimate Success</p>
                    </div>
                    <div>
                        <img 
                            src={student.photoUrl} 
                            alt="Student" 
                            className="w-24 h-28 object-cover border-2 border-green-500 rounded p-1"
                        />
                    </div>
                </div>

                {/* ২. ওয়াটারমার্ক (লোগোর জলছাপ) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-10">
                    <img src="/logo.png" alt="Watermark" className="w-[380px] h-[380px] object-contain" />
                </div>

                {/* ৩. টাইটেল ও তথ্য */}
                <div className="relative z-10 my-3 text-center">
                    <span className="bg-cyan-100 text-cyan-900 text-sm font-bold px-4 py-1 rounded-md border border-cyan-300">
                        এডমিট কার্ড
                    </span>
                    <p className="text-sm font-semibold mt-2">({examInfo.examName} {examInfo.sessionYear})</p>
                    <p className="text-lg font-bold mt-1">শ্রেণি: {student.class}</p>
                </div>

                {/* ৪. স্টুডেন্ট প্রোফাইল গ্রিড */}
                <div className="relative z-10 grid grid-cols-2 gap-x-8 gap-y-2 my-4 text-sm font-semibold border-b pb-4 px-2">
                    <div className="flex"><span className="w-32">পরীক্ষার্থীর নাম:</span> <span>{student.nameBangla}</span></div>
                    <div className="flex"><span className="w-24">আইডি:</span> <span>{student.id}</span></div>
                    
                    <div className="flex"><span className="w-32">পিতার নাম:</span> <span>{student.fatherName}</span></div>
                    <div className="flex"><span className="w-24">রোল নং:</span> <span>{student.roll}</span></div>

                    <div className="flex"><span className="w-32">উপজেলা/থানা:</span> <span>{student.upazila}</span></div>
                    <div className="flex"><span className="w-24">হল নং:</span> <span>{student.hallNo}</span></div>

                    <div className="flex"><span className="w-32">জেলা:</span> <span>{student.district}</span></div>
                    <div className="flex"><span className="w-24">সিট নং:</span> <span>{student.seatNo}</span></div>
                </div>

                {/* ৫. স্বাক্ষর সেকশন */}
                <div className="relative z-10 flex justify-between items-end my-6 px-6 text-xs font-bold">
                    <div className="text-center">
                        <div className="h-8">/* Signature Image / Path */</div>
                        <p className="border-t border-gray-600 pt-1">পরীক্ষা নিয়ন্ত্রক এর স্বাক্ষর</p>
                    </div>
                    <div className="text-center">
                        <div className="h-8">/* Signature Image / Path */</div>
                        <p className="border-t border-gray-600 pt-1">প্রিন্সিপাল এর স্বাক্ষর</p>
                    </div>
                </div>

                {/* ৬. পরীক্ষার রুটিন */}
                <div className="relative z-10 mt-6">
                    <h4 className="text-center font-bold text-base mb-2">পরীক্ষার রুটিন</h4>
                    <table className="w-full border-collapse border border-gray-300 text-xs text-center">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-1.5">তারিখ</th>
                                <th className="border border-gray-300 p-1.5">বার</th>
                                <th className="border border-gray-300 p-1.5">বিষয়</th>
                            </tr>
                        </thead>
                        <tbody>
                            {routine.map((item, index) => (
                                <tr key={index} className="odd:bg-white even:bg-gray-50">
                                    <td className="border border-gray-300 p-1.5">{item.date}</td>
                                    <td className="border border-gray-300 p-1.5">{item.day}</td>
                                    <td className="border border-gray-300 p-1.5">{item.subject}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ৭. নির্দেশাবলী ও ফুটার */}
                <div className="relative z-10 mt-4 text-[11px] leading-relaxed">
                    <p className="font-bold">দৃষ্টি আকর্ষণ: বি: দ্র: সকল বিভাগের পরীক্ষার সময় {examInfo.examTime}</p>
                    <ul className="list-disc list-inside mt-1 space-y-0.5">
                        <li>পরীক্ষা শুরু হওয়ার ২০ মিনিট পূর্বে পরীক্ষা কক্ষে প্রবেশ করে নিজ আসনে বসতে হবে।</li>
                        <li>এডমিট কার্ড, আইডি কার্ড সাথে নিয়ে আসতে হবে।</li>
                        <li>মাদরাসার ড্রেস পরে আসতে হবে।</li>
                        <li>কলম/পেন্সিল, রাবারসহ প্রয়োজনীয় জিনিস সঙ্গে আনতে হবে।</li>
                    </ul>

                    <div className="mt-4 pt-2 border-t flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-[10px] text-gray-600">
                        <span>Contact: 01316-209201, 01748-868161</span>
                        <span>www.aimhabiganj.com</span>
                        <span>aimhabiganj@gmail.com</span>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default AdmitCard;
