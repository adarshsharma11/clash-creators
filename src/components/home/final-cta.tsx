"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface FinalCTAProps {
  clashHref: string;
}

export function FinalCTA({ clashHref }: FinalCTAProps) {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden rounded-3xl mb-12">
      <div className="absolute inset-0 bg-primary z-0"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 z-0"></div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-8 text-center flex flex-col items-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary-foreground mb-6"
        >
          READY TO ENTER <br className="hidden sm:block" />
          THE CLASH?
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mb-10"
        >
          Your favorite creator could be tomorrow&apos;s champion. Join the community and make your vote count.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button size="lg" className="h-14 px-10 text-lg font-bold bg-background text-foreground hover:bg-background/90 shadow-xl" asChild>
            <Link href={clashHref}>Explore Today&apos;s Clash</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
