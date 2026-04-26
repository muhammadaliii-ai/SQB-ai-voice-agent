import { createContext, useContext, useEffect, useRef, useState } from 'react'
import './App.css'

const UiTextContext = createContext(null)

const navItems = [
  ['live', 'liveCalls'],
  ['analytics', 'demandAnalytics'],
  ['customer', 'customerProfile'],
  ['assist', 'operatorAssist'],
  ['compliance', 'compliance'],
  ['reports', 'reports'],
]

const customerProfile = {
  name: 'Azizbek Karimov',
  age: 29,
  city: 'Tashkent',
  income: "7,000,000 so'm",
  segment: 'Mass Affluent',
  activeLoan: "45,000,000 so'm",
  monthlyPayment: "3,200,000 so'm",
  nextPaymentDate: '05.05.2026',
}

const UI_TEXT = {
  uz: {
    headerEyebrow: 'SQB bank boshqaruv paneli',
    headerSubtitle: "Real vaqt rejimida operator yordamchisi, compliance nazorati, talab analitikasi va qo'ng'iroqlarni o'rganish.",
    runDemo: 'Ultra tez demoni ishga tushirish',
    demoRunning: 'Demo ishlayapti...',
    reset: 'Qayta boshlash',
    export: 'Hisobot',
    callStatus: {
      standby: 'Kutish',
      live: "Jonli qo'ng'iroq",
      summary: 'Xulosa tayyor',
    },
    nav: {
      liveCalls: "Jonli qo'ng'iroqlar",
      demandAnalytics: 'Talab analitikasi',
      customerProfile: 'Mijoz profili',
      operatorAssist: 'Operator yordamchisi',
      compliance: 'Compliance',
      reports: 'Hisobotlar',
    },
    stats: [
      ["Bugungi qo'ng'iroqlar", '1,284', 'SQB kontakt markazi hajmi'],
      ["Takroriy qo'ng'iroqlar", '20-35%', "Avtomatlashtirish mumkin bo'lgan diapazon"],
      ['Intent aniqligi', null, 'AI aniqlagan mavzu'],
      ['Compliance holati', null, 'Kredit va karta xavfsizlik qoidalari'],
      ["O'rganish navbati", '7%', 'Nomalum yoki yangi talablar'],
      ['Eligibility signali', null, "Xavf: O'rtacha"],
    ],
    ready: 'Tayyor',
    clear: 'Toza',
    critical: 'Kritik',
    riskMedium: "O'rtacha",
    riskNormal: 'Normal',
    riskReview: "Ko'rib chiqish",
    demand: {
      eyebrow: 'Talab analitikasi',
      title: "Eng ko'p uchraydigan qo'ng'iroq sabablari",
      mix: 'Bugungi talab ulushi',
      insightTitle: 'Insight',
      insight: "Bugun eng ko'p sabab: kredit to'lov sanasi. Avtomatik IVR/AI javob qo'shish tavsiya qilinadi.",
      items: [
        { key: 'due-date', label: "Loan due date / next payment", value: 35 },
        { key: 'card-balance', label: 'Card balance / transaction questions', value: 18 },
        { key: 'mobile-app', label: 'SQB Mobile app issues', value: 14 },
        { key: 'card-risk', label: 'Card block / suspicious transaction', value: 11 },
        { key: 'loan-product', label: 'Loan application / product info', value: 9 },
        { key: 'deposit', label: 'Deposit / savings questions', value: 6 },
        { key: 'unknown', label: 'Other / unknown', value: 7 },
      ],
    },
    transcript: {
      eyebrow: "Jonli qo'ng'iroq tinglovchisi",
      title: 'Real vaqt mijoz suhbati',
      streaming: 'Oqimda',
      emptyRole: 'Tizim',
      empty: "Demo ishga tushganda suhbat matni shu yerda ko'rinadi.",
      roles: { Customer: 'Mijoz', Operator: 'Operator', AI: 'AI' },
    },
    analysis: {
      eyebrow: 'Jonli AI tahlil',
      title: "Intent, xavf va yo'l-yo'riq",
      intent: 'Intent',
      sentiment: 'Sentiment',
      confidence: 'Ishonch',
      risk: 'Xavf',
      safeResponse: 'AI xavfsiz javobi',
      nextBestOffer: 'Keyingi eng yaxshi taklif',
      criticalRisk: 'Kritik xavf',
    },
    compliance: {
      eyebrow: 'Compliance qoidalari',
      alertEyebrow: 'Compliance ogohlantirish',
      noAlertTitle: "Kritik ogohlantirish yo'q",
      noAlertBody: "AI taqiqlangan va'dalar, to'liq yopilmagan KYC, xavfli ma'lumot so'rovlari va kredit bo'yicha riskli iboralarni kuzatadi.",
      rules: [
        "PIN, SMS kod, CVV yoki to'liq karta parolini so'ramang.",
        'Kredit tasdiqlanishini kafolatlamang.',
        "Shaxsiy moliyaviy ma'lumotdan oldin mijozni tasdiqlang.",
      ],
      safeRewrite: 'Xavfsiz formulirovka',
    },
    kyc: {
      eyebrow: 'Kredit KYC ro‘yxati',
      title: 'Kredit qaroridan oldin zarur',
      done: 'Bajarildi',
      missing: 'Yetishmaydi',
      items: [
        ['income', "Daromad manbasi so'raldi"],
        ['identity', 'Shaxsni tasdiqlash'],
        ['purpose', 'Kredit maqsadi'],
        ['consent', 'Skoring roziligi'],
      ],
    },
    customer: {
      eyebrow: 'Mijoz profili',
      risk: 'Xavf',
      age: 'Yosh',
      city: 'Shahar',
      income: 'Daromad',
      segment: 'Segment',
      loanEligibility: 'Kredit imkoniyati',
      activeLoan: 'Faol kredit',
      monthlyPayment: "Oylik to'lov",
      nextPaymentDate: "Keyingi to'lov sanasi",
      values: {
        risk: "O'rtacha",
        eligibility: 'Shartli',
      },
    },
    safeAction: {
      eyebrow: 'Xavfsiz amallar qatlami',
      title: 'Oldindan tasdiqlangan operator amallari',
      visibleResult: "Ko'rinadigan natija",
      noResult: 'Hali xavfsiz amal bajarilmadi.',
      actions: {
        crmNote: {
          label: 'CRM izoh yaratish',
          result: "Kredit so'rovi, compliance flag va KYC kamchiliklari bilan CRM izoh yaratildi.",
        },
        manager: {
          label: 'Menejerga eskalatsiya',
          result: "Taqiqlangan kredit va'dasi aniqlangani uchun menejerga eskalatsiya tayyorlandi.",
        },
        followUp: {
          label: 'Follow-up yuborish',
          result: "Tasdiqlangan xavfsiz kredit matni va KYC eslatmalari bilan follow-up navbatga qo'yildi.",
        },
      },
    },
    audit: {
      eyebrow: 'Audit log',
      title: 'Tushunarli hodisalar tarixi',
      events: 'hodisa',
      ready: 'Tayyor',
      empty: "Audit tarixi to'lishi uchun demoni ishga tushiring.",
      labels: {
        call_started: "Qo'ng'iroq boshlandi",
        customer_message: 'Mijoz xabari',
        operator_message: 'Operator xabari',
        compliance_violation_detected: 'Compliance buzilishi aniqlandi',
        ai_rewrite_suggested: 'AI xavfsiz formulirovka taklif qildi',
        kyc_update: 'KYC yangilandi',
        recommendation_generated: 'Tavsiya yaratildi',
        crm_summary_created: 'CRM xulosa yaratildi',
        safe_action_executed: 'Xavfsiz amal bajarildi',
      },
    },
    unknown: {
      eyebrow: 'Unknown Calls Cluster',
      title: "Yangi qo'ng'iroq patternlarini o'rganish",
      demoButton: 'Ilovaga kira olmayapman',
      demoMessage: 'Ilovaga kira olmayapman',
      demoLabel: 'Demo xabar',
      initialLabel: 'Birinchi klassifikatsiya',
      clusterLabel: 'Klaster',
      insightTitle: 'Insight',
      initialLearning: {
        message: 'Ilovaga kira olmayapman',
        initial: 'Tekshirilmagan',
        cluster: "Hali klaster yo'q",
        insight: "Yangi mobile app muammo patternini yaratish uchun demo xabarni bosing.",
      },
      detecting: 'Aniqlanmoqda...',
      captured: "Unknown xabar klasterlash uchun olindi.",
      pattern: 'Yangi pattern aniqlandi: Mobile App Issues',
      recommendation: 'SQB Mobile uchun qayta ishlatiladigan support skript tayyorlang.',
      response: "SQB Mobile bo'yicha muammo klasterga qo'shildi. Operator ilova versiyasi, internet aloqasi va ro'yxatdan o'tgan telefon raqamini tekshiradi.",
      audit: 'Yangi pattern aniqlandi: Mobile App Issues. Talab analitikasi yangilandi.',
    },
    voice: {
      eyebrow: 'Ovoz simulyatsiyasi',
      title: 'Speech boshqaruvlari',
      start: 'Ovozni boshlash',
      stop: "Ovozni to'xtatish",
      speak: 'AI javobini o‘qish',
      analyze: 'Tahlil',
      placeholder: 'Mijoz xabarini yozing yoki ovoz bilan ayting...',
      ready: 'Voice ready',
      listening: 'Listening...',
      unsupported: 'SpeechRecognition bu brauzerda ishlamaydi. Matn inputidan foydalaning.',
      failed: 'Voice recognition failed. Text input still works.',
      stopped: 'Voice stopped. Text input is available.',
      captured: 'Voice transcript captured',
    },
    crm: {
      eyebrow: 'CRM xulosa',
      title: "Qo'ng'iroq yakuni",
      empty: 'Demo oxirida CRM xulosa avtomatik yaratiladi.',
    },
    why: {
      eyebrow: 'Nima uchun muhim',
      title: 'Xavfsiz joyda avtomatlashtirish',
      text: "20-35% qo'ng'iroqlar takroriy va avtomatlashtirilishi mumkin. Qolgan qo'ng'iroqlar tahlil qilinadi, klasterlanadi va skriptlar, mahsulotlar hamda AI kategoriyalarini yaxshilash uchun ishlatiladi.",
    },
    emptyAnalysis: {
      intent: 'Mijoz kutilmoqda',
      sentiment: 'Boshlanmagan',
      confidence: 0,
      response: "Jonli intent aniqlash, compliance monitoring va CRM natijasini ko'rish uchun ultra tez demoni ishga tushiring.",
      recommendation: "Hozircha tavsiya yo'q.",
      risk: 'Normal',
    },
    exportResult: {
      withEvents: (count) => `${count} ta audit hodisasi va CRM xulosa bilan hisobot tayyorlandi.`,
      empty: "Hisobot shabloni tayyor. Audit hodisalarini qo'shish uchun demoni ishga tushiring.",
    },
  },
  ru: {
    headerEyebrow: 'Панель управления SQB Bank',
    headerSubtitle: 'Помощник оператора в реальном времени, контроль compliance, аналитика спроса и обучение по звонкам.',
    runDemo: 'Запустить ультрабыстрый демо',
    demoRunning: 'Демо выполняется...',
    reset: 'Сбросить',
    export: 'Отчет',
    callStatus: {
      standby: 'Ожидание',
      live: 'Активный звонок',
      summary: 'Итог готов',
    },
    nav: {
      liveCalls: 'Живые звонки',
      demandAnalytics: 'Аналитика спроса',
      customerProfile: 'Профиль клиента',
      operatorAssist: 'Подсказки оператору',
      compliance: 'Compliance',
      reports: 'Отчеты',
    },
    stats: [
      ['Звонки сегодня', '1,284', 'Объем контакт-центра SQB'],
      ['Повторяющиеся звонки', '20-35%', 'Диапазон для автоматизации'],
      ['Уверенность intent', null, 'Тема, найденная AI'],
      ['Compliance статус', null, 'Правила безопасности кредитов и карт'],
      ['Очередь обучения', '7%', 'Неизвестные или новые запросы'],
      ['Сигнал eligibility', null, 'Риск: Средний'],
    ],
    ready: 'Готово',
    clear: 'Чисто',
    critical: 'Критично',
    riskMedium: 'Средний',
    riskNormal: 'Нормальный',
    riskReview: 'Проверка',
    demand: {
      eyebrow: 'Аналитика спроса',
      title: 'Самые частые причины звонков',
      mix: 'Распределение спроса сегодня',
      insightTitle: 'Инсайт',
      insight: 'Самая частая причина сегодня: дата платежа по кредиту. Рекомендуется добавить автоматический ответ IVR/AI.',
      items: [
        { key: 'due-date', label: 'Дата платежа / следующий платеж по кредиту', value: 35 },
        { key: 'card-balance', label: 'Баланс карты / вопросы по операциям', value: 18 },
        { key: 'mobile-app', label: 'Проблемы с SQB Mobile', value: 14 },
        { key: 'card-risk', label: 'Блокировка карты / подозрительная операция', value: 11 },
        { key: 'loan-product', label: 'Заявка на кредит / информация о продукте', value: 9 },
        { key: 'deposit', label: 'Депозиты / накопления', value: 6 },
        { key: 'unknown', label: 'Другое / неизвестно', value: 7 },
      ],
    },
    transcript: {
      eyebrow: 'Прослушивание звонка',
      title: 'Разговор с клиентом в реальном времени',
      streaming: 'Поток',
      emptyRole: 'Система',
      empty: 'Транскрипт появится здесь после запуска демо.',
      roles: { Customer: 'Клиент', Operator: 'Оператор', AI: 'AI' },
    },
    analysis: {
      eyebrow: 'Live AI анализ',
      title: 'Intent, риск и подсказки',
      intent: 'Intent',
      sentiment: 'Тональность',
      confidence: 'Уверенность',
      risk: 'Риск',
      safeResponse: 'Безопасный ответ AI',
      nextBestOffer: 'Следующее лучшее предложение',
      criticalRisk: 'Критический риск',
    },
    compliance: {
      eyebrow: 'Compliance правила',
      alertEyebrow: 'Compliance предупреждение',
      noAlertTitle: 'Критического предупреждения нет',
      noAlertBody: 'AI отслеживает запрещенные обещания, незакрытый KYC, опасные запросы данных и рискованные кредитные формулировки.',
      rules: [
        'Никогда не запрашивать PIN, SMS-код, CVV или полный пароль карты.',
        'Никогда не гарантировать одобрение кредита.',
        'Проверить личность перед раскрытием персональных финансовых данных.',
      ],
      safeRewrite: 'Безопасная формулировка',
    },
    kyc: {
      eyebrow: 'KYC чек-лист по кредиту',
      title: 'Обязательно до кредитного решения',
      done: 'Готово',
      missing: 'Не хватает',
      items: [
        ['income', 'Источник дохода запрошен'],
        ['identity', 'Проверка личности'],
        ['purpose', 'Цель кредита'],
        ['consent', 'Согласие на скоринг'],
      ],
    },
    customer: {
      eyebrow: 'Профиль клиента',
      risk: 'Риск',
      age: 'Возраст',
      city: 'Город',
      income: 'Доход',
      segment: 'Сегмент',
      loanEligibility: 'Кредитная возможность',
      activeLoan: 'Активный кредит',
      monthlyPayment: 'Ежемесячный платеж',
      nextPaymentDate: 'Дата следующего платежа',
      values: {
        risk: 'Средний',
        eligibility: 'Условно',
      },
    },
    safeAction: {
      eyebrow: 'Слой безопасных действий',
      title: 'Предустановленные действия оператора',
      visibleResult: 'Видимый результат',
      noResult: 'Безопасное действие еще не выполнено.',
      actions: {
        crmNote: {
          label: 'Создать CRM заметку',
          result: 'CRM заметка создана с кредитным запросом, compliance флагом и пробелами KYC.',
        },
        manager: {
          label: 'Эскалировать менеджеру',
          result: 'Эскалация менеджеру подготовлена из-за запрещенного обещания по кредиту.',
        },
        followUp: {
          label: 'Отправить follow-up',
          result: 'Follow-up поставлен в очередь с безопасной кредитной формулировкой и напоминаниями KYC.',
        },
      },
    },
    audit: {
      eyebrow: 'Audit Log',
      title: 'Понятная история событий',
      events: 'событий',
      ready: 'Готово',
      empty: 'Запустите демо, чтобы заполнить аудит.',
      labels: {
        call_started: 'Звонок начался',
        customer_message: 'Сообщение клиента',
        operator_message: 'Сообщение оператора',
        compliance_violation_detected: 'Нарушение compliance найдено',
        ai_rewrite_suggested: 'AI предложил безопасную формулировку',
        kyc_update: 'KYC обновлен',
        recommendation_generated: 'Рекомендация создана',
        crm_summary_created: 'CRM итог создан',
        safe_action_executed: 'Безопасное действие выполнено',
      },
    },
    unknown: {
      eyebrow: 'Unknown Calls Cluster',
      title: 'Обучение на новых паттернах звонков',
      demoButton: 'Не могу войти в приложение',
      demoMessage: 'Не могу войти в приложение',
      demoLabel: 'Демо сообщение',
      initialLabel: 'Первая классификация',
      clusterLabel: 'Кластер',
      insightTitle: 'Инсайт',
      initialLearning: {
        message: 'Не могу войти в приложение',
        initial: 'Не проверено',
        cluster: 'Кластера пока нет',
        insight: 'Нажмите демо сообщение, чтобы создать новый паттерн проблем мобильного приложения.',
      },
      detecting: 'Определяется...',
      captured: 'Unknown сообщение захвачено для кластеризации.',
      pattern: 'Новый паттерн найден: Mobile App Issues',
      recommendation: 'Подготовить переиспользуемый скрипт поддержки SQB Mobile.',
      response: 'Проблема SQB Mobile добавлена в кластер. Оператор проверит версию приложения, интернет-соединение и зарегистрированный номер телефона.',
      audit: 'Новый паттерн найден: Mobile App Issues. Аналитика спроса обновлена.',
    },
    voice: {
      eyebrow: 'Голосовая симуляция',
      title: 'Управление речью',
      start: 'Начать Voice',
      stop: 'Остановить Voice',
      speak: 'Озвучить ответ AI',
      analyze: 'Анализ',
      placeholder: 'Введите или продиктуйте сообщение клиента...',
      ready: 'Voice ready',
      listening: 'Listening...',
      unsupported: 'SpeechRecognition не поддерживается в этом браузере. Используйте текстовое поле.',
      failed: 'Voice recognition failed. Text input still works.',
      stopped: 'Voice stopped. Text input is available.',
      captured: 'Voice transcript captured',
    },
    crm: {
      eyebrow: 'CRM итог',
      title: 'Заметка по итогам звонка',
      empty: 'CRM итог будет создан автоматически в конце демо.',
    },
    why: {
      eyebrow: 'Почему это важно',
      title: 'Автоматизация там, где это безопасно',
      text: '20-35% звонков повторяются и могут быть автоматизированы. Остальные звонки анализируются, кластеризуются и используются для улучшения скриптов, продуктов и AI категорий.',
    },
    emptyAnalysis: {
      intent: 'Ожидаем клиента',
      sentiment: 'Не начато',
      confidence: 0,
      response: 'Запустите ультрабыстрое демо, чтобы увидеть live intent detection, compliance monitoring и CRM результат.',
      recommendation: 'Рекомендаций пока нет.',
      risk: 'Нормальный',
    },
    exportResult: {
      withEvents: (count) => `Отчет подготовлен с ${count} audit событиями и текущим CRM итогом.`,
      empty: 'Шаблон отчета подготовлен. Запустите демо, чтобы добавить audit события.',
    },
  },
}

const SCENARIO = {
  uz: {
    forbiddenPhrases: ['100% tasdiqlanadi', "hujjatsiz ham bo'ladi"],
    customerLoanRequest: "Assalomu alaykum, menga kredit kerak edi. 30 million so'm olsam bo'ladimi?",
    operatorMistake: "Ha, albatta, sizga 100% tasdiqlanadi, hujjatsiz ham bo'ladi",
    customerTermsQuestion: "Foizlari qancha va qachon to'lashim kerak?",
    safeRewrite: 'Kredit tasdiqlanishi bank skoring tizimi, hujjatlar va bank siyosati asosida amalga oshiriladi.',
    nextBestOffer: "Kredit karta yoki past foizli iste'mol krediti tavsiya qilinadi.",
    crmSummary: "Mijoz 30 mln so'm kredit haqida so'radi. Operator noto'g'ri va'da berdi. AI xavfsiz formulirovkani taklif qildi. KYC savollar to'liq yopilmadi. Mijoz foiz va to'lov sanasi haqida qo'shimcha ma'lumot so'radi.",
    alert: {
      title: 'CRITICAL RISK',
      message: "Operator taqiqlangan va'da ishlatdi",
    },
    analysis: {
      loanRequest: {
        intent: "Kredit so'rovi",
        sentiment: 'Neytral',
        confidence: 95,
        response: "Mijoz kredit olish imkoniyatini so'radi. Operator kredit tasdiqlanishi skoring va hujjatlarga bog'liqligini tushuntirishi kerak.",
        recommendation: 'Daromad, kredit maqsadi, shaxsni tasdiqlash va skoring roziligi avval yopilishi kerak.',
        risk: "O'rtacha",
      },
      terms: {
        intent: 'Kredit shartlari',
        sentiment: 'Neytral',
        confidence: 92,
        response: "Foiz stavkasi va to'lov jadvali kredit turi, muddat, skoring natijasi va bank siyosatiga bog'liq. Tasdiqdan oldin barcha shartlar mijozga aniq tushuntiriladi.",
        risk: "O'rtacha",
      },
      manualTerms: {
        intent: 'Kredit shartlari',
        sentiment: 'Neytral',
        confidence: 92,
        response: "Foiz va to'lov jadvali kredit turi, skoring va hujjatlarga bog'liq. Tasdiq kafolatlanmaydi.",
        risk: "O'rtacha",
      },
      manualCredit: {
        intent: "Kredit so'rovi",
        sentiment: 'Neytral',
        confidence: 95,
        recommendation: 'Kredit imkoniyatini muhokama qilishdan oldin KYC va skoring roziligini yakunlang.',
        risk: "O'rtacha",
      },
      unknown: {
        intent: 'Unknown',
        sentiment: 'Neytral',
        confidence: 48,
        response: "Bu murojaat yangi kategoriya sifatida ko'rib chiqiladi va operator javobi asosida klasterga qo'shiladi.",
        recommendation: "Supervisor review va learning queue'ga yo'naltiring.",
        risk: "Ko'rib chiqish",
      },
      unknownFirst: {
        intent: 'Unknown',
        sentiment: 'Neytral',
        confidence: 41,
        response: "AI bu murojaatni avval unknown deb belgiladi va o'xshash murojaatlar bilan solishtirmoqda.",
        recommendation: 'Similarity checkdan keyin klasterlash.',
        risk: "Ko'rib chiqish",
      },
    },
    audit: {
      started: 'Ultra tez kredit qo‘ng‘irog‘i demosi boshlandi.',
      phrases: "Taqiqlangan iboralar aniqlandi: 100% tasdiqlanadi; hujjatsiz ham bo'ladi.",
      kyc: "Daromad manbasi so'raldi: bajarildi. Shaxsni tasdiqlash, kredit maqsadi va skoring roziligi: yetishmaydi.",
      crm: "Compliance xavfi va to'liq yopilmagan KYC bilan CRM xulosa yaratildi.",
    },
  },
  ru: {
    forbiddenPhrases: ['100% одобрят', 'без документов'],
    customerLoanRequest: 'Здравствуйте, мне нужен кредит. Можно взять 30 миллионов сумов?',
    operatorMistake: 'Да, конечно, вам 100% одобрят, можно и без документов',
    customerTermsQuestion: 'Какие проценты и когда нужно платить?',
    safeRewrite: 'Одобрение кредита проводится на основе скоринговой системы банка, документов и банковской политики.',
    nextBestOffer: 'Рекомендуется кредитная карта или потребительский кредит с низкой процентной ставкой.',
    crmSummary: 'Клиент спросил о кредите на 30 млн сумов. Оператор дал некорректное обещание. AI предложил безопасную формулировку. KYC вопросы закрыты не полностью. Клиент дополнительно спросил о процентах и дате платежа.',
    alert: {
      title: 'КРИТИЧЕСКИЙ РИСК',
      message: 'Обнаружено запрещенное обещание оператора',
    },
    analysis: {
      loanRequest: {
        intent: 'Запрос кредита',
        sentiment: 'Нейтральный',
        confidence: 95,
        response: 'Клиент спросил о возможности получить кредит. Оператор должен объяснить, что одобрение зависит от скоринга и документов.',
        recommendation: 'До обсуждения решения нужно закрыть доход, цель кредита, проверку личности и согласие на скоринг.',
        risk: 'Средний',
      },
      terms: {
        intent: 'Условия кредита',
        sentiment: 'Нейтральный',
        confidence: 92,
        response: 'Процентная ставка и график платежей зависят от типа кредита, срока, результата скоринга и политики банка. До подтверждения клиенту нужно ясно объяснить все условия.',
        risk: 'Средний',
      },
      manualTerms: {
        intent: 'Условия кредита',
        sentiment: 'Нейтральный',
        confidence: 92,
        response: 'Проценты и график платежей зависят от типа кредита, скоринга и документов. Одобрение не гарантируется.',
        risk: 'Средний',
      },
      manualCredit: {
        intent: 'Запрос кредита',
        sentiment: 'Нейтральный',
        confidence: 95,
        recommendation: 'Завершите KYC и согласие на скоринг перед обсуждением кредитной возможности.',
        risk: 'Средний',
      },
      unknown: {
        intent: 'Unknown',
        sentiment: 'Нейтральный',
        confidence: 48,
        response: 'Это обращение будет рассмотрено как новая категория и добавлено в кластер на основе ответа оператора.',
        recommendation: 'Направить в supervisor review и очередь обучения.',
        risk: 'Проверка',
      },
      unknownFirst: {
        intent: 'Unknown',
        sentiment: 'Нейтральный',
        confidence: 41,
        response: 'AI сначала отметил это обращение как unknown и сравнивает его с похожими запросами.',
        recommendation: 'Кластеризовать после similarity check.',
        risk: 'Проверка',
      },
    },
    audit: {
      started: 'Ультрабыстрое демо кредитного звонка началось.',
      phrases: 'Обнаружены запрещенные фразы: 100% одобрят; без документов.',
      kyc: 'Источник дохода запрошен: готово. Проверка личности, цель кредита и согласие на скоринг: не хватает.',
      crm: 'CRM итог создан с compliance риском и незакрытым KYC чек-листом.',
    },
  },
}

function useUi() {
  return useContext(UiTextContext) || UI_TEXT.uz
}

function cloneDemandData(language) {
  return UI_TEXT[language].demand.items.map((item) => ({ ...item }))
}

function initialKycChecklist(language) {
  return UI_TEXT[language].kyc.items.map(([key, label]) => ({ key, label, status: 'missing' }))
}

function initialUnknownLearning(language) {
  return { ...UI_TEXT[language].unknown.initialLearning }
}

function initialAnalysis(language) {
  return { ...UI_TEXT[language].emptyAnalysis }
}

function formatDuration(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')
  return `${mins}:${secs}`
}

function Header({ callStatus, elapsedSeconds, demoRunning, language, onLanguageChange, onRunDemo, onReset, onExport }) {
  const t = useUi()

  return (
    <header className="top-header">
      <div>
        <p className="eyebrow">{t.headerEyebrow}</p>
        <h1>SQB Call Intelligence AI</h1>
        <span>{t.headerSubtitle}</span>
      </div>
      <div className="header-actions">
        <div className="language-switch" aria-label="Language switch">
          {['uz', 'ru'].map((item) => (
            <button className={language === item ? 'active' : ''} key={item} type="button" onClick={() => onLanguageChange(item)}>
              {item.toUpperCase()}
            </button>
          ))}
        </div>
        <span className={`live-status ${callStatus === t.callStatus.live ? 'is-live' : ''}`}>
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

function Sidebar({ activeNav, onSelect }) {
  const t = useUi()

  return (
    <aside className="sidebar">
      <div className="brand-mark">SQB</div>
      {navItems.map(([key, labelKey]) => (
        <button className={activeNav === key ? 'active' : ''} key={key} type="button" onClick={() => onSelect(key)}>
          {t.nav[labelKey]}
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
  const t = useUi()

  return (
    <section className="card wide-card">
      <div className="section-title">
        <div>
          <p className="eyebrow">{t.demand.eyebrow}</p>
          <h2>{t.demand.title}</h2>
        </div>
        <strong>{t.demand.mix}</strong>
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
        <b>{t.demand.insightTitle}</b>
        <p>{t.demand.insight}</p>
      </div>
    </section>
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

function AnalysisPanel({ analysis, complianceAlert, nextOffer }) {
  const t = useUi()

  return (
    <section className="card">
      <div className="section-title">
        <div>
          <p className="eyebrow">{t.analysis.eyebrow}</p>
          <h2>{t.analysis.title}</h2>
        </div>
        <span className={`risk-pill ${complianceAlert ? 'risk-critical' : ''}`}>
          {complianceAlert ? t.analysis.criticalRisk : analysis.risk}
        </span>
      </div>
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
      <div className="recommended-action">
        <b>{t.analysis.nextBestOffer}</b>
        <p>{nextOffer || analysis.recommendation}</p>
      </div>
    </section>
  )
}

function ComplianceAlert({ complianceAlert }) {
  const t = useUi()

  if (!complianceAlert) {
    return (
      <section className="card">
        <p className="eyebrow">{t.compliance.eyebrow}</p>
        <h2>{t.compliance.noAlertTitle}</h2>
        <p className="body-copy">{t.compliance.noAlertBody}</p>
        <ul className="guardrail-list">
          {t.compliance.rules.map((rule) => <li key={rule}>{rule}</li>)}
        </ul>
      </section>
    )
  }

  return (
    <section className="card compliance-card critical">
      <p className="eyebrow">{t.compliance.alertEyebrow}</p>
      <h2>{complianceAlert.title}</h2>
      <strong>{complianceAlert.message}</strong>
      <div className="phrase-list">
        {complianceAlert.phrases.map((phrase) => <span key={phrase}>{phrase}</span>)}
      </div>
      <div className="safe-rewrite">
        <b>{t.compliance.safeRewrite}</b>
        <p>{complianceAlert.safeRewrite}</p>
      </div>
    </section>
  )
}

function KycChecklist({ checklist }) {
  const t = useUi()

  return (
    <section className="card">
      <p className="eyebrow">{t.kyc.eyebrow}</p>
      <h2>{t.kyc.title}</h2>
      <div className="checklist">
        {checklist.map((item) => (
          <article className={item.status === 'done' ? 'done' : 'missing'} key={item.key}>
            <span>{item.label}</span>
            <b>{item.status === 'done' ? t.kyc.done : t.kyc.missing}</b>
          </article>
        ))}
      </div>
    </section>
  )
}

function CustomerProfile() {
  const t = useUi()

  return (
    <section className="card profile-card">
      <div className="section-title">
        <div>
          <p className="eyebrow">{t.customer.eyebrow}</p>
          <h2>{customerProfile.name}</h2>
        </div>
        <span className="risk-pill">{t.customer.risk}: {t.customer.values.risk}</span>
      </div>
      <div className="profile-grid">
        <span>{t.customer.age}<b>{customerProfile.age}</b></span>
        <span>{t.customer.city}<b>{customerProfile.city}</b></span>
        <span>{t.customer.income}<b>{customerProfile.income}</b></span>
        <span>{t.customer.segment}<b>{customerProfile.segment}</b></span>
        <span>{t.customer.loanEligibility}<b>{t.customer.values.eligibility}</b></span>
        <span>{t.customer.activeLoan}<b>{customerProfile.activeLoan}</b></span>
        <span>{t.customer.monthlyPayment}<b>{customerProfile.monthlyPayment}</b></span>
        <span>{t.customer.nextPaymentDate}<b>{customerProfile.nextPaymentDate}</b></span>
      </div>
    </section>
  )
}

function SafeActionLayer({ onAction, safeActionResult }) {
  const t = useUi()

  return (
    <section className="card">
      <p className="eyebrow">{t.safeAction.eyebrow}</p>
      <h2>{t.safeAction.title}</h2>
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

function AuditLog({ auditLog }) {
  const t = useUi()

  return (
    <section className="card audit-card">
      <div className="section-title">
        <div>
          <p className="eyebrow">{t.audit.eyebrow}</p>
          <h2>{t.audit.title}</h2>
        </div>
        <strong>{auditLog.length} {t.audit.events}</strong>
      </div>
      <div className="audit-list">
        {auditLog.length === 0 ? (
          <article>
            <span>{t.audit.ready}</span>
            <p>{t.audit.empty}</p>
          </article>
        ) : auditLog.map((item) => (
          <article key={item.id}>
            <time>{item.time}</time>
            <span>{t.audit.labels[item.type]}</span>
            <p>{item.detail}</p>
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
      <div className="section-title">
        <div>
          <p className="eyebrow">{t.unknown.eyebrow}</p>
          <h2>{t.unknown.title}</h2>
        </div>
        <button className="secondary-button" type="button" onClick={onRunUnknownDemo}>
          {t.unknown.demoButton}
        </button>
      </div>
      <div className="unknown-grid">
        <span>{t.unknown.demoLabel}<b>{unknownLearning.message}</b></span>
        <span>{t.unknown.initialLabel}<b>{unknownLearning.initial}</b></span>
        <span>{t.unknown.clusterLabel}<b>{unknownLearning.cluster}</b></span>
      </div>
      <div className="insight-card">
        <b>{t.unknown.insightTitle}</b>
        <p>{unknownLearning.insight}</p>
      </div>
    </section>
  )
}

function VoicePanel({ input, setInput, voiceStatus, isListening, onAnalyze, onStartVoice, onStopVoice, onSpeak }) {
  const t = useUi()

  return (
    <section className="card">
      <div className="section-title">
        <div>
          <p className="eyebrow">{t.voice.eyebrow}</p>
          <h2>{t.voice.title}</h2>
        </div>
        <span className={`voice-status ${isListening ? 'is-listening' : ''}`}>{voiceStatus}</span>
      </div>
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

function CrmSummary({ crmSummary, exportStatus }) {
  const t = useUi()

  return (
    <section className="card">
      <p className="eyebrow">{t.crm.eyebrow}</p>
      <h2>{t.crm.title}</h2>
      <p className="summary-box">{crmSummary || t.crm.empty}</p>
      {exportStatus ? <div className="success-note">{exportStatus}</div> : null}
    </section>
  )
}

function WhyMatters() {
  const t = useUi()

  return (
    <section className="card why-card">
      <p className="eyebrow">{t.why.eyebrow}</p>
      <h2>{t.why.title}</h2>
      <p>{t.why.text}</p>
    </section>
  )
}

function App() {
  const [language, setLanguage] = useState("uz")
  const [activeNav, setActiveNav] = useState('live')
  const [messages, setMessages] = useState([])
  const [analysis, setAnalysis] = useState(() => initialAnalysis('uz'))
  const [complianceAlert, setComplianceAlert] = useState(null)
  const [kycChecklist, setKycChecklist] = useState(() => initialKycChecklist('uz'))
  const [nextOffer, setNextOffer] = useState('')
  const [crmSummary, setCrmSummary] = useState('')
  const [safeActionResult, setSafeActionResult] = useState('')
  const [auditLog, setAuditLog] = useState([])
  const [demandData, setDemandData] = useState(() => cloneDemandData('uz'))
  const [unknownLearning, setUnknownLearning] = useState(() => initialUnknownLearning('uz'))
  const [input, setInput] = useState('')
  const [voiceStatus, setVoiceStatus] = useState(UI_TEXT.uz.voice.ready)
  const [isListening, setIsListening] = useState(false)
  const [callStatus, setCallStatus] = useState(UI_TEXT.uz.callStatus.standby)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [demoRunning, setDemoRunning] = useState(false)
  const [exportStatus, setExportStatus] = useState('')
  const timeoutsRef = useRef([])
  const recognitionRef = useRef(null)
  const idRef = useRef(1)
  const t = UI_TEXT[language]
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
    setCrmSummary('')
    setSafeActionResult('')
    setAuditLog([])
    setDemandData(cloneDemandData(nextLanguage))
    setUnknownLearning(initialUnknownLearning(nextLanguage))
    setInput('')
    setVoiceStatus(UI_TEXT[nextLanguage].voice.ready)
    setIsListening(false)
    setCallStatus(UI_TEXT[nextLanguage].callStatus.standby)
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
    setCallStatus(t.callStatus.live)
    setElapsedSeconds(0)
    setDemoRunning(true)
    addAudit('call_started', scenario.audit.started)

    scheduleStep(() => {
      addMessage('Customer', scenario.customerLoanRequest)
      setAnalysis(scenario.analysis.loanRequest)
      addAudit('customer_message', scenario.customerLoanRequest)
    }, 800)

    scheduleStep(() => {
      addMessage('Operator', scenario.operatorMistake)
      setComplianceAlert({
        title: scenario.alert.title,
        message: scenario.alert.message,
        phrases: scenario.forbiddenPhrases,
        safeRewrite: scenario.safeRewrite,
      })
      setKycChecklist((current) => current.map((item) => (
        item.key === 'income' ? { ...item, status: 'done' } : { ...item, status: 'missing' }
      )))
      addAudit('operator_message', scenario.operatorMistake)
      addAudit('compliance_violation_detected', scenario.audit.phrases)
      addAudit('ai_rewrite_suggested', scenario.safeRewrite)
      addAudit('kyc_update', scenario.audit.kyc)
    }, 1800)

    scheduleStep(() => {
      addMessage('AI', scenario.safeRewrite)
    }, 2700)

    scheduleStep(() => {
      addMessage('Customer', scenario.customerTermsQuestion)
      setAnalysis({ ...scenario.analysis.terms, recommendation: scenario.nextBestOffer })
      setNextOffer(scenario.nextBestOffer)
      addAudit('customer_message', scenario.customerTermsQuestion)
      addAudit('recommendation_generated', scenario.nextBestOffer)
    }, 3700)

    scheduleStep(() => {
      setCrmSummary(scenario.crmSummary)
      setCallStatus(t.callStatus.summary)
      setDemoRunning(false)
      addAudit('crm_summary_created', scenario.audit.crm)
    }, 4900)
  }

  function analyzeManualMessage(text) {
    const clean = text.trim()
    if (!clean) return

    const normalized = clean.toLowerCase()
    if (normalized.includes('ilova') || normalized.includes('kira olmayapman') || normalized.includes('прилож') || normalized.includes('войти')) {
      setInput('')
      runUnknownCallsDemo(clean)
      return
    }

    addMessage('Customer', clean)
    addAudit('customer_message', clean)
    setInput('')

    if (normalized.includes('foiz') || normalized.includes("to'lash") || normalized.includes('процент') || normalized.includes('платить')) {
      setAnalysis({ ...scenario.analysis.manualTerms, recommendation: scenario.nextBestOffer })
      setNextOffer(scenario.nextBestOffer)
      addAudit('recommendation_generated', scenario.nextBestOffer)
      return
    }

    if (normalized.includes('kredit') || normalized.includes('кредит')) {
      setAnalysis({ ...scenario.analysis.manualCredit, response: scenario.safeRewrite })
      return
    }

    setAnalysis(scenario.analysis.unknown)
  }

  function runUnknownCallsDemo(message = t.unknown.demoMessage) {
    addMessage('Customer', message)
    addAudit('customer_message', message)
    setAnalysis(scenario.analysis.unknownFirst)
    setUnknownLearning({
      message,
      initial: 'Unknown',
      cluster: t.unknown.detecting,
      insight: t.unknown.captured,
    })

    scheduleStep(() => {
      setUnknownLearning({
        message,
        initial: 'Unknown',
        cluster: 'Mobile App Issues',
        insight: t.unknown.pattern,
      })
      setDemandData((current) => current.map((item) => {
        if (item.key === 'mobile-app') return { ...item, value: item.value + 1 }
        if (item.key === 'unknown') return { ...item, value: Math.max(item.value - 1, 0) }
        return item
      }))
      setAnalysis({
        intent: 'Mobile App Issues',
        sentiment: scenario.analysis.loanRequest.sentiment,
        confidence: 88,
        response: t.unknown.response,
        recommendation: t.unknown.recommendation,
        risk: t.riskNormal,
      })
      addAudit('recommendation_generated', t.unknown.audit)
    }, 900)
  }

  function executeSafeAction(actionKey) {
    const action = t.safeAction.actions[actionKey]
    if (!action) return
    setSafeActionResult(action.result)
    addAudit('safe_action_executed', action.result)
  }

  function exportReport() {
    const result = auditLog.length
      ? t.exportResult.withEvents(auditLog.length)
      : t.exportResult.empty
    setExportStatus(result)
    addAudit('safe_action_executed', result)
  }

  function startVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setVoiceStatus(t.voice.unsupported)
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
        setVoiceStatus(t.voice.listening)
      }
      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript || ''
        if (transcript) {
          setInput(transcript)
          addMessage('Customer', transcript)
          addAudit('customer_message', `${t.voice.captured}: ${transcript}`)
        }
      }
      recognition.onerror = () => {
        setVoiceStatus(t.voice.failed)
        setIsListening(false)
      }
      recognition.onend = () => {
        setIsListening(false)
        setVoiceStatus(t.voice.ready)
      }
      recognitionRef.current = recognition
      recognition.start()
    } catch {
      setVoiceStatus(t.voice.failed)
      setIsListening(false)
    }
  }

  function stopVoice() {
    try {
      if (recognitionRef.current) recognitionRef.current.stop()
    } catch {
      setVoiceStatus(t.voice.failed)
    }
    setIsListening(false)
    setVoiceStatus(t.voice.stopped)
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
    if (callStatus !== t.callStatus.live) return undefined
    const intervalId = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1)
    }, 1000)
    return () => window.clearInterval(intervalId)
  }, [callStatus, t.callStatus.live])

  useEffect(() => () => {
    timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
    if (recognitionRef.current) recognitionRef.current.abort()
  }, [])

  return (
    <UiTextContext.Provider value={t}>
      <div className="app-shell">
        <Sidebar activeNav={activeNav} onSelect={setActiveNav} />
        <main className="workspace">
          <Header
            callStatus={callStatus}
            elapsedSeconds={elapsedSeconds}
            demoRunning={demoRunning}
            language={language}
            onLanguageChange={handleLanguageChange}
            onRunDemo={runUltraFastDemo}
            onReset={() => resetDemoState(language)}
            onExport={exportReport}
          />

          <section className="overview-grid">
            {t.stats.map(([label, value, detail], index) => {
              const statValue = value
                || (index === 2 ? (analysis.confidence ? `${analysis.confidence}%` : t.ready) : null)
                || (index === 3 ? (complianceAlert ? t.critical : t.clear) : null)
                || (index === 5 ? t.customer.values.eligibility : t.ready)
              const statDetail = index === 2 ? analysis.intent : detail
              return <StatCard detail={statDetail} key={label} label={label} value={statValue} />
            })}
          </section>

          <section className="main-grid">
            <div className="left-column">
              <DemandAnalytics demandData={demandData} />

              <section className="card">
                <div className="section-title">
                  <div>
                    <p className="eyebrow">{t.transcript.eyebrow}</p>
                    <h2>{t.transcript.title}</h2>
                  </div>
                  <span className="listening-pill">{demoRunning ? t.transcript.streaming : t.ready}</span>
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
    </UiTextContext.Provider>
  )
}

export default App
