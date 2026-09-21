// Penyimpanan dukungan SEMENTARA di memori server.
// Catatan untuk praktikum: di Vercel (serverless) data ini bisa hilang
// ketika instance berganti. Tantangan lanjutan: ganti dengan database
// melalui DATABASE_URL.

const globalStore = globalThis;
if (!globalStore.__traktirinSupports) {
  globalStore.__traktirinSupports = [];
}

export function listSupports(slug) {
  return globalStore.__traktirinSupports
    .filter((s) => !slug || s.slug === slug)
    .slice(-10)
    .reverse();
}

export function addSupport(entry) {
  const record = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...entry };
  globalStore.__traktirinSupports.push(record);
  return record;
}
