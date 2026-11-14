import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vota le Carte Centurion | CentMeta Community",
  description:
    "Esprimi il tuo voto nei duelli 1v1 tra le carte più giocate di Centurion Commander e contribuisci alla classifica della community.",
  alternates: {
    canonical: "https://centmeta.it/community/vota",
  },
};

export default function VotaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
