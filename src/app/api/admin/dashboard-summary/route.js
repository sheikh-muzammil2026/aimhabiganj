import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/auth";
import { toBengaliDigits } from "@/lib/studentUtils";

export const dynamic = "force-dynamic";

// প্লে থেকে হিফজ পর্যন্ত ধারাবাহিক শ্রেণি ক্রম
const STRICT_CLASS_ORDER = [
  "প্লে",
  "নার্সারি",
  "প্রথম",
  "দ্বিতীয়",
  "তৃতীয়",
  "চতুর্থ",
  "পঞ্চম",
  "ষষ্ঠ",
  "সপ্তম",
  "অষ্টম",
  "নবম",
  "দশম",
  "কায়দা/আমপারা",
  "নাজেরা",
  "সবক",
  "হিফজ",
];

const BENGALI_MONTHS = {
  "01": "জানুয়ারি",
  "02": "ফেব্রুয়ারি",
  "03": "মার্চ",
  "04": "এপ্রিল",
  "05": "মে",
  "06": "জুন",
  "07": "জুলাই",
  "08": "আগস্ট",
  "09": "সেপ্টেম্বর",
  "10": "অক্টোবর",
  "11": "নভেম্বর",
  "12": "ডিসেম্বর",
};

export async function GET() {
  try {
    const db = getDatabase();

    // ঢাকা সময় অনুযায়ী আজকের তারিখ (YYYY-MM-DD)
    const now = new Date();
    const todayStr = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(now);

    const currentMonthKey = todayStr.slice(0, 7); // YYYY-MM
    const [yearPart, monthPart] = currentMonthKey.split("-");
    const currentMonthLabel = `${BENGALI_MONTHS[monthPart] || monthPart} ${toBengaliDigits(yearPart)}`;

    // সকল মেট্রিক্স একক Promise.all-এ প্যারালাল কুয়েরি করা
    const [
      activeApprovedCount,
      pendingStudentsCount,
      pendingAdmissionsCount,
      allActiveStudents,
      teachersCount,
      staffCount,
      teacherAttToday,
      staffAttToday,
      recentAttendanceList,
      todayIncomesAgg,
      todayExpensesAgg,
      monthIncomesAgg,
      monthExpensesAgg,
      last6MonthsIncome,
      last6MonthsExpense,
      recentIncomes,
      recentExpenses,
      examsList,
      totalMarksCount,
      noticesList,
    ] = await Promise.all([
      // ১. শিক্ষার্থীরা
      db.collection("students").countDocuments({ status: "Approved", activity: "active" }),
      db.collection("students").countDocuments({ status: { $regex: /pending|unapproved/i } }),
      db.collection("admissions").countDocuments({ status: { $regex: /pending/i } }),
      db.collection("students")
        .find({ status: "Approved", activity: "active" })
        .project({
          className: 1,
          divisionPreHifz: 1,
          divisionHifz: 1,
          divisionAcademy: 1,
          officeUse: 1,
        })
        .toArray(),

      // ২. শিক্ষক ও স্টাফ
      db.collection("teachers").countDocuments({}),
      db.collection("staff").countDocuments({}),
      db.collection("teacherattendance").find({ date: todayStr }).toArray(),
      db.collection("staffattendance").find({ date: todayStr }).toArray(),
      // সাম্প্রতিক হাজিরা রেকর্ড (যদি আজ কোনো হাজিরা না থাকে তবে পূর্বের দিনের লাইভ ডাটা দেখানোর জন্য)
      db.collection("teacherattendance")
        .find({})
        .sort({ date: -1, _id: -1 })
        .limit(8)
        .toArray(),

      // ৩. ফিন্যান্স (আজকের আয়-ব্যয়)
      db.collection("finance_incomes").aggregate([
        { $match: { date: todayStr } },
        { $group: { _id: null, total: { $sum: "$totalIncome" } } },
      ]).toArray(),
      db.collection("finance_expenses").aggregate([
        { $match: { date: todayStr } },
        { $group: { _id: null, total: { $sum: "$totalExpense" } } },
      ]).toArray(),

      // চলতি মাসের আয়-ব্যয়
      db.collection("finance_incomes").aggregate([
        { $match: { $or: [{ month: currentMonthKey }, { date: { $regex: `^${currentMonthKey}` } }] } },
        { $group: { _id: null, total: { $sum: "$totalIncome" } } },
      ]).toArray(),
      db.collection("finance_expenses").aggregate([
        { $match: { $or: [{ month: currentMonthKey }, { date: { $regex: `^${currentMonthKey}` } }] } },
        { $group: { _id: null, total: { $sum: "$totalExpense" } } },
      ]).toArray(),

      // বিগত ৬ মাসের মাসিক আয় ও ব্যয়
      db.collection("finance_incomes").aggregate([
        { $group: { _id: "$month", total: { $sum: "$totalIncome" } } },
        { $sort: { _id: -1 } },
        { $limit: 6 },
      ]).toArray(),
      db.collection("finance_expenses").aggregate([
        { $group: { _id: "$month", total: { $sum: "$totalExpense" } } },
        { $sort: { _id: -1 } },
        { $limit: 6 },
      ]).toArray(),

      // সাম্প্রতিক ভাউচার ও ট্রানজেকশন
      db.collection("finance_incomes").find({}).sort({ date: -1, _id: -1 }).limit(5).toArray(),
      db.collection("finance_expenses").find({}).sort({ date: -1, _id: -1 }).limit(5).toArray(),

      // ৪. একাডেমিক ও নোটিশ
      db.collection("exams").find({}).limit(5).toArray(),
      db.collection("marks").countDocuments({}),
      db.collection("notices").find({}).sort({ date: -1, _id: -1 }).limit(5).toArray().catch(() => []),
    ]);

    // ------------------------------------------------------------------------
    // ক. শ্রেণিভিত্তিক বণ্টন (Play to Hifz strict ordering)
    // ------------------------------------------------------------------------
    const classCountMap = {};
    allActiveStudents.forEach((student) => {
      let rawClass = "অন্যান্য";
      if (student.divisionPreHifz?.active) {
        rawClass = student.divisionPreHifz.class || "কায়দা/আমপারা";
      } else if (student.divisionHifz?.active) {
        rawClass = student.divisionHifz.class || "হিফজ";
      } else if (student.divisionAcademy?.active) {
        rawClass = student.divisionAcademy.class || "একাডেমিক";
      } else if (student.officeUse?.recommendedClass) {
        rawClass = student.officeUse.recommendedClass;
      } else if (student.className) {
        rawClass = student.className;
      }
      const c = String(rawClass).trim();
      classCountMap[c] = (classCountMap[c] || 0) + 1;
    });

    const classDistribution = [];
    const processedClasses = new Set();

    STRICT_CLASS_ORDER.forEach((cls) => {
      if (classCountMap[cls]) {
        classDistribution.push({
          className: cls,
          count: classCountMap[cls],
          percentage:
            activeApprovedCount > 0
              ? Math.round((classCountMap[cls] / activeApprovedCount) * 100)
              : 0,
        });
        processedClasses.add(cls);
      }
    });

    // বাকি কোনো শ্রেণি থাকলে শেষে যুক্ত করা
    Object.keys(classCountMap).forEach((cls) => {
      if (!processedClasses.has(cls)) {
        classDistribution.push({
          className: cls,
          count: classCountMap[cls],
          percentage:
            activeApprovedCount > 0
              ? Math.round((classCountMap[cls] / activeApprovedCount) * 100)
              : 0,
        });
      }
    });

    // ------------------------------------------------------------------------
    // খ. শিক্ষক ও স্টাফ হাজিরা
    // ------------------------------------------------------------------------
    const totalStaffFaculty = teachersCount + staffCount;
    const todayPresentCount = teacherAttToday.length + staffAttToday.length;
    let todayLateCount = 0;
    teacherAttToday.forEach((t) => {
      if (t.checkInStatus === "Late") todayLateCount++;
    });
    staffAttToday.forEach((s) => {
      if (s.checkInStatus === "Late") todayLateCount++;
    });

    const todayAbsentCount = Math.max(0, totalStaffFaculty - todayPresentCount);
    const attendancePercentage =
      totalStaffFaculty > 0
        ? Math.round((todayPresentCount / totalStaffFaculty) * 100)
        : 0;

    // ------------------------------------------------------------------------
    // গ. ফিন্যান্স গণনা ও বিগত মাসের তুলনামূলক চার্ট
    // ------------------------------------------------------------------------
    const todayIncome = todayIncomesAgg[0]?.total || 0;
    const todayExpense = todayExpensesAgg[0]?.total || 0;
    const todayNet = todayIncome - todayExpense;

    const monthIncome = monthIncomesAgg[0]?.total || 0;
    const monthExpense = monthExpensesAgg[0]?.total || 0;
    const monthNet = monthIncome - monthExpense;

    // বিগত ৬ মাসের মাসিক তালিকা একত্রিত করা
    const monthsSet = new Set();
    last6MonthsIncome.forEach((item) => item._id && monthsSet.add(item._id));
    last6MonthsExpense.forEach((item) => item._id && monthsSet.add(item._id));

    const sortedMonths = Array.from(monthsSet).sort().slice(-6);
    const monthlyComparison = sortedMonths.map((m) => {
      const incObj = last6MonthsIncome.find((i) => i._id === m);
      const expObj = last6MonthsExpense.find((e) => e._id === m);
      const inc = incObj?.total || 0;
      const exp = expObj?.total || 0;
      const [y, mm] = m.split("-");
      const label = `${BENGALI_MONTHS[mm] || mm} ${toBengaliDigits(y.slice(2))}`;

      return {
        monthKey: m,
        monthLabel: label,
        income: inc,
        expense: exp,
        net: inc - exp,
      };
    });

    // ------------------------------------------------------------------------
    // ঘ. সাম্প্রতিক ট্রানজেকশন তালিকা (ইনকাম ও এক্সপেন্স মার্জ)
    // ------------------------------------------------------------------------
    const mergedTransactions = [
      ...recentIncomes.map((inc) => ({
        id: inc.receiptNo || String(inc._id),
        type: "income",
        title: inc.payerName || inc.studentName || "সাধারণ আয়",
        category: inc.fundNameBn || inc.fundName || "জেনারেল ফান্ড",
        amount: inc.totalIncome || 0,
        date: inc.date || todayStr,
        createdAt: inc.createdAt || inc.date,
        description: inc.description || "",
      })),
      ...recentExpenses.map((exp) => ({
        id: exp.voucherNo || String(exp._id),
        type: "expense",
        title: exp.receiverName || "প্রতিষ্ঠান ব্যয়",
        category: exp.fundNameBn || exp.fundName || "জেনারেল ফান্ড",
        amount: exp.totalExpense || 0,
        date: exp.date || todayStr,
        createdAt: exp.createdAt || exp.date,
        description: exp.description || "",
      })),
    ]
      .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
      .slice(0, 7);

    // ------------------------------------------------------------------------
    // ঙ. ফাইনাল রেসপন্স গঠন
    // ------------------------------------------------------------------------
    return NextResponse.json({
      success: true,
      data: {
        meta: {
          todayStr,
          currentMonthKey,
          currentMonthLabel,
          academicYear: "২০২৬",
        },
        students: {
          totalActiveApproved: activeApprovedCount,
          pendingTotal: pendingStudentsCount + pendingAdmissionsCount,
          pendingStudents: pendingStudentsCount,
          pendingAdmissions: pendingAdmissionsCount,
          classDistribution,
        },
        staffFaculty: {
          totalTeachers: teachersCount,
          totalStaff: staffCount,
          total: totalStaffFaculty,
          attendance: {
            date: todayStr,
            present: todayPresentCount,
            late: todayLateCount,
            absent: todayAbsentCount,
            ratio: `${todayPresentCount}/${totalStaffFaculty}`,
            percentage: attendancePercentage,
          },
          todayRecords:
            teacherAttToday.length > 0
              ? teacherAttToday.slice(0, 6)
              : recentAttendanceList.slice(0, 6),
          isUsingRecentAttendanceFallback: teacherAttToday.length === 0 && recentAttendanceList.length > 0,
        },
        finance: {
          today: {
            income: todayIncome,
            expense: todayExpense,
            net: todayNet,
          },
          month: {
            monthLabel: currentMonthLabel,
            income: monthIncome,
            expense: monthExpense,
            net: monthNet,
          },
          monthlyComparison,
          recentTransactions: mergedTransactions,
          duesTotal: 0,
        },
        academics: {
          activeExam: examsList[0]?.name || "২য় সাময়িক পরীক্ষা",
          examsCount: examsList.length,
          totalMarksPublished: totalMarksCount,
          upcomingRoutineStatus: "রুটিন ও আসন বিন্যাস সক্রিয়",
        },
        notices: noticesList,
      },
    });
  } catch (error) {
    console.error("Dashboard summary API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "ড্যাশবোর্ড সামারি প্রস্তুত করতে সার্ভারে সমস্যা হয়েছে।",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
