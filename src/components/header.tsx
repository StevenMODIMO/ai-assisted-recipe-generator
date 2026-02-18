"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { House, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import ProfileModal from "./profile-modal";
import { useState } from "react";
import { AnimatePresence } from "motion/react";

export default function Header() {
  const { data: session } = useSession();
  const [openProfile, setOpenProfile] = useState(false);
  return (
    <nav className="p-2 flex items-center justify-between border-b">
      <AnimatePresence>
        {openProfile && <ProfileModal setOpenProfile={setOpenProfile} />}
      </AnimatePresence>
      <Link
        href={session?.user ? "/recipe" : "/"}
        className="flex items-center gap-2"
      >
        <House className="w-4 h-4 text-purple-500" />
        <h1 className="font-semibold">Recipe House</h1>
      </Link>
      {session?.user ? (
        <div className="flex items-center gap-2">
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
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button className="cursor-pointer" asChild variant="outline">
            <Link href="/auth/login" className="text-sm">
              Sign in
            </Link>
          </Button>
          <Button className="cursor-pointer" asChild variant="outline">
            <Link href="/auth/signup" className="text-sm">
              Get started
            </Link>
          </Button>
        </div>
      )}
    </nav>
  );
}
