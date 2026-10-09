"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { Eye, EyeOff, X } from "lucide-react";

export default function LoginPage({ onClose }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // If already logged in, redirect to the appropriate dashboard
  useEffect(() => {
    if (!isPending && session?.user) {
      const userRole = (session.user.role || "student").toLowerCase();
      const target =
        userRole === "admin"
          ? "/dashboard/admin"
          : userRole === "teacher"
          ? "/dashboard/teacher"
          : userRole === "accountant"
          ? "/dashboard/accountant"
          : userRole === "parent"
          ? "/dashboard/parent"
          : "/dashboard/student";
      router.replace(target);
    }
  }, [session, isPending, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const { data, error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (data && !error) {
        toast.success("স্বাগতম! লগইন সফল হয়েছে।");

        const userRole = (data?.user?.role || "student").toLowerCase();

        // 1. Check for callbackUrl query parameter
        let callbackUrl = null;
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          callbackUrl = params.get("callbackUrl");
        }

        let targetUrl = null;
        if (
          callbackUrl &&
          callbackUrl.startsWith("/") &&
          !callbackUrl.startsWith("//") &&
          !callbackUrl.startsWith("/login")
        ) {
          if (callbackUrl.startsWith("/dashboard")) {
            if (
              userRole === "admin" ||
              callbackUrl.startsWith(`/dashboard/${userRole}`) ||
              callbackUrl.startsWith("/dashboard/profile-settings") ||
              callbackUrl.startsWith("/dashboard/shared")
            ) {
              targetUrl = callbackUrl;
            }
          } else {
            targetUrl = callbackUrl;
          }
        }

        if (!targetUrl) {
          if (userRole === "admin") {
            targetUrl = "/dashboard/admin";
          } else if (userRole === "teacher") {
            targetUrl = "/dashboard/teacher";
          } else if (userRole === "accountant") {
            targetUrl = "/dashboard/accountant";
          } else if (userRole === "parent") {
            targetUrl = "/dashboard/parent";
          } else if (userRole === "student") {
            targetUrl = "/dashboard/student";
          } else {
            targetUrl = "/dashboard";
          }
        }

        // 2. Broadcast auth sync event across tabs and components (like sidebar)
        try {
          const channel = new BroadcastChannel("aim-auth-sync");
          channel.postMessage({ type: "ROLE_UPDATED" });
          channel.close();
        } catch (_) {}
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("aim-auth-sync"));
        }

        // 3. Ensure session cache is synced before navigating
        if (typeof authClient.getSession === "function") {
          try {
            await authClient.getSession();
          } catch (_) {}
        }

        // 4. Navigate to target dashboard and refresh router cache
        router.refresh();
        router.push(targetUrl);
        return;
      }

      if (error) {
        toast.error(
          error.message || "ভুল ইমেইল বা পাসওয়ার্ড। আবার চেষ্টা করুন।",
        );
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Authentication lifecycle crash:", err);
      toast.error("লগইন করার সময় একটি অপ্রত্যাশিত সমস্যা হয়েছে।");
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center md:bg-cover lg:bg-[length:100%_100%] bg-no-repeat bg-center transition-colors duration-200 px-4 py-12 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url('/loginBackground.png')` }}
    >
      <div className="relative max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-xl shadow-xl border border-gray-100 dark:border-slate-800">
        {/* হোম / ক্লোজ বাটন */}
        <Link
          href="/"
          onClick={() => {
            if (typeof onClose === "function") onClose();
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
          title="হোম পেজে ফিরে যান"
          aria-label="হোম পেজে ফিরে যান"
        >
          <X className="w-5 h-5" />
        </Link>

        {/* হেডার ও লোগো */}
        <div className="text-center">
          <Link
            href="/"
            onClick={() => {
              if (typeof onClose === "function") onClose();
            }}
            className="inline-block group focus:outline-none"
            title="হোম পেজে ফিরে যান"
          >
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-white dark:bg-slate-800 shadow-md border-2 border-emerald-700 dark:border-amber-400 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 group-hover:shadow-lg">
              <Image
                src="/aimlogo1.png"
                alt="As-Salam Ideal Madrasah (AIM) Logo"
                width={72}
                height={72}
                className="object-contain rounded-full"
                priority
              />
            </div>
          </Link>
          <h2 className="mt-4 text-2xl font-extrabold text-gray-900 dark:text-amber-400">
            অ্যাকাউন্টে লগইন করুন
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            আস-সালাম আইডিয়াল মাদরাসা (এইম) ম্যানেজমেন্ট সিস্টেম
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-4">
            {/* ইমেইল ইনপুট */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                ইমেইল ঠিকানা
              </label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="example@domain.com"
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
              />
            </div>

            {/* পাসওয়ার্ড ইনপুট */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-3 pr-10 py-2.5 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* রিমেম্বার মি ও পাসওয়ার্ড রিসেট */}
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-gray-900 dark:text-gray-300"
              >
                মনে রাখুন
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </Link>
            </div>
          </div>

          {/* সাবমিট বাটন */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-bold rounded-md text-slate-950 bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 shadow-md transition duration-150 disabled:opacity-50"
            >
              {isSubmitting ? "প্রবেশ করা হচ্ছে..." : "প্রবেশ করুন (Login)"}
            </button>
          </div>
        </form>

        {/* রেজিস্টার লিংক */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            নতুন অ্যাকাউন্ট তৈরি করতে চান?{" "}
            <Link
              href="/register"
              className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              এখানে রেজিস্ট্রেশন করুন
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
