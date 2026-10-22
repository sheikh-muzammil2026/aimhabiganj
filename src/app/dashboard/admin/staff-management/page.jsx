"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  Search,
  RefreshCw,
  Plus,
  Trash2,
  Edit3,
  Eye,
  CreditCard,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Building,
  Briefcase,
  DollarSign,
  Shield,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  X,
  Save,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";

const API_BASE =
  process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000";

const DEPARTMENTS = [
  "সকল বিভাগ",
  "সাধারণ প্রশাসন ও অফিস",
  "হিসাব ও অর্থ শাখা",
  "লাইব্রেরি ও বুক ব্যাংক",
  "নিরাপত্তা ও শৃঙ্খলা",
  "খাদ্য ও ডাইনিং",
  "হোস্টেল ও পরিচ্ছন্নতা",
  "চিকিৎসা ও সেবা",
  "অন্যান্য",
];

const DESIGNATIONS = [
  "অফিস সহকারী (Office Assistant)",
  "প্রধান অফিস সহকারী (Head Assistant)",
  "হিসাব কর্মকর্তা (Accountant)",
  "সহকারী হিসাবরক্ষক (Asst. Accountant)",
  "গ্রন্থাগারিক (Librarian)",
  "সহকারী গ্রন্থাগারিক (Asst. Librarian)",
  "নিরাপত্তা প্রহরী (Security Guard)",
  "প্রধান বাবুর্চি (Head Chef)",
  "বাবুর্চি ও ডাইনিং সহকারী (Chef & Dining Assistant)",
  "ড্রাইভার (Madrasah Driver)",
  "পরিচ্ছন্নতাকর্মী (Cleaner / Janitor)",
  "দারোয়ান / কেয়ারটেকার (Caretaker)",
  "অন্যান্য কর্মী (Other Staff)",
];

const BLOOD_GROUPS = ["A (+)", "A (-)", "B (+)", "B (-)", "O (+)", "O (-)", "AB (+)", "AB (-)"];

export default function StaffManagementPage() {
  const [staffList, setStaffList] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState({ present: 0, late: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("সকল বিভাগ");
  const [selectedStatus, setSelectedStatus] = useState("all"); // "all" | "active" | "inactive"

  // Modals state
  const [modalMode, setModalMode] = useState(null); // null | "add" | "edit"
  const [selectedStaffForView, setSelectedStaffForView] = useState(null);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    nameEnglish: "",
    designation: "অফিস সহকারী (Office Assistant)",
    department: "সাধারণ প্রশাসন ও অফিস",
    staffId: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    bloodGroup: "O (+)",
    nid: "",
    emergencyContact: "",
    joiningDate: "",
    employmentType: "ফুল-টাইম (Full-time)",
    workShift: "২ টার্ম (সকাল-রাত)",
    salaryDetails: {
      basicSalary: "",
      houseRent: "",
      medicalAllowance: "",
      otherAllowance: "",
      totalSalary: "",
    },
    address: "",
    addressDetails: {
      village: "",
      postOffice: "",
      thana: "",
      district: "",
    },
    bankAccount: {
      bankName: "",
      accountNumber: "",
      branchName: "",
      routingNumber: "",
      accountType: "সঞ্চয়ী (Savings)",
      mobileBanking: "",
      mobileBankingNumber: "",
    },
    profileImage: "",
    bio: "",
    status: "active",
  });

  // Fetch Staff List from MongoDB
  const fetchStaffData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      const [resStaff, resAttendance] = await Promise.all([
        fetch(`${API_BASE}/api/admin/staff?${params.toString()}`),
        fetch(`${API_BASE}/api/admin/staff-attendance`),
      ]);

      const [resultStaff, resultAttendance] = await Promise.all([
        resStaff.json(),
        resAttendance.json(),
      ]);

      if (resultStaff.success) {
        setStaffList(resultStaff.data || []);
      } else {
        toast.error(resultStaff.message || "স্টাফ তালিকা লোড করতে ব্যর্থ হয়েছে।");
      }

      if (resultAttendance.success && Array.isArray(resultAttendance.data)) {
        const presentCount = resultAttendance.data.filter((a) => Boolean(a.checkInTime)).length;
        const lateCount = resultAttendance.data.filter((a) => a.checkInStatus === "Late").length;
        setAttendanceSummary({
          present: presentCount,
          late: lateCount,
          total: resultAttendance.data.length,
        });
      }
    } catch (err) {
      console.error("Fetch staff data error:", err);
      toast.error("সার্ভারে সংযোগ করা যাচ্ছে না।");
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStaffData();
  }, [fetchStaffData]);

  // Filtered staff list
  const filteredStaffList = useMemo(() => {
    return staffList.filter((s) => {
      const matchDept =
        selectedDepartment === "সকল বিভাগ" ||
        (s.department && s.department.trim() === selectedDepartment.trim());

      const matchStatus =
        selectedStatus === "all" ||
        (selectedStatus === "active" ? s.status !== "inactive" : s.status === "inactive");

      return matchDept && matchStatus;
    });
  }, [staffList, selectedDepartment, selectedStatus]);

  // KPI Calculations
  const totalCount = staffList.length;
  const activeCount = staffList.filter((s) => s.status !== "inactive").length;
  const departmentsCount = new Set(staffList.map((s) => s.department || "সাধারণ প্রশাসন")).size;

  // Open Add Modal
  const handleOpenAddModal = () => {
    setModalMode("add");
    setEditingStaffId(null);
    setFormData({
      fullName: "",
      nameEnglish: "",
      designation: "অফিস সহকারী (Office Assistant)",
      department: "সাধারণ প্রশাসন ও অফিস",
      staffId: `ID NO-AIM ST-${String(staffList.length + 1).padStart(3, "0")}`,
      phone: "",
      email: "",
      dateOfBirth: "",
      bloodGroup: "O (+)",
      nid: "",
      emergencyContact: "",
      joiningDate: new Date().toLocaleDateString("en-GB"),
      employmentType: "ফুল-টাইম (Full-time)",
      workShift: "২ টার্ম (সকাল-রাত)",
      salaryDetails: {
        basicSalary: "",
        houseRent: "",
        medicalAllowance: "",
        otherAllowance: "",
        totalSalary: "",
      },
      address: "",
      addressDetails: {
        village: "",
        postOffice: "",
        thana: "",
        district: "",
      },
      bankAccount: {
        bankName: "",
        accountNumber: "",
        branchName: "",
        routingNumber: "",
        accountType: "সঞ্চয়ী (Savings)",
        mobileBanking: "",
        mobileBankingNumber: "",
      },
      profileImage: "",
      bio: "",
      status: "active",
    });
  };

  // Open Edit Modal
  const handleOpenEditModal = (staff) => {
    setModalMode("edit");
    setEditingStaffId(staff._id || staff.id);
    setFormData({
      fullName: staff.fullName || "",
      nameEnglish: staff.nameEnglish || "",
      designation: staff.designation || "অফিস সহকারী (Office Assistant)",
      department: staff.department || "সাধারণ প্রশাসন ও অফিস",
      staffId: staff.staffId || "",
      phone: staff.phone || "",
      email: staff.email || "",
      dateOfBirth: staff.dateOfBirth || "",
      bloodGroup: staff.bloodGroup || "O (+)",
      nid: staff.nid || "",
      emergencyContact: staff.emergencyContact || "",
      joiningDate: staff.joiningDate || "",
      employmentType: staff.employmentType || "ফুল-টাইম (Full-time)",
      workShift: staff.workShift || "২ টার্ম (সকাল-রাত)",
      salaryDetails: {
        basicSalary: staff.salaryDetails?.basicSalary || "",
        houseRent: staff.salaryDetails?.houseRent || "",
        medicalAllowance: staff.salaryDetails?.medicalAllowance || "",
        otherAllowance: staff.salaryDetails?.otherAllowance || "",
        totalSalary: staff.salaryDetails?.totalSalary || "",
      },
      address: staff.address || "",
      addressDetails: {
        village: staff.addressDetails?.village || "",
        postOffice: staff.addressDetails?.postOffice || "",
        thana: staff.addressDetails?.thana || "",
        district: staff.addressDetails?.district || "",
      },
      bankAccount: {
        bankName: staff.bankAccount?.bankName || "",
        accountNumber: staff.bankAccount?.accountNumber || "",
        branchName: staff.bankAccount?.branchName || "",
        routingNumber: staff.bankAccount?.routingNumber || "",
        accountType: staff.bankAccount?.accountType || "সঞ্চয়ী (Savings)",
        mobileBanking: staff.bankAccount?.mobileBanking || "",
        mobileBankingNumber: staff.bankAccount?.mobileBankingNumber || "",
      },
      profileImage: staff.profileImage || "",
      bio: staff.bio || "",
      status: staff.status || "active",
    });
  };

  // Handle Form Input Change
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => {
      const updatedNested = { ...prev[parent], [field]: value };
      let updatedAddress = prev.address;

      if (parent === "addressDetails") {
        const parts = [
          updatedNested.village,
          updatedNested.postOffice ? `ডাকঘর: ${updatedNested.postOffice}` : "",
          updatedNested.thana,
          updatedNested.district,
        ]
          .map((s) => (s || "").trim())
          .filter(Boolean);
        if (parts.length > 0) updatedAddress = parts.join(", ");
      }

      return {
        ...prev,
        [parent]: updatedNested,
        ...(parent === "addressDetails" ? { address: updatedAddress } : {}),
      };
    });
  };

  // Submit Add or Edit
  const handleSaveModal = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.designation.trim()) {
      toast.error("স্টাফের পূর্ণ নাম ও পদবি আবশ্যক!");
      return;
    }

    try {
      setIsSaving(true);
      if (modalMode === "add") {
        const res = await fetch(`${API_BASE}/api/admin/staff`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const result = await res.json();
        if (!res.ok || !result.success) throw new Error(result.message);
        toast.success("নতুন স্টাফ সফলভাবে যুক্ত হয়েছে! 🎉");
      } else {
        const res = await fetch(`${API_BASE}/api/admin/staff`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingStaffId, ...formData }),
        });
        const result = await res.json();
        if (!res.ok || !result.success) throw new Error(result.message);
        toast.success("স্টাফ তথ্য সফলভাবে আপডেট হয়েছে! 🎉");
      }

      setModalMode(null);
      fetchStaffData();
    } catch (err) {
      toast.error(err.message || "সংরক্ষণে সমস্যা হয়েছে!");
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle Staff Status (Active / Inactive)
  const handleToggleStatus = async (staff) => {
    const nextStatus = staff.status === "inactive" ? "active" : "inactive";
    try {
      const res = await fetch(`${API_BASE}/api/admin/staff`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: staff._id || staff.id, status: nextStatus }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message);
      toast.success(`স্ট্যাটাস '${nextStatus === "active" ? "সক্রিয়" : "নিষ্ক্রিয়"}' করা হয়েছে`);
      fetchStaffData();
    } catch (err) {
      toast.error(err.message || "স্ট্যাটাস পরিবর্তনে সমস্যা হয়েছে");
    }
  };

  // Delete Staff
  const handleDeleteStaff = async (staff) => {
    if (!confirm(`আপনি কি নিশ্চিতভাবে "${staff.fullName}" এর রেকর্ড মুছে ফেলতে চান?`)) return;
    try {
      const id = staff._id || staff.id;
      const res = await fetch(`${API_BASE}/api/admin/staff?id=${id}`, { method: "DELETE" });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message);
      toast.success("স্টাফ সফলভাবে ডিলিট করা হয়েছে!");
      fetchStaffData();
    } catch (err) {
      toast.error(err.message || "ডিলিট করতে সমস্যা হয়েছে!");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans pb-16">
      {/* 1. Header Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-fit border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-300 shadow-xs border border-slate-200/60 dark:border-slate-600">
          <Users className="w-4 h-4 text-teal-600" />
          <span>সকল স্টাফ তালিকা ও ব্যবস্থাপনা</span>
        </span>
        <Link
          href="/dashboard/admin/staff-management/staff-id-card"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-400 hover:bg-white dark:hover:bg-slate-700 transition-all"
        >
          <CreditCard className="w-4 h-4" />
          <span>স্টাফ আইডি কার্ড জেনারেটর</span>
        </Link>
        <Link
          href="/dashboard/admin/staff-management/attendance"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-400 hover:bg-white dark:hover:bg-slate-700 transition-all"
        >
          <UserCheck className="w-4 h-4" />
          <span>স্টাফ হাজিরা রিপোর্ট (২ টার্ম)</span>
        </Link>
      </div>

      {/* 2. Header Banner & Action */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-xs font-semibold text-emerald-200">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>প্রশাসনিক স্টাফ কমান্ড সেন্টার</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            স্টাফ ও কর্মচারী ব্যবস্থাপনা 👥
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            মাদরাসার সকল বিভাগীয় স্টাফ, কর্মচারী ও দায়িত্বশীলদের তালিকা, প্রোফাইল, শিফট ডিউটি ও ডিজিটাল পরিচিতিপত্র নিয়ন্ত্রণ করুন।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ নতুন স্টাফ যুক্ত করুন</span>
          </button>
          <button
            onClick={fetchStaffData}
            disabled={loading}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/10 transition-colors"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* 3. Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              মোট স্টাফ
            </span>
            <span className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold text-sm">
              👥
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            {totalCount} জন
          </p>
          <span className="text-[11px] text-teal-600 font-semibold mt-1 block">
            ডাটাবেজে নিবন্ধিত
          </span>
        </div>

        <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              সক্রিয় কর্মী
            </span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
              ✓
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            {activeCount} জন
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            ডিউটিতে সক্রিয়
          </span>
        </div>

        <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              আজকের উপস্থিতি
            </span>
            <span className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
              ⏰
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-2">
            {attendanceSummary.present} জন
          </p>
          <span className="text-[11px] text-slate-500 font-semibold mt-1 block">
            লেট চেক-ইন: {attendanceSummary.late} জন
          </span>
        </div>

        <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              মোট বিভাগসমূহ
            </span>
            <span className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
              🏢
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 mt-2">
            {departmentsCount} টি
          </p>
          <span className="text-[11px] text-slate-500 font-semibold mt-1 block">
            প্রশাসনিক খাত
          </span>
        </div>
      </div>

      {/* 4. Search & Filter Bar */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="নাম, পদবি, স্টাফ আইডি, ফোন বা ইমেইল দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="all">সকল স্ট্যাটাস</option>
            <option value="active">সক্রিয় (Active)</option>
            <option value="inactive">নিষ্ক্রিয় (Inactive)</option>
          </select>
        </div>
      </div>

      {/* 5. Staff Directory Table */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                <th className="p-4">কর্মকর্তা / কর্মচারী</th>
                <th className="p-4">স্টাফ আইডি</th>
                <th className="p-4">পদবি ও বিভাগ</th>
                <th className="p-4">যোগাযোগ</th>
                <th className="p-4">রক্ত ও যোগদান</th>
                <th className="p-4">স্ট্যাটাস</th>
                <th className="p-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-bold">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-teal-600" />
                    স্টাফদের তালিকা লোড হচ্ছে...
                  </td>
                </tr>
              ) : filteredStaffList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    কোনো স্টাফ খুঁজে পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredStaffList.map((staff) => (
                  <tr
                    key={staff._id || staff.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Name & Photo */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center font-black text-slate-600 dark:text-slate-300 shrink-0 border border-slate-300 dark:border-slate-600">
                          {staff.profileImage ? (
                            <img
                              src={staff.profileImage}
                              alt={staff.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span>{staff.fullName ? staff.fullName.charAt(0) : "স"}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {staff.fullName}
                          </p>
                          {staff.nameEnglish && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {staff.nameEnglish}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Staff ID */}
                    <td className="p-4 font-mono font-bold text-teal-700 dark:text-teal-400 text-xs">
                      {staff.staffId || "N/A"}
                    </td>

                    {/* Designation & Department */}
                    <td className="p-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                        {staff.designation}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 inline-block mt-0.5">
                        {staff.department || "সাধারণ প্রশাসন"}
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="p-4">
                      <p className="font-mono text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{staff.phone || "তথ্য নেই"}</span>
                      </p>
                      {staff.email && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[150px] flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{staff.email}</span>
                        </p>
                      )}
                    </td>

                    {/* Blood Group & Joining Date */}
                    <td className="p-4">
                      <span className="font-black text-rose-600 text-xs block">
                        {staff.bloodGroup || "N/A"}
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {staff.joiningDate || "যোগদান তারিখ নেই"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(staff)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                          staff.status === "inactive"
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400"
                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
                        }`}
                        title="স্ট্যাটাস পরিবর্তন করতে ক্লিক করুন"
                      >
                        {staff.status === "inactive" ? (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>নিষ্ক্রিয়</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>সক্রিয়</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedStaffForView(staff)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                          title="বিস্তারিত প্রোফাইল দেখুন"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleOpenEditModal(staff)}
                          className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300"
                          title="তথ্য সম্পাদনা করুন"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <Link
                          href={`/dashboard/admin/staff-management/staff-id-card`}
                          className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300"
                          title="আইডি কার্ড জেনারেট করুন"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => handleDeleteStaff(staff)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-400"
                          title="স্টাফ ডিলিট করুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. ADD / EDIT STAFF MODAL */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 rounded-xl">
                  {modalMode === "add" ? <Plus className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {modalMode === "add" ? "নতুন স্টাফ যুক্ত করুন" : "স্টাফ তথ্য সম্পাদনা করুন"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    মাদরাসা ডেটাবেজে স্টাফের তথ্য সংরক্ষণ করুন
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalMode(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
              {/* Personal Info */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 border-b border-slate-100 dark:border-slate-800 pb-1">
                  ১. ব্যক্তিগত ও পরিচিতি
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      পূর্ণ নাম (বাংলায়) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="মুহাম্মদ রফিকুল ইসলাম"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="w-full p-2.5 border rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      পূর্ণ নাম (ইংরেজিতে)
                    </label>
                    <input
                      type="text"
                      placeholder="Md. Rafiqul Islam"
                      value={formData.nameEnglish}
                      onChange={(e) => handleInputChange("nameEnglish", e.target.value)}
                      className="w-full p-2.5 border rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      স্টাফ আইডি নম্বর
                    </label>
                    <input
                      type="text"
                      placeholder="ID NO-AIM ST-001"
                      value={formData.staffId}
                      onChange={(e) => handleInputChange("staffId", e.target.value)}
                      className="w-full p-2.5 border rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      পদবি *
                    </label>
                    <select
                      value={formData.designation}
                      onChange={(e) => handleInputChange("designation", e.target.value)}
                      className="w-full p-2.5 border rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                    >
                      {DESIGNATIONS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      বিভাগ / শাখা
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => handleInputChange("department", e.target.value)}
                      className="w-full p-2.5 border rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                    >
                      {DEPARTMENTS.filter((d) => d !== "সকল বিভাগ").map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      মোবাইল নম্বর
                    </label>
                    <input
                      type="tel"
                      placeholder="01712345678"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full p-2.5 border rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      ইমেইল
                    </label>
                    <input
                      type="email"
                      placeholder="staff@aimhabiganj.edu.bd"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full p-2.5 border rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      রক্তের গ্রুপ
                    </label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => handleInputChange("bloodGroup", e.target.value)}
                      className="w-full p-2.5 border rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-bold"
                    >
                      {BLOOD_GROUPS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      যোগদানের তারিখ
                    </label>
                    <input
                      type="text"
                      placeholder="01/01/2023"
                      value={formData.joiningDate}
                      onChange={(e) => handleInputChange("joiningDate", e.target.value)}
                      className="w-full p-2.5 border rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Duty & Shift */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 border-b border-slate-100 dark:border-slate-800 pb-1">
                  ২. শিফট, কর্মসংস্থান ও বেতন
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      কাজের শিফট
                    </label>
                    <select
                      value={formData.workShift}
                      onChange={(e) => handleInputChange("workShift", e.target.value)}
                      className="w-full p-2.5 border rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                    >
                      <option value="২ টার্ম (সকাল-রাত)">২ টার্ম (ভোর ৫:৩০ ও রাত ১০:০০)</option>
                      <option value="দিন শিফট (সকাল ৮টা - বিকাল ৪টা)">দিন শিফট (সকাল ৮টা - বিকাল ৪টা)</option>
                      <option value="নাইট শিফট (রাত ১০টা - সকাল ৬টা)">নাইট শিফট (রাত ১০টা - সকাল ৬টা)</option>
                      <option value="আবাসিক সার্বক্ষণিক">আবাসিক সার্বক্ষণিক</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      মাসিক মূল বেতন (৳)
                    </label>
                    <input
                      type="number"
                      placeholder="১২০০০"
                      value={formData.salaryDetails.basicSalary}
                      onChange={(e) => handleNestedChange("salaryDetails", "basicSalary", e.target.value)}
                      className="w-full p-2.5 border rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      স্ট্যাটাস
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange("status", e.target.value)}
                      className="w-full p-2.5 border rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-bold"
                    >
                      <option value="active">সক্রিয় (Active)</option>
                      <option value="inactive">নিষ্ক্রিয় (Inactive)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 border-b border-slate-100 dark:border-slate-800 pb-1">
                  ৩. ঠিকানা ও ছবি
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      সম্পূর্ণ ঠিকানা
                    </label>
                    <input
                      type="text"
                      placeholder="হবিগঞ্জ সদর, হবিগঞ্জ"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="w-full p-2.5 border rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      ছবি লিংক (Image URL)
                    </label>
                    <input
                      type="url"
                      placeholder="https://i.ibb.co/..."
                      value={formData.profileImage}
                      onChange={(e) => handleInputChange("profileImage", e.target.value)}
                      className="w-full p-2.5 border rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{modalMode === "add" ? "স্টাফ যুক্ত করুন" : "আপডেট করুন"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. VIEW STAFF PROFILE MODAL */}
      {selectedStaffForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 flex items-center justify-center font-black text-lg overflow-hidden border border-teal-300">
                  {selectedStaffForView.profileImage ? (
                    <img
                      src={selectedStaffForView.profileImage}
                      alt={selectedStaffForView.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{selectedStaffForView.fullName.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {selectedStaffForView.fullName}
                  </h3>
                  <p className="text-xs text-teal-700 dark:text-teal-400 font-semibold">
                    {selectedStaffForView.designation} • {selectedStaffForView.department}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStaffForView(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 font-bold block uppercase text-[10px]">স্টাফ আইডি</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedStaffForView.staffId || "N/A"}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 font-bold block uppercase text-[10px]">মোবাইল</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedStaffForView.phone || "N/A"}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 font-bold block uppercase text-[10px]">রক্তের গ্রুপ</span>
                <span className="font-black text-rose-600">{selectedStaffForView.bloodGroup || "N/A"}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 font-bold block uppercase text-[10px]">যোগদান তারিখ</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedStaffForView.joiningDate || "N/A"}</span>
              </div>
              <div className="col-span-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 font-bold block uppercase text-[10px]">ঠিকানা</span>
                <span className="text-slate-800 dark:text-slate-200">{selectedStaffForView.address || "ঠিকানা সংরক্ষিত নেই"}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 font-bold block uppercase text-[10px]">শিফট</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">{selectedStaffForView.workShift || "২ টার্ম (সকাল-রাত)"}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 font-bold block uppercase text-[10px]">বেতন কাঠামো</span>
                <span className="font-mono font-bold text-teal-700 dark:text-teal-400">
                  {selectedStaffForView.salaryDetails?.totalSalary ? `৳ ${selectedStaffForView.salaryDetails.totalSalary}` : "অনুল্লেখিত"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                href="/dashboard/admin/staff-management/staff-id-card"
                className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>আইডি কার্ড জেনারেটর</span>
              </Link>
              <button
                onClick={() => setSelectedStaffForView(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
