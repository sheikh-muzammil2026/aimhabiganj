"use client";

import React from "react";
import EmployeeIdBack from "@/components/shared/id-card/EmployeeIdBack";

export default function TeacherIdBack({ scale = 1 }) {
  return <EmployeeIdBack variant="teacher" scale={scale} />;
}
