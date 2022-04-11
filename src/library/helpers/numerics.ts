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
    fractionDigits = value.toString().split('.')[1].length
  }
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: padFractionPart ? fractionDigits : 0,
    maximumFractionDigits: fractionDigits,
  }).format(value)
}

/**
 * Helper function to format currencies
 * TODO: add i18n support (take locale from user prefserences)
 */
export const formatCurrency = (
  value: string,
  fractionDigits = 2,
  padFractionPart = false,
) =>
  new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: padFractionPart ? fractionDigits : 0,
    maximumFractionDigits: fractionDigits,
  }).format(parseFloat(value))
