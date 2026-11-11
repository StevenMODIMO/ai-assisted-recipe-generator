"use client";

import Link from "next/link";
import { useState, type SubmitEvent } from "react";
import { Info, KeyRound, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type PasswordResetFormProps = {
  mode: "request" | "reset";
  email?: string;
  token?: string;
};

export default function PasswordResetForm({
  mode,
  email: initialEmail = "",
  token = "",
}: PasswordResetFormProps) {
  const isReset = mode === "reset";
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(
    isReset && (!initialEmail || !token) ? "This password reset link is incomplete." : null,
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (isReset && password !== confirmation) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        isReset ? "/api/auth/reset-password" : "/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            isReset ? { email, token, password } : { email },
          ),
        },
      );
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(result.message || "Something went wrong. Please try again.");
      } else {
        setMessage(result.message || "Request completed.");
        if (isReset) {
          setPassword("");
          setConfirmation("");
        }
      }
    } catch {
      setError("We couldn’t complete your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-76px)] bg-[#fffdf7] px-4 py-12 text-[#263522] dark:bg-[#151b13] dark:text-[#f1f3e9]">
      <section className="mx-auto max-w-md rounded-3xl border-2 border-[#263522] bg-white p-6 shadow-[5px_5px_0_#263522] dark:border-[#52604b] dark:bg-[#20291e] dark:shadow-[5px_5px_0_#080c07] sm:p-8">
        <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#71934d] dark:text-[#a8cf7b]">
          Account help
        </p>
        <h1 className="mt-2 text-3xl font-black">
          {isReset ? "Choose a new password" : "Forgot your password?"}
        </h1>
        <p className="mt-2 text-sm text-[#64705a] dark:text-[#b5c0aa]">
          {isReset
            ? "Choose a strong password for your Recipely account."
            : "Enter your account email and we’ll send a reset link if it’s registered."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {!isReset && (
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold">
                <Mail className="h-4 w-4 text-[#71934d] dark:text-[#a8cf7b]" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="h-11 rounded-xl border-[#d8ddce] bg-[#fffdf7] dark:border-[#52604b] dark:bg-[#151b13]"
              />
            </div>
          )}

          {isReset && (
            <>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-bold">
                  <KeyRound className="h-4 w-4 text-[#71934d] dark:text-[#a8cf7b]" />
                  New password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a strong password"
                  className="h-11 rounded-xl border-[#d8ddce] bg-[#fffdf7] dark:border-[#52604b] dark:bg-[#151b13]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmation" className="font-bold">
                  Confirm password
                </Label>
                <Input
                  id="confirmation"
                  name="confirmation"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmation}
                  onChange={(event) => setConfirmation(event.target.value)}
                  placeholder="Enter the password again"
                  className="h-11 rounded-xl border-[#d8ddce] bg-[#fffdf7] dark:border-[#52604b] dark:bg-[#151b13]"
                />
              </div>
            </>
          )}

          {(error || message) && (
            <div
              role={error ? "alert" : "status"}
              className={`flex items-center gap-2 rounded-xl border-2 p-3 text-sm ${
                error
                  ? "border-red-300 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                  : "border-[#d8ddce] bg-[#f2f6df] text-[#263522] dark:border-[#52604b] dark:bg-[#263323] dark:text-[#f1f3e9]"
              }`}
            >
              {error && <Info className="h-4 w-4 shrink-0" />}
              {error || message}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || Boolean(error && isReset && (!email || !token))}
            className="h-11 rounded-xl bg-[#527c34] font-extrabold text-white hover:bg-[#42672a]"
          >
            {loading
              ? "Please wait…"
              : isReset
                ? "Reset password"
                : "Send reset link"}
          </Button>
        </form>

        <Link
          href="/signin"
          className="mt-5 block text-center text-sm font-bold text-[#527c34] underline dark:text-[#b8df8c]"
        >
          Back to sign in
        </Link>
      </section>
    </main>
  );
}
