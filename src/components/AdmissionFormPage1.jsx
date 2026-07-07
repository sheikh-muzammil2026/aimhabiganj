// components/AdmissionFormPage1.jsx
"use client";

import React from "react";

export default function AdmissionFormPage1({ formData, handleChange }) {
  return (
    <div className="w-full min-h-[11.69in] bg-white p-10 flex flex-col justify-between box-border text-gray-800 relative font-bengali print:min-h-screen">
      
      {/* হেডার সেকশন: ক্রমিক নং এবং ছবি সংযুক্তি */}
      <div className="flex justify-between items-start w-full mb-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-700">ক্রমিক নং :</span>
            <input
              type="text"
              name="serialNo"
              value={formData.serialNo}
              onChange={handleChange}
              className="w-28 border border-gray-400 px-2 py-1 rounded text-sm focus:outline-none focus:border-orange-500"
            />
          </div>
          
          {/* ক্যাটাগরি চেকবক্স: নতুন, আবাসিক, অনাবাসিক, ডে-কেয়ার */}
          <div className="flex flex-wrap gap-4 pt-2">
            {["নতুন", "আবাসিক", "অনাবাসিক", "ডে-কেয়ার"].map((type) => (
              <label key={type} className="flex items-center gap-2 font-bold text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={type}
                  checked={formData.status === type}
                  onChange={handleChange}
                  className="w-4 h-4 accent-orange-600"
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* শিক্ষার্থীর ছবি আপলোডের বক্স */}
        <div className="w-32 h-40 border-2 border-dashed border-gray-400 bg-gray-50 flex flex-col items-center justify-center p-2 text-center rounded">
          <span className="text-xs font-bold text-gray-500">শিক্ষার্থীর ছবি</span>
        </div>
      </div>

      {/* সেকশন ১: শিক্ষার্থীর তথ্য বিবরণী */}
      <div className="w-full mb-6">
        <div className="bg-[#231f20] text-white font-bold px-4 py-1.5 text-sm inline-block rounded-r-md mb-6 transform -skew-x-12">
          <span className="inline-block skew-x-12">শিক্ষার্থীর তথ্য বিবরণী:</span>
        </div>

        <div className="space-y-5">
          {/* নামসমূহ */}
          <div className="flex items-end gap-3">
            <span className="font-bold text-gray-700 whitespace-nowrap">নাম (বাংলায়) :</span>
            <input
              type="text"
              name="studentNameBangla"
              value={formData.studentNameBangla}
              onChange={handleChange}
              className="flex-1 border-b border-dotted border-gray-400 pb-1 focus:outline-none focus:border-orange-500 bg-transparent font-medium"
            />
          </div>

          <div className="flex items-end gap-3">
            <span className="font-bold text-gray-700 whitespace-nowrap">ইংরেজিতে :</span>
            <input
              type="text"
              name="studentNameEnglish"
              value={formData.studentNameEnglish}
              onChange={handleChange}
              className="flex-1 border-b border-dotted border-gray-400 pb-1 focus:outline-none focus:border-orange-500 bg-transparent font-medium uppercase"
            />
          </div>

          <div className="flex items-end gap-3">
            <span className="font-bold text-gray-700 whitespace-nowrap">আরবিতে :</span>
            <input
              type="text"
              name="studentNameArabic"
              value={formData.studentNameArabic}
              onChange={handleChange}
              className="flex-1 border-b border-dotted border-gray-400 pb-1 text-right focus:outline-none focus:border-orange-500 bg-transparent font-medium"
              dir="rtl"
            />
          </div>

          {/* জন্ম তারিখ, বয়স, লিঙ্গ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-700 whitespace-nowrap">জন্ম তারিখ :</span>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="border border-gray-400 rounded px-2 py-1 text-sm focus:outline-none focus:border-orange-500 text-gray-700 cursor-pointer"
              />
            </div>
            <div className="flex items-end gap-2">
              <span className="font-bold text-gray-700 whitespace-nowrap">বয়স :</span>
              <input
                type="text"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="flex-1 border-b border-dotted border-gray-400 pb-1 text-center focus:outline-none focus:border-orange-500 bg-transparent"
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold text-gray-700">লিঙ্গ :</span>
              {["পুরুষ", "মহিলা"].map((g) => (
                <label key={g} className="flex items-center gap-1.5 font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={handleChange}
                    className="accent-orange-600"
                  />
                  <span>{g}</span>
                </label>
              ))}
            </div>
          </div>

          {/* জন্মসনদ নং */}
          <div className="flex items-end gap-3">
            <span className="font-bold text-gray-700 whitespace-nowrap">জন্মসনদ পত্র নং :</span>
            <input
              type="text"
              name="birthCertificateNo"
              value={formData.birthCertificateNo}
              onChange={handleChange}
              placeholder="১৭ ডিজিটের নম্বর"
              className="flex-1 border-b border-dotted border-gray-400 pb-1 focus:outline-none focus:border-orange-500 bg-transparent tracking-widest font-mono"
            />
          </div>

          {/* রক্তের গ্রুপ, ওজন, উচ্চতা, জাতীয়তা */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-700 whitespace-nowrap">রক্তের গ্রুপ :</span>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="border border-gray-400 rounded px-1.5 py-1 text-sm focus:outline-none focus:border-orange-500 bg-white"
              >
                <option value="">বাছাই করুন</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-1">
              <span className="font-bold text-gray-700 whitespace-nowrap">ওজন:</span>
              <input type="text" name="weight" value={formData.weight} onChange={handleChange} className="w-16 border-b border-dotted border-gray-400 text-center focus:outline-none" />
            </div>
            <div className="flex items-end gap-1">
              <span className="font-bold text-gray-700 whitespace-nowrap">উচ্চতা:</span>
              <input type="text" name="height" value={formData.height} onChange={handleChange} className="w-16 border-b border-dotted border-gray-400 text-center focus:outline-none" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-700 whitespace-nowrap">জাতীয়তা :</span>
              <select name="nationality" value={formData.nationality} onChange={handleChange} className="border border-gray-400 rounded px-1 py-0.5 text-sm focus:outline-none bg-white">
                <option value="বাংলাদেশী">বাংলাদেশী</option>
                <option value="অন্যান্য">অন্যান্য</option>
              </select>
            </div>
          </div>

          {/* বর্তমান ঠিকানা */}
          <div className="space-y-3 pt-2">
            <span className="font-bold text-gray-700 block">বর্তমান ঠিকানা :</span>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-end pl-4">
              <div className="flex items-end gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">বাড়ি নং:</span>
                <input type="text" name="currentAddress.house" value={formData.currentAddress?.house || ""} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">রাস্তা নং:</span>
                <input type="text" name="currentAddress.road" value={formData.currentAddress?.road || ""} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">গ্রাম/মহল্লা:</span>
                <input type="text" name="currentAddress.village" value={formData.currentAddress?.village || ""} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">ডাকঘর:</span>
                <input type="text" name="currentAddress.postOffice" value={formData.currentAddress?.postOffice || ""} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none" />
              </div>
              
              {/* থানা ড্রপডাউন (হবিগঞ্জের প্রধান থানা সহ) */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">থানা:</span>
                <select name="currentAddress.thana" value={formData.currentAddress?.thana || ""} onChange={handleChange} className="flex-1 border border-gray-400 rounded p-0.5 text-sm bg-white">
                  <option value="">বাছাই করুন</option>
                  {["হবিগঞ্জ সদর", "নবীগঞ্জ", "বাহুবল", "চুনারুঘাট", "মাধবপুর", "লাখাই", "বানিয়াচং", "আজমিরীগঞ্জ", "শায়েস্তাগঞ্জ"].map((thana) => (
                    <option key={thana} value={thana}>{thana}</option>
                  ))}
                </select>
              </div>

              {/* জেলা ড্রপডাউন */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">জেলা:</span>
                <select name="currentAddress.district" value={formData.currentAddress?.district || ""} onChange={handleChange} className="flex-1 border border-gray-400 rounded p-0.5 text-sm bg-white">
                  <option value="">বাছাই করুন</option>
                  {["হবিগঞ্জ", "সিলেট", "সুনামগঞ্জ", "মৌলভীবাজার", "ঢাকা", "চট্টগ্রাম", "অন্যান্য"].map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* স্থায়ী ঠিকানা */}
          <div className="space-y-3 pt-2">
            <span className="font-bold text-gray-700 block">স্থায়ী ঠিকানা :</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pl-4">
              <div className="flex items-end gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">বাড়ি নং:</span>
                <input type="text" name="permanentAddress.house" value={formData.permanentAddress?.house || ""} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">রাস্তা নং:</span>
                <input type="text" name="permanentAddress.road" value={formData.permanentAddress?.road || ""} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">গ্রাম/মহল্লা:</span>
                <input type="text" name="permanentAddress.village" value={formData.permanentAddress?.village || ""} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* এলাকার পরিচিত ব্যক্তি */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end pt-2">
            <div className="flex items-end gap-2">
              <span className="font-bold text-gray-700 whitespace-nowrap">এলাকার পরিচিত ব্যক্তির নাম :</span>
              <input type="text" name="referenceName" value={formData.referenceName} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none" />
            </div>
            <div className="flex items-end gap-2">
              <span className="font-bold text-gray-700 whitespace-nowrap">মোবাইল :</span>
              <input type="text" name="referenceMobile" value={formData.referenceMobile} onChange={handleChange} placeholder="০১৭XXXXXXXX" className="flex-1 border-b border-dotted border-gray-400 focus:outline-none font-mono" />
            </div>
          </div>
        </div>
      </div>

      {/* সেকশন ২: ভর্তিচ্ছক বিভাগ (ছক) */}
      <div className="w-full mb-6">
        <div className="bg-[#231f20] text-white font-bold px-4 py-1.5 text-sm inline-block rounded-r-md mb-4 transform -skew-x-12">
          <span className="inline-block skew-x-12">ভর্তিচ্ছু বিভাগ:</span>
        </div>

        {/* ছবির টেবিল ফরম্যাট */}
        <div className="overflow-x-auto border border-gray-400 rounded">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-400 font-bold text-gray-700">
                <th className="p-2 border-r border-gray-400 text-center w-12">টিক</th>
                <th className="p-2 border-r border-gray-400">বিভাগ</th>
                <th className="p-2 border-r border-gray-400">ধরণ</th>
                <th className="p-2">শ্রেণি</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-400">
              {/* রো ১: প্রি-হিফজ */}
              <tr>
                <td className="p-2 border-r border-gray-400 text-center">
                  <input type="checkbox" name="divisionPreHifz.active" checked={formData.divisionPreHifz?.active || false} onChange={handleChange} className="w-4 h-4 accent-orange-600" />
                </td>
                <td className="p-2 border-r border-gray-400 font-bold text-gray-700">প্রি-হিফজ</td>
                <td className="p-2 border-r border-gray-400">
                  <select name="divisionPreHifz.type" value={formData.divisionPreHifz?.type || ""} onChange={handleChange} className="border border-gray-300 rounded p-0.5 text-xs bg-white w-full">
                    <option value="">বাছাই করুন</option>
                    <option value="আবাসিক">আবাসিক</option>
                    <option value="অনাবাসিক">অনাবাসিক</option>
                    <option value="ডে-কেয়ার">ডে-কেয়ার</option>
                    <option value="কায়দা/আমপারা/নাজেরা/হুফ">কায়দা/আমপারা/নাজেরা/হুফ</option>
                  </select>
                </td>
                <td className="p-2">
                  <input type="text" name="divisionPreHifz.class" value={formData.divisionPreHifz?.class || ""} onChange={handleChange} className="w-full border-b border-gray-300 focus:outline-none px-1 text-xs" />
                </td>
              </tr>
              {/* রো ২: হিফজ */}
              <tr>
                <td className="p-2 border-r border-gray-400 text-center">
                  <input type="checkbox" name="divisionHifz.active" checked={formData.divisionHifz?.active || false} onChange={handleChange} className="w-4 h-4 accent-orange-600" />
                </td>
                <td className="p-2 border-r border-gray-400 font-bold text-gray-700">হিফজ</td>
                <td className="p-2 border-r border-gray-400">
                  <select name="divisionHifz.type" value={formData.divisionHifz?.type || ""} onChange={handleChange} className="border border-gray-300 rounded p-0.5 text-xs bg-white w-full">
                    <option value="">বাছাই করুন</option>
                    <option value="আবাসিক">আবাসিক</option>
                    <option value="অনাবাসিক">অনাবাসিক</option>
                    <option value="ডে-কেয়ার">ডে-কেয়ার</option>
                  </select>
                </td>
                <td className="p-2">
                  <input type="text" name="divisionHifz.class" value={formData.divisionHifz?.class || ""} onChange={handleChange} className="w-full border-b border-gray-300 focus:outline-none px-1 text-xs" />
                </td>
              </tr>
              {/* রো ৩: একাডেমিক */}
              <tr>
                <td className="p-2 border-r border-gray-400 text-center">
                  <input type="checkbox" name="divisionAcademic.active" checked={formData.divisionAcademic?.active || false} onChange={handleChange} className="w-4 h-4 accent-orange-600" />
                </td>
                <td className="p-2 border-r border-gray-400 font-bold text-gray-700">একাডেমিক</td>
                <td className="p-2 border-r border-gray-400">
                  <select name="divisionAcademic.type" value={formData.divisionAcademic?.type || ""} onChange={handleChange} className="border border-gray-300 rounded p-0.5 text-xs bg-white w-full">
                    <option value="">বাছাই করুন</option>
                    <option value="আবাসিক">আবাসিক</option>
                    <option value="অনাবাসিক">অনাবাসিক</option>
                    <option value="ডে-কেয়ার">ডে-কেয়ার</option>
                  </select>
                </td>
                <td className="p-2">
                  <input type="text" name="divisionAcademic.class" value={formData.divisionAcademic?.class || ""} onChange={handleChange} className="w-full border-b border-gray-300 focus:outline-none px-1 text-xs" />
                </td>
              </tr>
              {/* রো ৪: আরবি ভাষা শিক্ষা কোর্স */}
              <tr>
                <td className="p-2 border-r border-gray-400 text-center">
                  <input type="checkbox" name="divisionArabicCourse.active" checked={formData.divisionArabicCourse?.active || false} onChange={handleChange} className="w-4 h-4 accent-orange-600" />
                </td>
                <td className="p-2 border-r border-gray-400 font-bold text-gray-700">আরবি ভাষা শিক্ষা কোর্স</td>
                <td className="p-2 border-r border-gray-400">
                  <select name="divisionArabicCourse.type" value={formData.divisionArabicCourse?.type || ""} onChange={handleChange} className="border border-gray-300 rounded p-0.5 text-xs bg-white w-full">
                    <option value="">বাছাই করুন</option>
                    <option value="আবাসিক">আবাসিক</option>
                    <option value="অনাবাসিক">অনাবাসিক</option>
                    <option value="ডে-কেয়ার">ডে-কেয়ার</option>
                  </select>
                </td>
                <td className="p-2">
                  <input type="text" name="divisionArabicCourse.class" value={formData.divisionArabicCourse?.class || ""} onChange={handleChange} className="w-full border-b border-gray-300 focus:outline-none px-1 text-xs" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* সেকশন ৩: পূর্বে অধ্যয়নরত প্রতিষ্ঠানের নাম */}
      <div className="w-full">
        <div className="space-y-4">
          <div className="flex items-end gap-2">
            <span className="font-bold text-gray-700 whitespace-nowrap">পূর্বে অধ্যয়নরত প্রতিষ্ঠানের নাম :</span>
            <input type="text" name="prevInstituteName" value={formData.prevInstituteName} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="flex items-end gap-2">
              <span className="font-bold text-gray-700 whitespace-nowrap">ঠিকানা :</span>
              <input type="text" name="prevInstituteAddress" value={formData.prevInstituteAddress} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none" />
            </div>
            <div className="flex items-end gap-2">
              <span className="font-bold text-gray-700 whitespace-nowrap">প্রিন্সিপালের মোবাইল :</span>
              <input type="text" name="prevPrincipalMobile" value={formData.prevPrincipalMobile} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none font-mono" />
            </div>
          </div>

          <div className="flex items-end gap-2">
            <span className="font-bold text-gray-700 whitespace-nowrap">পূর্ব প্রতিষ্ঠান ছাড়ার কারণ :</span>
            <input type="text" name="prevInstituteLeaveReason" value={formData.prevInstituteLeaveReason} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="flex items-end gap-2">
              <span className="font-bold text-gray-700 whitespace-nowrap">অধ্যয়নকৃত শ্রেণি :</span>
              <input type="text" name="prevClass" value={formData.prevClass} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none" />
            </div>
            <div className="flex items-end gap-2">
              <span className="font-bold text-gray-700 whitespace-nowrap">ছাড়পত্র নং :</span>
              <input type="text" name="prevTransferCertificateNo" value={formData.prevTransferCertificateNo} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-700 whitespace-nowrap">তারিখ :</span>
              <input type="date" name="prevTcDate" value={formData.prevTcDate} onChange={handleChange} className="border border-gray-400 rounded px-1.5 py-0.5 text-sm focus:outline-none cursor-pointer text-gray-700" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
