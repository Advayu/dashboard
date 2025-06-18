import type { Metadata } from "next";
import "./globals.css";

import localFont from "next/font/local";

const satoshiFont = localFont({
  src: [
    { path: "../../fonts/Satoshi-Regular.woff2", weight: "400" },
    { path: "../../fonts/Satoshi-Medium.woff2", weight: "500" },
    { path: "../../fonts/Satoshi-Light.woff2", weight: "300" },
    { path: "../../fonts/Satoshi-Bold.woff2", weight: "700" },
    { path: "../../fonts/Satoshi-Black.woff2", weight: "900" },
  ],
  display: "swap",
  variable: "--font-satoshiFont",
});

export const metadata: Metadata = {
  title: "ADVAYU | DISCOVER YOUR HOOD",
  description: "Offer discovery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={satoshiFont.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer></script>
      </head>

      <body className={satoshiFont.className}>
        {/* <Navbar /> */}
        {children}
      </body>
    </html>
  );
}
