import { useEffect, useRef, useState } from 'react'
import './App.css'

const customerProfile = {
  name: 'Azizbek Karimov',
  age: 29,
  city: 'Tashkent',
  income: '7,000,000 so‘m',
  segment: 'Mass Affluent',
  risk: 'Medium',
  loanEligibility: 'Conditional',
  activeLoan: '45,000,000 so‘m',
  monthlyPayment: '3,200,000 so‘m',
  nextPaymentDate: '05.05.2026',
}

const demandBaseline = [
  { key: 'due-date', label: 'Loan due date / next payment', value: 35 },
  { key: 'card-balance', label: 'Card balance / transaction questions', value: 18 },
  { key: 'mobile-app', label: 'SQB Mobile app issues', value: 14 },
  { key: 'card-risk', label: 'Card block / suspicious transaction', value: 11 },
  { key: 'loan-product', label: 'Loan application / product info', value: 9 },
  { key: 'deposit', label: 'Deposit / savings questions', value: 6 },
  { key: 'unknown', label: 'Other / unknown', value: 7 },
]

const forbiddenPhrases = ['100% tasdiqlanadi', 'hujjatsiz ham bo‘ladi']
const customerLoanRequest = 'Assalomu alaykum, menga kredit kerak edi. 30 million so‘m olsam bo‘ladimi?'
const operatorMistake = 'Ha, albatta, sizga 100% tasdiqlanadi, hujjatsiz ham bo‘ladi'
const customerTermsQuestion = 'Foizlari qancha va qachon to‘lashim kerak?'
const safeRewrite = 'Kredit tasdiqlanishi bank skoring tizimi, hujjatlar va bank siyosati asosida amalga oshiriladi.'
const nextBestOffer = 'Kredit karta yoki past foizli iste’mol krediti tavsiya qilinadi.'
const crmSummaryText = 'Mijoz 30 mln so‘m kredit haqida so‘radi. Operator noto‘g‘ri va’da berdi. AI xavfsiz formulirovkani taklif qildi. KYC savollar to‘liq yopilmadi. Mijoz foiz va to‘lov sanasi haqida qo‘shimcha ma’lumot so‘radi.'
const unknownDemoMessage = 'Ilovaga kira olmayapman'

const emptyAnalysis = {
  intent: 'Waiting for customer',
  sentiment: 'Not started',
  confidence: 0,
  response: 'Run the ultra-fast demo to see live intent detection, compliance monitoring, and CRM output.',
  recommendation: 'No recommendation yet.',
  risk: 'Normal',
}

const initialKycChecklist = [
  { key: 'income', label: 'Income source asked', status: 'missing' },
  { key: 'identity', label: 'Identity verification', status: 'missing' },
  { key: 'purpose', label: 'Loan purpose', status: 'missing' },
  { key: 'consent', label: 'Scoring consent', status: 'missing' },
]

const safeActions = {
  crmNote: {
    label: 'Create CRM note',
    result: 'CRM note created with loan request, compliance flag, and KYC gaps.',
  },
  manager: {
    label: 'Escalate to manager',
    result: 'Manager escalation prepared because a prohibited loan promise was detected.',
  },
  followUp: {
    label: 'Send follow-up',
    result: 'Follow-up queued with the approved safe credit wording and required KYC reminders.',
  },
}

const auditLabels = {
  call_started: 'Call started',
  customer_message: 'Customer message',
  operator_message: 'Operator message',
  compliance_violation_detected: 'Compliance violation detected',
  ai_rewrite_suggested: 'AI rewrite suggested',
  kyc_update: 'KYC update',
  recommendation_generated: 'Recommendation generated',
  crm_summary_created: 'CRM summary created',
  safe_action_executed: 'Safe action executed',
}

function formatDuration(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')
  return `${mins}:${secs}`
}

function Header({ callStatus, elapsedSeconds, demoRunning, onRunDemo, onReset, onExport }) {
  return (
    <header className="top-header">
      <div>
        <p className="eyebrow">SQB Bank management dashboard</p>
        <h1>SQB Call Intelligence AI</h1>
        <span>Real-time operator assist, compliance monitoring, demand analytics, and call learning.</span>
      </div>
      <div className="header-actions">
        <span className={`live-status ${callStatus === 'Live call' ? 'is-live' : ''}`}>
          <i />
          {callStatus}
        </span>
        <time>{formatDuration(elapsedSeconds)}</time>
        <button className="primary-button" type="button" onClick={onRunDemo} disabled={demoRunning}>
          {demoRunning ? 'Demo running...' : 'Run Ultra-Fast Demo'}
        </button>
        <button className="secondary-button" type="button" onClick={onReset}>Reset</button>
        <button className="secondary-button" type="button" onClick={onExport}>Export report</button>
      </div>
    </header>
  )
}

function Sidebar({ activeNav, onSelect }) {
  const items = ['Live Calls', 'Demand Analytics', 'Customer Profile', 'Operator Assist', 'Compliance', 'Reports']

  return (
    <aside className="sidebar">
      <div className="brand-mark">SQB</div>
      {items.map((item) => (
        <button className={activeNav === item ? 'active' : ''} key={item} type="button" onClick={() => onSelect(item)}>
          {item}
        </button>
      ))}
    </aside>
  )
}

function StatCard({ label, value, detail }) {
  return (
    <article className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  )
}

function DemandAnalytics({ demandData }) {
  return (
    <section className="card wide-card">
      <div className="section-title">
        <div>
          <p className="eyebrow">Demand analytics</p>
          <h2>Most common call reasons</h2>
        </div>
        <strong>Today’s demand mix</strong>
      </div>
      <div className="reason-grid">
        {demandData.map((item) => (
          <article className="reason-row" key={item.key}>
            <div>
              <span>{item.label}</span>
              <b>{item.value}%</b>
            </div>
            <div className="bar" aria-label={`${item.label}: ${item.value}%`}>
              <i style={{ width: `${item.value}%` }} />
            </div>
          </article>
        ))}
      </div>
      <div className="insight-card">
        <b>Insight</b>
        <p>Most common reason today: loan payment due date. Recommend adding automatic IVR/AI answer.</p>
      </div>
    </section>
  )
}

function Transcript({ messages }) {
  return (
    <div className="transcript">
      {messages.length === 0 ? (
        <article className="empty-message">
          <span>System</span>
          <p>Call transcript will appear here as the demo runs.</p>
        </article>
      ) : messages.map((message) => (
        <article className={`message-${message.role.toLowerCase()}`} key={message.id}>
          <span>{message.role}</span>
          <p>{message.text}</p>
        </article>
      ))}
    </div>
  )
}

function AnalysisPanel({ analysis, complianceAlert, nextOffer }) {
  return (
    <section className="card">
      <div className="section-title">
        <div>
          <p className="eyebrow">Live AI analysis</p>
          <h2>Intent, risk, and guidance</h2>
        </div>
        <span className={`risk-pill ${complianceAlert ? 'risk-critical' : ''}`}>
          {complianceAlert ? 'Critical risk' : analysis.risk}
        </span>
      </div>
      <div className="analysis-grid">
        <span>Intent<b>{analysis.intent}</b></span>
        <span>Sentiment<b>{analysis.sentiment}</b></span>
        <span>Confidence<b>{analysis.confidence}%</b></span>
        <span>Risk<b>{analysis.risk}</b></span>
      </div>
      <div className="suggested-response">
        <span>AI safe response</span>
        <p>{analysis.response}</p>
      </div>
      <div className="recommended-action">
        <b>Next-best-offer</b>
        <p>{nextOffer || analysis.recommendation}</p>
      </div>
    </section>
  )
}

function ComplianceAlert({ complianceAlert }) {
  if (!complianceAlert) {
    return (
      <section className="card">
        <p className="eyebrow">Compliance guardrails</p>
        <h2>No critical alert</h2>
        <p className="body-copy">AI is listening for prohibited promises, missing KYC, unsafe data requests, and risky loan language.</p>
        <ul className="guardrail-list">
          <li>Never ask PIN, SMS code, CVV, or full card password.</li>
          <li>Never guarantee loan approval.</li>
          <li>Verify identity before personal financial details.</li>
        </ul>
      </section>
    )
  }

  return (
    <section className="card compliance-card critical">
      <p className="eyebrow">Compliance alert</p>
      <h2>{complianceAlert.title}</h2>
      <strong>{complianceAlert.message}</strong>
      <div className="phrase-list">
        {complianceAlert.phrases.map((phrase) => <span key={phrase}>{phrase}</span>)}
      </div>
      <div className="safe-rewrite">
        <b>Safe rewrite</b>
        <p>{complianceAlert.safeRewrite}</p>
      </div>
    </section>
  )
}

function KycChecklist({ checklist }) {
  return (
    <section className="card">
      <p className="eyebrow">Loan KYC checklist</p>
      <h2>Required before credit decision</h2>
      <div className="checklist">
        {checklist.map((item) => (
          <article className={item.status === 'done' ? 'done' : 'missing'} key={item.key}>
            <span>{item.label}</span>
            <b>{item.status === 'done' ? 'Done' : 'Missing'}</b>
          </article>
        ))}
      </div>
    </section>
  )
}

function CustomerProfile() {
  return (
    <section className="card profile-card">
      <div className="section-title">
        <div>
          <p className="eyebrow">Customer profile</p>
          <h2>{customerProfile.name}</h2>
        </div>
        <span className="risk-pill">Risk: {customerProfile.risk}</span>
      </div>
      <div className="profile-grid">
        <span>Age<b>{customerProfile.age}</b></span>
        <span>City<b>{customerProfile.city}</b></span>
        <span>Income<b>{customerProfile.income}</b></span>
        <span>Segment<b>{customerProfile.segment}</b></span>
        <span>Loan eligibility<b>{customerProfile.loanEligibility}</b></span>
        <span>Active loan<b>{customerProfile.activeLoan}</b></span>
        <span>Monthly payment<b>{customerProfile.monthlyPayment}</b></span>
        <span>Next payment date<b>{customerProfile.nextPaymentDate}</b></span>
      </div>
    </section>
  )
}

function SafeActionLayer({ onAction, safeActionResult }) {
  return (
    <section className="card">
      <p className="eyebrow">Safe action layer</p>
      <h2>Predefined operator actions</h2>
      <div className="safe-action-row">
        {Object.entries(safeActions).map(([key, action]) => (
          <button type="button" key={key} onClick={() => onAction(key)}>
            {action.label}
          </button>
        ))}
      </div>
      <div className="action-result">
        <span>Visible result</span>
        <p>{safeActionResult || 'No safe action executed yet.'}</p>
      </div>
    </section>
  )
}

function AuditLog({ auditLog }) {
  return (
    <section className="card audit-card">
      <div className="section-title">
        <div>
          <p className="eyebrow">Audit log</p>
          <h2>Explainable event trail</h2>
        </div>
        <strong>{auditLog.length} events</strong>
      </div>
      <div className="audit-list">
        {auditLog.length === 0 ? (
          <article>
            <span>Ready</span>
            <p>Run the demo to populate the audit trail.</p>
          </article>
        ) : auditLog.map((item) => (
          <article key={item.id}>
            <time>{item.time}</time>
            <span>{auditLabels[item.type]}</span>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function UnknownCallsCluster({ unknownLearning, onRunUnknownDemo }) {
  return (
    <section className="card">
      <div className="section-title">
        <div>
          <p className="eyebrow">Unknown Calls Cluster</p>
          <h2>Learning from new call patterns</h2>
        </div>
        <button className="secondary-button" type="button" onClick={onRunUnknownDemo}>
          {unknownDemoMessage}
        </button>
      </div>
      <div className="unknown-grid">
        <span>Demo message<b>{unknownLearning.message}</b></span>
        <span>Initial classification<b>{unknownLearning.initial}</b></span>
        <span>Cluster<b>{unknownLearning.cluster}</b></span>
      </div>
      <div className="insight-card">
        <b>Insight</b>
        <p>{unknownLearning.insight}</p>
      </div>
    </section>
  )
}

function VoicePanel({ input, setInput, voiceStatus, isListening, onAnalyze, onStartVoice, onStopVoice, onSpeak }) {
  return (
    <section className="card">
      <div className="section-title">
        <div>
          <p className="eyebrow">Voice simulation</p>
          <h2>Speech controls</h2>
        </div>
        <span className={`voice-status ${isListening ? 'is-listening' : ''}`}>{voiceStatus}</span>
      </div>
      <div className="control-row">
        <button type="button" onClick={onStartVoice}>Start Voice</button>
        <button type="button" onClick={onStopVoice}>Stop Voice</button>
        <button type="button" onClick={onSpeak}>Speak AI Response</button>
      </div>
      <form className="text-input-row" onSubmit={(event) => {
        event.preventDefault()
        onAnalyze(input)
      }}>
        <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Type or dictate a customer message..." />
        <button className="primary-button" type="submit">Analyze</button>
      </form>
    </section>
  )
}

function CrmSummary({ crmSummary, exportStatus }) {
  return (
    <section className="card">
      <p className="eyebrow">CRM summary</p>
      <h2>End-of-call note</h2>
      <p className="summary-box">{crmSummary || 'CRM summary will be created automatically at the end of the demo.'}</p>
      {exportStatus ? <div className="success-note">{exportStatus}</div> : null}
    </section>
  )
}

function WhyMatters() {
  return (
    <section className="card why-card">
      <p className="eyebrow">Why this matters</p>
      <h2>Automation where it is safe</h2>
      <p>20–35% of calls are repetitive and can be automated. Remaining calls are analyzed, clustered, and used to improve scripts, products, and AI categories.</p>
    </section>
  )
}

function App() {
  const [activeNav, setActiveNav] = useState('Live Calls')
  const [messages, setMessages] = useState([])
  const [analysis, setAnalysis] = useState(emptyAnalysis)
  const [complianceAlert, setComplianceAlert] = useState(null)
  const [kycChecklist, setKycChecklist] = useState(initialKycChecklist)
  const [nextOffer, setNextOffer] = useState('')
  const [crmSummary, setCrmSummary] = useState('')
  const [safeActionResult, setSafeActionResult] = useState('')
  const [auditLog, setAuditLog] = useState([])
  const [demandData, setDemandData] = useState(demandBaseline)
  const [unknownLearning, setUnknownLearning] = useState({
    message: unknownDemoMessage,
    initial: 'Not tested',
    cluster: 'No cluster yet',
    insight: 'Run the demo message to create a new mobile-app issue pattern.',
  })
  const [input, setInput] = useState('')
  const [voiceStatus, setVoiceStatus] = useState('Voice ready')
  const [isListening, setIsListening] = useState(false)
  const [callStatus, setCallStatus] = useState('Standby')
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [demoRunning, setDemoRunning] = useState(false)
  const [exportStatus, setExportStatus] = useState('')
  const timeoutsRef = useRef([])
  const recognitionRef = useRef(null)
  const idRef = useRef(1)

  function nextId(prefix) {
    const id = `${prefix}-${idRef.current}`
    idRef.current += 1
    return id
  }

  function clearScheduledDemo() {
    timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
    timeoutsRef.current = []
  }

  function addAudit(type, detail) {
    setAuditLog((current) => [
      ...current,
      {
        id: nextId('audit'),
        type,
        detail,
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      },
    ])
  }

  function addMessage(role, text) {
    setMessages((current) => [...current, { id: nextId('message'), role, text }])
  }

  function resetDemoState() {
    clearScheduledDemo()
    idRef.current = 1
    setMessages([])
    setAnalysis(emptyAnalysis)
    setComplianceAlert(null)
    setKycChecklist(initialKycChecklist)
    setNextOffer('')
    setCrmSummary('')
    setSafeActionResult('')
    setAuditLog([])
    setDemandData(demandBaseline)
    setUnknownLearning({
      message: unknownDemoMessage,
      initial: 'Not tested',
      cluster: 'No cluster yet',
      insight: 'Run the demo message to create a new mobile-app issue pattern.',
    })
    setInput('')
    setVoiceStatus('Voice ready')
    setIsListening(false)
    setCallStatus('Standby')
    setElapsedSeconds(0)
    setDemoRunning(false)
    setExportStatus('')
  }

  function scheduleStep(callback, delay) {
    const timeoutId = window.setTimeout(callback, delay)
    timeoutsRef.current.push(timeoutId)
  }

  function runUltraFastDemo() {
    resetDemoState()
    setCallStatus('Live call')
    setElapsedSeconds(0)
    setDemoRunning(true)
    addAudit('call_started', 'Ultra-fast credit call demo started.')

    scheduleStep(() => {
      addMessage('Customer', customerLoanRequest)
      setAnalysis({
        intent: 'Kredit so‘rovi',
        sentiment: 'Neytral',
        confidence: 95,
        response: 'Mijoz kredit olish imkoniyatini so‘radi. Operator kredit tasdiqlanishi skoring va hujjatlarga bog‘liqligini tushuntirishi kerak.',
        recommendation: 'Income, loan purpose, identity verification, and scoring consent must be completed first.',
        risk: 'Medium',
      })
      addAudit('customer_message', customerLoanRequest)
    }, 800)

    scheduleStep(() => {
      addMessage('Operator', operatorMistake)
      setComplianceAlert({
        title: 'CRITICAL RISK',
        message: 'Operator prohibited promise detected',
        phrases: forbiddenPhrases,
        safeRewrite,
      })
      setKycChecklist((current) => current.map((item) => (
        item.key === 'income' ? { ...item, status: 'done' } : { ...item, status: 'missing' }
      )))
      addAudit('operator_message', operatorMistake)
      addAudit('compliance_violation_detected', 'Forbidden phrases detected: 100% tasdiqlanadi; hujjatsiz ham bo‘ladi.')
      addAudit('ai_rewrite_suggested', safeRewrite)
      addAudit('kyc_update', 'Income source asked: done. Identity verification, loan purpose, and scoring consent: missing.')
    }, 1800)

    scheduleStep(() => {
      addMessage('AI', safeRewrite)
    }, 2700)

    scheduleStep(() => {
      addMessage('Customer', customerTermsQuestion)
      setAnalysis({
        intent: 'Kredit shartlari',
        sentiment: 'Neytral',
        confidence: 92,
        response: 'Foiz stavkasi va to‘lov jadvali kredit turi, muddat, skoring natijasi va bank siyosatiga bog‘liq. Tasdiqdan oldin barcha shartlar mijozga aniq tushuntiriladi.',
        recommendation: nextBestOffer,
        risk: 'Medium',
      })
      setNextOffer(nextBestOffer)
      addAudit('customer_message', customerTermsQuestion)
      addAudit('recommendation_generated', nextBestOffer)
    }, 3700)

    scheduleStep(() => {
      setCrmSummary(crmSummaryText)
      setCallStatus('Summary ready')
      setDemoRunning(false)
      addAudit('crm_summary_created', 'CRM summary created with compliance risk and incomplete KYC checklist.')
    }, 4900)
  }

  function analyzeManualMessage(text) {
    const clean = text.trim()
    if (!clean) return

    const normalized = clean.toLowerCase()
    if (normalized.includes('ilova') || normalized.includes('kira olmayapman')) {
      setInput('')
      runUnknownCallsDemo(clean)
      return
    }

    addMessage('Customer', clean)
    addAudit('customer_message', clean)
    setInput('')

    if (normalized.includes('foiz') || normalized.includes('to‘lash') || normalized.includes("to'lash")) {
      setAnalysis({
        intent: 'Kredit shartlari',
        sentiment: 'Neytral',
        confidence: 92,
        response: 'Foiz va to‘lov jadvali kredit turi, skoring va hujjatlarga bog‘liq. Tasdiq kafolatlanmaydi.',
        recommendation: nextBestOffer,
        risk: 'Medium',
      })
      setNextOffer(nextBestOffer)
      addAudit('recommendation_generated', nextBestOffer)
      return
    }

    if (normalized.includes('kredit')) {
      setAnalysis({
        intent: 'Kredit so‘rovi',
        sentiment: 'Neytral',
        confidence: 95,
        response: safeRewrite,
        recommendation: 'Complete KYC and scoring consent before discussing eligibility.',
        risk: 'Medium',
      })
      return
    }

    setAnalysis({
      intent: 'Unknown',
      sentiment: 'Neytral',
      confidence: 48,
      response: 'Bu murojaat yangi kategoriya sifatida ko‘rib chiqiladi va operator javobi asosida klasterga qo‘shiladi.',
      recommendation: 'Route to supervisor review and learning queue.',
      risk: 'Review',
    })
  }

  function runUnknownCallsDemo(message = unknownDemoMessage) {
    addMessage('Customer', message)
    addAudit('customer_message', message)
    setAnalysis({
      intent: 'Unknown',
      sentiment: 'Neytral',
      confidence: 41,
      response: 'AI bu murojaatni avval unknown deb belgiladi va o‘xshash murojaatlar bilan solishtirmoqda.',
      recommendation: 'Cluster after similarity check.',
      risk: 'Review',
    })
    setUnknownLearning({
      message,
      initial: 'Unknown',
      cluster: 'Detecting...',
      insight: 'Unknown message captured for clustering.',
    })

    scheduleStep(() => {
      setUnknownLearning({
        message,
        initial: 'Unknown',
        cluster: 'Mobile App Issues',
        insight: 'New pattern detected: Mobile App Issues',
      })
      setDemandData((current) => current.map((item) => {
        if (item.key === 'mobile-app') return { ...item, value: item.value + 1 }
        if (item.key === 'unknown') return { ...item, value: Math.max(item.value - 1, 0) }
        return item
      }))
      setAnalysis({
        intent: 'Mobile App Issues',
        sentiment: 'Neytral',
        confidence: 88,
        response: 'SQB Mobile bo‘yicha muammo klasterga qo‘shildi. Operator ilova versiyasi, internet aloqasi va ro‘yxatdan o‘tgan telefon raqamini tekshiradi.',
        recommendation: 'Prepare a reusable SQB Mobile support script.',
        risk: 'Normal',
      })
      addAudit('recommendation_generated', 'New pattern detected: Mobile App Issues. Demand analytics updated.')
    }, 900)
  }

  function executeSafeAction(actionKey) {
    const action = safeActions[actionKey]
    if (!action) return
    setSafeActionResult(action.result)
    addAudit('safe_action_executed', action.result)
  }

  function exportReport() {
    const result = auditLog.length
      ? `Report prepared with ${auditLog.length} audit events and current CRM summary.`
      : 'Report shell prepared. Run the demo to include audit events.'
    setExportStatus(result)
    addAudit('safe_action_executed', result)
  }

  function startVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setVoiceStatus('SpeechRecognition is not supported in this browser. Use the text input fallback.')
      return
    }

    try {
      if (recognitionRef.current) recognitionRef.current.stop()
      const recognition = new SpeechRecognition()
      recognition.lang = 'uz-UZ'
      recognition.interimResults = false
      recognition.continuous = false
      recognition.onstart = () => {
        setIsListening(true)
        setVoiceStatus('Listening...')
      }
      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript || ''
        if (transcript) {
          setInput(transcript)
          addMessage('Customer', transcript)
          addAudit('customer_message', `Voice transcript captured: ${transcript}`)
        }
      }
      recognition.onerror = () => {
        setVoiceStatus('Voice recognition failed. Text input still works.')
        setIsListening(false)
      }
      recognition.onend = () => {
        setIsListening(false)
        setVoiceStatus('Voice ready')
      }
      recognitionRef.current = recognition
      recognition.start()
    } catch {
      setVoiceStatus('Voice recognition failed. Text input still works.')
      setIsListening(false)
    }
  }

  function stopVoice() {
    try {
      if (recognitionRef.current) recognitionRef.current.stop()
    } catch {
      setVoiceStatus('Voice stop failed. Text input still works.')
    }
    setIsListening(false)
    setVoiceStatus('Voice stopped. Text input is available.')
  }

  async function speakAiResponse() {
    const text = analysis?.suggestedResponse || analysis?.response || complianceAlert?.safeRewrite || crmSummary || 'AI javobi hali tayyor emas.'

    function speakText(textToSpeak) {
      if (!window.speechSynthesis) {
        setVoiceStatus('Voice error')
        return
      }

      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(textToSpeak)
      utterance.lang = 'uz-UZ'
      utterance.onstart = () => setVoiceStatus('Speaking...')
      utterance.onend = () => setVoiceStatus('Ready')
      utterance.onerror = () => setVoiceStatus('Voice error')
      setVoiceStatus('Speaking...')
      window.speechSynthesis.speak(utterance)
    }

    setVoiceStatus('Generating voice...')

    try {
      const response = await fetch('http://127.0.0.1:8000/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) throw new Error('TTS request failed')

      const data = await response.json()
      const spokenText = typeof data?.text === 'string' && data.text.trim() ? data.text : text
      speakText(spokenText)
    } catch {
      speakText(text)
    }
  }

  useEffect(() => {
    if (!callStatus.includes('Live')) return undefined
    const intervalId = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1)
    }, 1000)
    return () => window.clearInterval(intervalId)
  }, [callStatus])

  useEffect(() => () => {
    timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
    if (recognitionRef.current) recognitionRef.current.abort()
  }, [])

  return (
    <div className="app-shell">
      <Sidebar activeNav={activeNav} onSelect={setActiveNav} />
      <main className="workspace">
        <Header
          callStatus={callStatus}
          elapsedSeconds={elapsedSeconds}
          demoRunning={demoRunning}
          onRunDemo={runUltraFastDemo}
          onReset={resetDemoState}
          onExport={exportReport}
        />

        <section className="overview-grid">
          <StatCard label="Calls today" value="1,284" detail="SQB contact center volume" />
          <StatCard label="Repetitive calls" value="20–35%" detail="Automation candidate range" />
          <StatCard label="Intent confidence" value={analysis.confidence ? `${analysis.confidence}%` : 'Ready'} detail={analysis.intent} />
          <StatCard label="Compliance status" value={complianceAlert ? 'Critical' : 'Clear'} detail="Loan and card safety rules" />
          <StatCard label="Learning queue" value="7%" detail="Unknown or emerging demand" />
          <StatCard label="Eligibility signal" value={customerProfile.loanEligibility} detail={`Risk: ${customerProfile.risk}`} />
        </section>

        <section className="main-grid">
          <div className="left-column">
            <DemandAnalytics demandData={demandData} />

            <section className="card">
              <div className="section-title">
                <div>
                  <p className="eyebrow">Live call listener</p>
                  <h2>Real-time customer conversation</h2>
                </div>
                <span className="listening-pill">{demoRunning ? 'Streaming' : 'Ready'}</span>
              </div>
              <Transcript messages={messages} />
            </section>

            <AnalysisPanel analysis={analysis} complianceAlert={complianceAlert} nextOffer={nextOffer} />
            <VoicePanel
              input={input}
              setInput={setInput}
              voiceStatus={voiceStatus}
              isListening={isListening}
              onAnalyze={analyzeManualMessage}
              onStartVoice={startVoice}
              onStopVoice={stopVoice}
              onSpeak={speakAiResponse}
            />
            <UnknownCallsCluster unknownLearning={unknownLearning} onRunUnknownDemo={() => runUnknownCallsDemo()} />
            <WhyMatters />
          </div>

          <aside className="right-column">
            <CustomerProfile />
            <ComplianceAlert complianceAlert={complianceAlert} />
            <KycChecklist checklist={kycChecklist} />
            <SafeActionLayer onAction={executeSafeAction} safeActionResult={safeActionResult} />
            <CrmSummary crmSummary={crmSummary} exportStatus={exportStatus} />
            <AuditLog auditLog={auditLog} />
          </aside>
        </section>
      </main>
    </div>
  )
}

export default App
