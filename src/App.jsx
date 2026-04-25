import { useState } from 'react'
import './App.css'

const initialMessages = [
  {
    speaker: 'Client',
    text: 'Hi, I do not recognize a card charge from last night.',
  },
  {
    speaker: 'Operator',
    text: 'I can help. I will check the transaction and make sure your card is protected.',
  },
  {
    speaker: 'Client',
    text: 'Thank you. I am worried because I need to use the account today.',
  },
]

function App() {
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')
  const [summary, setSummary] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    const nextMessage = draft.trim()
    if (!nextMessage) return

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        speaker: 'Client',
        text: nextMessage,
      },
    ])
    setDraft('')
  }

  function handleGenerateSummary() {
    setSummary('Client reports an unfamiliar card charge, feels worried, and needs clear reassurance plus next steps.')
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">BankCopilot AI</p>
          <h1>Call-center copilot</h1>
        </div>
        <button type="button" className="summary-button" onClick={handleGenerateSummary}>
          Generate summary
        </button>
      </header>

      <section className="demo-grid">
        <section className="conversation-panel" aria-labelledby="conversation-title">
          <div className="section-heading">
            <p className="eyebrow">Live conversation</p>
            <h2 id="conversation-title">Transcript</h2>
          </div>

          <div className="message-list">
            {messages.map((message, index) => (
              <article className={`message ${message.speaker.toLowerCase()}`} key={`${message.speaker}-${index}`}>
                <span>{message.speaker}</span>
                <p>{message.text}</p>
              </article>
            ))}
          </div>

          <form className="message-input" onSubmit={handleSubmit}>
            <label htmlFor="client-message">New client message</label>
            <div>
              <textarea
                id="client-message"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Type what the client says next..."
                rows="3"
              />
              <button type="submit">Add message</button>
            </div>
          </form>
        </section>

        <aside className="copilot-panel" aria-label="AI Copilot">
          <div className="section-heading copilot-heading">
            <p className="eyebrow">AI Copilot</p>
            <h2>What matters now</h2>
          </div>

          <section className="copilot-block signal-block">
            <div>
              <p className="eyebrow">Intent</p>
              <h3>Dispute card charge</h3>
            </div>
            <div>
              <p className="eyebrow">Sentiment</p>
              <h3>Worried</h3>
            </div>
          </section>

          <section className="copilot-block response-block">
            <p className="eyebrow">Suggested response</p>
            <p className="response-text">
              "I understand why that feels stressful. I will review the charge with you, protect the card if needed,
              and make sure you can still access your account today."
            </p>
            {summary && <p className="summary-preview">{summary}</p>}
          </section>

          <section className="copilot-block">
            <p className="eyebrow">Next best offer</p>
            <h3>Offer a temporary digital card</h3>
            <p>Fast, useful, and directly connected to the client's concern.</p>
          </section>

          <section className="copilot-block alert-block">
            <p className="eyebrow">Compliance alert</p>
            <h3>Use approved dispute language</h3>
            <p>Avoid promising the outcome. Explain timing and next steps clearly.</p>
          </section>
        </aside>
      </section>
    </main>
  )
}

export default App
