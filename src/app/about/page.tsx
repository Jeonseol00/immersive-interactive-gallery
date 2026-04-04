import AboutClient from "./AboutClient";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami | IMGAL",
  description: "Sebuah manifesto digital untuk perayaan mahakarya klasik dalam dunia web interaktif modern.",
};

export default function AboutPage() {
  return <AboutClient />;
}
