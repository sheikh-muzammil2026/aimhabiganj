import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClientLayout from "./DashboardClientLayout";

// ১. ডাইনামিক টাইটেল ও মেটাডেটা জেনারেটর
export async function generateMetadata({ params }) {
    // URL থেকে রোল বের করা (যেমন: /dashboard/admin -> admin)
    const role = params?.role || "User";
    const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1);

    return {
        title: `${capitalizedRole} Dashboard | আস-সালাম আইডিয়াল মাদ্রাসা`,
        description: "আস-সালাম আইডিয়াল মাদ্রাসা ম্যানেজমেন্ট সিস্টেম ড্যাশবোর্ড প্যানেল।",
    };
}

//fake ডামি ফাংশন (আপনার অথেনটিকেশন চেক করার জন্য)
async function getAuthUser() {
    // বাস্তব প্রজেক্টে এখানে আপনার NextAuth বা JWT টোকেন ভেরিফিকেশন হবে
    // আপাতত ডামি ডাটা দিয়ে প্রোটেকশন লজিক দেখানো হলো
    return {
        isLoggedIn: true,
        role: "admin", // 'student', 'teacher', 'parent', 'admin'
        name: "মুহাম্মদ আনাস",
        email: "anas@assalam.com",
        photo: null
    };
}

export default async function DashboardLayout({ children, params }) {
    const user = await getAuthUser();
    const currentRoleInUrl = params?.role; // URL থেকে রোল নেওয়া হচ্ছে

    // ২. URL টাইপ প্রোটেকশন (কেউ নিজে টাইপ করে অন্য রোলে ঢুকতে পারবে না)
    if (!user || !user.isLoggedIn) {
        redirect("/login");
    }

    // ইউজার লগইন করা কিন্তু তার নিজের রোল আর URL-এর রোল যদি না মিলে, তবে তাকে তার সঠিক ড্যাশবোর্ডে পাঠিয়ে দেওয়া হবে
    if (currentRoleInUrl && user.role.toLowerCase() !== currentRoleInUrl.toLowerCase()) {
        redirect(`/dashboard/${user.role.toLowerCase()}`);
    }

    return (
        <DashboardClientLayout user={user}>
            {children}
        </DashboardClientLayout>
    );
}