"use client";

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

    const bannerSrc = routine.bannerUrl || "/banner_male.jpg";

    return (
        <div className="bg-white p-4 max-w-[1200px] mx-auto shadow-sm rounded-lg border border-gray-100">
            {/* Non-Printable Action Header */}
            <div className="flex justify-between items-center mb-6 print:hidden bg-gray-50 border border-gray-200 p-4 rounded-md">
                <div>
                    <h2 className="font-bold text-gray-800 text-lg">রুটিন লাইভ প্রিভিউ</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                        প্রিন্ট বা পিডিএফ ডাউনলোডের আগে প্রিভিউ দেখে নিন
                    </p>
                </div>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-md shadow-sm transition-all text-sm active:scale-95"
                >
                    <span>🖨️</span> Download PDF / Print
                </button>
            </div>

            {/* Printable Routine Layout */}
            <div id="printable" className="p-2 print:p-0">
                {/* Banner */}
                <div className="text-center mb-3">
                    <img
                        src={bannerSrc}
                        alt="Institution Banner"
                        className="w-full h-auto max-h-36 object-contain mx-auto"
                    />
                </div>

                {/* Title Header */}
                <div className="text-center mb-4 space-y-1">
                    <h3 className="text-sm md:text-base font-bold text-gray-800">
                        <span>{routine.examTitle}</span> - {routine.hijriYear} হি /{" "}
                        {routine.gregorianYear} ঈসায়ী
                    </h3>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                        পরীক্ষার রুটিন
                    </h2>

                    {/* Academy Type & Section Sub-header */}
                    {(routine.academyType || routine.section) && (
                        <p className="text-xs md:text-sm font-semibold text-gray-700">
                            {routine.academyType && <span>বিভাগ: {routine.academyType}</span>}
                            {routine.academyType && routine.section && <span> | </span>}
                            {routine.section && <span>শাখা/সেকশন: {routine.section}</span>}
                        </p>
                    )}
                </div>

                {/* Table Matrix */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-800 text-xs text-gray-900">
                        <thead>
                            <tr className="bg-gray-200 text-center font-bold">
                                <th className="border border-gray-800 p-2 min-w-[110px] text-left">
                                    শ্রেণি / জামাআত
                                </th>
                                {routine.dates?.map((d) => (
                                    <th
                                        key={d.id}
                                        className="border border-gray-800 p-1.5 min-w-[90px] text-center"
                                    >
                                        <div className="font-bold">{d.hijri || "—"}</div>
                                        <hr className="border-gray-800 my-1" />
                                        <div>{d.gregorian || "—"}</div>
                                        <div className="mt-0.5 font-semibold text-gray-700">
                                            {d.day}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {routine.routineData?.map((row, index) => (
                                <tr key={index} className="text-center hover:bg-gray-50">
                                    <td className="border border-gray-800 p-2 font-bold bg-gray-100 text-left">
                                        {/* Fixed: row.jamaat shifted to row.class */}
                                        {row.class || row.jamaat}
                                    </td>
                                    {routine.dates?.map((d) => (
                                        <td
                                            key={d.id}
                                            className="border border-gray-800 p-2 font-medium"
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
                    <div className="mt-4 p-2 border-l-4 border-gray-800 bg-gray-50 text-xs md:text-sm font-semibold text-gray-900 leading-relaxed print:bg-transparent print:p-0 print:border-none">
                        বিশেষ দ্রষ্টব্য: {routine.note}
                    </div>
                )}
            </div>

            {/* Global Printing Rules */}
            <style jsx global>{`
                @media print {
                    body {
                        background-color: #ffffff !important;
                        color: #000000 !important;
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
                        width: 100%;
                        margin: 0;
                        padding: 0;
                    }
                    @page {
                        size: landscape;
                        margin: 10mm;
                    }
                }
            `}</style>
        </div>
    );
}