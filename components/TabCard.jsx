export default function TabCard({ tab, color = "pink", children, id }) {
  return (
    <section className="tab-card" id={id} aria-label={tab}>
      {tab && <span className={`tab-card__tab tab--${color}`}>{tab}</span>}
      <div className="card">{children}</div>
    </section>
  );
}
