"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ChangeEvent, type SubmitEvent } from "react";
import {
  ArrowRight,
  BookmarkCheck,
  ChefHat,
  Clock3,
  Image as ImageIcon,
  ImageOff,
  Info,
  KeyRound,
  Mail,
  Salad,
  Sparkles,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface AuthFormProps {
  type: "login" | "signup";
  serverError?: string;
}

const benefits = [
  { icon: Salad, text: "Discover recipes for what’s in your fridge" },
  { icon: Sparkles, text: "Make every recipe fit your taste" },
  { icon: BookmarkCheck, text: "Save the ones you want to make again" },
];

export default function AuthForm({ type, serverError }: AuthFormProps) {
  const isSignup = type === "signup";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { authenticate, error, loading, setError } = useAuth();

  useEffect(() => {
    if (serverError) setError(serverError);
  }, [serverError, setError]);

  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    await authenticate({
      email,
      password,
      setPassword,
      setEmail,
      ...(isSignup ? { avatar } : {}),
      type,
    });
  };

  return (
    <main className="min-h-[calc(100vh-76px)] bg-[#fffdf7] px-4 py-8 text-[#263522] transition-colors duration-300 sm:px-6 sm:py-12 dark:bg-[#151b13] dark:text-[#f1f3e9]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 text-center">
          <p className="mb-2 text-sm font-extrabold uppercase tracking-[0.18em] text-[#71934d] dark:text-[#a8cf7b]">
            {isSignup ? "Come on in" : "Welcome back"}
          </p>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            {isSignup ? "Let’s make something delicious." : "Your kitchen called."}
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-[#64705a] dark:text-[#b5c0aa]">
            {isSignup
              ? "Create your free account and let the good cooking begin."
              : "Sign in and pick up right where the good stuff happens."}
          </p>
        </div>

        <div className="grid overflow-hidden rounded-[2rem] border-2 border-[#263522] bg-white dark:border-[#52604b] dark:bg-[#20291e] lg:grid-cols-[1fr_0.9fr]">
          <section className="p-5 sm:p-8 lg:p-10">
            <div className="mb-6">
              <h2 className="text-2xl font-black">
                {isSignup ? "Create your account" : "Sign in"}
              </h2>
              <p className="mt-1 text-sm text-[#64705a] dark:text-[#b5c0aa]">
                {isSignup
                  ? "A few details, then you’re in."
                  : "Your next favorite meal is just a sign-in away."}
              </p>
            </div>

            <form
              autoComplete="on"
              onFocus={() => setError(null)}
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              {isSignup && (
                <div className="flex items-center gap-3">
                  {preview ? (
                    <Image
                      src={preview}
                      alt="Your profile photo preview"
                      width={56}
                      height={56}
                      unoptimized
                      className="h-14 w-14 rounded-full border-2 border-[#263522] object-cover dark:border-[#879879]"
                    />
                  ) : (
                    <span className="grid h-14 w-14 place-items-center rounded-full border-2 border-dashed border-[#9baa8d] bg-[#f2f6df] text-[#71934d] dark:border-[#697b5e] dark:bg-[#263323] dark:text-[#a8cf7b]">
                      <ChefHat className="h-6 w-6" />
                    </span>
                  )}
                  <div className="flex flex-col gap-1">
                    <Label
                      htmlFor="avatar"
                      className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl border-2 border-[#d8ddce] px-3 py-2 text-sm font-bold transition-colors hover:bg-[#f2f6df] dark:border-[#52604b] dark:hover:bg-[#34452b]"
                    >
                      <ImageIcon className="h-4 w-4" />
                      {preview ? "Change photo" : "Add a photo"}
                    </Label>
                    <Input
                      id="avatar"
                      name="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="sr-only"
                    />
                    {preview ? (
                      <button
                        type="button"
                        onClick={() => {
                          setAvatar(null);
                          setPreview(null);
                        }}
                        className="inline-flex w-fit items-center gap-1 text-xs font-semibold text-[#64705a] hover:text-[#263522] dark:text-[#b5c0aa] dark:hover:text-white"
                      >
                        <ImageOff className="h-3.5 w-3.5" /> Remove photo
                      </button>
                    ) : (
                      <span className="text-xs text-[#78806c] dark:text-[#aab69e]">
                        Optional — you can add one later
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="font-bold">
                  <Mail className="h-4 w-4 text-[#71934d] dark:text-[#a8cf7b]" />
                  Email
                </Label>
                <Input
                  value={email}
                  name="email"
                  type="email"
                  autoComplete="username"
                  onChange={(event) => setEmail(event.target.value)}
                  id="email"
                  placeholder="you@example.com"
                  required
                  className="h-11 rounded-xl border-[#d8ddce] bg-[#fffdf7] dark:border-[#52604b] dark:bg-[#151b13]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-bold">
                  <KeyRound className="h-4 w-4 text-[#71934d] dark:text-[#a8cf7b]" />
                  Password
                </Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  id="password"
                  name="password"
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  placeholder="Enter your password"
                  required
                  className="h-11 rounded-xl border-[#d8ddce] bg-[#fffdf7] dark:border-[#52604b] dark:bg-[#151b13]"
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-center gap-2 rounded-xl border-2 border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                >
                  <Info className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="mt-1 h-12 w-full justify-between rounded-xl border-2 border-[#263522] bg-[#a8d75c] px-4 font-extrabold text-[#263522] hover:bg-[#b9e477] disabled:opacity-60 dark:border-[#8ca273] dark:text-[#172112]"
              >
                {loading
                  ? isSignup
                    ? "Creating your account…"
                    : "Signing you in…"
                  : isSignup
                    ? "Create account"
                    : "Sign in"}
                {!loading && <ArrowRight className="h-5 w-5" />}
              </Button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs font-semibold text-[#78806c] dark:text-[#aab69e]">
              <span className="h-px flex-1 bg-[#e5e3d6] dark:bg-[#394632]" />
              OR
              <span className="h-px flex-1 bg-[#e5e3d6] dark:bg-[#394632]" />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => signIn("google")}
              className="h-11 w-full rounded-xl border-2 border-[#d8ddce] bg-white font-bold hover:bg-[#f7f5e9] dark:border-[#52604b] dark:bg-[#20291e] dark:hover:bg-[#263323]"
            >
              <FcGoogle className="h-5 w-5" />
              Continue with Google
            </Button>

            <p className="mt-5 text-center text-sm text-[#64705a] dark:text-[#b5c0aa]">
              {isSignup ? "Already have an account?" : "New to Recipely?"}{" "}
              <Link
                href={isSignup ? "/signin" : "/signup"}
                className="font-extrabold text-[#527c34] underline decoration-[#a8d75c] decoration-2 underline-offset-4 hover:text-[#263522] dark:text-[#b8df8c] dark:hover:text-white"
              >
                {isSignup ? "Sign in" : "Create an account"}
              </Link>
            </p>
          </section>

          <aside className="relative m-3 overflow-hidden rounded-[1.5rem] bg-[#f7f5e9] p-6 sm:m-5 sm:p-8 dark:bg-[#1b2318] lg:m-4 lg:p-8">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#f8e9ba] dark:bg-[#51452c]" />
            <div className="relative flex h-full flex-col">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#71934d] dark:text-[#a8cf7b]">
                    {isSignup ? "Your little kitchen helper" : "Good to see you again"}
                  </p>
                  <h2 className="mt-2 max-w-xs text-2xl font-black leading-tight sm:text-3xl">
                    {isSignup
                      ? "Your kitchen, full of possibilities."
                      : "Let’s get back to the good stuff."}
                  </h2>
                </div>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-2 border-[#263522] bg-[#ffe1b6] text-[#263522] dark:border-[#879879]">
                  {isSignup ? (
                    <Sparkles className="h-6 w-6" />
                  ) : (
                    <ChefHat className="h-6 w-6" />
                  )}
                </span>
              </div>

              <div className="my-7 flex min-h-40 flex-1 items-center justify-center sm:min-h-48">
                {isSignup ? (
                  <div className="relative flex h-44 w-full max-w-sm items-center justify-center rounded-[1.5rem] border-2 border-[#263522] bg-[#b8d779] dark:border-[#879879] dark:bg-[#34452b]">
                    <span className="absolute left-5 top-4 text-3xl" aria-hidden="true">✦</span>
                    <span className="absolute right-6 top-6 text-2xl" aria-hidden="true">✨</span>
                    <span className="absolute bottom-4 left-10 text-2xl" aria-hidden="true">🌿</span>
                    <div className="grid h-28 w-28 place-items-center rounded-full border-[8px] border-white/80 bg-[#fffdf7] text-6xl dark:border-[#263323] dark:bg-[#20291e]">
                      🥑
                    </div>
                    <span className="absolute bottom-4 right-8 text-3xl" aria-hidden="true">🍋</span>
                  </div>
                ) : (
                  <div className="relative w-full max-w-sm rounded-[1.5rem] border-2 border-[#263522] bg-white p-4 dark:border-[#52604b] dark:bg-[#20291e]">
                    <div className="flex items-center gap-3">
                      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[#f5b96b] text-4xl">
                        🍝
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#78806c] dark:text-[#aab69e]">Saved for tonight</p>
                        <p className="mt-1 truncate font-black">Creamy tomato pasta</p>
                        <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#64705a] dark:text-[#b5c0aa]">
                          <Clock3 className="h-3.5 w-3.5" /> 25 min
                        </p>
                      </div>
                      <BookmarkCheck className="h-5 w-5 shrink-0 text-[#5b8d35] dark:text-[#a8cf7b]" />
                    </div>
                    <div className="mt-4 flex gap-2">
                      <span className="rounded-full bg-[#edf4df] px-3 py-1 text-xs font-bold text-[#527c34] dark:bg-[#34452b] dark:text-[#c5e89b]">Your recipes</span>
                      <span className="rounded-full bg-[#fff0d9] px-3 py-1 text-xs font-bold text-[#80582a] dark:bg-[#493b28] dark:text-[#f1c98d]">Made with love</span>
                    </div>
                  </div>
                )}
              </div>

              <ul className="space-y-3">
                {(isSignup
                  ? benefits
                  : [
                      { icon: BookmarkCheck, text: "Pick up with your saved recipes" },
                      { icon: Sparkles, text: "Ask AI to tweak a dish just for you" },
                      { icon: Salad, text: "Find something tasty to make tonight" },
                    ]
                ).map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-sm font-semibold text-[#526345] dark:text-[#c3ceba]">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-[#d8ddce] bg-white text-[#5b8d35] dark:border-[#52604b] dark:bg-[#20291e] dark:text-[#a8cf7b]">
                      <Icon className="h-4 w-4" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
        <p className="mt-5 text-center text-xs font-medium text-[#78806c] dark:text-[#aab69e]">
          Recipe Auth © Recipe House. All rights reserved.
        </p>
      </div>
    </main>
  );
}
