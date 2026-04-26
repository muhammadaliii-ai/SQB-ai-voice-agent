import { useState } from 'react'
import './App.css'

const customerData = {
  name: 'Azizbek Karimov',
  phone: '+998 90 123 45 67',
  clientId: 'SQB-204918',
  kyc: 'Verified',
  riskScore: 'Low',
  totalBalance: '14,250,000 so‘m',
  cards: [
    { type: 'HUMO card', number: '**** 4821', balance: '3,400,000 so‘m' },
    { type: 'UZCARD', number: '**** 1190', balance: '850,000 so‘m' },
    { type: 'Visa Virtual', number: '**** 7742', balance: '120 USD' },
  ],
  loan: {
    amount: '45,000,000 so‘m',
    monthlyPayment: '3,200,000 so‘m',
    nextPaymentDate: '05.05.2026',
  },
  deposit: '25,000,000 so‘m',
  transactions: [
    ['250,000 so‘m', 'Uzum Market'],
    ['45,000 so‘m', 'Payme'],
    ['1,200,000 so‘m', 'Salary incoming'],
    ['120,000 so‘m', 'Yandex Go'],
    ['500,000 so‘m', 'ATM withdrawal'],
  ],
}

const baseReasons = [
  { label: 'Loan due date / next payment', value: 35, key: 'Loan due date' },
  { label: 'Card balance / transaction questions', value: 18, key: 'Balance inquiry' },
  { label: 'SQB Mobile app issues', value: 14, key: 'SQB Mobile issue' },
  { label: 'Card block / suspicious transaction', value: 11, key: 'Suspicious card transaction' },
  { label: 'Loan application / product info', value: 9, key: 'Loan product info' },
  { label: 'Deposit / savings questions', value: 6, key: 'Deposit questions' },
  { label: 'Other / unknown', value: 7, key: 'Unknown / needs clustering' },
]

const demos = [
  { label: 'Loan due date question', text: 'Assalomu alaykum, kreditim bo‘yicha keyingi to‘lov qachonligini bilmoqchi edim.' },
  { label: 'Balance question', text: 'Hisobimda qancha qoldiq bor, balansni aytib bera olasizmi?' },
  { label: 'Suspicious card transaction', text: 'Kartamdan pul yechildi, men qilmaganman, shubhali operatsiya.' },
  { label: 'SQB Mobile problem', text: 'SQB Mobile ilovasiga kirib bo‘lmayapti, pul o‘tkazma ishlamayapti.' },
  { label: 'Unknown question', text: 'Bankomatdan yechish limitini oshirish va karta yetkazib berish holatini bilmoqchiman.' },
]

const unknownSeeds = [
  'Loan restructuring questions',
  'Mobile app login errors',
  'Card delivery status',
  'ATM cash withdrawal limit',
]

const initialAnalysis = {
  category: 'Loan due date',
  confidence: 96,
  sentiment: 'Neutral',
  response: 'Sizning keyingi kredit to‘lovingiz 05.05.2026 kuni. Oylik to‘lov miqdori 3 200 000 so‘m.',
  compliance: 'Verify identity before sharing account details',
  escalation: 'No',
  action: 'Confirm customer identity, then provide due date and monthly payment.',
  risk: 'Low',
}

function analyzeCall(text, language, customer) {
  const normalized = text.toLowerCase()
  const rules = [
    {
      category: 'Loan due date',
      confidence: 96,
      sentiment: 'Neutral',
      risk: 'Low',
      escalation: 'No',
      keywords: ['keyingi to‘lov', 'keyingi tolov', 'to‘lov qachon', 'tolov qachon', 'kredit to‘lovi', 'kredit tolovi', 'oylik to‘lov', 'oylik tolov', 'следующий платеж', 'когда платить', 'платеж по кредиту'],
      uz: `Sizning keyingi kredit to‘lovingiz ${customer.loan.nextPaymentDate} kuni. Oylik to‘lov miqdori ${customer.loan.monthlyPayment}.`,
      ru: `Ваш следующий платеж по кредиту — ${customer.loan.nextPaymentDate}. Ежемесячный платеж составляет ${customer.loan.monthlyPayment.replace('so‘m', 'сум')}.`,
      compliance: 'Verify identity before sharing personal account details',
      action: 'Confirm KYC, explain payment date, and offer automatic reminder setup.',
    },
    {
      category: 'Balance inquiry',
      confidence: 94,
      sentiment: 'Neutral',
      risk: 'Low',
      escalation: 'No',
      keywords: ['balans', 'qoldiq', 'hisobimda qancha', 'баланс', 'остаток', 'сколько на счету'],
      uz: 'Sizning umumiy balansingiz 14 250 000 so‘m. HUMO kartada 3 400 000 so‘m, UZCARD kartada 850 000 so‘m mavjud.',
      ru: 'Ваш общий баланс — 14 250 000 сум. На HUMO карте 3 400 000 сум, на UZCARD — 850 000 сум.',
      compliance: 'Verify identity before balance disclosure',
      action: 'Complete KYC verification, then summarize total and card balances.',
    },
    {
      category: 'Suspicious card transaction',
      confidence: 91,
      sentiment: 'Worried',
      risk: 'High',
      escalation: 'Yes',
      keywords: ['pul yechildi', 'men qilmaganman', 'shubhali', 'karta', 'списали', 'я не совершал', 'подозрительная операция', 'карта'],
      uz: 'Xavfsizlik uchun avval shaxsingizni tasdiqlaymiz. PIN yoki SMS kodni hech kimga aytmang. Kartani vaqtincha bloklash va shubhali operatsiya bo‘yicha ariza ochish tavsiya etiladi.',
      ru: 'Для безопасности сначала подтвердим вашу личность. Никому не сообщайте PIN или SMS-код. Рекомендуется временно заблокировать карту и открыть обращение по спорной операции.',
      compliance: 'Never ask PIN or SMS code',
      action: 'Block card temporarily, open dispute case, and escalate to fraud queue.',
    },
    {
      category: 'SQB Mobile issue',
      confidence: 89,
      sentiment: 'Worried',
      risk: 'Medium',
      escalation: 'No',
      keywords: ['sqb mobile', 'ilova', 'kirib bo‘lmayapti', 'kirib bolmayapti', 'pul o‘tkazma', 'pul otkazma', 'приложение', 'не могу войти', 'перевод'],
      uz: 'SQB Mobile bo‘yicha muammoni tekshirish uchun internet aloqasi, ilova versiyasi va telefon raqamingiz bankda ro‘yxatdan o‘tganini tekshiramiz.',
      ru: 'Для проверки проблемы в SQB Mobile уточним интернет-соединение, версию приложения и привязку номера телефона к банку.',
      compliance: 'Do not request passwords, PIN, or SMS codes',
      action: 'Check app version, registered phone number, and recent transfer status.',
    },
  ]

  const match = rules.find((rule) => rule.keywords.some((keyword) => normalized.includes(keyword)))

  if (!match) {
    return {
      category: 'Unknown / needs clustering',
      confidence: 42,
      sentiment: 'Neutral',
      risk: 'Medium',
      escalation: 'Review',
      response: language === 'ru'
        ? 'Это обращение будет отмечено как новая категория, и система обучится после ответа оператора.'
        : 'Bu murojaatni yangi kategoriya sifatida belgilab, operator javobidan keyin tizimga o‘rgatamiz.',
      compliance: 'Operator answer should be reviewed before automation',
      action: 'Add to unknown cluster, collect operator resolution, and prepare a new category.',
    }
  }

  return {
    category: match.category,
    confidence: match.confidence,
    sentiment: match.sentiment,
    risk: match.risk,
    escalation: match.escalation,
    response: language === 'ru' ? match.ru : match.uz,
    compliance: match.compliance,
    action: match.action,
  }
}

function Header({ language, setLanguage, currentTime }) {
  return (
    <header className="top-header">
      <div>
        <p className="eyebrow">SQB Bank management dashboard</p>
        <h1>SQB Call Intelligence AI</h1>
        <span>Real-time call listener + demand analytics for SQB Bank</span>
      </div>
      <div className="header-actions">
        <span className="live-status"><i />Live monitoring</span>
        <div className="language-switch">
          {['uz', 'ru'].map((item) => (
            <button className={language === item ? 'active' : ''} key={item} type="button" onClick={() => setLanguage(item)}>
              {item.toUpperCase()}
            </button>
          ))}
        </div>
        <time>{currentTime}</time>
        <button className="primary-button" type="button">Export report</button>
      </div>
    </header>
  )
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand-mark">SQB</div>
      {['Live Calls', 'Demand Analytics', 'Customer Profile', 'Operator Assist', 'Compliance', 'Reports'].map((item, index) => (
        <button className={index === 0 ? 'active' : ''} key={item} type="button">{item}</button>
      ))}
    </aside>
  )
}

function StatCard({ label, value, detail }) {
  return (
    <article className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {detail ? <small>{detail}</small> : null}
    </article>
  )
}

function DemandAnalytics({ reasons }) {
  const total = reasons.reduce((sum, item) => sum + item.value, 0)
  return (
    <section className="card wide-card">
      <div className="section-title">
        <div>
          <p className="eyebrow">Demand analytics</p>
          <h2>Most common call reasons</h2>
        </div>
        <strong>{total}% classified distribution</strong>
      </div>
      <div className="reason-grid">
        {reasons.map((reason) => (
          <article className="reason-row" key={reason.key}>
            <div>
              <span>{reason.label}</span>
              <b>{reason.value}%</b>
            </div>
            <div className="bar"><i style={{ width: `${reason.value * 2.35}%` }} /></div>
          </article>
        ))}
      </div>
      <div className="insight-card">
        <b>Insight</b>
        <p>Most common reason today: loan payment due date. Recommend adding automatic IVR/AI answer for due-date questions.</p>
      </div>
    </section>
  )
}

function Transcript({ messages }) {
  return (
    <div className="transcript">
      {messages.map((message) => (
        <article className={message.role === 'AI' ? 'ai-message' : ''} key={message.id}>
          <span>{message.role}</span>
          <p>{message.text}</p>
        </article>
      ))}
    </div>
  )
}

function CustomerProfile() {
  return (
    <section className="card profile-card">
      <div className="section-title">
        <div>
          <p className="eyebrow">Customer profile</p>
          <h2>{customerData.name}</h2>
        </div>
        <span className="risk-pill">Risk score: {customerData.riskScore}</span>
      </div>
      <div className="profile-grid">
        <span>Phone<b>{customerData.phone}</b></span>
        <span>Client ID<b>{customerData.clientId}</b></span>
        <span>KYC<b>{customerData.kyc}</b></span>
        <span>Total balance<b>{customerData.totalBalance}</b></span>
      </div>
      <div className="asset-list">
        {customerData.cards.map((card) => (
          <article key={card.number}>
            <span>{card.type} {card.number}</span>
            <b>{card.balance}</b>
          </article>
        ))}
      </div>
      <div className="loan-grid">
        <span>Active loan<b>{customerData.loan.amount}</b></span>
        <span>Monthly payment<b>{customerData.loan.monthlyPayment}</b></span>
        <span>Next payment date<b>{customerData.loan.nextPaymentDate}</b></span>
        <span>Deposit<b>{customerData.deposit}</b></span>
      </div>
      <h3>Last transactions</h3>
      <div className="transaction-list">
        {customerData.transactions.map(([amount, merchant]) => (
          <article key={`${amount}-${merchant}`}>
            <span>{merchant}</span>
            <b>{amount}</b>
          </article>
        ))}
      </div>
    </section>
  )
}

function OperatorAssist({ analysis }) {
  return (
    <section className="card assist-card">
      <p className="eyebrow">Operator assist</p>
      <h2>AI suggestions</h2>
      <div className="assist-list">
        <article><span>What to say next</span><p>{analysis.response}</p></article>
        <article><span>Next best offer</span><p>Offer payment reminder setup and SQB Mobile self-service guide.</p></article>
        <article><span>Required KYC/compliance step</span><p>{analysis.compliance}</p></article>
        <article><span>Risk warning</span><p>{analysis.risk === 'High' ? 'High-risk financial complaint. Escalate and protect card immediately.' : 'No critical risk detected after standard verification.'}</p></article>
      </div>
    </section>
  )
}

function UnknownCalls({ unknownShare, clusters, categoryCreated, onCreate }) {
  return (
    <section className="card">
      <div className="section-title">
        <div>
          <p className="eyebrow">Learning module</p>
          <h2>Unclassified / Unknown Calls</h2>
        </div>
        <strong>{unknownShare}% unknown share</strong>
      </div>
      <p className="body-copy">AI groups unknown calls by similarity so supervisors can create new categories instead of expecting perfect detection on day one.</p>
      <div className="cluster-list">
        {clusters.map((cluster) => <span key={cluster}>{cluster}</span>)}
      </div>
      <button className="secondary-button" type="button" onClick={onCreate}>Create new category from cluster</button>
      {categoryCreated ? <div className="success-note">Category created: ATM cash withdrawal limit</div> : null}
    </section>
  )
}

function PlatformCards() {
  const modules = [
    ['Speech-to-text module', 'Uzbek/Russian/English transcription under 500ms'],
    ['Conversation Intelligence', 'Intent, sentiment, and objection detection'],
    ['Knowledge Base + RAG', 'Bank products, rates, scripts, FAQ, compliance rules'],
    ['Recommendation Engine', 'Next best action based on ABS/CRM/scoring/context'],
    ['Agent UI overlay', 'Suggestions without interrupting the operator'],
    ['Supervisor Dashboard', 'Live monitoring and barging-in for critical calls'],
    ['Analytics', 'Conversion, script compliance, call duration, strong/weak points'],
    ['Training mode', 'Simulated calls for new agents'],
    ['Integrations', 'Asterisk/Cisco/Avaya, CRM, ABS, scoring, Knowledge Base, QA system'],
    ['KPI', 'Conversion +15%, script compliance ≥95%, handling time -10%, agent ramp-up -30%'],
  ]

  return (
    <section className="module-grid">
      {modules.map(([title, text]) => (
        <article className="module-card" key={title}>
          <span>{title}</span>
          <p>{text}</p>
        </article>
      ))}
    </section>
  )
}

function App() {
  const [language, setLanguage] = useState('uz')
  const [input, setInput] = useState('')
  const [voiceStatus, setVoiceStatus] = useState('Voice input ready')
  const [isListening, setIsListening] = useState(false)
  const [analysis, setAnalysis] = useState(initialAnalysis)
  const [messages, setMessages] = useState([
    { id: 1, role: 'Customer', text: 'Assalomu alaykum, kreditim bo‘yicha keyingi to‘lov qachonligini bilmoqchi edim.' },
    { id: 2, role: 'Operator', text: 'Albatta, avval shaxsingizni tasdiqlab olamiz.' },
    { id: 3, role: 'AI', text: initialAnalysis.response },
  ])
  const [reasons, setReasons] = useState(baseReasons)
  const [unknownShare, setUnknownShare] = useState(13)
  const [unknownClusters, setUnknownClusters] = useState(unknownSeeds)
  const [categoryCreated, setCategoryCreated] = useState(false)
  const [callSummary, setCallSummary] = useState('Loan due date detected with high confidence. Operator can answer after identity verification.')
  const [currentTime] = useState(new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }))

  function updateDemand(category) {
    setReasons((current) => current.map((item) => (
      item.key === category ? { ...item, value: item.value + 1 } : item
    )))
    if (category === 'Unknown / needs clustering') {
      setUnknownShare((value) => Math.min(value + 1, 30))
    }
  }

  function runAnalysis(text) {
    const clean = text.trim()
    if (!clean) return

    const result = analyzeCall(clean, language, customerData)
    const nextId = Date.now()

    setAnalysis(result)
    setMessages((current) => [
      ...current,
      { id: nextId, role: 'Customer', text: clean },
      { id: nextId + 1, role: 'AI', text: result.response },
    ])
    setCallSummary(`${result.category} detected. Confidence ${result.confidence}%. Escalation needed: ${result.escalation}.`)
    setInput('')
    updateDemand(result.category)

    if (result.category === 'Unknown / needs clustering') {
      setUnknownClusters((current) => current.includes('New similar banking question') ? current : [...current, 'New similar banking question'])
    }
  }

  function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setVoiceStatus('Voice recognition is not supported in this browser. Use text input.')
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.lang = language === 'ru' ? 'ru-RU' : 'uz-UZ'
      recognition.interimResults = false
      recognition.onstart = () => {
        setIsListening(true)
        setVoiceStatus('Listening...')
      }
      recognition.onresult = (event) => {
        const text = event.results?.[0]?.[0]?.transcript || ''
        setInput(text)
        if (text) runAnalysis(text)
      }
      recognition.onerror = () => {
        setVoiceStatus('Voice recognition failed. Text input still works.')
        setIsListening(false)
      }
      recognition.onend = () => {
        setVoiceStatus('Voice input ready')
        setIsListening(false)
      }
      recognition.start()
    } catch {
      setVoiceStatus('Voice recognition failed. Text input still works.')
      setIsListening(false)
    }
  }

  function stopListening() {
    setIsListening(false)
    setVoiceStatus('Listening stopped. Text input is available.')
  }

  function speakAnswer() {
    try {
      if (!window.speechSynthesis) {
        setVoiceStatus('Speech synthesis is not supported in this browser.')
        return
      }
      const utterance = new SpeechSynthesisUtterance(analysis.response)
      utterance.lang = language === 'ru' ? 'ru-RU' : 'uz-UZ'
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utterance)
      setVoiceStatus('Speaking AI answer...')
    } catch {
      setVoiceStatus('Speech output failed. The written suggestion is still available.')
    }
  }

  function createCategory() {
    setCategoryCreated(true)
    setUnknownClusters((current) => current.filter((item) => item !== 'ATM cash withdrawal limit'))
    setReasons((current) => current.map((item) => (
      item.key === 'Unknown / needs clustering' ? { ...item, value: Math.max(item.value - 2, 1) } : item
    )))
    setUnknownShare((value) => Math.max(value - 2, 5))
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="workspace">
        <Header language={language} setLanguage={setLanguage} currentTime={currentTime} />

        <section className="overview-grid">
          <StatCard label="Total calls today" value="1,284" detail="Across SQB call center" />
          <StatCard label="Detected call intents" value="87%" detail="13% routed to learning" />
          <StatCard label="Auto-resolved simple calls" value="22%" detail="Repetitive questions" />
          <StatCard label="Human escalation" value="78%" detail="Complex calls stay human" />
          <StatCard label="Average handling time" value="3m 42s" detail="Target: -10%" />
          <StatCard label="Customer sentiment" value="68% neutral" detail="21% worried, 11% angry" />
        </section>

        <section className="main-grid">
          <div className="left-column">
            <DemandAnalytics reasons={reasons} />

            <section className="card">
              <div className="section-title">
                <div>
                  <p className="eyebrow">Live call listener</p>
                  <h2>Real-time customer conversation</h2>
                </div>
                <span className="listening-pill">{isListening ? 'Listening' : 'Standby'}</span>
              </div>
              <Transcript messages={messages} />
              <div className="analysis-grid">
                <span>Detected topic<b>{analysis.category}</b></span>
                <span>Confidence<b>{analysis.confidence}%</b></span>
                <span>Sentiment<b>{analysis.sentiment}</b></span>
                <span>Escalation needed<b>{analysis.escalation}</b></span>
              </div>
              <div className="suggested-response">
                <span>Suggested operator response</span>
                <p>{analysis.response}</p>
              </div>
              <div className="warning-box">
                <b>Compliance warning</b>
                <p>{analysis.compliance}</p>
              </div>
              <div className="recommended-action">
                <b>Recommended action</b>
                <p>{analysis.action}</p>
              </div>
            </section>

            <section className="card">
              <div className="section-title">
                <div>
                  <p className="eyebrow">Voice / conversation simulation</p>
                  <h2>Functional local demo</h2>
                </div>
                <span className="voice-status">{voiceStatus}</span>
              </div>
              <div className="control-row">
                <button type="button" onClick={startListening}>Start listening</button>
                <button type="button" onClick={stopListening}>Stop listening</button>
                <button type="button" onClick={() => runAnalysis(input)}>Analyze conversation</button>
                <button type="button" onClick={() => setMessages((current) => [...current, { id: Date.now(), role: 'Operator', text: analysis.response }])}>Use suggested response</button>
                <button type="button" onClick={speakAnswer}>Speak AI answer</button>
              </div>
              <form className="text-input-row" onSubmit={(event) => {
                event.preventDefault()
                runAnalysis(input)
              }}>
                <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Type customer question in Uzbek or Russian..." />
                <button className="primary-button" type="submit">Analyze</button>
              </form>
              <div className="demo-buttons">
                {demos.map((demo) => (
                  <button key={demo.label} type="button" onClick={() => runAnalysis(demo.text)}>{demo.label}</button>
                ))}
              </div>
            </section>

            <PlatformCards />
          </div>

          <aside className="right-column">
            <CustomerProfile />
            <OperatorAssist analysis={analysis} />
            <UnknownCalls unknownShare={unknownShare} clusters={unknownClusters} categoryCreated={categoryCreated} onCreate={createCategory} />

            <section className="card">
              <p className="eyebrow">Compliance guardrails</p>
              <h2>Required rules</h2>
              <ul className="guardrail-list">
                <li>Do not ask PIN</li>
                <li>Do not ask SMS code</li>
                <li>Verify identity before personal account details</li>
                <li>Do not guarantee loan approval</li>
                <li>Escalate legal/complex complaints</li>
              </ul>
            </section>

            <section className="card why-card">
              <p className="eyebrow">Why this matters</p>
              <h2>Human + AI operating model</h2>
              <p>20–35% of calls are repetitive and can be answered automatically. The remaining calls are analyzed, clustered, and used to improve scripts, products, and AI categories.</p>
              <div className="summary-box">{callSummary}</div>
            </section>
          </aside>
        </section>
      </main>
    </div>
  )
}

export default App
