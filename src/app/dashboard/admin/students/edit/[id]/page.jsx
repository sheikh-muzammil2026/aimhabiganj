"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';
import AdmissionFormCover from "@/components/admission/AdmissionFormCover";
import AdmissionFormPage1 from "@/components/admission/AdmissionFormPage1";
import AdmissionFormPage2 from "@/components/admission/AdmissionFormPage2";
import AdmissionFormPage3 from "@/components/admission/AdmissionFormPage3";
import OfficeUseSection from '@/components/admission/OfficeUseSection';

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    sessionYear: "২০২৬-২০২৭",
    status: "",
    studentId: "",
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
    divisionAcademy: { active: false, type: "", class: "", academyType: "" },

    previousInstitutionName: "",
    previousInstitutionAddress: "",
    previousInstitutionPrincipalMobile: "",
    reasonForLeaving: "",
    previousClass: "",
    transferCertificateNo: "",
    leavingDate: "",

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
    teacherName: "",
    applicantSignatureDate: "",

    attachments: {
      citizenshipCertificate: false,
      birthCertificate: false,
      guardianNid: false,
      academicTranscript: false,
      boardRegCard: false,
      orphanCertificate: false,
    },

    officeUse: {
      markTilawat: "",
      markArabic: "",
      markEnglish: "",
      markMath: "",
      markOthers: "",
      totalMarks: 0,
      recommendedClass: "",
      rollNumber: "",
      monthlyFee: "",
      feeCategory: "",
      examinerId1: "",
      examinerId2: "",
      examinerId3: "",
      receiptNo: "",
    }
  });

  // স্টুডেন্ট ডাটা লোড করা
  useEffect(() => {
    if (!id) return;

    const fetchStudentData = async () => {
      try {
        setIsLoading(true);
        // নিশ্চিত করুন আপনার ব্যাকএন্ডের স্টুডেন্ট এডিটিং API রুটটি সঠিক আছে কিনা
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_API}/api/students/edit/${id}`
        );
        const result = await res.json();

        if (result.success && result.data) {
          const s = result.data;

          setFormData({
            ...s,
            dateOfBirth: s.dateOfBirth ? String(s.dateOfBirth).split("T")[0] : "",
            leavingDate: s.leavingDate ? String(s.leavingDate).split("T")[0] : "",
            applicantSignatureDate: s.applicantSignatureDate ? String(s.applicantSignatureDate).split("T")[0] : "",

            currentAddress: {
              house: "", road: "", village: "", postOffice: "", thana: "", district: "",
              ...(s.currentAddress || {}),
            },
            permanentAddress: {
              house: "", road: "", village: "", postOffice: "", thana: "", district: "",
              ...(s.permanentAddress || {}),
            },

            divisionPreHifz: {
              active: false, type: "", class: "",
              ...(s.divisionPreHifz || {}),
            },
            divisionHifz: {
              active: false, type: "", class: "",
              ...(s.divisionHifz || {}),
            },
            divisionAcademy: {
              active: false, type: "", class: "", academyType: "",
              ...(s.divisionAcademy || {}),
            },

            // empty string ("") আসলেও যেন boolean (true/false) হয়ে যায়
            attachments: {
              citizenshipCertificate: Boolean(s.attachments?.citizenshipCertificate),
              birthCertificate: Boolean(s.attachments?.birthCertificate),
              guardianNid: Boolean(s.attachments?.guardianNid),
              academicTranscript: Boolean(s.attachments?.academicTranscript),
              boardRegCard: Boolean(s.attachments?.boardRegCard),
              orphanCertificate: Boolean(s.attachments?.orphanCertificate),
            },

            officeUse: {
              markTilawat: "", markArabic: "", markEnglish: "", markMath: "", markOthers: "",
              totalMarks: 0, recommendedClass: "", rollNumber: "", monthlyFee: "", feeCategory: "",
              examinerId1: "", examinerId2: "", examinerId3: "", receiptNo: "",
              ...(s.officeUse || {}),
            },
          });
        } else {
          toast.error("শিক্ষার্থীর তথ্য পাওয়া যায়নি।");
        }
      } catch (error) {
        console.error("ডাটা লোড করতে সমস্যা:", error);
        toast.error("সার্ভার থেকে তথ্য আনতে ব্যর্থ হয়েছে।");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);

  // স্মার্ট ইনপুট চেঞ্জ হ্যান্ডলার
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent] || {}),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // এটাচমেন্ট চেকবক্স হ্যান্ডলার
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      attachments: {
        ...(prev.attachments || {}),
        [name]: checked,
      },
    }));
  };

  // তথ্য আপডেট করার সাবমিট হ্যান্ডলার (PUT API)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_API}/api/students/edit/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();

      if (data.success) {
        toast.success("🎉 শিক্ষার্থীর তথ্য সফলভাবে আপডেট করা হয়েছে!");
        router.push("/dashboard/admin/students");
      } else {
        toast.error(data.message || "আপডেট করা সম্ভব হয়নি।");
      }
    } catch (error) {
      console.error("আপডেট করতে সমস্যা:", error);
      toast.error("সার্ভারে সমস্যা হওয়ার কারণে তথ্য আপডেট করা যায়নি।");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center p-12 text-sm font-bold text-emerald-900">
        ⏳ শিক্ষার্থীর তথ্য লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-4 sm:py-10 px-2 sm:px-4 flex flex-col items-center justify-center font-sans antialiased print:bg-white print:py-0 print:px-0">
      <div className="w-full max-w-[8.27in] flex justify-between items-center mb-4 print:hidden px-2">
        <Link
          href="/dashboard/admin/students"
          className="text-xs sm:text-sm font-bold text-emerald-800 hover:underline flex items-center gap-1"
        >
          ⬅ তালিকায় ফিরে যান
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
        onSubmit={handleFormSubmit}
        className="w-full md:w-[8.27in] max-w-full bg-white shadow-2xl rounded-sm print:shadow-none print:rounded-none flex flex-col gap-12 print:gap-0"
      >
        <AdmissionFormCover
          formData={formData}
          handleChange={handleChange}
        />
        <div className="hidden print:block page-break-after" style={{ pageBreakAfter: "always" }} />

        <AdmissionFormPage1
          formData={formData}
          handleChange={handleChange}
        />
        <div className="hidden print:block page-break-after" style={{ pageBreakAfter: "always" }} />

        <AdmissionFormPage2
          formData={formData}
          handleChange={handleChange}
        />
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

        <div className="p-4 sm:p-8 bg-gray-50 border-t border-gray-200 text-right print:hidden rounded-b-sm w-full">
          <button
            type="submit"
            disabled={isSaving}
            className={`bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-3.5 rounded-lg shadow-md transition-all duration-150 active:scale-95 w-full sm:w-auto ${
              isSaving ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSaving ? "সংরক্ষণ হচ্ছে, অপেক্ষা করুন..." : "আপডেট সেভ করুন"}
          </button>
        </div>
      </form>
    </div>
  );
      }
