// src/app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { ClientLayout } from "./ClientLayout";

export const metadata: Metadata = {
  metadataBase: new URL("https://trppowersplus.com"),
  title: "TRP Powers Plus | รับเหมาติดตั้งระบบไฟฟ้าและโซลาร์เซลล์",
  description:
    "TRP Powers Plus ให้บริการรับเหมาติดตั้งระบบไฟฟ้า โซลาร์เซลล์ ตู้ควบคุม ตรวจสอบ และบำรุงรักษาระบบไฟฟ้าสำหรับบ้าน อาคาร โรงงาน และธุรกิจ พร้อมสำรวจหน้างานและออกแบบตามการใช้งานจริง",
  keywords:
    "รับเหมาไฟฟ้า,ติดตั้งระบบไฟฟ้า,ติดตั้งโซลาร์เซลล์,ระบบไฟฟ้าอาคาร,ระบบไฟฟ้าโรงงาน,ตู้ควบคุมไฟฟ้า,ตรวจสอบระบบไฟฟ้า,TRP Powers Plus",
  openGraph: {
    title: "TRP Powers Plus - รับเหมาติดตั้งระบบไฟฟ้าและโซลาร์เซลล์",
    description:
      "บริการระบบไฟฟ้า โซลาร์เซลล์ ตู้ควบคุม ตรวจสอบ และบำรุงรักษาสำหรับบ้าน อาคาร โรงงาน และธุรกิจ",
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
