import commonEN from 'library/i18n/common/en.yaml'
import commonRU from 'library/i18n/common/ru.yaml'
import modelsEN from 'library/i18n/models/en.yaml'
import modelsRU from 'library/i18n/models/ru.yaml'
import questionnaireEN from 'library/i18n/questionnaire/en.yaml'
import questionnaireRU from 'library/i18n/questionnaire/ru.yaml'

export const i18nCommon = {
  en: {
    common: commonEN,
    models: modelsEN,
    questionnaire: questionnaireEN,
  },
  ru: {
    common: commonRU,
    models: modelsRU,
    questionnaire: questionnaireRU,
  },
} as const
