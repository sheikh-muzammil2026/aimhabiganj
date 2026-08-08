"use client";

import Image from "next/image";

export default function RoutinePreview({ routine }) {
    if (!routine) {
        return (
            <div className="p-8 text-center text-gray-500 font-medium">
                কোনো প্রিভিউ ডেটা পাওয়া যায়নি!
            </div>
        );
    }
    const handlePrint = () => {
        window.print();
    };

    // সরাসরি PDF ডাউনলোড করার ফাংশন
    const handleDownloadPDF = async () => {
        const element = document.getElementById("printable");
        if (!element) return;

        // html2pdf ডাইনামিকালি ইমপোর্ট করা (Next.js SSR সমস্যা এড়াতে)
        const html2pdf = (await import("html2pdf.js")).default;

        const options = {
            margin: 5,
            filename: `Routine_${routine.examTitle || "Exam"}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "landscape" }
        };

        html2pdf().set(options).from(element).save();
    };

    const dateCount = routine.dates?.length || 1;

    // তারিখের সংখ্যার ওপর ভিত্তি করে ডাইনামিক ফন্ট ও প্যাডিং ক্লাস সেট করা
    const getDynamicTextSize = () => {
        if (dateCount > 12) return "text-[9px] print:text-[8px] p-0.5 print:p-0.5";
        if (dateCount > 8) return "text-[10px] print:text-[9px] p-1 print:p-0.5";
        return "text-xs print:text-[11px] p-1.5 print:p-1";
    };

    const textSizeClass = getDynamicTextSize();

    return (
        <div className="bg-white p-4 max-w-[1400px] mx-auto shadow-sm rounded-lg border border-gray-100">
            {/* Non-Printable Action Header */}
            <div className="flex justify-between items-center mb-4 print:hidden bg-gray-50 border border-gray-200 p-4 rounded-md">
                <div>
                    <h2 className="font-bold text-gray-800 text-lg">রুটিন লাইভ প্রিভিউ</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                        প্রিন্ট বা পিডিএফ ডাউনলোডের আগে প্রিভিউ দেখে নিন
                    </p>
                </div>
                {/* Print and Download Buttons */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-md shadow-sm transition-all text-sm active:scale-95"
                    >
                        <span>📥</span> Download PDF
                    </button>

                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-md shadow-sm transition-all text-sm active:scale-95"
                    >
                        <span>🖨️</span> Print
                    </button>
                </div>
            </div>

            {/* Printable Routine Layout */}
            <div id="printable" className="p-2 print:p-0 w-full mx-auto">
                {/* Banner */}

                <div className="text-start mb-2">
                    <Image
                        src={"/bannerWithLogo.jpeg"}
                        alt="Institution Banner"
                        width={2400}
                        height={400}
                        quality={100}
                        priority
                        unoptimized
                        className="w-full h-auto max-h-28 object-contain mx-auto print:max-h-20"
                    />
                </div>
                {/* Title Header */}
                <div className="text-center mb-3 space-y-0.5">
                    <h3 className="text-xs md:text-sm font-bold text-gray-800">
                        <span>{routine.examTitle}</span> - {routine.gregorianYear} ঈসায়ী /{" "}
                        {routine.hijriYear} হি
                    </h3>
                    <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
                        পরীক্ষার রুটিন
                    </h2>


                </div>

                {/* Table Matrix */}
                <div className="w-full overflow-hidden">
                    <table className="w-full border-collapse border border-gray-800 text-gray-900 table-fixed">
                        <thead>
                            <tr className="bg-gray-200 text-center font-bold print:bg-gray-200">
                                <th className={`border border-gray-800 text-left w-[120px] ${textSizeClass}`}>
                                    শ্রেণি
                                </th>
                                {routine.dates?.map((d) => (
                                    <th
                                        key={d.id}
                                        className={`border border-gray-800 text-center ${textSizeClass}`}
                                    >

                                        <div className="truncate">{d.gregorian || "—"}</div>
                                        <div className="mt-0.5 font-semibold text-gray-800 truncate">
                                            {d.day}
                                        </div>
                                        <hr className="border-gray-800 my-0.5" />
                                        <div className="font-bold truncate">{d.hijri || "—"}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {routine.routineData?.map((row, index) => (
                                <tr key={index} className="text-center hover:bg-gray-50">
                                    <td className={`border border-gray-800 font-bold bg-gray-100 text-left print:bg-gray-100 ${textSizeClass}`}>
                                        {row.class || row.jamaat}
                                    </td>
                                    {routine.dates?.map((d) => (
                                        <td
                                            key={d.id}
                                            className={`border border-gray-800 font-medium break-all whitespace-normal ${textSizeClass}`}
                                        >
                                            {row.subjects?.[d.id] || "—"}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Note Footer */}
                {routine.note && (
                    <div className="mt-2 p-1.5 border-l-4 border-gray-800 bg-gray-50 text-[11px] print:text-[10px] font-semibold text-gray-900 leading-snug print:bg-transparent print:p-0 print:border-none">
                        বিশেষ দ্রষ্টব্য: {routine.note}
                    </div>
                )}
            </div>

            {/* Global Printing & Page Styles */}
            <style jsx global>{`
                @media print {
                    @page {
                        size: A4 landscape;
                        margin: 5mm;
                    }

                    body {
                        background-color: #ffffff !important;
                        color: #000000 !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }

                    body * {
                        visibility: hidden;
                    }

                    #printable,
                    #printable * {
                        visibility: visible;
                    }

                    #printable {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }

                    table {
                        width: 100% !important;
                        table-layout: fixed !important;
                    }

                    th, td {
                        word-break: break-word !important;
                        overflow-wrap: break-word !important;
                    }
                }
            `}</style>
        </div>
    );
}