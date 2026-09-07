"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "motion/react";
import { formatPoints } from "@/lib/formatters";

interface AnimatedPointsProps {
  value: number;
  className?: string;
  prefix?: string;
  animateFromZero?: boolean;
}

export function AnimatedPoints({
  value,
  className,
  prefix = "",
  animateFromZero = false,
}: AnimatedPointsProps) {
  const reduceMotion = useReducedMotion();
  const fromRef = useRef(animateFromZero ? 0 : value);
  const [display, setDisplay] = useState(animateFromZero && !reduceMotion ? 0 : value);

  useEffect(() => {
    const from = fromRef.current;
    fromRef.current = value;

    if (reduceMotion || from === value) {
      setDisplay(value);
      return;
    }

    const controls = animate(from, value, {
      duration: 0.55,
      ease: "easeOut",
      onUpdate: (latest) => {
        setDisplay(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [value, reduceMotion]);

  return <span className={className}>{`${prefix}${formatPoints(display)}`}</span>;
}
