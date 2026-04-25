import { useState } from 'react'
import './App.css'
import { useVoiceAssistant } from './hooks/useVoiceAssistant'
import { answerCustomerQuestion } from './services/aiService'
import { customerData } from './services/customerData'

const languages = ['uz', 'ru', 'en']
const navItems = ['Overview', 'Customer profile', 'Cards', 'Loans', 'Transactions', 'Security', 'AI Call Center']

const labels = {
  uz: {
    subtitle: 'Automated customer support for SQB Bank',
    phone: 'Customer phone number',
    start: 'Start AI Call',
    search: 'Search customer, card, transaction...',
    online: 'AI Operator Online',
    mode: 'Autonomous AI',
    overview: 'Customer overview',
    profile: 'Customer profile',
    cards: 'Active cards',
    loan: 'Active loan',
    deposit: 'Deposit balance',
    transactions: 'Last 5 transactions',
    history: 'Recent support history',
    alerts: 'Security alerts',
    transcript: 'Customer question transcript',
    answer: 'AI answer',
    askPlaceholder: 'Customer asks...',
    ask: 'Ask AI',
    voice: 'Start voice input',
    speak: 'Speak answer',
    intent: 'Detected intent',
    risk: 'Risk level',
    source: 'Knowledge source',
    compliance: 'Compliance warning',
    escalation: 'Escalation',
    summary: 'Call summary',
    kyc: 'KYC status',
    riskScore: 'Risk score',
    balance: 'Total balance',
    clientId: 'Client ID',
    phoneLabel: 'Phone',
    monthlyPayment: 'Monthly payment',
    nextPayment: 'Next payment date',
    quickQuestions: [
      'Mening HUMO kartamdan 250 000 so‘m pul yechildi',
      'Balansim qancha?',
      'Kreditim bo‘yicha keyingi to‘lov qachon?',
      'Kartamni yo‘qotdim',
    ],
    initialQuestion: 'Mening HUMO kartamdan 250 000 so‘m pul yechildi',
  },
  ru: {
    subtitle: 'Automated customer support for SQB Bank',
    phone: 'Номер телефона клиента',
    start: 'Start AI Call',
    search: 'Поиск клиента, карты, транзакции...',
    online: 'AI Operator Online',
    mode: 'Autonomous AI',
    overview: 'Обзор клиента',
    profile: 'Профиль клиента',
    cards: 'Активные карты',
    loan: 'Активный кредит',
    deposit: 'Депозит',
    transactions: 'Последние 5 операций',
    history: 'Последние обращения',
    alerts: 'Security alerts',
    transcript: 'Транскрипт вопроса клиента',
    answer: 'Ответ AI',
    askPlaceholder: 'Customer asks...',
    ask: 'Ask AI',
    voice: 'Start voice input',
    speak: 'Speak answer',
    intent: 'Detected intent',
    risk: 'Risk level',
    source: 'Knowledge source',
    compliance: 'Compliance warning',
    escalation: 'Escalation',
    summary: 'Call summary',
    kyc: 'KYC status',
    riskScore: 'Risk score',
    balance: 'Total balance',
    clientId: 'Client ID',
    phoneLabel: 'Phone',
    monthlyPayment: 'Monthly payment',
    nextPayment: 'Next payment date',
    quickQuestions: [
      'С моей HUMO карты списали 250 000 сум',
      'Какой у меня баланс?',
      'Когда следующий платеж по кредиту?',
      'Я потерял карту',
    ],
    initialQuestion: 'С моей HUMO карты списали 250 000 сум',
  },
  en: {
    subtitle: 'Automated customer support for SQB Bank',
    phone: 'Customer phone number',
    start: 'Start AI Call',
    search: 'Search customer, card, transaction...',
    online: 'AI Operator Online',
    mode: 'Autonomous AI',
    overview: 'Customer overview',
    profile: 'Customer profile',
    cards: 'Active cards',
    loan: 'Active loan',
    deposit: 'Deposit balance',
    transactions: 'Last 5 transactions',
    history: 'Recent support history',
    alerts: 'Security alerts',
    transcript: 'Customer question transcript',
    answer: 'AI answer',
    askPlaceholder: 'Customer asks...',
    ask: 'Ask AI',
    voice: 'Start voice input',
    speak: 'Speak answer',
    intent: 'Detected intent',
    risk: 'Risk level',
    source: 'Knowledge source',
    compliance: 'Compliance warning',
    escalation: 'Escalation',
    summary: 'Call summary',
    kyc: 'KYC status',
    riskScore: 'Risk score',
    balance: 'Total balance',
    clientId: 'Client ID',
    phoneLabel: 'Phone',
    monthlyPayment: 'Monthly payment',
    nextPayment: 'Next payment date',
    quickQuestions: [
      'A 250,000 som payment was charged from my HUMO card',
      'What is my balance?',
      'When is my next loan payment?',
      'I lost my card',
    ],
    initialQuestion: 'A 250,000 som payment was charged from my HUMO card',
  },
}

function MetricCard({ label, value, tone }) {
  return (
    <section className={`metric-card ${tone || ''}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </section>
  )
}

function DataCard({ title, children, className = '' }) {
  return (
    <section className={`data-card ${className}`}>
      <div className="card-title">
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  )
}

function LanguageSwitch({ language, onChange }) {
  return (
    <div className="language-switch" aria-label="Language switch">
      {languages.map((item) => (
        <button className={language === item ? 'active' : ''} key={item} type="button" onClick={() => onChange(item)}>
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

function Dashboard({
  activeNav,
  setActiveNav,
  lang,
  setLang,
  copy,
  search,
  setSearch,
  question,
  setQuestion,
  aiResult,
  askAI,
  isThinking,
  voiceStatus,
  startVoiceInput,
  speakAnswer,
  blurred = false,
}) {
  return (
    <main className={`app-shell ${blurred ? 'is-blurred' : ''}`}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">SQB</div>
          <div>
            <strong>SQB Bank</strong>
            <span>AI Operations</span>
          </div>
        </div>
        <nav>
          {navItems.map((item) => (
            <button className={activeNav === item ? 'active' : ''} key={item} type="button" onClick={() => setActiveNav(item)}>
              <span />
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <label className="search-box">
            <span>Search</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={copy.search} />
          </label>
          <div className="topbar-actions">
            <LanguageSwitch language={lang} onChange={setLang} />
            <div className="status-pill">
              <span />
              {copy.online}
            </div>
            <div className="mode-pill">{copy.mode}</div>
          </div>
        </header>

        <section className="content-grid">
          <section className="main-content">
            <div className="profile-hero">
              <div>
                <p>{copy.overview}</p>
                <h1>{customerData.name}</h1>
                <div className="identity-row">
                  <span>{copy.phoneLabel}: {customerData.phone}</span>
                  <span>{copy.clientId}: {customerData.clientId}</span>
                </div>
              </div>
              <div className="kyc-badge">{customerData.kycStatus}</div>
            </div>

            <div className="metric-grid">
              <MetricCard label={copy.balance} value={customerData.totalBalance} />
              <MetricCard label={copy.kyc} value={customerData.kycStatus} tone="success" />
              <MetricCard label={copy.riskScore} value={customerData.riskScore} tone="success" />
              <MetricCard label={copy.deposit} value={customerData.depositBalance} />
            </div>

            <div className="two-column">
              <DataCard title={copy.cards}>
                <div className="card-list">
                  {customerData.cards.map((card) => (
                    <article className="bank-card-row" key={card.number}>
                      <div>
                        <strong>{card.network}</strong>
                        <span>{card.number}</span>
                      </div>
                      <div>
                        <strong>{card.balance}</strong>
                        <span>{card.status}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </DataCard>

              <DataCard title={copy.loan}>
                <div className="loan-card">
                  <span>Outstanding</span>
                  <strong>{customerData.loan.amount}</strong>
                  <div>
                    <p>{copy.monthlyPayment}</p>
                    <b>{customerData.loan.monthlyPayment}</b>
                  </div>
                  <div>
                    <p>{copy.nextPayment}</p>
                    <b>{customerData.loan.nextPaymentDate}</b>
                  </div>
                </div>
              </DataCard>
            </div>

            <div className="two-column lower">
              <DataCard title={copy.transactions}>
                <div className="transaction-list">
                  {customerData.transactions.map((transaction) => (
                    <article key={`${transaction.amount}-${transaction.merchant}`}>
                      <div>
                        <strong>{transaction.merchant}</strong>
                        <span>{transaction.type}</span>
                      </div>
                      <b>{transaction.amount}</b>
                    </article>
                  ))}
                </div>
              </DataCard>

              <div className="stacked-cards">
                <DataCard title={copy.history}>
                  <ul className="simple-list">
                    {customerData.supportHistory.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </DataCard>
                <DataCard title={copy.alerts}>
                  <ul className="simple-list">
                    {customerData.securityAlerts.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </DataCard>
              </div>
            </div>
          </section>

          <aside className="ai-panel">
            <div className="panel-heading">
              <p>AI Call Center</p>
              <h2>SQB AI Voice Agent</h2>
              <span>{voiceStatus}</span>
            </div>

            <section className="transcript-box">
              <span>{copy.transcript}</span>
              <p>{question || copy.askPlaceholder}</p>
            </section>

            <section className="answer-box">
              <span>{copy.answer}</span>
              <p>{isThinking ? 'AI is thinking...' : aiResult.response}</p>
            </section>

            <form className="ask-form" onSubmit={(event) => {
              event.preventDefault()
              askAI(question)
            }}>
              <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={copy.askPlaceholder} />
              <button type="submit" disabled={!question.trim() || isThinking}>{copy.ask}</button>
            </form>

            <div className="voice-actions">
              <button type="button" onClick={() => startVoiceInput(setQuestion)}>{copy.voice}</button>
              <button type="button" onClick={() => speakAnswer(aiResult.response)}>{copy.speak}</button>
            </div>

            <div className="quick-demo">
              {copy.quickQuestions.map((item) => (
                <button key={item} type="button" onClick={() => askAI(item)}>{item}</button>
              ))}
            </div>

            <div className="ai-insights">
              <MetricCard label={copy.intent} value={aiResult.intent} />
              <MetricCard label={copy.risk} value={aiResult.riskLevel} tone={aiResult.riskLevel === 'High' ? 'danger' : aiResult.riskLevel === 'Medium' ? 'warning' : 'success'} />
            </div>

            <DataCard title={copy.source} className="compact-card">
              <p className="body-copy">{aiResult.knowledgeSource}</p>
            </DataCard>
            <DataCard title={copy.compliance} className="compact-card warning-card">
              <p className="body-copy">{aiResult.complianceWarning}</p>
            </DataCard>
            <DataCard title={copy.escalation} className="compact-card">
              <p className="body-copy strong">{aiResult.escalation}</p>
            </DataCard>
            <DataCard title={copy.summary} className="compact-card">
              <p className="body-copy">{aiResult.callSummary}</p>
            </DataCard>
          </aside>
        </section>
      </section>
    </main>
  )
}

function App() {
  const [callStarted, setCallStarted] = useState(false)
  const [lang, setLang] = useState('uz')
  const [phoneNumber, setPhoneNumber] = useState(customerData.phone)
  const [activeNav, setActiveNav] = useState('Overview')
  const [search, setSearch] = useState('')
  const [question, setQuestion] = useState(labels.uz.initialQuestion)
  const [isThinking, setIsThinking] = useState(false)
  const [aiResult, setAiResult] = useState(() => answerCustomerQuestion(labels.uz.initialQuestion, 'uz', customerData))
  const { voiceStatus, setVoiceStatus, startVoiceInput, speakAnswer } = useVoiceAssistant(lang)

  const copy = labels[lang]

  function changeLanguage(nextLang) {
    setLang(nextLang)
    const nextQuestion = labels[nextLang].quickQuestions[0]
    setQuestion(nextQuestion)
    setAiResult(answerCustomerQuestion(nextQuestion, nextLang, customerData))
    setVoiceStatus('Ready')
  }

  function askAI(text) {
    const clean = text.trim()
    if (!clean || isThinking) return
    setQuestion(clean)
    setIsThinking(true)
    setVoiceStatus('Thinking...')

    window.setTimeout(() => {
      setAiResult(answerCustomerQuestion(clean, lang, customerData))
      setIsThinking(false)
      setVoiceStatus('Ready')
    }, 900)
  }

  function startCall(event) {
    event.preventDefault()
    if (!phoneNumber.trim()) return
    setCallStarted(true)
  }

  return (
    <div className="product-root">
      <Dashboard
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        lang={lang}
        setLang={changeLanguage}
        copy={copy}
        search={search}
        setSearch={setSearch}
        question={question}
        setQuestion={setQuestion}
        aiResult={aiResult}
        askAI={askAI}
        isThinking={isThinking}
        voiceStatus={voiceStatus}
        startVoiceInput={startVoiceInput}
        speakAnswer={speakAnswer}
        blurred={!callStarted}
      />

      {!callStarted && (
        <section className="login-overlay" aria-label="Start call">
          <form className="login-card" onSubmit={startCall}>
            <div className="login-logo">SQB</div>
            <h1>SQB AI Voice Agent</h1>
            <p>{copy.subtitle}</p>
            <label>
              <span>{copy.phone}</span>
              <input value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} placeholder="+998 90 123 45 67" />
            </label>
            <button type="submit">{copy.start}</button>
          </form>
        </section>
      )}
    </div>
  )
}

export default App
