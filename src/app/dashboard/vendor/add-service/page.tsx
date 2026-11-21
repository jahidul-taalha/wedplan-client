"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import ServiceFormFields from "@/components/vendor/ServiceFormFields";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { uploadImage } from "@/lib/imgbb";
import type { ServiceFormValues } from "@/components/vendor/types";

const EMPTY: ServiceFormValues = {
  serviceName: "",
  category: "",
  description: "",
  price: "",
  location: "",
};

function AddServiceForm() {
  const router = useRouter();
  const [values, setValues] = useState<ServiceFormValues>(EMPTY);
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  function change(field: keyof ServiceFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      !values.serviceName.trim() ||
      !values.category ||
      !values.description.trim() ||
      !values.price ||
      !values.location.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const images = await Promise.all(files.map(uploadImage));
      const result = await apiFetch("/api/services", {
        method: "POST",
        body: JSON.stringify({
          serviceName: values.serviceName,
          category: values.category,
          description: values.description,
          price: Number(values.price),
          location: values.location,
          image: images[0],
          images,
        }),
      });
      toast.success(result?.message ?? "Service created successfully.");
      router.push("/dashboard/vendor/services");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create service.";
      toast.error(message, { duration: 8000 });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-rose-900 dark:text-rose-100">
          Add a New Service
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Share the details of the service you offer to couples.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-rose-100 bg-white p-6 shadow-sm dark:border-rose-900/40 dark:bg-card"
      >
        <ServiceFormFields
          values={values}
          onChange={change}
          files={files}
          onFilesChange={setFiles}
          showImages
        />
        <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
          {submitting && <Loader2 className="animate-spin" />}
          {submitting ? "Creating service..." : "Create Service"}
        </Button>
      </form>
    </div>
  );
}

export default function AddServicePage() {
  return (
    <AuthGuard allowedRoles={["vendor"]}>
      <AddServiceForm />
    </AuthGuard>
  );
}
