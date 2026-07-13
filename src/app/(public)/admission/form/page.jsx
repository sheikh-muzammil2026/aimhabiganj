// app/admission/form/page.js
"use client";

import React, { useState } from "react";
import Link from "next/link";
import AdmissionFormCover from "@/components/AdmissionFormCover";
import AdmissionFormPage1 from "@/components/AdmissionFormPage1";
import AdmissionFormPage2 from "@/components/AdmissionFormPage2";
import AdmissionFormPage3 from "@/components/AdmissionFormPage3";
import { toast } from "react-toastify";

export default function AdmissionFormPage() {
  const [formData, setFormData] = useState({
    formNo: "",
    sessionYear: "২০২৬-২০২৭",
    serialNo: "",
    status: "",
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e, section = null) => {
    const { name, value, type, checked } = e.target;
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [name]: type === "checkbox" ? checked : value }
      }));
      return;
    }

    if (name.includes(".")) {
      const [outerKey, innerKey] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [outerKey]: { ...prev[outerKey], [innerKey]: type === "checkbox" ? checked : value }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  const handleCheckboxChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // এক্সপ্রেস সার্ভারের এপিআই এন্ডপয়েন্ট (আপনার পোর্ট ৮০০০ হলে)
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

        // ফরম সফলভাবে সেভ হলে ডাটা রিসেট করার ঐচ্ছিক ব্যবস্থা করতে পারেন
        // window.location.href = "/admission/success"; 
      } else {
        toast.error("❌ দুঃখিত: " + data.message);
      }
    } catch (error) {
      console.error("সার্ভারে ডাটা পাঠাতে সমস্যা হয়েছে:", error);
      toast.error("❌ সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না। অনুগ্রহ করে আপনার ইন্টারনেট কানেকশন বা সার্ভার চেক করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-100 py-4 sm:py-10 px-2 sm:px-4 flex flex-col items-center justify-center font-sans antialiased print:bg-white print:py-0 print:px-0">

      {/* অ্যাকশন ও ব্যাক বাটন এরিয়া */}
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

// "use client";

// import { useState } from "react";

// export default function AdmissionPage() {
//   const [formData, setFormData] = useState({
//     id: "02420",
//     formNo: "F-2026-020",
//     sessionYear: "২০২৬-২০২৭",
//     serialNo: "SN-9920",
//     status: "Pending",
//     studentNameBangla: "আসিফ ইশতিয়াক",
//     studentNameEnglish: "Asif Ishtiaque",
//     studentNameArabic: "عاصф إشتياق",
//     dateOfBirth: "2014-12-05",
//     age: "11",
//     gender: "Male",
//     birthCertificateNo: "20142692517229000",
//     bloodGroup: "B-",
//     weight: "37 kg",
//     height: "4 ft 7 in",
//     nationality: "বাংলাদেশী",
//     currentAddress: { house: "৭/১", road: "আবাসিক এরিয়া", village: "চুনারুঘাট", postOffice: "চুনারুঘাট", thana: "চুনারুঘাট", district: "হবিগঞ্জ" },
//     permanentAddress: { house: "৭/১", road: "আবাসিক এরিয়া", village: "চুনারুঘাট", postOffice: "চুনারুঘাট", thana: "চুনারুঘাট", district: "হবিগঞ্জ" },
//     referenceName: "মুফতি আবু সাঈদ",
//     referenceMobile: "01711003399",
//     divisionPreHifz: { active: false, type: "", class: "" },
//     divisionHifz: { active: true, type: "Residential", class: "Hifz" },
//     divisionAcademic: { active: false, type: "", class: "" },
//     divisionArabicCourse: { active: false, type: "", class: "" },
//     prevInstituteName: "চুনারুঘাট আশরাফিয়া মাদ্রাসা",
//     prevInstituteAddress: "চুনারুঘাট, হবিগঞ্জ",
//     prevPrincipalMobile: "01811003399",
//     prevInstituteLeaveReason: "হিফজের মান বৃদ্ধির আগ্রহ",
//     prevClass: "Class 5",
//     prevTransferCertificateNo: "TC-CAM-20",
//     prevTcDate: "2026-06-22",
//     physicalProblem: "None",
//     physicalProblemDetails: "N/A",
//     cleanlinessLover: "Yes",
//     foodReluctance: "Sometimes",
//     favFoodType: "ডিম ও রুটি",
//     prayerAddicted: "Yes",
//     sleepTime: "09:30 PM",
//     wakeUpTime: "04:00 AM",
//     favThing: "গজল গাওয়া",
//     anxietyReason: "পড়া মনে না থাকা",
//     fatherNameBangla: "ইশতিয়াক আহমেদ",
//     fatherNameEnglish: "Ishtiaque Ahmed",
//     fatherNid: "19812692517009944",
//     fatherMobile: "01911003399",
//     fatherStatus: "Alive",
//     fatherProfession: "ব্যবসায়ী",
//     fatherEmail: "ishtiaque.biz@gmail.com",
//     motherNameBangla: "সেলিনা বেগম",
//     motherNameEnglish: "Selina Begum",
//     motherNid: "19862692517008855",
//     motherMobile: "01611003399",
//     motherStatus: "Alive",
//     motherProfession: "গৃহिणी",
//     motherEmail: "selina.home@gmail.com",
//     guardianNameAbsentParents: "",
//     guardianRelation: "",
//     guardianNid: "",
//     guardianProfession: "",
//     guardianEmail: "",
//     guardianMobile: "",
//     guardianAnnualIncome: "৩,২০,০০০",
//     guardianAnnualIncomeWords: "তিন লক্ষ বিশ হাজার টাকা মাত্র",
//     admissionReason: "সুন্দর পরিবেশে হিফজ সম্পন্ন করা",
//     applicantSignatureDate: "2026-07-11",
//     studentSignatureDate: "2026-07-11",
//     attachments: { attachStudentPhoto: true, attachParentsPhoto: true, attachBirthCertificate: true, attachParentsNid: true, attachReportCard: true },
//     officeUse: { studentIdOffice: "", examMark: "", meritPosition: "", officeRollNo: "", admittedClass: "", admittedSection: "", academicSession: "", admissionDate: "" }
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch("/api/admission", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });
//       if (response.ok) alert("আবেদনটি সফলভাবে জমা দেওয়া হয়েছে!");
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#f4f7f5] py-10 px-4 md:px-10 font-sans text-gray-800">
//       <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-2xl border-t-8 border-[#1e4620] overflow-hidden">

//         {/* Banner */}
//         <div className="bg-[#1e4620] text-center py-6 px-4 border-b-4 border-[#c9a054]">
//           <h1 className="text-xl md:text-2xl font-bold text-[#c9a054] tracking-wide mb-1">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</h1>
//           <h2 className="text-2xl md:text-3xl font-extrabold text-white">ভর্তি আবেদন ফরম (Admission Form)</h2>
//           <p className="text-gray-300 text-sm mt-1">শিক্ষাবর্ষ: {formData.sessionYear}</p>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">

//           {/* ১. সিস্টেম ও ফরম ইনফো */}
//           <div>
//             <h3 className="text-lg font-bold text-[#1e4620] border-l-4 border-[#c9a054] pl-2 mb-4">১. অফিসিয়াল রেকর্ড ও ফরম তথ্য</h3>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
//               <div><label className="block text-xs text-gray-500">ফরম নং</label><input type="text" className="w-full bg-white border border-gray-300 p-2 rounded text-sm font-bold" value={formData.formNo} readOnly /></div>
//               <div><label className="block text-xs text-gray-500">আইডি (ID)</label><input type="text" className="w-full bg-white border border-gray-300 p-2 rounded text-sm" value={formData.id} readOnly /></div>
//               <div><label className="block text-xs text-gray-500">সিরিয়াল নং</label><input type="text" className="w-full bg-white border border-gray-300 p-2 rounded text-sm" value={formData.serialNo} readOnly /></div>
//               <div><label className="block text-xs text-gray-500">অবস্থা (Status)</label><span className="inline-block mt-1 px-3 py-1 bg-yellow-600 text-white font-semibold rounded text-sm">{formData.status}</span></div>
//             </div>
//           </div>

//           {/* ২. শিক্ষার্থীর ব্যক্তিগত তথ্য */}
//           <div>
//             <h3 className="text-lg font-bold text-[#1e4620] border-l-4 border-[#c9a054] pl-2 mb-4">২. শিক্ষার্থীর ব্যক্তিগত বিবরণ</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div><label className="text-sm font-semibold">নাম (বাংলা)</label><input type="text" className="w-full border p-2 rounded" value={formData.studentNameBangla} onChange={(e) => setFormData({ ...formData, studentNameBangla: e.target.value })} /></div>
//               <div><label className="text-sm font-semibold">Name (English)</label><input type="text" className="w-full border p-2 rounded" value={formData.studentNameEnglish} onChange={(e) => setFormData({ ...formData, studentNameEnglish: e.target.value })} /></div>
//               <div><label className="text-sm font-semibold text-right block">الاسم (العربية)</label><input type="text" className="w-full border p-2 rounded text-right" value={formData.studentNameArabic} onChange={(e) => setFormData({ ...formData, studentNameArabic: e.target.value })} /></div>
//               <div><label className="text-sm font-semibold">জন্ম তারিখ</label><input type="date" className="w-full border p-2 rounded" value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} /></div>
//               <div><label className="text-sm font-semibold">বয়স</label><input type="text" className="w-full border p-2 rounded" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} /></div>
//               <div><label className="text-sm font-semibold">লিঙ্গ</label><input type="text" className="w-full border p-2 rounded" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} /></div>
//               <div><label className="text-sm font-semibold">জন্ম নিবন্ধন নম্বর</label><input type="text" className="w-full border p-2 rounded" value={formData.birthCertificateNo} onChange={(e) => setFormData({ ...formData, birthCertificateNo: e.target.value })} /></div>
//               <div><label className="text-sm font-semibold">রক্তের গ্রুপ</label><input type="text" className="w-full border p-2 rounded" value={formData.bloodGroup} onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })} /></div>
//               <div><label className="text-sm font-semibold">জাতীয়তা</label><input type="text" className="w-full border p-2 rounded" value={formData.nationality} onChange={(e) => setFormData({ ...formData, nationality: e.target.value })} /></div>
//               <div><label className="text-sm font-semibold">ওজন</label><input type="text" className="w-full border p-2 rounded" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} /></div>
//               <div><label className="text-sm font-semibold">উচ্চতা</label><input type="text" className="w-full border p-2 rounded" value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} /></div>
//             </div>
//           </div>

//           {/* ৩. যোগাযোগের ঠিকানা */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <h3 className="text-lg font-bold text-[#1e4620] border-l-4 border-[#c9a054] pl-2 mb-4">৩. বর্তমান ঠিকানা</h3>
//               <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
//                 {Object.keys(formData.currentAddress).map((key) => (
//                   <div key={key} className="flex justify-between items-center"><span className="text-sm capitalize">{key}:</span>
//                     <input type="text" className="border p-1 rounded w-2/3 bg-white" value={formData.currentAddress[key]} onChange={(e) => setFormData({ ...formData, currentAddress: { ...formData.currentAddress, [key]: e.target.value } })} /></div>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <h3 className="text-lg font-bold text-[#1e4620] border-l-4 border-[#c9a054] pl-2 mb-4">৪. স্থায়ী ঠিকানা</h3>
//               <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
//                 {Object.keys(formData.permanentAddress).map((key) => (
//                   <div key={key} className="flex justify-between items-center"><span className="text-sm capitalize">{key}:</span>
//                     <input type="text" className="border p-1 rounded w-2/3 bg-white" value={formData.permanentAddress[key]} onChange={(e) => setFormData({ ...formData, permanentAddress: { ...formData.permanentAddress, [key]: e.target.value } })} /></div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* ৪. পিতা, মাতা ও অভিভাবকের তথ্য */}
//           <div>
//             <h3 className="text-lg font-bold text-[#1e4620] border-l-4 border-[#c9a054] pl-2 mb-4">৫. পিতা ও মাতার বিবরণ</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="p-4 border rounded-lg bg-green-50/30 space-y-2">
//                 <h4 className="font-bold text-[#1e4620]">পিতার তথ্য</h4>
//                 <input type="text" className="w-full border p-2 bg-white rounded text-sm" placeholder="পিতার নাম (বাংলা)" value={formData.fatherNameBangla} onChange={(e) => setFormData({ ...formData, fatherNameBangla: e.target.value })} />
//                 <input type="text" className="w-full border p-2 bg-white rounded text-sm" placeholder="Father Name (English)" value={formData.fatherNameEnglish} onChange={(e) => setFormData({ ...formData, fatherNameEnglish: e.target.value })} />
//                 <input type="text" className="w-full border p-2 bg-white rounded text-sm" placeholder="NID" value={formData.fatherNid} onChange={(e) => setFormData({ ...formData, fatherNid: e.target.value })} />
//                 <input type="text" className="w-full border p-2 bg-white rounded text-sm" placeholder="মোবাইল" value={formData.fatherMobile} onChange={(e) => setFormData({ ...formData, fatherMobile: e.target.value })} />
//                 <input type="text" className="w-full border p-2 bg-white rounded text-sm" placeholder="অবস্থা (Alive/Dead)" value={formData.fatherStatus} onChange={(e) => setFormData({ ...formData, fatherStatus: e.target.value })} />
//                 <input type="text" className="w-full border p-2 bg-white rounded text-sm" placeholder="পেশা" value={formData.fatherProfession} onChange={(e) => setFormData({ ...formData, fatherProfession: e.target.value })} />
//                 <input type="email" className="w-full border p-2 bg-white rounded text-sm" placeholder="ইমেইল" value={formData.fatherEmail} onChange={(e) => setFormData({ ...formData, fatherEmail: e.target.value })} />
//               </div>
//               <div className="p-4 border rounded-lg bg-green-50/30 space-y-2">
//                 <h4 className="font-bold text-[#1e4620]">মাতার তথ্য</h4>
//                 <input type="text" className="w-full border p-2 bg-white rounded text-sm" placeholder="মাতার নাম (বাংলা)" value={formData.motherNameBangla} onChange={(e) => setFormData({ ...formData, motherNameBangla: e.target.value })} />
//                 <input type="text" className="w-full border p-2 bg-white rounded text-sm" placeholder="Mother Name (English)" value={formData.motherNameEnglish} onChange={(e) => setFormData({ ...formData, motherNameEnglish: e.target.value })} />
//                 <input type="text" className="w-full border p-2 bg-white rounded text-sm" placeholder="NID" value={formData.motherNid} onChange={(e) => setFormData({ ...formData, motherNid: e.target.value })} />
//                 <input type="text" className="w-full border p-2 bg-white rounded text-sm" placeholder="মোবাইল" value={formData.motherMobile} onChange={(e) => setFormData({ ...formData, motherMobile: e.target.value })} />
//                 <input type="text" className="w-full border p-2 bg-white rounded text-sm" placeholder="অবস্থা" value={formData.motherStatus} onChange={(e) => setFormData({ ...formData, motherStatus: e.target.value })} />
//                 <input type="text" className="w-full border p-2 bg-white rounded text-sm" placeholder="পেশা" value={formData.motherProfession} onChange={(e) => setFormData({ ...formData, motherProfession: e.target.value })} />
//                 <input type="email" className="w-full border p-2 bg-white rounded text-sm" placeholder="ইমেইল" value={formData.motherEmail} onChange={(e) => setFormData({ ...formData, motherEmail: e.target.value })} />
//               </div>
//             </div>

//             <h4 className="font-bold mt-4 mb-2 text-sm text-gray-700">অনুপস্থিত পিতা-মাতার পরিবর্তে অন্য অভিভাবকের তথ্য (যদি থাকে)</h4>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-gray-50 p-4 rounded">
//               <input type="text" className="border p-2 rounded text-sm bg-white" placeholder="অভিভাবকের নাম" value={formData.guardianNameAbsentParents} onChange={(e) => setFormData({ ...formData, guardianNameAbsentParents: e.target.value })} />
//               <input type="text" className="border p-2 rounded text-sm bg-white" placeholder="সম্পর্ক" value={formData.guardianRelation} onChange={(e) => setFormData({ ...formData, guardianRelation: e.target.value })} />
//               <input type="text" className="border p-2 rounded text-sm bg-white" placeholder="এনআইডি" value={formData.guardianNid} onChange={(e) => setFormData({ ...formData, guardianNid: e.target.value })} />
//               <input type="text" className="border p-2 rounded text-sm bg-white" placeholder="পেশা" value={formData.guardianProfession} onChange={(e) => setFormData({ ...formData, guardianProfession: e.target.value })} />
//               <input type="text" className="border p-2 rounded text-sm bg-white" placeholder="মোবাইল" value={formData.guardianMobile} onChange={(e) => setFormData({ ...formData, guardianMobile: e.target.value })} />
//               <input type="email" className="border p-2 rounded text-sm bg-white" placeholder="ইমেইল" value={formData.guardianEmail} onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })} />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
//               <div><label className="text-sm">অভিভাবকের বার্ষিক আয় (অংকে)</label><input type="text" className="w-full border p-2 rounded" value={formData.guardianAnnualIncome} onChange={(e) => setFormData({ ...formData, guardianAnnualIncome: e.target.value })} /></div>
//               <div><label className="text-sm">বার্ষিক আয় (কথায়)</label><input type="text" className="w-full border p-2 rounded" value={formData.guardianAnnualIncomeWords} onChange={(e) => setFormData({ ...formData, guardianAnnualIncomeWords: e.target.value })} /></div>
//             </div>
//           </div>

//           {/* ৫. কাঙ্খিত বিভাগের তথ্য */}
//           <div>
//             <h3 className="text-lg font-bold text-[#1e4620] border-l-4 border-[#c9a054] pl-2 mb-4">৬. কাঙ্খিত বিভাগের তথ্য</h3>
//             <div className="space-y-2">
//               {['divisionPreHifz', 'divisionHifz', 'divisionAcademic', 'divisionArabicCourse'].map((divKey) => (
//                 <div key={divKey} className="flex flex-wrap gap-4 items-center bg-gray-50 p-3 rounded border">
//                   <label className="font-semibold w-48 capitalize">{divKey.replace('division', '')}:</label>
//                   <label className="inline-flex items-center"><input type="checkbox" checked={formData[divKey].active} onChange={(e) => setFormData({ ...formData, [divKey]: { ...formData[divKey], active: e.target.checked } })} className="mr-2" /> একটিভ</label>
//                   <input type="text" placeholder="ধরণ (Type)" className="border p-1 rounded bg-white text-sm" value={formData[divKey].type} onChange={(e) => setFormData({ ...formData, [divKey]: { ...formData[divKey], type: e.target.value } })} />
//                   <input type="text" placeholder="ক্লাস (Class)" className="border p-1 rounded bg-white text-sm" value={formData[divKey].class} onChange={(e) => setFormData({ ...formData, [divKey]: { ...formData[divKey], class: e.target.value } })} />
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* ৬. পূর্ববর্তী প্রতিষ্ঠানের বিবরণ */}
//           <div>
//             <h3 className="text-lg font-bold text-[#1e4620] border-l-4 border-[#c9a054] pl-2 mb-4">৭. পূর্ববর্তী শিক্ষা প্রতিষ্ঠানের বিবরণ</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div><label className="text-sm">প্রতিষ্ঠানের নাম</label><input type="text" className="w-full border p-2 rounded" value={formData.prevInstituteName} onChange={(e) => setFormData({ ...formData, prevInstituteName: e.target.value })} /></div>
//               <div><label className="text-sm">ঠিকানা</label><input type="text" className="w-full border p-2 rounded" value={formData.prevInstituteAddress} onChange={(e) => setFormData({ ...formData, prevInstituteAddress: e.target.value })} /></div>
//               <div><label className="text-sm">প্রধান শিক্ষকের মোবাইল</label><input type="text" className="w-full border p-2 rounded" value={formData.prevPrincipalMobile} onChange={(e) => setFormData({ ...formData, prevPrincipalMobile: e.target.value })} /></div>
//               <div><label className="text-sm">প্রতিষ্ঠান ছাড়ার কারণ</label><input type="text" className="w-full border p-2 rounded" value={formData.prevInstituteLeaveReason} onChange={(e) => setFormData({ ...formData, prevInstituteLeaveReason: e.target.value })} /></div>
//               <div><label className="text-sm">পূর্ববর্তী ক্লাস</label><input type="text" className="w-full border p-2 rounded" value={formData.prevClass} onChange={(e) => setFormData({ ...formData, prevClass: e.target.value })} /></div>
//               <div><label className="text-sm">ছাড়পত্র নং (TC No)</label><input type="text" className="w-full border p-2 rounded" value={formData.prevTransferCertificateNo} onChange={(e) => setFormData({ ...formData, prevTransferCertificateNo: e.target.value })} /></div>
//               <div><label className="text-sm">টিসি প্রদানের তারিখ</label><input type="date" className="w-full border p-2 rounded" value={formData.prevTcDate} onChange={(e) => setFormData({ ...formData, prevTcDate: e.target.value })} /></div>
//             </div>
//           </div>

//           {/* ৭. স্বাস্থ্য, অভ্যাস ও অন্যান্য তথ্য */}
//           <div>
//             <h3 className="text-lg font-bold text-[#1e4620] border-l-4 border-[#c9a054] pl-2 mb-4">৮. স্বাস্থ্য, দ্বীনি অভ্যাস ও মনস্তাত্ত্বিক তথ্য</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div><label className="text-sm">শারীরিক সমস্যা</label><input type="text" className="w-full border p-2 rounded" value={formData.physicalProblem} onChange={(e) => setFormData({ ...formData, physicalProblem: e.target.value })} /></div>
//               <div><label className="text-sm">সমস্যার বিবরণ</label><input type="text" className="w-full border p-2 rounded" value={formData.physicalProblemDetails} onChange={(e) => setFormData({ ...formData, physicalProblemDetails: e.target.value })} /></div>
//               <div><label className="text-sm">পরিচ্ছন্নতা পছন্দকারী?</label><input type="text" className="w-full border p-2 rounded" value={formData.cleanlinessLover} onChange={(e) => setFormData({ ...formData, cleanlinessLover: e.target.value })} /></div>
//               <div><label className="text-sm">খাবারে অরুচি?</label><input type="text" className="w-full border p-2 rounded" value={formData.foodReluctance} onChange={(e) => setFormData({ ...formData, foodReluctance: e.target.value })} /></div>
//               <div><label className="text-sm">পছন্দের খাবার</label><input type="text" className="w-full border p-2 rounded" value={formData.favFoodType} onChange={(e) => setFormData({ ...formData, favFoodType: e.target.value })} /></div>
//               <div><label className="text-sm">নামাজে অনুরাগী ও নিয়মিত?</label><input type="text" className="w-full border p-2 rounded font-bold text-green-700" value={formData.prayerAddicted} onChange={(e) => setFormData({ ...formData, prayerAddicted: e.target.value })} /></div>
//               <div><label className="text-sm">ঘুমানোর সময়</label><input type="text" className="w-full border p-2 rounded" value={formData.sleepTime} onChange={(e) => setFormData({ ...formData, sleepTime: e.target.value })} /></div>
//               <div><label className="text-sm">ঘুম থেকে ওঠার সময়</label><input type="text" className="w-full border p-2 rounded" value={formData.wakeUpTime} onChange={(e) => setFormData({ ...formData, wakeUpTime: e.target.value })} /></div>
//               <div><label className="text-sm">পছন্দের বিষয়/শখ</label><input type="text" className="w-full border p-2 rounded" value={formData.favThing} onChange={(e) => setFormData({ ...formData, favThing: e.target.value })} /></div>
//               <div className="md:col-span-3"><label className="text-sm">উদ্বিগ্নতা/চিন্তার কারণ</label><input type="text" className="w-full border p-2 rounded" value={formData.anxietyReason} onChange={(e) => setFormData({ ...formData, anxietyReason: e.target.value })} /></div>
//               <div className="md:col-span-3"><label className="text-sm">ভর্তির উদ্দেশ্য (Admission Reason)</label><textarea className="w-full border p-2 rounded" rows="2" value={formData.admissionReason} onChange={(e) => setFormData({ ...formData, admissionReason: e.target.value })} /></div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-yellow-50/50 p-4 border border-yellow-200 rounded-lg">
//               <div><label className="text-sm font-semibold">সুপারিশকারী ব্যক্তির নাম (Reference)</label><input type="text" className="w-full border p-2 bg-white rounded" value={formData.referenceName} onChange={(e) => setFormData({ ...formData, referenceName: e.target.value })} /></div>
//               <div><label className="text-sm font-semibold">সুপারিশকারীর মোবাইল নম্বর</label><input type="text" className="w-full border p-2 bg-white rounded" value={formData.referenceMobile} onChange={(e) => setFormData({ ...formData, referenceMobile: e.target.value })} /></div>
//             </div>
//           </div>

//           {/* ৮. সংযুক্তিসমূহ */}
//           <div>
//             <h3 className="text-lg font-bold text-[#1e4620] border-l-4 border-[#c9a054] pl-2 mb-4">৯. প্রয়োজনীয় সংযুক্তিসমূহ (Attachments)</h3>
//             <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//               {Object.keys(formData.attachments).map((key) => (
//                 <label key={key} className="flex flex-col items-center border p-3 rounded bg-gray-50 cursor-pointer">
//                   <input type="checkbox" checked={formData.attachments[key]} onChange={(e) => setFormData({ ...formData, attachments: { ...formData.attachments, [key]: e.target.checked } })} className="mb-2 h-4 w-4 text-green-600" />
//                   <span className="text-xs text-center font-medium text-gray-700 capitalize">{key.replace('attach', '')}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* ৯. অফিসের ব্যবহারের জন্য */}
//           <div className="bg-amber-50/40 p-6 border-2 border-dashed border-[#c9a054] rounded-xl">
//             <h3 className="text-lg font-bold text-[#1e4620] mb-4 text-center">১০. অফিসের ব্যবহারের জন্য (For Office Use Only)</h3>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               {Object.keys(formData.officeUse).map((key) => (
//                 <div key={key}>
//                   <label className="text-xs capitalize text-gray-600">{key.replace(/([A-Z])/g, ' $1')}:</label>
//                   <input type="text" className="w-full border p-2 rounded bg-gray-100/50 text-sm" value={formData.officeUse[key]} onChange={(e) => setFormData({ ...formData, officeUse: { ...formData.officeUse, [key]: e.target.value } })} />
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* স্বাক্ষর ও তারিখ */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
//             <div><label className="text-sm">আবেদনকারীর স্বাক্ষরের তারিখ</label><input type="date" className="w-full border p-2 rounded" value={formData.applicantSignatureDate} onChange={(e) => setFormData({ ...formData, applicantSignatureDate: e.target.value })} /></div>
//             <div><label className="text-sm">শিক্ষার্থীর স্বাক্ষরের তারিখ</label><input type="date" className="w-full border p-2 rounded" value={formData.studentSignatureDate} onChange={(e) => setFormData({ ...formData, studentSignatureDate: e.target.value })} /></div>
//           </div>

//           {/* সাবমিট বাটন */}
//           <div className="text-center pt-4">
//             <button type="submit" className="bg-[#1e4620] hover:bg-[#153317] text-white font-bold py-3 px-10 rounded-lg shadow-lg transition duration-300 border-b-4 border-[#c9a054]">
//               আবেদনপত্র জমা দিন (Submit Form)
//             </button>
//           </div>

//         </form>
//       </div>
//     </div>
//   );
// }