"use client";

import React from "react";
import EmployeeIdBack from "@/components/shared/id-card/EmployeeIdBack";

export default function StaffIdBack({ scale = 1 }) {
  return <EmployeeIdBack variant="staff" scale={scale} />;
}
