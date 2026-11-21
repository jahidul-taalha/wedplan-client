"use client";

import { useState, type MouseEvent } from "react";
import { toast } from "sonner";
import { Check, Loader2, Trash2, X } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";
import { serviceStatus, type AdminService } from "./types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiFetch } from "@/lib/api";

const STATUSES = ["pending", "approved", "rejected"] as const;
type Status = (typeof STATUSES)[number];

export default function ServiceActions({
  service,
  onChanged,
}: {
  service: AdminService;
  onChanged: () => void;
}) {
  const [busy, setBusy] = useState<Status | "delete" | null>(null);
  const id = String(service._id ?? service.id ?? "");
  const status = serviceStatus(service);
  console.log("Admin service id:", service._id, "->", id);

  async function changeStatus(next: Status) {
    if (!id || id === "undefined") {
      toast.error("Service id is missing.");
      return;
    }
    if (busy) return;
    console.log("Updating service status:", { id, status: next });
    setBusy(next);
    try {
      const result = await apiFetch(`/api/services/admin/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: next }),
      });
      toast.success(result?.message ?? `Service ${next} successfully.`);
      onChanged();
    } catch (error) {
      console.error("Failed to update service status:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update service status.",
      );
    } finally {
      setBusy(null);
    }
  }

  async function remove() {
    if (busy || !id) return;
    setBusy("delete");
    try {
      const result = await apiFetch(`/api/services/admin/${id}`, {
        method: "DELETE",
      });
      toast.success(result?.message ?? "Service deleted.");
      onChanged();
    } catch (error) {
      console.error("Failed to delete service:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete service.",
      );
    } finally {
      setBusy(null);
    }
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>, next: Status) {
    event.stopPropagation();
    void changeStatus(next);
  }

  function handleStatusChange(value: string | null) {
    if (!value || !STATUSES.includes(value as Status)) return;
    void changeStatus(value as Status);
  }

  return (
    <div className="relative z-10 flex flex-wrap items-center justify-end gap-1">
      {status !== "approved" && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Approve service"
          disabled={busy !== null}
          onClick={(event) => handleClick(event, "approved")}
        >
          {busy === "approved" ? <Loader2 className="animate-spin" /> : <Check />}
        </Button>
      )}
      {status !== "rejected" && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Reject service"
          disabled={busy !== null}
          onClick={(event) => handleClick(event, "rejected")}
        >
          {busy === "rejected" ? <Loader2 className="animate-spin" /> : <X />}
        </Button>
      )}
      <Select value={status} onValueChange={handleStatusChange}>
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
        trigger={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Delete service"
          >
            <Trash2 />
          </Button>
        }
        title="Delete this service?"
        description="This listing will be permanently removed."
        confirmLabel="Delete"
        destructive
        onConfirm={remove}
      />
    </div>
  );
}
