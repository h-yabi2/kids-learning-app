import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-noto-sans-jp",
});

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  minimumScale: 1.0,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={notoSansJP.variable}>
        {children}
        <footer
          className="fixed bottom-0 left-0 right-0 py-1 text-center text-[10px] text-gray-500 bg-white/60 backdrop-blur-sm z-30 pointer-events-none"
          style={{ paddingBottom: "calc(0.25rem + env(safe-area-inset-bottom))" }}
        >
          <a
            href="https://voicevox.hiho.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline pointer-events-auto"
          >
            VOICEVOX:青山龍星
          </a>
        </footer>
      </body>
    </html>
  );
}
