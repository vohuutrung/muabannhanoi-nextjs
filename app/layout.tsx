import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Muabannhahanoi",
  description: "Website mua bán nhà Hà Nội | Next.js + Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
