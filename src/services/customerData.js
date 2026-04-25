export const customerData = {
  name: 'Azizbek Karimov',
  phone: '+998 90 123 45 67',
  clientId: 'SQB-204918',
  kycStatus: 'Verified',
  riskScore: '18 / 100 Low',
  totalBalance: '14,250,000 so‘m',
  depositBalance: '25,000,000 so‘m',
  cards: [
    { network: 'HUMO', number: '**** 4821', balance: '3,400,000 so‘m', status: 'Active' },
    { network: 'UZCARD', number: '**** 1190', balance: '850,000 so‘m', status: 'Active' },
    { network: 'Visa Virtual', number: '**** 7742', balance: '120 USD', status: 'Active' },
  ],
  loan: {
    amount: '45,000,000 so‘m',
    monthlyPayment: '3,200,000 so‘m',
    nextPaymentDate: '05.05.2026',
  },
  transactions: [
    { amount: '250,000 so‘m', merchant: 'Uzum Market', type: 'Card payment' },
    { amount: '45,000 so‘m', merchant: 'Payme', type: 'Service payment' },
    { amount: '1,200,000 so‘m', merchant: 'Salary incoming', type: 'Incoming' },
    { amount: '120,000 so‘m', merchant: 'Yandex Go', type: 'Transport' },
    { amount: '500,000 so‘m', merchant: 'ATM withdrawal', type: 'Cash' },
  ],
  supportHistory: [
    '18.04.2026 — SQB Mobile login reset',
    '09.04.2026 — HUMO limit increased',
    '22.03.2026 — Loan payment reminder',
  ],
  securityAlerts: [
    'No active card blocks',
    'Device trust: iPhone 14, Tashkent',
    'Last high-risk event: none in 30 days',
  ],
}
