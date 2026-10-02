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

// Register fonts
Font.register({
  family: "HindSiliguri",
  src: "https://fonts.gstatic.com/ea/hindsiliguri/v1/HindSiliguri-Regular.ttf",
});

Font.register({
  family: "HindSiliguriBold",
  src: "https://fonts.gstatic.com/ea/hindsiliguri/v1/HindSiliguri-Bold.ttf",
});

const styles = StyleSheet.create({
  // A4 Landscape Page (Prints multiple cards per sheet)
  a4Page: {
    padding: 20,
    backgroundColor: "#F8FAFC",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  // Single CR80 Card Page (Direct PVC card printers)
  singleCardPage: {
    width: 243,
    height: 153,
    padding: 0,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  // Pair container for Front + Back side by side
  cardPairContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  // Individual Card Boundary
  cardOuter: {
    width: 243,
    height: 153,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    borderWidth: 0.5,
    borderColor: "#CBD5E1",
    position: "relative",
  },

  // ================= FRONT SIDE STYLES =================
  frontHeader: {
    height: 42,
    backgroundColor: "#087F77",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    padding: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImg: {
    width: 28,
    height: 28,
    objectFit: "contain",
  },
  headerTitles: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 4,
  },
  arabicText: {
    fontSize: 7.5,
    color: "#FFFFFF",
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  banglaTitle: {
    fontSize: 6,
    color: "#D1FAE5",
    fontFamily: "HindSiliguriBold",
    textAlign: "center",
    marginTop: 0.5,
  },
  englishPill: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 4,
    paddingVertical: 0.5,
    borderRadius: 4,
    marginTop: 1,
  },
  englishTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#C02626",
    textAlign: "center",
  },
  mottoText: {
    fontSize: 4.8,
    fontFamily: "Helvetica-Oblique",
    color: "#A7F3D0",
    textAlign: "center",
    marginTop: 0.5,
  },

  frontBody: {
    height: 93,
    flexDirection: "row",
    paddingHorizontal: 6,
    paddingTop: 4,
    paddingBottom: 2,
    justifyContent: "space-between",
  },
  photoBox: {
    width: 56,
    height: 68,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#087F77",
    overflow: "hidden",
    backgroundColor: "#F1F5F9",
  },
  teacherImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  infoCol: {
    flex: 1,
    paddingLeft: 6,
    paddingRight: 4,
    justifyContent: "flex-start",
  },
  nameText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#0F172A",
    textTransform: "uppercase",
  },
  infoRows: {
    marginTop: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 1,
  },
  infoLabel: {
    fontSize: 6.2,
    fontFamily: "Helvetica-Bold",
    color: "#087F77",
    width: 48,
  },
  infoColon: {
    fontSize: 6.2,
    fontFamily: "Helvetica-Bold",
    color: "#087F77",
    marginRight: 2,
  },
  infoValue: {
    fontSize: 6.2,
    fontFamily: "Helvetica-Bold",
    color: "#1E293B",
    flex: 1,
  },
  bloodValue: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#DC2626",
  },
  signatureContainer: {
    alignItems: "flex-end",
    marginTop: 1,
  },
  signatureImg: {
    height: 14,
    width: 44,
    objectFit: "contain",
  },
  signatureText: {
    fontSize: 4.8,
    fontFamily: "Helvetica-Bold",
    color: "#087F77",
  },
  badgeVertical: {
    width: 14,
    height: 75,
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: "#087F77",
    overflow: "hidden",
    alignItems: "center",
  },
  badgeTop: {
    width: "100%",
    backgroundColor: "#087F77",
    paddingVertical: 3,
    alignItems: "center",
  },
  badgeTopText: {
    fontSize: 4.5,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  badgeBottom: {
    width: "100%",
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeBottomText: {
    fontSize: 5,
    fontFamily: "Helvetica-Bold",
    color: "#0B2545",
    textAlign: "center",
  },

  frontFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 18,
    backgroundColor: "#087F77",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 6,
  },
  barcodeContainer: {
    height: 13,
    width: 65,
    backgroundColor: "#FFFFFF",
    borderRadius: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 1,
  },
  barcodeSimulation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  barcodeBar: {
    height: 10,
    backgroundColor: "#000000",
  },
  footerBrand: {
    fontSize: 4.5,
    color: "#D1FAE5",
    fontFamily: "Helvetica",
  },

  // ================= BACK SIDE STYLES =================
  backOuter: {
    padding: 3,
  },
  backInner: {
    width: "100%",
    height: "100%",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 6,
    padding: 5,
    alignItems: "center",
    justifyContent: "space-between",
  },
  backNoticeSection: {
    alignItems: "center",
  },
  backNoticeRegular: {
    fontSize: 5.5,
    fontFamily: "Helvetica",
    color: "#1E293B",
    textAlign: "center",
    marginVertical: 0.4,
  },
  backNoticeBold: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    color: "#000000",
    textAlign: "center",
    marginVertical: 0.4,
  },
  backPill: {
    backgroundColor: "#E6F7F5",
    borderWidth: 0.5,
    borderColor: "#0D7E75",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginVertical: 2,
  },
  backPillText: {
    fontSize: 5.8,
    fontFamily: "Helvetica-Bold",
    color: "#DC2626",
    textAlign: "center",
  },
  backOrgSection: {
    alignItems: "center",
  },
  backOrgName: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#000000",
    textAlign: "center",
  },
  backOrgAddr: {
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    color: "#334155",
    textAlign: "center",
    marginTop: 0.5,
  },
  backOrgPhone: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    color: "#000000",
    textAlign: "center",
    marginTop: 0.5,
  },
  backFooter: {
    width: "100%",
    borderTopWidth: 0.5,
    borderTopColor: "#CBD5E1",
    paddingTop: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backFooterItem: {
    fontSize: 4.8,
    fontFamily: "Helvetica-Bold",
    color: "#334155",
  },
});

/**
 * Barcode Simulator Component for PDF
 */
const PdfBarcode = ({ code = "AIM0235" }) => {
  // Generate pseudo barcode bars from string
  const bars = [];
  const hash = code.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  for (let i = 0; i < 28; i++) {
    const isThick = ((hash * (i + 1)) % 7) > 3;
    const isSpacer = ((hash * (i + 3)) % 5) === 0;
    bars.push(
      <View
        key={i}
        style={{
          width: isThick ? 2 : 1,
          height: 10,
          backgroundColor: isSpacer ? "#FFFFFF" : "#000000",
          marginRight: 0.8,
        }}
      />
    );
  }
  return <View style={styles.barcodeSimulation}>{bars}</View>;
};

/**
 * Single Card Front PDF View
 */
export const PdfTeacherFront = ({ teacher = {}, origin = "" }) => {
  const name = teacher.fullName || teacher.name || "Sheikh Muzammil";
  const designation = teacher.designation || "Assistant Teacher";
  const dob = teacher.dateOfBirth || teacher.dob || "13/12/1998";
  const mobile = teacher.phone || teacher.mobile || "01836376174";
  const bloodGroup = teacher.bloodGroup || teacher.blood || "A (-)";
  const idNo = teacher.teacherId || teacher.idNo || "ID NO-AIM 0 235";
  const logoUrl = origin ? `${origin}/aimlogo1.png` : "/aimlogo1.png";
  const sigUrl = origin
    ? `${origin}/principle's_signature.jpg`
    : "/principle's_signature.jpg";
  const photoUrl =
    teacher.profileImage ||
    (origin ? `${origin}/default-avatar.png` : "/default-avatar.png");

  return (
    <View style={styles.cardOuter} wrap={false}>
      {/* Header */}
      <View style={styles.frontHeader}>
        <View style={styles.logoBadge}>
          <Image src={logoUrl} style={styles.logoImg} alt="AIM Logo" />
        </View>
        <View style={styles.headerTitles}>
          <Text style={styles.arabicText}>مدرسة السلام النموذجية</Text>
          <Text style={styles.banglaTitle}>আস-সালাম আইডিয়াল মাদরাসা (এইম)</Text>
          <View style={styles.englishPill}>
            <Text style={styles.englishTitle}>AS-SALAM IDEAL MADRASAH</Text>
          </View>
          <Text style={styles.mottoText}>✦ AIM For Ultimate Success ✦</Text>
        </View>
      </View>

      {/* Body */}
      <View style={styles.frontBody}>
        {/* Photo */}
        <View style={styles.photoBox}>
          <Image src={photoUrl} style={styles.teacherImg} alt={name} />
        </View>

        {/* Info */}
        <View style={styles.infoCol}>
          <Text style={styles.nameText}>{name}</Text>
          <View style={styles.infoRows}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Designation</Text>
              <Text style={styles.infoColon}>:</Text>
              <Text style={styles.infoValue}>{designation}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date of Birth</Text>
              <Text style={styles.infoColon}>:</Text>
              <Text style={styles.infoValue}>{dob}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mobile</Text>
              <Text style={styles.infoColon}>:</Text>
              <Text style={styles.infoValue}>{mobile}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Blood Group</Text>
              <Text style={styles.infoColon}>:</Text>
              <Text style={[styles.infoValue, styles.bloodValue]}>
                {bloodGroup}
              </Text>
            </View>
          </View>

          {/* Signature */}
          <View style={styles.signatureContainer}>
            <Image src={sigUrl} style={styles.signatureImg} alt="Authorized Signature" />
            <Text style={styles.signatureText}>Authorized Signature</Text>
          </View>
        </View>

        {/* Vertical Badge */}
        <View style={styles.badgeVertical}>
          <View style={styles.badgeTop}>
            <Text style={styles.badgeTopText}>ID</Text>
            <Text style={styles.badgeTopText}>Card</Text>
          </View>
          <View style={styles.badgeBottom}>
            <Text style={styles.badgeBottomText}>{idNo.replace("ID NO-", "")}</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.frontFooter}>
        <View style={styles.barcodeContainer}>
          <PdfBarcode code={idNo} />
        </View>
        <Text style={styles.footerBrand}>
          Design & Developed By GreenBangla21
        </Text>
      </View>
    </View>
  );
};

/**
 * Single Card Back PDF View
 */
export const PdfTeacherBack = () => {
  return (
    <View style={[styles.cardOuter, styles.backOuter]} wrap={false}>
      <View style={styles.backInner}>
        {/* Notice Section */}
        <View style={styles.backNoticeSection}>
          <Text style={styles.backNoticeRegular}>
            This card remains the property of
          </Text>
          <Text style={styles.backNoticeBold}>
            As Salam Ideal Madrasah (AIM)
          </Text>
          <Text style={styles.backNoticeBold}>Not Transferable</Text>
          <Text style={styles.backNoticeRegular}>
            This card identifies you as an employee of
          </Text>
          <Text style={styles.backNoticeBold}>
            As Salam Ideal Madrasah (AIM)
          </Text>
          <Text style={styles.backNoticeRegular}>
            You must produce this card on demand. If you leave the job
          </Text>
          <Text style={styles.backNoticeRegular}>
            you must return this card to the office of AIM.
          </Text>
        </View>

        {/* Pill Badge */}
        <View style={styles.backPill}>
          <Text style={styles.backPillText}>
            If found Please Return to the Office of
          </Text>
        </View>

        {/* Org Details */}
        <View style={styles.backOrgSection}>
          <Text style={styles.backOrgName}>AS Salam Ideal Madrasah (AIM)</Text>
          <Text style={styles.backOrgAddr}>Rajnagar (Judge Bari), Habiganj</Text>
          <Text style={styles.backOrgPhone}>
            Please Call : 01316209201 (office)
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.backFooter}>
          <Text style={styles.backFooterItem}>web: aimhabiganj.com</Text>
          <Text style={styles.backFooterItem}>YT: aimhabiganj</Text>
          <Text style={styles.backFooterItem}>FB: aimhabiganj</Text>
          <Text style={styles.backFooterItem}>aimhabiganj@gmail.com</Text>
        </View>
      </View>
    </View>
  );
};

/**
 * Complete PDF Document
 * @param {Array} teachers - list of teacher objects
 * @param {string} mode - "a4" (sheet layout) or "single" (individual card pages)
 * @param {string} printSide - "both", "front", "back"
 */
export default function TeacherIdPdfDocument({
  teachers = [],
  mode = "a4",
  printSide = "both",
  origin = "",
}) {
  if (mode === "single") {
    return (
      <Document>
        {teachers.map((teacher, idx) => (
          <React.Fragment key={teacher._id || idx}>
            {(printSide === "both" || printSide === "front") && (
              <Page size={[243, 153]} style={styles.singleCardPage}>
                <PdfTeacherFront teacher={teacher} origin={origin} />
              </Page>
            )}
            {(printSide === "both" || printSide === "back") && (
              <Page size={[243, 153]} style={styles.singleCardPage}>
                <PdfTeacherBack />
              </Page>
            )}
          </React.Fragment>
        ))}
      </Document>
    );
  }

  // A4 Landscape Sheet layout
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.a4Page}>
        {teachers.map((teacher, idx) => (
          <View key={teacher._id || idx} style={styles.cardPairContainer} wrap={false}>
            {(printSide === "both" || printSide === "front") && (
              <PdfTeacherFront teacher={teacher} origin={origin} />
            )}
            {(printSide === "both" || printSide === "back") && (
              <PdfTeacherBack />
            )}
          </View>
        ))}
      </Page>
    </Document>
  );
}
