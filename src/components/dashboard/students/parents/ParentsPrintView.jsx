"use client";

import React, { forwardRef } from "react";
import PrintInstitutionalHeader from "@/components/shared/print/PrintInstitutionalHeader";
import PrintSignatures from "@/components/shared/print/PrintSignatures";
import { siteConfig } from "@/config/siteConfig";
import { toBengaliDigits } from "@/lib/studentUtils";

const ParentsPrintView = forwardRef(function ParentsPrintView(
  {
    classGroups = [],
    sessionYear = "সকল শিক্ষাবর্ষ",
    printDate,
  },
  ref
) {
  const totalStudents = classGroups.reduce(
    (acc, group) => acc + (group.students?.length || 0),
    0
  );

  const formatAddress = (addr) => {
    if (!addr) return "—";
    const parts = [
      addr.village,
      addr.postOffice ? `ডাক: ${addr.postOffice}` : "",
      addr.thana ? `থানা: ${addr.thana}` : "",
      addr.district,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "—";
  };

  return (
    <div
      ref={ref}
      className="parents-directory-print-root bg-white text-slate-900 p-4 sm:p-6 w-full max-w-[210mm] mx-auto print:max-w-none print:w-full print:p-0 font-bornomala"
      style={{
        boxSizing: "border-box",
        fontFamily: "'Bornomala', 'Ubuntu Sans', sans-serif",
      }}
    >
      {/* প্রাতিষ্ঠানিক হেডার */}
      <div className="border-b-2 border-emerald-900 pb-2 mb-2">
        <PrintInstitutionalHeader
          logoSrc={siteConfig.assets.logo}
          bannerSrc={siteConfig.assets.banner}
          logoWrapperClassName="w-16 h-16 rounded-full overflow-hidden shrink-0 relative flex items-center justify-center border border-emerald-700"
          logoWidth={80}
          logoHeight={80}
          bannerClassName="w-full h-auto max-h-16 object-contain mx-auto"
          containerClassName="flex justify-between items-center relative gap-2 w-full"
        />

        <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200 text-xs">
          <div>
            <h2 className="text-sm font-extrabold text-emerald-950">
              অভিভাবক ও শিক্ষার্থীর যোগাযোগ তালিকা (Directory)
            </h2>
            <p className="text-[10px] text-slate-600">
              {siteConfig.address.bn} • {siteConfig.contacts.phoneBn}
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block px-2 py-0.5 bg-emerald-50 border border-emerald-300 rounded text-[10px] font-bold text-emerald-900">
              প্রিন্ট তারিখ: {printDate || new Date().toLocaleDateString("bn-BD")}
            </span>
          </div>
        </div>
      </div>

      {/* মেটাডাটা বার */}
      <div className="flex items-center justify-between bg-slate-50 border border-slate-300 rounded px-3 py-1 mb-3 text-[10.5px]">
        <div>
          <span className="text-slate-500 font-medium">শিক্ষাবর্ষ: </span>
          <strong className="text-slate-900">{sessionYear}</strong>
        </div>
        <div>
          <span className="text-slate-500 font-medium">মোট বিভাগ/শ্রেণি: </span>
          <strong className="text-slate-900">{toBengaliDigits(classGroups.length)} টি</strong>
        </div>
        <div>
          <span className="text-slate-500 font-medium">মোট শিক্ষার্থী: </span>
          <strong className="text-emerald-900 font-sans">{toBengaliDigits(totalStudents)} জন</strong>
        </div>
      </div>

      {/* শ্রেণি অনুযায়ী শিক্ষার্থী ও অভিভাবক তালিকা */}
      {classGroups.map((group, groupIdx) => (
        <div key={group.className || groupIdx} className="mb-4 break-inside-avoid">
          {/* শ্রেণি হেডার ব্যানার */}
          <div className="flex items-center justify-between bg-emerald-900 text-white px-2.5 py-1 rounded-t border border-emerald-950 text-[11px] font-bold">
            <div className="flex items-center gap-2">
              <span>শ্রেণি: {group.className}</span>
              {group.divisionName && (
                <span className="text-emerald-200 text-[9.5px] font-normal">
                  ({group.divisionName})
                </span>
              )}
            </div>
            <span className="text-emerald-100 text-[10px]">
              শিক্ষার্থী: {toBengaliDigits(group.students?.length || 0)} জন
            </span>
          </div>

          {/* শ্রেণি টেবিল */}
          <table className="w-full text-left border-collapse border border-slate-400 text-[9.5px]">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-400 text-center">
                <th className="py-1 px-1 border-r border-slate-300 w-7">ক্রমিক</th>
                <th className="py-1 px-1 border-r border-slate-300 w-16">আইডি ও রোল</th>
                <th className="py-1 px-1.5 border-r border-slate-300 text-left w-24">শিক্ষার্থীর নাম</th>
                <th className="py-1 px-1.5 border-r border-slate-300 text-left">পিতার নাম ও মোবাইল</th>
                <th className="py-1 px-1.5 border-r border-slate-300 text-left">মাতার নাম ও মোবাইল</th>
                <th className="py-1 px-1.5 border-r border-slate-300 text-left">জরুরি / অভিভাবক যোগাযোগ</th>
                <th className="py-1 px-1.5 border-slate-300 text-left w-28">স্থায়ী ঠিকানা</th>
              </tr>
            </thead>
            <tbody>
              {group.students?.map((student, idx) => {
                const rollDisplay = student.roll ? toBengaliDigits(student.roll) : "—";
                return (
                  <tr
                    key={student._id?.$oid || student._id || idx}
                    className="border-b border-slate-300 odd:bg-white even:bg-slate-50/60 break-inside-avoid"
                    style={{ pageBreakInside: "avoid" }}
                  >
                    {/* ক্রমিক */}
                    <td className="py-1 px-1 border-r border-slate-300 text-center font-bold text-slate-600">
                      {toBengaliDigits(idx + 1)}
                    </td>

                    {/* আইডি ও রোল */}
                    <td className="py-1 px-1 border-r border-slate-300 text-center">
                      <div className="font-bold text-emerald-950 font-sans text-[10px]">
                        রোল: {rollDisplay}
                      </div>
                      <div className="text-[8px] text-slate-500 font-mono">
                        {student.studentId || "—"}
                      </div>
                    </td>

                    {/* শিক্ষার্থীর নাম */}
                    <td className="py-1 px-1.5 border-r border-slate-300 font-bold text-slate-900">
                      <div>{student.studentNameBangla || "নাম বিহীন"}</div>
                      {student.studentNameEnglish && (
                        <div className="text-[8px] font-normal text-slate-500 font-sans">
                          {student.studentNameEnglish}
                        </div>
                      )}
                    </td>

                    {/* পিতার নাম ও মোবাইল */}
                    <td className="py-1 px-1.5 border-r border-slate-300 text-slate-800">
                      <div className="font-semibold text-slate-900">
                        {student.fatherNameBangla || student.fatherNameEnglish || "—"}
                      </div>
                      <div className="text-[8.5px] font-sans font-medium text-emerald-800">
                        {student.fatherMobile ? `📞 ${student.fatherMobile}` : "—"}
                      </div>
                      {student.fatherProfession && (
                        <div className="text-[7.5px] text-slate-500">
                          পেশা: {student.fatherProfession}
                        </div>
                      )}
                    </td>

                    {/* মাতার নাম ও মোবাইল */}
                    <td className="py-1 px-1.5 border-r border-slate-300 text-slate-800">
                      <div>{student.motherNameBangla || student.motherNameEnglish || "—"}</div>
                      <div className="text-[8.5px] font-sans text-slate-600">
                        {student.motherMobile ? `📞 ${student.motherMobile}` : "—"}
                      </div>
                    </td>

                    {/* জরুরি যোগাযোগ */}
                    <td className="py-1 px-1.5 border-r border-slate-300 text-slate-800">
                      {student.guardianNameAbsentParents ? (
                        <>
                          <div className="font-medium text-slate-900">
                            {student.guardianNameAbsentParents}
                            {student.guardianRelation && ` (${student.guardianRelation})`}
                          </div>
                          <div className="text-[8.5px] font-sans text-emerald-800">
                            {student.guardianMobile ? `📞 ${student.guardianMobile}` : "—"}
                          </div>
                        </>
                      ) : student.referenceName ? (
                        <>
                          <div className="text-[8.5px] text-slate-700">
                            রেফারেন্স: {student.referenceName}
                          </div>
                          <div className="text-[8px] font-sans text-slate-600">
                            {student.referenceMobile ? `📞 ${student.referenceMobile}` : ""}
                          </div>
                        </>
                      ) : (
                        <span className="text-slate-400 text-[8.5px]">পিতা/মাতা নিজেই অভিভাবক</span>
                      )}
                    </td>

                    {/* স্থায়ী ঠিকানা */}
                    <td className="py-1 px-1.5 border-slate-300 text-slate-600 text-[8.5px]">
                      {formatAddress(student.permanentAddress || student.currentAddress)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}

      {/* স্বাক্ষর */}
      <div className="mt-6 pt-2 break-inside-avoid">
        <PrintSignatures
          variant="compact"
          controllerLabel="প্রস্তুতকারী / অফিস সহকারী"
          principalLabel="প্রিন্সিপাল / মুহতামিম"
          controllerSignatureSrc={siteConfig.assets.controllerSignature}
          principalSignatureSrc={siteConfig.assets.principalSignature}
          className="flex justify-between items-end my-3 px-6 flex-shrink-0"
        />

        <div className="text-center text-[8.5px] text-slate-500 pt-1.5 border-t border-slate-200 mt-2">
          {siteConfig.name.fullBn} • অভিভাবক যোগাযোগ রেজিস্টার
        </div>
      </div>
    </div>
  );
});

export default ParentsPrintView;
