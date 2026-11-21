"use client";

import { toast } from "sonner";
import { Check, Trash2, X } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";
import { getId, serviceStatus, type AdminService } from "./types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiFetch } from "@/lib/api";

export default function ServiceActions({
  service,
  onChanged,
}: {
  service: AdminService;
  onChanged: () => void;
}) {
  const id = getId(service);
  const status = serviceStatus(service);

  async function changeStatus(next: string) {
    try {
      const result = await apiFetch(`/api/services/admin/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: next }),
      });
      toast.success(result?.message ?? `Service ${next}.`);
      onChanged();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update status.");
    }
  }

  async function remove() {
    try {
      const result = await apiFetch(`/api/services/admin/${id}`, { method: "DELETE" });
      toast.success(result?.message ?? "Service deleted.");
      onChanged();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete service.");
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-1">
      {status !== "approved" && (
        <Button variant="ghost" size="icon-sm" aria-label="Approve service" onClick={() => changeStatus("approved")}>
          <Check />
        </Button>
      )}
      {status !== "rejected" && (
        <Button variant="ghost" size="icon-sm" aria-label="Reject service" onClick={() => changeStatus("rejected")}>
          <X />
        </Button>
      )}
      <Select value={status} onValueChange={(value) => value && changeStatus(value)}>
        <SelectTrigger className="h-8 w-32" aria-label="Change status">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>
      <ConfirmDialog
        trigger={<Button variant="ghost" size="icon-sm" aria-label="Delete service"><Trash2 /></Button>}
        title="Delete this service?"
        description="This listing will be permanently removed."
        confirmLabel="Delete"
        destructive
        onConfirm={remove}
      />
    </div>
  );
}
