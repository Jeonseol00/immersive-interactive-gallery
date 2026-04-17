"use client";

import dynamic from "next/dynamic";

// Lazy-load AI Curator: defers ~80KB JS until user interacts with the Orb
const AICuratorChat = dynamic(
  () => import("@/components/ui/AICuratorChat").then(mod => ({ default: mod.AICuratorChat })),
  { ssr: false }
);

export function LazyAICurator() {
  return <AICuratorChat />;
}
