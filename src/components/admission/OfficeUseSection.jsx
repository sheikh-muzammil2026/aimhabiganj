// components/OfficeUseSection.jsx
"use client";

import React from "react";

export default function OfficeUseSection({ formData, handleChange }) {
    // নেস্টেড অবজেক্ট 'officeUse' ডাটা হ্যান্ডলিং নিরাপদ করার জন্য হেল্পার
    const getValue = (key) => formData?.officeUse?.[key] || "";

    const handleNestedChange = (e) => {
        const { name, value } = e.target;
        handleChange({
            target: {
                name: "officeUse",
                value: {
                    ...(formData?.officeUse || {}),
                    [name]: value,
                },
            },
        });
    };

    return (
        <div className="w-full border-2 border-gray-400 rounded-lg p-4 sm:p-5 bg-gray-50/60 relative mt-8 font-bengali">
            {/* হেডার ব্যানার */}
            <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-sky-600 text-white px-4 sm:px-6 py-0.5 rounded-md font-bold text-xs sm:text-sm tracking-wide shadow-sm whitespace-nowrap">
                অফিসের জন্য প্রযোজ্য
            </div>

            <div className="space-y-5 text-sm mt-4">

                {/* লাইন ২: ভর্তি পরীক্ষায় প্রাপ্ত নম্বর, মন্তব্য এবং শ্রেণি */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col lg:flex-row lg:items-end gap-1">
                        <span className="font-bold text-gray-700 whitespace-nowrap text-xs sm:text-sm">ভর্তি পরীক্ষায় প্রাপ্ত নম্বর:</span>
                        <input
                            type="text"
                            name="examMark"
                            value={getValue("examMark")}
                            onChange={handleNestedChange}
                            className="w-full lg:flex-1 border-b border-gray-400 text-left lg:text-center font-mono focus:outline-none bg-transparent pb-0.5"
                        />
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-end gap-1">
                        <span className="font-bold text-gray-700 whitespace-nowrap text-xs sm:text-sm">মন্তব্য:</span>
                        <input
                            type="text"
                            name="comment"
                            value={getValue("comment")}
                            onChange={handleNestedChange}
                            className="w-full lg:flex-1 border-b border-gray-400 focus:outline-none bg-transparent pb-0.5"
                        />

                    </div>
                    <span className="font-bold text-gray-700 whitespace-nowrap text-xs sm:text-sm">শ্রেণিতে ভর্তি করা যেতে পারে</span>

                </div>

                {/* লাইন ৩: পরীক্ষকদের আইডি ও স্বাক্ষর সেকশন */}
                <div className="border border-dashed border-gray-300 p-3 rounded-md bg-white/50 space-y-3">
                    <span className="font-bold text-gray-600 text-xs block">পরীক্ষকবৃন্দের আইডি নং :</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <span className="text-xs text-gray-500">১ম পরীক্ষকের আইডি:</span>
                            <input
                                type="text"
                                name="examinerId1"
                                placeholder="আইডি নং..."
                                value={getValue("examinerId1")}
                                onChange={handleNestedChange}
                                className="w-full border-b border-gray-400 focus:outline-none bg-transparent pb-0.5 font-mono text-xs"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <span className="text-xs text-gray-500">২য় পরীক্ষকের আইডি:</span>
                            <input
                                type="text"
                                name="examinerId2"
                                placeholder="আইডি নং..."
                                value={getValue("examinerId2")}
                                onChange={handleNestedChange}
                                className="w-full border-b border-gray-400 focus:outline-none bg-transparent pb-0.5 font-mono text-xs"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <span className="text-xs text-gray-500">৩য় পরীক্ষকের আইডি:</span>
                            <input
                                type="text"
                                name="examinerId3"
                                placeholder="আইডি নং..."
                                value={getValue("examinerId3")}
                                onChange={handleNestedChange}
                                className="w-full border-b border-gray-400 focus:outline-none bg-transparent pb-0.5 font-mono text-xs"
                            />
                        </div>
                    </div>
                </div>

                {/* লাইন ৪: রসিদ নং এবং ছাত্র আইডি নং */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-end gap-1">
                        <span className="font-bold text-gray-700 whitespace-nowrap text-xs sm:text-sm">ভর্তির সমুদয় ফি পরিশোধের রশিদ নং:</span>
                        <input
                            type="text"
                            name="receiptNo"
                            value={getValue("receiptNo")}
                            onChange={handleNestedChange}
                            className="w-full sm:flex-1 border-b border-gray-400 focus:outline-none bg-transparent pb-0.5 font-mono"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-end gap-1">
                        <span className="font-bold text-gray-700 whitespace-nowrap text-emerald-800 text-xs sm:text-sm">ছাত্র আইডি নম্বর:</span>
                        <input
                            type="text"
                            name="studentId"
                            value={getValue("studentId")}
                            onChange={handleNestedChange}
                            className="w-full sm:flex-1 border-b border-orange-400 focus:outline-none bg-transparent pb-0.5 font-mono font-bold text-emerald-900 placeholder-gray-400"
                        />
                    </div>
                </div>

                {/* অফিসিয়াল স্বাক্ষরসমূহ */}
                <div className="grid grid-cols-3 gap-2 mt-16 text-[10px] sm:text-xs font-bold text-gray-600 text-center">
                    <div className="border-t border-gray-400 pt-1 whitespace-nowrap">কো-অর্ডিনেটর</div>
                    <div className="border-t border-gray-400 pt-1 whitespace-nowrap">ভাইস-প্রিন্সিপাল</div>
                    <div className="border-t border-gray-400 pt-1 text-gray-800 whitespace-nowrap">প্রিন্সিপাল</div>
                </div>
            </div>
        </div>
    );
}