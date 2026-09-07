"use client";

import { motion, useReducedMotion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface JoinClashHeroProps {
  onStart: () => void;
}

export function JoinClashHero({ onStart }: JoinClashHeroProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.header
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-10 text-center"
    >
      <Badge className="mb-5 bg-primary/15 text-primary hover:bg-primary/15">
        FOR CREATORS
      </Badge>
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
        Ready to enter the Clash?
      </h1>
      <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
        Bring your audience, enter the competition, and see where you stand.
      </p>
      <Button size="lg" className="h-12 px-8 font-bold" onClick={onStart}>
        Start Your Clash
      </Button>
    </motion.header>
  );
}
