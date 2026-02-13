"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";

interface AuthTypes {
  email: string;
  password: string;
  avatar?: File | null;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setAvatar?: (avatar: File | null) => void;
  setPreview?: (preview: string | null) => void;
  type: "login" | "signup";
}

export const useAuth = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const resetFields = (data: AuthTypes) => {
    data.setEmail("");
    data.setPassword("");
    data.setAvatar?.(null);
    data.setPreview?.(null);
  };

  const authenticate = async (data: AuthTypes) => {
    const { email, password, avatar, type } = data;

    setLoading(true);
    setError(null);

    try {
      if (type === "login") {
        const res = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (!res || res.error) {
          setError(res?.error || "Invalid email or password");
          return;
        }

        resetFields(data);
        router.push("/recipe");
        return;
      }

      if (type === "signup") {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        if (avatar) formData.append("avatar", avatar);

        const response = await fetch("/api/auth/signup", {
          method: "POST",
          body: formData,
        });

        const json = await response.json();

        if (!response.ok) {
          setError(json?.message || "Signup failed");
          return;
        } else {
          resetFields(data);
          console.log(json);
        }

        const res = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (res?.error) {
          setError(res.error);
          return;
        }

        resetFields(data);
        router.push("/recipe");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return { authenticate, loading, error, setError };
};
