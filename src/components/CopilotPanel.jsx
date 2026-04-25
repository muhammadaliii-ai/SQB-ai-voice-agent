export function CopilotPanel({ labels, result, onUseResponse, onLockCard, onOpenDispute, isThinking }) {
  return (
    <aside className="copilot panel">
      <div className="panel-heading">
        <div>
          <p>{labels.confidence}</p>
          <h2>{labels.copilot}</h2>
        </div>
      </div>

      <div className="signal-grid">
        <section>
          <span>{labels.intent}</span>
          <strong>{result.intent}</strong>
        </section>
        <section>
          <span>{labels.sentiment}</span>
          <strong className={`sentiment ${result.sentiment}`}>{result.sentiment}</strong>
        </section>
      </div>

      <section className="suggestion">
        <span>{labels.suggestedResponse}</span>
        <p>{isThinking ? labels.aiThinking : result.response}</p>
        <button className="primary-button" type="button" onClick={onUseResponse} disabled={isThinking || !result.response}>
          {labels.useResponse}
        </button>
      </section>

      <section className="compliance">
        <span>{labels.compliance}</span>
        <p>{result.complianceWarning}</p>
      </section>

      <section className="offer">
        <span>{labels.nextBestOffer}</span>
        <p>{result.nextBestOffer}</p>
      </section>

      <div className="action-row">
        <button type="button" onClick={onLockCard}>{labels.lockCard}</button>
        <button type="button" onClick={onOpenDispute}>{labels.openDispute}</button>
      </div>
    </aside>
  )
}
