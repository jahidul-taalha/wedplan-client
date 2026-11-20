"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { CalendarPlus, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function BookingForm({ serviceId }: { serviceId: string }) {
  const [open, setOpen] = useState(false);
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const result = await apiFetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          serviceId,
          eventDate,
          eventLocation,
          message,
        }),
      });
      toast.success(result?.message ?? "Booking request sent successfully!");
      setOpen(false);
      setEventDate("");
      setEventLocation("");
      setMessage("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send booking request");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="h-11 w-full sm:w-auto" />}>
        <CalendarPlus />
        Book This Service
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">Book this service</DialogTitle>
          <DialogDescription>
            Tell the vendor about your event and they will get back to you.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="eventDate">Event Date</Label>
            <Input
              id="eventDate"
              type="date"
              className="h-10"
              min={today}
              required
              value={eventDate}
              onChange={(event) => setEventDate(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="eventLocation">Event Location</Label>
            <Input
              id="eventLocation"
              className="h-10"
              placeholder="Venue or city"
              required
              value={eventLocation}
              onChange={(event) => setEventLocation(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="message">Additional Message</Label>
            <Textarea
              id="message"
              rows={4}
              placeholder="Share a few details about your celebration..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting && <Loader2 className="animate-spin" />}
              {submitting ? "Sending..." : "Send Booking Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
