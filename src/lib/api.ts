import { authClient } from "./auth-client";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error(error?.message ?? "Failed to retrieve authentication token");
  }

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${data.token}`);
  headers.set("Content-Type", "application/json");

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? ""}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      message = body?.message ?? body?.error ?? message;
    } catch {
      // Response had no JSON body; keep the status-based message.
    }
    throw new Error(message);
  }

  return response.json();
}
