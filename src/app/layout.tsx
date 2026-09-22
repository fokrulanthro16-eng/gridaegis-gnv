import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GridAegis GNV | Alachua County Civic Energy & Karst Resilience Platform",
  description: "Autonomous spatial energy burden optimizer, karst-resilient grid failure simulator, and multimodal Google Gemini utility triage platform tailored to Gainesville Regional Utilities (GRU).",
  keywords: [
    "Gainesville",
    "Alachua County",
    "GRU",
    "Energy Burden",
    "Karst Sinkhole",
    "Microgrid",
    "Google Gemini",
    "CityCamp Gainesville",
    "LIHEAP",
    "Civic Tech"
  ],
  authors: [{ name: "GridAegis GNV Team" }]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                darkMode: 'class',
                theme: {
                  extend: {
                    colors: {
                      civic: {
                        950: '#020617',
                        900: '#0b1222',
                        850: '#0f172a',
                        800: '#1e293b',
                        700: '#334155'
                      },
                      power: {
                        cyan: '#06b6d4',
                        emerald: '#10b981',
                        amber: '#f59e0b',
                        rose: '#f43f5e',
                        purple: '#a855f7'
                      }
                    }
                  }
                }
              };
            `
          }}
        />
      </head>
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
