export function Transcript({ labels, messages, input, setInput, onAnalyze, isThinking, quickPrompts, onPrompt, onMic, voiceStatus }) {
  return (
    <section className="transcript-panel panel">
      <div className="panel-heading">
        <div>
          <p>{labels.customerMeta}</p>
          <h2>{labels.transcript}</h2>
        </div>
        <div className={`voice-orb ${voiceStatus.toLowerCase()}`}>
          <span />
          {voiceStatus}
        </div>
      </div>

      <div className="messages">
        {messages.map((message) => (
          <article className={`message ${message.role}`} key={message.id}>
            <span>{labels[message.role] || labels.system}</span>
            <p>{message.text}</p>
          </article>
        ))}
        {isThinking && (
          <article className="message ai thinking">
            <span>{labels.ai}</span>
            <p>{labels.aiThinking}</p>
            <i />
          </article>
        )}
      </div>

      <div className="quick-prompts">
        {quickPrompts.map((prompt) => (
          <button key={prompt} type="button" onClick={() => onPrompt(prompt)}>
            {prompt}
          </button>
        ))}
      </div>

      <form className="composer" onSubmit={onAnalyze}>
        <button className="mic-button" type="button" onClick={onMic} title={labels.mic} aria-label={labels.mic}>
          🎤
        </button>
        <textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder={labels.placeholder} rows="2" />
        <button className="primary-button" type="submit" disabled={!input.trim() || isThinking}>
          {labels.analyze}
        </button>
      </form>
    </section>
  )
}
