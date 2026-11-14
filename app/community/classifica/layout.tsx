import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Classifica Carte Community Centurion | CentMeta",
  description:
    "La classifica ELO delle carte più votate dalla community di Centurion Commander, filtrabile per colore e periodo.",
  alternates: {
    canonical: "https://centmeta.it/community/classifica",
  },
};

export default function ClassificaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
