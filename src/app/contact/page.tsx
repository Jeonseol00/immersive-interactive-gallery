import { ContactClient } from "./ContactClient";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hubungi Kami | IMGAL",
  description: "Mari berkolaborasi dan wujudkan pameran spektakuler.",
};

export default function ContactPage() {
  return <ContactClient />;
}
