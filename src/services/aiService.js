const dictionary = {
  fraud: ['fraud', 'scam', 'stolen', 'not make', 'suspicious', 'yechildi', 'qilmagan', 'firib', 'shubhali', 'списали', 'мошен', 'подозр'],
  balance: ['balance', 'hisob', 'balans', 'qoldiq', 'остаток', 'баланс'],
  cardIssue: ['card', 'karta', 'humo', 'uzcard', 'lost', 'block', 'yo‘qoldi', "yo'qoldi", 'blok', 'карта', 'потер', 'заблок'],
  transfer: ['transfer', 'o‘tkazma', "o'tkazma", 'перевод', 'отправил', 'задерж'],
  complaint: ['complaint', 'complain', 'shikoyat', 'norozi', 'angry', 'жалоб', 'недовол', 'возмущ'],
}

const angryWords = ['angry', 'terrible', 'norozi', 'zudlik', 'hoziroq', 'жалоб', 'срочно', 'возмущ', 'ужас']
const worriedWords = ['worried', 'xavotir', 'qo‘rq', "qo'rq", 'shubha', 'не знаю', 'боюсь', 'пережива']

const content = {
  uz: {
    fraud: {
      response: 'Tushunarli. Xavfsizlik uchun kartangizni vaqtincha bloklaymiz va tekshiruvni boshlaymiz. Iltimos, PIN, SMS kod yoki karta parolini hech kimga aytmang. Operatsiya tafsilotlarini dispute jarayoniga kiritaman.',
      offer: 'SQB Mobile’da karta limitlari va push-xabarnomalarni yoqishni taklif qiling.',
      compliance: 'Shaxsni tasdiqlang. PIN, SMS kod, CVV yoki parol so‘ramang. Shubhali operatsiyada karta bloklash va dispute arizasi majburiy.',
    },
    balance: {
      response: 'Balansni xavfsiz tekshirish uchun mijozni SQB Mobile yoki rasmiy SMS/USSD kanaliga yo‘naltiramiz. Shaxs tasdiqlangandan keyin hisob holati bo‘yicha umumiy ma’lumot bera olaman.',
      offer: 'SQB Mobile’da tezkor balans va xarajat monitoringini ulang.',
      compliance: 'Balans ma’lumotini faqat shaxs tasdiqlangandan keyin ayting.',
    },
    cardIssue: {
      response: 'Kartangiz bo‘yicha xavfsizlik choralarini boshlaymiz. Agar karta yo‘qolgan bo‘lsa, uni vaqtincha bloklaymiz, keyin HUMO yoki Uzcard qayta chiqarish bo‘yicha ariza ochamiz.',
      offer: 'Virtual Visa karta yoki karta sug‘urtasini tavsiya qiling.',
      compliance: 'Karta bloklashdan oldin shaxsni tasdiqlang. Maxfiy kodlarni so‘ramang.',
    },
    transfer: {
      response: 'Pul o‘tkazma holatini tekshiramiz. HUMO/Uzcard ichki o‘tkazmalarida texnik kechikish bo‘lishi mumkin. Tranzaksiya raqami va vaqtini qayd etib, monitoringga yuboraman.',
      offer: 'SQB Mobile’da saqlangan to‘lovlar va avtomatik cheklarni taklif qiling.',
      compliance: 'To‘liq karta raqami yoki SMS kod talab qilmang. Faqat xavfsiz identifikatorlardan foydalaning.',
    },
    complaint: {
      response: 'Murojaatingizni qabul qildim. Shikoyatni rasmiy tartibda ro‘yxatdan o‘tkazamiz, mas’ul bo‘limga yuboramiz va javob muddati bo‘yicha sizni xabardor qilamiz.',
      offer: 'Mijozga rasmiy murojaat raqamini SMS orqali yuborishni taklif qiling.',
      compliance: 'Shikoyatni neytral tilda qayd eting. Va’da bermang, rasmiy muddatlarni ayting.',
    },
    unknown: {
      response: 'Aniq va xavfsiz yordam berish uchun savolingizni qisqacha aniqlashtirib olaman. SQB xizmatlari, karta, kredit, pul o‘tkazma yoki dispute bo‘yicha yordam bera olaman.',
      offer: 'SQB Mobile ilovasini asosiy self-service kanal sifatida taklif qiling.',
      compliance: 'Noaniq yoki yuqori xavfli holatni mutaxassisga eskalatsiya qiling.',
    },
  },
  ru: {
    fraud: {
      response: 'Понимаю. Для безопасности временно заблокируем карту и начнем проверку. Пожалуйста, никому не сообщайте PIN, SMS-код или пароль карты. Детали операции внесу в процесс dispute.',
      offer: 'Предложите включить лимиты и push-уведомления в SQB Mobile.',
      compliance: 'Подтвердите личность. Не запрашивайте PIN, SMS-код, CVV или пароль. При подозрительной операции обязательны блокировка и dispute.',
    },
    balance: {
      response: 'Баланс безопаснее проверить через SQB Mobile или официальный SMS/USSD канал. После подтверждения личности я могу дать общую информацию по состоянию счета.',
      offer: 'Предложите быстрый баланс и мониторинг расходов в SQB Mobile.',
      compliance: 'Сообщайте данные по счету только после подтверждения личности.',
    },
    cardIssue: {
      response: 'Начинаем меры безопасности по карте. Если карта потеряна, временно блокируем ее, затем оформляем заявку на перевыпуск HUMO или Uzcard.',
      offer: 'Предложите виртуальную Visa карту или защиту карты.',
      compliance: 'Перед блокировкой подтвердите личность. Не запрашивайте секретные коды.',
    },
    transfer: {
      response: 'Проверим статус перевода. По внутренним переводам HUMO/Uzcard возможна техническая задержка. Зафиксирую номер и время транзакции и передам на мониторинг.',
      offer: 'Предложите сохраненные платежи и автоматические чеки в SQB Mobile.',
      compliance: 'Не запрашивайте полный номер карты или SMS-код. Используйте безопасные идентификаторы.',
    },
    complaint: {
      response: 'Ваше обращение принято. Зарегистрируем жалобу официально, передадим ответственному подразделению и сообщим срок ответа.',
      offer: 'Предложите отправить номер обращения по SMS.',
      compliance: 'Фиксируйте жалобу нейтрально. Не обещайте результат, называйте официальные сроки.',
    },
    unknown: {
      response: 'Чтобы помочь точно и безопасно, уточню ваш вопрос. Я могу помочь по услугам SQB, картам, кредитам, переводам и dispute.',
      offer: 'Предложите SQB Mobile как основной self-service канал.',
      compliance: 'Неясный или рискованный сценарий передайте специалисту.',
    },
  },
  en: {
    fraud: {
      response: 'Understood. For security, we will temporarily lock your card and start an investigation. Please do not share your PIN, SMS code, or card password. I will register the transaction details for the dispute process.',
      offer: 'Offer card limits and push alerts in SQB Mobile.',
      compliance: 'Verify identity. Never ask for PIN, SMS code, CVV, or password. Suspicious transactions require card lock and dispute case.',
    },
    balance: {
      response: 'The safest way to check balance is SQB Mobile or an official SMS/USSD channel. After identity verification, I can provide general account status information.',
      offer: 'Offer instant balance and spending monitoring in SQB Mobile.',
      compliance: 'Share account information only after identity verification.',
    },
    cardIssue: {
      response: 'We will start card security actions. If the card is lost, we temporarily lock it, then open a reissue request for HUMO or Uzcard.',
      offer: 'Offer a virtual Visa card or card protection.',
      compliance: 'Verify identity before locking a card. Never request secret codes.',
    },
    transfer: {
      response: 'We will check the transfer status. HUMO/Uzcard internal transfers can have a technical delay. I will record the transaction ID and time for monitoring.',
      offer: 'Offer saved payments and automatic receipts in SQB Mobile.',
      compliance: 'Do not request full card number or SMS code. Use safe identifiers only.',
    },
    complaint: {
      response: 'Your complaint has been accepted. We will register it officially, route it to the responsible team, and inform you about the response timeline.',
      offer: 'Offer to send the case number by SMS.',
      compliance: 'Record complaints neutrally. Do not promise an outcome; state official timelines.',
    },
    unknown: {
      response: 'To help accurately and safely, I will clarify your question. I can help with SQB services, cards, loans, transfers, and dispute cases.',
      offer: 'Offer SQB Mobile as the primary self-service channel.',
      compliance: 'Escalate unclear or high-risk cases to a specialist.',
    },
  },
}

function includesAny(value, words) {
  return words.some((word) => value.includes(word))
}

export function getAIResponse(message, language = 'uz') {
  const text = message.toLowerCase()
  let intent = 'unknown'

  if (includesAny(text, dictionary.fraud)) intent = 'fraud'
  else if (includesAny(text, dictionary.balance)) intent = 'balance'
  else if (includesAny(text, dictionary.cardIssue)) intent = 'card issue'
  else if (includesAny(text, dictionary.transfer)) intent = 'transfer'
  else if (includesAny(text, dictionary.complaint)) intent = 'complaint'

  const sentiment = includesAny(text, angryWords) ? 'angry' : includesAny(text, worriedWords) || intent === 'fraud' ? 'worried' : 'calm'
  const normalizedIntent = intent === 'card issue' ? 'cardIssue' : intent
  const pack = content[language]?.[normalizedIntent] || content[language]?.unknown || content.uz.unknown

  return {
    response: pack.response,
    intent,
    sentiment,
    nextBestOffer: pack.offer,
    complianceWarning: pack.compliance,
  }
}
