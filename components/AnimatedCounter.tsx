"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

export default function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  
  // Parse strings like "15+", "100K+", "24/7"
  const match = value.match(/^(\d+)(.*)$/);
  const targetNumber = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : value;
  const isNumber = targetNumber !== null;

  useEffect(() => {
    if (inView && isNumber && ref.current) {
      const controls = animate(0, targetNumber, {
        duration: 2, // Smooth 2 second animation
        ease: "easeOut",
        onUpdate: (latest) => {
          if (ref.current) {
            ref.current.textContent = Math.floor(latest).toString() + suffix;
          }
        },
      });
      
      return () => controls.stop();
    }
  }, [inView, targetNumber, suffix, isNumber]);

  return (
    <span ref={ref}>
      {/* If it's a number to animate, start at 0. Otherwise just render the string */}
      {!isNumber ? value : `0${suffix}`}
    </span>
  );
}
