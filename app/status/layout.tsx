import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stato Sistema e Pipeline Dati | CentMeta",
  description:
    "Monitoraggio in tempo reale dello stato del backend, del database e degli aggiornamenti dati di CentMeta.",
  alternates: {
    canonical: "https://centmeta.it/status",
  },
};

export default function StatusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
