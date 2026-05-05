// src/app/layout.tsx
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // ผ่าตัดตรงนี้: เติม className="scroll-smooth" เข้าไป!
    <html lang="en" className="scroll-smooth">
      <body>{children}</body>
    </html>
  );
}