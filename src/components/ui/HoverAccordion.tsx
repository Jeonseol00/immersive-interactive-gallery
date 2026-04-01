"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface AccordionItem {
  id: string;
  title: string;
  description: string;
}

interface HoverAccordionProps {
  items: AccordionItem[];
}

export function HoverAccordion({ items }: HoverAccordionProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id);
  const prefersReducedMotion = useReducedMotion();

  // On Mobile, this component stacks vertically. 
  // On Desktop, it stacks horizontally and expands on hover.

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full md:h-[400px]">
      {items.map((item) => {
        const isActive = activeId === item.id;
        
        return (
          <div
            key={item.id}
            onMouseEnter={() => {
              // Only trigger on desktop (>768px assumed via standard CSS max-width rules ideally)
              // But React relies on JS, so we check window state if we really want to isolate
              if (window.innerWidth >= 768) {
                setActiveId(item.id);
              }
            }}
            onClick={() => setActiveId(item.id)}
            className={cn(
              "relative border flex flex-col justify-end p-6 rounded-2xl cursor-pointer border-neutral-800 bg-neutral-900 group",
              prefersReducedMotion ? "transition-none" : "transition-all duration-500 ease-[cubic-bezier(0.25, 1, 0.5, 1)]",
              isActive 
                ? "md:grow-[3] border-white/40 h-auto" 
                : "flex-1 md:grow-[1] border-white/5 opacity-70 hover:opacity-100"
            )}
          >
            <div className={cn(
               "pointer-events-none mb-0 transition-opacity duration-300", 
               isActive ? "opacity-100 delay-200" : "opacity-0 hidden md:block"
            )}>
              <span className="text-amber-400 font-bold mb-2 uppercase text-xs tracking-widest">{item.title}</span>
              <p className="text-sm md:text-base text-neutral-300 line-clamp-3">
                {item.description}
              </p>
            </div>
            {/* Show title always when collapsed horizontally on desktop? Or just vertical text */}
            <div className={cn(
                "absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300",
                isActive ? "opacity-0" : "opacity-100 hidden md:flex"
            )}>
                <span className="font-bold whitespace-nowrap -rotate-90 tracking-widest text-neutral-500 uppercase">
                    {item.title}
                </span>
            </div>
             {/* Mobile view Title - visible when inactive on mobile */}
             <div className={cn(
                "md:hidden my-4 min-h-12 w-full",
                isActive ? "hidden" : "block"
            )}>
                <span className="font-bold tracking-wide text-neutral-400 uppercase">
                    {item.title}
                </span>
            </div>

          </div>
        );
      })}
    </div>
  );
}
