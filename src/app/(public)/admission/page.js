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
    gender: "", // पुरुष / महिला
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
    fatherStatus: "", // জীবিত / মৃত
    fatherProfession: "",
    fatherEmail: "",
    motherNameBangla: "",
    motherNameEnglish: "",
    motherNid: "",
    motherMobile: "",
    motherStatus: "", // জীবিত / মৃত
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
      
      // আপনার API Route-এ ডেটা পাঠানোর কোড এখানে হবে:
      // const response = await fetch('/api/admission', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      // if(response.ok) alert("ভর্তি ফরম সফলভাবে সাবমিট হয়েছে!");
      
    } catch (error) {
      console.error("ডেটা সাবমিট করার সময় ত্রুটি ঘটেছে:", error);
    }
  };

    return (
    <div className="min-h-screen bg-slate-100 py-4 sm:py-10 px-2 sm:px-4 flex flex-col items-center justify-center font-sans antialiased print:bg-white print:py-0 print:px-0">
      
      {/* মোবাইল এবং ছোট ডিভাইসের জন্য রেসপনসিভ স্ক্রোল কন্টেইনার */}
      <div className="w-full overflow-x-auto pb-6 print:overflow-visible print:pb-0 flex justify-center">
        
        {/* পুরো ৪ পৃষ্ঠার ফরমের মূল কন্টেইনার (যা ছোট স্ক্রিনে সর্বনিম্ন ৭৬৮ পিক্সেল উইডথ ধরে রাখবে যাতে লেআউট না ভাঙে) */}
        <form 
          onSubmit={handleSubmit} 
          className="w-full min-w-[768px] max-w-[8.27in] bg-white shadow-2xl rounded-sm print:shadow-none print:rounded-none flex flex-col gap-12 print:gap-0 print:min-w-full"
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
          <div className="p-8 bg-gray-50 border-t border-gray-200 text-right print:hidden rounded-b-sm min-w-full">
            <button 
              type="submit" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-3.5 rounded-lg shadow-md transition-all duration-150 active:scale-95 w-full sm:w-auto"
            >
              ভর্তি ফরমটি ডাটাবেজে সংরক্ষণ করুন
            </button>
          </div>

        </form>
      </div>
    </div>
  );

}
