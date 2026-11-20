/**
 * ==============================================================================
 * CENTRALIZED INSTITUTIONAL CONFIGURATION & WHITE-LABEL BRANDING
 * ==============================================================================
 * Developed by: MTM Tech BD (https://mtmtechbd.com)
 *
 * HOW TO REBRAND FOR A NEW CLIENT IN 2 MINUTES:
 * 1. Update this file (`src/config/siteConfig.js`) with the new client's name,
 *    contact numbers, email, addresses, session year, and logo paths.
 * 2. Update `src/app/globals.css` with the client's brand primary/accent colors.
 *
 * All public pages, navbar, footer, printable documents (admit cards, results,
 * fee vouchers), and SEO metadata dynamically read from this central configuration.
 * ==============================================================================
 */

export const siteConfig = {
  // ---------------------------------------------------------------------------
  // 1. INSTITUTION IDENTITY (Multilingual: Bengali, English, Arabic)
  // ---------------------------------------------------------------------------
  name: {
    bn: "আস-সালাম আইডিয়াল মাদরাসা",
    en: "As-Salam Ideal Madrasah",
    ar: "مدرسة السلام النموذجية",
    short: "AIM",
    fullBn: "আস-সালাম আইডিয়াল মাদরাসা (এইম), হবিগঞ্জ",
    fullEn: "As-Salam Ideal Madrasah (AIM), Habiganj",
    fullAr: "مدرسة السلام النموذجية، حبيغنج",
  },

  slogan: {
    bn: "দ্বীনি ও আধুনিক শিক্ষার এক অপূর্ব সমন্বয়",
    en: "Aim for Ultimate Success",
    ar: "الجمع بين الأصالة الشرعية والتميز الأكاديمي",
    taglineBn: "জ্ঞানের আলোয় আলোকিত হোক আগামী প্রজন্ম",
    taglineEn: "Illuminating the Next Generation with Sacred & Modern Knowledge",
  },

  description: {
    bn: "দ্বীনি ও আধুনিক শিক্ষার এক অপূর্ব সমন্বয়। অভিজ্ঞ উলামায়ে কেরাম ও দক্ষ শিক্ষকমণ্ডলী দ্বারা পরিচালিত হবিগঞ্জের একটি নির্ভরযোগ্য ও যুগোপযোগী দ্বীনি শিক্ষা প্রতিষ্ঠান।",
    en: "A distinguished blend of authentic Islamic scholarship and modern education. Managed by experienced Ulama and dedicated faculty in Habiganj.",
    ar: "منظومة تعليمية رائدة تجمع بين الأصالة الشرعية والتميز الأكاديمي الحديث تحت إشراف نخبة من العلماء والأساتذة المتخصصين في حبيغنج.",
  },

  establishedYear: {
    bn: "২০১৮",
    en: "2018",
    displayBn: "২০১৮ খ্রিষ্টাব্দ",
    displayEn: "Est. 2018",
  },

  eiin: "139000",
  registrationNo: {
    bn: "রেজি নং: ১২৩৪৫৬",
    en: "Reg No: 123456",
  },

  academicSession: {
    currentBn: "২০২৬",
    currentEn: "2026",
    upcomingBn: "২০২৭",
    upcomingEn: "2027",
  },

  // ---------------------------------------------------------------------------
  // 2. BRANDING & MEDIA ASSETS
  // ---------------------------------------------------------------------------
  assets: {
    logo: "/aimlogo1.png",
    favicon: "/favicon.ico",
    banner: "/banner.png",
    bannerRoutine: "/banner_routine.png",
    bannerWithLogo: "/bannerWithLogo.jpeg",
    principalSignature: "/principle's_signature.jpg",
    controllerSignature: "/anarul.png",
    sealImage: "/aimlogo1.png",
  },

  heroSlides: [
    {
      image: "/slider/slide1.jpg",
      titleBn: "দ্বীনি শিক্ষার এক অনন্য নির্ভরযোগ্য প্রতিষ্ঠান",
      titleEn: "A Trusted Sanctuary for Authentic Islamic Education",
      titleAr: "صرح تعليمي رائد وموثوق للتعليم الشرعي والأكاديمي",
      subtitleBn: "জ্ঞানের আলোয় আলোকিত হোক আগামী প্রজন্ম",
      subtitleEn: "Illuminating the Future Generation with Knowledge and Ethics",
      subtitleAr: "نبني أجيالاً متفوقة بالعلم والإيمان والأخلاق",
    },
    {
      image: "/slider/slide2.jpg",
      titleBn: "আধুনিক ও সুশৃঙ্খল আবাসন ব্যবস্থা",
      titleEn: "Modern & Disciplined Residential Hostel Facilities",
      titleAr: "سكن داخلي متميز وبيئة تربوية راقية",
      subtitleBn: "ছাত্রদের মননশীল ও নৈতিক বিকাশে আমরা অঙ্গীকারাবদ্ধ",
      subtitleEn: "Committed to Spiritual Character and Academic Excellence",
      subtitleAr: "ملتزمون بغرس السلوك القويم والتميز المستمر",
    },
    {
      image: "/slider/slide3.jpg",
      titleBn: "হিফজ ও একাডেমিক শিক্ষার চমৎকার সমন্বয়",
      titleEn: "Seamless Integration of Hifzul Quran & Modern Academics",
      titleAr: "تكامل فريد بين تحفيظ القرآن الكريم والتعليم الحديث",
      subtitleBn: "অভিজ্ঞ উলামা ও দক্ষ শিক্ষক মণ্ডলী দ্বারা পরিচালিত",
      subtitleEn: "Guided by Master Huffaz and Experienced Academic Faculty",
      subtitleAr: "تحت إشراف نخبة من الحفاظ والقراء والأساتذة المتخصصين",
    },
  ],

  // ---------------------------------------------------------------------------
  // 3. CONTACT & LOCATION INFO
  // ---------------------------------------------------------------------------
  contacts: {
    phone: ["01316-209201", "01748-868161"],
    phoneBn: ["০১৩১৬-২০৯২০১", "০১৭৪৮-৮৬৮১৬১"],
    primaryPhone: "01748-868161",
    primaryPhoneBn: "০১৭৪৮-৮৬৮১৬১",
    whatsapp: "01748-868161",
    whatsappRaw: "8801748868161",
    whatsappBn: "০১৭৪৮-৮৬৮১৬১",
    email: "aimhabiganj@gmail.com",
    website: "https://aimhabiganj.com",
    domain: "aimhabiganj.com",
  },

  address: {
    bn: "দক্ষিণ শ্যামলী, হবিগঞ্জ সদর, হবিগঞ্জ, সিলেট, বাংলাদেশ।",
    en: "Dakshin Shyamoli, Habiganj Sadar, Habiganj, Sylhet, Bangladesh.",
    ar: "داكشين شامولي، حبيغنج صدر، حبيغنج، سيلهت، بنغلاديش.",
    district: "হবিগঞ্জ",
    division: "সিলেট",
    country: "বাংলাদেশ",
    countryEn: "Bangladesh",
  },

  officeHours: {
    bn: "শনিবার - বৃহস্পতিবার: সকাল ৮:০০ - বিকাল ৫:০০ (শুক্রবার বন্ধ)",
    en: "Saturday - Thursday: 8:00 AM - 5:00 PM (Friday Closed)",
    ar: "السبت - الخميس: ٨:٠٠ ص - ٥:٠٠ م (الجمعة عطلة)",
  },

  googleMapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.749444583196!2d91.416805!3d24.380722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDIyJzUwLjYiTiA5McKwMjUnMDAuNSJF!5e0!3m2!1sen!2sbd!4v1620000000000!5m2!1sen!2sbd",

  // ---------------------------------------------------------------------------
  // 4. SOCIAL MEDIA & DEVELOPER CREDIT
  // ---------------------------------------------------------------------------
  socials: {
    facebook: "https://www.facebook.com/p/AIM-Habiganj-100062973924471/",
    facebookHandle: "aimhabiganj",
    youtube: "http://www.youtube.com/@aimhabiganj",
    youtubeHandle: "@aimhabiganj",
    whatsapp: "https://wa.me/8801748868161",
  },

  developer: {
    name: "MTM Tech BD",
    shortName: "MTM Tech",
    url: "https://mtmtechbd.com",
    creditText: {
      bn: "কারিগরি সহযোগিতায় MTM Tech BD",
      en: "Developed by MTM Tech BD",
      ar: "تطوير بواسطة MTM Tech BD",
    },
  },

  // ---------------------------------------------------------------------------
  // 5. ADMISSION CONFIGURATION & NOTICES
  // ---------------------------------------------------------------------------
  admissionConfig: {
    isOpen: true,
    academicYearBn: "২০২৭",
    academicYearEn: "2027",
    formRoute: "/admission/form",
    badgeText: {
      bn: "নতুন শিক্ষাবর্ষে ভর্তি চলছে",
      en: "Admissions Open for New Session",
      ar: "باب القبول والتسجيل مفتوح",
    },
    urgentNoticeBn:
      "📢 আস-সালাম আইডিয়াল মাদরাসা (এইম)-এ নতুন শিক্ষাবর্ষে নূরানী, নাজেরা, হিফজ ও একাডেমিক বিভাগে ভর্তি চলছে! আসন সংখ্যা সীমিত।",
    urgentNoticeEn:
      "📢 Admissions are now open for Noorani, Nazera, Hifz, and Academic sections at As-Salam Ideal Madrasah! Limited seats available.",
  },

  // ---------------------------------------------------------------------------
  // 6. PRINT ROLES & SIGNATURE LABELS
  // ---------------------------------------------------------------------------
  roles: {
    principal: "প্রিন্সিপাল",
    controller: "পরীক্ষা নিয়ন্ত্রক",
    preparer: "প্রস্তুতকারী / অফিস সহকারী",
    guardian: "অভিভাবকের স্বাক্ষর",
  },
};

/**
 * Localized helper function to retrieve translated field cleanly
 * @param {Object} fieldObject - e.g. siteConfig.name
 * @param {string} lang - 'bn' | 'en' | 'ar'
 * @param {string} fallback - 'bn'
 * @returns {string}
 */
export function getSiteText(fieldObject, lang = "bn", fallback = "bn") {
  if (!fieldObject) return "";
  if (typeof fieldObject === "string") return fieldObject;
  return fieldObject[lang] || fieldObject[fallback] || fieldObject.bn || "";
}

export default siteConfig;
