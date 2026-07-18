"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import AdmissionFormPage1 from "@/components/public/admission/AdmissionFormPage1";
import AdmissionFormPage2 from "@/components/public/admission/AdmissionFormPage2";
import AdmissionFormPage3 from "@/components/public/admission/AdmissionFormPage3";
import OfficeUseSection from "@/components/dashboard/admission/OfficeUseSection";
import AdmissionFormCover from "@/components/dashboard/admission/AdmissionFormCover";

export default function AdmissionFormPage() {
  const [formData, setFormData] = useState({
    sessionYear: "২০২৬-২০২৭",
    status: "",
    // 1st page
    studentImage: "",
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
    divisionAcademy: { active: false, type: "", class: "" },
    // divisionArabicCourse: { active: false, type: "", class: "" },
   previousInstitutionName: "",          // ১. পূর্বে অধ্যয়নরত প্রতিষ্ঠানের নাম
  previousInstitutionAddress: "",       // ২. ঠিকানা
  previousInstitutionPrincipalMobile: "", // ৩. প্রিন্সিপালের মোবাইল
  reasonForLeaving: "",                 // ৪. পূর্ব প্রতিষ্ঠান ছাড়ার কারণ
  previousClass: "",                    // ৫. অধ্যয়নকৃত শ্রেণি
  transferCertificateNo: "",            // ৬. ছাড়পত্র নং
  leavingDate: "",        

    // 2nd page
    physicalProblem: "",
    physicalProblemDetails: "",
    cleanlinessLover: "",
    foodReluctance: "",
    favFoodType: "",
    prayerHabit: "",
    sleepTime: "",
    wakeUpTime: "",
    favThing: "",
    anxietyReason: "",

    guardianImage: "",
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

    primaryContactMethod: "",

    infoSource: "",
    teacherId: "",

    applicantSignatureDate: "",

    // 3rd page
    // studentSignatureDate: "",
    attachments: {

      citizenshipCertificate: "",
      birthCertificate: "",
      guardianNid: "",
      academicTranscript: "",

      boardRegCard: "",
      orphanCertificate: "",
    },

    // officeSection
    officeUse: {
      examMark: "",
      comment: "",
      recommendedClass: "",
      examinerId1: "",
      examinerId2: "",
      examinerId3: "",
      receiptNo: "",
      studentId: "",
      admissionDate: ""
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ইনপুট ফিল্ড থেকে নেস্টেড অবজেক্ট ও সাধারণ ফিল্ডের সঠিক ডাটা পাসিং নিশ্চিত করার হ্যান্ডলার
  const handleChange = (e, section = null) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: inputValue
        }
      }));
      return;
    }

    if (name.includes(".")) {
      const [outerKey, innerKey] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [outerKey]: {
          ...prev[outerKey],
          [innerKey]: inputValue
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: inputValue
      }));
    }
  };

  // চেকবক্স এবং ম্যানুয়াল স্টেট পরিবর্তনের জন্য ডেডিকেটেড হ্যান্ডলার
  const handleCheckboxChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/admissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message + " আলহামদুলিল্লাহ্‌!");
      } else {
        toast.error("❌ দুঃখিত: " + data.message);
      }
    } catch (error) {
      console.error("সার্ভারে ডাটা পাঠাতে সমস্যা হয়েছে:", error);
      toast.error("❌ সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না। অনুগ্রহ করে আপনার ইন্টারনেট কানেকশন বা সার্ভার চেক করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-4 sm:py-10 px-2 sm:px-4 flex flex-col items-center justify-center font-sans antialiased print:bg-white print:py-0 print:px-0">

      {/* অ্যাকশন ও ব্যাক বাটন এরিয়া */}
      <div className="w-full max-w-[8.27in] flex justify-between items-center mb-4 print:hidden px-2">
        <Link href="/admission" className="text-xs sm:text-sm font-bold text-emerald-800 hover:underline flex items-center gap-1">
          ⬅ নির্দেশিকাতে ফিরে যান
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-lg shadow-sm transition-all"
        >
          🖨️ প্রিন্ট / PDF সেভ করুন
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full md:w-[8.27in] max-w-full bg-white shadow-2xl rounded-sm print:shadow-none print:rounded-none flex flex-col gap-12 print:gap-0"
      >

        <AdmissionFormCover formData={formData} handleChange={handleChange} />
        <div className="hidden print:block page-break-after" style={{ pageBreakAfter: "always" }} />
        <AdmissionFormPage1 formData={formData} handleChange={handleChange} />
        <div className="hidden print:block page-break-after" style={{ pageBreakAfter: "always" }} />

        <AdmissionFormPage2 formData={formData} handleChange={handleChange} />
        <div className="hidden print:block page-break-after" style={{ pageBreakAfter: "always" }} />

        <AdmissionFormPage3
          formData={formData}
          handleChange={handleChange}
          handleCheckboxChange={handleCheckboxChange}
        />
        <div className="hidden print:block page-break-after" style={{ pageBreakAfter: "always" }} />
        <OfficeUseSection
          formData={formData}
          handleChange={handleChange}
          handleCheckboxChange={handleCheckboxChange}
        />

        {/* সাবমিট বাটন */}
        <div className="p-4 sm:p-8 bg-gray-50 border-t border-gray-200 text-right print:hidden rounded-b-sm w-full">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-3.5 rounded-lg shadow-md transition-all duration-150 active:scale-95 w-full sm:w-auto ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? "সংরক্ষণ হচ্ছে, অপেক্ষা করুন..." : "ভর্তি ফরমটি ডাটাবেজে সংরক্ষণ করুন"}
          </button>
        </div>
      </form>
    </div>
  );
}
