import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@fontsource/newsreader/600.css";
import "@fontsource/newsreader/700.css";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/700.css";
import PwaTracker from "../components/PwaTracker";
import { NotesProvider } from "../components/NotesContext";
import NotesDrawer from "../components/NotesDrawer";
import "./globals.css";
import "mana-font/css/mana.min.css";

const siteUrl = "https://centmeta.it";

export const viewport: Viewport = {
  themeColor: "#1f2124",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "CentMeta | Analisi Metagame Centurion Commander (MTG)",
  description:
    "Statistiche, liste mazzi, sinergie e andamento del metagame per il formato Magic: The Gathering Centurion Commander (1v1).",
  keywords: [
    "centurion meta",
    "centurion metagame",
    "centurion liste mazzi",
    "centurion mtg",
    "mazzi centurion",
    "mazzi meta centurion",
    "Centurion Commander",
    "CentMeta",
    "Magic The Gathering 1v1",
    "comandanti Centurion",
    "statistiche commander",
  ],
  robots: {
    index: true,
    follow: true,
  },
  referrer: "no-referrer",
  appleWebApp: {
    capable: true,
    title: "CentMeta",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "CentMeta | Analisi Centurion Commander",
    description:
      "Statistiche per il formato di Magic: The Gathering - Centurion Commander.",
    url: siteUrl,
    siteName: "CentMeta",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CentMeta Preview",
      },
    ],
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CentMeta | Analisi Centurion Commander",
    description:
      "Statistiche per il formato di Magic: The Gathering - Centurion Commander.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CentMeta",
    url: siteUrl,
    inLanguage: "it-IT",
    description:
      "Analisi statistica del metagame, dei comandanti e delle liste mazzi per Magic: The Gathering Centurion Commander.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="it" className="h-full">
      <body
        className="min-h-full flex flex-col bg-slate-900 text-slate-100 font-sans"
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <PwaTracker />
        <NotesProvider>
          {children}
          <NotesDrawer />
        </NotesProvider>
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            src={
              process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ||
              "https://cloud.umami.is/script.js"
            }
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
