import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community & Tier List Centurion | CentMeta",
  description:
    "Partecipa alla community Centurion Commander: vota le carte più forti del formato e consulta la classifica elaborata dai giocatori.",
  alternates: {
    canonical: "https://centmeta.it/community",
  },
  openGraph: {
    title: "Community & Tier List Centurion | CentMeta",
    description:
      "Voti della community e classifica delle carte nel formato Magic: The Gathering Centurion Commander.",
    url: "https://centmeta.it/community",
    siteName: "CentMeta",
    locale: "it_IT",
    type: "website",
  },
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
