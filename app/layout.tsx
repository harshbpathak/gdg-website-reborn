import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Provider } from "./provider";
import { Navbar } from "./components/navbar/navbar";


const productSans = localFont({
  src: [
    {
      path: "../public/fonts/Product Sans Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Product Sans Regular.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Product Sans Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Product Sans Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/Product Sans Bold Italic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "GDG",
  description: "Google Developer Groups - NIT Hamirpur-Chapter",
  icons: {
    icon: "/assets/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={productSans.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Provider>
          <Navbar />
          {children}
        </Provider>
      </body>
    </html>
  );
}