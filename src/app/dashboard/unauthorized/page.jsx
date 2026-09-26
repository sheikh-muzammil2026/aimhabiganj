"use client";

import React from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { ShieldAlert, ArrowLeft, Home, LayoutDashboard } from "lucide-react";

export default function UnauthorizedPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const userRole = (user?.role || "user").toLowerCase();

  const getDashboardLink = () => {
    switch (userRole) {
      case "admin":
        return "/dashboard/admin";
      case "teacher":
        return "/dashboard/teacher";
      case "accountant":
        return "/dashboard/accountant";
      case "parent":
        return "/dashboard/parent";
      case "student":
        return "/dashboard/student";
      default:
        return "/";
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "admin":
        return "অ্যাডমিন (Admin)";
      case "teacher":
        return "শিক্ষক (Teacher)";
      case "accountant":
        return "হিসাবরক্ষক (Accountant)";
      case "parent":
        return "অভিভাবক (Parent)";
      case "student":
        return "শিক্ষার্থী (Student)";
      default:
        return role;
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 border border-emerald-900/10 dark:border-emerald-950/40 shadow-xl text-center space-y-6">
        {/* Shield Alert Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/40 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-inner">
          <ShieldAlert className="w-9 h-9 sm:w-11 sm:h-11" />
        </div>

        {/* Heading & Details */}
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300">
            403 • অ্যাক্সেস সংরক্ষিত
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            অননুমোদিত প্রবেশাধিকার
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            দুঃখিত, এই পেজ বা ফিচারটি ব্যবহারের অনুমতি আপনার অ্যাকাউন্টে নেই।
          </p>
        </div>

        {/* Current User Role Notice */}
        {user && (
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-900/30 text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p>
              বর্তমান ব্যবহারকারী: <strong className="text-slate-800 dark:text-slate-100">{user.name || user.email}</strong>
            </p>
            <p>
              বর্তমান ভূমিকা (Role):{" "}
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                {getRoleDisplayName(userRole)}
              </span>
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href={getDashboardLink()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white text-xs sm:text-sm font-semibold shadow-md transition-all"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>আপনার ড্যাশবোর্ডে ফিরে যান</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>মূল ওয়েবসাইট</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
