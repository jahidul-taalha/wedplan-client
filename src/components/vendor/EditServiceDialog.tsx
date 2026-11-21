"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Loader2, Pencil } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { uploadImage } from "@/lib/imgbb";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ServiceFormFields from "./ServiceFormFields";
import { serviceId, type ServiceFormValues, type VendorService } from "./types";

function toFormValues(service: VendorService): ServiceFormValues {
  return {
    serviceName: service.serviceName ?? service.name ?? "",
    category: service.category ?? "",
    description: service.description ?? "",
    price: service.price !== undefined ? String(service.price) : "",
    location: service.location ?? "",
  };
}

export default function EditServiceDialog({
  service,
  onUpdated,
}: {
  service: VendorService;
  onUpdated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<ServiceFormValues>(() => toFormValues(service));
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  function change(field: keyof ServiceFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!values.serviceName.trim() || !values.category || !values.description.trim() || !values.price || !values.location.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    try {
      const images = await Promise.all(files.map(uploadImage));
      const result = await apiFetch(`/api/services/${serviceId(service)}`, {
        method: "PATCH",
        body: JSON.stringify({
          serviceName: values.serviceName,
          category: values.category,
          description: values.description,
          price: Number(values.price),
          location: values.location,
          ...(images.length ? { images } : {}),
        }),
      });
      toast.success(result?.message ?? "Service updated successfully.");
      setOpen(false);
      setFiles([]);
      onUpdated();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update service.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Edit service" />}>
        <Pencil />
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit service</DialogTitle>
          <DialogDescription>Update the details of your service.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ServiceFormFields
            values={values}
            onChange={change}
            files={files}
            onFilesChange={setFiles}
            showImages
          />
          <DialogFooter>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="animate-spin" />}
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
