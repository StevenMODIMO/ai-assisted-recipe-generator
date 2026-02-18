"use client";

import React from "react";
import { Card } from "./ui/card";
import MarkdownViewer from "./markdown";
import { motion } from "motion/react";
import Image from "next/image";

export default function AiResponse({
  response,
  setResponseModal,
}: {
  response: string;
  setResponseModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div
      onClick={() => setResponseModal(false)}
      className="absolute top-0 left-0 w-full h-full sm:bg-black/50 text-purple-500 backdrop-blur z-10 sm:flex sm:justify-end overflow-hidden"
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white sm:w-[50%] h-full overflow-y-auto px-6 py-3"
      >
        <header className="flex items-center gap-2">
          <div className="relative w-6 h-6">
            <Image src="/googlegemini.svg" alt="image" fill />
          </div>
          <span>RecipeMind</span>
        </header>
        <div>
          <MarkdownViewer markdown={response} />
        </div>
      </motion.div>
    </div>
  );
}
