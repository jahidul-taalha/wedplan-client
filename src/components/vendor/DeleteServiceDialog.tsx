"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
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
import { serviceId, serviceName, type VendorService } from "./types";

export default function DeleteServiceDialog({
  service,
  onDeleted,
}: {
  service: VendorService;
  onDeleted: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const result = await apiFetch(`/api/services/${serviceId(service)}`, {
        method: "DELETE",
      });
      toast.success(result?.message ?? "Service deleted successfully.");
      setOpen(false);
      onDeleted();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete service.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Delete service" />}>
        <Trash2 />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this service?</DialogTitle>
          <DialogDescription>
            &ldquo;{serviceName(service)}&rdquo; will be removed from your listings.
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            {deleting && <Loader2 className="animate-spin" />}
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
