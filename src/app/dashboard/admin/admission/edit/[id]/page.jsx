"use client";

import { useParams } from "next/navigation";
import StudentAdmissionEditor from "@/components/shared/admission/StudentAdmissionEditor";

export default function EditAdmissionPage() {
  const params = useParams();
  const id = params?.id;

  return (
    <StudentAdmissionEditor
      id={id}
      apiEndpoint="/api/admissions/edit"
      backHref="/dashboard/admin/admission?section=requests"
      backLabel="⬅ নির্দেশিকাতে ফিরে যান"
      redirectHref="/dashboard/admission?section=requests"
    />
  );
}
