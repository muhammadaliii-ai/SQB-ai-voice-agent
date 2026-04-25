const intentKeywords = {
  fraud: ['pul yechildi', 'yechildi', 'karta', 'humo', 'uzcard', 'списали', 'карта', 'деньги сняли'],
  loan: ['kredit', 'qarz', 'mikroqarz', 'кредит', 'займ'],
  balance: ['balans', 'qoldiq', 'balance', 'баланс', 'остаток'],
  cardBlock: ['kartani bloklash', 'kartam yo‘qoldi', "kartam yo'qoldi", 'заблокировать карту', 'потерял карту', 'потеряла карту'],
  sqbMobile: ['sqb mobile', 'ilova', 'приложение', 'mobil banking'],
}

function hasKeyword(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword))
}

function detectLargeAmount(text) {
  const normalized = text.replace(/\s/g, '')
  const matches = normalized.match(/\d+/g) || []
  return matches.some((value) => Number(value) >= 1000000)
}

function localizeIntent(intent, lang) {
  const labels = {
    uz: {
      fraud: 'Fraud',
      loan: 'Loan',
      balance: 'Balance',
      cardBlock: 'Card block',
      sqbMobile: 'SQB Mobile',
      default: 'General banking',
    },
    ru: {
      fraud: 'Мошенничество',
      loan: 'Кредит',
      balance: 'Баланс',
      cardBlock: 'Блокировка карты',
      sqbMobile: 'SQB Mobile',
      default: 'Общий банковский вопрос',
    },
    en: {
      fraud: 'Fraud',
      loan: 'Loan',
      balance: 'Balance',
      cardBlock: 'Card block',
      sqbMobile: 'SQB Mobile',
      default: 'General banking',
    },
  }

  return labels[lang]?.[intent] || labels.en[intent] || labels.en.default
}

function defaultCopy(lang) {
  if (lang === 'ru') {
    return 'Я уточню детали и помогу безопасно. Если вопрос требует доступа к персональным данным или ручной проверки, я передам обращение специалисту SQB.'
  }

  if (lang === 'en') {
    return 'I will clarify the details and help safely. If the request needs personal data access or manual review, I will transfer the case to an SQB specialist.'
  }

  return 'Aniq va xavfsiz yordam berish uchun savolni qisqacha aniqlashtiraman. Agar masala shaxsiy ma’lumot yoki qo‘lda tekshiruv talab qilsa, sizni SQB mutaxassisiga ulayman.'
}

export function answerCustomerQuestion(text, lang = 'uz', customerData) {
  const value = text.toLowerCase()
  const isVerified = customerData.kycStatus.toLowerCase() === 'verified'
  const isLargeAmount = detectLargeAmount(value)
  let intent = 'default'
  let riskLevel = 'Low'
  let escalation = false
  let knowledgeSource = 'SQB general support rules'
  let complianceWarning = lang === 'ru'
    ? 'Не запрашивайте PIN, SMS-код, CVV или пароль клиента.'
    : lang === 'en'
      ? 'Never request PIN, SMS code, CVV, or customer password.'
      : 'PIN, SMS kod, CVV yoki mijoz parolini so‘ramang.'
  let response = defaultCopy(lang)
  let callSummary = lang === 'ru'
    ? 'Клиент задал общий вопрос. AI предложил безопасное уточнение и эскалацию при необходимости.'
    : lang === 'en'
      ? 'Customer asked a general question. AI suggested safe clarification and escalation if needed.'
      : 'Mijoz umumiy savol berdi. AI xavfsiz aniqlashtirish va kerak bo‘lsa eskalatsiyani tavsiya qildi.'

  if (hasKeyword(value, intentKeywords.cardBlock)) {
    intent = 'cardBlock'
    riskLevel = 'High'
    escalation = true
    knowledgeSource = 'SQB card security policy'
    response = lang === 'ru'
      ? 'Для безопасности сначала подтвердим вашу личность. После подтверждения временно заблокируем карту, оформим перевыпуск HUMO или UZCARD и проверим последние операции.'
      : lang === 'en'
        ? 'For security, we will first verify your identity. After verification, we will temporarily block the card, create a HUMO or UZCARD reissue request, and review recent transactions.'
        : 'Xavfsizlik uchun avval shaxsingizni tasdiqlaymiz. Tasdiqdan keyin kartani vaqtincha bloklaymiz, HUMO yoki UZCARD qayta chiqarish arizasini ochamiz va oxirgi operatsiyalarni tekshiramiz.'
    callSummary = lang === 'ru'
      ? 'Запрос на блокировку карты. Требуется проверка личности, временная блокировка и перевыпуск карты.'
      : lang === 'en'
        ? 'Card block request. Identity verification, temporary block, and card reissue are required.'
        : 'Karta bloklash so‘rovi. Shaxsni tasdiqlash, vaqtincha bloklash va qayta chiqarish kerak.'
  } else if (hasKeyword(value, intentKeywords.fraud)) {
    intent = 'fraud'
    riskLevel = 'High'
    escalation = isLargeAmount || !isVerified
    knowledgeSource = 'SQB fraud and dispute process'
    response = lang === 'ru'
      ? 'Для безопасности сначала подтвердим вашу личность. Никому не сообщайте PIN или SMS-код. Рекомендуется временно заблокировать карту и открыть обращение по спорной операции.'
      : lang === 'en'
        ? 'For security, we will first verify your identity. Do not share your PIN or SMS code with anyone. We recommend temporarily blocking the card and opening a dispute case for the suspicious transaction.'
        : 'Xavfsizlik uchun avval shaxsingizni tasdiqlaymiz. PIN yoki SMS kodni hech kimga aytmang. Kartangizni vaqtincha bloklash va shubhali operatsiya bo‘yicha ariza ochish tavsiya etiladi.'
    callSummary = lang === 'ru'
      ? `Подозрительная операция по карте. Эскалация: ${escalation ? 'да' : 'нет'}, причина: ${isLargeAmount ? 'крупная сумма' : isVerified ? 'клиент верифицирован' : 'KYC не подтвержден'}.`
      : lang === 'en'
        ? `Suspicious card transaction. Escalation: ${escalation ? 'yes' : 'no'}, reason: ${isLargeAmount ? 'large amount' : isVerified ? 'verified customer' : 'KYC not verified'}.`
        : `Kartada shubhali operatsiya. Eskalatsiya: ${escalation ? 'ha' : 'yo‘q'}, sabab: ${isLargeAmount ? 'yirik summa' : isVerified ? 'mijoz tasdiqlangan' : 'KYC tasdiqlanmagan'}.`
  } else if (hasKeyword(value, intentKeywords.loan)) {
    intent = 'loan'
    riskLevel = 'Medium'
    knowledgeSource = 'SQB loan servicing rules'
    complianceWarning = lang === 'ru'
      ? 'Не гарантируйте одобрение кредита. Укажите, что решение зависит от скоринга и документов.'
      : lang === 'en'
        ? 'Do not guarantee loan approval. State that the decision depends on scoring and documents.'
        : 'Kredit ma’qullanishini kafolatlamang. Qaror skoring va hujjatlarga bog‘liqligini ayting.'
    response = lang === 'ru'
      ? `У вас есть активный кредит ${customerData.loan.amount}, ежемесячный платеж ${customerData.loan.monthlyPayment}, следующий платеж ${customerData.loan.nextPaymentDate}. По новому кредиту можно проверить предварительную возможность, но одобрение не гарантируется и зависит от скоринга.`
      : lang === 'en'
        ? `You currently have an active loan of ${customerData.loan.amount}, monthly payment ${customerData.loan.monthlyPayment}, next payment date ${customerData.loan.nextPaymentDate}. We can check preliminary eligibility for a new loan, but approval is never guaranteed and depends on scoring.`
        : `Sizda faol kredit mavjud: ${customerData.loan.amount}, oylik to‘lov ${customerData.loan.monthlyPayment}, keyingi to‘lov sanasi ${customerData.loan.nextPaymentDate}. Yangi kredit bo‘yicha dastlabki imkoniyatni tekshirish mumkin, lekin ma’qullanish kafolatlanmaydi va skoringga bog‘liq.`
    callSummary = lang === 'ru'
      ? 'Кредитный вопрос. AI показал активный кредит, ежемесячный платеж и осторожную рекомендацию по eligibility.'
      : lang === 'en'
        ? 'Loan question. AI showed active loan, monthly payment, and a careful eligibility suggestion.'
        : 'Kredit savoli. AI faol kredit, oylik to‘lov va ehtiyotkor eligibility tavsiyasini berdi.'
  } else if (hasKeyword(value, intentKeywords.balance)) {
    intent = 'balance'
    riskLevel = 'Low'
    knowledgeSource = 'SQB customer profile balance'
    response = lang === 'ru'
      ? `Ваш общий доступный баланс по профилю: ${customerData.totalBalance}. Также депозит: ${customerData.depositBalance}. Для безопасности детали счетов сообщаются после подтверждения личности.`
      : lang === 'en'
        ? `Your total available profile balance is ${customerData.totalBalance}. Deposit balance: ${customerData.depositBalance}. For security, account details are shared after identity verification.`
        : `Profil bo‘yicha umumiy balansingiz: ${customerData.totalBalance}. Depozit balansi: ${customerData.depositBalance}. Xavfsizlik uchun hisob tafsilotlari shaxs tasdiqlangandan keyin aytiladi.`
    callSummary = lang === 'ru'
      ? 'Запрос баланса. AI использовал данные профиля и напомнил о проверке личности.'
      : lang === 'en'
        ? 'Balance request. AI used profile data and reminded about identity verification.'
        : 'Balans so‘rovi. AI profil ma’lumotidan foydalandi va shaxsni tasdiqlashni eslatdi.'
  } else if (hasKeyword(value, intentKeywords.sqbMobile)) {
    intent = 'sqbMobile'
    riskLevel = 'Low'
    knowledgeSource = 'SQB Mobile product knowledge'
    response = lang === 'ru'
      ? 'В SQB Mobile доступны платежи, переводы, управление картами, информация по кредитам, депозитам и истории операций. Если приложение не работает, проверьте интернет, версию приложения и привязанный номер телефона.'
      : lang === 'en'
        ? 'SQB Mobile supports payments, transfers, card management, loan information, deposits, and transaction history. If the app is not working, check internet connection, app version, and registered phone number.'
        : 'SQB Mobile orqali to‘lovlar, pul o‘tkazmalari, karta boshqaruvi, kredit ma’lumotlari, depozitlar va operatsiyalar tarixini ko‘rish mumkin. Ilova ishlamasa, internet, ilova versiyasi va bog‘langan telefon raqamini tekshiring.'
    callSummary = lang === 'ru'
      ? 'Вопрос по SQB Mobile. AI объяснил функции приложения и базовую диагностику.'
      : lang === 'en'
        ? 'SQB Mobile question. AI explained app functions and basic troubleshooting.'
        : 'SQB Mobile savoli. AI ilova funksiyalari va asosiy diagnostikani tushuntirdi.'
  }

  return {
    response,
    intent: localizeIntent(intent, lang),
    intentKey: intent,
    riskLevel,
    knowledgeSource,
    complianceWarning,
    escalation: escalation ? (lang === 'ru' ? 'Да' : lang === 'en' ? 'Yes' : 'Ha') : (lang === 'ru' ? 'Нет' : lang === 'en' ? 'No' : 'Yo‘q'),
    callSummary,
  }
}
