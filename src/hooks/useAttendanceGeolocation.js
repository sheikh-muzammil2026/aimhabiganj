"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  MADRASA_LOCATION,
  isWithinMadrasaGeofence,
} from "@/lib/attendance-config";

/**
 * Shared hook for live clock (1s interval) and GPS / Geofence verification
 * used across Teacher and Staff self-service attendance pages.
 */
export function useAttendanceGeolocation({
  passAccuracyToGeofence = false,
  unsupportedMessage = "আপনার ব্রাউজারে Geolocation সমর্থিত নয়।",
  unsupportedToastType = "error",
} = {}) {
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [currentCoords, setCurrentCoords] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [geofenceStatus, setGeofenceStatus] = useState(null);

  // Live Clock updating every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const requestLocation = useCallback(
    (onSuccess) => {
      if (!navigator.geolocation) {
        setLocationError(unsupportedMessage);
        if (unsupportedToastType === "warning") {
          toast.warning(unsupportedMessage);
        } else {
          toast.error(unsupportedMessage);
        }
        return;
      }

      setIsLocating(true);
      setLocationError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const roundedAccuracy = Math.round(accuracy || 0);
          const coords = passAccuracyToGeofence
            ? {
                lat: latitude,
                lng: longitude,
                accuracy: roundedAccuracy,
                timestamp: Date.now(),
              }
            : { lat: latitude, lng: longitude, accuracy };

          setCurrentCoords(coords);

          const check = passAccuracyToGeofence
            ? isWithinMadrasaGeofence(
                latitude,
                longitude,
                MADRASA_LOCATION.RADIUS_METERS,
                roundedAccuracy
              )
            : isWithinMadrasaGeofence(latitude, longitude);

          const statusObj = {
            ...check,
            accuracy: roundedAccuracy,
          };
          setGeofenceStatus(statusObj);
          setIsLocating(false);

          if (typeof onSuccess === "function") {
            onSuccess(coords, statusObj);
          }
        },
        (error) => {
          setIsLocating(false);
          let msg = "লোকেশন প্রাপ্তিতে সমস্যা হয়েছে।";
          if (error.code === error.PERMISSION_DENIED) {
            msg =
              "অনুগ্রহ করে ব্রাউজার ও ডিভাইসের GPS/লোকেশন পারমিশন অন করুন।";
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            msg = "ডিভাইসের অবস্থান শনাক্ত করা সম্ভব হয়নি।";
          } else if (error.code === error.TIMEOUT) {
            msg = "লোকেশন পেতে অতিরিক্ত সময় লাগছে। আবার চেষ্টা করুন।";
          }
          setLocationError(msg);
          toast.warning(msg);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    },
    [passAccuracyToGeofence, unsupportedMessage, unsupportedToastType]
  );

  // Request location on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      requestLocation();
    }, 0);
    return () => clearTimeout(timer);
  }, [requestLocation]);

  return {
    currentTime,
    currentCoords,
    locationError,
    isLocating,
    geofenceStatus,
    requestLocation,
  };
}
