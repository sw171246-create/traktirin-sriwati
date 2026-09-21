import localCreators from "@/data/creators.json";
import { getServerConfig } from "@/lib/config";

// Mengambil daftar kreator.
// - API_BASE_URL kosong  -> pakai data lokal (data/creators.json)
// - API_BASE_URL terisi  -> ambil dari backend production: GET {API_BASE_URL}/creators
export async function getCreators() {
  const { apiBaseUrl, apiSecret } = getServerConfig();

  if (!apiBaseUrl) {
    return { source: "local", creators: localCreators };
  }

  const response = await fetch(`${apiBaseUrl}/creators`, {
    headers: apiSecret ? { Authorization: `Bearer ${apiSecret}` } : {},
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`Gagal mengambil data kreator (HTTP ${response.status})`);
  }

  return { source: "api", creators: await response.json() };
}

export async function getCreatorBySlug(slug) {
  const { creators } = await getCreators();
  return creators.find((c) => c.slug === slug) ?? null;
}
