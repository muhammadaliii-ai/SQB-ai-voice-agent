import { useEffect, useRef, useState } from 'react'
import './App.css'

const speechLangMap = {
  uz: 'uz-UZ',
  ru: 'ru-RU',
  en: 'en-US',
}

const t = {
  uz: {
    headerEyebrow: 'SQB bank boshqaruv paneli',
    headerSubtitle: "Real vaqt operator konsoli, compliance nazorati, KYC/AML tekshiruvlari va qo'ng'iroqdan keyingi CRM xulosa.",
    runDemo: 'Ultra tez demoni ishga tushirish',
    demoRunning: 'Demo ishlayapti...',
    reset: 'Qayta boshlash',
    export: 'Hisobot',
    status: {
      standby: 'Kutish',
      live: "Jonli qo'ng'iroq",
      summary: 'Xulosa tayyor',
      ready: 'Tayyor',
      streaming: 'Oqimda',
      clear: 'Toza',
      critical: 'Kritik',
      voiceReady: 'Tayyor',
      listening: 'Tinglanmoqda',
      generating: 'Ovoz tayyorlanmoqda',
      speaking: 'Gapirilmoqda',
      unavailable: 'Ovoz mavjud emas',
      review: "Ko'rib chiqish",
    },
    sections: {
      console: 'Real vaqt operator konsoli',
      compliance: 'Compliance qoidalari',
      kyc: 'KYC / AML ro‘yxati',
      offer: 'Keyingi eng yaxshi taklif',
      objection: 'Jonli e’tirozlar bilan ishlash',
      summary: "Qo'ng'iroqdan keyingi xulosa",
      backend: 'Backend holati',
      audit: 'Audit jurnali',
      safeAction: 'Xavfsiz amallar qatlami',
      analytics: 'Talab analitikasi',
      unknown: 'Noma’lum qo‘ng‘iroqlar klasteri',
      customer: 'Mijoz profili',
      voice: 'Ovoz simulyatsiyasi',
      why: 'Nima uchun muhim',
    },
    sectionCopy: {
      console: "Suhbat matni, timer, intent va operatorga yo'l-yo'riq bitta joyda.",
      compliance: "Kredit va'dalari, maxfiy ma'lumot so'rovlari va xavfli skriptlar nazorat qilinadi.",
      kyc: 'Kredit qaroridan oldin zarur KYC va AML qadamlari.',
      offer: "Suhbatdan kelib chiqqan xavfsiz mahsulot tavsiyasi.",
      objection: 'Mijoz savoli tasdiqlangan javob skriptiga aylantiriladi.',
      summary: 'CRM uchun tayyor qisqa xulosa.',
      backend: 'Mahalliy demo stack va intranet rejimi.',
      audit: "Supervisor ko'rishi uchun o'qiladigan hodisalar tarixi.",
      safeAction: 'Faqat oldindan tasdiqlangan amallar bajariladi.',
      analytics: "Bugun eng ko'p sabab: kredit to'lov sanasi. Avtomatik IVR/AI javob tavsiya qilinadi.",
      unknown: "Yangi qo'ng'iroqlar mahsulot va skriptlarni yaxshilash uchun klasterlanadi.",
      voice: 'TTS backend ishlamasa ham brauzer ovozi shu matnni o‘qiydi.',
    },
    stats: [
      ["Bugungi qo'ng'iroqlar", '1,284', 'SQB kontakt markazi hajmi'],
      ["Takroriy qo'ng'iroqlar", '20-35%', 'Avtomatlashtirish mumkin bo‘lgan diapazon'],
      ['Intent aniqligi', null, 'Joriy aniqlangan mavzu'],
      ['Compliance holati', null, 'Kredit va karta xavfsizlik qoidalari'],
      ["O'rganish navbati", '7%', 'Noma’lum yoki yangi talablar'],
      ['Eligibility signali', 'Shartli', "Xavf: O'rtacha"],
    ],
    nav: ['Jonli konsol', 'Compliance', 'KYC / AML', 'Taklif', 'Audit'],
    transcript: {
      emptyRole: 'Tizim',
      empty: "Demoni ishga tushirsangiz transcript shu yerda ko'rinadi.",
      roles: { Customer: 'Mijoz', Operator: 'Operator', AI: 'AI' },
    },
    analysis: {
      intent: 'Maqsad',
      sentiment: 'Sentiment',
      confidence: 'Ishonch',
      risk: 'Xavf',
      safeResponse: 'AI xavfsiz javobi',
    },
    compliance: {
      noAlertTitle: "Kritik ogohlantirish yo'q",
      noAlertBody: "AI taqiqlangan va'dalar, to'liq yopilmagan KYC, xavfli ma'lumot so'rovlari va kredit bo'yicha riskli iboralarni kuzatadi.",
      alertEyebrow: 'Compliance ogohlantirish',
      safeRewrite: 'Xavfsiz formulirovka',
      rules: [
        'PIN, SMS kod, CVV yoki to‘liq karta parolini so‘ramang.',
        'Kredit tasdiqlanishini kafolatlamang.',
        "Shaxsiy moliyaviy ma'lumotdan oldin mijozni tasdiqlang.",
      ],
    },
    kyc: {
      done: 'Bajarildi',
      missing: 'Yetishmaydi',
      items: [
        ['income', "Daromad manbasi so'raldi", 'medium'],
        ['identity', 'Shaxsni tasdiqlash', 'high'],
        ['purpose', 'Kredit maqsadi', 'medium'],
        ['consent', 'Skoring roziligi', 'medium'],
        ['aml', 'AML risk tekshiruvi', 'high'],
      ],
    },
    offer: {
      empty: 'Taklif demo tavsiya bosqichida paydo bo‘ladi.',
      reason: 'Nima uchun',
    },
    objection: {
      emptyTitle: "Hozircha jonli e'tiroz yo'q",
      emptyText: 'Mijoz shartlarni so‘raganda AI tasdiqlangan javobni beradi.',
      customerConcern: 'Mijoz savoli',
      handling: 'Tasdiqlangan javob',
    },
    customer: {
      age: 'Yosh',
      city: 'Shahar',
      income: 'Daromad',
      segment: 'Segment',
      risk: 'Xavf',
      eligibility: 'Kredit imkoniyati',
      activeLoan: 'Faol kredit',
      monthlyPayment: "Oylik to'lov",
      nextPaymentDate: "Keyingi to'lov sanasi",
    },
    safeAction: {
      visibleResult: "Ko'rinadigan natija",
      noResult: 'Hali xavfsiz amal bajarilmadi.',
      actions: {
        crmNote: {
          label: 'CRM izoh yaratish',
          result: "Kredit so'rovi, compliance flag, KYC kamchiliklari va xavfsiz matn bilan CRM izoh yaratildi.",
        },
        manager: {
          label: 'Menejerga eskalatsiya',
          result: "Taqiqlangan kredit va'dasi sabab menejerga eskalatsiya tayyorlandi.",
        },
        followUp: {
          label: 'Follow-up yuborish',
          result: "Xavfsiz kredit matni va KYC eslatmalari bilan follow-up navbatga qo'yildi.",
        },
      },
    },
    audit: {
      events: 'hodisa',
      empty: "Audit jurnalini to'ldirish uchun demoni ishga tushiring.",
      labels: {
        call_started: "Qo'ng'iroq boshlandi",
        transcript_analyzed: 'Transcript tahlil qilindi',
        compliance_violation_detected: 'Compliance buzilishi aniqlandi',
        kyc_updated: 'KYC yangilandi',
        recommendation_generated: 'Tavsiya yaratildi',
        crm_summary_created: 'CRM xulosa yaratildi',
        safe_action_executed: 'Xavfsiz amal bajarildi',
      },
    },
    voice: {
      start: 'Ovozni boshlash',
      stop: "Ovozni to'xtatish",
      speak: 'AI javobini o‘qish',
      analyze: 'Tahlil',
      placeholder: 'Mijoz xabarini yozing yoki ovoz bilan ayting...',
      captured: 'Ovoz transcript olindi',
    },
    backend: {
      server: 'Server ishlayapti',
      localAi: 'Mahalliy AI ishlayapti',
      externalApi: "Tashqi API: yo'q",
      lan: 'LAN/Intranet rejimi',
    },
    unknown: {
      button: 'Ilovaga kira olmayapman',
      demoMessage: 'Ilovaga kira olmayapman',
      initial: 'Noma’lum',
      noCluster: "Hali klaster yo'q",
      detecting: 'Aniqlanmoqda...',
      insight: 'Yangi pattern aniqlandi: Mobile App Issues',
      clusterLabel: 'Klaster',
      insightLabel: 'Insight',
      intent: 'Noma’lum',
    },
    crmEmpty: 'Demo oxirida CRM xulosa avtomatik yaratiladi.',
    aiNotReady: 'AI javobi hali tayyor emas.',
    why: "20-35% qo'ng'iroqlar takroriy va avtomatlashtirilishi mumkin. Qolgan qo'ng'iroqlar tahlil qilinadi, klasterlanadi va skriptlar, mahsulotlar hamda AI kategoriyalarini yaxshilash uchun ishlatiladi.",
    exportEmpty: "Hisobot shabloni tayyor. Audit hodisalarini qo'shish uchun demoni ishga tushiring.",
    exportReady: (count) => `${count} ta audit hodisasi va CRM xulosa bilan hisobot tayyorlandi.`,
  },
  ru: {
    headerEyebrow: 'Панель управления SQB Bank',
    headerSubtitle: 'Консоль оператора в реальном времени, контроль compliance, проверки KYC/AML и CRM итог после звонка.',
    runDemo: 'Запустить ультрабыстрое демо',
    demoRunning: 'Демо выполняется...',
    reset: 'Сброс',
    export: 'Отчет',
    status: {
      standby: 'Ожидание',
      live: 'Активный звонок',
      summary: 'Итог готов',
      ready: 'Готово',
      streaming: 'Поток',
      clear: 'Чисто',
      critical: 'Критично',
      voiceReady: 'Готово',
      listening: 'Слушаю',
      generating: 'Генерация голоса',
      speaking: 'Озвучивание',
      unavailable: 'Голос недоступен',
      review: 'Проверка',
    },
    sections: {
      console: 'Консоль оператора в реальном времени',
      compliance: 'Compliance правила',
      kyc: 'KYC / AML чек-лист',
      offer: 'Следующее лучшее предложение',
      objection: 'Работа с возражениями',
      summary: 'Итог после звонка',
      backend: 'Статус backend',
      audit: 'Audit Log',
      safeAction: 'Слой безопасных действий',
      analytics: 'Аналитика спроса',
      unknown: 'Кластер неизвестных звонков',
      customer: 'Профиль клиента',
      voice: 'Голосовая симуляция',
      why: 'Почему это важно',
    },
    sectionCopy: {
      console: 'Транскрипт, таймер, intent и подсказка оператору в одном месте.',
      compliance: 'Запрещенные обещания, опасные запросы данных и неверные скрипты контролируются здесь.',
      kyc: 'Обязательные KYC и AML шаги до кредитного решения.',
      offer: 'Безопасная продуктовая рекомендация по разговору.',
      objection: 'Вопрос клиента превращается в утвержденный ответ.',
      summary: 'CRM-готовый итог после звонка.',
      backend: 'Локальный демо-стек и режим intranet.',
      audit: 'Понятная история событий для supervisor review.',
      safeAction: 'Можно выполнять только заранее разрешенные действия.',
      analytics: 'Самая частая причина сегодня: дата платежа по кредиту. Рекомендуется автоматический ответ IVR/AI.',
      unknown: 'Новые звонки кластеризуются для улучшения продуктов и скриптов.',
      voice: 'Если TTS backend недоступен, браузер озвучивает тот же текст.',
    },
    stats: [
      ['Звонки сегодня', '1,284', 'Объем контакт-центра SQB'],
      ['Повторяющиеся звонки', '20-35%', 'Диапазон для автоматизации'],
      ['Уверенность intent', null, 'Текущий intent'],
      ['Compliance статус', null, 'Правила безопасности кредитов и карт'],
      ['Очередь обучения', '7%', 'Новые или неизвестные запросы'],
      ['Сигнал eligibility', 'Условно', 'Риск: Средний'],
    ],
    nav: ['Live консоль', 'Compliance', 'KYC / AML', 'Предложение', 'Audit'],
    transcript: {
      emptyRole: 'Система',
      empty: 'Запустите демо, чтобы увидеть transcript.',
      roles: { Customer: 'Клиент', Operator: 'Оператор', AI: 'AI' },
    },
    analysis: {
      intent: 'Интент',
      sentiment: 'Тональность',
      confidence: 'Уверенность',
      risk: 'Риск',
      safeResponse: 'Безопасный ответ AI',
    },
    compliance: {
      noAlertTitle: 'Критического предупреждения нет',
      noAlertBody: 'AI отслеживает запрещенные обещания, незакрытый KYC, опасные запросы данных и рискованные кредитные формулировки.',
      alertEyebrow: 'Compliance предупреждение',
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
    offer: {
      empty: 'Предложение появится на шаге рекомендации.',
      reason: 'Почему это предложение',
    },
    objection: {
      emptyTitle: 'Возражения пока нет',
      emptyText: 'Когда клиент уточнит условия, AI предложит утвержденный ответ.',
      customerConcern: 'Вопрос клиента',
      handling: 'Утвержденный ответ',
    },
    customer: {
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
    safeAction: {
      visibleResult: 'Видимый результат',
      noResult: 'Безопасное действие еще не выполнено.',
      actions: {
        crmNote: {
          label: 'Создать CRM заметку',
          result: 'CRM заметка создана с кредитным запросом, compliance флагом, пробелами KYC и безопасной формулировкой.',
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
      events: 'событий',
      empty: 'Запустите демо, чтобы заполнить audit log.',
      labels: {
        call_started: 'Звонок начался',
        transcript_analyzed: 'Transcript проанализирован',
        compliance_violation_detected: 'Нарушение compliance найдено',
        kyc_updated: 'KYC обновлен',
        recommendation_generated: 'Рекомендация создана',
        crm_summary_created: 'CRM итог создан',
        safe_action_executed: 'Безопасное действие выполнено',
      },
    },
    voice: {
      start: 'Начать Voice',
      stop: 'Остановить Voice',
      speak: 'Озвучить ответ AI',
      analyze: 'Анализ',
      placeholder: 'Введите или продиктуйте сообщение клиента...',
      captured: 'Voice transcript captured',
    },
    backend: {
      server: 'Сервер онлайн',
      localAi: 'Локальный AI онлайн',
      externalApi: 'Внешний API: нет',
      lan: 'LAN/Intranet режим',
    },
    unknown: {
      button: 'Не могу войти в приложение',
      demoMessage: 'Не могу войти в приложение',
      initial: 'Неизвестно',
      noCluster: 'Кластера пока нет',
      detecting: 'Определяется...',
      insight: 'Новый паттерн найден: Mobile App Issues',
      clusterLabel: 'Кластер',
      insightLabel: 'Инсайт',
      intent: 'Неизвестно',
    },
    crmEmpty: 'CRM итог будет создан автоматически в конце демо.',
    aiNotReady: 'Ответ AI ещё не готов.',
    why: '20-35% звонков повторяются и могут быть автоматизированы. Остальные звонки анализируются, кластеризуются и используются для улучшения скриптов, продуктов и AI категорий.',
    exportEmpty: 'Шаблон отчета подготовлен. Запустите демо, чтобы добавить audit события.',
    exportReady: (count) => `Отчет подготовлен с ${count} audit событиями и CRM итогом.`,
  },
  en: {
    headerEyebrow: 'SQB Bank management dashboard',
    headerSubtitle: 'Real-time operator console, compliance monitoring, KYC/AML checks, and post-call CRM summary.',
    runDemo: 'Run Ultra-Fast Demo',
    demoRunning: 'Demo running...',
    reset: 'Reset',
    export: 'Export report',
    status: {
      standby: 'Standby',
      live: 'Live call',
      summary: 'Summary ready',
      ready: 'Ready',
      streaming: 'Streaming',
      clear: 'Clear',
      critical: 'Critical',
      voiceReady: 'Ready',
      listening: 'Listening',
      generating: 'Generating voice',
      speaking: 'Speaking',
      unavailable: 'Voice unavailable',
      review: 'Review',
    },
    sections: {
      console: 'Real-Time Operator Console',
      compliance: 'Compliance Guardrails',
      kyc: 'KYC / AML Checklist',
      offer: 'Next-Best-Offer',
      objection: 'Live Objection Handling',
      summary: 'Post-Call Summary',
      backend: 'Backend Status',
      audit: 'Audit Log',
      safeAction: 'Safe Action Layer',
      analytics: 'Demand Analytics',
      unknown: 'Unknown Calls Cluster',
      customer: 'Customer Profile',
      voice: 'Voice Simulation',
      why: 'Why this matters',
    },
    sectionCopy: {
      console: 'Transcript, timer, intent, and operator guidance in one place.',
      compliance: 'Loan promises, sensitive data requests, and unsafe scripts are monitored here.',
      kyc: 'Required KYC and AML steps before any credit decision.',
      offer: 'A safe product recommendation generated from the conversation.',
      objection: 'Customer concern is converted into an approved response.',
      summary: 'CRM-ready summary created after the call.',
      backend: 'Local demo stack and intranet mode.',
      audit: 'Readable event trail for supervisor review.',
      safeAction: 'Only predefined actions can be executed.',
      analytics: 'Most common reason today: loan payment due date. Recommend adding automatic IVR/AI answer.',
      unknown: 'New calls are clustered into product and script improvement opportunities.',
      voice: 'If the TTS backend is unavailable, browser speech speaks the same text.',
    },
    stats: [
      ['Calls today', '1,284', 'SQB contact center volume'],
      ['Repetitive calls', '20-35%', 'Automation candidate range'],
      ['Intent confidence', null, 'Current detected intent'],
      ['Compliance status', null, 'Loan and card safety rules'],
      ['Learning queue', '7%', 'Unknown or emerging demand'],
      ['Eligibility signal', 'Conditional', 'Risk: Medium'],
    ],
    nav: ['Live Console', 'Compliance', 'KYC / AML', 'Offer', 'Audit'],
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
      noAlertBody: 'AI is listening for prohibited promises, missing KYC, unsafe data requests, and risky loan language.',
      alertEyebrow: 'Compliance alert',
      safeRewrite: 'Safe rewrite',
      rules: [
        'Never ask for PIN, SMS code, CVV, or full card password.',
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
    offer: {
      empty: 'Next-best-offer will appear after the recommendation step.',
      reason: 'Why this offer',
    },
    objection: {
      emptyTitle: 'No live objection yet',
      emptyText: 'When the customer asks about conditions, AI suggests an approved response.',
      customerConcern: 'Customer concern',
      handling: 'Approved handling',
    },
    customer: {
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
    safeAction: {
      visibleResult: 'Visible result',
      noResult: 'No safe action executed yet.',
      actions: {
        crmNote: {
          label: 'Create CRM note',
          result: 'CRM note created with loan request, compliance flag, KYC gaps, and safe wording.',
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
        call_started: 'Call started',
        transcript_analyzed: 'Transcript analyzed',
        compliance_violation_detected: 'Compliance violation detected',
        kyc_updated: 'KYC updated',
        recommendation_generated: 'Recommendation generated',
        crm_summary_created: 'CRM summary created',
        safe_action_executed: 'Safe action executed',
      },
    },
    voice: {
      start: 'Start Voice',
      stop: 'Stop Voice',
      speak: 'Speak AI Response',
      analyze: 'Analyze',
      placeholder: 'Type or dictate a customer message...',
      captured: 'Voice transcript captured',
    },
    backend: {
      server: 'Server Online',
      localAi: 'Local AI Online',
      externalApi: 'External API: No',
      lan: 'LAN/Intranet mode',
    },
    unknown: {
      button: 'I cannot log in to the app',
      demoMessage: 'I cannot log in to the app',
      initial: 'Unknown',
      noCluster: 'No cluster yet',
      detecting: 'Detecting...',
      insight: 'New pattern detected: Mobile App Issues',
      clusterLabel: 'Cluster',
      insightLabel: 'Insight',
      intent: 'Unknown',
    },
    crmEmpty: 'CRM summary will be created automatically at the end of the demo.',
    aiNotReady: 'AI response is not ready yet.',
    why: '20-35% of calls are repetitive and can be automated. Remaining calls are analyzed, clustered, and used to improve scripts, products, and AI categories.',
    exportEmpty: 'Report shell prepared. Run the demo to include audit events.',
    exportReady: (count) => `Report prepared with ${count} audit events and the CRM summary.`,
  },
}

const navKeys = ['console', 'compliance', 'kyc', 'offer', 'audit']

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

const scenario = {
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
    alertTitle: 'KRITIK XAVF',
    alertMessage: "Operator taqiqlangan va'da ishlatdi",
    loanIntent: "Kredit so'rovi",
    termsIntent: 'Kredit shartlari',
    suspiciousIntent: 'Shubhali karta operatsiyasi',
    mobileIntent: 'SQB Mobile / login muammosi',
    sentiment: 'Neytral',
    worried: 'Xavotirli',
    riskMedium: "O'rtacha",
    riskHigh: 'Yuqori',
    loanResponse: "Mijoz kredit olish imkoniyatini so'radi. Operator kredit tasdiqlanishi skoring va hujjatlarga bog'liqligini tushuntirishi kerak.",
    termsResponse: "Foiz stavkasi va to'lov jadvali kredit turi, muddat, skoring natijasi va bank siyosatiga bog'liq. Tasdiqdan oldin barcha shartlar mijozga aniq tushuntiriladi.",
    suspiciousResponse: 'Xavfsizlik uchun avval shaxsni tasdiqlaymiz, kartani vaqtincha bloklaymiz, dispute ariza ochamiz va PIN/SMS/CVV ulashmaslikni eslatamiz.',
    mobileResponse: "SQB Mobile login muammosi aniqlandi. Operator ilova versiyasi, internet aloqasi, SMS yetib kelishi va ro'yxatdan o'tgan telefon raqamini tekshiradi.",
    unknownResponse: "Murojaat supervisor review uchun learning queue'ga qo'shiladi.",
    audit: {
      started: 'Ultra tez demo boshlandi.',
      analyzedLoan: "Transcript tahlil qilindi: 30 mln so'm kredit so'rovi, intent Kredit so'rovi, ishonch 95%.",
      violation: "Taqiqlangan iboralar aniqlandi: 100% tasdiqlanadi; hujjatsiz ham bo'ladi.",
      kyc: 'KYC/AML yangilandi: daromad manbasi bajarildi; shaxs, kredit maqsadi, skoring roziligi va AML tekshiruvi yetishmaydi.',
      analyzedTerms: "Transcript tahlil qilindi: mijoz foiz va to'lov vaqtini so'radi.",
      recommendation: "Tavsiya yaratildi: kredit karta yoki past foizli iste'mol krediti.",
      crm: "CRM xulosa compliance xavfi, xavfsiz formulirovka va to'liq yopilmagan KYC/AML bilan yaratildi.",
      safeAction: "Xavfsiz amal bajarildi: supervisor review uchun CRM izoh avtomatik yaratildi.",
      unknown: 'Yangi pattern aniqlandi: Mobile App Issues. Talab analitikasi yangilandi.',
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
    alertTitle: 'КРИТИЧЕСКИЙ РИСК',
    alertMessage: 'Обнаружено запрещенное обещание оператора',
    loanIntent: 'Запрос кредита',
    termsIntent: 'Условия кредита',
    suspiciousIntent: 'Подозрительная операция по карте',
    mobileIntent: 'SQB Mobile / проблема входа',
    sentiment: 'Нейтральный',
    worried: 'Тревожный',
    riskMedium: 'Средний',
    riskHigh: 'Высокий',
    loanResponse: 'Клиент спросил о возможности получить кредит. Оператор должен объяснить, что одобрение зависит от скоринга и документов.',
    termsResponse: 'Процентная ставка и график платежей зависят от типа кредита, срока, результата скоринга и политики банка. До подтверждения клиенту нужно ясно объяснить все условия.',
    suspiciousResponse: 'Для безопасности сначала проверяем личность, временно блокируем карту, открываем dispute заявку и предупреждаем не передавать PIN/SMS/CVV.',
    mobileResponse: 'Обнаружена проблема входа в SQB Mobile. Оператор проверит версию приложения, интернет, доставку SMS и зарегистрированный номер телефона.',
    unknownResponse: 'Обращение будет добавлено в learning queue для supervisor review.',
    audit: {
      started: 'Ультрабыстрое демо началось.',
      analyzedLoan: 'Transcript проанализирован: запрос кредита на 30 млн сумов, intent Запрос кредита, уверенность 95%.',
      violation: 'Обнаружены запрещенные фразы: 100% одобрят; без документов.',
      kyc: 'KYC/AML обновлен: источник дохода готов; проверка личности, цель кредита, согласие на скоринг и AML проверка не хватает.',
      analyzedTerms: 'Transcript проанализирован: клиент спросил о процентах и сроке платежа.',
      recommendation: 'Рекомендация создана: кредитная карта или потребительский кредит с низкой ставкой.',
      crm: 'CRM итог создан с compliance риском, безопасной формулировкой и неполным KYC/AML.',
      safeAction: 'Безопасное действие выполнено: CRM заметка автоматически создана для supervisor review.',
      unknown: 'Новый паттерн найден: Mobile App Issues. Аналитика спроса обновлена.',
    },
  },
  en: {
    customerLoanRequest: 'Hello, I need a loan. Can I take 30 million UZS?',
    operatorMistake: 'Yes, of course, you will be 100% approved, even without documents',
    customerTermsQuestion: 'What are the interest rates and when do I need to pay?',
    forbiddenPhrases: ['100% approved', 'without documents'],
    safeRewrite: 'Loan approval is based on the bank scoring system, required documents, and bank policy.',
    nextBestOffer: 'A credit card or a low-rate consumer loan is recommended.',
    offerReason: 'The customer income is 7 million UZS, segment is Mass Affluent, and eligibility is conditional.',
    objectionHandling: 'Interest rate and payment schedule depend on scoring, term, and documents. The operator should give exact pricing only after official calculation.',
    crmSummary: 'The customer asked about a 30 million UZS loan. The operator made an incorrect promise. AI suggested safe wording. KYC/AML questions were not fully completed. The customer also asked about interest and payment date.',
    alertTitle: 'CRITICAL RISK',
    alertMessage: 'Operator prohibited promise detected',
    loanIntent: 'Loan request',
    termsIntent: 'Loan conditions',
    suspiciousIntent: 'Suspicious card transaction',
    mobileIntent: 'SQB Mobile / login issue',
    sentiment: 'Neutral',
    worried: 'Worried',
    riskMedium: 'Medium',
    riskHigh: 'High',
    loanResponse: 'The customer asked about loan eligibility. The operator must explain that approval depends on scoring and documents.',
    termsResponse: 'Interest rate and payment schedule depend on loan type, term, scoring result, and bank policy. All conditions must be clearly explained before confirmation.',
    suspiciousResponse: 'For safety, first verify identity, temporarily block the card, open a dispute request, and warn the customer not to share PIN/SMS/CVV.',
    mobileResponse: 'SQB Mobile login issue detected. The operator should check app version, internet connection, SMS delivery, and registered phone number.',
    unknownResponse: 'The request will be added to the learning queue for supervisor review.',
    audit: {
      started: 'Ultra-fast demo started.',
      analyzedLoan: 'Transcript analyzed: 30 million UZS loan request, intent Loan request, confidence 95%.',
      violation: 'Forbidden phrases detected: 100% approved; without documents.',
      kyc: 'KYC/AML updated: income source done; identity, loan purpose, scoring consent, and AML screening are still missing.',
      analyzedTerms: 'Transcript analyzed: customer asked about interest and payment timing.',
      recommendation: 'Recommendation generated: credit card or low-rate consumer loan.',
      crm: 'CRM summary created with compliance risk, safe rewrite, and incomplete KYC/AML checklist.',
      safeAction: 'Safe action executed: CRM note auto-created for supervisor review.',
      unknown: 'New pattern detected: Mobile App Issues. Demand analytics updated.',
    },
  },
}

const baseDemand = {
  uz: [
    ['due-date', "Kredit to'lov sanasi / keyingi to'lov", 35],
    ['card-balance', 'Karta balansi / tranzaksiya savollari', 18],
    ['mobile-app', 'SQB Mobile ilova muammolari', 14],
    ['card-risk', 'Karta bloklash / shubhali operatsiya', 11],
    ['loan-product', "Kredit arizasi / mahsulot ma'lumoti", 9],
    ['deposit', 'Omonat / jamg‘arma savollari', 6],
    ['unknown', 'Boshqa / noma’lum', 7],
  ],
  ru: [
    ['due-date', 'Дата платежа / следующий платеж по кредиту', 35],
    ['card-balance', 'Баланс карты / вопросы по операциям', 18],
    ['mobile-app', 'Проблемы с SQB Mobile', 14],
    ['card-risk', 'Блокировка карты / подозрительная операция', 11],
    ['loan-product', 'Заявка на кредит / информация о продукте', 9],
    ['deposit', 'Депозиты / накопления', 6],
    ['unknown', 'Другое / неизвестно', 7],
  ],
  en: [
    ['due-date', 'Loan due date / next payment', 35],
    ['card-balance', 'Card balance / transaction questions', 18],
    ['mobile-app', 'SQB Mobile app issues', 14],
    ['card-risk', 'Card block / suspicious transaction', 11],
    ['loan-product', 'Loan application / product info', 9],
    ['deposit', 'Deposit / savings questions', 6],
    ['unknown', 'Other / unknown', 7],
  ],
}

function demandFor(language) {
  return baseDemand[language].map(([key, label, value]) => ({ key, label, value }))
}

function detectLanguage(text) {
  const lower = text.toLowerCase()

  const uzbekCyrillicWords = /(салом|ассалому|картам|картадан|пул|ечилди|кетди|кредит керак|қарз|сўм|тўлов|тулов|илова|киролмаяпман|мижоз|ҳисоб|хисоб|омонат|фоиз|ойлик)/i
  if (uzbekCyrillicWords.test(text)) return 'uz'

  const russianWords = /[а-яё]/i
  if (russianWords.test(text) && /(кредит|карта|деньги|списали|баланс|платеж|приложение|сум|займ)/i.test(text)) {
    return 'ru'
  }

  const uzbekWords = /(salom|assalomu|kartam|karta|pul|yechildi|ketdi|kredit|qarz|so‘m|so'm|som|to‘lov|to'lov|tolov|ilova|kirolmayapman|mijoz|hisob|balans|omonat|foiz|oylik)/i
  if (uzbekWords.test(lower)) return 'uz'

  return 'en'
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
    'списали',
    'сняли деньги',
    'unauthorized',
    'card withdrawal',
    'money was taken',
  ])) return 'suspicious_card'

  if (containsAny(value, [
    'kredit kerak',
    'qarz olmoqchiman',
    'pul kerak',
    'mikroqarz',
    'nasiyaga',
    'кредит керак',
    'қарз олмоқчиман',
    'нужен кредит',
    'взять кредит',
    'need a loan',
    'loan',
    'credit',
  ])) return 'loan_request'

  if (containsAny(value, [
    'ilovaga kirolmayapman',
    'ilovaga kira olmayapman',
    'app ishlamayapti',
    'sms kelmayapti',
    'parol esimdan chiqdi',
    'иловага киролмаяпман',
    'апп ишламаяпти',
    'не могу войти',
    'приложение не работает',
    'cannot log in',
    'app does not work',
  ])) return 'mobile_issue'

  if (containsAny(value, ['foiz', "to'lash", 'protsent', 'процент', 'платить', 'interest', 'payment'])) {
    return 'loan_terms'
  }

  return 'unknown'
}

function formatDuration(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')
  return `${mins}:${secs}`
}

function initialAnalysis(language) {
  const L = t[language]
  return {
    intent: L.status.standby,
    sentiment: L.status.standby,
    confidence: 0,
    risk: L.status.clear,
    response: L.aiNotReady,
    recommendation: '',
    suggestedResponse: '',
  }
}

function initialKycChecklist(language) {
  return t[language].kyc.items.map(([key, label, severity]) => ({
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
    status: t[language].objection.emptyTitle,
  }
}

function initialUnknown(language) {
  const L = t[language]
  return {
    message: L.unknown.demoMessage,
    initial: L.unknown.initial,
    cluster: L.unknown.noCluster,
    insight: L.sectionCopy.unknown,
  }
}

function SectionHeader({ label, title, description, right }) {
  return (
    <div className="section-title">
      <div>
        <p className="eyebrow">{label}</p>
        <h2>{title}</h2>
        {description ? <span className="section-description">{description}</span> : null}
      </div>
      {right}
    </div>
  )
}

function Header({ L, language, setLanguage, callStatus, elapsedSeconds, demoRunning, onRunDemo, onReset, onExport }) {
  return (
    <header className="top-header">
      <div>
        <p className="eyebrow">{L.headerEyebrow}</p>
        <h1>SQB Call Intelligence AI</h1>
        <span>{L.headerSubtitle}</span>
      </div>
      <div className="header-actions">
        <div className="language-switch" aria-label="Language switch">
          {['uz', 'ru', 'en'].map((item) => (
            <button className={language === item ? 'active' : ''} key={item} type="button" onClick={() => setLanguage(item)}>
              {item.toUpperCase()}
            </button>
          ))}
        </div>
        <span className={`live-status ${callStatus === L.status.live ? 'is-live' : ''}`}>
          <i />
          {callStatus}
        </span>
        <time>{formatDuration(elapsedSeconds)}</time>
        <button className="primary-button" type="button" onClick={onRunDemo} disabled={demoRunning}>
          {demoRunning ? L.demoRunning : L.runDemo}
        </button>
        <button className="secondary-button" type="button" onClick={onReset}>{L.reset}</button>
        <button className="secondary-button" type="button" onClick={onExport}>{L.export}</button>
      </div>
    </header>
  )
}

function Sidebar({ L, activeNav, setActiveNav }) {
  return (
    <aside className="sidebar">
      <div className="brand-mark">SQB</div>
      {navKeys.map((key, index) => (
        <button className={activeNav === key ? 'active' : ''} key={key} type="button" onClick={() => setActiveNav(key)}>
          {L.nav[index]}
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

function Transcript({ L, messages }) {
  return (
    <div className="transcript">
      {messages.length === 0 ? (
        <article className="empty-message">
          <span>{L.transcript.emptyRole}</span>
          <p>{L.transcript.empty}</p>
        </article>
      ) : messages.map((message) => (
        <article className={`message-${message.role.toLowerCase()}`} key={message.id}>
          <span>{L.transcript.roles[message.role] || message.role}</span>
          <p>{message.text}</p>
        </article>
      ))}
    </div>
  )
}

function RealTimeOperatorConsole({ L, messages, analysis, demoRunning }) {
  return (
    <section className="card">
      <SectionHeader
        description={L.sectionCopy.console}
        label="SQB"
        right={<span className="listening-pill">{demoRunning ? L.status.streaming : L.status.ready}</span>}
        title={L.sections.console}
      />
      <Transcript L={L} messages={messages} />
      <div className="analysis-grid">
        <span>{L.analysis.intent}<b>{analysis.intent}</b></span>
        <span>{L.analysis.sentiment}<b>{analysis.sentiment}</b></span>
        <span>{L.analysis.confidence}<b>{analysis.confidence}%</b></span>
        <span>{L.analysis.risk}<b>{analysis.risk}</b></span>
      </div>
      <div className="suggested-response">
        <span>{L.analysis.safeResponse}</span>
        <p>{analysis.response}</p>
      </div>
    </section>
  )
}

function ComplianceGuardrails({ L, complianceAlert }) {
  return (
    <section className={`card compliance-card ${complianceAlert ? 'critical' : ''}`}>
      <SectionHeader description={L.sectionCopy.compliance} label="SQB" title={L.sections.compliance} />
      {!complianceAlert ? (
        <>
          <h3>{L.compliance.noAlertTitle}</h3>
          <p className="body-copy">{L.compliance.noAlertBody}</p>
          <ul className="guardrail-list">
            {L.compliance.rules.map((rule) => <li key={rule}>{rule}</li>)}
          </ul>
        </>
      ) : (
        <>
          <p className="eyebrow">{L.compliance.alertEyebrow}</p>
          <h3>{complianceAlert.title}</h3>
          <strong>{complianceAlert.message}</strong>
          <div className="phrase-list">
            {complianceAlert.phrases.map((phrase) => <span key={phrase}>{phrase}</span>)}
          </div>
          <div className="safe-rewrite">
            <b>{L.compliance.safeRewrite}</b>
            <p>{complianceAlert.safeRewrite}</p>
          </div>
        </>
      )}
    </section>
  )
}

function KycAmlChecklist({ L, checklist }) {
  return (
    <section className="card">
      <SectionHeader description={L.sectionCopy.kyc} label="SQB" title={L.sections.kyc} />
      <div className="checklist">
        {checklist.map((item) => (
          <article className={`${item.status} ${item.severity}`} key={item.key}>
            <span>{item.label}</span>
            <b>{item.status === 'done' ? L.kyc.done : L.kyc.missing}</b>
          </article>
        ))}
      </div>
    </section>
  )
}

function NextBestOfferCard({ L, nextOffer, offerReason }) {
  return (
    <section className="card next-offer-card">
      <SectionHeader description={L.sectionCopy.offer} label="SQB" title={L.sections.offer} />
      <div className="recommended-action">
        <b>{nextOffer || L.offer.empty}</b>
        {offerReason ? <p><span>{L.offer.reason}: </span>{offerReason}</p> : null}
      </div>
    </section>
  )
}

function ObjectionHandlingCard({ L, objection }) {
  return (
    <section className="card">
      <SectionHeader description={L.sectionCopy.objection} label="SQB" title={L.sections.objection} />
      {objection.concern ? (
        <div className="objection-grid">
          <article>
            <span>{L.objection.customerConcern}</span>
            <p>{objection.concern}</p>
          </article>
          <article>
            <span>{L.objection.handling}</span>
            <p>{objection.handling}</p>
          </article>
        </div>
      ) : (
        <div className="action-result">
          <span>{L.objection.emptyTitle}</span>
          <p>{L.objection.emptyText}</p>
        </div>
      )}
    </section>
  )
}

function PostCallSummary({ L, crmSummary, exportStatus }) {
  return (
    <section className="card">
      <SectionHeader description={L.sectionCopy.summary} label="SQB" title={L.sections.summary} />
      <p className="summary-box">{crmSummary || L.crmEmpty}</p>
      {exportStatus ? <div className="success-note">{exportStatus}</div> : null}
    </section>
  )
}

function BackendStatus({ L }) {
  return (
    <section className="card">
      <SectionHeader description={L.sectionCopy.backend} label="SQB" title={L.sections.backend} />
      <div className="status-list">
        <article><i /><span>{L.backend.server}</span></article>
        <article><i /><span>{L.backend.localAi}</span></article>
        <article className="neutral"><i /><span>{L.backend.externalApi}</span></article>
        <article><i /><span>{L.backend.lan}</span></article>
      </div>
    </section>
  )
}

function AuditLog({ L, auditLog }) {
  return (
    <section className="card audit-card">
      <SectionHeader
        description={L.sectionCopy.audit}
        label="SQB"
        right={<strong>{auditLog.length} {L.audit.events}</strong>}
        title={L.sections.audit}
      />
      <div className="audit-list">
        {auditLog.length === 0 ? (
          <article>
            <span>{L.status.ready}</span>
            <p>{L.audit.empty}</p>
          </article>
        ) : auditLog.map((item) => (
          <article key={item.id}>
            <time>{item.time}</time>
            <span>{L.audit.labels[item.type] || item.type}</span>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function SafeActionLayer({ L, onAction, safeActionResult }) {
  return (
    <section className="card">
      <SectionHeader description={L.sectionCopy.safeAction} label="SQB" title={L.sections.safeAction} />
      <div className="safe-action-row">
        {Object.entries(L.safeAction.actions).map(([key, action]) => (
          <button type="button" key={key} onClick={() => onAction(key)}>
            {action.label}
          </button>
        ))}
      </div>
      <div className="action-result">
        <span>{L.safeAction.visibleResult}</span>
        <p>{safeActionResult || L.safeAction.noResult}</p>
      </div>
    </section>
  )
}

function CustomerProfile({ L }) {
  return (
    <section className="card profile-card">
      <SectionHeader label="SQB" title={L.sections.customer} />
      <div className="profile-grid">
        <span>{L.customer.age}<b>{customerProfile.age}</b></span>
        <span>{L.customer.city}<b>{customerProfile.city}</b></span>
        <span>{L.customer.income}<b>{customerProfile.income}</b></span>
        <span>{L.customer.segment}<b>{customerProfile.segment}</b></span>
        <span>{L.customer.risk}<b>{customerProfile.risk}</b></span>
        <span>{L.customer.eligibility}<b>{customerProfile.eligibility}</b></span>
        <span>{L.customer.activeLoan}<b>{customerProfile.activeLoan}</b></span>
        <span>{L.customer.monthlyPayment}<b>{customerProfile.monthlyPayment}</b></span>
        <span>{L.customer.nextPaymentDate}<b>{customerProfile.nextPaymentDate}</b></span>
      </div>
    </section>
  )
}

function DemandAnalytics({ L, demandData }) {
  return (
    <section className="card wide-card">
      <SectionHeader description={L.sectionCopy.analytics} label="SQB" title={L.sections.analytics} />
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

function UnknownCallsCluster({ L, unknownLearning, onRunUnknownDemo }) {
  return (
    <section className="card">
      <SectionHeader description={L.sectionCopy.unknown} label="SQB" title={L.sections.unknown} />
      <button className="secondary-button" type="button" onClick={onRunUnknownDemo}>{L.unknown.button}</button>
      <div className="unknown-grid">
        <span>{L.transcript.roles.Customer}<b>{unknownLearning.message}</b></span>
        <span>{L.analysis.intent}<b>{unknownLearning.initial}</b></span>
        <span>{L.unknown.clusterLabel}<b>{unknownLearning.cluster}</b></span>
      </div>
      <div className="insight-card">
        <b>{L.unknown.insightLabel}</b>
        <p>{unknownLearning.insight}</p>
      </div>
    </section>
  )
}

function VoicePanel({ L, input, setInput, voiceStatus, isListening, onAnalyze, onStartVoice, onStopVoice, onSpeak }) {
  return (
    <section className="card">
      <SectionHeader
        description={L.sectionCopy.voice}
        label="SQB"
        right={<span className={`voice-status ${isListening ? 'is-listening' : ''}`}>{voiceStatus}</span>}
        title={L.sections.voice}
      />
      <div className="control-row">
        <button type="button" onClick={onStartVoice}>{L.voice.start}</button>
        <button type="button" onClick={onStopVoice}>{L.voice.stop}</button>
        <button type="button" onClick={onSpeak}>{L.voice.speak}</button>
      </div>
      <form className="text-input-row" onSubmit={(event) => {
        event.preventDefault()
        onAnalyze(input)
      }}>
        <input value={input} onChange={(event) => setInput(event.target.value)} placeholder={L.voice.placeholder} />
        <button className="primary-button" type="submit">{L.voice.analyze}</button>
      </form>
    </section>
  )
}

function WhyMatters({ L }) {
  return (
    <section className="card why-card">
      <SectionHeader label="SQB" title={L.sections.why} />
      <p>{L.why}</p>
    </section>
  )
}

function App() {
  const [language, setLanguage] = useState("uz")
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
  const [demandData, setDemandData] = useState(() => demandFor('uz'))
  const [unknownLearning, setUnknownLearning] = useState(() => initialUnknown('uz'))
  const [input, setInput] = useState('')
  const [voiceStatus, setVoiceStatus] = useState(t.uz.status.voiceReady)
  const [isListening, setIsListening] = useState(false)
  const [callStatus, setCallStatus] = useState(t.uz.status.standby)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [demoRunning, setDemoRunning] = useState(false)
  const [exportStatus, setExportStatus] = useState('')
  const timeoutsRef = useRef([])
  const recognitionRef = useRef(null)
  const idRef = useRef(1)
  const L = t[language]
  const currentScenario = scenario[language]

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
    setDemandData(demandFor(nextLanguage))
    setUnknownLearning(initialUnknown(nextLanguage))
    setInput('')
    setVoiceStatus(t[nextLanguage].status.voiceReady)
    setIsListening(false)
    setCallStatus(t[nextLanguage].status.standby)
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
    setCallStatus(L.status.live)
    setElapsedSeconds(0)
    setDemoRunning(true)
    addAudit('call_started', currentScenario.audit.started)

    scheduleStep(() => {
      addMessage('Customer', currentScenario.customerLoanRequest)
      setAnalysis({
        intent: currentScenario.loanIntent,
        sentiment: currentScenario.sentiment,
        confidence: 95,
        risk: currentScenario.riskMedium,
        response: currentScenario.loanResponse,
        recommendation: currentScenario.safeRewrite,
        suggestedResponse: currentScenario.safeRewrite,
      })
      addAudit('transcript_analyzed', currentScenario.audit.analyzedLoan)
    }, 800)

    scheduleStep(() => {
      addMessage('Operator', currentScenario.operatorMistake)
      setComplianceAlert({
        title: currentScenario.alertTitle,
        message: currentScenario.alertMessage,
        phrases: currentScenario.forbiddenPhrases,
        safeRewrite: currentScenario.safeRewrite,
      })
      setKycChecklist((current) => current.map((item) => (
        item.key === 'income' ? { ...item, status: 'done' } : { ...item, status: 'missing' }
      )))
      addAudit('compliance_violation_detected', currentScenario.audit.violation)
      addAudit('kyc_updated', currentScenario.audit.kyc)
    }, 1800)

    scheduleStep(() => {
      addMessage('AI', currentScenario.safeRewrite)
    }, 2700)

    scheduleStep(() => {
      addMessage('Customer', currentScenario.customerTermsQuestion)
      setAnalysis({
        intent: currentScenario.termsIntent,
        sentiment: currentScenario.sentiment,
        confidence: 92,
        risk: currentScenario.riskMedium,
        response: currentScenario.termsResponse,
        recommendation: currentScenario.nextBestOffer,
        suggestedResponse: currentScenario.termsResponse,
      })
      setNextOffer(currentScenario.nextBestOffer)
      setOfferReason(currentScenario.offerReason)
      setObjection({
        concern: currentScenario.customerTermsQuestion,
        handling: currentScenario.objectionHandling,
        status: 'handled',
      })
      addAudit('transcript_analyzed', currentScenario.audit.analyzedTerms)
      addAudit('recommendation_generated', currentScenario.audit.recommendation)
    }, 3700)

    scheduleStep(() => {
      setCrmSummary(currentScenario.crmSummary)
      setSafeActionResult(L.safeAction.actions.crmNote.result)
      setCallStatus(L.status.summary)
      setDemoRunning(false)
      addAudit('crm_summary_created', currentScenario.audit.crm)
      addAudit('safe_action_executed', currentScenario.audit.safeAction)
    }, 4900)
  }

  function analyzeManualMessage(text) {
    const clean = text.trim()
    if (!clean) return

    const category = classifyCustomerMessage(clean)
    const detectedCustomerLanguage = detectLanguage(clean)
    const responseLanguage = detectedCustomerLanguage === 'en' ? 'en' : detectedCustomerLanguage === 'ru' ? 'ru' : 'uz'
    const responseScenario = scenario[responseLanguage]
    setInput('')
    addMessage('Customer', clean)
    addAudit('transcript_analyzed', `Manual transcript analyzed: ${category}.`)

    if (category === 'suspicious_card') {
      setAnalysis({
        intent: responseScenario.suspiciousIntent,
        sentiment: responseScenario.worried,
        confidence: 94,
        risk: responseScenario.riskHigh,
        response: responseScenario.suspiciousResponse,
        recommendation: responseScenario.suspiciousResponse,
        suggestedResponse: responseScenario.suspiciousResponse,
      })
      setComplianceAlert({
        title: responseScenario.alertTitle,
        message: responseScenario.alertMessage,
        phrases: [clean],
        safeRewrite: responseScenario.suspiciousResponse,
      })
      setDemandData((current) => current.map((item) => (
        item.key === 'card-risk' ? { ...item, value: item.value + 1 } : item
      )))
      return
    }

    if (category === 'loan_request') {
      setAnalysis({
        intent: responseScenario.loanIntent,
        sentiment: responseScenario.sentiment,
        confidence: 93,
        risk: responseScenario.riskMedium,
        response: responseScenario.safeRewrite,
        recommendation: responseScenario.safeRewrite,
        suggestedResponse: responseScenario.safeRewrite,
      })
      return
    }

    if (category === 'mobile_issue') {
      setAnalysis({
        intent: responseScenario.mobileIntent,
        sentiment: responseScenario.sentiment,
        confidence: 90,
        risk: responseScenario.riskMedium,
        response: responseScenario.mobileResponse,
        recommendation: responseScenario.mobileResponse,
        suggestedResponse: responseScenario.mobileResponse,
      })
      setDemandData((current) => current.map((item) => (
        item.key === 'mobile-app' ? { ...item, value: item.value + 1 } : item
      )))
      return
    }

    if (category === 'loan_terms') {
      setAnalysis({
        intent: responseScenario.termsIntent,
        sentiment: responseScenario.sentiment,
        confidence: 91,
        risk: responseScenario.riskMedium,
        response: responseScenario.termsResponse,
        recommendation: responseScenario.nextBestOffer,
        suggestedResponse: responseScenario.termsResponse,
      })
      setNextOffer(responseScenario.nextBestOffer)
      setOfferReason(responseScenario.offerReason)
      setObjection({ concern: clean, handling: responseScenario.objectionHandling, status: 'handled' })
      addAudit('recommendation_generated', responseScenario.audit.recommendation)
      return
    }

    setAnalysis({
      intent: t[responseLanguage].unknown.intent,
      sentiment: responseScenario.sentiment,
      confidence: 46,
      risk: t[responseLanguage].status.review,
      response: responseScenario.unknownResponse,
      recommendation: responseScenario.unknownResponse,
      suggestedResponse: responseScenario.unknownResponse,
    })
  }

  function runUnknownCallsDemo() {
    const message = L.unknown.demoMessage
    addMessage('Customer', message)
    addAudit('transcript_analyzed', currentScenario.audit.unknown)
    setAnalysis({
      intent: L.unknown.intent,
      sentiment: currentScenario.sentiment,
      confidence: 41,
      risk: L.status.review,
      response: currentScenario.unknownResponse,
      recommendation: currentScenario.unknownResponse,
      suggestedResponse: currentScenario.unknownResponse,
    })
    setUnknownLearning({
      message,
      initial: L.unknown.initial,
      cluster: L.unknown.detecting,
      insight: L.sectionCopy.unknown,
    })

    scheduleStep(() => {
      setUnknownLearning({
        message,
        initial: L.unknown.initial,
        cluster: 'Mobile App Issues',
        insight: L.unknown.insight,
      })
      setDemandData((current) => current.map((item) => {
        if (item.key === 'mobile-app') return { ...item, value: item.value + 1 }
        if (item.key === 'unknown') return { ...item, value: Math.max(item.value - 1, 0) }
        return item
      }))
      addAudit('recommendation_generated', currentScenario.audit.unknown)
    }, 900)
  }

  function executeSafeAction(actionKey) {
    const action = L.safeAction.actions[actionKey]
    if (!action) return
    setSafeActionResult(action.result)
    addAudit('safe_action_executed', action.result)
  }

  function exportReport() {
    const result = auditLog.length ? L.exportReady(auditLog.length) : L.exportEmpty
    setExportStatus(result)
    addAudit('safe_action_executed', result)
  }

  function startVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setVoiceStatus(L.status.unavailable)
      return
    }

    try {
      if (recognitionRef.current) recognitionRef.current.stop()
      const recognition = new SpeechRecognition()
      recognition.lang = speechLangMap[language]
      recognition.interimResults = false
      recognition.continuous = false
      recognition.onstart = () => {
        setIsListening(true)
        setVoiceStatus(L.status.listening)
      }
      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript || ''
        if (transcript) {
          setInput(transcript)
          addMessage('Customer', transcript)
          addAudit('transcript_analyzed', `${L.voice.captured}: ${transcript}`)
        }
      }
      recognition.onerror = () => {
        setVoiceStatus(L.status.unavailable)
        setIsListening(false)
      }
      recognition.onend = () => {
        setIsListening(false)
        setVoiceStatus(L.status.voiceReady)
      }
      recognitionRef.current = recognition
      recognition.start()
    } catch {
      setVoiceStatus(L.status.unavailable)
      setIsListening(false)
    }
  }

  function stopVoice() {
    try {
      if (recognitionRef.current) recognitionRef.current.stop()
    } catch {
      setVoiceStatus(L.status.unavailable)
    }
    setIsListening(false)
    setVoiceStatus(L.status.voiceReady)
  }

  function speakWithBrowser(aiText, spokenLanguage) {
    if (!window.speechSynthesis) {
      setVoiceStatus(L.status.unavailable)
      return false
    }

    const utterance = new SpeechSynthesisUtterance(aiText)
    const browserLang = speechLangMap[spokenLanguage] || speechLangMap[language]
    const voices = window.speechSynthesis.getVoices()
    const matchingVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith(spokenLanguage))

    utterance.lang = browserLang
    if (matchingVoice) utterance.voice = matchingVoice
    utterance.onstart = () => setVoiceStatus(L.status.speaking)
    utterance.onend = () => setVoiceStatus(L.status.voiceReady)
    utterance.onerror = () => setVoiceStatus(L.status.unavailable)

    window.speechSynthesis.cancel()
    setVoiceStatus(L.status.speaking)
    window.speechSynthesis.speak(utterance)
    return true
  }

  async function playAudioBlob(blob) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audio.onplay = () => setVoiceStatus(L.status.speaking)
      audio.onended = () => {
        URL.revokeObjectURL(url)
        setVoiceStatus(L.status.voiceReady)
        resolve()
      }
      audio.onerror = () => {
        URL.revokeObjectURL(url)
        setVoiceStatus(L.status.unavailable)
        reject(new Error('Audio playback failed'))
      }
      audio.play().catch((error) => {
        URL.revokeObjectURL(url)
        reject(error)
      })
    })
  }

  async function speakAiResponse() {
    const aiText = analysis?.suggestedResponse || analysis?.response || complianceAlert?.safeRewrite || crmSummary || L.aiNotReady
    const latestCustomerMessage = [...messages].reverse().find((message) => message.role === 'Customer')?.text || ''
    const detectedLang = detectLanguage(`${input.trim() || latestCustomerMessage} ${aiText}`)

    console.log('Detected voice language:', detectedLang)
    console.log('Speaking text:', aiText)

    setVoiceStatus(L.status.generating)
    window.speechSynthesis?.cancel()

    try {
      const response = await fetch('http://127.0.0.1:8000/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: aiText, language: detectedLang }),
      })

      if (!response.ok) throw new Error('TTS request failed')

      const contentType = response.headers.get('content-type') || ''
      if (contentType.startsWith('audio/')) {
        const blob = await response.blob()
        await playAudioBlob(blob)
        return
      }

      await response.json()
      speakWithBrowser(aiText, detectedLang)
    } catch {
      speakWithBrowser(aiText, detectedLang)
    }
  }

  useEffect(() => {
    if (callStatus !== L.status.live) return undefined
    const intervalId = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1)
    }, 1000)
    return () => window.clearInterval(intervalId)
  }, [callStatus, L.status.live])

  useEffect(() => () => {
    timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
    if (recognitionRef.current) recognitionRef.current.abort()
  }, [])

  return (
    <div className="app-shell">
      <Sidebar L={L} activeNav={activeNav} setActiveNav={setActiveNav} />
      <main className="workspace">
        <Header
          L={L}
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
          {L.stats.map(([label, value, detail], index) => {
            const statValue = value
              || (index === 2 ? (analysis.confidence ? `${analysis.confidence}%` : L.status.ready) : null)
              || (index === 3 ? (complianceAlert ? L.status.critical : L.status.clear) : null)
              || L.status.ready
            return <StatCard detail={index === 2 ? analysis.intent : detail} key={label} label={label} value={statValue} />
          })}
        </section>

        <section className="main-grid">
          <div className="left-column">
            <RealTimeOperatorConsole L={L} analysis={analysis} demoRunning={demoRunning} messages={messages} />
            <NextBestOfferCard L={L} nextOffer={nextOffer} offerReason={offerReason} />
            <ObjectionHandlingCard L={L} objection={objection} />
            <VoicePanel
              L={L}
              input={input}
              isListening={isListening}
              onAnalyze={analyzeManualMessage}
              onSpeak={speakAiResponse}
              onStartVoice={startVoice}
              onStopVoice={stopVoice}
              setInput={setInput}
              voiceStatus={voiceStatus}
            />
            <DemandAnalytics L={L} demandData={demandData} />
            <UnknownCallsCluster L={L} onRunUnknownDemo={runUnknownCallsDemo} unknownLearning={unknownLearning} />
            <WhyMatters L={L} />
          </div>

          <aside className="right-column">
            <BackendStatus L={L} />
            <CustomerProfile L={L} />
            <ComplianceGuardrails L={L} complianceAlert={complianceAlert} />
            <KycAmlChecklist L={L} checklist={kycChecklist} />
            <SafeActionLayer L={L} onAction={executeSafeAction} safeActionResult={safeActionResult} />
            <PostCallSummary L={L} crmSummary={crmSummary} exportStatus={exportStatus} />
            <AuditLog L={L} auditLog={auditLog} />
          </aside>
        </section>
      </main>
    </div>
  )
}

export default App
