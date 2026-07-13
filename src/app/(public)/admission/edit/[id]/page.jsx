"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';
import AdmissionFormCover from "@/components/dashboard/admission/AdmissionFormCover";
import AdmissionFormPage1 from "@/components/dashboard/admission/AdmissionFormPage1";
import AdmissionFormPage2 from "@/components/dashboard/admission/AdmissionFormPage2";
import AdmissionFormPage3 from "@/components/dashboard/admission/AdmissionFormPage3";

export default function EditAdmissionPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id; // URL থেকে id নেওয়া হচ্ছে

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false); // এখানে 'isSaving' রাখা হলো
    
    // ডাটাবেজের অবজেক্টের সাথে মিল রেখে স্টেট ইনিশিয়ালাইজেশন
    const [formData, setFormData] = useState({
        id: "",
        formNo: "",
        sessionYear: "",
        serialNo: "",
        status: "Pending",
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
        fatherStatus: "Alive",
        fatherProfession: "",
        fatherEmail: "",
        motherNameBangla: "",
        motherNameEnglish: "",
        motherNid: "",
        motherMobile: "",
        motherStatus: "Alive",
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

    // নির্দিষ্ট আইডির ডাটা লোড করা
    useEffect(() => {
        if (!id) return;
        
        const fetchStudentData = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/admissions/edit/${id}`);
                const result = await res.json();
                
                if (result.success && result.data) {
                    setFormData({
                        ...result.data,
                        currentAddress: result.data.currentAddress || { house: "", road: "", village: "", postOffice: "", thana: "", district: "" },
                        permanentAddress: result.data.permanentAddress || { house: "", road: "", village: "", postOffice: "", thana: "", district: "" },
                        divisionPreHifz: result.data.divisionPreHifz || { active: false, type: "", class: "" },
                        divisionHifz: result.data.divisionHifz || { active: false, type: "", class: "" },
                        divisionAcademic: result.data.divisionAcademic || { active: false, type: "", class: "" },
                        divisionArabicCourse: result.data.divisionArabicCourse || { active: false, type: "", class: "" },
                        attachments: result.data.attachments || { attachStudentPhoto: false, attachParentsPhoto: false, attachBirthCertificate: false, attachParentsNid: false, attachReportCard: false },
                        officeUse: result.data.officeUse || { studentIdOffice: "", examMark: "", meritPosition: "", officeRollNo: "", admittedClass: "", admittedSection: "", academicSession: "", admissionDate: "" }
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

    // সাধারণ ইনপুট চেঞ্জ হ্যান্ডলার
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // নেস্টেড অবজেক্ট (যেমন: currentAddress, officeUse) ইনপুট চেঞ্জ হ্যান্ডলার
    const handleNestedChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    // ৩ নম্বর পেজের এটাচমেন্ট চেকবক্স হ্যান্ডেল করার জন্য নতুন ফাংশন যোগ করা হলো
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            attachments: {
                ...prev.attachments,
                [name]: checked
            }
        }));
    };

    // তথ্য আপডেট করার সাবমিট হ্যান্ডলার (PUT API)
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/admissions/edit/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (data.success) {
                toast.success("🎉 শিক্ষার্থীর প্রোফাইল সফলভাবে আপডেট করা হয়েছে!");
                router.push('/dashboard/admin/admission?section=requests');
            } else {
                toast.error(data.message || "আপডেট করা সম্ভব হয়নি।");
            }
        } catch (error) {
            console.error("আপডেট করতে সমস্যা:", error);
            toast.error("সার্ভারে সমস্যা হওয়ার কারণে তথ্য আপডেট করা যায়নি।");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="text-center p-12 text-sm font-bold text-emerald-900">⏳ শিক্ষার্থীর তথ্য লোড হচ্ছে...</div>;
    }

    return (
       <div className="min-h-screen bg-slate-100 py-4 sm:py-10 px-2 sm:px-4 flex flex-col items-center justify-center font-sans antialiased print:bg-white print:py-0 print:px-0">

      {/* অ্যাকশন ও ব্যাক বাটন এরিয়া */}
      <div className="w-full max-w-[8.27in] flex justify-between items-center mb-4 print:hidden px-2">
        <Link href="/dashboard/admin/admission" className="text-xs sm:text-sm font-bold text-emerald-800 hover:underline flex items-center gap-1">
          ⬅ ফিরে যান
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
        {/* এখানে handleNestedChange পাঠানো হয়েছে যদি আপনার চাইল্ড উপাদানে নেস্টেড ডাটা হ্যান্ডেল করতে হয় */}
        <AdmissionFormCover formData={formData} handleChange={handleChange} handleNestedChange={handleNestedChange} />
        <div className="hidden print:block page-break-after" style={{ pageBreakAfter: "always" }} />

        <AdmissionFormPage1 formData={formData} handleChange={handleChange} handleNestedChange={handleNestedChange} />
        <div className="hidden print:block page-break-after" style={{ pageBreakAfter: "always" }} />

        <AdmissionFormPage2 formData={formData} handleChange={handleChange} handleNestedChange={handleNestedChange} />
        <div className="hidden print:block page-break-after" style={{ pageBreakAfter: "always" }} />

        <AdmissionFormPage3
          formData={formData}
          handleChange={handleChange}
          handleCheckboxChange={handleCheckboxChange} // এখন এই ফাংশনটি ঠিকভাবে কাজ করবে
        />

        {/* সাবমিট বাটন (isSubmitting পরিবর্তন করে isSaving করা হয়েছে) */}
        <div className="p-4 sm:p-8 bg-gray-50 border-t border-gray-200 text-right print:hidden rounded-b-sm w-full">
          <button
            type="submit"
            disabled={isSaving}
            className={`bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-3.5 rounded-lg shadow-md transition-all duration-150 active:scale-95 w-full sm:w-auto ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSaving ? "সংরক্ষণ হচ্ছে, অপেক্ষা করুন..." : "ভর্তি ফরমটি ডাটাবেজে সংরক্ষণ করুন"}
          </button>
        </div>
      </form>
    </div>
    );
}
