import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ひらがなおべんきょう",
  description: "ひらがなおべんきょう",
  generator: "ひらがなおべんきょう",
  icons: [
    {
      rel: "icon",
      url: "/hiragana.png",
      type: "image/png",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
