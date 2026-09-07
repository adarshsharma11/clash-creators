"use client";

import { useReducedMotion } from "motion/react";
import { JoinClashForm } from "./join-clash-form";
import { JoinClashHero } from "./join-clash-hero";

export function JoinClashExperience() {
  const reduceMotion = useReducedMotion();

  const handleStart = () => {
    const form = document.getElementById("join-clash-form");
    form?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });

    const firstField = document.getElementById("display-name");
    firstField?.focus();
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-8 sm:py-16">
      <JoinClashHero onStart={handleStart} />
      <JoinClashForm />
    </div>
  );
}
