"use client";

import Image from "next/image";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, LoaderCircle, LogOut, Trash2, UserRound, X } from "lucide-react";
import { Button } from "./ui/button";

type ProfileModalProps = {
  setOpenProfile: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ProfileModal({ setOpenProfile }: ProfileModalProps) {
  const { data: session } = useSession();
  const [action, setAction] = useState<"signout" | "delete" | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setError(null);
    setAction("signout");
    try {
      await signOut({ callbackUrl: "/signin" });
    } catch {
      setError("We couldn’t sign you out. Please try again.");
      setAction(null);
    }
  };

  const handleDelete = async () => {
    const userId = session?.user?.id;
    if (!userId) {
      setError("We couldn’t verify your account. Please sign in again.");
      return;
    }

    setError(null);
    setAction("delete");
    try {
      const response = await fetch(`/api/auth/signup/${encodeURIComponent(userId)}`, {
        method: "DELETE",
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "We couldn’t delete your account. Please try again.");
      }

      await signOut({ callbackUrl: "/" });
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "We couldn’t delete your account. Please try again.",
      );
      setAction(null);
    }
  };

  const busy = action !== null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-[#263522]/45 backdrop-blur-sm dark:bg-black/60"
      onClick={() => !busy && setOpenProfile(false)}
      onKeyDown={(event) => {
        if (event.key === "Escape" && !busy) setOpenProfile(false);
      }}
    >
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-title"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        onClick={(event) => event.stopPropagation()}
        className="ml-auto flex h-full w-full max-w-md flex-col overflow-y-auto border-l-2 border-[#263522] bg-[#fffdf7] p-5 text-[#263522] shadow-[-12px_0_40px_rgba(20,30,15,0.18)] sm:p-7 dark:border-[#52604b] dark:bg-[#151b13] dark:text-[#f1f3e9]"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#71934d] dark:text-[#a8cf7b]">
              Your kitchen
            </p>
            <h2 id="profile-title" className="mt-1 text-2xl font-black tracking-tight">
              Your profile
            </h2>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close profile"
            disabled={busy}
            onClick={() => setOpenProfile(false)}
            className="h-10 w-10 rounded-xl text-[#526345] hover:bg-[#f2f6df] dark:text-[#d1dbc8] dark:hover:bg-[#34452b]"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="mt-8 rounded-[1.5rem] border-2 border-[#263522] bg-white p-5 shadow-[4px_4px_0_#263522] dark:border-[#52604b] dark:bg-[#20291e] dark:shadow-[4px_4px_0_#080c07]">
          <div className="flex flex-col items-center text-center">
            {session?.user?.avatar ? (
              <Image
                src={session.user.avatar}
                alt=""
                width={88}
                height={88}
                className="h-22 w-22 rounded-full border-4 border-[#dff0bd] object-cover dark:border-[#34452b]"
              />
            ) : (
              <span className="grid h-22 w-22 place-items-center rounded-full border-4 border-[#dff0bd] bg-[#f2f6df] text-[#71934d] dark:border-[#34452b] dark:bg-[#263323] dark:text-[#a8cf7b]">
                <UserRound className="h-9 w-9" />
              </span>
            )}
            <p className="mt-4 break-all text-base font-extrabold">
              {session?.user?.email || "Signed-in account"}
            </p>
            <p className="mt-1 text-sm text-[#78806c] dark:text-[#aab69e]">
              Account settings
            </p>
          </div>

          <div className="mt-6 border-t-2 border-dashed border-[#e5e3d6] pt-4 dark:border-[#394632]">
            <p className="text-xs font-bold uppercase tracking-wider text-[#78806c] dark:text-[#aab69e]">
              Account ID
            </p>
            <p className="mt-1 break-all font-mono text-xs text-[#526345] dark:text-[#d1dbc8]">
              {session?.user?.id || "Unavailable"}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-extrabold">Account actions</h3>
          <p className="mt-1 text-sm text-[#64705a] dark:text-[#b5c0aa]">
            Manage your session or permanently remove your account.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={handleSignOut}
              className="h-11 w-full justify-center gap-2 rounded-xl border-2 border-[#d8ddce] bg-white font-extrabold text-[#263522] hover:bg-[#f2f6df] dark:border-[#52604b] dark:bg-[#20291e] dark:text-[#f1f3e9] dark:hover:bg-[#34452b]"
            >
              {action === "signout" ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              {action === "signout" ? "Signing out…" : "Sign out"}
            </Button>

            {confirmDelete ? (
              <div className="rounded-xl border-2 border-[#e4b7a9] bg-[#fff4ef] p-4 dark:border-[#78483d] dark:bg-[#35221e]">
                <p className="text-sm font-extrabold text-[#8d3828] dark:text-[#f1b5a4]">
                  Delete your account permanently?
                </p>
                <p className="mt-1 text-xs text-[#80582a] dark:text-[#e3c198]">
                  This action can’t be undone.
                </p>
                <div className="mt-3 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={busy}
                    onClick={() => setConfirmDelete(false)}
                    className="h-10 flex-1 rounded-xl border-[#d8ddce] bg-white font-bold dark:border-[#52604b] dark:bg-[#20291e]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={busy}
                    onClick={handleDelete}
                    className="h-10 flex-1 rounded-xl font-extrabold"
                  >
                    {action === "delete" ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    {action === "delete" ? "Deleting…" : "Delete account"}
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                type="button"
                variant="destructive"
                disabled={busy}
                onClick={() => setConfirmDelete(true)}
                className="h-11 w-full justify-center gap-2 rounded-xl font-extrabold"
              >
                <Trash2 className="h-4 w-4" />
                Delete account
              </Button>
            )}
          </div>
          <AnimatePresence>
            {error && (
              <motion.p
                role="alert"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-4 flex items-start gap-2 rounded-xl border border-[#e4b7a9] bg-[#fff4ef] p-3 text-sm font-semibold text-[#8d3828] dark:border-[#78483d] dark:bg-[#35221e] dark:text-[#f1b5a4]"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.section>
    </div>
  );
}
