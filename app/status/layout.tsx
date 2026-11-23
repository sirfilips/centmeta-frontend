import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stato Sistema e Pipeline Dati | CentMeta",
  description:
    "Monitoraggio in tempo reale dello stato del backend, del database e degli aggiornamenti dati di CentMeta.",
  alternates: {
    canonical: "https://centmeta.it/status",
  },
  openGraph: {
    title: "Stato Sistema e Pipeline Dati | CentMeta",
    description:
      "Monitoraggio in tempo reale dello stato del backend, del database e degli aggiornamenti dati di CentMeta.",
    url: "https://centmeta.it/status",
    siteName: "CentMeta",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "CentMeta Stato Sistema" }],
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stato Sistema e Pipeline Dati | CentMeta",
    description:
      "Monitoraggio in tempo reale dello stato del backend, del database e degli aggiornamenti dati di CentMeta.",
    images: ["/og-image.png"],
  },
};

export default function StatusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
