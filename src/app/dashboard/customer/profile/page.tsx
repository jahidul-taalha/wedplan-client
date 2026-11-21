"use client";

import AuthGuard from "@/components/AuthGuard";
import ProfileForm from "@/components/dashboard/ProfileForm";

export default function CustomerProfilePage() {
  return (
    <AuthGuard allowedRoles={["customer"]}>
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-semibold text-rose-900 dark:text-rose-100">
          My Profile
        </h1>
        <ProfileForm />
      </div>
    </AuthGuard>
  );
}
