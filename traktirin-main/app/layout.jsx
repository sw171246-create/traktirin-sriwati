import "./globals.css";
import Marquee from "@/components/Marquee";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { publicConfig } from "@/lib/config";

export const metadata = {
  title: {
    default: `${publicConfig.appName} – traktir kreator favoritmu`,
    template: `%s · ${publicConfig.appName}`,
  },
  description: "Studi kasus deployment Next.js: platform dukungan kreator sederhana.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <Marquee />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
