import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register HindSiliguri Bangla Fonts
Font.register({
  family: "HindSiliguri",
  fonts: [
    {
      src: "https://raw.githubusercontent.com/google/fonts/main/ofl/hindsiliguri/HindSiliguri-Regular.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://raw.githubusercontent.com/google/fonts/main/ofl/hindsiliguri/HindSiliguri-Bold.ttf",
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    paddingTop: 24,
    paddingBottom: 28,
    paddingHorizontal: 20,
    fontSize: 7.5,
    fontFamily: "HindSiliguri",
    backgroundColor: "#FFFFFF",
    color: "#1F2937",
  },
  header: {
    alignItems: "center",
    marginBottom: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: "#059669",
    paddingBottom: 6,
  },
  madrasaTitle: {
    fontSize: 14,
    fontFamily: "HindSiliguri",
    fontWeight: "bold",
    color: "#064E3B",
    textAlign: "center",
    marginBottom: 1,
  },
  subTitle: {
    fontSize: 9.5,
    fontFamily: "HindSiliguri",
    fontWeight: "bold",
    color: "#047857",
    textAlign: "center",
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 3,
    fontSize: 7,
    color: "#4B5563",
  },
  classBlock: {
    marginBottom: 6,
  },
  classHeader: {
    backgroundColor: "#ECFDF5",
    borderWidth: 0.8,
    borderColor: "#6EE7B7",
    paddingVertical: 3,
    paddingHorizontal: 6,
    marginTop: 6,
    marginBottom: 2,
    borderRadius: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  classTitle: {
    fontSize: 8.5,
    fontFamily: "HindSiliguri",
    fontWeight: "bold",
    color: "#065F46",
  },
  classCount: {
    fontSize: 7.5,
    fontFamily: "HindSiliguri",
    fontWeight: "bold",
    color: "#047857",
  },
  table: {
    width: "100%",
    borderWidth: 0.5,
    borderColor: "#D1D5DB",
    marginBottom: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderBottomWidth: 0.8,
    borderBottomColor: "#9CA3AF",
    minHeight: 18,
    alignItems: "center",
  },
  tableHeaderCell: {
    fontSize: 7,
    fontFamily: "HindSiliguri",
    fontWeight: "bold",
    color: "#374151",
    paddingVertical: 2,
    paddingHorizontal: 3,
    borderRightWidth: 0.5,
    borderRightColor: "#D1D5DB",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
    minHeight: 18,
    alignItems: "center",
  },
  tableRowEven: {
    backgroundColor: "#F9FAFB",
  },
  tableCell: {
    fontSize: 6.8,
    fontFamily: "HindSiliguri",
    color: "#1F2937",
    paddingVertical: 2,
    paddingHorizontal: 3,
    borderRightWidth: 0.5,
    borderRightColor: "#E5E7EB",
  },
  cellBold: {
    fontFamily: "HindSiliguri",
    fontWeight: "bold",
    color: "#111827",
  },
  cellSecondary: {
    fontSize: 6,
    color: "#6B7280",
  },
  cellPhone: {
    fontSize: 6.5,
    color: "#047857",
    fontFamily: "HindSiliguri",
    fontWeight: "bold",
  },
  colRoll: {
    width: "8%",
    textAlign: "center",
  },
  colStudent: {
    width: "18%",
  },
  colFather: {
    width: "22%",
  },
  colMother: {
    width: "19%",
  },
  colGuardian: {
    width: "16%",
  },
  colAddress: {
    width: "17%",
    borderRightWidth: 0,
  },
  footer: {
    position: "absolute",
    bottom: 10,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderTopColor: "#E5E7EB",
    paddingTop: 3,
    fontSize: 6.5,
    color: "#9CA3AF",
  },
});

export const ParentsPdfDocument = ({
  classGroups = [],
  sessionYear = "সকল শিক্ষাবর্ষ",
  printDate = "",
}) => {
  const formatAddress = (addr) => {
    if (!addr) return "তথ্য নেই";
    const parts = [addr.village, addr.thana, addr.district].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "তথ্য নেই";
  };

  const totalStudents = classGroups.reduce(
    (sum, g) => sum + (g.students?.length || 0),
    0
  );

  return (
    <Document title={`AIM-Parents-Directory-${sessionYear}`} author="As-Salam Ideal Madrasah">
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Document Header */}
        <View style={styles.header} fixed>
          <Text style={styles.madrasaTitle}>আস-সালাম আইডিয়াল মাদরাসা (AIM)</Text>
          <Text style={styles.subTitle}>
            অভিভাবকের তথ্য ও যোগাযোগ ডিরেক্টরি (Parents Information Directory)
          </Text>
          <View style={styles.metaRow}>
            <Text>শিক্ষাবর্ষ: {sessionYear}</Text>
            <Text>মোট শ্রেণি: {classGroups.length} টি | মোট শিক্ষার্থী: {totalStudents} জন</Text>
            <Text>প্রিন্ট তারিখ: {printDate}</Text>
          </View>
        </View>

        {/* Class-wise Content */}
        {classGroups.map((group) => (
          <View key={group.className} style={styles.classBlock} wrap={true}>
            {/* Class Group Banner */}
            <View style={styles.classHeader}>
              <Text style={styles.classTitle}>
                শ্রেণি: {group.className} ({group.divisionName})
              </Text>
              <Text style={styles.classCount}>
                শিক্ষার্থী সংখ্যা: {group.students.length} জন
              </Text>
            </View>

            {/* Structured Table */}
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableHeader} fixed>
                <Text style={[styles.tableHeaderCell, styles.colRoll]}>রোল / আইডি</Text>
                <Text style={[styles.tableHeaderCell, styles.colStudent]}>শিক্ষার্থীর নাম</Text>
                <Text style={[styles.tableHeaderCell, styles.colFather]}>পিতার নাম ও মোবাইল</Text>
                <Text style={[styles.tableHeaderCell, styles.colMother]}>মাতার নাম ও মোবাইল</Text>
                <Text style={[styles.tableHeaderCell, styles.colGuardian]}>জরুরি যোগাযোগ / অভিভাবক</Text>
                <Text style={[styles.tableHeaderCell, styles.colAddress]}>স্থায়ী ঠিকানা</Text>
              </View>

              {/* Table Rows */}
              {group.students.map((student, idx) => (
                <View
                  key={student._id || idx}
                  style={[
                    styles.tableRow,
                    idx % 2 === 1 ? styles.tableRowEven : {},
                  ]}
                  wrap={false}
                >
                  {/* Roll & ID */}
                  <View style={[styles.tableCell, styles.colRoll]}>
                    <Text style={styles.cellBold}>রোল: {student.roll || "—"}</Text>
                    <Text style={styles.cellSecondary}>আইডি: {student.studentId || "—"}</Text>
                  </View>

                  {/* Student Name */}
                  <View style={[styles.tableCell, styles.colStudent]}>
                    <Text style={styles.cellBold}>
                      {student.studentNameBangla || student.studentNameEnglish || "—"}
                    </Text>
                    {student.studentNameEnglish && student.studentNameBangla && (
                      <Text style={styles.cellSecondary}>{student.studentNameEnglish}</Text>
                    )}
                  </View>

                  {/* Father Info */}
                  <View style={[styles.tableCell, styles.colFather]}>
                    <Text style={styles.cellBold}>
                      {student.fatherNameBangla || student.fatherNameEnglish || "তথ্য নেই"}
                    </Text>
                    <Text style={styles.cellSecondary}>
                      পেশা: {student.fatherProfession || "উল্লেখ নেই"}
                    </Text>
                    {student.fatherMobile ? (
                      <Text style={styles.cellPhone}>📞 {student.fatherMobile}</Text>
                    ) : null}
                  </View>

                  {/* Mother Info */}
                  <View style={[styles.tableCell, styles.colMother]}>
                    <Text style={styles.cellBold}>
                      {student.motherNameBangla || student.motherNameEnglish || "তথ্য নেই"}
                    </Text>
                    <Text style={styles.cellSecondary}>
                      পেশা: {student.motherProfession || "গৃহিণী"}
                    </Text>
                    {student.motherMobile ? (
                      <Text style={styles.cellPhone}>📞 {student.motherMobile}</Text>
                    ) : null}
                  </View>

                  {/* Guardian / Emergency Contact */}
                  <View style={[styles.tableCell, styles.colGuardian]}>
                    {student.guardianNameAbsentParents ? (
                      <>
                        <Text style={styles.cellBold}>
                          {student.guardianNameAbsentParents}
                        </Text>
                        <Text style={styles.cellSecondary}>
                          সম্পর্ক: {student.guardianRelation || "অভিভাবক"}
                        </Text>
                        {student.guardianMobile && (
                          <Text style={styles.cellPhone}>📞 {student.guardianMobile}</Text>
                        )}
                      </>
                    ) : student.referenceName ? (
                      <>
                        <Text style={styles.cellBold}>{student.referenceName}</Text>
                        <Text style={styles.cellSecondary}>রেফারেন্স</Text>
                        {student.referenceMobile && (
                          <Text style={styles.cellPhone}>📞 {student.referenceMobile}</Text>
                        )}
                      </>
                    ) : (
                      <Text style={styles.cellSecondary}>পিতা/মাতা স্বয়ং</Text>
                    )}
                  </View>

                  {/* Address */}
                  <View style={[styles.tableCell, styles.colAddress]}>
                    <Text>
                      {formatAddress(student.permanentAddress || student.currentAddress)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Page Footer */}
        <View style={styles.footer} fixed>
          <Text>আস-সালাম আইডিয়াল মাদরাসা • প্রশাসনিক নথি (গোপনীয় ও সংরক্ষিত)</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `পৃষ্ঠা ${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
};

export default ParentsPdfDocument;
