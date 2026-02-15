"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { House, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  return (
    <nav className="p-2 flex items-center justify-between border-b">
      <Link
        href={session?.user ? "/recipe" : "/"}
        className="flex items-center gap-2"
      >
        <House className="w-4 h-4" />
        <h1 className="font-semibold">Recipe House</h1>
      </Link>
      {session?.user ? (
        <div className="flex items-center gap-2">
          <div className="relative">
            <Image
              className="w-12 h-12 rounded-full border-2 p-1"
              src={session?.user?.avatar!}
              alt={session?.user?.email!}
              priority={true}
            />
          </div>
          <Button
            className="flex items-center gap-2 cursor-pointer"
            variant="outline"
            onClick={() => signOut()}
          >
            <LogOut />
            <span>Log out</span>
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/auth/login" className="text-sm">
              Sign in
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/auth/signup" className="text-sm">
              Get started
            </Link>
          </Button>
        </div>
      )}
    </nav>
  );
}
