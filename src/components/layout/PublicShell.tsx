"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

/**
 * Wrapper that hides public-site chrome (Navbar, Footer, Background, Preloader)
 * when the user is on /admin routes.
 */
export function PublicShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return null;

  return <>{children}</>;
}
