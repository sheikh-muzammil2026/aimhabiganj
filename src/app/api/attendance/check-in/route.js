import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import {
  isWithinMadrasaGeofence,
  getDhakaTime,
  evaluateCheckInStatus,
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
    const checkInStatus = evaluateCheckInStatus(now);

    const db = await getDb();
    const collection = db.collection("teacherattendance");

    // Check if already checked in today
    const existing = await collection.findOne({
      teacherEmail: user.email,
      date: dateStr,
    });

    if (existing && existing.checkInTime) {
      return NextResponse.json(
        {
          success: false,
          message: "আপনি আজকের হাজিরা (Check-In) ইতিমধ্যে সম্পন্ন করেছেন।",
          attendance: existing,
        },
        { status: 400 }
      );
    }

    const attendanceDoc = {
      teacherEmail: user.email,
      teacherName: user.name || user.email.split("@")[0],
      teacherId: user.id,
      date: dateStr,
      checkInTime: now.toISOString(),
      checkInStatus: checkInStatus, // 'On Time' | 'Late'
      checkInLocation: {
        lat: effectiveLat,
        lng: effectiveLng,
      },
      checkOutTime: null,
      checkOutStatus: null,
      checkOutLocation: null,
      createdAt: now,
      updatedAt: now,
    };

    if (existing) {
      await collection.updateOne(
        { _id: existing._id },
        {
          $set: {
            checkInTime: attendanceDoc.checkInTime,
            checkInStatus: attendanceDoc.checkInStatus,
            checkInLocation: attendanceDoc.checkInLocation,
            updatedAt: now,
          },
        }
      );
      attendanceDoc._id = existing._id;
    } else {
      const result = await collection.insertOne(attendanceDoc);
      attendanceDoc._id = result.insertedId;
    }

    return NextResponse.json({
      success: true,
      message:
        checkInStatus === "On Time"
          ? "সফলভাবে সময়মতো প্রবেশ হাজিরা নিশ্চিত হয়েছে! (On Time)"
          : "দেরিতে প্রবেশ হাজিরা নিশ্চিত হয়েছে! (Late)",
      checkInStatus,
      attendance: attendanceDoc,
    });
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "হাজিরা সাবমিট করতে সমস্যা হয়েছে।",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
