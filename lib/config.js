export const publicConfig = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "Traktirin",
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION ?? "0.0.0-dev",
};

export function getServerConfig() {
  return {
   apiBaseUrl: process.env.API_BASE_URL || "",   // default string kosong
   apiSecret: process.env.API_SECRET || "",
  };
}

export function getRuntimeInfo() {
  return {
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown",
    platform: process.env.VERCEL
      ? "Vercel"
      : "Node.js (lokal / server sendiri)",
    region: process.env.VERCEL_REGION ?? "-",
    commit: process.env.VERCEL_GIT_COMMIT_SHA
      ? process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7)
      : "-",
    branch: process.env.VERCEL_GIT_COMMIT_REF ?? "-",
  };
}

export function describeEnv() {
  const { apiBaseUrl, apiSecret } = getServerConfig();
  return [
    {
      name: "NEXT_PUBLIC_APP_NAME",
      scope: "browser",
      configured: Boolean(process.env.NEXT_PUBLIC_APP_NAME),
    },
    {
      name: "NEXT_PUBLIC_APP_VERSION",
      scope: "browser",
      configured: Boolean(process.env.NEXT_PUBLIC_APP_VERSION),
    },
    {
       name: "API_BASE_URL",
       scope: "server",
       configured: Boolean(apiBaseUrl),
      optional: true,          
    },
    {
        name: "API_SECRET",
        scope: "server",
        configured: Boolean(apiSecret),
        optional: true,          
    }
  ];
}
