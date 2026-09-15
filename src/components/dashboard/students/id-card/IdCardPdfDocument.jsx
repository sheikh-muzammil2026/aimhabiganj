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

// বাংলা ফন্ট রেজিস্ট্রেশন (ঐচ্ছিক কিন্তু সুনির্দিষ্ট রেন্ডারিংয়ের জন্য প্রস্তাবিত)
Font.register({
  family: "HindSiliguri",
  src: "https://fonts.gstatic.com/ea/hindsiliguri/v1/HindSiliguri-Regular.ttf",
});

Font.register({
  family: "HindSiliguriBold",
  src: "https://fonts.gstatic.com/ea/hindsiliguri/v1/HindSiliguri-Bold.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 15,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    backgroundColor: "#FFFFFF",
  },
  cardOuter: {
    width: "2.125in",
    height: "3.375in",
    borderWidth: 5,
    borderColor: "#0022C8",
    padding: 2,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  cardInner: {
    width: "100%",
    height: "100%",
    borderWidth: 1.5,
    borderColor: "#1E40AF",
    borderRadius: 5,
    padding: 4,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerContainer: {
    width: "100%",
    borderBottomWidth: 1.5,
    borderBottomColor: "#0022C8",
    paddingBottom: 2,
    alignItems: "center",
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: "#0022C8",
  },
  nameText: {
    fontSize: 9,
    fontFamily: "HindSiliguriBold",
    color: "#000000",
    textAlign: "center",
    marginBottom: 2,
  },
  infoText: {
    fontSize: 7.5,
    fontFamily: "HindSiliguri",
    color: "#1F2937",
    textAlign: "center",
    marginVertical: 0.5,
  },
  bold: {
    fontFamily: "HindSiliguriBold",
  },
  idTag: {
    fontSize: 8,
    fontFamily: "HindSiliguriBold",
    color: "#0022C8",
    textAlign: "center",
  },
});

export const IdCardPdfDocument = ({ students, getStudentClassDetails }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {students.map((student) => {
          const details = getStudentClassDetails(student);
          const studentPhoto =
            student.studentImage || student.photoUrl || "/default-avatar.png";

          return (
            <View key={student._id} style={styles.cardOuter} wrap={false}>
              <View style={styles.cardInner}>
                {/* হেডার ও লোগো */}
                <View style={styles.headerContainer}>
                  <Image src="/aimlogo1.png" style={styles.logo} />
                </View>

                {/* স্টুডেন্ট ছবি */}
                <Image src={studentPhoto} style={styles.avatar} />

                {/* নাম ও তথ্য */}
                <View style={{ width: "100%", alignItems: "center" }}>
                  <Text style={styles.nameText}>
                    {student.studentNameBangla ||
                      student.studentNameEnglish ||
                      "N/A"}
                  </Text>
                  <Text style={styles.idTag}>
                    আইডি: {student.studentId || "N/A"}
                  </Text>
                  <Text style={styles.infoText}>
                    বিভাগ: {details.divisionName}
                  </Text>
                  <Text style={styles.infoText}>
                    শ্রেণি: {details.className}
                  </Text>
                  <Text style={styles.infoText}>
                    মোবাইল:{" "}
                    {student.fatherMobile || student.guardianMobile || "N/A"}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </Page>
    </Document>
  );
};
