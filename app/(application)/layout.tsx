import "reflect-metadata";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "@/styles/globals.css";
import Header from "@/components/application/sections/Header";
import Footer from "@/components/application/sections/Footer";
import { getUserAppData } from "@/contexts/userContext/getUserContext.service";

const montserrat = Montserrat({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-Montserrat",
});

export const metadata: Metadata = {
  title: "Agriguilder.",
  description: "Votre application d'entraide pour les collectifs paysans",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userAppData = await getUserAppData();

  console.log("RootLayout userAppData :", userAppData);

  return (
    <html lang="fr">
      <body className={montserrat.variable}>
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}