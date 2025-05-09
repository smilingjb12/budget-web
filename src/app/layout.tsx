import { Toaster } from "@/components/ui/toaster";
import { Constants } from "@/constants";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: Constants.APP_NAME,
  description: Constants.APP_DESCRIPTION_META,
};

const inter = Inter({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <div className="flex min-h-screen w-full flex-col pt-6 pb-12 px-2">
            {children}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
