import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import commonEN from 'orient-ui-library/i18n/common/en.yaml'
import commonRU from 'orient-ui-library/i18n/common/ru.yaml'
import modelsEN from 'orient-ui-library/i18n/models/en.yaml'
import modelsRU from 'orient-ui-library/i18n/models/ru.yaml'

import portalConfig from 'config/portal.yaml'

import portalEN from './translations/en.yaml'
import portalRU from './translations/ru.yaml'

export const resources = {
  en: { translation: {
    common: commonEN,
    models: modelsEN,
    ...portalEN,
  }},
  ru: { translation: {
    common: commonRU,
    models: modelsRU,
    ...portalRU,
  }},
} as const

i18next.use(initReactI18next).init({
  resources,
  lng: portalConfig.l10n.defaultLocale,
})
