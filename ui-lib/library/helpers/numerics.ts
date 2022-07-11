import { isNumber } from 'lodash'

/**
 * Helpers to handle numeric values
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package orient-ui
 */


/**
 * Parse user input for numeric values
 */
export const parseNumericInput = (value: string): number => {
  let cleanValue = value.trim().replace(/\s+/g, '').replace(',', '.')
  cleanValue = cleanValue.replace(/^[^\d-]+/, '')
  return parseFloat(cleanValue)
}

/**
 * Helper function to format decimal numbers
 * TODO: add i18n support (take locale from user prefserences)
 */
export const formatNumber = (
  value: number,
  fractionDigits?: number,
  padFractionPart = false,
) => {
  if (typeof fractionDigits === 'undefined') {
    fractionDigits = value.toString().split('.')[1]?.length ?? 0
  }
  return new Intl.NumberFormat('ru-RU', { // TODO: support current locale
    minimumFractionDigits: padFractionPart ? fractionDigits : 0,
    maximumFractionDigits: fractionDigits,
  }).format(value)
}

export interface FormatCurrencyOptions {
  fractionDigits?: number
  padFractionPart?: boolean
  currency?: string
}


/**
 * Helper function to format currencies
 * TODO: add i18n support (take locale from user prefserences)
 */
export const formatCurrency = (
  value: string | number,
  options?: FormatCurrencyOptions,
) =>
  new Intl.NumberFormat('ru-RU', { // TODO: add locale support
    style: options?.currency ? 'currency' : undefined,
    minimumFractionDigits: options?.padFractionPart ? options?.fractionDigits : 0,
    maximumFractionDigits: options?.fractionDigits ?? 2,
    currency: options?.currency,
  }).format(isNumber(value) ? value : parseFloat(value))
