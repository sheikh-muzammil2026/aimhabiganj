"use client";

import { useParams } from "next/navigation";
import StudentAdmissionEditor from "@/components/admission/StudentAdmissionEditor";

export default function EditStudentPage() {
  const params = useParams();
  const id = params?.id;

  return (
    <StudentAdmissionEditor
      id={id}
      apiEndpoint="/api/students/edit"
      backHref="/dashboard/admin/students-management"
      backLabel="⬅ তালিকায় ফিরে যান"
      redirectHref="/dashboard/admin/students-management"
    />
  );
}
