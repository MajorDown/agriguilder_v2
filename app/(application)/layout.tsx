import "reflect-metadata";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "@/styles/globals.css";
import Header from "@/components/application/sections/Header";
import Footer from "@/components/application/sections/Footer";
import UserProvider from "@/contexts/userContext/UserProvider";
import ModalProvider from "@/contexts/modalContext/ModalProvider";

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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <body className={montserrat.variable}>
                <UserProvider>
                    <ModalProvider>
                        <Header />
                        <main>{children}</main>
                        <Footer />
                    </ModalProvider>
                </UserProvider>
            </body>
        </html>
    );
}