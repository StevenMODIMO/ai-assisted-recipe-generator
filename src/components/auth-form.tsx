"use client";
import { Mail, Key, Image, ImageOff, Info } from "lucide-react";
import { useState, useEffect, SubmitEvent, ChangeEvent } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { useAuth } from "@/hooks/useAuth";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

interface AuthFormProps {
  type: string;
}

export default function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { authenticate, error, loading, setError } = useAuth();
  const searchParams = useSearchParams();
  const authErrorParam = searchParams.get("error");

  const decodedAuthError = authErrorParam
    ? decodeURIComponent(authErrorParam)
    : null;

  useEffect(() => {
    if (decodedAuthError) {
      setError(decodedAuthError);
    }
  }, [decodedAuthError, setError]);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (type === "signup") {
      await authenticate({
        email,
        password,
        setPassword,
        setEmail,
        avatar,
        type: "signup",
      });
    }

    if (type === "login") {
      await authenticate({
        email,
        password,
        setPassword,
        setEmail,
        type: "login",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {type === "login"
              ? "Sign In"
              : type === "signup"
                ? "Get started"
                : "Authentication description"}
          </CardTitle>
          <CardDescription>
            {type === "login"
              ? "Sign in to continue"
              : type === "signup"
                ? "Create a new account to get started"
                : "Authentication description"}
          </CardDescription>
          <CardContent>
            <form
              autoComplete="on"
              onFocus={() => setError(null)}
              onSubmit={handleSubmit}
              className="flex flex-col gap-2 sm:gap-4"
            >
              {preview ? (
                <div className="flex flex-col gap-2">
                  <img
                    src={preview}
                    alt="image-preview"
                    className="w-24 h-24 mx-auto p-2 rounded-full border-2 object-cover object-center lg:h-16 lg:w-16"
                  />
                  <div className="flex items-center justify-center gap-2">
                    <Label id="file" className="cursor-pointer">
                      <Image />
                      <Input
                        id="file"
                        type="file"
                        accept="/image/*"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setAvatar(file);
                            setPreview(URL.createObjectURL(file));
                          }
                        }}
                        placeholder="johndoe@gmail.com"
                        className="hidden"
                      />
                    </Label>
                    <ImageOff
                      className="cursor-pointer"
                      onClick={() => {
                        setPreview(null);
                        setAvatar(null);
                      }}
                    />
                  </div>
                </div>
              ) : (
                <Label
                  id="file"
                  className={
                    type === "login"
                      ? "hidden"
                      : type === "signup"
                        ? "flex flex-col gap-2 items-center border-2 cursor-pointer p-4 rounded-full w-fit mx-auto"
                        : "Authentication description"
                  }
                >
                  <Image />
                  <span>Avatar</span>
                  <Input
                    id="file"
                    type="file"
                    accept="/image/*"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setAvatar(file);
                        setPreview(URL.createObjectURL(file));
                      }
                    }}
                    placeholder="johndoe@gmail.com"
                    className="hidden"
                  />
                </Label>
              )}
              <Label htmlFor="email">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </Label>
              <Input
                value={email}
                name="email"
                type="email"
                autoComplete="username"
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                placeholder="johndoe@gmail.com"
              />
              <Label htmlFor="password">
                <Key className="w-4 h-4" />
                <span>Password</span>
              </Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                name="password"
                autoComplete={
                  type === "signup" ? "new-password" : "current-password"
                }
                placeholder="strong-password"
              />

              {type === "login" ? (
                <Button disabled={loading} className="disabled:bg-mute">
                  Sign in
                </Button>
              ) : type === "signup" ? (
                <Button disabled={loading} className="disabled:bg-mute">
                  Create account
                </Button>
              ) : (
                "Authentication description"
              )}
            </form>

            {error && (
              <div className="flex items-center gap-2 text-red-500 border-2 rounded p-2 my-3 justify-center text-sm">
                <Info />
                {error}
              </div>
            )}
            <div className="w-full my-2 flex flex-col gap-2">
              <span className="text-center">Or continue with</span>
              <Button onClick={() => signIn("google")}>Google</Button>
            </div>
          </CardContent>
          <CardFooter className="text-center text-xs sm:text-sm">
            Recipe Auth &copy; Recipe House. All rights reserved.
          </CardFooter>
        </CardHeader>
      </Card>
    </div>
  );
}
