export function CallSummary({ labels, result }) {
  const risk = result.intent === 'fraud' || result.intent === 'card issue' ? 'High' : result.intent === 'complaint' ? 'Medium' : 'Low'

  return (
    <section className="customer-card panel">
      <div className="customer-avatar">MU</div>
      <h2>{labels.customerName}</h2>
      <p>{labels.customerMeta}</p>
      <div className="metric-list">
        <section>
          <span>{labels.topMetric1}</span>
          <strong>04:18</strong>
        </section>
        <section>
          <span>{labels.topMetric2}</span>
          <strong>96%</strong>
        </section>
        <section>
          <span>{labels.topMetric3}</span>
          <strong>{risk}</strong>
        </section>
      </div>
    </section>
  )
}
