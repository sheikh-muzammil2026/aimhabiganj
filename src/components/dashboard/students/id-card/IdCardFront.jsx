"use client";

import React from "react";
import BarcodeSVG from "react-barcode";
import AutoScaledText from "@/components/shared/AutoScaledText";
import { getStudentClassDetails } from "@/lib/studentUtils";

export function IdCardFront({ student }) {
  if (!student) return null;

  const details = getStudentClassDetails(student);

  // ১) সেশন থেকে শুধুমাত্র প্রথম ৪ ডিজিট (যেমন: ২০২৬) নেওয়া
  const sessionOnlyYear =
    (student.sessionYear || "").split(/[-–/]/)[0].trim() || "N/A";

  // ২) বারকোডের জন্য সমস্ত ডাইনামিক ডাটা স্ট্রিং আকারে প্যাক করা
  const barcodePayload = String(student.studentId || student.roll || "");

  return (
    <div
      className="w-[2.125in] h-[3.375in] bg-white rounded-xl p-[3px] relative shadow-xl overflow-hidden mx-auto print:shadow-none print:break-inside-avoid shrink-0"
      style={{
        border: "6px solid #0022C8",
        boxSizing: "border-box",
      }}
    >
      <div
        className="w-full h-full bg-white rounded-lg flex flex-col justify-between relative overflow-hidden"
        style={{ border: "2px solid #1E40AF" }}
      >
        {/* ================= ১. হেডার সেকশন ================= */}
        <div className="w-full  border-b-2 border-[#0022C8] flex items-center justify-center">
          {/* লোগোর সেকশন */}
          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/aimlogo1.png"
              alt="AIM Logo"
              className="w-full h-full object-cover scale-[1.06] rounded-full"
            />
          </div>

          {/* মাদ্রাসার নামের ব্যানার/ছবি */}
          <div className="flex-1 flex items-center h-11">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/banner.jpeg"
              alt="As-Salam Ideal Madrasah  (AIM) Name and Slogan"
              className="h-full object-cover"
            />
          </div>
        </div>

        {/* ================= ২. মিডল সেকশন (ছবি, আইডি নম্বর ও বারকোড) ================= */}
        <div className="flex justify-between items-center px-2 pt-1 mb-2 relative">
          <div className="w-[75px] h-[75px] rounded-full border-2 border-[#38BDF8] overflow-hidden bg-gray-100 flex items-center justify-center shadow-inner">
            {student.studentImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={student.studentImage}
                alt={student.studentNameEnglish || "Student"}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                className="w-16 h-16 text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </div>

          <div className="flex items-center gap-1">
            <div className="flex flex-col items-center justify-center transform -rotate-90 origin-center whitespace-nowrap -mr-2">
              <span className="text-[10px] font-black text-[#B00070] tracking-wider">
                ID CARD
              </span>
              <span className="text-[8px] font-black text-[#0022C8] tracking-tight">
                ID NO-
                {student.studentId || student.roll || student._id?.slice(-6)}
              </span>
            </div>

            {/* ডাইনামিক বারকোড রেন্ডারিং */}
            <div className="w-6 h-20 bg-white flex items-center justify-center overflow-hidden">
              <div className="transform rotate-90 origin-center scale-90">
                <BarcodeSVG
                  value={barcodePayload || "0000"}
                  format="CODE128"
                  width={1.2}
                  height={28}
                  displayValue={false}
                  margin={0}
                  background="transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= ৩. ইনফরমেশন সেকশন ================= */}
        <div className="px-2 pt-0.5 pb-1 flex-1 flex flex-col space-y-1">
          {/* স্টুডেন্টের নাম - অটো ছোট হয়ে জায়গা মত বসবে */}
          <div className="w-full">
            <AutoScaledText
              text={
                student.studentNameBangla ||
                student.studentNameEnglish ||
                "N/A"
              }
              fill="#000"
              fontWeight="bold"
              fontFamily="hindSiliguri"
            />
          </div>

          <div className="space-y-1 text-[9px] font-serif">
            {/* পিতা */}
            <div className="flex items-center">
              <span className="w-[55px] font-bold text-[#A0006D] shrink-0">
                Father
              </span>
              <span className="font-bold text-[#A0006D] mr-1">:</span>
              <div className="flex-1 overflow-hidden">
                <AutoScaledText
                  text={
                    student.fatherNameBangla ||
                    student.fatherNameEnglish ||
                    "N/A"
                  }
                  fill="#000"
                  fontWeight="normal"
                  fontFamily="hindSiliguri"
                />
              </div>
            </div>

            {/* এডমিশন সেশন */}
            <div className="flex items-center">
              <span className="w-[55px] font-bold text-[#A0006D] shrink-0">
                Ad.Session
              </span>
              <span className="font-bold text-[#A0006D] mr-1">:</span>
              <span className="font-semibold text-black flex-1">
                {sessionOnlyYear}
              </span>
            </div>

            {/* বিভাগ (হিফজ/একাডেমিক) */}
            <div className="flex items-center">
              <span className="w-[55px] font-bold text-[#A0006D] shrink-0">
                Division
              </span>
              <span className="font-bold text-[#A0006D] mr-1">:</span>
              <span className="font-semibold text-black flex-1">
                {details.divisionName}
              </span>
            </div>

            {/* জন্ম তারিখ */}
            <div className="flex items-center">
              <span className="w-[55px] font-bold text-[#A0006D] shrink-0">
                D.O.B
              </span>
              <span className="font-bold text-[#A0006D] mr-1">:</span>
              <span className="font-semibold text-black flex-1 font-mono text-[8px]">
                {student.dateOfBirth || student.dob || "N/A"}
              </span>
            </div>

            {/* মোবাইল নম্বর */}
            <div className="flex items-center">
              <span className="w-[55px] font-bold text-[#A0006D] shrink-0">
                Mobile
              </span>
              <span className="font-bold text-[#A0006D] mr-1">:</span>
              <span className="font-semibold text-black flex-1 font-mono text-[8px]">
                {student.fatherMobile || student.guardianMobile || "N/A"}
              </span>
            </div>

            {/* ব্ল্যাড গ্রুপ */}
            <div className="flex  items-center">
              <span className="w-[55px] font-bold text-[8px]  text-[#A0006D] shrink-0">
                Blood Group
              </span>
              <span className="font-bold text-[#A0006D] mr-1">:</span>
              <span className="font-semibold text-black flex-1">
                {student.bloodGroup || "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div
          className="bg-[#047857] text-white text-right px-3 py-1 relative flex flex-col items-end justify-end border-t border-amber-500"
          style={{
            backgroundColor: "#047857",
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
          }}
        >
          {/* সিগনেচার ইমেজ */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/principle's_signature.jpg"
            alt="Authorized Signature"
            className="absolute -top-9 -right-2 h-10 w-18 object-contain mix-blend-multiply contrast-[800%] brightness-[80%] grayscale -rotate-45"
          />

          <p className="text-[8px] font-sans font-medium tracking-wide relative z-10 text-amber-300">
            Authorized Signature
          </p>
        </div>
      </div>
    </div>
  );
}

export default IdCardFront;
