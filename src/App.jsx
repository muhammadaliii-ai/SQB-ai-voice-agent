import { createContext, useContext, useEffect, useRef, useState } from 'react'
import './App.css'

const UiTextContext = createContext(null)

const VOICE_STATUS = {
  ready: 'Ready',
  listening: 'Listening',
  generating: 'Generating voice',
  speaking: 'Speaking',
  unavailable: 'Voice unavailable',
}

const customerProfile = {
  name: 'Azizbek Karimov',
  age: 29,
  city: 'Tashkent',
  income: "7,000,000 so'm",
  segment: 'Mass Affluent',
  risk: 'Medium',
  eligibility: 'Conditional',
  activeLoan: "45,000,000 so'm",
  monthlyPayment: "3,200,000 so'm",
  nextPaymentDate: '05.05.2026',
}

const baseDemand = [
  { key: 'due-date', label: 'Loan due date / next payment', value: 35 },
  { key: 'card-balance', label: 'Card balance / transaction questions', value: 18 },
  { key: 'mobile-app', label: 'SQB Mobile app issues', value: 14 },
  { key: 'card-risk', label: 'Card block / suspicious transaction', value: 11 },
  { key: 'loan-product', label: 'Loan application / product info', value: 9 },
  { key: 'deposit', label: 'Deposit / savings questions', value: 6 },
  { key: 'unknown', label: 'Other / unknown', value: 7 },
]

const navItems = [
  ['console', 'Real-Time Operator Console'],
  ['compliance', 'Compliance Guardrails'],
  ['kyc', 'KYC / AML Checklist'],
  ['offer', 'Next-Best-Offer'],
  ['audit', 'Audit Log'],
]

const I18N = {
  uz: {
    headerSubtitle: "Real vaqt operator konsoli, compliance nazorati, KYC/AML tekshiruvlari va qo'ng'iroqdan keyingi CRM xulosa.",
    runDemo: 'Run Ultra-Fast Demo',
    demoRunning: 'Demo ishlayapti...',
    reset: 'Reset',
    export: 'Export report',
    status: {
      standby: 'Standby',
      live: 'Live call',
      summary: 'Summary ready',
      streaming: 'Streaming',
      ready: 'Ready',
      clear: 'Clear',
      critical: 'Critical',
    },
    stats: [
      ['Calls today', '1,284', 'SQB contact center volume'],
      ['Repetitive calls', '20-35%', 'Automation candidate range'],
      ['Intent confidence', null, 'Current detected intent'],
      ['Compliance status', null, 'Loan and card safety rules'],
      ['Learning queue', '7%', 'Unknown or emerging demand'],
      ['Eligibility signal', 'Conditional', 'Risk: Medium'],
    ],
    sectionCopy: {
      console: 'Transcript, timer, intent and operator guidance in one place.',
      compliance: "Loan promises, sensitive data requests and unsafe scripts are blocked here.",
      kyc: 'Required credit, KYC and AML steps before any decision.',
      offer: 'A safe product recommendation generated from the conversation.',
      objection: "Customer concern is converted into an approved response.",
      summary: "CRM-ready summary created after the call.",
      backend: 'Local demo stack and intranet readiness.',
      audit: 'Readable event trail for supervisor review.',
      safeAction: 'Only predefined actions can be executed.',
    },
    transcript: {
      emptyRole: 'System',
      empty: 'Run the demo to populate the live transcript.',
      roles: { Customer: 'Customer', Operator: 'Operator', AI: 'AI' },
    },
    analysis: {
      intent: 'Intent',
      sentiment: 'Sentiment',
      confidence: 'Confidence',
      risk: 'Risk',
      safeResponse: 'AI safe response',
    },
    compliance: {
      noAlertTitle: 'No critical alert',
      noAlertBody: 'AI is listening for prohibited promises, missing KYC, unsafe data requests and risky loan language.',
      alertEyebrow: 'Compliance alert',
      safeRewrite: 'Safe rewrite',
      rules: [
        'Never ask PIN, SMS code, CVV or full card password.',
        'Never guarantee loan approval.',
        'Verify identity before personal financial details.',
      ],
    },
    kyc: {
      done: 'Done',
      missing: 'Missing',
      items: [
        ['income', 'Income source asked', 'medium'],
        ['identity', 'Identity verification', 'high'],
        ['purpose', 'Loan purpose', 'medium'],
        ['consent', 'Scoring consent', 'medium'],
        ['aml', 'AML risk screening', 'high'],
      ],
    },
    customer: {
      title: 'Customer profile',
      age: 'Age',
      city: 'City',
      income: 'Income',
      segment: 'Segment',
      risk: 'Risk',
      eligibility: 'Loan eligibility',
      activeLoan: 'Active loan',
      monthlyPayment: 'Monthly payment',
      nextPaymentDate: 'Next payment date',
    },
    offer: {
      empty: 'Next-best-offer will appear after the demo reaches the product recommendation step.',
      reason: 'Why this offer',
    },
    objection: {
      emptyTitle: 'No live objection yet',
      emptyText: 'When the customer pushes back or asks about conditions, AI will suggest an approved handling script.',
      customerConcern: 'Customer concern',
      handling: 'Approved handling',
    },
    safeAction: {
      visibleResult: 'Visible result',
      noResult: 'No safe action executed yet.',
      actions: {
        crmNote: {
          label: 'Create CRM note',
          result: 'CRM note created with loan request, compliance flag, KYC gaps and recommended safe wording.',
        },
        manager: {
          label: 'Escalate to manager',
          result: 'Manager escalation prepared because a prohibited loan promise was detected.',
        },
        followUp: {
          label: 'Send follow-up',
          result: 'Follow-up queued with approved credit wording and missing KYC reminders.',
        },
      },
    },
    audit: {
      events: 'events',
      empty: 'Run the demo to populate the audit log.',
      labels: {
        call_started: 'call_started',
        transcript_analyzed: 'transcript_analyzed',
        compliance_violation_detected: 'compliance_violation_detected',
        kyc_updated: 'kyc_updated',
        recommendation_generated: 'recommendation_generated',
        crm_summary_created: 'crm_summary_created',
        safe_action_executed: 'safe_action_executed',
      },
    },
    voice: {
      title: 'Voice simulation',
      description: 'OmniVoice/TTS detects response language and falls back to browser speech if backend is unavailable.',
      start: 'Start Voice',
      stop: 'Stop Voice',
      speak: 'Speak AI Response',
      analyze: 'Analyze',
      placeholder: 'Type or dictate a customer message...',
      unsupported: 'Voice unavailable',
      captured: 'Voice transcript captured',
    },
    backend: {
      server: 'Server online',
      localAi: 'Local AI online',
      externalApi: 'External API: No',
      lan: 'LAN/Intranet mode',
    },
    unknown: {
      title: 'Unknown Calls Cluster',
      description: 'Unknown calls are grouped into product and script improvement opportunities.',
      button: 'Ilovaga kira olmayapman',
      demoMessage: 'Ilovaga kira olmayapman',
      initial: 'Unknown',
      noCluster: 'No cluster yet',
      detecting: 'Detecting...',
      insight: 'New pattern detected: Mobile App Issues',
    },
    why: '20-35% of calls are repetitive and can be automated. Remaining calls are analyzed, clustered, and used to improve scripts, products, and AI categories.',
    exportEmpty: 'Report shell prepared. Run the demo to include audit events.',
    exportReady: (count) => `Report prepared with ${count} audit events and the current CRM summary.`,
  },
  ru: {
    headerSubtitle: 'Консоль оператора в реальном времени, контроль compliance, проверки KYC/AML и CRM итог после звонка.',
    runDemo: 'Run Ultra-Fast Demo',
    demoRunning: 'Демо выполняется...',
    reset: 'Reset',
    export: 'Export report',
    status: {
      standby: 'Standby',
      live: 'Live call',
      summary: 'Summary ready',
      streaming: 'Streaming',
      ready: 'Ready',
      clear: 'Clear',
      critical: 'Critical',
    },
    stats: [
      ['Calls today', '1,284', 'Объем контакт-центра SQB'],
      ['Repetitive calls', '20-35%', 'Диапазон для автоматизации'],
      ['Intent confidence', null, 'Текущий intent'],
      ['Compliance status', null, 'Правила безопасности кредитов и карт'],
      ['Learning queue', '7%', 'Новые или неизвестные запросы'],
      ['Eligibility signal', 'Conditional', 'Risk: Medium'],
    ],
    sectionCopy: {
      console: 'Транскрипт, таймер, intent и подсказка оператору в одном месте.',
      compliance: 'Запрещенные обещания, опасные запросы данных и неверные скрипты блокируются здесь.',
      kyc: 'Обязательные кредитные, KYC и AML шаги до любого решения.',
      offer: 'Безопасная продуктовая рекомендация по разговору.',
      objection: 'Возражение клиента превращается в согласованный ответ.',
      summary: 'CRM-готовый итог после звонка.',
      backend: 'Локальный демо-стек и готовность к интранету.',
      audit: 'Понятная история событий для supervisor review.',
      safeAction: 'Можно выполнять только заранее разрешенные действия.',
    },
    transcript: {
      emptyRole: 'Система',
      empty: 'Запустите демо, чтобы заполнить live transcript.',
      roles: { Customer: 'Клиент', Operator: 'Оператор', AI: 'AI' },
    },
    analysis: {
      intent: 'Intent',
      sentiment: 'Тональность',
      confidence: 'Уверенность',
      risk: 'Риск',
      safeResponse: 'Безопасный ответ AI',
    },
    compliance: {
      noAlertTitle: 'Критического предупреждения нет',
      noAlertBody: 'AI отслеживает запрещенные обещания, незакрытый KYC, опасные запросы данных и рискованные кредитные формулировки.',
      alertEyebrow: 'Compliance alert',
      safeRewrite: 'Безопасная формулировка',
      rules: [
        'Никогда не запрашивать PIN, SMS-код, CVV или полный пароль карты.',
        'Никогда не гарантировать одобрение кредита.',
        'Проверить личность перед раскрытием персональных финансовых данных.',
      ],
    },
    kyc: {
      done: 'Готово',
      missing: 'Не хватает',
      items: [
        ['income', 'Источник дохода запрошен', 'medium'],
        ['identity', 'Проверка личности', 'high'],
        ['purpose', 'Цель кредита', 'medium'],
        ['consent', 'Согласие на скоринг', 'medium'],
        ['aml', 'AML проверка риска', 'high'],
      ],
    },
    customer: {
      title: 'Профиль клиента',
      age: 'Возраст',
      city: 'Город',
      income: 'Доход',
      segment: 'Сегмент',
      risk: 'Риск',
      eligibility: 'Кредитная возможность',
      activeLoan: 'Активный кредит',
      monthlyPayment: 'Ежемесячный платеж',
      nextPaymentDate: 'Дата следующего платежа',
    },
    offer: {
      empty: 'Next-best-offer появится на шаге продуктовой рекомендации.',
      reason: 'Почему это предложение',
    },
    objection: {
      emptyTitle: 'Возражения пока нет',
      emptyText: 'Когда клиент уточнит условия или возразит, AI предложит утвержденный скрипт.',
      customerConcern: 'Вопрос клиента',
      handling: 'Утвержденный ответ',
    },
    safeAction: {
      visibleResult: 'Видимый результат',
      noResult: 'Безопасное действие еще не выполнено.',
      actions: {
        crmNote: {
          label: 'Create CRM note',
          result: 'CRM заметка создана с кредитным запросом, compliance флагом, KYC пробелами и безопасной формулировкой.',
        },
        manager: {
          label: 'Escalate to manager',
          result: 'Эскалация менеджеру подготовлена из-за запрещенного обещания по кредиту.',
        },
        followUp: {
          label: 'Send follow-up',
          result: 'Follow-up поставлен в очередь с безопасной кредитной формулировкой и напоминаниями KYC.',
        },
      },
    },
    audit: {
      events: 'events',
      empty: 'Запустите демо, чтобы заполнить audit log.',
      labels: {
        call_started: 'call_started',
        transcript_analyzed: 'transcript_analyzed',
        compliance_violation_detected: 'compliance_violation_detected',
        kyc_updated: 'kyc_updated',
        recommendation_generated: 'recommendation_generated',
        crm_summary_created: 'crm_summary_created',
        safe_action_executed: 'safe_action_executed',
      },
    },
    voice: {
      title: 'Voice simulation',
      description: 'OmniVoice/TTS определяет язык ответа и использует browser speech, если backend недоступен.',
      start: 'Start Voice',
      stop: 'Stop Voice',
      speak: 'Speak AI Response',
      analyze: 'Analyze',
      placeholder: 'Введите или продиктуйте сообщение клиента...',
      unsupported: 'Voice unavailable',
      captured: 'Voice transcript captured',
    },
    backend: {
      server: 'Server online',
      localAi: 'Local AI online',
      externalApi: 'External API: No',
      lan: 'LAN/Intranet mode',
    },
    unknown: {
      title: 'Unknown Calls Cluster',
      description: 'Unknown звонки группируются в улучшения продуктов и скриптов.',
      button: 'Не могу войти в приложение',
      demoMessage: 'Не могу войти в приложение',
      initial: 'Unknown',
      noCluster: 'Кластера пока нет',
      detecting: 'Detecting...',
      insight: 'New pattern detected: Mobile App Issues',
    },
    why: '20-35% звонков повторяются и могут быть автоматизированы. Остальные звонки анализируются, кластеризуются и используются для улучшения скриптов, продуктов и AI категорий.',
    exportEmpty: 'Report shell prepared. Run the demo to include audit events.',
    exportReady: (count) => `Report prepared with ${count} audit events and the current CRM summary.`,
  },
}

const SCENARIO = {
  uz: {
    customerLoanRequest: "Assalomu alaykum, menga kredit kerak edi. 30 million so'm olsam bo'ladimi?",
    operatorMistake: "Ha, albatta, sizga 100% tasdiqlanadi, hujjatsiz ham bo'ladi",
    customerTermsQuestion: "Foizlari qancha va qachon to'lashim kerak?",
    forbiddenPhrases: ['100% tasdiqlanadi', "hujjatsiz ham bo'ladi"],
    safeRewrite: 'Kredit tasdiqlanishi bank skoring tizimi, hujjatlar va bank siyosati asosida amalga oshiriladi.',
    nextBestOffer: "Kredit karta yoki past foizli iste'mol krediti tavsiya qilinadi.",
    offerReason: "Mijozning daromadi 7 mln so'm, segmenti Mass Affluent, eligibility shartli.",
    objectionHandling: "Foiz va to'lov grafigi skoring, muddat va hujjatlarga bog'liq. Operator aniq stavkani faqat rasmiy hisob-kitobdan keyin aytadi.",
    crmSummary: "Mijoz 30 mln so'm kredit haqida so'radi. Operator noto'g'ri va'da berdi. AI xavfsiz formulirovkani taklif qildi. KYC/AML savollar to'liq yopilmadi. Mijoz foiz va to'lov sanasi haqida qo'shimcha ma'lumot so'radi.",
    alertTitle: 'CRITICAL RISK',
    alertMessage: 'Operator prohibited promise detected',
    loanIntent: "Kredit so'rovi",
    termsIntent: 'Kredit shartlari',
    sentiment: 'Neytral',
    risk: 'Medium',
    loanResponse: "Mijoz kredit olish imkoniyatini so'radi. Operator kredit tasdiqlanishi skoring va hujjatlarga bog'liqligini tushuntirishi kerak.",
    termsResponse: "Foiz stavkasi va to'lov jadvali kredit turi, muddat, skoring natijasi va bank siyosatiga bog'liq. Tasdiqdan oldin barcha shartlar mijozga aniq tushuntiriladi.",
    suspiciousResponse: 'Xavfsizlik uchun avval shaxsni tasdiqlaymiz, kartani vaqtincha bloklaymiz, dispute ariza ochamiz va PIN/SMS/CVV ulashmaslikni eslatamiz.',
    mobileResponse: "SQB Mobile login muammosi aniqlandi. Operator ilova versiyasi, internet aloqasi, SMS yetib kelishi va ro'yxatdan o'tgan telefon raqamini tekshiradi.",
    audit: {
      started: 'Ultra-fast demo started.',
      analyzedLoan: "Transcript analyzed: 30 mln so'm loan request, intent Kredit so'rovi, confidence 95%.",
      violation: "Forbidden phrases detected: 100% tasdiqlanadi; hujjatsiz ham bo'ladi.",
      kyc: 'KYC/AML updated: income source done; identity, loan purpose, scoring consent and AML screening still missing.',
      analyzedTerms: "Transcript analyzed: customer asked about interest and payment timing.",
      recommendation: "Recommendation generated: kredit karta yoki past foizli iste'mol krediti.",
      crm: 'CRM summary created with compliance risk, safe rewrite and incomplete KYC/AML checklist.',
      safeAction: 'Safe action executed: CRM note auto-created for supervisor review.',
    },
  },
  ru: {
    customerLoanRequest: 'Здравствуйте, мне нужен кредит. Можно взять 30 миллионов сумов?',
    operatorMistake: 'Да, конечно, вам 100% одобрят, можно и без документов',
    customerTermsQuestion: 'Какие проценты и когда нужно платить?',
    forbiddenPhrases: ['100% одобрят', 'без документов'],
    safeRewrite: 'Одобрение кредита проводится на основе скоринговой системы банка, документов и банковской политики.',
    nextBestOffer: 'Рекомендуется кредитная карта или потребительский кредит с низкой процентной ставкой.',
    offerReason: 'Доход клиента 7 млн сумов, сегмент Mass Affluent, eligibility условная.',
    objectionHandling: 'Процент и график платежей зависят от скоринга, срока и документов. Оператор называет точную ставку только после официального расчета.',
    crmSummary: 'Клиент спросил о кредите на 30 млн сумов. Оператор дал некорректное обещание. AI предложил безопасную формулировку. KYC/AML вопросы закрыты не полностью. Клиент дополнительно спросил о процентах и дате платежа.',
    alertTitle: 'CRITICAL RISK',
    alertMessage: 'Operator prohibited promise detected',
    loanIntent: 'Запрос кредита',
    termsIntent: 'Условия кредита',
    sentiment: 'Нейтральный',
    risk: 'Medium',
    loanResponse: 'Клиент спросил о возможности получить кредит. Оператор должен объяснить, что одобрение зависит от скоринга и документов.',
    termsResponse: 'Процентная ставка и график платежей зависят от типа кредита, срока, результата скоринга и политики банка. До подтверждения клиенту нужно ясно объяснить все условия.',
    suspiciousResponse: 'Для безопасности сначала проверяем личность, временно блокируем карту, открываем dispute заявку и предупреждаем не передавать PIN/SMS/CVV.',
    mobileResponse: 'Обнаружена проблема входа в SQB Mobile. Оператор проверит версию приложения, интернет, доставку SMS и зарегистрированный номер телефона.',
    audit: {
      started: 'Ultra-fast demo started.',
      analyzedLoan: 'Transcript analyzed: loan request for 30 mln UZS, intent Запрос кредита, confidence 95%.',
      violation: 'Forbidden phrases detected: 100% одобрят; без документов.',
      kyc: 'KYC/AML updated: income source done; identity, loan purpose, scoring consent and AML screening still missing.',
      analyzedTerms: 'Transcript analyzed: customer asked about interest and payment timing.',
      recommendation: 'Recommendation generated: credit card or low-rate consumer loan.',
      crm: 'CRM summary created with compliance risk, safe rewrite and incomplete KYC/AML checklist.',
      safeAction: 'Safe action executed: CRM note auto-created for supervisor review.',
    },
  },
}

function detectLanguage(text) {
  const value = (text || '').toLowerCase()
  const hasRussianCyrillic = /[а-яё]/i.test(value) && [
    'здравствуйте',
    'какие',
    'когда',
    'нужно',
    'платить',
    'процент',
    'одобр',
    'документ',
    'списали',
    'не могу',
    'войти',
    'приложение',
    'клиент',
  ].some((word) => value.includes(word))

  if (hasRussianCyrillic) return 'ru'

  if (/\b(loan|credit|card|balance|payment|transaction|bank|account|deposit|withdrawal|dispute|scoring)\b/i.test(value)) {
    return 'en'
  }

  return 'uz'
}

function foldText(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[‘’ʻʼ`]/g, "'")
    .replace(/ў/g, "o'")
    .replace(/ғ/g, "g'")
}

function containsAny(text, phrases) {
  return phrases.some((phrase) => text.includes(foldText(phrase)))
}

function classifyCustomerMessage(text) {
  const value = foldText(text)

  if (containsAny(value, [
    'pul yechildi',
    'pul ketdi',
    'kartamdan pul oldi',
    'soqqa yechildi',
    'yechib oldi',
    "kartadan minus bo'ldi",
    'пул ечилди',
    'пул кетди',
    'картамдан пул олди',
    'сокка ечилди',
    'ечиб олди',
    'списали',
    'сняли деньги',
  ])) {
    return 'suspicious_card'
  }

  if (containsAny(value, [
    'kredit kerak',
    'qarz olmoqchiman',
    'pul kerak',
    'mikroqarz',
    'nasiyaga',
    'кредит керак',
    'қарз олмоқчиман',
    'пул керак',
    'микроқарз',
    'насияга',
    'нужен кредит',
    'взять кредит',
  ])) {
    return 'loan_request'
  }

  if (containsAny(value, [
    'ilovaga kirolmayapman',
    'ilovaga kira olmayapman',
    'app ishlamayapti',
    'sms kelmayapti',
    'parol esimdan chiqdi',
    'иловага киролмаяпман',
    'апп ишламаяпти',
    'смс келмаяпти',
    'парол эсимдан чиқди',
    'не могу войти',
    'приложение не работает',
  ])) {
    return 'mobile_issue'
  }

  if (containsAny(value, ['foiz', "to'lash", 'protsent', 'процент', 'платить'])) {
    return 'loan_terms'
  }

  return 'unknown'
}

function initialAnalysis(language) {
  const scenario = SCENARIO[language]
  return {
    intent: 'Waiting for customer',
    sentiment: 'Not started',
    confidence: 0,
    risk: 'Normal',
    response: language === 'ru'
      ? 'Запустите демо, чтобы увидеть live-анализ, compliance контроль и CRM итог.'
      : "Live tahlil, compliance nazorati va CRM xulosani ko'rish uchun demoni ishga tushiring.",
    recommendation: '',
    suggestedResponse: scenario.safeRewrite,
  }
}

function initialKycChecklist(language) {
  return I18N[language].kyc.items.map(([key, label, severity]) => ({
    key,
    label,
    severity,
    status: 'missing',
  }))
}

function initialObjection(language) {
  return {
    concern: '',
    handling: '',
    status: language === 'ru' ? 'Ожидание возражения' : 'Eʼtiroz kutilmoqda',
  }
}

function initialUnknown(language) {
  const t = I18N[language]
  return {
    message: t.unknown.demoMessage,
    initial: t.unknown.initial,
    cluster: t.unknown.noCluster,
    insight: language === 'ru'
      ? 'Новый паттерн появится после demo message.'
      : "Yangi pattern demo xabardan keyin ko'rinadi.",
  }
}

function useUi() {
  return useContext(UiTextContext) || I18N.uz
}

function formatDuration(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')
  return `${mins}:${secs}`
}

function SectionHeader({ title, description, right }) {
  return (
    <div className="section-title">
      <div>
        <p className="eyebrow">SQB Call Intelligence AI</p>
        <h2>{title}</h2>
        {description ? <span className="section-description">{description}</span> : null}
      </div>
      {right}
    </div>
  )
}

function Header({ language, setLanguage, callStatus, elapsedSeconds, demoRunning, onRunDemo, onReset, onExport }) {
  const t = useUi()

  return (
    <header className="top-header">
      <div>
        <p className="eyebrow">SQB Bank management dashboard</p>
        <h1>SQB Call Intelligence AI</h1>
        <span>{t.headerSubtitle}</span>
      </div>
      <div className="header-actions">
        <div className="language-switch" aria-label="Language switch">
          {['uz', 'ru'].map((item) => (
            <button className={language === item ? 'active' : ''} key={item} type="button" onClick={() => setLanguage(item)}>
              {item.toUpperCase()}
            </button>
          ))}
        </div>
        <span className={`live-status ${callStatus === t.status.live ? 'is-live' : ''}`}>
          <i />
          {callStatus}
        </span>
        <time>{formatDuration(elapsedSeconds)}</time>
        <button className="primary-button" type="button" onClick={onRunDemo} disabled={demoRunning}>
          {demoRunning ? t.demoRunning : t.runDemo}
        </button>
        <button className="secondary-button" type="button" onClick={onReset}>{t.reset}</button>
        <button className="secondary-button" type="button" onClick={onExport}>{t.export}</button>
      </div>
    </header>
  )
}

function Sidebar({ activeNav, setActiveNav }) {
  return (
    <aside className="sidebar">
      <div className="brand-mark">SQB</div>
      {navItems.map(([key, label]) => (
        <button className={activeNav === key ? 'active' : ''} key={key} type="button" onClick={() => setActiveNav(key)}>
          {label}
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

function Transcript({ messages }) {
  const t = useUi()

  return (
    <div className="transcript">
      {messages.length === 0 ? (
        <article className="empty-message">
          <span>{t.transcript.emptyRole}</span>
          <p>{t.transcript.empty}</p>
        </article>
      ) : messages.map((message) => (
        <article className={`message-${message.role.toLowerCase()}`} key={message.id}>
          <span>{t.transcript.roles[message.role] || message.role}</span>
          <p>{message.text}</p>
        </article>
      ))}
    </div>
  )
}

function RealTimeOperatorConsole({ messages, analysis, demoRunning }) {
  const t = useUi()

  return (
    <section className="card">
      <SectionHeader
        description={t.sectionCopy.console}
        right={<span className="listening-pill">{demoRunning ? t.status.streaming : t.status.ready}</span>}
        title="Real-Time Operator Console"
      />
      <Transcript messages={messages} />
      <div className="analysis-grid">
        <span>{t.analysis.intent}<b>{analysis.intent}</b></span>
        <span>{t.analysis.sentiment}<b>{analysis.sentiment}</b></span>
        <span>{t.analysis.confidence}<b>{analysis.confidence}%</b></span>
        <span>{t.analysis.risk}<b>{analysis.risk}</b></span>
      </div>
      <div className="suggested-response">
        <span>{t.analysis.safeResponse}</span>
        <p>{analysis.response}</p>
      </div>
    </section>
  )
}

function ComplianceGuardrails({ complianceAlert }) {
  const t = useUi()

  return (
    <section className={`card compliance-card ${complianceAlert ? 'critical' : ''}`}>
      <SectionHeader description={t.sectionCopy.compliance} title="Compliance Guardrails" />
      {!complianceAlert ? (
        <>
          <h3>{t.compliance.noAlertTitle}</h3>
          <p className="body-copy">{t.compliance.noAlertBody}</p>
          <ul className="guardrail-list">
            {t.compliance.rules.map((rule) => <li key={rule}>{rule}</li>)}
          </ul>
        </>
      ) : (
        <>
          <p className="eyebrow">{t.compliance.alertEyebrow}</p>
          <h3>{complianceAlert.title}</h3>
          <strong>{complianceAlert.message}</strong>
          <div className="phrase-list">
            {complianceAlert.phrases.map((phrase) => <span key={phrase}>{phrase}</span>)}
          </div>
          <div className="safe-rewrite">
            <b>{t.compliance.safeRewrite}</b>
            <p>{complianceAlert.safeRewrite}</p>
          </div>
        </>
      )}
    </section>
  )
}

function KycAmlChecklist({ checklist }) {
  const t = useUi()

  return (
    <section className="card">
      <SectionHeader description={t.sectionCopy.kyc} title="KYC / AML Checklist" />
      <div className="checklist">
        {checklist.map((item) => (
          <article className={`${item.status} ${item.severity}`} key={item.key}>
            <span>{item.label}</span>
            <b>{item.status === 'done' ? t.kyc.done : t.kyc.missing}</b>
          </article>
        ))}
      </div>
    </section>
  )
}

function NextBestOfferCard({ nextOffer, offerReason }) {
  const t = useUi()

  return (
    <section className="card next-offer-card">
      <SectionHeader description={t.sectionCopy.offer} title="Next-Best-Offer" />
      <div className="recommended-action">
        <b>{nextOffer || t.offer.empty}</b>
        {offerReason ? (
          <p><span>{t.offer.reason}: </span>{offerReason}</p>
        ) : null}
      </div>
    </section>
  )
}

function ObjectionHandlingCard({ objection }) {
  const t = useUi()

  return (
    <section className="card">
      <SectionHeader description={t.sectionCopy.objection} title="Live Objection Handling" />
      {objection.concern ? (
        <div className="objection-grid">
          <article>
            <span>{t.objection.customerConcern}</span>
            <p>{objection.concern}</p>
          </article>
          <article>
            <span>{t.objection.handling}</span>
            <p>{objection.handling}</p>
          </article>
        </div>
      ) : (
        <div className="action-result">
          <span>{t.objection.emptyTitle}</span>
          <p>{t.objection.emptyText}</p>
        </div>
      )}
    </section>
  )
}

function PostCallSummary({ crmSummary, exportStatus }) {
  const t = useUi()

  return (
    <section className="card">
      <SectionHeader description={t.sectionCopy.summary} title="Post-Call Summary" />
      <p className="summary-box">{crmSummary || t.sectionCopy.summary}</p>
      {exportStatus ? <div className="success-note">{exportStatus}</div> : null}
    </section>
  )
}

function BackendStatus() {
  const t = useUi()

  return (
    <section className="card">
      <SectionHeader description={t.sectionCopy.backend} title="Backend Status" />
      <div className="status-list">
        <article><i /><span>{t.backend.server}</span></article>
        <article><i /><span>{t.backend.localAi}</span></article>
        <article className="neutral"><i /><span>{t.backend.externalApi}</span></article>
        <article><i /><span>{t.backend.lan}</span></article>
      </div>
    </section>
  )
}

function AuditLog({ auditLog }) {
  const t = useUi()

  return (
    <section className="card audit-card">
      <SectionHeader
        description={t.sectionCopy.audit}
        right={<strong>{auditLog.length} {t.audit.events}</strong>}
        title="Audit Log"
      />
      <div className="audit-list">
        {auditLog.length === 0 ? (
          <article>
            <span>Ready</span>
            <p>{t.audit.empty}</p>
          </article>
        ) : auditLog.map((item) => (
          <article key={item.id}>
            <time>{item.time}</time>
            <span>{t.audit.labels[item.type] || item.type}</span>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function SafeActionLayer({ onAction, safeActionResult }) {
  const t = useUi()

  return (
    <section className="card">
      <SectionHeader description={t.sectionCopy.safeAction} title="Safe Action Layer" />
      <div className="safe-action-row">
        {Object.entries(t.safeAction.actions).map(([key, action]) => (
          <button type="button" key={key} onClick={() => onAction(key)}>
            {action.label}
          </button>
        ))}
      </div>
      <div className="action-result">
        <span>{t.safeAction.visibleResult}</span>
        <p>{safeActionResult || t.safeAction.noResult}</p>
      </div>
    </section>
  )
}

function CustomerProfile() {
  const t = useUi()

  return (
    <section className="card profile-card">
      <SectionHeader title={t.customer.title} />
      <div className="profile-grid">
        <span>{t.customer.age}<b>{customerProfile.age}</b></span>
        <span>{t.customer.city}<b>{customerProfile.city}</b></span>
        <span>{t.customer.income}<b>{customerProfile.income}</b></span>
        <span>{t.customer.segment}<b>{customerProfile.segment}</b></span>
        <span>{t.customer.risk}<b>{customerProfile.risk}</b></span>
        <span>{t.customer.eligibility}<b>{customerProfile.eligibility}</b></span>
        <span>{t.customer.activeLoan}<b>{customerProfile.activeLoan}</b></span>
        <span>{t.customer.monthlyPayment}<b>{customerProfile.monthlyPayment}</b></span>
        <span>{t.customer.nextPaymentDate}<b>{customerProfile.nextPaymentDate}</b></span>
      </div>
    </section>
  )
}

function DemandAnalytics({ demandData }) {
  return (
    <section className="card wide-card">
      <SectionHeader
        description="Most common reason today: loan payment due date. Recommend adding automatic IVR/AI answer."
        title="Demand Analytics"
      />
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
    </section>
  )
}

function UnknownCallsCluster({ unknownLearning, onRunUnknownDemo }) {
  const t = useUi()

  return (
    <section className="card">
      <SectionHeader description={t.unknown.description} title={t.unknown.title} />
      <button className="secondary-button" type="button" onClick={onRunUnknownDemo}>{t.unknown.button}</button>
      <div className="unknown-grid">
        <span>Message<b>{unknownLearning.message}</b></span>
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
  const t = useUi()

  return (
    <section className="card">
      <SectionHeader
        description={t.voice.description}
        right={<span className={`voice-status ${isListening ? 'is-listening' : ''}`}>{voiceStatus}</span>}
        title={t.voice.title}
      />
      <div className="control-row">
        <button type="button" onClick={onStartVoice}>{t.voice.start}</button>
        <button type="button" onClick={onStopVoice}>{t.voice.stop}</button>
        <button type="button" onClick={onSpeak}>{t.voice.speak}</button>
      </div>
      <form className="text-input-row" onSubmit={(event) => {
        event.preventDefault()
        onAnalyze(input)
      }}>
        <input value={input} onChange={(event) => setInput(event.target.value)} placeholder={t.voice.placeholder} />
        <button className="primary-button" type="submit">{t.voice.analyze}</button>
      </form>
    </section>
  )
}

function WhyMatters() {
  const t = useUi()

  return (
    <section className="card why-card">
      <SectionHeader title="Why this matters" />
      <p>{t.why}</p>
    </section>
  )
}

function App() {
  const [language, setLanguage] = useState('uz')
  const [activeNav, setActiveNav] = useState('console')
  const [messages, setMessages] = useState([])
  const [analysis, setAnalysis] = useState(() => initialAnalysis('uz'))
  const [complianceAlert, setComplianceAlert] = useState(null)
  const [kycChecklist, setKycChecklist] = useState(() => initialKycChecklist('uz'))
  const [nextOffer, setNextOffer] = useState('')
  const [offerReason, setOfferReason] = useState('')
  const [objection, setObjection] = useState(() => initialObjection('uz'))
  const [crmSummary, setCrmSummary] = useState('')
  const [safeActionResult, setSafeActionResult] = useState('')
  const [auditLog, setAuditLog] = useState([])
  const [demandData, setDemandData] = useState(baseDemand)
  const [unknownLearning, setUnknownLearning] = useState(() => initialUnknown('uz'))
  const [input, setInput] = useState('')
  const [voiceStatus, setVoiceStatus] = useState(VOICE_STATUS.ready)
  const [isListening, setIsListening] = useState(false)
  const [callStatus, setCallStatus] = useState(I18N.uz.status.standby)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [demoRunning, setDemoRunning] = useState(false)
  const [exportStatus, setExportStatus] = useState('')
  const timeoutsRef = useRef([])
  const recognitionRef = useRef(null)
  const idRef = useRef(1)
  const t = I18N[language]
  const scenario = SCENARIO[language]

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

  function resetDemoState(nextLanguage = language) {
    clearScheduledDemo()
    idRef.current = 1
    setMessages([])
    setAnalysis(initialAnalysis(nextLanguage))
    setComplianceAlert(null)
    setKycChecklist(initialKycChecklist(nextLanguage))
    setNextOffer('')
    setOfferReason('')
    setObjection(initialObjection(nextLanguage))
    setCrmSummary('')
    setSafeActionResult('')
    setAuditLog([])
    setDemandData(baseDemand)
    setUnknownLearning(initialUnknown(nextLanguage))
    setInput('')
    setVoiceStatus(VOICE_STATUS.ready)
    setIsListening(false)
    setCallStatus(I18N[nextLanguage].status.standby)
    setElapsedSeconds(0)
    setDemoRunning(false)
    setExportStatus('')
  }

  function handleLanguageChange(nextLanguage) {
    if (nextLanguage === language) return
    setLanguage(nextLanguage)
    resetDemoState(nextLanguage)
  }

  function scheduleStep(callback, delay) {
    const timeoutId = window.setTimeout(callback, delay)
    timeoutsRef.current.push(timeoutId)
  }

  function runUltraFastDemo() {
    resetDemoState(language)
    setCallStatus(t.status.live)
    setElapsedSeconds(0)
    setDemoRunning(true)
    addAudit('call_started', scenario.audit.started)

    scheduleStep(() => {
      addMessage('Customer', scenario.customerLoanRequest)
      setAnalysis({
        intent: scenario.loanIntent,
        sentiment: scenario.sentiment,
        confidence: 95,
        risk: scenario.risk,
        response: scenario.loanResponse,
        recommendation: 'Complete KYC/AML before discussing eligibility.',
        suggestedResponse: scenario.safeRewrite,
      })
      addAudit('transcript_analyzed', scenario.audit.analyzedLoan)
    }, 800)

    scheduleStep(() => {
      addMessage('Operator', scenario.operatorMistake)
      setComplianceAlert({
        title: scenario.alertTitle,
        message: scenario.alertMessage,
        phrases: scenario.forbiddenPhrases,
        safeRewrite: scenario.safeRewrite,
      })
      setKycChecklist((current) => current.map((item) => (
        item.key === 'income' ? { ...item, status: 'done' } : { ...item, status: 'missing' }
      )))
      addAudit('compliance_violation_detected', scenario.audit.violation)
      addAudit('kyc_updated', scenario.audit.kyc)
    }, 1800)

    scheduleStep(() => {
      addMessage('AI', scenario.safeRewrite)
    }, 2700)

    scheduleStep(() => {
      addMessage('Customer', scenario.customerTermsQuestion)
      setAnalysis({
        intent: scenario.termsIntent,
        sentiment: scenario.sentiment,
        confidence: 92,
        risk: scenario.risk,
        response: scenario.termsResponse,
        recommendation: scenario.nextBestOffer,
        suggestedResponse: scenario.termsResponse,
      })
      setNextOffer(scenario.nextBestOffer)
      setOfferReason(scenario.offerReason)
      setObjection({
        concern: scenario.customerTermsQuestion,
        handling: scenario.objectionHandling,
        status: 'handled',
      })
      addAudit('transcript_analyzed', scenario.audit.analyzedTerms)
      addAudit('recommendation_generated', scenario.audit.recommendation)
    }, 3700)

    scheduleStep(() => {
      setCrmSummary(scenario.crmSummary)
      setSafeActionResult(t.safeAction.actions.crmNote.result)
      setCallStatus(t.status.summary)
      setDemoRunning(false)
      addAudit('crm_summary_created', scenario.audit.crm)
      addAudit('safe_action_executed', scenario.audit.safeAction)
    }, 4900)
  }

  function analyzeManualMessage(text) {
    const clean = text.trim()
    if (!clean) return

    const category = classifyCustomerMessage(clean)
    setInput('')
    addMessage('Customer', clean)
    addAudit('transcript_analyzed', `Manual transcript analyzed: ${category}.`)

    if (category === 'suspicious_card') {
      setAnalysis({
        intent: 'Suspicious card transaction',
        sentiment: language === 'ru' ? 'Тревожный' : 'Xavotirli',
        confidence: 94,
        risk: 'High',
        response: scenario.suspiciousResponse,
        recommendation: 'Identity verification, temporary card block, dispute request, safety warning.',
        suggestedResponse: scenario.suspiciousResponse,
      })
      setComplianceAlert({
        title: 'HIGH CARD RISK',
        message: 'Unauthorized withdrawal language detected',
        phrases: [clean],
        safeRewrite: scenario.suspiciousResponse,
      })
      setDemandData((current) => current.map((item) => (
        item.key === 'card-risk' ? { ...item, value: item.value + 1 } : item
      )))
      return
    }

    if (category === 'loan_request') {
      setAnalysis({
        intent: scenario.loanIntent,
        sentiment: scenario.sentiment,
        confidence: 93,
        risk: scenario.risk,
        response: scenario.safeRewrite,
        recommendation: 'Complete KYC/AML and scoring consent first.',
        suggestedResponse: scenario.safeRewrite,
      })
      return
    }

    if (category === 'mobile_issue') {
      setAnalysis({
        intent: 'SQB Mobile / login issue',
        sentiment: scenario.sentiment,
        confidence: 90,
        risk: 'Medium',
        response: scenario.mobileResponse,
        recommendation: 'Check app version, SMS delivery and registered phone number.',
        suggestedResponse: scenario.mobileResponse,
      })
      setDemandData((current) => current.map((item) => (
        item.key === 'mobile-app' ? { ...item, value: item.value + 1 } : item
      )))
      return
    }

    if (category === 'loan_terms') {
      setAnalysis({
        intent: scenario.termsIntent,
        sentiment: scenario.sentiment,
        confidence: 91,
        risk: scenario.risk,
        response: scenario.termsResponse,
        recommendation: scenario.nextBestOffer,
        suggestedResponse: scenario.termsResponse,
      })
      setNextOffer(scenario.nextBestOffer)
      setOfferReason(scenario.offerReason)
      setObjection({ concern: clean, handling: scenario.objectionHandling, status: 'handled' })
      addAudit('recommendation_generated', scenario.audit.recommendation)
      return
    }

    setAnalysis({
      intent: 'Unknown',
      sentiment: scenario.sentiment,
      confidence: 46,
      risk: 'Review',
      response: language === 'ru'
        ? 'Обращение будет добавлено в learning queue для supervisor review.'
        : "Murojaat supervisor review uchun learning queue'ga qo'shiladi.",
      recommendation: 'Route to learning queue.',
      suggestedResponse: '',
    })
  }

  function runUnknownCallsDemo() {
    const message = t.unknown.demoMessage
    addMessage('Customer', message)
    addAudit('transcript_analyzed', 'Unknown transcript classified before clustering.')
    setAnalysis({
      intent: 'Unknown',
      sentiment: scenario.sentiment,
      confidence: 41,
      risk: 'Review',
      response: language === 'ru' ? 'AI сначала классифицировал обращение как unknown.' : 'AI murojaatni avval unknown deb belgiladi.',
      recommendation: 'Cluster after similarity check.',
      suggestedResponse: '',
    })
    setUnknownLearning({
      message,
      initial: t.unknown.initial,
      cluster: t.unknown.detecting,
      insight: 'Unknown message captured for clustering.',
    })

    scheduleStep(() => {
      setUnknownLearning({
        message,
        initial: t.unknown.initial,
        cluster: 'Mobile App Issues',
        insight: t.unknown.insight,
      })
      setDemandData((current) => current.map((item) => {
        if (item.key === 'mobile-app') return { ...item, value: item.value + 1 }
        if (item.key === 'unknown') return { ...item, value: Math.max(item.value - 1, 0) }
        return item
      }))
      addAudit('recommendation_generated', 'New pattern detected: Mobile App Issues. Demand analytics updated.')
    }, 900)
  }

  function executeSafeAction(actionKey) {
    const action = t.safeAction.actions[actionKey]
    if (!action) return
    setSafeActionResult(action.result)
    addAudit('safe_action_executed', action.result)
  }

  function exportReport() {
    const result = auditLog.length ? t.exportReady(auditLog.length) : t.exportEmpty
    setExportStatus(result)
    addAudit('safe_action_executed', result)
  }

  function startVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setVoiceStatus(VOICE_STATUS.unavailable)
      return
    }

    try {
      if (recognitionRef.current) recognitionRef.current.stop()
      const recognition = new SpeechRecognition()
      recognition.lang = language === 'ru' ? 'ru-RU' : 'uz-UZ'
      recognition.interimResults = false
      recognition.continuous = false
      recognition.onstart = () => {
        setIsListening(true)
        setVoiceStatus(VOICE_STATUS.listening)
      }
      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript || ''
        if (transcript) {
          setInput(transcript)
          addMessage('Customer', transcript)
          addAudit('transcript_analyzed', `${t.voice.captured}: ${transcript}`)
        }
      }
      recognition.onerror = () => {
        setVoiceStatus(VOICE_STATUS.unavailable)
        setIsListening(false)
      }
      recognition.onend = () => {
        setIsListening(false)
        setVoiceStatus(VOICE_STATUS.ready)
      }
      recognitionRef.current = recognition
      recognition.start()
    } catch {
      setVoiceStatus(VOICE_STATUS.unavailable)
      setIsListening(false)
    }
  }

  function stopVoice() {
    try {
      if (recognitionRef.current) recognitionRef.current.stop()
    } catch {
      setVoiceStatus(VOICE_STATUS.unavailable)
    }
    setIsListening(false)
    setVoiceStatus(VOICE_STATUS.ready)
  }

  function speakWithBrowser(text, spokenLanguage) {
    if (!window.speechSynthesis) {
      setVoiceStatus(VOICE_STATUS.unavailable)
      return false
    }

    const langMap = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-US' }
    const utterance = new SpeechSynthesisUtterance(text)
    const targetLang = langMap[spokenLanguage] || 'uz-UZ'
    const voices = window.speechSynthesis.getVoices()
    const matchingVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith(spokenLanguage))

    utterance.lang = targetLang
    if (matchingVoice) utterance.voice = matchingVoice
    utterance.onstart = () => setVoiceStatus(VOICE_STATUS.speaking)
    utterance.onend = () => setVoiceStatus(VOICE_STATUS.ready)
    utterance.onerror = () => setVoiceStatus(VOICE_STATUS.unavailable)

    window.speechSynthesis.cancel()
    setVoiceStatus(VOICE_STATUS.speaking)
    window.speechSynthesis.speak(utterance)
    return true
  }

  async function playAudioBlob(blob) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audio.onplay = () => setVoiceStatus(VOICE_STATUS.speaking)
      audio.onended = () => {
        URL.revokeObjectURL(url)
        setVoiceStatus(VOICE_STATUS.ready)
        resolve()
      }
      audio.onerror = () => {
        URL.revokeObjectURL(url)
        setVoiceStatus(VOICE_STATUS.unavailable)
        reject(new Error('Audio playback failed'))
      }
      audio.play().catch((error) => {
        URL.revokeObjectURL(url)
        reject(error)
      })
    })
  }

  async function speakAiResponse() {
    const text = analysis?.suggestedResponse || analysis?.response || complianceAlert?.safeRewrite || crmSummary || 'AI javobi hali tayyor emas.'
    const detectedLanguage = detectLanguage(text)

    setVoiceStatus(VOICE_STATUS.generating)
    window.speechSynthesis?.cancel()

    try {
      const response = await fetch('http://127.0.0.1:8000/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language: detectedLanguage }),
      })

      if (!response.ok) throw new Error('TTS request failed')

      const contentType = response.headers.get('content-type') || ''
      if (contentType.startsWith('audio/')) {
        const blob = await response.blob()
        await playAudioBlob(blob)
        return
      }

      const data = await response.json()
      const fallbackText = typeof data?.text === 'string' && data.text.trim() ? data.text : text
      speakWithBrowser(fallbackText, detectedLanguage)
    } catch {
      speakWithBrowser(text, detectedLanguage)
    }
  }

  useEffect(() => {
    if (callStatus !== t.status.live) return undefined
    const intervalId = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1)
    }, 1000)
    return () => window.clearInterval(intervalId)
  }, [callStatus, t.status.live])

  useEffect(() => () => {
    timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
    if (recognitionRef.current) recognitionRef.current.abort()
  }, [])

  return (
    <UiTextContext.Provider value={t}>
      <div className="app-shell">
        <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
        <main className="workspace">
          <Header
            callStatus={callStatus}
            demoRunning={demoRunning}
            elapsedSeconds={elapsedSeconds}
            language={language}
            onExport={exportReport}
            onReset={() => resetDemoState(language)}
            onRunDemo={runUltraFastDemo}
            setLanguage={handleLanguageChange}
          />

          <section className="overview-grid">
            {t.stats.map(([label, value, detail], index) => {
              const statValue = value
                || (index === 2 ? (analysis.confidence ? `${analysis.confidence}%` : t.status.ready) : null)
                || (index === 3 ? (complianceAlert ? t.status.critical : t.status.clear) : null)
                || t.status.ready
              return <StatCard detail={index === 2 ? analysis.intent : detail} key={label} label={label} value={statValue} />
            })}
          </section>

          <section className="main-grid">
            <div className="left-column">
              <RealTimeOperatorConsole analysis={analysis} demoRunning={demoRunning} messages={messages} />
              <NextBestOfferCard nextOffer={nextOffer} offerReason={offerReason} />
              <ObjectionHandlingCard objection={objection} />
              <VoicePanel
                input={input}
                isListening={isListening}
                onAnalyze={analyzeManualMessage}
                onSpeak={speakAiResponse}
                onStartVoice={startVoice}
                onStopVoice={stopVoice}
                setInput={setInput}
                voiceStatus={voiceStatus}
              />
              <DemandAnalytics demandData={demandData} />
              <UnknownCallsCluster onRunUnknownDemo={runUnknownCallsDemo} unknownLearning={unknownLearning} />
              <WhyMatters />
            </div>

            <aside className="right-column">
              <BackendStatus />
              <CustomerProfile />
              <ComplianceGuardrails complianceAlert={complianceAlert} />
              <KycAmlChecklist checklist={kycChecklist} />
              <SafeActionLayer onAction={executeSafeAction} safeActionResult={safeActionResult} />
              <PostCallSummary crmSummary={crmSummary} exportStatus={exportStatus} />
              <AuditLog auditLog={auditLog} />
            </aside>
          </section>
        </main>
      </div>
    </UiTextContext.Provider>
  )
}

export default App
