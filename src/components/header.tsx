"use client";
import Link from "next/link";
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
        <div>
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
