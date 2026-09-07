"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Search, Heart, Trophy } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Discover",
      description: "Find today's live creator battle and see who's competing for the crown.",
      icon: Search,
    },
    {
      number: "02",
      title: "Support",
      description: "Back your favorite creators to push them up the leaderboard in real time.",
      icon: Heart,
    },
    {
      number: "03",
      title: "Crown",
      description: "Watch the dramatic finish as the 24-hour clock runs out and a champion is crowned.",
      icon: Trophy,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 border-t border-border/40 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] -z-10"></div>
      
      <div className="mb-16 text-center">
        <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">How It Works</h3>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          The ultimate 24-hour creator showdown.{" "}
          <Link href="/rules" className="font-semibold text-primary hover:text-primary/80">
            Read the rules
          </Link>
          .
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
        <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-border -z-10"></div>
        
        {steps.map((step, index) => (
          <motion.div 
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="flex flex-col items-center text-center relative"
          >
            <div className="h-24 w-24 rounded-2xl bg-card border border-border shadow-xl flex items-center justify-center mb-6 relative">
              <step.icon className="h-10 w-10 text-primary" />
              <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-xs">
                {step.number}
              </div>
            </div>
            
            <h4 className="text-2xl font-bold mb-3">{step.title}</h4>
            <p className="text-muted-foreground leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
