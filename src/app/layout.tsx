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
          <div className="relative flex min-h-screen w-full flex-col pt-6 pb-12 px-2">
            {/* Decorative gradient glows */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute -top-24 -left-24 h-[32rem] w-[32rem] rounded-full bg-gradient-to-br from-sky-400/30 to-indigo-500/20 blur-3xl" />
              <div className="absolute -bottom-28 -right-28 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-fuchsia-500/20 to-rose-400/20 blur-3xl" />
            </div>
            {children}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
