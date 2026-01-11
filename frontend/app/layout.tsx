import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Apollo Dashboard",
  description: "Sistema de Gestão de Vendas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${inter.className} bg-slate-50`}>
        {/* Sidebar */}
        <Sidebar />
        
        {/* Conteúdo Principal */}
        <main className="min-h-screen pt-16 px-8 pb-8 lg:pt-8 lg:ml-64 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}