const OLLAMA_URL = 'http://localhost:11434/api/generate'
const OLLAMA_MODEL = 'llama3.1'

const OLLAMA_REQUIRED_INSTRUCTIONS = [
  'Mandatory SQB AI operator instructions:',
  '- Detect the customer message language automatically.',
  '- If the customer writes in Uzbek Latin, answer in Uzbek Latin only.',
  '- If the customer writes in Russian, answer in Russian only.',
  '- If the customer writes in English, answer in English only.',
  '- Never answer in Turkish.',
  '- SQB means Sanoat Qurilish Bank, Uzbekistan, not State Bank of Qatar.',
  '- Follow bank safety rules: never ask for PIN, SMS code, CVV, or full card password.',
  '- Never guarantee loan approval.',
  '- If the customer reports an unauthorized card withdrawal, answer with identity verification, temporary card block, dispute request, and a safety warning.',
].join('\n')

export const sqbPolicyRules = {
  P01: {
    en: 'Never ask for PIN, SMS OTP, CVV, card password, or full card number.',
    ru: 'Никогда не запрашивать PIN, SMS OTP, CVV, пароль карты или полный номер карты.',
    uz: 'PIN, SMS OTP, CVV, karta paroli yoki to‘liq karta raqamini hech qachon so‘ramang.',
  },
  P02: {
    en: 'For lost cards or suspected fraud, verify identity, then immediately apply a temporary card block.',
    ru: 'При утере карты или подозрении на мошенничество проверить личность и сразу поставить временную блокировку.',
    uz: 'Karta yo‘qolganda yoki firibgarlik gumonida shaxsni tasdiqlab, kartani vaqtincha bloklang.',
  },
  P03: {
    en: 'Open a dispute case for unauthorized card transactions and preserve transaction evidence.',
    ru: 'По неавторизованным операциям открыть спорное обращение и сохранить данные транзакции.',
    uz: 'Ruxsatsiz karta operatsiyalari bo‘yicha dispute arizasini oching va tranzaksiya dalillarini saqlang.',
  },
  P04: {
    en: 'Balance and loan details may be shared only after customer verification.',
    ru: 'Данные баланса и кредита сообщаются только после верификации клиента.',
    uz: 'Balans va kredit tafsilotlari faqat mijoz tasdiqlangandan keyin aytiladi.',
  },
  P05: {
    en: 'Loan approval must never be guaranteed; decisions depend on scoring and documents.',
    ru: 'Одобрение кредита нельзя гарантировать; решение зависит от скоринга и документов.',
    uz: 'Kredit ma’qullanishini kafolatlamang; qaror skoring va hujjatlarga bog‘liq.',
  },
}

const dictionary = {
  en: {
    intents: {
      fraud: 'Unauthorized transaction',
      cardBlock: 'Lost card / card block',
      balance: 'Balance inquiry',
      loan: 'Loan servicing',
      transfer: 'Delayed transfer',
      complaint: 'Complaint',
      general: 'General banking',
    },
    risk: { low: 'Low', medium: 'Medium', high: 'High' },
    actions: {
      lockCard: 'Temporary card block applied',
      openDispute: 'Dispute case opened',
      reviewTransfer: 'Transfer review queued',
      escalate: 'Human specialist escalation prepared',
    },
    fallbackIntro: 'I can help with this safely.',
    source: 'SQB policy rules',
  },
  ru: {
    intents: {
      fraud: 'Неавторизованная операция',
      cardBlock: 'Потеря / блокировка карты',
      balance: 'Запрос баланса',
      loan: 'Обслуживание кредита',
      transfer: 'Задержка перевода',
      complaint: 'Жалоба',
      general: 'Общий банковский вопрос',
    },
    risk: { low: 'Низкий', medium: 'Средний', high: 'Высокий' },
    actions: {
      lockCard: 'Временная блокировка карты применена',
      openDispute: 'Спорное обращение открыто',
      reviewTransfer: 'Проверка перевода поставлена в очередь',
      escalate: 'Подготовлена эскалация специалисту',
    },
    fallbackIntro: 'Я помогу безопасно решить этот вопрос.',
    source: 'Правила SQB',
  },
  uz: {
    intents: {
      fraud: 'Ruxsatsiz operatsiya',
      cardBlock: 'Karta yo‘qolishi / bloklash',
      balance: 'Balans so‘rovi',
      loan: 'Kredit xizmati',
      transfer: 'Kechikkan o‘tkazma',
      complaint: 'Shikoyat',
      general: 'Umumiy bank savoli',
    },
    risk: { low: 'Past', medium: 'O‘rta', high: 'Yuqori' },
    actions: {
      lockCard: 'Karta vaqtincha bloklandi',
      openDispute: 'Dispute arizasi ochildi',
      reviewTransfer: 'O‘tkazma tekshiruvga qo‘yildi',
      escalate: 'Mutaxassisga eskalatsiya tayyorlandi',
    },
    fallbackIntro: 'Bu masalani xavfsiz hal qilishga yordam beraman.',
    source: 'SQB qoidalari',
  },
}

const keywordMap = {
  fraud: [
    'fraud', 'unauthorized', 'charged', 'payment i did not', 'stolen', 'suspicious',
    'списали', 'мошен', 'не совершал', 'подозр', 'сняли',
    'yechildi', 'ruxsatsiz', 'firib', 'shubhali', 'men qilmagan', 'pul yech',
  ],
  cardBlock: [
    'lost card', 'block card', 'lock card', 'card block',
    'потерял', 'потеряла', 'заблок', 'блокир',
    'kartam yo', 'kartani blok', 'bloklang', 'yo‘qoldi', "yo'qoldi",
  ],
  balance: ['balance', 'how much', 'остаток', 'баланс', 'balans', 'qoldiq'],
  loan: ['loan', 'credit', 'кредит', 'займ', 'kredit', 'qarz', 'to‘lov', "to'lov"],
  transfer: ['transfer', 'delayed', 'перевод', 'задерж', 'o‘tkazma', "o'tkazma", 'kechik'],
  complaint: ['complaint', 'claim', 'жалоб', 'shikoyat'],
}

function includesAny(text, words) {
  return words.some((word) => text.includes(word))
}

function detectIntent(text) {
  const normalized = text.toLowerCase()
  if (includesAny(normalized, keywordMap.cardBlock)) return 'cardBlock'
  if (includesAny(normalized, keywordMap.fraud)) return 'fraud'
  if (includesAny(normalized, keywordMap.balance)) return 'balance'
  if (includesAny(normalized, keywordMap.loan)) return 'loan'
  if (includesAny(normalized, keywordMap.transfer)) return 'transfer'
  if (includesAny(normalized, keywordMap.complaint)) return 'complaint'
  return 'general'
}

function amountFromText(text) {
  const compact = text.replace(/[,\s]/g, '')
  const amounts = compact.match(/\d+/g) || []
  return amounts.reduce((max, item) => Math.max(max, Number(item)), 0)
}

function buildRisk(intent, text, bankState) {
  const amount = amountFromText(text)
  let fraudProbability = 12

  if (intent === 'fraud') fraudProbability = 86
  if (intent === 'cardBlock') fraudProbability = 78
  if (intent === 'transfer') fraudProbability = 42
  if (intent === 'loan') fraudProbability = 28
  if (amount >= 1000000) fraudProbability += 8
  if (bankState.cardStatus !== 'Active') fraudProbability += 6

  fraudProbability = Math.min(98, fraudProbability)
  const riskKey = fraudProbability >= 70 ? 'high' : fraudProbability >= 35 ? 'medium' : 'low'

  return { fraudProbability, riskKey }
}

function policyForIntent(intent) {
  if (intent === 'fraud') return ['P01', 'P02', 'P03']
  if (intent === 'cardBlock') return ['P01', 'P02']
  if (intent === 'balance') return ['P04', 'P01']
  if (intent === 'loan') return ['P05', 'P04']
  return ['P01']
}

function actionsForIntent(intent, autonomous) {
  if (!autonomous) return []
  if (intent === 'fraud') return ['lockCard', 'openDispute']
  if (intent === 'cardBlock') return ['lockCard']
  if (intent === 'transfer') return ['reviewTransfer']
  if (intent === 'complaint') return ['escalate']
  return []
}

function statePatchForActions(actions, risk) {
  return {
    cardStatus: actions.includes('lockCard') ? 'Temporarily locked' : undefined,
    disputeStatus: actions.includes('openDispute') ? 'Open - evidence review' : undefined,
    riskScore: risk.fraudProbability,
  }
}

function compactPolicyRefs(ruleIds, lang) {
  return ruleIds.map((id) => `${id}: ${sqbPolicyRules[id][lang]}`).join(' ')
}

function mockResponse({ intent, lang, customerData, risk, ruleIds, actions }) {
  const copy = dictionary[lang] || dictionary.en
  const policies = compactPolicyRefs(ruleIds, lang)
  const actionLine = actions.length
    ? actions.map((action) => copy.actions[action]).join('. ')
    : lang === 'ru'
      ? 'Автоматическое действие не выполнено; оператор может подтвердить следующий шаг.'
      : lang === 'en'
        ? 'No automatic action was executed; an operator can confirm the next step.'
        : 'Avtomatik amal bajarilmadi; operator keyingi qadamni tasdiqlashi mumkin.'

  if (intent === 'fraud') {
    if (lang === 'ru') {
      return `Сначала защищаем клиента: карту временно блокируем, открываем спорное обращение и не запрашиваем PIN/SMS/CVV. ${actionLine}. Вероятность мошенничества ${risk.fraudProbability}%. Ссылка на правила: ${policies}`
    }
    if (lang === 'en') {
      return `First we protect the customer: temporarily block the card, open a dispute case, and never request PIN/SMS/CVV. ${actionLine}. Fraud probability is ${risk.fraudProbability}%. Policy reference: ${policies}`
    }
    return `Avval mijoz xavfsizligi ta’minlanadi: karta vaqtincha bloklanadi, dispute ochiladi va PIN/SMS/CVV so‘ralmaydi. ${actionLine}. Firibgarlik ehtimoli ${risk.fraudProbability}%. Qoidalar: ${policies}`
  }

  if (intent === 'cardBlock') {
    if (lang === 'ru') return `Карту нужно временно заблокировать после проверки личности. ${actionLine}. Риск ${risk.fraudProbability}%. Правила: ${policies}`
    if (lang === 'en') return `The card should be temporarily blocked after identity verification. ${actionLine}. Risk is ${risk.fraudProbability}%. Rules: ${policies}`
    return `Shaxs tasdiqlangandan keyin karta vaqtincha bloklanadi. ${actionLine}. Xavf ${risk.fraudProbability}%. Qoidalar: ${policies}`
  }

  if (intent === 'balance') {
    if (lang === 'ru') return `После верификации можно сообщить общий баланс: ${customerData.totalBalance}, депозит: ${customerData.depositBalance}. Правила: ${policies}`
    if (lang === 'en') return `After verification, the available balance can be shared: ${customerData.totalBalance}, deposit: ${customerData.depositBalance}. Rules: ${policies}`
    return `Shaxs tasdiqlangandan keyin umumiy balans aytiladi: ${customerData.totalBalance}, depozit: ${customerData.depositBalance}. Qoidalar: ${policies}`
  }

  if (intent === 'loan') {
    if (lang === 'ru') return `Активный кредит: ${customerData.loan.amount}, ежемесячный платеж ${customerData.loan.monthlyPayment}, дата следующего платежа ${customerData.loan.nextPaymentDate}. Одобрение нового кредита не гарантируется. Правила: ${policies}`
    if (lang === 'en') return `Active loan: ${customerData.loan.amount}, monthly payment ${customerData.loan.monthlyPayment}, next payment date ${customerData.loan.nextPaymentDate}. New loan approval is not guaranteed. Rules: ${policies}`
    return `Faol kredit: ${customerData.loan.amount}, oylik to‘lov ${customerData.loan.monthlyPayment}, keyingi to‘lov ${customerData.loan.nextPaymentDate}. Yangi kredit ma’qullanishi kafolatlanmaydi. Qoidalar: ${policies}`
  }

  if (lang === 'ru') return `${copy.fallbackIntro} ${actionLine}. Риск ${risk.fraudProbability}%. Правила: ${policies}`
  if (lang === 'en') return `${copy.fallbackIntro} ${actionLine}. Risk ${risk.fraudProbability}%. Rules: ${policies}`
  return `${copy.fallbackIntro} ${actionLine}. Xavf ${risk.fraudProbability}%. Qoidalar: ${policies}`
}

async function tryOllama(prompt) {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 2800)
  const safePrompt = `${OLLAMA_REQUIRED_INSTRUCTIONS}\n\n${prompt}`

  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: OLLAMA_MODEL, prompt: safePrompt, stream: false }),
      signal: controller.signal,
    })

    if (!response.ok) return null
    const data = await response.json()
    return typeof data.response === 'string' && data.response.trim() ? data.response.trim() : null
  } catch {
    return null
  } finally {
    window.clearTimeout(timeout)
  }
}

export async function answerCustomerQuestion(text, lang = 'uz', customerData, bankState, options = {}) {
  const intentKey = detectIntent(text)
  const risk = buildRisk(intentKey, text, bankState)
  const ruleIds = policyForIntent(intentKey)
  const actions = actionsForIntent(intentKey, options.autonomous)
  const statePatch = statePatchForActions(actions, risk)
  const copy = dictionary[lang] || dictionary.en
  const fallback = mockResponse({ intent: intentKey, lang, customerData, bankState, risk, ruleIds, actions })

  const prompt = [
    'You are an SQB Bank AI operator.',
    `UI language hint: ${lang}. Do not use this hint to override the customer's detected language.`,
    'Keep the answer concise, operational, and customer-safe.',
    `Customer message: ${text}`,
    `Detected intent: ${copy.intents[intentKey]}`,
    `Fraud probability: ${risk.fraudProbability}%.`,
    `Executed actions: ${actions.length ? actions.join(', ') : 'none'}.`,
    `Bank state: card=${bankState.cardStatus}, dispute=${bankState.disputeStatus}, risk=${bankState.riskScore}.`,
    `You must reference these SQB policy rules by id: ${compactPolicyRefs(ruleIds, lang)}`,
  ].join('\n')

  const ollamaResponse = await tryOllama(prompt)
  const response = ollamaResponse || fallback

  return {
    response,
    intent: copy.intents[intentKey],
    intentKey,
    riskLevel: copy.risk[risk.riskKey],
    riskKey: risk.riskKey,
    fraudProbability: risk.fraudProbability,
    knowledgeSource: `${copy.source}: ${ruleIds.join(', ')}`,
    policyReferences: ruleIds.map((id) => ({ id, text: sqbPolicyRules[id][lang] })),
    complianceWarning: sqbPolicyRules.P01[lang],
    escalation: risk.riskKey === 'high' || actions.includes('escalate'),
    actions,
    actionLabels: actions.map((action) => copy.actions[action]),
    statePatch,
    provider: ollamaResponse ? 'Ollama local AI' : 'Mock policy engine',
    callSummary: `${copy.intents[intentKey]} · ${risk.fraudProbability}% · ${actions.length} action(s)`,
    timeSavedSeconds: 45 + actions.length * 70 + (risk.riskKey === 'high' ? 35 : 0),
  }
}
