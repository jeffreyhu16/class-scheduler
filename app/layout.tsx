import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "styles/index.css";

const roboto = Roboto_Mono({
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={roboto.className}>
      <body>{children}</body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "TS Academy",
};
