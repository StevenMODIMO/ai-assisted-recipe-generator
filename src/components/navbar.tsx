"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { Moon, Sun, User } from "lucide-react";
import { useSession } from "next-auth/react";
import ProfileModal from "./profile-modal";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { useTheme } from "next-themes";
import RecipeHeader from "./recipe-header";

export default function Navbar() {
  const { data: session } = useSession();
  const { resolvedTheme, setTheme } = useTheme();
  const [openProfile, setOpenProfile] = useState(false);

  return (
    <nav className="flex items-center justify-between">
      <AnimatePresence>
        {openProfile && <ProfileModal setOpenProfile={setOpenProfile} />}
      </AnimatePresence>
      <Link
        href={session?.user ? "/recipe" : "/"}
        className="flex items-center gap-2"
      >
        {/* <House className="w-4 h-4 text-purple-500" /> */}
        <div className="relative w-40 h-24">
          <Image
            src="/Recipely Fresh Chef Logo.png"
            alt="Recipely Fresh Chef Logo.png"
            fill
          />
        </div>
      </Link>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle color theme"
          title="Toggle color theme"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          <Sun className="hidden dark:block" />
          <Moon className="block dark:hidden" />
        </Button>
        {session?.user ? (
          <>
            <RecipeHeader />
            {session?.user.avatar ? (
              <div
                className="relative w-12 h-12 cursor-pointer"
                onClick={() => setOpenProfile(true)}
              >
                <Image
                  className="absolute rounded-full border-2 p-1"
                  src={session?.user?.avatar!}
                  alt={session?.user?.email!}
                  fill
                />
              </div>
            ) : (
              <div
                className="rounded-full border-2 p-1"
                onClick={() => setOpenProfile(true)}
              >
                <User />
              </div>
            )}
          </>
        ) : (
          <>
            <Button className="cursor-pointer" asChild>
              <Link href="/signin" className="text-sm">
                Sign in
              </Link>
            </Button>
            <Button className="cursor-pointer" asChild>
              <Link href="/signup" className="text-sm">
                Get started
              </Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
