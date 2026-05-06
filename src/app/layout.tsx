// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { ClientLayout } from "./ClientLayout";

export const metadata: Metadata = {
  title: "TRP Powers Plus | บริษัทติดตั้งระบบไฟฟ้า โซลาร์เซลล์ รับเหมาครบวงจร",
  description: "บริษัทติดตั้งระบบไฟฟ้า โซลาร์เซลล์ และพลังงานทดแทน โดยวิศวกรผู้ชำนาญการ ประเมินหน้างานฟรี รับประกัน 5 ปี",
  keywords: "ติดตั้งไฟฟ้า,โซลาร์เซลล์,รับเหมาไฟฟ้า,วิศวกรไฟฟ้า,ประเมินหน้างาน,ระบบไฟฟ้า,โซลูชั่นพลังงาน",
  openGraph: {
    title: "TRP Powers Plus - บริษัทติดตั้งระบบไฟฟ้าและโซลาร์เซลล์",
    description: "บริการติดตั้งระบบไฟฟ้า โซลาร์เซลล์ ประเมินราคาฟรี รับประกัน 5 ปี",
    type: "website",
    locale: "th_TH",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://trppowersplus.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f97316" />
      </head>
      <body className="bg-white text-gray-900">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}