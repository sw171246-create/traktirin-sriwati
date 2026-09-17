import Checklist from "./Checklist";

export const metadata = { title: "Production checklist" };

export default function ProductionChecklistPage() {
  return (
    <div className="container wide stack">
      <section>
        <h1>Production checklist</h1>
        <p style={{ margin: 0, maxWidth: "70ch" }}>
          Centang setiap item setelah kamu punya buktinya, lalu tulis catatan
          singkat (URL, nama file screenshot, atau hasil uji). Data tersimpan di
          browser ini saja. Jangan menulis nilai secret di sini.
        </p>
      </section>
      <Checklist />
    </div>
  );
}
