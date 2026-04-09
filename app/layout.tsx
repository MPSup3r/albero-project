// app/layout.tsx
import "./globals.css";

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
      <body className="antialiased text-slate-800">
        {children}
      </body>
    </html>
  );
}
