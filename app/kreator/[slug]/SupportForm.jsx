"use client";

import { useState } from "react";

const AMOUNTS = [5000, 10000, 25000, 50000];
const rupiah = (n) => "Rp" + new Intl.NumberFormat("id-ID").format(n);

export default function SupportForm({ slug, creatorName, initialSupports }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState(AMOUNTS[1]);
  const [status, setStatus] = useState({ type: "idle", text: "" });
  const [supports, setSupports] = useState(initialSupports);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: "loading", text: "" });

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name, message, amount }),
      });
      const data = await response.json();

      if (!response.ok) {
        setStatus({ type: "error", text: data.error ?? `Gagal mengirim (HTTP ${response.status})` });
        return;
      }

      setSupports((prev) => [data.support, ...prev].slice(0, 10));
      setMessage("");
      setStatus({ type: "ok", text: `Terkirim! ${creatorName} menerima ${rupiah(amount)}.` });
    } catch {
      setStatus({ type: "error", text: "Tidak dapat terhubung ke server. Coba lagi." });
    }
  }

  return (
    <div style={{ display: "grid", gap: 28 }}>
      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="name">Nama kamu</label>
          <input id="name" className="input" value={name} maxLength={40}
            placeholder="Kosongkan untuk anonim" onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="field">
          <span style={{ fontWeight: 600, fontSize: 14 }}>Nominal</span>
          <div className="amounts">
            {AMOUNTS.map((a) => (
              <button key={a} type="button" className="amount"
                aria-pressed={amount === a} onClick={() => setAmount(a)}>
                {rupiah(a)}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label htmlFor="message">Pesan</label>
          <textarea id="message" className="textarea" rows={3} maxLength={200}
            placeholder="Semangat terus berkarya!" value={message}
            onChange={(e) => setMessage(e.target.value)} />
        </div>

        {status.type === "error" && <p className="alert alert--error" role="alert">{status.text}</p>}
        {status.type === "ok" && <p className="alert alert--ok" role="status">{status.text}</p>}

        <div>
          <button type="submit" className="btn" disabled={status.type === "loading"}>
            {status.type === "loading" ? "Mengirim…" : `Kirim ${rupiah(amount)}`}
          </button>
        </div>
      </form>

      <div>
        <h3>Dukungan terbaru</h3>
        {supports.length === 0 ? (
          <p className="muted">Belum ada dukungan. Jadilah yang pertama!</p>
        ) : (
          <ul className="support-list">
            {supports.map((s) => (
              <li key={s.id}>
                <strong>{s.name}</strong> mentraktir <strong>{rupiah(s.amount)}</strong>
                {s.message && <div>“{s.message}”</div>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
