import type { Metadata } from "next";
import "./globals.css";
import { GridProvider } from "@/context/GridContext";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "PowerGrid HV - 500 kV Substation SCADA & Transformer ERP",
  description: "Enterprise High-Voltage Electrical Power Grid, 60 FPS 3-Phase Sine Wave Canvas & 500 MVA Transformer DGA Diagnostics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-[#080c14] text-slate-100 antialiased">
        <GridProvider>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">{children}</main>
        </GridProvider>
      </body>
    </html>
  );
}
