"use client";

import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register HindSiliguri Bangla Fonts with fallback
try {
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
} catch (e) {
  console.warn("Font registration notice:", e);
}

// English to Bengali digit translator
export const toBanglaNum = (val) => {
  if (val === null || val === undefined) return "";
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(val).replace(/[0-9]/g, (d) => bnDigits[d]);
};

// Formats a number with comma separators in Bengali
export const formatAmountBangla = (num) => {
  if (num === null || num === undefined) return "০";
  const parsed = Number(num) || 0;
  return toBanglaNum(parsed.toLocaleString("en-IN"));
};

const styles = StyleSheet.create({
  page: {
    size: "A4",
    orientation: "landscape",
    backgroundColor: "#F8FAFC",
    padding: 12,
    fontFamily: "HindSiliguri",
    color: "#0F172A",
  },
  splitContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
  },
  halfVoucher: {
    width: "48.8%",
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#C5A059", // Match Admit Card gold border
    padding: 8,
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
  },
  dividerLine: {
    width: "2.4%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  verticalDashedLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "50%",
    borderLeftWidth: 1,
    borderLeftColor: "#94A3B8",
    borderLeftStyle: "dashed",
  },
  scissorBadge: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 3,
    paddingVertical: 4,
    fontSize: 9,
    color: "#64748B",
    textAlign: "center",
  },
  watermark: {
    position: "absolute",
    top: "30%",
    left: "28%",
    width: 170,
    height: 170,
    opacity: 0.05,
    zIndex: -1,
  },
  innerBorder: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 4,
    padding: 6,
    height: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1.5,
    borderBottomColor: "#C5A059",
    paddingBottom: 4,
    marginBottom: 4,
  },
  logoContainer: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 42,
    height: 42,
    objectFit: "contain",
  },
  bannerContainer: {
    flex: 1,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerImage: {
    width: "92%",
    maxHeight: 28,
    objectFit: "contain",
  },
  madrasaTitleFallback: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#064E3B",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 7.5,
    color: "#475569",
    textAlign: "center",
    marginTop: 1,
  },
  headerContact: {
    fontSize: 7,
    color: "#059669",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 1,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 3,
  },
  titleBadge: {
    backgroundColor: "#064E3B",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "#059669",
  },
  titleBadgeText: {
    color: "#FFFFFF",
    fontSize: 8.5,
    fontWeight: "bold",
    textAlign: "center",
  },
  copyBadge: {
    backgroundColor: "#FEF3C7",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#F59E0B",
    paddingHorizontal: 6,
    paddingVertical: 1.5,
  },
  copyBadgeText: {
    color: "#92400E",
    fontSize: 7.5,
    fontWeight: "bold",
  },
  metaGrid: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 4,
    padding: 4,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  metaCol: {
    flexDirection: "row",
    alignItems: "center",
    width: "49%",
  },
  metaLabel: {
    fontSize: 7.5,
    color: "#64748B",
    fontWeight: "bold",
    width: "36%",
  },
  metaValue: {
    fontSize: 8,
    color: "#0F172A",
    fontWeight: "bold",
    flex: 1,
  },
  table: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderBottomWidth: 1,
    borderBottomColor: "#CBD5E1",
    paddingVertical: 3,
    paddingHorizontal: 4,
  },
  tableHeaderCell: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: "#334155",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E2E8F0",
    paddingVertical: 2.5,
    paddingHorizontal: 4,
    alignItems: "center",
  },
  tableCell: {
    fontSize: 7.5,
    color: "#1E293B",
  },
  colSl: { width: "10%", textAlign: "center" },
  colHead: { width: "65%", paddingLeft: 4 },
  colAmount: { width: "25%", textAlign: "right", paddingRight: 4 },
  totalRow: {
    flexDirection: "row",
    backgroundColor: "#ECFDF5",
    borderTopWidth: 1,
    borderTopColor: "#059669",
    paddingVertical: 3,
    paddingHorizontal: 4,
    alignItems: "center",
  },
  totalLabel: {
    width: "75%",
    fontSize: 8,
    fontWeight: "bold",
    color: "#064E3B",
    textAlign: "right",
    paddingRight: 6,
  },
  totalAmount: {
    width: "25%",
    fontSize: 9,
    fontWeight: "bold",
    color: "#064E3B",
    textAlign: "right",
    paddingRight: 4,
  },
  remarksBox: {
    backgroundColor: "#F8FAFC",
    borderWidth: 0.5,
    borderColor: "#CBD5E1",
    borderRadius: 3,
    padding: 3,
    marginBottom: 4,
  },
  remarksText: {
    fontSize: 7,
    color: "#475569",
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 10,
    paddingTop: 14,
  },
  signatureBlock: {
    width: "30%",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#64748B",
    paddingTop: 2,
  },
  signatureTitle: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#334155",
    textAlign: "center",
  },
  signatureSubtitle: {
    fontSize: 5.5,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 0.5,
  },
});

// Single voucher half layout component
function VoucherHalf({ tx, copyType, baseUrl = "" }) {
  const isStudent =
    tx.payerType === "student" ||
    Boolean(tx.studentId) ||
    Boolean(tx.studentName) ||
    (tx.payerName && tx.payerName.includes(" / "));

  // Format student / donor display strings
  let displayName = "N/A";
  let subInfo = "";

  if (isStudent) {
    displayName =
      tx.studentName ||
      (tx.payerName && tx.payerName.includes(" / ")
        ? tx.payerName.split(" / ")[0]
        : tx.payerName) ||
      "N/A";
    const stId =
      tx.studentId ||
      (tx.payerName && tx.payerName.includes(" / ")
        ? tx.payerName.split(" / ")[1]
        : "") ||
      "";
    const cls = tx.className || "";
    subInfo = stId ? `আইডি: ${stId}${cls ? ` (${cls})` : ""}` : cls;
  } else {
    displayName =
      tx.donorName ||
      (tx.payerName && tx.payerName.includes(" / ")
        ? tx.payerName.split(" / ")[0]
        : tx.payerName) ||
      "N/A";
    subInfo = "দাতা / অনুদানকারী";
  }

  const logoUrl = baseUrl ? `${baseUrl}/aimlogo1.png` : "/aimlogo1.png";
  const bannerUrl = baseUrl ? `${baseUrl}/banner.png` : "/banner.png";

  const copyLabel =
    copyType === "office"
      ? "অফিস কপি (Office Copy)"
      : isStudent
        ? "শিক্ষার্থী কপি (Student Copy)"
        : "দাতা কপি (Donor Copy)";

  const items = Array.isArray(tx.items) && tx.items.length > 0 ? tx.items : [];
  const discount = Number(tx.discount) || 0;
  const grandTotal = Number(tx.totalIncome) || 0;
  const originalTotal = grandTotal + discount;

  return (
    <View style={styles.halfVoucher}>
      {/* Background Watermark matching Admit Card */}
      <Image src={logoUrl} style={styles.watermark} alt="Watermark" />

      <View style={styles.innerBorder}>
        {/* Header Section matching Admit Card Branding */}
        <View style={styles.headerRow}>
          {/* Logo on the Left */}
          <View style={styles.logoContainer}>
            <Image src={logoUrl} style={styles.logoImage} alt="Logo Left" />
          </View>

          {/* Banner / Title in the Center */}
          <View style={styles.bannerContainer}>
            <Image src={bannerUrl} style={styles.bannerImage} alt="Madrasah Banner" />
            <Text style={styles.headerSubtitle}>
              হবিগঞ্জ সদর, হবিগঞ্জ | মোবাইল: ০১৭১২-৩৪৫৬৭৮
            </Text>
            <Text style={styles.headerContact}>
              ইমেইল: aimhabiganj@gmail.com
            </Text>
          </View>

          {/* Right Logo placeholder for balanced symmetry */}
          <View style={styles.logoContainer}>
            <Image src={logoUrl} style={styles.logoImage} alt="Logo Right" />
          </View>
        </View>

        {/* Voucher Title and Copy Type Badges */}
        <View style={styles.badgeRow}>
          <View style={styles.titleBadge}>
            <Text style={styles.titleBadgeText}>
              আদায় রসিদ (INCOME VOUCHER)
            </Text>
          </View>
          <View style={styles.copyBadge}>
            <Text style={styles.copyBadgeText}>{copyLabel}</Text>
          </View>
        </View>

        {/* Metadata Grid */}
        <View style={styles.metaGrid}>
          <View style={styles.metaRow}>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>রসিদ নম্বর:</Text>
              <Text style={[styles.metaValue, { color: "#064E3B" }]}>
                {tx.receiptNo || "N/A"}
              </Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>তারিখ:</Text>
              <Text style={styles.metaValue}>
                {toBanglaNum(tx.date || "")}
              </Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>
                {isStudent ? "শিক্ষার্থীর নাম:" : "দাতার নাম:"}
              </Text>
              <Text style={styles.metaValue}>{displayName}</Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>
                {isStudent ? "আইডি/শ্রেণি:" : "বিভাগ/ধরণ:"}
              </Text>
              <Text style={styles.metaValue}>{subInfo || "সাধারণ"}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>পদ্ধতি:</Text>
              <Text style={styles.metaValue}>
                {tx.paymentMethod || "নগদ (Cash)"}
              </Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>হিসাব মাস:</Text>
              <Text style={styles.metaValue}>
                {toBanglaNum(tx.month || "")}
              </Text>
            </View>
          </View>
        </View>

        {/* Particulars Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colSl]}>ক্র.</Text>
            <Text style={[styles.tableHeaderCell, styles.colHead]}>
              আয়ের খাত ও বিবরণ
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colAmount]}>
              পরিমাণ (টাকা)
            </Text>
          </View>

          {items.slice(0, 4).map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.colSl]}>
                {toBanglaNum(index + 1)}
              </Text>
              <Text style={[styles.tableCell, styles.colHead]}>
                {item.head || "সাধারণ আয়"}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.colAmount,
                  { fontWeight: "bold" },
                ]}
              >
                ৳ {formatAmountBangla(item.amount)}
              </Text>
            </View>
          ))}

          {discount > 0 && (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.colSl]}>-</Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.colHead,
                  { color: "#B91C1C", fontWeight: "bold" },
                ]}
              >
                বিশেষ ছাড় / ডিসকাউন্ট
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.colAmount,
                  { color: "#B91C1C", fontWeight: "bold" },
                ]}
              >
                - ৳ {formatAmountBangla(discount)}
              </Text>
            </View>
          )}

          {/* Grand Total Row */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>সর্বমোট আদায়কৃত টাকা:</Text>
            <Text style={styles.totalAmount}>
              ৳ {formatAmountBangla(grandTotal)}
            </Text>
          </View>
        </View>

        {/* Remarks / Description if available */}
        {tx.description ? (
          <View style={styles.remarksBox}>
            <Text style={styles.remarksText}>
              বিবরণ: {tx.description}
            </Text>
          </View>
        ) : null}

        {/* Signature Section */}
        <View style={styles.signatureRow}>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureTitle}>আদায়কারী</Text>
            <Text style={styles.signatureSubtitle}>স্বাক্ষর ও তারিখ</Text>
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureTitle}>হিসাবরক্ষক</Text>
            <Text style={styles.signatureSubtitle}>ক্যাশিয়ার</Text>
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureTitle}>অনুমোদনকারী</Text>
            <Text style={styles.signatureSubtitle}>মুহতামিম / অধ্যক্ষ</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// Full A4 Landscape PDF Document containing two equal halves
export default function IncomeVoucherPdfDocument({ tx, baseUrl = "" }) {
  if (!tx) return null;

  return (
    <Document
      title={`AIM-Income-Voucher-${tx.receiptNo || "Receipt"}`}
      author="Assalam Ideal Madrasah"
      subject="Official Income Receipt"
    >
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.splitContainer}>
          {/* Left Half: Office Copy */}
          <VoucherHalf tx={tx} copyType="office" baseUrl={baseUrl} />

          {/* Vertical Divider Line with Cut Mark ✂ */}
          <View style={styles.dividerLine}>
            <View style={styles.verticalDashedLine} />
            <Text style={styles.scissorBadge}>✂</Text>
          </View>

          {/* Right Half: Donor / Student Copy */}
          <VoucherHalf tx={tx} copyType="client" baseUrl={baseUrl} />
        </View>
      </Page>
    </Document>
  );
}
