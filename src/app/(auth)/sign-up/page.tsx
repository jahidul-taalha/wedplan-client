"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/lib/imgbb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GoogleButton, redirectByRole } from "../_components/auth-shared";

type Role = "vendor" | "customer";
type SignUpInput = Parameters<typeof authClient.signUp.email>[0];

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [role, setRole] = useState<Role>("customer");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  function validate() {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Full name is required.";
    if (!email.trim()) next.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      next.email = "Please enter a valid email address.";
    if (password.length < 6)
      next.password = "Password must be at least 6 characters.";
    else if (!/[A-Z]/.test(password))
      next.password = "Password must include an uppercase letter.";
    else if (!/[a-z]/.test(password))
      next.password = "Password must include a lowercase letter.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const imageUrl = image ? await uploadImage(image) : undefined;
      const payload = {
        name,
        email,
        password,
        image: imageUrl,
        requestedRole: role,
      };
      const result = await authClient.signUp.email(
        payload as unknown as SignUpInput,
      );
      if (result.error) {
        toast.error(result.error.message ?? "Sign up failed. Please try again.");
        return;
      }
      toast.success("Your account is ready. Welcome to WedPlan!");
      redirectByRole(router, role);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.origin,
      });
      if (result.error) {
        toast.error(result.error.message ?? "Could not continue with Google.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setGoogleLoading(false);
    }
  }

  const fieldClass = "h-10";

  return (
    <Card className="border-rose-100 shadow-lg shadow-rose-100/50 dark:border-rose-900/40 dark:shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-rose-800 dark:text-rose-200">
          Create your account
        </CardTitle>
        <CardDescription>
          Join WedPlan to start planning your celebration.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              className={fieldClass}
              placeholder="Jane Doe"
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              className={fieldClass}
              placeholder="jane@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              className={fieldClass}
              placeholder="At least 6 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="image">Profile Image (optional)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              className={fieldClass}
              onChange={(event) => setImage(event.target.files?.[0] ?? null)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="role">Account Role</Label>
            <Select value={role} onValueChange={(value) => setRole(value as Role)}>
              <SelectTrigger id="role" className="h-10 w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vendor">Vendor</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="h-10 w-full" disabled={loading}>
            {loading && <Loader2 className="animate-spin" />}
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>

        <GoogleButton loading={googleLoading} onClick={handleGoogle} />
      </CardContent>

      <CardFooter className="justify-center text-sm text-muted-foreground">
        Already have an account?&nbsp;
        <Link href="/sign-in" className="font-medium text-rose-700 hover:underline dark:text-rose-300">
          Sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
