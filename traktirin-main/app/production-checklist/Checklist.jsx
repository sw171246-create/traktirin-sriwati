"use client";

import { useEffect, useState } from "react";
import TabCard from "@/components/TabCard";

const STORAGE_KEY = "traktirin-checklist-v1";

const GROUPS = [
  {
    id: "bukti",
    title: "bukti deployment",
    color: "cyan",
    items: [
      {
        id: "build",
        label: "Build production",
        hint: "Screenshot npm run build berhasil",
      },
      {
        id: "url",
        label: "Production URL",
        hint: "URL aplikasi live, misal https://traktirin.vercel.app",
      },
      {
        id: "env",
        label: "Environment variables",
        hint: "Screenshot konfigurasi tanpa nilai secret",
      },
      {
        id: "api",
        label: "API/database",
        hint: "Bukti fitur berhasil mengambil/menyimpan data",
      },
      {
        id: "domain",
        label: "Domain",
        hint: "Screenshot domain/HTTPS (jika tersedia)",
      },
      {
        id: "monitoring",
        label: "Monitoring",
        hint: "Screenshot build log dan runtime log",
      },
      {
        id: "security",
        label: "Security",
        hint: "Bukti tidak ada secret di repository/browser",
      },
    ],
  },
  {
    id: "smoke",
    title: "smoke test",
    color: "pink",
    items: [
      {
        id: "s1",
        label: "Buka URL production",
        hint: "Halaman tampil melalui HTTPS",
      },
      {
        id: "s2",
        label: "Navigasi menu",
        hint: "Semua route utama dapat dibuka",
      },
      {
        id: "s3",
        label: "Form input",
        hint: "Validasi dan submit traktiran berjalan",
      },
      {
        id: "s4",
        label: "Panggil /api/health",
        hint: 'Status 200 dan status "ok"',
      },
      {
        id: "s5",
        label: "Data kreator",
        hint: "Daftar kreator tampil dari sumber yang benar",
      },
      {
        id: "s6",
        label: "Refresh /kreator/[slug]",
        hint: "Tidak muncul 404/500",
      },
      {
        id: "s7",
        label: "Mobile browser",
        hint: "Layout responsif dan usable",
      },
      {
        id: "s8",
        label: "Browser DevTools",
        hint: "Tidak ada secret di Sources/Network",
      },
      {
        id: "s9",
        label: "Log hosting",
        hint: "Tidak ada error kritis berulang",
      },
    ],
  },
];

const ALL_ITEMS = GROUPS.flatMap((g) => g.items);

export default function Checklist() {
  const [state, setState] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setState(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state, loaded]);

  function update(id, patch) {
    setState((prev) => ({
      ...prev,
      [id]: { done: false, note: "", ...prev[id], ...patch },
    }));
  }

  const doneCount = ALL_ITEMS.filter((i) => state[i.id]?.done).length;
  const percent = Math.round((doneCount / ALL_ITEMS.length) * 100);

  async function copyMarkdown() {
    const lines = ["# Production Checklist – Traktirin", ""];
    for (const g of GROUPS) {
      lines.push(
        `## ${g.title}`,
        "",
        "| Item | Bukti | Status |",
        "|---|---|---|",
      );
      for (const i of g.items) {
        const s = state[i.id] ?? {};
        lines.push(
          `| ${i.label} | ${(s.note || "-").replace(/\|/g, "/")} | ${s.done ? "✅" : "⬜"} |`,
        );
      }
      lines.push("");
    }
    lines.push(`Progres: ${doneCount}/${ALL_ITEMS.length} (${percent}%)`);
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Clipboard tidak tersedia di browser ini.");
    }
  }

  function reset() {
    if (confirm("Hapus semua centang dan catatan?")) setState({});
  }

  return (
    <>
      <TabCard tab="progres" color="green">
        <p style={{ marginTop: 0 }}>
          <b>{doneCount}</b> dari {ALL_ITEMS.length} item selesai ({percent}%)
        </p>
        <div
          className="progress"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="progress__bar" style={{ width: `${percent}%` }} />
        </div>
        <div
          className="btn-row"
          style={{ justifyContent: "flex-start", marginTop: 24 }}
        >
          <button
            type="button"
            className="btn btn--small btn--cyan"
            onClick={copyMarkdown}
          >
            {copied ? "Tersalin!" : "Salin untuk laporan"}
          </button>
          <button
            type="button"
            className="btn btn--small btn--pink"
            onClick={reset}
          >
            Reset
          </button>
        </div>
      </TabCard>

      {GROUPS.map((group) => (
        <TabCard key={group.id} tab={group.title} color={group.color}>
          <div className="check-list">
            {group.items.map((item) => {
              const s = state[item.id] ?? {};
              return (
                <div
                  key={item.id}
                  className={`check-item${s.done ? " is-done" : ""}`}
                >
                  <input
                    type="checkbox"
                    id={`chk-${item.id}`}
                    checked={Boolean(s.done)}
                    onChange={(e) =>
                      update(item.id, { done: e.target.checked })
                    }
                  />
                  <label htmlFor={`chk-${item.id}`}>
                    <b>{item.label}</b>
                    <br />
                    <span className="muted">{item.hint}</span>
                  </label>
                  <input
                    className="input"
                    aria-label={`Catatan bukti untuk ${item.label}`}
                    placeholder="Catatan bukti (tanpa secret)"
                    value={s.note ?? ""}
                    onChange={(e) => update(item.id, { note: e.target.value })}
                  />
                </div>
              );
            })}
          </div>
        </TabCard>
      ))}
    </>
  );
}
