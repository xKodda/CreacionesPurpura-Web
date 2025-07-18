import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { CartProvider } from "@/contexts/CartContext";
import { ProductProvider } from "@/contexts/ProductContext";
import { SessionProvider } from "next-auth/react";
import SessionWrapper from "./SessionWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Creaciones Púrpura - Tienda Online 2025",
  description: "Tienda online de papelería, cotillón y manualidades. Envíos a todo Chile. Compra fácil, rápida y segura.",
  icons: {
    icon: '/IconWeb.svg',
    shortcut: '/IconWeb.svg',
    apple: '/IconWeb.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/IconWeb.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/IconWeb.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/IconWeb.svg" />
      </head>
      <body className={inter.className}>
        <SessionWrapper>
          <ProductProvider>
            <CartProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
                <ScrollToTop />
              </div>
            </CartProvider>
          </ProductProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
