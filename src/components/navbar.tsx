"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { AnimatePresence } from "motion/react";
import { useTheme } from "next-themes";
import {
  BookmarkCheck,
  Menu,
  Moon,
  Salad,
  Soup,
  Sun,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import ProfileModal from "./profile-modal";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";

type MenuLink = { label: string; href: string; icon?: LucideIcon };

const publicLinks: MenuLink[] = [
  { label: "How it works", href: "/#how-it-works" },
];

const recipeLinks: MenuLink[] = [
  { label: "Recipes", href: "/recipe", icon: Salad },
  { label: "Create", href: "/recipe/create", icon: Soup },
  { label: "My recipes", href: "/recipe/my-recipes", icon: BookmarkCheck },
];

export default function Navbar() {
  const { data: session } = useSession();
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const [openProfile, setOpenProfile] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const links = session?.user ? recipeLinks : publicLinks;

  const linkClass = (href: string) =>
    `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition-colors hover:bg-[#f2f6df] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#71934d] dark:hover:bg-[#34452b] ${
      pathname === href ? "text-[#5b8d35] dark:text-[#b8df8c]" : ""
    }`;

  return (
    <header className="relative z-40 border-b-2 border-[#e5e3d6] bg-[#fffdf7] text-[#263522] dark:border-[#394632] dark:bg-[#151b13] dark:text-[#f1f3e9]">
      <AnimatePresence>
        {openProfile && <ProfileModal setOpenProfile={setOpenProfile} />}
      </AnimatePresence>

      <div className="mx-auto flex min-h-[76px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href={session?.user ? "/recipe" : "/"}
          aria-label="Recipely home"
          className="relative block h-16 w-32 shrink-0 sm:w-40"
        >
          <Image
            src="/Recipely Fresh Chef Logo.png"
            alt="Recipely"
            fill
            priority
            sizes="(min-width: 640px) 160px, 128px"
            className="object-contain object-left"
          />
        </Link>

        <NavigationMenu
          viewport={false}
          className="hidden flex-1 justify-center md:flex"
        >
          <NavigationMenuList className="gap-1">
            {links.map(({ label, href, icon: Icon }) => (
              <NavigationMenuItem key={href}>
                <NavigationMenuLink asChild>
                  <Link href={href} className={linkClass(href)}>
                    {Icon && (
                      <Icon className="h-4 w-4 text-[#71934d] dark:text-[#a8cf7b]" />
                    )}
                    {label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl text-[#526345] hover:bg-[#f2f6df] dark:text-[#d1dbc8] dark:hover:bg-[#34452b]"
            aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            <Sun className="hidden h-5 w-5 dark:block" />
            <Moon className="h-5 w-5 dark:hidden" />
          </Button>

          {session?.user ? (
            <button
              type="button"
              onClick={() => setOpenProfile(true)}
              aria-label="Open profile"
              className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border-2 border-[#263522] bg-[#f2f6df] text-[#526345] transition-colors hover:bg-[#dff0bd] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#71934d] dark:border-[#879879] dark:bg-[#263323] dark:text-[#d1dbc8] dark:hover:bg-[#34452b]"
            >
              {session.user.avatar ? (
                <Image
                  src={session.user.avatar}
                  alt=""
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound className="h-5 w-5" />
              )}
            </button>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/signin"
                className="rounded-xl px-3 py-2 text-sm font-bold text-[#526345] transition-colors hover:bg-[#f2f6df] dark:text-[#d1dbc8] dark:hover:bg-[#34452b]"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-xl border-2 border-[#263522] bg-[#a8d75c] px-4 py-2 text-sm font-extrabold text-[#263522] transition-colors hover:bg-[#b9e477] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#71934d] dark:border-[#8ca273] dark:text-[#172112]"
              >
                Get started
              </Link>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl text-[#526345] hover:bg-[#f2f6df] dark:text-[#d1dbc8] dark:hover:bg-[#34452b] md:hidden"
            aria-label={openMenu ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={openMenu}
            aria-controls="mobile-navigation"
            onClick={() => setOpenMenu((open) => !open)}
          >
            {openMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {openMenu && (
        <div
          id="mobile-navigation"
          className="border-t-2 border-[#e5e3d6] bg-[#fffdf7] px-4 py-4 dark:border-[#394632] dark:bg-[#151b13] md:hidden"
        >
          <NavigationMenu
            viewport={false}
            orientation="vertical"
            className="max-w-none justify-start"
          >
            <NavigationMenuList className="w-full flex-col items-stretch gap-1">
              {links.map(({ label, href, icon: Icon }) => (
                <NavigationMenuItem key={href} className="w-full">
                  <NavigationMenuLink asChild>
                    <Link
                      href={href}
                      className={linkClass(href)}
                      onClick={() => setOpenMenu(false)}
                    >
                      {Icon && (
                        <Icon className="h-5 w-5 text-[#71934d] dark:text-[#a8cf7b]" />
                      )}
                      {label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
              {!session?.user && (
                <NavigationMenuItem className="mt-2 grid w-full grid-cols-2 gap-2 border-t border-[#e5e3d6] pt-3 dark:border-[#394632]">
                  <NavigationMenuLink asChild>
                    <Link
                      href="/signin"
                      className="justify-center rounded-xl border-2 border-[#d8ddce] px-3 py-2 font-bold dark:border-[#52604b]"
                      onClick={() => setOpenMenu(false)}
                    >
                      Sign in
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/signup"
                      className="justify-center rounded-xl border-2 border-[#263522] bg-[#a8d75c] px-3 py-2 font-extrabold text-[#263522] dark:border-[#8ca273] dark:text-[#172112]"
                      onClick={() => setOpenMenu(false)}
                    >
                      Get started
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      )}
    </header>
  );
}
