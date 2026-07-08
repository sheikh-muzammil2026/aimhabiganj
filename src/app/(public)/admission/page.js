// app/admission/page.js
"use client";

import React, { useState } from "react";
import AdmissionFormCover from "@/components/AdmissionFormCover";
import AdmissionFormPage1 from "@/components/AdmissionFormPage1";
import AdmissionFormPage2 from "@/components/AdmissionFormPage2";
import AdmissionFormPage3 from "@/components/AdmissionFormPage3";

export default function AdmissionPage() {
  // মঙ্গোডিবি-তে সেভ করার জন্য পুরো ৪ পৃষ্ঠার সব ইনপুট ফিল্ডের সেন্ট্রাল স্টেট
  const [formData, setFormData] = useState({
    // --- ১. কভার পেজের ফিল্ডস ---
    formNo: "",
    sessionYear: "২০২৬-২০২৭",

    // --- ২. মূল প্রথম পেজের ফিল্ডস (AdmissionFormPage1) ---
    serialNo: "",
    status: "", // নতুন / আবাসিক / অনাবাসিক / ডে-কেয়ার
    studentNameBangla: "",
    studentNameEnglish: "",
    studentNameArabic: "",
    dateOfBirth: "",
    age: "",
    gender: "", 
    birthCertificateNo: "",
    bloodGroup: "",
    weight: "",
    height: "",
    nationality: "বাংলাদেশী",
    currentAddress: { house: "", road: "", village: "", postOffice: "", thana: "", district: "" },
    permanentAddress: { house: "", road: "", village: "", postOffice: "", thana: "", district: "" },
    referenceName: "",
    referenceMobile: "",
    divisionPreHifz: { active: false, type: "", class: "" },
    divisionHifz: { active: false, type: "", class: "" },
    divisionAcademic: { active: false, type: "", class: "" },
    divisionArabicCourse: { active: false, type: "", class: "" },
    prevInstituteName: "",
    prevInstituteAddress: "",
    prevPrincipalMobile: "",
    prevInstituteLeaveReason: "",
    prevClass: "",
    prevTransferCertificateNo: "",
    prevTcDate: "",

    // --- ৩. মূল দ্বিতীয় পেজের ফিল্ডস (AdmissionFormPage2) ---
    physicalProblem: "",
    physicalProblemDetails: "",
    cleanlinessLover: "",
    foodReluctance: "",
    favFoodType: "",
    prayerAddicted: "",
    sleepTime: "",
    wakeUpTime: "",
    favThing: "",
    anxietyReason: "",
    fatherNameBangla: "",
    fatherNameEnglish: "",
    fatherNid: "",
    fatherMobile: "",
    fatherStatus: "", 
    fatherProfession: "",
    fatherEmail: "",
    motherNameBangla: "",
    motherNameEnglish: "",
    motherNid: "",
    motherMobile: "",
    motherStatus: "", 
    motherProfession: "",
    motherEmail: "",
    guardianNameAbsentParents: "",
    guardianRelation: "",
    guardianNid: "",
    guardianProfession: "",
    guardianEmail: "",
    guardianMobile: "",
    guardianAnnualIncome: "",
    guardianAnnualIncomeWords: "",
    admissionReason: "",

    // --- ৪. ৩য় পেজের ফিল্ডস (AdmissionFormPage3) ---
    applicantSignatureDate: "",
    studentSignatureDate: "",
    attachments: { 
      attachStudentPhoto: false, 
      attachParentsPhoto: false, 
      attachBirthCertificate: false, 
      attachParentsNid: false, 
      attachReportCard: false 
    },
    officeUse: {
      studentIdOffice: "",
      examMark: "",
      meritPosition: "",
      officeRollNo: "",
      admittedClass: "",
      admittedSection: "",
      academicSession: "",
      admissionDate: ""
    }
  });

  // ইনপুট ফিল্ডের ডেটা পরিবর্তনের সাথে সাথে স্টেট আপডেট করার হ্যান্ডলার
  const handleChange = (e, section = null) => {
    const { name, value, type, checked } = e.target;
    
    // যদি বিশেষ কোনো নেস্টেড অবজেক্ট (যেমন: officeUse) পাস করা হয়
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: type === "checkbox" ? checked : value
        }
      }));
      return;
    }

    // ডট নোটিশনের নেস্টেড অবজেক্ট (যেমন: currentAddress.house) হ্যান্ডেল করার জন্য
    if (name.includes(".")) {
      const [outerKey, innerKey] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [outerKey]: {
          ...prev[outerKey],
          [innerKey]: type === "checkbox" ? checked : value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  // ৩ নম্বর পেজের সংযুক্তিসমূহ (Attachments) চেকবক্স হ্যান্ডেল করার বিশেষ ফাংশন
  const handleCheckboxChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // মঙ্গোডিবি-তে ডেটা সাবমিট করার ফাইনাল হ্যান্ডলার
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("মঙ্গোডিবি-তে সেভ হওয়ার জন্য প্রস্তুত ডেটা:", formData);
      alert("কনসোলে ডেটা চেক করুন! ডাটাবেজ এপিআই যুক্ত থাকলে সফলভাবে সেভ হয়ে যেত।");
    } catch (error) {
      console.error("ডেটা সাবমিট করার সময় ত্রুটি ঘটেছে:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-4 sm:py-10 px-2 sm:px-4 flex flex-col items-center justify-center font-sans antialiased print:bg-white print:py-0 print:px-0">
      
      {/* অ্যাকশন বাটন এরিয়া (প্রিন্ট করার জন্য) - মোবাইলে বা ডেক্সটপে কাজের সুবিধা বাড়াবে */}
      <div className="w-full max-w-[8.27in] flex justify-end gap-3 mb-4 print:hidden px-2">
        <button
          type="button"
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-2 rounded-lg shadow-sm transition-all duration-150 active:scale-95 flex items-center gap-2"
        >
          🖨️ প্রিন্ট / PDF সেভ করুন
        </button>
      </div>

      {/* মূল ফর্ম কন্টেইনার (মোবাইলে ফুল-উইডথ এবং ডেক্সটপে স্ট্যান্ডার্ড A4 রেশিও বজায় রাখবে) */}
      <form 
        onSubmit={handleSubmit} 
        className="w-full md:w-[8.27in] max-w-full bg-white shadow-2xl rounded-sm print:shadow-none print:rounded-none flex flex-col gap-12 print:gap-0"
      >
        
        {/* পৃষ্ঠা ১: কভার পেজ কম্পোনেন্ট */}
        <AdmissionFormCover formData={formData} handleChange={handleChange} />
        <div className="hidden print:block page-break-after" style={{ pageBreakAfter: "always" }} />

        {/* পৃষ্ঠা ২: ভর্তি ফরমের মূল প্রথম পেজ */}
        <AdmissionFormPage1 formData={formData} handleChange={handleChange} /> 
        <div className="hidden print:block page-break-after" style={{ pageBreakAfter: "always" }} />

        {/* পৃষ্ঠা ৩: ভর্তি ফরমের মূল দ্বিতীয় পেজ */}
        <AdmissionFormPage2 formData={formData} handleChange={handleChange} /> 
        <div className="hidden print:block page-break-after" style={{ pageBreakAfter: "always" }} /> 

        {/* পৃষ্ঠা ৪: একদম শেষ পৃষ্ঠা / ব্যাক কভার পেজ */}
        <AdmissionFormPage3 
          formData={formData} 
          handleChange={handleChange} 
          handleCheckboxChange={handleCheckboxChange} 
        />

        {/* সাবমিট বাটন */}
        <div className="p-4 sm:p-8 bg-gray-50 border-t border-gray-200 text-right print:hidden rounded-b-sm w-full">
          <button 
            type="submit" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-3.5 rounded-lg shadow-md transition-all duration-150 active:scale-95 w-full sm:w-auto"
          >
            ভর্তি ফরমটি ডাটাবেজে সংরক্ষণ করুন
          </button>
        </div>

      </form>
    </div>
  );
}
