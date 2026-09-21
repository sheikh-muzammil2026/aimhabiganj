import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import {
  isWithinMadrasaGeofence,
  getDhakaTime,
  evaluateCheckOutStatus,
  MADRASA_LOCATION,
} from "@/lib/attendance-config";
import { getAuthenticatedTeacher } from "@/lib/attendance-auth";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { lat, lng, mockInPremises } = body;

    const user = await getAuthenticatedTeacher(request, body);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "অনুমতি নেই। অনুগ্রহ করে লগইন করুন।",
        },
        { status: 401 }
      );
    }

    if (lat === undefined || lng === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "ডিভাইসের অবস্থান (Latitude ও Longitude) প্রয়োজন।",
        },
        { status: 400 }
      );
    }

    // Geofence check using Haversine formula
    let effectiveLat = Number(lat);
    let effectiveLng = Number(lng);

    if (mockInPremises) {
      effectiveLat = MADRASA_LOCATION.LATITUDE;
      effectiveLng = MADRASA_LOCATION.LONGITUDE;
    }

    const geofenceResult = isWithinMadrasaGeofence(effectiveLat, effectiveLng);

    if (!geofenceResult.isInside) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be inside the madrasa premises to submit attendance.",
          distance: geofenceResult.distance,
          threshold: geofenceResult.threshold,
        },
        { status: 403 }
      );
    }

    const { dateStr } = getDhakaTime();
    const now = new Date();
    const checkOutStatus = evaluateCheckOutStatus(now);

    const db = await getDb();
    const collection = db.collection("teacherattendance");

    // Find today's check-in record
    const existing = await collection.findOne({
      teacherEmail: user.email,
      date: dateStr,
    });

    if (!existing || !existing.checkInTime) {
      return NextResponse.json(
        {
          success: false,
          message: "আজকের কোনো প্রবেশ হাজিরা (Check-In) পাওয়া যায়নি। আগে Check-In সম্পন্ন করুন।",
        },
        { status: 400 }
      );
    }

    if (existing.checkOutTime) {
      return NextResponse.json(
        {
          success: false,
          message: "আপনি আজকের প্রস্থান হাজিরা (Check-Out) ইতিমধ্যে সম্পন্ন করেছেন।",
          attendance: existing,
        },
        { status: 400 }
      );
    }

    const checkOutLocation = {
      lat: effectiveLat,
      lng: effectiveLng,
    };

    await collection.updateOne(
      { _id: existing._id },
      {
        $set: {
          checkOutTime: now.toISOString(),
          checkOutStatus: checkOutStatus, // 'On Time' | 'Early'
          checkOutLocation: checkOutLocation,
          updatedAt: now,
        },
      }
    );

    const updatedDoc = {
      ...existing,
      checkOutTime: now.toISOString(),
      checkOutStatus,
      checkOutLocation,
      updatedAt: now,
    };

    return NextResponse.json({
      success: true,
      message:
        checkOutStatus === "On Time"
          ? "সফলভাবে প্রস্থান হাজিরা নিশ্চিত হয়েছে! (Completed / On Time Departure)"
          : "সময় শেষ হওয়ার পূর্বে প্রস্থান সম্পন্ন হয়েছে! (Early Departure)",
      checkOutStatus,
      attendance: updatedDoc,
    });
  } catch (error) {
    console.error("Check-out error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "প্রস্থান হাজিরা সাবমিট করতে সমস্যা হয়েছে।",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
