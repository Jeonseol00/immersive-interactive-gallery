import { CampaignClient } from "./CampaignClient";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kampanye Eksibisi | IMGAL",
  description: "Jelajahi pameran eksklusif dan inisiatif seni kolaboratif kami.",
};

export default function CampaignsPage() {
  return <CampaignClient />;
}
