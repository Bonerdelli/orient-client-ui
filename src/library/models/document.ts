/**
 * NOTE: need EP to retrieve doc types
 * Doc type must not be in cyr name
 */
export const DOCUMENT_TYPE = {
  1: 'Устав',
  2: 'Паспорт исполнительного органа',
  3: 'Протокол об избрании исполнительного органа',
  4: 'Свидетельство о регистрации компании',
  5: 'Устав компании',
  7: 'Бухгалтерская отчетность за 2021 год',
  6: 'Бухгалтерская отчетность за 1 квартал 2022 года',
  8: 'Контракт с дебитором',
}

export interface Document {
  id: number
  type: keyof typeof DOCUMENT_TYPE
  status: unknown
}
