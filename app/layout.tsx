import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "styles/index.css";

const lato = Lato({ weight: ["400", "700"], subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={lato.className}>
      <body>{children}</body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "TS Academy",
};
