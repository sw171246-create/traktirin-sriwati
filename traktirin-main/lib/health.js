import { publicConfig, getRuntimeInfo, describeEnv } from "@/lib/config";
import { getCreators } from "@/lib/creators";

const startedAt = Date.now();

export async function getHealthReport() {
  const runtime = getRuntimeInfo();
  const envChecks = describeEnv();

  let dataSource;
  const t0 = Date.now();
  try {
    const { source, creators } = await getCreators();
    dataSource = { status: "ok", source, items: creators.length, latencyMs: Date.now() - t0 };
  } catch (error) {
    dataSource = { status: "error", message: error.message, latencyMs: Date.now() - t0 };
  }

  const missingRequired = envChecks.filter((e) => !e.optional && !e.configured);
  const status =
    dataSource.status !== "ok" ? "error" : missingRequired.length > 0 ? "degraded" : "ok";

  return {
    status,
    service: "traktirin-nextjs",
    version: publicConfig.appVersion,
    environment: runtime.environment,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
    checks: {
      dataSource,
      env: envChecks.map(({ name, configured }) => ({ name, configured })),
    },
  };
}
