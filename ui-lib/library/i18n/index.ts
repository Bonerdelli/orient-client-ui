import commonEN from 'library/i18n/common/en.yaml'
import commonRU from 'library/i18n/common/ru.yaml'
import modelsEN from 'library/i18n/models/en.yaml'
import modelsRU from 'library/i18n/models/ru.yaml'

export const i18nCommon = {
  en: {
    common: commonEN,
    models: modelsEN,
  },
  ru: {
    common: commonRU,
    models: modelsRU,
  },
} as const
