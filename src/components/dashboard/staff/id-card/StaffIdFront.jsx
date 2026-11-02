"use client";

import React from "react";
import EmployeeIdFront from "@/components/shared/id-card/EmployeeIdFront";

export default function StaffIdFront({ staff = {}, scale = 1 }) {
  return <EmployeeIdFront person={staff} variant="staff" scale={scale} />;
}
