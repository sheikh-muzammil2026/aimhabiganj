'use client';

import React from 'react';

// উদাহরণ হিসেবে আপনার JSON ডাটাটি নিচে দেওয়া হলো
const studentData = {
  _id: { $oid: "6a64d683b8a1ee073dd4a62d" },
  sessionYear: "২০২৬-২০২৭",
  status: "Approved",
  studentId: "04153",
  studentImage: "",
  studentNameBangla: "আব্দুল্লাহ বিন সুলতান",
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
  currentAddress: {
    house: "",
    road: "",
    village: "উত্তর শ্যামলী",
    postOffice: "উত্তর শ্যামলী",
    thana: "হবিগঞ্জ সদর",
    district: "হবিগঞ্জ"
  },
  permanentAddress: {
    house: "",
    road: "",
    village: "উত্তর শ্যামলী",
    postOffice: "উত্তর শ্যামলী",
    thana: "হবিগঞ্জ সদর",
    district: "হবিগঞ্জ"
  },
  referenceName: "",
  referenceMobile: "",
  divisionPreHifz: { active: false, type: "", class: "" },
  divisionHifz: { active: false, type: "", class: "" },
  divisionAcademy: { active: true, type: "", class: "দ্বিতীয়", academyType: "প্রাথমিক" },
  previousInstitutionName: "",
  previousInstitutionAddress: "",
  previousInstitutionPrincipalMobile: "",
  reasonForLeaving: "",
  previousClass: "প্রথম",
  transferCertificateNo: "",
  leavingDate: "",
  physicalProblem: "",
  physicalProblemDetails: "",
  cleanlinessLover: "",
  foodReluctance": "",
  favFoodType": "",
  prayerHabit": "",
  sleepTime": "",
  wakeUpTime": "",
  favThing": "",
  anxietyReason": "",
  guardianImage: "",
  fatherNameBangla: "সুলতান চৌধুরী",
  fatherNameEnglish: "",
  fatherNid: "",
  fatherMobile: "01798707279",
  fatherStatus: "জীবিত",
  fatherProfession: "",
  fatherEmail: "",
  motherNameBangla: "",
  motherNameEnglish: "",
  motherNid: "",
  motherMobile: "",
  motherStatus: "জীবিত",
  motherProfession: "",
  motherEmail: "",
  guardianNameAbsentParents: "",
  guardianRelation: "",
  guardianNid: "",
  guardianProfession: "",
  guardianEmail: "",
  guardianMobile: "",
  guardianAnnualIncome: "",
  guardianAnnualIncomeWords": "",
  admissionReason": "",
  primaryContactMethod: "01798707279",
  infoSource": "",
  teacherName": "",
  applicantSignatureDate": "",
  attachments: {
    citizenshipCertificate: "",
    birthCertificate: "",
    guardianNid: "",
    academicTranscript: "",
    boardRegCard: "",
    orphanCertificate: ""
  },
  officeUse: {
    markTilawat: "",
    markArabic: "",
    markEnglish: "",
    markMath: "",
    markOthers: "",
    totalMarks: 0,
    recommendedClass: "দ্বিতীয়",
    rollNumber: "",
    monthlyFee: "",
    feeCategory: "",
    examinerId1: "",
    examinerId2: "",
    examinerId3: "",
    receiptNo: ""
  },
  createdAt: { $date: "2026-07-25T17:34:00.000Z" }
};

export default function StudentProfile() {
  const data = studentData;

  const handlePrint = () => {
    window.print();
  };

  const formatAddress = (addr) => {
    if (!addr) return 'তথ্য নেই';
    const parts = [
      addr.house && `বাসা: ${addr.house}`,
      addr.road && `রোড: ${addr.road}`,
      addr.village && `গ্রাম/এলাকা: ${addr.village}`,
      addr.postOffice && `ডাকঘর: ${addr.postOffice}`,
      addr.thana && `থানা: ${addr.thana}`,
      addr.district && `জেলা: ${addr.district}`
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'তথ্য নেই';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 print:p-0 print:bg-white">
      {/* Action Buttons */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <h1 className="text-2xl font-bold text-emerald-800">শিক্ষার্থী প্রোফাইল</h1>
        <button
          onClick={handlePrint}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-medium shadow transition-all duration-200"
        >
          🖨️ প্রিন্ট / PDF ডাইনলোড
        </button>
      </div>

      {/* Main Profile Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-emerald-100 overflow-hidden print:shadow-none print:border-none">
        
        {/* Header Section */}
        <div className="bg-emerald-800 text-white p-6 border-b-4 border-emerald-600 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            {/* Student Image Placeholder */}
            <div className="w-24 h-28 bg-emerald-50 rounded-lg border-2 border-white flex items-center justify-center overflow-hidden shrink-0">
              {data.studentImage ? (
                <img src={data.studentImage} alt={data.studentNameBangla} className="w-full h-full object-cover" />
              ) : (
                <span className="text-emerald-800 text-xs text-center px-2">ছবি সংযুক্ত নেই</span>
              )}
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                {data.studentNameBangla || "নাম পাওয়া যায়নি"}
              </h2>
              {data.studentNameEnglish && (
                <p className="text-emerald-200 text-sm">{data.studentNameEnglish}</p>
              )}
              {data.studentNameArabic && (
                <p className="text-emerald-200 text-sm font-serif">{data.studentNameArabic}</p>
              )}
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="bg-emerald-700 px-2 py-1 rounded border border-emerald-500">
                  আইডি: <strong className="text-white">{data.studentId || 'N/A'}</strong>
                </span>
                <span className="bg-emerald-700 px-2 py-1 rounded border border-emerald-500">
                  শিক্ষাবর্ষ: <strong className="text-white">{data.sessionYear}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="text-right flex flex-col items-end gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              data.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              স্ট্যাটাস: {data.status}
            </span>
            <p className="text-xs text-emerald-200">
              বিভাগ: <span className="text-white font-semibold">{data.divisionAcademy?.active ? `একাডেমিক (${data.divisionAcademy?.class} শ্রেণী)` : 'অন্যান্য'}</span>
            </p>
          </div>
        </div>

        {/* Profile Details Container */}
        <div className="p-6 md:p-8 space-y-6 text-gray-700">

          {/* Section: মৌলিক তথ্য */}
          <section>
            <h3 className="text-lg font-semibold text-emerald-800 border-b-2 border-emerald-600 pb-1 mb-3 flex items-center gap-2">
              📌 মৌলিক ও ব্যক্তিক তথ্য
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm bg-slate-50 p-4 rounded-lg border border-slate-100">
              <div><span className="font-semibold text-gray-600">জন্ম তারিখ:</span> {data.dateOfBirth || '—'}</div>
              <div><span className="font-semibold text-gray-600">বয়স:</span> {data.age || '—'}</div>
              <div><span className="font-semibold text-gray-600">লিঙ্গ:</span> {data.gender || '—'}</div>
              <div><span className="font-semibold text-gray-600">জন্ম নিবন্ধন নং:</span> {data.birthCertificateNo || '—'}</div>
              <div><span className="font-semibold text-gray-600">রক্তের গ্রুপ:</span> {data.bloodGroup || '—'}</div>
              <div><span className="font-semibold text-gray-600">জাতীয়তা:</span> {data.nationality || '—'}</div>
              <div><span className="font-semibold text-gray-600">উচ্চতা:</span> {data.height || '—'}</div>
              <div><span className="font-semibold text-gray-600">ওজন:</span> {data.weight || '—'}</div>
              <div><span className="font-semibold text-gray-600">প্রাথমিক যোগাযোগ:</span> {data.primaryContactMethod || '—'}</div>
            </div>
          </section>

          {/* Section: অভিভাবকের তথ্য */}
          <section>
            <h3 className="text-lg font-semibold text-emerald-800 border-b-2 border-emerald-600 pb-1 mb-3 flex items-center gap-2">
              👨‍👩‍👦 অভিভাবকের তথ্য
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {/* পিতা */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-1">
                <p className="font-bold text-emerald-700 border-b pb-1 mb-2">পিতার তথ্য</p>
                <p><span className="font-semibold">নাম:</span> {data.fatherNameBangla || '—'}</p>
                <p><span className="font-semibold">মোবাইল:</span> {data.fatherMobile || '—'}</p>
                <p><span className="font-semibold">অবস্থা:</span> {data.fatherStatus || '—'}</p>
                <p><span className="font-semibold">পেশা:</span> {data.fatherProfession || '—'}</p>
                <p><span className="font-semibold">এনআইডি:</span> {data.fatherNid || '—'}</p>
              </div>

              {/* মাতা */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-1">
                <p className="font-bold text-emerald-700 border-b pb-1 mb-2">মাতার তথ্য</p>
                <p><span className="font-semibold">নাম:</span> {data.motherNameBangla || '—'}</p>
                <p><span className="font-semibold">মোবাইল:</span> {data.motherMobile || '—'}</p>
                <p><span className="font-semibold">অবস্থা:</span> {data.motherStatus || '—'}</p>
                <p><span className="font-semibold">পেশা:</span> {data.motherProfession || '—'}</p>
                <p><span className="font-semibold">এনআইডি:</span> {data.motherNid || '—'}</p>
              </div>
            </div>
          </section>

          {/* Section: ঠিকানা */}
          <section>
            <h3 className="text-lg font-semibold text-emerald-800 border-b-2 border-emerald-600 pb-1 mb-3 flex items-center gap-2">
              🏠 ঠিকানার বিবরণ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <p className="font-bold text-emerald-700 mb-1">বর্তমান ঠিকানা</p>
                <p className="text-gray-600">{formatAddress(data.currentAddress)}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <p className="font-bold text-emerald-700 mb-1">স্থায়ী ঠিকানা</p>
                <p className="text-gray-600">{formatAddress(data.permanentAddress)}</p>
              </div>
            </div>
          </section>

          {/* Section: শিক্ষাগত ও বিভাগীয় তথ্য */}
          <section>
            <h3 className="text-lg font-semibold text-emerald-800 border-b-2 border-emerald-600 pb-1 mb-3 flex items-center gap-2">
              🎓 একাডেমিক ও বিভাগীয় তথ্য
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-lg border border-slate-100">
              <div><span className="font-semibold text-gray-600">বর্তমান বিভাগ:</span> Academic (প্রাথমিক)</div>
              <div><span className="font-semibold text-gray-600">বর্তমান শ্রেণী:</span> {data.divisionAcademy?.class || '—'}</div>
              <div><span className="font-semibold text-gray-600">পূর্ববর্তী শ্রেণী:</span> {data.previousClass || '—'}</div>
              <div><span className="font-semibold text-gray-600">পূর্ববর্তী প্রতিষ্ঠান:</span> {data.previousInstitutionName || '—'}</div>
            </div>
          </section>

          {/* Section: অফিসিয়াল তথ্য (Office Use) */}
          <section>
            <h3 className="text-lg font-semibold text-emerald-800 border-b-2 border-emerald-600 pb-1 mb-3 flex items-center gap-2">
              📝 অফিসের ব্যবহারিক তথ্য
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
              <div><span className="font-semibold text-gray-600">সুপারিশকৃত শ্রেণী:</span> {data.officeUse?.recommendedClass || '—'}</div>
              <div><span className="font-semibold text-gray-600">রোল নম্বর:</span> {data.officeUse?.rollNumber || '—'}</div>
              <div><span className="font-semibold text-gray-600">মাসিক ফি:</span> {data.officeUse?.monthlyFee || '—'}</div>
              <div><span className="font-semibold text-gray-600">মোট প্রাপ্ত নম্বর:</span> {data.officeUse?.totalMarks || '0'}</div>
              <div><span className="font-semibold text-gray-600">রসিদ নম্বর:</span> {data.officeUse?.receiptNo || '—'}</div>
            </div>
          </section>

        </div>

        {/* Footer / Print Signature Block */}
        <div className="hidden print:flex justify-between items-end p-8 pt-16 text-sm">
          <div className="text-center border-t border-gray-400 pt-1 w-40">
            অভিভাবকের স্বাক্ষর
          </div>
          <div className="text-center border-t border-gray-400 pt-1 w-40">
            যাচাইকারীর স্বাক্ষর
          </div>
          <div className="text-center border-t border-gray-400 pt-1 w-40">
            প্রিন্সিপাল / মুহতামিম
          </div>
        </div>

      </div>
    </div>
  );
}
