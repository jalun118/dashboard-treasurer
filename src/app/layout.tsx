import InitialSaldoProvider from "@/components/InitialSaldo";
import QueryProvider from "@/lib/query-provider";
import { objectMetadata } from "@/utils/objecr-metadata";
import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import PrelineScript from "../components/PrelineScript";
import { AuthProvider } from "./AuthProvider";
import FirstOpenProvider from "./FirstOpenProvider";
import StoreProvider from "./StoreProvider";
import "./globals.css";

export const metadata: Metadata = objectMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <QueryProvider>
          <StoreProvider>
            <FirstOpenProvider>
              <InitialSaldoProvider>
                <body className="dark:bg-black">
                  <Navbar />
                  <main className="container mt-5 mb-20">
                    {children}
                  </main>
                </body>
              </InitialSaldoProvider>
            </FirstOpenProvider>
          </StoreProvider>
        </QueryProvider>
        <PrelineScript />
      </AuthProvider>
    </html>
  );
}
