// components/AdmissionFormPage3.jsx
"use client";

import React from "react";

export default function AdmissionFormPage3({ formData, handleChange, handleCheckboxChange }) {
  return (
    <div className="w-full min-h-[11.69in] bg-white p-4 md:p-10 flex flex-col justify-between box-border text-gray-800 relative font-bengali print:min-h-screen overflow-x-hidden">
      
      {/* ১. শিক্ষার্থীর অঙ্গীকারনামা */}
      <div className="w-full mb-6">
        <div className="text-center mb-4">
          <span className="border border-gray-500 rounded-full px-6 py-1 bg-gray-50 font-bold text-gray-800 text-sm shadow-sm inline-block">
            শিক্ষার্থীয় অঙ্গীকারনামা
          </span>
        </div>

        <div className="text-sm leading-relaxed text-gray-700 text-justify space-y-3">
          <p>
            আমি এই মর্মে অঙ্গীকার করছি যে, অত্র মাদরাসায় ভর্তি হয়ে প্রতিষ্ঠানের যাবতীয় নিয়ম-কানুন ও শৃঙ্খলা মেনে চলব এবং কোনো অবস্থাতেই নিয়মের পরিপন্থী কোনো কাজে লিপ্ত হব না। মাদরাসা কর্তৃপক্ষ কর্তৃক নির্ধারিত পোশাক (ইউনিফর্ম) পরিধান করে নিয়মিত ক্লাসে উপস্থিত থাকব।
          </p>
          <p>
            যদি আমি কোনো প্রকার শৃঙ্খলা ভঙ্গ বা প্রতিষ্ঠানের স্বার্থবিরোধী কাজে অংশ নিই, তবে কর্তৃপক্ষ আমাকে যেকোনো শাস্তি প্রদান কিংবা প্রতিষ্ঠান থেকে বহিষ্কার করতে পারবে এবং এতে আমার বা আমার অভিভাবকের কোনো আপত্তি থাকবে না।
          </p>
        </div>

        {/* শিক্ষার্থীর স্বাক্ষর ও তারিখ */}
        <div className="flex justify-between items-end mt-12">
          <div className="flex items-end gap-2 text-sm">
            <span className="font-bold text-gray-700">তারিখ:</span>
            <input type="date" name="studentSignatureDate" value={formData.studentSignatureDate || ""} onChange={handleChange} className="border border-gray-400 rounded px-1.5 py-0.5 text-xs focus:outline-none bg-transparent cursor-pointer" />
          </div>
          <div className="text-center w-32 sm:w-48 border-t border-gray-500 pt-1 text-xs sm:text-sm font-bold text-gray-700">
            শিক্ষার্থীর স্বাক্ষর
          </div>
        </div>
      </div>

      {/* ২. প্রয়োজনীয় সংযুক্তিসমূহ (চেকবক্স সেকশন) */}
      <div className="w-full mb-6 border border-gray-300 rounded-md p-4 bg-gray-50/30">
        <span className="font-bold text-gray-800 text-sm block mb-3 border-b pb-1">
          ভর্তির আবেদনের সাথে নিচে উল্লিখিত কাগজপত্রাদি অবশ্যই সংযুক্ত করতে হবে:
        </span>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <label className="flex items-start gap-2 cursor-pointer select-none">
            <input type="checkbox" name="attachStudentPhoto" checked={formData.attachments?.attachStudentPhoto || false} onChange={(e) => handleCheckboxChange("attachments", "attachStudentPhoto", e.target.checked)} className="mt-1 w-4 h-4 accent-orange-600 rounded flex-shrink-0" />
            <span>শিক্ষার্থীর পাসপোর্ট সাইজের ছবি (৩ কপি)</span>
          </label>

          <label className="flex items-start gap-2 cursor-pointer select-none">
            <input type="checkbox" name="attachParentsPhoto" checked={formData.attachments?.attachParentsPhoto || false} onChange={(e) => handleCheckboxChange("attachments", "attachParentsPhoto", e.target.checked)} className="mt-1 w-4 h-4 accent-orange-600 rounded flex-shrink-0" />
            <span>পিতা ও মাতার পাসপোর্ট সাইজের ছবি (১ কপি করে)</span>
          </label>

          <label className="flex items-start gap-2 cursor-pointer select-none">
            <input type="checkbox" name="attachBirthCertificate" checked={formData.attachments?.attachBirthCertificate || false} onChange={(e) => handleCheckboxChange("attachments", "attachBirthCertificate", e.target.checked)} className="mt-1 w-4 h-4 accent-orange-600 rounded flex-shrink-0" />
            <span>শিক্ষার্থীর জন্ম নিবন্ধন সনদের ফটোকপি (অনлайн ভেরিফাইড)</span>
          </label>

          <label className="flex items-start gap-2 cursor-pointer select-none">
            <input type="checkbox" name="attachParentsNid" checked={formData.attachments?.attachParentsNid || false} onChange={(e) => handleCheckboxChange("attachments", "attachParentsNid", e.target.checked)} className="mt-1 w-4 h-4 accent-orange-600 rounded flex-shrink-0" />
            <span>পিতা ও মাতার এনআইডি (NID) কার্ডের ফটোকপি</span>
          </label>

          <label className="flex items-start gap-2 cursor-pointer select-none md:col-span-2">
            <input type="checkbox" name="attachReportCard" checked={formData.attachments?.attachReportCard || false} onChange={(e) => handleCheckboxChange("attachments", "attachReportCard", e.target.checked)} className="mt-1 w-4 h-4 accent-orange-600 rounded flex-shrink-0" />
            <span>পূর্ববর্তী শিক্ষা প্রতিষ্ঠানের ছাড়পত্র/প্রশংসাপত্র এবং নম্বরপত্রের মূলকপি (প্রযোজ্য ক্ষেত্রে)</span>
          </label>
        </div>
      </div>

      {/* ৩. কেবল অফিসের ব্যবহারের জন্য (কার্যালয়ের পূরণীয় অংশ) */}
      <div className="w-full border-2 border-gray-400 rounded-lg p-4 sm:p-5 bg-gray-50/60 relative mt-6">
        <div className="absolute -top-3 left-4 sm:left-6 bg-white border border-gray-400 px-3 py-0.5 rounded-full font-bold text-[10px] sm:text-xs text-gray-700 tracking-wide uppercase">
          কেবল অফিসের ব্যবহারের জন্য
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mt-3">
          <div className="flex flex-col sm:flex-row sm:items-end gap-1">
            <span className="font-semibold text-gray-700 whitespace-nowrap">ভর্তি পরীক্ষার প্রাপ্ত নম্বর:</span>
            <input type="text" name="examMark" value={formData.officeUse?.examMark || ""} onChange={(e) => handleChange(e, "officeUse")} className="flex-1 border-b border-gray-400 text-center font-mono focus:outline-none bg-transparent pb-0.5" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end gap-1">
            <span className="font-semibold text-gray-700 whitespace-nowrap">মেধা স্থান:</span>
            <input type="text" name="meritPosition" value={formData.officeUse?.meritPosition || ""} onChange={(e) => handleChange(e, "officeUse")} className="flex-1 border-b border-gray-400 text-center font-mono focus:outline-none bg-transparent pb-0.5" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end gap-1">
            <span className="font-semibold text-gray-700 whitespace-nowrap">রোল নং:</span>
            <input type="text" name="officeRollNo" value={formData.officeUse?.officeRollNo || ""} onChange={(e) => handleChange(e, "officeUse")} className="flex-1 border-b border-gray-400 text-center font-mono focus:outline-none bg-transparent pb-0.5" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-2">
            <span className="font-semibold text-gray-700 whitespace-nowrap">ভর্তিকৃত শ্রেণী:</span>
            <input type="text" name="admittedClass" value={formData.officeUse?.admittedClass || ""} onChange={(e) => handleChange(e, "officeUse")} className="flex-1 border-b border-gray-400 focus:outline-none bg-transparent pb-0.5" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end gap-2">
            <span className="font-semibold text-gray-700 whitespace-nowrap">বিভাগ/শাখা:</span>
            <input type="text" name="admittedSection" value={formData.officeUse?.admittedSection || ""} onChange={(e) => handleChange(e, "officeUse")} className="flex-1 border-b border-gray-400 focus:outline-none bg-transparent pb-0.5" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-2">
            <span className="font-semibold text-gray-700 whitespace-nowrap">সেশনের নাম:</span>
            <input type="text" name="academicSession" value={formData.officeUse?.academicSession || ""} onChange={(e) => handleChange(e, "officeUse")} className="flex-1 border-b border-gray-400 text-center focus:outline-none bg-transparent pb-0.5" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end gap-2">
            <span className="font-semibold text-gray-700 whitespace-nowrap">ভর্তির তারিখ:</span>
            <input type="date" name="admissionDate" value={formData.officeUse?.admissionDate || ""} onChange={(e) => handleChange(e, "officeUse")} className="flex-1 border-b border-gray-400 focus:outline-none bg-transparent pb-0.5 cursor-pointer" />
          </div>
        </div>

        {/* অফিসিয়াল স্বাক্ষরসমূহ (মোবাইলে পারফেক্ট গ্রিড লেআউট) */}
        <div className="grid grid-cols-3 gap-2 mt-16 text-[10px] sm:text-xs md:text-sm font-bold text-gray-600 text-center">
          <div className="border-t border-gray-400 pt-1">
            আবেদন যাচাইকারী
          </div>
          <div className="border-t border-gray-400 pt-1">
            ভাইস প্রিন্সিপাল
          </div>
          <div className="border-t border-gray-400 pt-1 text-gray-800">
            অধ্যক্ষ / প্রিন্সিপাল
          </div>
        </div>
      </div>

      {/* একদম নিচের ফুটনোট বা প্রিন্ট সহায়ক বার্তা */}
      <div className="w-full text-center text-[10px] text-gray-400 border-t pt-2 mt-4 print:hidden">
        নির্ধারিত A4 সাইজে প্রিন্ট করার জন্য পেজ ব্রেক এবং মার্জিন সেট করা আছে।
      </div>

    </div>
  );
}
