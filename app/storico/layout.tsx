import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Storico Metagame Centurion Commander | CentMeta",
  description:
    "Evoluzione storica del metagame Centurion Commander (MTG 1v1): quote dei comandanti nel tempo, volume mazzi, varietà del meta e distribuzione colori.",
  alternates: {
    canonical: "https://centmeta.it/storico",
  },
  openGraph: {
    title: "Storico Metagame Centurion Commander | CentMeta",
    description:
      "Trend storici, quote dei comandanti e distribuzione dei colori nel formato Centurion Commander.",
    url: "https://centmeta.it/storico",
    siteName: "CentMeta",
    locale: "it_IT",
    type: "website",
  },
};

export default function StoricoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
