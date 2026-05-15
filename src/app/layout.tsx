// src/app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { ClientLayout } from "./ClientLayout";

export const metadata: Metadata = {
  metadataBase: new URL("https://trppowersplus.com"),
  title: "TRP Powers Plus | เธเธฃเธดเธฉเธฑเธ—เธ•เธดเธ”เธ•เธฑเนเธเธฃเธฐเธเธเนเธเธเนเธฒ เนเธเธฅเธฒเธฃเนเน€เธเธฅเธฅเน เธฃเธฑเธเน€เธซเธกเธฒเธเธฃเธเธงเธเธเธฃ",
  description: "เธเธฃเธดเธฉเธฑเธ—เธ•เธดเธ”เธ•เธฑเนเธเธฃเธฐเธเธเนเธเธเนเธฒ เนเธเธฅเธฒเธฃเนเน€เธเธฅเธฅเน เนเธฅเธฐเธเธฅเธฑเธเธเธฒเธเธ—เธ”เนเธ—เธ เนเธ”เธขเธงเธดเธจเธงเธเธฃเธเธนเนเธเธณเธเธฒเธเธเธฒเธฃ เธเธฃเธฐเน€เธกเธดเธเธซเธเนเธฒเธเธฒเธเธเธฃเธต เธฃเธฑเธเธเธฃเธฐเธเธฑเธ 5 เธเธต",
  keywords: "เธ•เธดเธ”เธ•เธฑเนเธเนเธเธเนเธฒ,เนเธเธฅเธฒเธฃเนเน€เธเธฅเธฅเน,เธฃเธฑเธเน€เธซเธกเธฒเนเธเธเนเธฒ,เธงเธดเธจเธงเธเธฃเนเธเธเนเธฒ,เธเธฃเธฐเน€เธกเธดเธเธซเธเนเธฒเธเธฒเธ,เธฃเธฐเธเธเนเธเธเนเธฒ,เนเธเธฅเธนเธเธฑเนเธเธเธฅเธฑเธเธเธฒเธ",
  openGraph: {
    title: "TRP Powers Plus - เธเธฃเธดเธฉเธฑเธ—เธ•เธดเธ”เธ•เธฑเนเธเธฃเธฐเธเธเนเธเธเนเธฒเนเธฅเธฐเนเธเธฅเธฒเธฃเนเน€เธเธฅเธฅเน",
    description: "เธเธฃเธดเธเธฒเธฃเธ•เธดเธ”เธ•เธฑเนเธเธฃเธฐเธเธเนเธเธเนเธฒ เนเธเธฅเธฒเธฃเนเน€เธเธฅเธฅเน เธเธฃเธฐเน€เธกเธดเธเธฃเธฒเธเธฒเธเธฃเธต เธฃเธฑเธเธเธฃเธฐเธเธฑเธ 5 เธเธต",
    type: "website",
    locale: "th_TH",
    images: [
      {
        url: "/images/LogoTRP.webp",
        width: 1024,
        height: 1024,
        alt: "TRP Powers Plus logo",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://trppowersplus.com",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f08a24",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className="bg-[oklch(99%_0.006_78)] text-gray-900">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
