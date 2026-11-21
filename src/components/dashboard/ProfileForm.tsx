"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import { uploadImage } from "@/lib/imgbb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UpdateInput = Parameters<typeof authClient.updateUser>[0];

export default function ProfileForm({ isVendor = false }: { isVendor?: boolean }) {
  const { data: session, refetch } = useSession();
  const user = session?.user;
  const [name, setName] = useState(user?.name ?? "");
  const [businessName, setBusinessName] = useState(user?.businessName ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }
    setSaving(true);
    try {
      const image = file ? await uploadImage(file) : (user?.image ?? undefined);
      const payload = {
        name,
        image,
        ...(isVendor ? { businessName } : {}),
      };
      const result = await authClient.updateUser(payload as unknown as UpdateInput);
      if (result.error) {
        toast.error(result.error.message ?? "Could not save your profile.");
        return;
      }
      toast.success("Profile updated successfully.");
      setFile(null);
      setPreview(null);
      await refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save your profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="max-w-xl border-rose-100 dark:border-rose-900/40">
      <CardHeader>
        <CardTitle className="text-xl text-rose-900 dark:text-rose-100">
          Profile Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              {preview ? (
                <AvatarImage src={preview} alt="Preview" />
              ) : user?.image ? (
                <AvatarImage src={user.image} alt={name} />
              ) : null}
              <AvatarFallback>{(name || "U").charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="space-y-1.5">
              <Label htmlFor="image">Profile Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const next = event.target.files?.[0] ?? null;
                  setFile(next);
                  setPreview(next ? URL.createObjectURL(next) : null);
                }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(event) => setName(event.target.value)} />
          </div>

          {isVendor && (
            <div className="space-y-1.5">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
              />
            </div>
          )}

          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="animate-spin" />}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
