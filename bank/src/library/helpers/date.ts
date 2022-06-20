import dayjs, { Dayjs } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

// TODO: move this to portal config
export const DATE_FORMAT = 'DD.MM.YYYY'
export const DATE_TIME_FORMAT = 'DD.MM.YYYY hh:mm'
export const DATE_FORMAT_LOCALIZED = 'LL'
export const DATE_TIME_FORMAT_LOCALIZED = 'LLL'

type DateType = Dayjs | Date | string

interface DateFormatOptions {
  includeTime?: boolean
  localFormat?: boolean
}

const formatDate = (date: DateType, options?: DateFormatOptions): string => {
  let format = DATE_FORMAT
  if (options?.localFormat && options?.includeTime) {
    format = DATE_TIME_FORMAT_LOCALIZED
  } else if (options?.localFormat) {
    format = DATE_FORMAT_LOCALIZED
  } else if (options?.includeTime) {
    format = DATE_TIME_FORMAT
  }
  return dayjs(date).format(format)
}

const formatDateRelative = (date: DateType, compareTo?: DateType): string => {
  if (!compareTo) {
    const compareToMoment = dayjs()
    return dayjs(date).from(compareToMoment)
  }
  return ''
}

const formatDateRange = (from: DateType, to: DateType, options?: DateFormatOptions): string => {
  const fromFmt = formatDate(from, options)
  const toFmt = formatDate(to, options)
  return `с ${fromFmt} по ${toFmt}`
}

export {
  formatDate,
  formatDateRelative,
  formatDateRange,
}
