"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  BookmarkCheck,
  ChefHat,
  Clock3,
  CookingPot,
  Sparkles,
} from "lucide-react";

const cravings = [
  { name: "Cozy", emoji: "🍲", dish: "A big bowl of comfort", color: "bg-[#f5b96b]" },
  { name: "Fresh", emoji: "🥗", dish: "Something garden-fresh", color: "bg-[#b8d779]" },
  { name: "Surprise me", emoji: "🍝", dish: "A little kitchen magic", color: "bg-[#ed9e91]" },
];

const features = [
  {
    icon: CookingPot,
    title: "Use what you have",
    description: "Pop in an ingredient and find something delicious to make.",
    color: "bg-[#dff0bd]",
  },
  {
    icon: Sparkles,
    title: "Make it your own",
    description: "Ask AI to remix a recipe around your taste and your table.",
    color: "bg-[#ffe1b6]",
  },
  {
    icon: BookmarkCheck,
    title: "Keep the good ones",
    description: "Save your new favorites so they’re ready for next time.",
    color: "bg-[#f8d7d0]",
  },
];

export default function LandingPage() {
  const [craving, setCraving] = useState(cravings[0]);

  return (
    <main className="overflow-hidden bg-[#fffdf7] text-[#263522] transition-colors duration-300 dark:bg-[#151b13] dark:text-[#f1f3e9]">
      <section className="mx-auto grid min-h-[620px] max-w-6xl items-center gap-12 px-6 pb-16 pt-8 md:grid-cols-2 md:gap-8 md:pb-24 md:pt-12">
        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-[#263522] bg-[#f2f6df] px-4 py-2 text-sm font-bold shadow-[3px_3px_0_#263522] dark:border-[#879879] dark:bg-[#263323] dark:shadow-[3px_3px_0_#080c07]">
            <span aria-hidden="true">🌱</span>
            A little more joy in your kitchen
          </div>
          <h1 className="max-w-xl text-5xl font-black leading-[0.98] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
            Good food
            <br />
            starts with
            <br />
            <span className="relative inline-block text-[#5b8d35]">
              what you’ve got.
              <span className="absolute -bottom-1 left-0 -z-10 h-3 w-full -rotate-2 rounded-full bg-[#f8c46b]" />
            </span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-[#64705a] dark:text-[#b5c0aa]">
            Meet your cheerful kitchen sidekick. Find recipes, get creative with
            AI, and make something lovely out of what’s already in your fridge.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/recipe/create"
              className="group inline-flex items-center gap-3 rounded-2xl border-2 border-[#263522] bg-[#a8d75c] px-6 py-4 font-extrabold shadow-[4px_4px_0_#263522] transition hover:-translate-y-1 hover:shadow-[6px_6px_0_#263522] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5b8d35] dark:border-[#8ca273] dark:text-[#172112] dark:shadow-[4px_4px_0_#080c07] dark:hover:shadow-[6px_6px_0_#080c07]"
            >
              Let’s cook
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/signin"
              className="rounded-xl px-3 py-3 font-bold text-[#526345] underline decoration-[#a8d75c] decoration-2 underline-offset-4 transition hover:text-[#263522] dark:text-[#d1dbc8] dark:hover:text-white"
            >
              I have an account
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-[#78806c] dark:text-[#aab69e]">
            <span className="flex -space-x-2" aria-hidden="true">
              <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#fffdf7] bg-[#f5b96b] dark:border-[#151b13]">🥑</span>
              <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#fffdf7] bg-[#f8d7d0] dark:border-[#151b13]">🍓</span>
              <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#fffdf7] bg-[#dff0bd] dark:border-[#151b13]">🍋</span>
            </span>
            Less meal stress. More “mmm.”
          </div>
        </div>

        <div className="relative mx-auto flex h-[410px] w-full max-w-[500px] items-center justify-center sm:h-[480px]">
          <div className="absolute h-[330px] w-[330px] rounded-full bg-[#f8e9ba] sm:h-[390px] sm:w-[390px] dark:bg-[#51452c]" />
          <div className="absolute right-8 top-8 rotate-12 rounded-2xl border-2 border-[#263522] bg-white px-4 py-3 text-sm font-extrabold shadow-[3px_3px_0_#263522] sm:right-2 sm:top-10 dark:border-[#879879] dark:bg-[#263323] dark:shadow-[3px_3px_0_#080c07]">
            <span className="mr-2">✨</span> zero stress cooking
          </div>
          <div className="absolute left-1 top-20 -rotate-12 text-5xl sm:left-4 sm:top-16" aria-hidden="true">🍅</div>
          <div className="absolute bottom-16 right-3 rotate-12 text-5xl sm:bottom-20 sm:right-1" aria-hidden="true">🥕</div>
          <div className="absolute bottom-10 left-8 -rotate-12 text-4xl sm:bottom-12 sm:left-12" aria-hidden="true">🌿</div>

          <div className="relative w-[290px] rotate-[-3deg] rounded-[2rem] border-[3px] border-[#263522] bg-white p-5 shadow-[9px_10px_0_#263522] transition-transform duration-300 hover:rotate-0 sm:w-[340px] sm:p-6 dark:border-[#879879] dark:bg-[#20291e] dark:shadow-[9px_10px_0_#080c07]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#879276] dark:text-[#aab69e]">Today’s craving</p>
                <p className="mt-1 text-xl font-black">{craving.dish}</p>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#fff0d9] text-2xl dark:bg-[#493b28]" aria-hidden="true">💛</span>
            </div>
            <div className={`relative mt-5 grid h-48 place-items-center overflow-hidden rounded-[1.5rem] border-2 border-[#263522] ${craving.color}`}>
              <span className="absolute -left-3 top-4 text-4xl" aria-hidden="true">✨</span>
              <span className="absolute right-4 top-3 text-3xl" aria-hidden="true">✦</span>
              <div className="grid h-36 w-36 place-items-center rounded-full border-[10px] border-white/80 bg-[#fffdf7] text-7xl shadow-inner transition-transform duration-300 hover:scale-110 dark:border-[#34412f] dark:bg-[#20291e]" aria-live="polite">
                {craving.emoji}
              </div>
              <span className="absolute bottom-2 left-4 text-2xl" aria-hidden="true">✳</span>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm font-bold text-[#65715b] dark:text-[#b5c0aa]">
              <span className="flex items-center gap-1"><Clock3 className="h-4 w-4" /> Weeknight-friendly</span>
              <span className="rounded-full bg-[#edf4df] px-3 py-1 text-[#527c34] dark:bg-[#34452b] dark:text-[#c5e89b]">Yum!</span>
            </div>
          </div>
          <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border-2 border-[#263522] bg-white p-2 shadow-[3px_3px_0_#263522] dark:border-[#879879] dark:bg-[#20291e] dark:shadow-[3px_3px_0_#080c07]">
            {cravings.map((option) => (
              <button
                key={option.name}
                type="button"
                onClick={() => setCraving(option)}
                aria-pressed={craving.name === option.name}
                aria-label={`Choose ${option.name.toLowerCase()} craving`}
                className={`grid h-11 w-11 place-items-center rounded-full text-xl transition hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b8d35] ${
                  craving.name === option.name ? option.color : "bg-transparent"
                }`}
              >
                {option.emoji}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-y-2 border-[#263522] bg-[#f7f5e9] px-6 py-16 sm:py-20 dark:border-[#394632] dark:bg-[#1b2318]">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-sm font-extrabold uppercase tracking-[0.18em] text-[#71934d] dark:text-[#a8cf7b]">Your kitchen, but easier</p>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Three little steps to yum.</h2>
            </div>
            <p className="max-w-sm text-[#64705a] dark:text-[#b5c0aa]">No fancy skills needed. Just bring your appetite.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description, color }, index) => (
              <article
                key={title}
                className="rounded-3xl border-2 border-[#263522] bg-white p-6 shadow-[4px_4px_0_#263522] transition hover:-translate-y-1 hover:shadow-[6px_6px_0_#263522] dark:border-[#52604b] dark:bg-[#20291e] dark:shadow-[4px_4px_0_#080c07] dark:hover:shadow-[6px_6px_0_#080c07]"
              >
                <div className={`mb-5 grid h-14 w-14 place-items-center rounded-2xl border-2 border-[#263522] ${color} dark:border-[#879879]`}>
                  <Icon className="h-7 w-7 text-[#263522]" strokeWidth={2.5} />
                </div>
                <p className="mb-2 text-xs font-extrabold uppercase tracking-widest text-[#7b876d] dark:text-[#aab69e]">0{index + 1}</p>
                <h3 className="text-xl font-black">{title}</h3>
                <p className="mt-2 leading-7 text-[#64705a] dark:text-[#b5c0aa]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-6 py-16 text-center sm:py-20">
        <div className="grid h-14 w-14 place-items-center rounded-full border-2 border-[#263522] bg-[#ffe1b6] shadow-[3px_3px_0_#263522] dark:border-[#879879] dark:shadow-[3px_3px_0_#080c07]">
          <ChefHat className="h-7 w-7 text-[#263522]" />
        </div>
        <h2 className="max-w-xl text-3xl font-black tracking-tight sm:text-4xl">Your next “I made this!” moment is waiting.</h2>
        <p className="max-w-md leading-7 text-[#64705a] dark:text-[#b5c0aa]">Open the fridge. Pick an ingredient. We’ll take it from there.</p>
        <Link
          href="/recipe/create"
          className="group mt-2 inline-flex items-center gap-2 rounded-2xl border-2 border-[#263522] bg-[#a8d75c] px-6 py-4 font-extrabold shadow-[4px_4px_0_#263522] transition hover:-translate-y-1 hover:shadow-[6px_6px_0_#263522] dark:border-[#8ca273] dark:text-[#172112] dark:shadow-[4px_4px_0_#080c07] dark:hover:shadow-[6px_6px_0_#080c07]"
        >
          Find your next favorite <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
        <Link href="#how-it-works" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#78806c] hover:text-[#263522] dark:text-[#aab69e] dark:hover:text-white">
          How it works <ArrowDown className="h-4 w-4" />
        </Link>
      </section>
    </main>
  );
}
