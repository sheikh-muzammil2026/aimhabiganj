// components/OfficeUseSection.jsx
"use client";

import React from "react";

export default function OfficeUseSection({ formData, handleChange }) {

    const getValue = (key) => formData?.officeUse?.[key] || "";

    const handleNestedChange = (e) => {
        const { name, value } = e.target;


        const updatedOfficeUse = {
            ...(formData?.officeUse || {}),
            [name]: value,
        };


        const currentTotal = (
            (parseFloat(updatedOfficeUse.markTilawat) || 0) +
            (parseFloat(updatedOfficeUse.markArabic) || 0) +
            (parseFloat(updatedOfficeUse.markEnglish) || 0) +
            (parseFloat(updatedOfficeUse.markMath) || 0) +
            (parseFloat(updatedOfficeUse.markOthers) || 0)
        );


        updatedOfficeUse.totalMarks = currentTotal;

        handleChange({
            target: {
                name: "officeUse",
                value: updatedOfficeUse,
            },
        });
    };

    // এখন নিচের ভ্যারিয়েবলটি সরাসরি স্টেট থেকে রিড করবে
    const totalMarks = formData?.officeUse?.totalMarks || 0;

    return (
        <div className="w-full border-2 border-gray-400 rounded-lg p-4 sm:p-5 bg-gray-50/60 relative mt-8 font-bengali">
            {/* হেডার ব্যানার */}
            <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-sky-600 text-white px-4 sm:px-6 py-0.5 rounded-md font-bold text-xs sm:text-sm tracking-wide shadow-sm whitespace-nowrap">
                অফিসের জন্য প্রযোজ্য
            </div>

            <div className="space-y-5 text-sm mt-4">

                {/* ১. ভর্তি পরীক্ষায় প্রাপ্ত নম্বরের সেকশন (রেসপন্সিভ গ্রিড) */}
                <div className="border border-dashed border-gray-300 p-3 sm:p-4 rounded-md bg-white/50 space-y-4">
                    <span className="font-bold text-gray-700 text-xs sm:text-sm block">
                        ভর্তি পরীক্ষায় প্রাপ্ত নম্বরের বিবরণ :
                    </span>

                    {/* বিষয়ভিত্তিক ইনপুট (ছোট স্ক্রিনে ২ কলাম, বড় স্ক্রিনে ৫ কলাম) */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-600">তিলাওয়াত:</span>
                            <input
                                type="number"
                                name="markTilawat"
                                placeholder="০"
                                value={getValue("markTilawat")}
                                onChange={handleNestedChange}
                                className="w-full border-b border-gray-400 focus:outline-none bg-transparent pb-0.5 font-mono text-center text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-600">আরবি:</span>
                            <input
                                type="number"
                                name="markArabic"
                                placeholder="০"
                                value={getValue("markArabic")}
                                onChange={handleNestedChange}
                                className="w-full border-b border-gray-400 focus:outline-none bg-transparent pb-0.5 font-mono text-center text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-600">ইংরেজি:</span>
                            <input
                                type="number"
                                name="markEnglish"
                                placeholder="০"
                                value={getValue("markEnglish")}
                                onChange={handleNestedChange}
                                className="w-full border-b border-gray-400 focus:outline-none bg-transparent pb-0.5 font-mono text-center text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-600">গণিত:</span>
                            <input
                                type="number"
                                name="markMath"
                                placeholder="০"
                                value={getValue("markMath")}
                                onChange={handleNestedChange}
                                className="w-full border-b border-gray-400 focus:outline-none bg-transparent pb-0.5 font-mono text-center text-sm"
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1 flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-600">অন্যান্য:</span>
                            <input
                                type="number"
                                name="markOthers"
                                placeholder="০"
                                value={getValue("markOthers")}
                                onChange={handleNestedChange}
                                className="w-full border-b border-gray-400 focus:outline-none bg-transparent pb-0.5 font-mono text-center text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* ২. সর্বমোট নম্বর ও মন্তব্য/ভর্তির শ্রেণি সেকশন */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    {/* স্বয়ংক্রিয় মোট যোগফলের ফিল্ড */}
                    <div className="flex items-end gap-1">
                        <span className="font-bold text-gray-700 whitespace-nowrap text-xs sm:text-sm">সর্বমোট প্রাপ্ত নম্বর:</span>
                        <div className="flex-1 md:w-24 border-b border-sky-600 text-center font-mono font-bold text-sky-800 pb-0.5 text-sm sm:text-base">
                            {totalMarks}
                        </div>
                    </div>

                    {/* মন্তব্য (যা মূলত শ্রেণির ড্রপডাউন) এবং পরবর্তী টেক্সট */}
                    <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-end gap-2 flex-wrap">
                        <span className="font-bold text-gray-700 whitespace-nowrap text-xs sm:text-sm">মন্তব্য:</span>

                        <select
                            name="recommendedClass"
                            value={getValue("recommendedClass")}
                            onChange={handleNestedChange}
                            className="min-w-[140px] flex-1 sm:flex-none border-b border-gray-400 focus:outline-none bg-transparent pb-0.5 font-bold text-sky-800 text-center cursor-pointer"
                        >
                            <option value="">বাছাই করুন...</option>

                            <option disabled className="font-bold bg-gray-200 text-gray-700">-- হিফজ --</option>
                            <option value="কায়দা/আমপারা">কায়দা/আমপারা</option>
                            <option value="নাজেরা">নাজেরা</option>

                            <option disabled className="font-bold bg-gray-200 text-gray-700">-- প্রাক-প্রাথমিক --</option>
                            <option value="প্লে">প্লে</option>
                            <option value="নার্সারি">নার্সারি</option>

                            <option disabled className="font-bold bg-gray-200 text-gray-700">-- প্রাথমিক --</option>
                            <option value="১ম শ্রেণি">১ম শ্রেণি</option>
                            <option value="২য় শ্রেণি">২য় শ্রেণি</option>
                            <option value="৩য় শ্রেণি">৩য় শ্রেণি</option>
                            <option value="৪র্থ শ্রেণি">৪র্থ শ্রেণি</option>
                            <option value="৫ম শ্রেণি">৫ম শ্রেণি</option>

                            <option disabled className="font-bold bg-gray-200 text-gray-700">-- মাধ্যমিক --</option>
                            <option value="৬ষ্ঠ শ্রেণি">৬ষ্ঠ শ্রেণি</option>
                            <option value="৭ম শ্রেণি">৭ম শ্রেণি</option>
                            <option value="৮ম শ্রেণি">৮ম শ্রেণি</option>
                            <option value="নবম শ্রেণি">নবম শ্রেণি</option>
                            <option value="দশম শ্রেণি">দশম শ্রেণি</option>

                            <option disabled className="font-bold bg-gray-200 text-gray-700">-- উচ্চমাধ্যমিক --</option>
                            <option value="১১শ শ্রেণি">১১শ শ্রেণি</option>
                            <option value="১২শ শ্রেণি">১২শ শ্রেণি</option>
                        </select>

                        <span className="font-bold text-gray-700 whitespace-nowrap text-xs sm:text-sm pt-1 sm:pt-0">
                            তে ভর্তি করা যেতে পারে।
                        </span>
                    </div>
                    <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-600">রোল নম্বর:</span>
                            <input
                                type="text"
                                name="rollNumber"
                                placeholder="রোল নং..."
                                value={getValue("rollNumber")}
                                onChange={handleNestedChange}
                                className="w-full border-b border-gray-400 focus:outline-none bg-transparent pb-0.5 font-mono text-xs"
                            />
                        </div>
                </div>

                {/* ২.২. ফি সংক্রান্ত তথ্য সেকশন (নতুন যুক্ত করা হয়েছে) */}
                <div className="border border-dashed border-gray-300 p-3 rounded-md bg-white/50 space-y-3">
                    <span className="font-bold text-gray-700 text-xs sm:text-sm block">
                        ফি সংক্রান্ত তথ্য :
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-600">ধার্যকৃত মাসিক ফি (টাকা):</span>
                            <input
                                type="number"
                                name="monthlyFee"
                                placeholder="০"
                                value={getValue("monthlyFee")}
                                onChange={handleNestedChange}
                                className="w-full border-b border-gray-400 focus:outline-none bg-transparent pb-0.5 font-mono text-xs"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-600">ফি ক্যাটাগরি / স্কলারশিপ:</span>
                            <select
                                name="feeCategory"
                                value={getValue("feeCategory")}
                                onChange={handleNestedChange}
                                className="w-full border-b border-gray-400 focus:outline-none bg-transparent pb-0.5 text-xs cursor-pointer font-bold text-gray-800"
                            >
                                <option value="General">সাধারণ (General)</option>
                                <option value="Orphan">এতিম ফান্ড (Orphan)</option>
                                <option value="Poor Fund">গরিব ফান্ড (Poor Fund)</option>
                                <option value="Scholarship">স্কলারশিপ (Scholarship)</option>
                                <option value="Staff Child">শিক্ষক/স্টাফ সন্তান</option>
                            </select>
                        </div>
                    </div>
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
                        <div className="flex flex-col gap-1.5 ">
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
                <div className="w-full space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-end gap-1">
                        <span className="font-bold text-gray-700 whitespace-nowrap text-xs sm:text-sm">ভর্তির সমুদয় ফি পরিশোধের রশিদ নং:</span>
                        <input
                            type="text"
                            name="receiptNo"
                            value={getValue("receiptNo")}
                            onChange={handleNestedChange}
                            className="w-full flex-1 sm:flex-1 border-b border-gray-400 focus:outline-none bg-transparent pb-0.5 font-mono"
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
        </div >
    );
}