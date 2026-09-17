import Link from "next/link";
import TabCard from "@/components/TabCard";
import { publicConfig, getRuntimeInfo, describeEnv } from "@/lib/config";
import { getHealthReport } from "@/lib/health";

export const metadata = { title: "Status deployment" };

export const dynamic = "force-dynamic";

const STATUS_LABEL = {
  ok: "Sehat",
  degraded: "Perlu dicek",
  error: "Bermasalah",
};

export default async function DeploymentStatusPage() {
  const health = await getHealthReport();
  const runtime = getRuntimeInfo();
  const envList = describeEnv();

  const stats = [
    ["Nama aplikasi", publicConfig.appName],
    ["Environment", runtime.environment],
    ["Versi", publicConfig.appVersion],
    ["Platform", runtime.platform],
    ["Region", runtime.region],
    ["Commit", runtime.commit],
    ["Branch", runtime.branch],
    ["Uptime instance", `${health.uptimeSeconds} detik`],
  ];

  return (
    <div className="container wide stack">
      <section>
        <h1>Status deployment</h1>
        <p style={{ margin: 0 }}>
          Status API:{" "}
          <span className={`badge badge--${health.status}`}>
            {STATUS_LABEL[health.status]}
          </span>
          <span className="muted">
            {" "}
            · diperiksa{" "}
            {new Date(health.timestamp).toLocaleString("id-ID", {
              timeZone: "Asia/Jakarta",
            })}{" "}
            WIB
          </span>
        </p>
      </section>

      <TabCard tab="ringkasan" color="cyan">
        <dl className="status-grid" style={{ margin: 0 }}>
          {stats.map(([label, value]) => (
            <div key={label} className="stat">
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </TabCard>

      <TabCard tab="sumber data" color="orange">
        {health.checks.dataSource.status === "ok" ? (
          <p>
            Data kreator berhasil dimuat dari{" "}
            <code>{health.checks.dataSource.source}</code> (
            {health.checks.dataSource.items} item,{" "}
            {health.checks.dataSource.latencyMs} ms).
          </p>
        ) : (
          <p className="alert alert--error">
            Gagal memuat data: {health.checks.dataSource.message}. Periksa
            runtime log dan nilai <code>API_BASE_URL</code> di dashboard
            hosting.
          </p>
        )}
      </TabCard>

      <TabCard tab="environment variables" color="pink">
        <p style={{ marginTop: 0 }}>
          Hanya menampilkan apakah variabel sudah diisi. Nilainya tidak pernah
          ditampilkan.
        </p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Terlihat oleh</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {envList.map((e) => (
                <tr key={e.name}>
                  <td>
                    <code>{e.name}</code>
                  </td>
                  <td>
                    {e.scope === "server" ? "Server saja" : "Browser (publik)"}
                  </td>
                  <td>
                    {e.configured
                      ? "Terisi"
                      : e.optional
                        ? "Kosong (opsional)"
                        : "Kosong – wajib diisi"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabCard>

      <TabCard tab="respons /api/health" color="green">
        <pre className="json">{JSON.stringify(health, null, 2)}</pre>
        <p>
          <a
            href="/api/health"
            className="btn btn--small btn--cyan"
            target="_blank"
            rel="noreferrer"
          >
            Buka /api/health
          </a>
        </p>
      </TabCard>

      <p className="center">
        <Link href="/production-checklist" className="btn">
          Lanjut ke Latihan 3
        </Link>
      </p>
    </div>
  );
}
