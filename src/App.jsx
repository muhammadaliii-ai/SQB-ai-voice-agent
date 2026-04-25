import { useState } from 'react'
import './App.css'

const sqbKnowledgeBase = {
  cards: {
    uz: [
      'SQB HUMO, UZCARD, Visa virtual karta va boshqa karta xizmatlarini qo‘llab-quvvatlaydi.',
      'Karta yo‘qolsa yoki shubhali operatsiya bo‘lsa, avval shaxs tasdiqlanadi, keyin karta vaqtincha bloklanadi va ariza ochiladi.',
      'PIN yoki SMS kod hech qachon so‘ralmaydi.',
    ],
    ru: [
      'SQB поддерживает HUMO, UZCARD, виртуальные карты Visa и другие карточные услуги.',
      'Если карта утеряна или произошла подозрительная операция, сначала подтверждается личность, затем карта временно блокируется и создается обращение.',
      'PIN или SMS-код никогда не запрашиваются.',
    ],
  },
  loans: {
    uz: [
      'SQB mijoz talablariga qarab iste’mol krediti, mikroqarz va biznes moliyalashtirishni taklif qiladi.',
      'Tasdiqlashni muhokama qilishdan oldin shaxs, daromad manbasi va kerakli summa aniqlanadi.',
      'Kredit ma’qullanishi kafolatlanmaydi.',
    ],
    ru: [
      'SQB предлагает потребительские кредиты, микрозаймы и финансирование бизнеса в зависимости от соответствия требованиям.',
      'Перед обсуждением одобрения подтверждаются личность, источник дохода и нужная сумма.',
      'Гарантированное одобрение кредита не обещается.',
    ],
  },
  sqbMobile: {
    uz: [
      'SQB Mobile orqali to‘lovlar, pul o‘tkazmalari, karta boshqaruvi, kredit ma’lumotlari va hisob xizmatlaridan foydalanish mumkin.',
    ],
    ru: [
      'Клиенты могут использовать SQB Mobile для платежей, переводов, управления картами, информации по кредитам и счетам.',
    ],
  },
  security: {
    uz: [
      'Bank xodimlari PIN, SMS kod, karta paroli yoki maxfiy login ma’lumotlarini so‘ramaydi.',
      'Firibgarlik gumoni bo‘lsa, karta bloklanadi va xavfsizlik yoki dispute jarayoniga yo‘naltiriladi.',
    ],
    ru: [
      'Сотрудники банка никогда не должны запрашивать PIN, SMS-код, пароль карты или конфиденциальные данные входа.',
      'При подозрении на мошенничество карта блокируется, а обращение передается в процесс безопасности или оспаривания.',
    ],
  },
  escalation: {
    uz: [
      'Shikoyatlar, yuridik masalalar, bloklangan hisoblar, shaxs mos kelmasligi, yirik shubhali operatsiyalar yoki noaniq siyosat holatlari mutaxassisga o‘tkaziladi.',
    ],
    ru: [
      'По жалобам, юридическим вопросам, заблокированным счетам, несовпадению личности, крупным подозрительным операциям или неясным правилам обращение переводится на специалиста.',
    ],
  },
}

const ui = {
  uz: {
    title: 'SQB AI Voice Agent',
    subtitle: 'SQB Bank uchun avtomatlashtirilgan call-center operatori',
    status: 'AI operator online',
    language: 'Til',
    transcript: 'Mijoz suhbati',
    answer: 'AI javobi',
    source: 'Bilim manbasi',
    topic: 'Aniqlangan mavzu',
    risk: 'Risk darajasi',
    compliance: 'Komplayens qoidasi',
    escalation: 'Mutaxassis kerakmi',
    summary: 'Qo‘ng‘iroq xulosasi',
    input: 'Mijoz savoli',
    placeholder: 'Mijoz savolini kiriting...',
    ask: 'AI’dan so‘rash',
    thinking: 'AI o‘ylayapti...',
    speak: 'Javobni ovozli o‘qish',
    voiceInput: 'Ovozli kiritish',
    voiceTitle: 'AI ovoz yordamchisi',
    voiceReady: 'Ready',
    generatingVoice: 'Generating voice',
    speaking: 'Speaking',
    voiceUnavailable: 'Voice unavailable',
    voiceInputUnsupported: 'Voice input is not supported in this browser. Please use text input.',
    listening: 'Listening',
    yes: 'Ha',
    no: 'Yo‘q',
    customer: 'Mijoz',
    agent: 'SQB AI Agent',
    quickDemos: 'Tezkor demo',
    demos: {
      fraud: 'Shubhali karta operatsiyasi',
      loan: 'Kredit',
      mobile: 'SQB Mobile',
      lostCard: 'Yo‘qolgan karta',
    },
    examples: {
      fraud: 'Mening HUMO kartamdan 250 000 so‘m pul yechildi, men bu to‘lovni qilmaganman.',
      loan: 'Men kredit olmoqchiman, qanday shartlar bor?',
      mobile: 'SQB Mobile ilovasida pul o‘tkazma ishlamayapti.',
      lostCard: 'Kartamni yo‘qotdim, nima qilishim kerak?',
    },
  },
  ru: {
    title: 'SQB AI Voice Agent',
    subtitle: 'Автоматизированный оператор call-центра SQB Bank',
    status: 'AI оператор онлайн',
    language: 'Язык',
    transcript: 'Диалог с клиентом',
    answer: 'Ответ AI',
    source: 'Источник знаний',
    topic: 'Определенная тема',
    risk: 'Уровень риска',
    compliance: 'Правило комплаенса',
    escalation: 'Нужен специалист',
    summary: 'Итог звонка',
    input: 'Вопрос клиента',
    placeholder: 'Введите вопрос клиента...',
    ask: 'Спросить AI',
    thinking: 'AI думает...',
    speak: 'Озвучить ответ',
    voiceInput: 'Голосовой ввод',
    voiceTitle: 'AI голосовой помощник',
    voiceReady: 'Ready',
    generatingVoice: 'Generating voice',
    speaking: 'Speaking',
    voiceUnavailable: 'Voice unavailable',
    voiceInputUnsupported: 'Voice input is not supported in this browser. Please use text input.',
    listening: 'Listening',
    yes: 'Да',
    no: 'Нет',
    customer: 'Клиент',
    agent: 'SQB AI Agent',
    quickDemos: 'Быстрые демо',
    demos: {
      fraud: 'Спорная операция',
      loan: 'Кредит',
      mobile: 'SQB Mobile',
      lostCard: 'Потеря карты',
    },
    examples: {
      fraud: 'С моей карты HUMO списали 250 000 сум, я не совершал этот платеж.',
      loan: 'Я хочу взять кредит, какие условия?',
      mobile: 'В приложении SQB Mobile не работает перевод.',
      lostCard: 'Я потерял карту, что делать?',
    },
  },
}

const initialMessages = [
  {
    id: 1,
    role: 'customer',
    text: 'Mening HUMO kartamdan 250 000 so‘m pul yechildi, men bu to‘lovni qilmaganman.',
  },
]

let activeAudio = null

function hasAny(value, keywords) {
  return keywords.some((keyword) => value.includes(keyword))
}

function answerCustomerQuestion(text, lang) {
  const value = text.toLowerCase()

  if (
    hasAny(value, [
      'kartam yo‘qoldi',
      "kartam yo'qoldi",
      'kartani bloklash',
      'yo‘qotdim',
      "yo'qotdim",
      'потерял карту',
      'заблокировать карту',
      'карта потерялась',
    ])
  ) {
    return {
      answer:
        lang === 'ru'
          ? 'Для безопасности карту нужно временно заблокировать. Сначала подтвердим вашу личность. Не сообщайте PIN или SMS-код. После блокировки поможем с перевыпуском карты.'
          : 'Xavfsizlik uchun kartani vaqtincha bloklash kerak. Avval shaxsingizni tasdiqlaymiz. PIN yoki SMS kodni aytmang. Bloklashdan keyin kartani qayta chiqarish bo‘yicha yordam beramiz.',
      topic: lang === 'ru' ? 'Потерянная карта' : 'Yo‘qolgan karta',
      risk: 'High',
      compliance: lang === 'ru' ? 'Не запрашивайте PIN/SMS. Сначала подтвердите личность.' : 'PIN/SMS so‘ramang. Avval shaxsni tasdiqlang.',
      sourceCategory: 'Cards + Security',
      escalation: true,
      summary:
        lang === 'ru'
          ? 'Клиент сообщил о потере карты. AI рекомендовал подтвердить личность, не запрашивать PIN/SMS, временно заблокировать карту и помочь с перевыпуском.'
          : 'Mijoz kartani yo‘qotganini aytdi. AI shaxsni tasdiqlash, PIN/SMS so‘ramaslik, kartani bloklash va qayta chiqarishda yordam berishni tavsiya qildi.',
    }
  }

  if (
    hasAny(value, [
      'pul yechildi',
      'yechildi',
      'to‘lovni qilmaganman',
      "to'lovni qilmaganman",
      'humo',
      'uzcard',
      'списали',
      'деньги сняли',
      'не совершал',
    ]) ||
    (hasAny(value, ['karta', 'карта']) && hasAny(value, ['pul', 'to‘lov', "to'lov", 'операция', 'платеж']))
  ) {
    return {
      answer:
        lang === 'ru'
          ? 'Понимаю. Для безопасности сначала подтвердим вашу личность. Никому не сообщайте PIN или SMS-код. Рекомендуется временно заблокировать карту и открыть обращение по спорной операции. Если случай сложный, я переведу вас на специалиста.'
          : 'Tushunarli. Xavfsizlik uchun avval shaxsingizni tasdiqlaymiz. PIN yoki SMS kodni hech kimga aytmang. Kartangizni vaqtincha bloklash va shubhali operatsiya bo‘yicha ariza ochish tavsiya etiladi. Murakkab holat bo‘lsa, sizni mutaxassisga ulayman.',
      topic: lang === 'ru' ? 'Подозрительная операция по карте' : 'Shubhali karta operatsiyasi',
      risk: 'High',
      compliance: lang === 'ru' ? 'Никогда не запрашивайте PIN/SMS. Сначала подтвердите личность.' : 'PIN/SMS hech qachon so‘ramang. Avval shaxsni tasdiqlang.',
      sourceCategory: 'Cards + Security',
      escalation: true,
      summary:
        lang === 'ru'
          ? 'Клиент сообщил о подозрительном списании по карте. AI рекомендовал подтвердить личность, не запрашивать PIN/SMS, временно заблокировать карту и при необходимости перевести к специалисту.'
          : 'Mijoz karta bo‘yicha shubhali pul yechilishini aytdi. AI shaxsni tasdiqlash, PIN/SMS so‘ramaslik, kartani vaqtincha bloklash va kerak bo‘lsa mutaxassisga ulashni tavsiya qildi.',
    }
  }

  if (hasAny(value, ['kredit', 'qarz', 'mikroqarz', 'кредит', 'займ', 'микрозайм'])) {
    return {
      answer:
        lang === 'ru'
          ? 'SQB рассматривает кредитные возможности с учетом дохода клиента, кредитной истории и требований. Сначала уточняются личность, источник дохода и нужная сумма. Я не могу гарантировать одобрение, но помогу подобрать подходящее направление.'
          : 'SQB kredit imkoniyatlarini mijozning daromadi, kredit tarixi va talablariga qarab ko‘rib chiqadi. Avval shaxsingiz, daromad manbangiz va kerakli summa aniqlanadi. Men kredit tasdiqlanishini kafolatlay olmayman, lekin sizga mos yo‘nalishni tanlashda yordam beraman.',
      topic: lang === 'ru' ? 'Кредитный вопрос' : 'Kredit bo‘yicha savol',
      risk: 'Medium',
      compliance: lang === 'ru' ? 'Не обещайте гарантированное одобрение.' : 'Kredit ma’qullanishini kafolatlamang.',
      sourceCategory: 'Loans',
      escalation: false,
      summary:
        lang === 'ru'
          ? 'Клиент спросил о кредите. AI объяснил, что нужно уточнить личность, источник дохода и сумму, без обещания гарантированного одобрения.'
          : 'Mijoz kredit haqida so‘radi. AI shaxs, daromad manbasi va kerakli summani aniqlash zarurligini, tasdiqlash kafolatlanmasligini tushuntirdi.',
    }
  }

  if (
    hasAny(value, [
      'sqb mobile',
      'ilova',
      'mobil banking',
      'to‘lov',
      "to'lov",
      'o‘tkazma',
      "o'tkazma",
      'приложение',
      'мобильный банк',
      'платеж',
      'перевод',
    ])
  ) {
    return {
      answer:
        lang === 'ru'
          ? 'Через SQB Mobile можно пользоваться платежами, переводами, управлением картами и отдельными банковскими услугами. Если есть проблема с приложением, проверьте интернет, версию приложения и привязку номера телефона к банку.'
          : 'SQB Mobile orqali to‘lovlar, pul o‘tkazmalari, karta boshqaruvi va ayrim bank xizmatlaridan foydalanish mumkin. Agar ilovada muammo bo‘lsa, internet aloqasi, ilova versiyasi va telefon raqamingiz bankda ro‘yxatdan o‘tganini tekshiring.',
      topic: 'SQB Mobile',
      risk: 'Low',
      compliance: lang === 'ru' ? 'Не запрашивайте SMS-код или пароль входа.' : 'SMS kod yoki login parolini so‘ramang.',
      sourceCategory: 'SQB Mobile',
      escalation: false,
      summary:
        lang === 'ru'
          ? 'Клиент спросил о SQB Mobile. AI объяснил функции приложения и базовые проверки: интернет, версия приложения, привязка номера.'
          : 'Mijoz SQB Mobile haqida so‘radi. AI ilova imkoniyatlari va asosiy tekshiruvlarni tushuntirdi: internet, ilova versiyasi, telefon raqami biriktirilgani.',
    }
  }

  return {
    answer:
      lang === 'ru'
        ? 'Для точного и безопасного ответа по этому вопросу я переведу вас на специалиста SQB. Для защиты персональных данных никому не сообщайте PIN или SMS-код.'
        : 'Bu masala bo‘yicha aniq va xavfsiz javob berish uchun sizni SQB mutaxassisiga ulayman. Shaxsiy ma’lumotlaringizni himoya qilish uchun PIN yoki SMS kodni hech kimga aytmang.',
    topic: lang === 'ru' ? 'Сложный вопрос' : 'Murakkab savol',
    risk: 'Medium',
    compliance: lang === 'ru' ? 'Неясные персональные или регламентные сценарии переводите к специалисту.' : 'Noaniq shaxsiy yoki siyosatga oid holatlarni mutaxassisga o‘tkazing.',
    sourceCategory: 'Human escalation',
    escalation: true,
    summary:
      lang === 'ru'
        ? 'Вопрос требует точного и безопасного ответа. AI рекомендовал перевести клиента к специалисту SQB и не сообщать PIN/SMS.'
        : 'Savol aniq va xavfsiz javobni talab qiladi. AI mijozni SQB mutaxassisiga ulashni va PIN/SMS aytmaslikni tavsiya qildi.',
  }
}

function makeMessage(role, text) {
  return {
    id: Date.now() + Math.random(),
    role,
    text,
  }
}

function getRecognitionApi() {
  return window.SpeechRecognition || window.webkitSpeechRecognition
}

function chooseVoice(voices, lang) {
  const target = lang === 'ru' ? 'ru-RU' : 'uz-UZ'
  const fallback = lang === 'ru' ? 'ru' : 'uz'
  return voices.find((voice) => voice.lang === target) || voices.find((voice) => voice.lang.startsWith(fallback)) || voices[0] || null
}

function stopActiveAudio() {
  if (activeAudio) {
    activeAudio.audio.pause()
    URL.revokeObjectURL(activeAudio.url)
    activeAudio = null
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}

function playAudioBlob(blob, labels, setVoiceStatus) {
  return new Promise((resolve, reject) => {
    const audioUrl = URL.createObjectURL(blob)
    const audio = new Audio(audioUrl)
    activeAudio = { audio, url: audioUrl }

    function cleanup() {
      URL.revokeObjectURL(audioUrl)
      if (activeAudio?.audio === audio) {
        activeAudio = null
      }
    }

    audio.onplaying = () => setVoiceStatus(labels.speaking)
    audio.onended = () => {
      cleanup()
      setVoiceStatus(labels.voiceReady)
      resolve()
    }
    audio.onerror = () => {
      cleanup()
      reject(new Error('Audio playback failed'))
    }

    audio.play().catch((error) => {
      cleanup()
      reject(error)
    })
  })
}

function speakWithBrowserFallback(answer, lang, labels, setVoiceStatus) {
  if (!('speechSynthesis' in window) || !answer) {
    setVoiceStatus(labels.voiceUnavailable)
    return
  }

  try {
    window.speechSynthesis.cancel()
    const voices = window.speechSynthesis.getVoices()
    const selectedVoice = chooseVoice(voices, lang)
    const utterance = new SpeechSynthesisUtterance(answer)
    utterance.lang = lang === 'ru' ? 'ru-RU' : 'uz-UZ'

    if (selectedVoice) {
      utterance.voice = selectedVoice
      utterance.lang = selectedVoice.lang || utterance.lang
    }

    utterance.onstart = () => setVoiceStatus(labels.speaking)
    utterance.onend = () => setVoiceStatus(labels.voiceReady)
    utterance.onerror = () => setVoiceStatus(labels.voiceUnavailable)
    window.speechSynthesis.speak(utterance)
  } catch {
    setVoiceStatus(labels.voiceUnavailable)
  }
}

function getSourceItems(sourceCategory, lang) {
  if (sourceCategory.includes('Cards + Security')) {
    return [...sqbKnowledgeBase.cards[lang], ...sqbKnowledgeBase.security[lang]]
  }

  if (sourceCategory.includes('Mobile')) return sqbKnowledgeBase.sqbMobile[lang]
  if (sourceCategory.includes('Loans')) return sqbKnowledgeBase.loans[lang]
  if (sourceCategory.includes('Human')) return sqbKnowledgeBase.escalation[lang]

  return sqbKnowledgeBase.cards[lang]
}

function App() {
  const [lang, setLang] = useState('uz')
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState(initialMessages)
  const [aiResult, setAiResult] = useState(() => answerCustomerQuestion(initialMessages[0].text, 'uz'))
  const [isThinking, setIsThinking] = useState(false)
  const [voiceStatus, setVoiceStatus] = useState('Ready')
  const [voiceInputStatus, setVoiceInputStatus] = useState('')

  const text = ui[lang]
  const visibleResult = isThinking
    ? {
        answer: text.thinking,
        topic: text.thinking,
        risk: text.thinking,
        compliance: text.thinking,
        sourceCategory: text.thinking,
        escalation: false,
        summary: text.thinking,
      }
    : aiResult
  const sourceItems = getSourceItems(visibleResult.sourceCategory, lang)

  function switchLanguage(nextLang) {
    setLang(nextLang)
    const lastCustomer = [...messages].reverse().find((message) => message.role === 'customer')
    setAiResult(answerCustomerQuestion(lastCustomer?.text || '', nextLang))
    setVoiceStatus(ui[nextLang].voiceReady)
    setVoiceInputStatus('')
  }

  function handleAsk(event) {
    event.preventDefault()
    const cleanQuestion = question.trim()
    if (!cleanQuestion || isThinking) return

    stopActiveAudio()
    setMessages((current) => [...current, makeMessage('customer', cleanQuestion)])
    setQuestion('')
    setIsThinking(true)
    setVoiceInputStatus('')
    setVoiceStatus(text.voiceReady)

    window.setTimeout(() => {
      const result = answerCustomerQuestion(cleanQuestion, lang)
      setAiResult(result)
      setMessages((current) => [...current, makeMessage('agent', result.answer)])
      setIsThinking(false)
    }, 500)
  }

  async function speakAnswer() {
    if (!aiResult.answer || isThinking) {
      setVoiceStatus(text.voiceUnavailable)
      return
    }

    stopActiveAudio()
    setVoiceStatus(text.generatingVoice)

    try {
      const response = await fetch('/api/speak', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: aiResult.answer, lang }),
      })

      if (!response.ok) {
        throw new Error('ElevenLabs backend unavailable')
      }

      const audioBlob = await response.blob()
      if (!audioBlob.size) {
        throw new Error('Empty TTS audio')
      }

      await playAudioBlob(audioBlob, text, setVoiceStatus)
    } catch {
      speakWithBrowserFallback(aiResult.answer, lang, text, setVoiceStatus)
    }
  }

  function startVoiceInput() {
    const RecognitionApi = getRecognitionApi()

    if (!RecognitionApi) {
      setVoiceInputStatus(text.voiceInputUnsupported)
      return
    }

    const recognition = new RecognitionApi()
    recognition.lang = lang === 'ru' ? 'ru-RU' : 'uz-UZ'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    setVoiceInputStatus(text.listening)

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript || ''
      setQuestion(transcript)
      setVoiceInputStatus('')
    }

    recognition.onerror = () => setVoiceInputStatus(text.voiceInputUnsupported)
    recognition.onend = () => setVoiceInputStatus((current) => (current === text.listening ? '' : current))
    recognition.start()
  }

  function loadDemo(kind) {
    setQuestion(text.examples[kind])
    setVoiceInputStatus('')
  }

  return (
    <main className="voice-agent-shell">
      <header className="topbar">
        <div className="brand">
          <span>SQB</span>
          <div>
            <h1>{text.title}</h1>
            <p>{text.subtitle}</p>
          </div>
        </div>

        <div className="top-status">
          <span>{text.status}</span>
          <div className="language-switch" aria-label={text.language}>
            <button className={lang === 'uz' ? 'active' : ''} type="button" onClick={() => switchLanguage('uz')}>
              UZ
            </button>
            <button className={lang === 'ru' ? 'active' : ''} type="button" onClick={() => switchLanguage('ru')}>
              RU
            </button>
          </div>
        </div>
      </header>

      <section className="call-stage">
        <section className="transcript-card" aria-label={text.transcript}>
          <div className="section-title">
            <p>{text.status}</p>
            <h2>{text.transcript}</h2>
          </div>

          <div className="messages">
            {messages.map((message) => (
              <article className={`message ${message.role}`} key={message.id}>
                <span>{message.role === 'customer' ? text.customer : text.agent}</span>
                <p>{message.text}</p>
              </article>
            ))}
          </div>
        </section>

        <aside className="ai-card" aria-label={text.answer}>
          <div className="section-title">
            <p>{visibleResult.topic}</p>
            <h2>{text.answer}</h2>
          </div>

          <section className="answer-card">
            <p>{visibleResult.answer}</p>
          </section>

          <div className="detail-grid">
            <section>
              <span>{text.topic}</span>
              <strong>{visibleResult.topic}</strong>
            </section>
            <section>
              <span>{text.risk}</span>
              <strong className={`risk ${String(visibleResult.risk).toLowerCase()}`}>{visibleResult.risk}</strong>
            </section>
            <section>
              <span>{text.source}</span>
              <strong>{visibleResult.sourceCategory}</strong>
            </section>
            <section>
              <span>{text.escalation}</span>
              <strong>{visibleResult.escalation ? text.yes : text.no}</strong>
            </section>
          </div>

          <section className="compliance-card">
            <span>{text.compliance}</span>
            <p>{visibleResult.compliance}</p>
          </section>

          <section className="summary-card">
            <span>{text.summary}</span>
            <p>{visibleResult.summary}</p>
          </section>

          <section className="source-card">
            <span>{text.source}</span>
            <ul>
              {sourceItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </aside>
      </section>

      <section className="quick-demos">
        <span>{text.quickDemos}</span>
        {Object.entries(text.demos).map(([kind, label]) => (
          <button type="button" key={kind} onClick={() => loadDemo(kind)}>
            {label}
          </button>
        ))}
      </section>

      <form className="ask-bar" onSubmit={handleAsk}>
        <label htmlFor="customer-question">{text.input}</label>
        <textarea
          id="customer-question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder={text.placeholder}
          rows="2"
          disabled={isThinking}
        />
        <button type="submit" disabled={!question.trim() || isThinking}>
          {isThinking ? text.thinking : text.ask}
        </button>
      </form>

      <aside className="voice-controls" aria-label={text.voiceTitle}>
        <div>
          <strong>{text.voiceTitle}</strong>
          <span>{voiceStatus}</span>
        </div>
        <button type="button" onClick={speakAnswer} disabled={isThinking || !aiResult.answer}>
          {text.speak}
        </button>
        <button type="button" className="secondary" onClick={startVoiceInput}>
          {text.voiceInput}
        </button>
        {voiceInputStatus && <p>{voiceInputStatus}</p>}
      </aside>
    </main>
  )
}

export default App
