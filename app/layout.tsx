// app/layout.tsx
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CookieBanner from "@/components/CookieBanner";

export const metadata = {
  title: "Vivo Tree - Monitoraggio Crescita",
  description: "Pannello di controllo per le misurazioni di Vivo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased text-slate-800">
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <CookieBanner />
      </body>
    </html>
  );
}
