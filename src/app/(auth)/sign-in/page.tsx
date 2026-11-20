"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleButton, redirectByRole } from "../_components/auth-shared";

function getSafeRedirect() {
  const value = new URLSearchParams(window.location.search).get("redirect");
  return value && value.startsWith("/") && !value.startsWith("//") ? value : null;
}

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  function validate() {
    const next: Record<string, string> = {};
    if (!email.trim()) next.email = "Email is required.";
    if (!password) next.password = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await authClient.signIn.email({ email, password });
      if (result.error) {
        toast.error(result.error.message ?? "Invalid email or password.");
        return;
      }

      const session = await authClient.getSession();
      if (session.error) {
        toast.error(session.error.message ?? "Could not load your session.");
        return;
      }

      toast.success("Welcome back to WedPlan!");
      const redirect = getSafeRedirect();
      if (redirect) router.push(redirect);
      else redirectByRole(router, session.data?.user.role);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      const redirect = getSafeRedirect();
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: redirect
          ? `${window.location.origin}${redirect}`
          : window.location.origin,
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

  return (
    <Card className="border-rose-100 shadow-lg shadow-rose-100/50 dark:border-rose-900/40 dark:shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-rose-800 dark:text-rose-200">
          Welcome back
        </CardTitle>
        <CardDescription>Sign in to continue planning your big day.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              className="h-10"
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
              className="h-10"
              placeholder="Your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password}</p>
            )}
          </div>

          <Button type="submit" className="h-10 w-full" disabled={loading}>
            {loading && <Loader2 className="animate-spin" />}
            {loading ? "Signing in..." : "Sign in"}
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
        New to WedPlan?&nbsp;
        <Link href="/sign-up" className="font-medium text-rose-700 hover:underline dark:text-rose-300">
          Create an account
        </Link>
      </CardFooter>
    </Card>
  );
}
