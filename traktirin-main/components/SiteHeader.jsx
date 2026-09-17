import Link from "next/link";
import { publicConfig } from "@/lib/config";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container wide site-header__inner">
        <Link href="/" className="brand">{publicConfig.appName.toLowerCase()}</Link>
        <nav className="nav" aria-label="Menu utama">
          <Link href="/#kreator">Kreator</Link>
          <Link href="/deployment-status">Status deployment</Link>
          <Link href="/api/health">API health</Link>
          <Link href="/production-checklist">Checklist</Link>
        </nav>
      </div>
    </header>
  );
}
