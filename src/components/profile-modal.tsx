"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import Image from "next/image";
import { X, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
import { signOut } from "next-auth/react";

export default function ProfileModal({
  setOpenProfile,
}: {
  setOpenProfile: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const deleteHandler = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/auth/signup/${id}`, {
        method: "DELETE",
      });
      const json = await response.json();

      if (response.ok) {
        signOut();
      } else {
        setLoading(false);
        console.log(json);
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <div
      onClick={() => setOpenProfile(false)}
      className="absolute top-0 left-0 w-full h-full sm:bg-black/10 text-white backdrop-blur- z-10 sm:flex sm:justify-end overflow-hidden"
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onClick={(e) => e.stopPropagation()}
        className="sm:w-[50%] h-full bg-white text-black p-4 lg:w-[25%] overflow-hidden"
      >
        <X className="cursor-pointer" onClick={() => setOpenProfile(false)} />
        <Card className="flex flex-col my-2">
          <CardHeader>
            {session?.user.avatar && (
              <div className="relative w-32 h-32 mx-auto">
                <Image
                  src={session?.user.avatar!}
                  alt={session?.user.email!}
                  fill
                  className="border-4 p-2 rounded-full"
                />
              </div>
            )}
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <h1 className="font-semibold text-base">{session?.user.email}</h1>
            <h2 className="text-xs">{session?.user.id}</h2>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button
              onClick={() => signOut()}
              className="w-full cursor-pointer disabled:cursor-not-allowed"
              variant="outline"
            >
              Sign out
            </Button>
            <Button
              disabled={loading}
              onClick={() => deleteHandler(session?.user.id!)}
              className="w-full disabled:bg-mute cursor-pointer disabled:cursor-not-allowed"
              variant="destructive"
            >
              {loading ? "Please wait ..." : "Delete Account"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
