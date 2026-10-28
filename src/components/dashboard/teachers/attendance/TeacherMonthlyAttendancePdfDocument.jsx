"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register HindSiliguri Bangla Fonts from local public/fonts directory
try {
  Font.register({
    family: "HindSiliguri",
    fonts: [
      {
        src: "/fonts/HindSiliguri-Regular.ttf",
        fontWeight: "normal",
      },
      {
        src: "/fonts/HindSiliguri-Bold.ttf",
        fontWeight: "bold",
      },
    ],
  });
} catch (e) {
  console.warn("Font registration notice:", e);
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 24,
    fontSize: 8,
    fontFamily: "HindSiliguri",
    backgroundColor: "#FFFFFF",
    color: "#111827",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  contentWrapper: {
    flex: 1,
  },
  // Header with Logo + /banner_routine.png side by side
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 0, // gap-0
    marginBottom: 8, // mb-2 (2 * 4 = 8)
    paddingBottom: 4, // pb-1 (1 * 4 = 4)
    paddingLeft: 8, // pl-2 (2 * 4 = 8)
    borderBottomWidth: 4, // border-b-4 (4px)
    borderBottomColor: "#1F2937", // border-gray-800
    width: "100%",
  },
  logoWrapper: {
    width: 80, // w-20 (20 * 4 = 80)
    height: 80, // h-20 (20 * 4 = 80)
    borderRadius: 40, // rounded-full (80 / 2 = 40)
    overflow: "hidden", // overflow-hidden
    alignItems: "center", // flex items-center
    justifyContent: "center", // justify-center
    marginRight: -12, // -mr-3 (-3 * 4 = -12)
    flexShrink: 0, // flex-shrink-0
  },
  logoImage: {
    width: 84, // scale-[1.05] (80 * 1.05 = 84)
    height: 84,
    objectFit: "cover", // object-cover
  },
  bannerWrapper: {
    flex: 1, // flex-grow
    alignItems: "center",
    justifyContent: "center",
  },
  bannerImage: {
    width: "95%", // w-full
    maxHeight: 100, // max-h-45 / print:max-h-45 (45 * 4 = 180)
    objectFit: "fill", // object-fill
  },
  // Report Title Block
  titleSection: {
    alignItems: "center",
    marginBottom: 8,
  },
  reportSubTitle: {
    fontSize: 9.5,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 1,
  },
  monthTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
    marginBottom: 2,
  },
  metaStatsText: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: "#4B5563",
    textAlign: "center",
  },
  // Table Matrix
  table: {
    width: "100%",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: "#1F2937",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderBottomWidth: 1,
    borderBottomColor: "#1F2937",
    minHeight: 22,
    alignItems: "stretch",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#1F2937",
    minHeight: 20,
    alignItems: "stretch",
  },
  tableRowEven: {
    backgroundColor: "#F9FAFB",
  },
  cell: {
    borderRightWidth: 1,
    borderRightColor: "#1F2937",
    paddingVertical: 3,
    paddingHorizontal: 4,
    justifyContent: "center",
  },
  headerText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
  },
  headerTextLeft: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "left",
  },
  cellTextCenter: {
    fontSize: 8,
    color: "#111827",
    textAlign: "center",
  },
  cellTextLeft: {
    fontSize: 8,
    color: "#111827",
    textAlign: "left",
  },
  cellTextBoldLeft: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "left",
  },
  // Column Widths (Total = 100%)
  colSerial: { width: "4%" },
  colName: { width: "17%" },
  colDesignation: { width: "13%" },
  colPresent: { width: "8%" },
  colOnTime: { width: "7%" },
  colLate: { width: "8%" },
  colEarly: { width: "8%" },
  colAbsent: { width: "8%" },
  colRate: { width: "7%" },
  colComments: { width: "20%" },
  // Status Specific Text Colors
  textPresent: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#065F46",
    textAlign: "center",
  },
  textOnTime: {
    fontSize: 8,
    color: "#047857",
    textAlign: "center",
  },
  textLate: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#BE123C",
    textAlign: "center",
  },
  textEarly: {
    fontSize: 8,
    color: "#B45309",
    textAlign: "center",
  },
  textAbsent: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#DC2626",
    textAlign: "center",
  },
  textRate: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
  },
  commentItem: {
    fontSize: 7,
    color: "#4B5563",
    marginBottom: 1,
  },
  commentLateTag: {
    fontWeight: "bold",
    color: "#BE123C",
  },
  commentEarlyTag: {
    fontWeight: "bold",
    color: "#B45309",
  },
  // Principal Signature Footer
  footerContainer: {
    marginTop: 24, // print:mt-6 (6 * 4 = 24pt)
    paddingRight: 8, // print:px-2 (2 * 4 = 8pt)
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  signatureBlock: {
    width: 144, // w-36 (36 * 4 = 144)
    alignItems: "center",
  },
  signatureImageWrapper: {
    width: 144, // w-36
    height: 24, // h-6 (6 * 4 = 24)
    justifyContent: "flex-end",
    alignItems: "center",
    position: "relative",
  },
  signatureImage: {
    width: 56, // w-14 (14 * 4 = 56)
    height: 28, // h-7 (7 * 4 = 28)
    objectFit: "contain",
    transform: "rotate(-45deg)", // -rotate-45
  },
  signatureLine: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#1F2937", // border-gray-800
    marginBottom: 4, // mb-1 (1 * 4 = 4)
  },
  signatureLabel: {
    fontSize: 12, // text-xs (12px)
    fontWeight: "bold",
    color: "#111827", // text-gray-900
    textAlign: "center",
  },
});

const toBengaliNumber = (num) => {
  if (num === null || num === undefined) return "";
  const banglaDigits = {
    0: "০",
    1: "১",
    2: "২",
    3: "৩",
    4: "৪",
    5: "৫",
    6: "৬",
    7: "৭",
    8: "৮",
    9: "৯",
  };
  return String(num).replace(/[0-9]/g, (digit) => banglaDigits[digit]);
};

export default function TeacherMonthlyAttendancePdfDocument({
  monthlyData,
  formattedMonth = "",
  selectedMonth = "",
  origin = "",
}) {
  const logoUrl = origin ? `${origin}/aimlogo1.png` : "/aimlogo1.png";
  const bannerUrl = origin
    ? `${origin}/banner_routine.png`
    : "/banner_routine.png";
  const signatureUrl = origin
    ? `${origin}/principle's_signature.jpg`
    : "/principle's_signature.jpg";

  const teachersSummary = monthlyData?.teachersSummary || [];

  return (
    <Document
      title={`Teachers-Monthly-Attendance-${selectedMonth || "Report"}`}
      author="As-Salam Ideal Madrasah"
      subject="Monthly Teacher Attendance Report"
    >
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.contentWrapper}>
          {/* Header with Logo and /banner_routine.png */}
          <View style={styles.headerContainer}>
            <View style={styles.logoWrapper}>
              <Image
                src={logoUrl}
                style={styles.logoImage}
                alt="Institution Logo"
              />
            </View>
            <View style={styles.bannerWrapper}>
              <Image
                src={bannerUrl}
                style={styles.bannerImage}
                alt="Institution Banner"
              />
            </View>
          </View>

          {/* Report Title & Summary Metadata */}
          <View style={styles.titleSection}>
            <Text style={styles.reportSubTitle}>
              শিক্ষককদের মাসিক উপস্থিতি রিপোর্ট
            </Text>
            <Text style={styles.monthTitle}>{formattedMonth}</Text>
            <Text style={styles.metaStatsText}>
              মোট কার্যদিবস:{" "}
              {toBengaliNumber(monthlyData?.totalWorkingDays ?? 0)} দিন | মোট
              শিক্ষক: {toBengaliNumber(monthlyData?.totalTeachers ?? 0)} জন
            </Text>
          </View>

          {/* Attendance Table Matrix */}
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeaderRow} fixed>
              <View style={[styles.cell, styles.colSerial]}>
                <Text style={styles.headerText}>ক্র.</Text>
              </View>
              <View style={[styles.cell, styles.colName]}>
                <Text style={styles.headerTextLeft}>শিক্ষক আইডি</Text>
              </View>
              <View style={[styles.cell, styles.colDesignation]}>
                <Text style={styles.headerTextLeft}>পদবি</Text>
              </View>
              <View style={[styles.cell, styles.colPresent]}>
                <Text style={styles.headerText}>উপস্থিত</Text>
              </View>
              <View style={[styles.cell, styles.colOnTime]}>
                <Text style={styles.headerText}>সময়মতো</Text>
              </View>
              <View style={[styles.cell, styles.colLate]}>
                <Text style={styles.headerText}>দেরিতে</Text>
              </View>
              <View style={[styles.cell, styles.colEarly]}>
                <Text style={styles.headerText}>পূর্বে প্রস্থান</Text>
              </View>
              <View style={[styles.cell, styles.colAbsent]}>
                <Text style={styles.headerText}>অনুপস্থিত</Text>
              </View>
              <View style={[styles.cell, styles.colRate]}>
                <Text style={styles.headerText}>শতকরা হার</Text>
              </View>
              <View style={[styles.cell, styles.colComments]}>
                <Text style={styles.headerTextLeft}>
                  দেরি/পূর্বে প্রস্থানের কারণসমূহ
                </Text>
              </View>
            </View>

            {/* Table Body Rows */}
            {teachersSummary.map((teacher, index) => {
              const hasComments =
                teacher.lateComments?.length > 0 ||
                teacher.earlyComments?.length > 0;

              return (
                <View
                  key={teacher.teacherId || index}
                  style={[
                    styles.tableRow,
                    index % 2 === 1 ? styles.tableRowEven : {},
                  ]}
                  wrap={false}
                >
                  <View style={[styles.cell, styles.colSerial]}>
                    <Text style={styles.cellTextCenter}>
                      {toBengaliNumber(index + 1)}
                    </Text>
                  </View>

                  <View style={[styles.cell, styles.colName]}>
                    <Text style={styles.cellTextBoldLeft}>
                      {teacher.teacherId || "আইডি নেই"}
                    </Text>
                  </View>

                  <View style={[styles.cell, styles.colDesignation]}>
                    <Text style={styles.cellTextLeft}>
                      {teacher.designation || "—"}
                    </Text>
                  </View>

                  <View style={[styles.cell, styles.colPresent]}>
                    <Text style={styles.textPresent}>
                      {toBengaliNumber(teacher.presentDays ?? 0)} দিন
                    </Text>
                  </View>

                  <View style={[styles.cell, styles.colOnTime]}>
                    <Text style={styles.textOnTime}>
                      {toBengaliNumber(teacher.onTimeDays ?? 0)}
                    </Text>
                  </View>

                  <View style={[styles.cell, styles.colLate]}>
                    <Text style={styles.textLate}>
                      {toBengaliNumber(teacher.lateDays ?? 0)}
                    </Text>
                  </View>

                  <View style={[styles.cell, styles.colEarly]}>
                    <Text style={styles.textEarly}>
                      {toBengaliNumber(teacher.earlyExitDays ?? 0)}
                    </Text>
                  </View>

                  <View style={[styles.cell, styles.colAbsent]}>
                    <Text style={styles.textAbsent}>
                      {toBengaliNumber(teacher.absentDays ?? 0)} দিন
                    </Text>
                  </View>

                  <View style={[styles.cell, styles.colRate]}>
                    <Text style={styles.textRate}>
                      {toBengaliNumber(teacher.attendanceRate ?? 0)}%
                    </Text>
                  </View>

                  <View style={[styles.cell, styles.colComments]}>
                    {hasComments ? (
                      <View>
                        {teacher.lateComments?.map((c, i) => (
                          <Text key={`l-${i}`} style={styles.commentItem}>
                            <Text style={styles.commentLateTag}>
                              [{c.date ? toBengaliNumber(c.date.slice(8)) : ""}{" "}
                              তারিখ]:{" "}
                            </Text>
                            {c.comment}
                          </Text>
                        ))}
                        {teacher.earlyComments?.map((c, i) => (
                          <Text key={`e-${i}`} style={styles.commentItem}>
                            <Text style={styles.commentEarlyTag}>
                              [{c.date ? toBengaliNumber(c.date.slice(8)) : ""}{" "}
                              তারিখ (আর্লি)]:{" "}
                            </Text>
                            {c.comment}
                          </Text>
                        ))}
                      </View>
                    ) : (
                      <Text style={styles.cellTextLeft}>—</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Principal Signature Footer */}
        <View style={styles.footerContainer} wrap={false}>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureImageWrapper}>
              <Image
                src={"/principle's_signature.jpg"}
                style={styles.signatureImage}
                alt="Principal Signature"
              />
            </View>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>প্রিন্সিপাল</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
