"use client";

import React from "react";
import EmployeeIdFront from "@/components/shared/id-card/EmployeeIdFront";

export default function TeacherIdFront({ teacher = {}, scale = 1 }) {
  return <EmployeeIdFront person={teacher} variant="teacher" scale={scale} />;
}
