import React from "react";
import Barcode from "react-barcode";

const StudentIdCard = ({ studentData }) => {
  // ১. সেশন থেকে শুধু ২০২৬ বের করার লজিক
  const displaySession = studentData?.sessionYear
    ? studentData.sessionYear.split("-")[0]
    : "";

  // ২. ডিভিশন চেক করার লজিক (হিফজ নাকি একাডেমিক)
  let divisionText = "";
  if (studentData?.divisionHifz?.active) {
    divisionText = "হিফজ";
  } else if (studentData?.divisionAcademy?.active) {
    divisionText = "একাডেমিক";
  }

  // ৩. ডায়নামিক বারকোড ডাটা তৈরি (স্ক্যান করলে সব ইনফরমেশন আসবে)
  const barcodeValue = JSON.stringify({
    ID: studentData?.studentId || "",
    Name: studentData?.studentNameBangla || "",
    Father: studentData?.fatherNameBangla || "",
    Mobile: studentData?.fatherMobile || "",
    Division: divisionText,
    Session: displaySession,
    Address: `${studentData?.currentAddress?.village || ""}, ${studentData?.currentAddress?.thana || ""}, ${studentData?.currentAddress?.district || ""}`
  });

  return (
    <div className="w-[3.375in] h-[2.125in] border border-gray-300 rounded-lg overflow-hidden bg-white shadow-md flex flex-col justify-between print:m-0 print:shadow-none print:[-webkit-print-color-adjust:exact] print:[print-color-adjust:exact]">

      {/* আইডি কার্ডের হেডার */}
      <div className="bg-[#0022C8] text-white p-2 text-center print:[-webkit-print-color-adjust:exact] print:[print-color-adjust:exact]">
        <h2 className="text-sm font-bold truncate">প্রতিষ্ঠানের নাম</h2>
        <p className="text-[9px]">শিক্ষাবর্ষ: {displaySession}</p>
      </div>

      {/* বডি ও ইনফরমেশন সেকশন */}
      <div className="p-2 flex-1 flex flex-col justify-center gap-1 overflow-hidden">

        {/* ১. স্টুডেন্ট নেম (w-full এবং বড় লেখা হলে অটো ফিট/ট্রাংকেট হবে) */}
        <div className="w-full text-center">
          <h3 className="w-full text-xs font-bold text-gray-800 truncate whitespace-nowrap overflow-hidden">
            {studentData?.studentNameBangla}
          </h3>
        </div>

        {/* অন্যান্য তথ্য (লেখা বড় হলে ফন্ট সাইজ ছোট ও ট্রাংকেট হবে) */}
        <div className="text-[10px] space-y-0.5 text-gray-700">
          <div className="flex items-center gap-1 w-full overflow-hidden">
            <span className="font-semibold shrink-0">আইডি:</span>
            <span className="truncate">{studentData?.studentId}</span>
          </div>

          {/* ৩. ডিভিশন (শুধুমাত্র হিফজ/একাডেমিক) */}
          <div className="flex items-center gap-1 w-full overflow-hidden">
            <span className="font-semibold shrink-0">বিভাগ:</span>
            <span className="truncate">{divisionText}</span>
          </div>

          <div className="flex items-center gap-1 w-full overflow-hidden">
            <span className="font-semibold shrink-0">পিতার নাম:</span>
            <span className="truncate">{studentData?.fatherNameBangla}</span>
          </div>

          {/* ৬. মোবাইল নাম্বার ফন্ট ফিক্স */}
          <div className="flex items-center gap-1 w-full overflow-hidden">
            <span className="font-semibold shrink-0">মোবাইল:</span>
            <span className="font-sans tracking-normal font-medium text-gray-900 truncate">
              {studentData?.fatherMobile}
            </span>
          </div>
        </div>

        {/* ৪. ডায়নামিক বারকোড */}
        <div className="flex justify-center items-center my-1">
          <Barcode
            value={barcodeValue || "000000"}
            width={1}
            height={20}
            fontSize={8}
            displayValue={false}
            margin={0}
          />
        </div>
      </div>

      {/* ৫. Authorized Signature (প্রিন্ট কালার ফিক্সড) */}
      <div className="bg-[#0022C8] text-white text-right px-3 py-0.5 print:[-webkit-print-color-adjust:exact] print:[print-color-adjust:exact]">
        <p className="text-[8px] font-sans font-medium tracking-wide">
          Authorized Signature
        </p>
      </div>

    </div>
  );
};

export default StudentIdCard;