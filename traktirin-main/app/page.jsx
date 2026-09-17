import Link from "next/link";
import Mascot from "@/components/Mascot";
import TabCard from "@/components/TabCard";
import { getCreators } from "@/lib/creators";
import { publicConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

const rupiahFormat = new Intl.NumberFormat("id-ID");

export default async function HomePage() {
  let creators = [];
  let source = "-";
  let loadError = null;

  try {
    const result = await getCreators();
    creators = result.creators;
    source = result.source;
  } catch (error) {
    console.error("[home]", error);
    loadError = "Daftar kreator belum bisa dimuat. Cek API_BASE_URL dan log server.";
  }

  return (
    <div className="container stack">
      <section className="hero">
        <Mascot size={160} />
        <p className="wordmark">{publicConfig.appName.toLowerCase()}</p>
        <h1>Traktir kopi untuk kreator yang kamu suka.</h1>
        <div className="btn-row">
          <Link href="#kreator" className="btn btn--cyan">Lihat kreator</Link>
          <Link href="/deployment-status" className="btn">Cek status</Link>
        </div>
      </section>

      <TabCard>
        <p>
          {publicConfig.appName} adalah studi kasus aplikasi dukungan kreator. Pengunjung memilih
          kreator, menulis pesan, lalu mengirim traktiran. Aplikasi ini sengaja dibuat sederhana
          supaya fokus praktikum tetap pada <b>build, deployment, environment variables,</b> dan{" "}
          <b>monitoring</b>.
        </p>
        <ul className="clean">
          <li>Next.js App Router + route handler</li>
          <li>Data kreator dari file lokal atau API production</li>
          <li>Halaman status, health check, dan checklist production</li>
        </ul>
      </TabCard>

      <TabCard tab="cara kerja" color="pink">
        <ol className="steps">
          <li>Pilih kreator yang ingin kamu dukung</li>
          <li>Tulis nama dan pesan singkat</li>
          <li>Pilih nominal traktiran</li>
          <li>Kirim, lalu pesanmu muncul di halaman kreator</li>
        </ol>
      </TabCard>

      <TabCard tab="kreator" color="cyan" id="kreator">
        <p className="muted" style={{ marginTop: 0 }}>
          Sumber data: <code>{source}</code>
        </p>
        {loadError ? (
          <p className="alert alert--error">{loadError}</p>
        ) : (
          <div className="creator-grid">
            {creators.map((c) => (
              <Link key={c.slug} href={`/kreator/${c.slug}`} className="creator">
                <div className="creator__head">
                  <span className={`avatar tab--${c.color ?? "orange"}`}>{c.name.charAt(0)}</span>
                  <div>
                    <strong>{c.name}</strong>
                    <br />
                    <span className="pill">{c.category}</span>
                  </div>
                </div>
                <span>{c.bio}</span>
                <span className="muted">{rupiahFormat.format(c.supporters)} pendukung</span>
              </Link>
            ))}
          </div>
        )}
      </TabCard>

      <TabCard tab="latihan praktikum" color="orange">
        <ol className="steps">
          <li>
            <Link href="/deployment-status"><b>Latihan 1</b> – halaman status deployment</Link>
            <br />
            <span className="muted">Nama aplikasi, environment, versi, dan status API.</span>
          </li>
          <li>
            <Link href="/api/health"><b>Latihan 2</b> – health check API</Link>
            <br />
            <span className="muted">Endpoint JSON untuk memeriksa kesehatan aplikasi.</span>
          </li>
          <li>
            <Link href="/production-checklist"><b>Latihan 3</b> – production checklist</Link>
            <br />
            <span className="muted">Centang bukti deployment dan salin untuk laporan.</span>
          </li>
        </ol>
      </TabCard>

      <section className="hero">
        <Mascot size={130} />
        <h2 style={{ fontWeight: 500 }}>siap deploy aplikasimu?</h2>
        <Link href="/production-checklist" className="btn">Buka checklist</Link>
      </section>
    </div>
  );
}
