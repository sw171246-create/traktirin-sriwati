import Link from "next/link";
import Mascot from "@/components/Mascot";

export default function NotFound() {
  return (
    <div className="container stack">
      <section className="hero">
        <Mascot size={140} mood="sad" />
        <h1>Halaman tidak ditemukan</h1>
        <p>Alamat yang kamu buka tidak ada. Periksa kembali URL-nya.</p>
        <Link href="/" className="btn btn--cyan">Kembali ke beranda</Link>
      </section>
    </div>
  );
}
