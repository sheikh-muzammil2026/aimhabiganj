"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function EditAdmissionPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id; // URL থেকে id নেওয়া হচ্ছে

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
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
                    // যদি কোনো নেস্টেড অবজেক্ট ডাটাবেজে না থাকে, তবে ক্র্যাশ এড়াতে ফলব্যাক দেওয়া হয়েছে
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
                toast.success("🎉 শিক্ষার্থীর প্রোফাইল সফলভাবে আপডেট করা হয়েছে!");
                router.push('/dashboard/admin/admission?section=requests'); // সফল হলে মেইন ড্যাশবোর্ডে ব্যাক করবে
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
        return <div className="text-center p-12 text-sm font-bold text-emerald-900">⏳ শিক্ষার্থীর তথ্য লোড হচ্ছে...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
            {/* হেডার সেকশন */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-emerald-900">আবেদনপত্র সম্পাদনা (Edit Admission Form)</h1>
                    <p className="text-xs text-gray-500 mt-1">শিক্ষার্থী: <span className="text-emerald-800 font-bold">{formData.studentNameBangla}</span> ({formData.id})</p>
                </div>
                <Link href="/dashboard/admin/admission?section=requests" className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-4 py-2.5 rounded-xl text-center shadow-xs">
                    ⬅️ তালিকায় ফিরে যান
                </Link>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6 font-medium text-gray-700">
                
                {/* সেকশন ১: সিস্টেম ও অফিশিয়াল ইনফো */}
                <div className="bg-white border border-emerald-900/10 p-5 rounded-2xl shadow-xs space-y-4">
                    <h3 className="text-sm font-black text-emerald-900 bg-emerald-50 p-2 rounded-lg">📌 সিস্টেম ও আবেদন তথ্য</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">শিক্ষার্থী আইডি (Short ID)</label>
                            <input type="text" name="id" value={formData.id} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs font-bold bg-gray-50" readOnly />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">ফরম নম্বর</label>
                            <input type="text" name="formNo" value={formData.formNo} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">সেশন শিক্ষাবর্ষ</label>
                            <input type="text" name="sessionYear" value={formData.sessionYear} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">সিরিয়াল নম্বর</label>
                            <input type="text" name="serialNo" value={formData.serialNo} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-xs text-gray-500 mb-1">আবেদনের অবস্থা (Status)</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs font-bold bg-amber-50 text-amber-900">
                                <option value="Pending">Pending (অপেক্ষমাণ)</option>
                                <option value="Approved">Approved (অনুমোদিত)</option>
                                <option value="Rejected">Rejected (বাতিল)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* সেকশন ২: শিক্ষার্থীর ব্যক্তিগত তথ্য */}
                <div className="bg-white border border-emerald-900/10 p-5 rounded-2xl shadow-xs space-y-4">
                    <h3 className="text-sm font-black text-emerald-900 bg-emerald-50 p-2 rounded-lg">👦 শিক্ষার্থীর ব্যক্তিগত তথ্য</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">শিক্ষার্থীর নাম (বাংলা)</label>
                            <input type="text" name="studentNameBangla" value={formData.studentNameBangla} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs font-bold" required />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">শিক্ষার্থীর নাম (ইংরেজি)</label>
                            <input type="text" name="studentNameEnglish" value={formData.studentNameEnglish} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs font-bold" required />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">শিক্ষার্থীর নাম (আরবি)</label>
                            <input type="text" name="studentNameArabic" value={formData.studentNameArabic} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">জন্ম তারিখ</label>
                            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">বয়স</label>
                            <input type="text" name="age" value={formData.age} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">লিঙ্গ (Gender)</label>
                            <input type="text" name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">জন্ম নিবন্ধন নম্বর</label>
                            <input type="text" name="birthCertificateNo" value={formData.birthCertificateNo} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">রক্তের গ্রুপ</label>
                            <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">জাতীয়তা</label>
                            <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">ওজন</label>
                            <input type="text" name="weight" value={formData.weight} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">উচ্চতা</label>
                            <input type="text" name="height" value={formData.height} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                    </div>
                </div>

                {/* সেকশন ৩: আবেদনকৃত মাদ্রাসা বিভাগসমূহ */}
                <div className="bg-white border border-emerald-900/10 p-5 rounded-2xl shadow-xs space-y-4">
                    <h3 className="text-sm font-black text-emerald-900 bg-emerald-50 p-2 rounded-lg">🏫 আবেদনকৃত মাদ্রাসা বিভাগ</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        {/* Pre-Hifz */}
                        <div className="p-3 border border-gray-100 rounded-xl bg-gray-50/50">
                            <label className="flex items-center gap-2 font-bold text-xs text-gray-700 mb-2">
                                <input type="checkbox" checked={formData.divisionPreHifz.active} onChange={(e) => handleNestedChange('divisionPreHifz', 'active', e.target.checked)} />
                                Pre-Hifz বিভাগ
                            </label>
                            <input type="text" placeholder="টাইপ (যেমন: Residential)" value={formData.divisionPreHifz.type} onChange={(e) => handleNestedChange('divisionPreHifz', 'type', e.target.value)} className="w-full p-1.5 border border-gray-200 rounded text-xs mb-1" />
                            <input type="text" placeholder="ক্লাস" value={formData.divisionPreHifz.class} onChange={(e) => handleNestedChange('divisionPreHifz', 'class', e.target.value)} className="w-full p-1.5 border border-gray-200 rounded text-xs" />
                        </div>

                        {/* Hifz */}
                        <div className="p-3 border border-gray-100 rounded-xl bg-gray-50/50">
                            <label className="flex items-center gap-2 font-bold text-xs text-gray-700 mb-2">
                                <input type="checkbox" checked={formData.divisionHifz.active} onChange={(e) => handleNestedChange('divisionHifz', 'active', e.target.checked)} />
                                Hifz বিভাগ
                            </label>
                            <input type="text" placeholder="টাইপ" value={formData.divisionHifz.type} onChange={(e) => handleNestedChange('divisionHifz', 'type', e.target.value)} className="w-full p-1.5 border border-gray-200 rounded text-xs mb-1" />
                            <input type="text" placeholder="ক্লাস" value={formData.divisionHifz.class} onChange={(e) => handleNestedChange('divisionHifz', 'class', e.target.value)} className="w-full p-1.5 border border-gray-200 rounded text-xs" />
                        </div>

                        {/* Academic */}
                        <div className="p-3 border border-gray-100 rounded-xl bg-gray-50/50">
                            <label className="flex items-center gap-2 font-bold text-xs text-gray-700 mb-2">
                                <input type="checkbox" checked={formData.divisionAcademic.active} onChange={(e) => handleNestedChange('divisionAcademic', 'active', e.target.checked)} />
                                Academic বিভাগ
                            </label>
                            <input type="text" placeholder="টাইপ" value={formData.divisionAcademic.type} onChange={(e) => handleNestedChange('divisionAcademic', 'type', e.target.value)} className="w-full p-1.5 border border-gray-200 rounded text-xs mb-1" />
                            <input type="text" placeholder="ক্লাস" value={formData.divisionAcademic.class} onChange={(e) => handleNestedChange('divisionAcademic', 'class', e.target.value)} className="w-full p-1.5 border border-gray-200 rounded text-xs" />
                        </div>

                        {/* Arabic Course */}
                        <div className="p-3 border border-gray-100 rounded-xl bg-gray-50/50">
                            <label className="flex items-center gap-2 font-bold text-xs text-gray-700 mb-2">
                                <input type="checkbox" checked={formData.divisionArabicCourse.active} onChange={(e) => handleNestedChange('divisionArabicCourse', 'active', e.target.checked)} />
                                Arabic Course
                            </label>
                            <input type="text" placeholder="টাইপ" value={formData.divisionArabicCourse.type} onChange={(e) => handleNestedChange('divisionArabicCourse', 'type', e.target.value)} className="w-full p-1.5 border border-gray-200 rounded text-xs mb-1" />
                            <input type="text" placeholder="ক্লাস" value={formData.divisionArabicCourse.class} onChange={(e) => handleNestedChange('divisionArabicCourse', 'class', e.target.value)} className="w-full p-1.5 border border-gray-200 rounded text-xs" />
                        </div>
                    </div>
                </div>

                {/* সেকশন ৪: পিতা ও মাতার তথ্য */}
                <div className="bg-white border border-emerald-900/10 p-5 rounded-2xl shadow-xs space-y-6">
                    <h3 className="text-sm font-black text-emerald-900 bg-emerald-50 p-2 rounded-lg">👪 পিতা ও মাতার বিবরণ</h3>
                    
                    {/* পিতার তথ্য */}
                    <div className="space-y-3">
                        <p className="text-xs font-bold text-emerald-800 border-b pb-1">👨 পিতার তথ্য:</p>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">পিতার নাম (বাংলা)</label>
                                <input type="text" name="fatherNameBangla" value={formData.fatherNameBangla} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">পিতার নাম (ইংরেজি)</label>
                                <input type="text" name="fatherNameEnglish" value={formData.fatherNameEnglish} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">পিতার এনআইডি (NID)</label>
                                <input type="text" name="fatherNid" value={formData.fatherNid} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">পিতার মোবাইল নম্বর</label>
                                <input type="text" name="fatherMobile" value={formData.fatherMobile} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">পেশা</label>
                                <input type="text" name="fatherProfession" value={formData.fatherProfession} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">ইমেইল</label>
                                <input type="email" name="fatherEmail" value={formData.fatherEmail} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">অবস্থা (Alive/Deceased)</label>
                                <input type="text" name="fatherStatus" value={formData.fatherStatus} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                            </div>
                        </div>
                    </div>

                    {/* মাতার তথ্য */}
                    <div className="space-y-3 pt-2">
                        <p className="text-xs font-bold text-emerald-800 border-b pb-1">👩 মাতার তথ্য:</p>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">মাতার নাম (বাংলা)</label>
                                <input type="text" name="motherNameBangla" value={formData.motherNameBangla} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">মাতার নাম (ইংরেজি)</label>
                                <input type="text" name="motherNameEnglish" value={formData.motherNameEnglish} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">মাতার এনআইডি (NID)</label>
                                <input type="text" name="motherNid" value={formData.motherNid} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">মাতার মোবাইল নম্বর</label>
                                <input type="text" name="motherMobile" value={formData.motherMobile} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">পেশা</label>
                                <input type="text" name="motherProfession" value={formData.motherProfession} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">ইমেইল</label>
                                <input type="email" name="motherEmail" value={formData.motherEmail} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">অবস্থা</label>
                                <input type="text" name="motherStatus" value={formData.motherStatus} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* সেকশন ৫: অভিভাবক ও আয়ের বিবরণ */}
                <div className="bg-white border border-emerald-900/10 p-5 rounded-2xl shadow-xs space-y-4">
                    <h3 className="text-sm font-black text-emerald-900 bg-emerald-50 p-2 rounded-lg">💼 বিকল্প অভিভাবক ও বার্ষিক আয়</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">অভিভাবকের নাম (পিতা-মাতার অনুপস্থিতিতে)</label>
                            <input type="text" name="guardianNameAbsentParents" value={formData.guardianNameAbsentParents} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">সম্পর্ক</label>
                            <input type="text" name="guardianRelation" value={formData.guardianRelation} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">অভিভাবকের মোবাইল</label>
                            <input type="text" name="guardianMobile" value={formData.guardianMobile} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">বার্ষিক আয় (সংখ্যায়)</label>
                            <input type="text" name="guardianAnnualIncome" value={formData.guardianAnnualIncome} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs text-gray-500 mb-1">বার্ষিক আয় (কথায়)</label>
                            <input type="text" name="guardianAnnualIncomeWords" value={formData.guardianAnnualIncomeWords} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs text-gray-500 mb-1">ভর্তির কারণ</label>
                            <input type="text" name="admissionReason" value={formData.admissionReason} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                    </div>
                </div>

                {/* সেকশন ৬: বর্তমান ও স্থায়ী ঠিকানা */}
                <div className="bg-white border border-emerald-900/10 p-5 rounded-2xl shadow-xs space-y-6">
                    <h3 className="text-sm font-black text-emerald-900 bg-emerald-50 p-2 rounded-lg">📍 ঠিকানার বিবরণ</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* বর্তমান ঠিকানা */}
                        <div className="space-y-3 bg-gray-50/50 p-4 border border-gray-100 rounded-xl">
                            <p className="text-xs font-bold text-gray-700 border-b pb-1">🏠 বর্তমান ঠিকানা:</p>
                            <div className="grid grid-cols-2 gap-2">
                                <input type="text" placeholder="বাসা/হোল্ডিং" value={formData.currentAddress.house} onChange={(e) => handleNestedChange('currentAddress', 'house', e.target.value)} className="p-2 border border-gray-200 rounded-lg text-xs" />
                                <input type="text" placeholder="রাস্তা/পাড়া" value={formData.currentAddress.road} onChange={(e) => handleNestedChange('currentAddress', 'road', e.target.value)} className="p-2 border border-gray-200 rounded-lg text-xs" />
                                <input type="text" placeholder="গ্রাম" value={formData.currentAddress.village} onChange={(e) => handleNestedChange('currentAddress', 'village', e.target.value)} className="p-2 border border-gray-200 rounded-lg text-xs" />
                                <input type="text" placeholder="পোস্ট অফিস" value={formData.currentAddress.postOffice} onChange={(e) => handleNestedChange('currentAddress', 'postOffice', e.target.value)} className="p-2 border border-gray-200 rounded-lg text-xs" />
                                <input type="text" placeholder="থানা" value={formData.currentAddress.thana} onChange={(e) => handleNestedChange('currentAddress', 'thana', e.target.value)} className="p-2 border border-gray-200 rounded-lg text-xs" />
                                <input type="text" placeholder="জেলা" value={formData.currentAddress.district} onChange={(e) => handleNestedChange('currentAddress', 'district', e.target.value)} className="p-2 border border-gray-200 rounded-lg text-xs" />
                            </div>
                        </div>

                        {/* স্থায়ী ঠিকানা */}
                        <div className="space-y-3 bg-gray-50/50 p-4 border border-gray-100 rounded-xl">
                            <p className="text-xs font-bold text-gray-700 border-b pb-1">🏢 স্থায়ী ঠিকানা:</p>
                            <div className="grid grid-cols-2 gap-2">
                                <input type="text" placeholder="বাসা/হোল্ডিং" value={formData.permanentAddress.house} onChange={(e) => handleNestedChange('permanentAddress', 'house', e.target.value)} className="p-2 border border-gray-200 rounded-lg text-xs" />
                                <input type="text" placeholder="রাস্তা/পাড়া" value={formData.permanentAddress.road} onChange={(e) => handleNestedChange('permanentAddress', 'road', e.target.value)} className="p-2 border border-gray-200 rounded-lg text-xs" />
                                <input type="text" placeholder="গ্রাম" value={formData.permanentAddress.village} onChange={(e) => handleNestedChange('permanentAddress', 'village', e.target.value)} className="p-2 border border-gray-200 rounded-lg text-xs" />
                                <input type="text" placeholder="পোস্ট অফিস" value={formData.permanentAddress.postOffice} onChange={(e) => handleNestedChange('permanentAddress', 'postOffice', e.target.value)} className="p-2 border border-gray-200 rounded-lg text-xs" />
                                <input type="text" placeholder="থানা" value={formData.permanentAddress.thana} onChange={(e) => handleNestedChange('permanentAddress', 'thana', e.target.value)} className="p-2 border border-gray-200 rounded-lg text-xs" />
                                <input type="text" placeholder="জেলা" value={formData.permanentAddress.district} onChange={(e) => handleNestedChange('permanentAddress', 'district', e.target.value)} className="p-2 border border-gray-200 rounded-lg text-xs" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* সেকশন ৭: পূর্ববর্তী প্রতিষ্ঠানের তথ্য */}
                <div className="bg-white border border-emerald-900/10 p-5 rounded-2xl shadow-xs space-y-4">
                    <h3 className="text-sm font-black text-emerald-900 bg-emerald-50 p-2 rounded-lg">📜 পূর্ববর্তী মাদ্রাসার/স্কুলের বিবরণ</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">প্রতিষ্ঠানের নাম</label>
                            <input type="text" name="prevInstituteName" value={formData.prevInstituteName} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">প্রতিষ্ঠানের ঠিকানা</label>
                            <input type="text" name="prevInstituteAddress" value={formData.prevInstituteAddress} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">প্রধানের মোবাইল</label>
                            <input type="text" name="prevPrincipalMobile" value={formData.prevPrincipalMobile} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">পূর্বের ক্লাস (Class)</label>
                            <input type="text" name="prevClass" value={formData.prevClass} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">টিসি (TC) নম্বর</label>
                            <input type="text" name="prevTransferCertificateNo" value={formData.prevTransferCertificateNo} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">টিসি প্রদানের তারিখ</label>
                            <input type="date" name="prevTcDate" value={formData.prevTcDate} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-xs text-gray-500 mb-1">মাদ্রাসা পরিবর্তনের কারণ</label>
                            <input type="text" name="prevInstituteLeaveReason" value={formData.prevInstituteLeaveReason} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                    </div>
                </div>

                {/* সেকশন ৮: রেফারেন্স, আচরণ ও অভ্যাসগত তথ্য */}
                <div className="bg-white border border-emerald-900/10 p-5 rounded-2xl shadow-xs space-y-4">
                    <h3 className="text-sm font-black text-emerald-900 bg-emerald-50 p-2 rounded-lg">📋 অভ্যাস, আচরণ ও রেফারেন্স</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">রেফারেন্স ব্যক্তির নাম</label>
                            <input type="text" name="referenceName" value={formData.referenceName} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">রেফারেন্স মোবাইল</label>
                            <input type="text" name="referenceMobile" value={formData.referenceMobile} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">শারীরিক সমস্যা</label>
                            <input type="text" name="physicalProblem" value={formData.physicalProblem} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">পরিচ্ছন্নতা পছন্দ করে কিনা</label>
                            <input type="text" name="cleanlinessLover" value={formData.cleanlinessLover} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">খাবারে অনিহা আছে কিনা</label>
                            <input type="text" name="foodReluctance" value={formData.foodReluctance} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">প্রিয় খাবার</label>
                            <input type="text" name="favFoodType" value={formData.favFoodType} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">নামাজে নিয়মিত কিনা</label>
                            <input type="text" name="prayerAddicted" value={formData.prayerAddicted} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">ঘুমানোর সময়</label>
                            <input type="text" name="sleepTime" value={formData.sleepTime} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">ঘুম থেকে ওঠার সময়</label>
                            <input type="text" name="wakeUpTime" value={formData.wakeUpTime} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">প্রিয় কাজ/শখ</label>
                            <input type="text" name="favThing" value={formData.favThing} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs text-gray-500 mb-1">চিন্তা/উদ্বেগের কারণ</label>
                            <input type="text" name="anxietyReason" value={formData.anxietyReason} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs" />
                        </div>
                    </div>
                </div>

                {/* সেকশন ৯: শুধুমাত্র অফিসের ব্যবহারের জন্য (Office Use Only) */}
                <div className="bg-amber-50/40 border border-amber-900/10 p-5 rounded-2xl shadow-xs space-y-4">
                    <h3 className="text-sm font-black text-amber-900 bg-amber-50 p-2 rounded-lg">🔒 শুধুমাত্র অফিসের ব্যবহারের জন্য (Office Use)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs text-amber-900 font-bold mb-1">অফিস কর্তৃক স্টুডেন্ট আইডি</label>
                            <input type="text" value={formData.officeUse.studentIdOffice} onChange={(e) => handleNestedChange('officeUse', 'studentIdOffice', e.target.value)} className="w-full p-2.5 border border-amber-200 bg-white rounded-xl text-xs font-bold focus:outline-amber-500" />
                        </div>
                        <div>
                            <label className="block text-xs text-amber-900 font-bold mb-1">পরীক্ষার প্রাপ্ত নম্বর (Exam Mark)</label>
                            <input type="text" value={formData.officeUse.examMark} onChange={(e) => handleNestedChange('officeUse', 'examMark', e.target.value)} className="w-full p-2.5 border border-amber-200 bg-white rounded-xl text-xs focus:outline-amber-500" />
                        </div>
                        <div>
                            <label className="block text-xs text-amber-900 font-bold mb-1">মেধা তালিকা (Merit Position)</label>
                            <input type="text" value={formData.officeUse.meritPosition} onChange={(e) => handleNestedChange('officeUse', 'meritPosition', e.target.value)} className="w-full p-2.5 border border-amber-200 bg-white rounded-xl text-xs focus:outline-amber-500" />
                        </div>
                        <div>
                            <label className="block text-xs text-amber-900 font-bold mb-1">অফিস রোল নম্বর</label>
                            <input type="text" value={formData.officeUse.officeRollNo} onChange={(e) => handleNestedChange('officeUse', 'officeRollNo', e.target.value)} className="w-full p-2.5 border border-amber-200 bg-white rounded-xl text-xs focus:outline-amber-500" />
                        </div>
                        <div>
                            <label className="block text-xs text-amber-900 font-bold mb-1">ভর্তিকৃত ক্লাস</label>
                            <input type="text" value={formData.officeUse.admittedClass} onChange={(e) => handleNestedChange('officeUse', 'admittedClass', e.target.value)} className="w-full p-2.5 border border-amber-200 bg-white rounded-xl text-xs focus:outline-amber-500" />
                        </div>
                        <div>
                            <label className="block text-xs text-amber-900 font-bold mb-1">ভর্তিকৃত সেকশন</label>
                            <input type="text" value={formData.officeUse.admittedSection} onChange={(e) => handleNestedChange('officeUse', 'admittedSection', e.target.value)} className="w-full p-2.5 border border-amber-200 bg-white rounded-xl text-xs focus:outline-amber-500" />
                        </div>
                        <div>
                            <label className="block text-xs text-amber-900 font-bold mb-1">একাডেমিক সেশন</label>
                            <input type="text" value={formData.officeUse.academicSession} onChange={(e) => handleNestedChange('officeUse', 'academicSession', e.target.value)} className="w-full p-2.5 border border-amber-200 bg-white rounded-xl text-xs focus:outline-amber-500" />
                        </div>
                        <div>
                            <label className="block text-xs text-amber-900 font-bold mb-1">ভর্তির তারিখ</label>
                            <input type="date" value={formData.officeUse.admissionDate} onChange={(e) => handleNestedChange('officeUse', 'admissionDate', e.target.value)} className="w-full p-2.5 border border-amber-200 bg-white rounded-xl text-xs focus:outline-amber-500" />
                        </div>
                    </div>
                </div>

                {/* সাবমিট বাটন */}
                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button type="submit" disabled={isSaving} className="bg-emerald-800 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm px-8 py-3.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50">
                        {isSaving ? "⏳ ডাটা সেভ হচ্ছে..." : "💾 শিক্ষার্থীর সকল তথ্য আপডেট করুন"}
                    </button>
                </div>

            </form>
        </div>
    );
}
