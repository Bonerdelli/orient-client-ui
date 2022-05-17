import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import modelsEN from 'orient-ui-library/src/i18n/models/en.yaml'
import modelsRU from 'orient-ui-library/src/i18n/models/ru.yaml'

import portalConfig from 'config/portal.yaml'
import portalEN from './translations/en.yaml'
import portalRU from './translations/ru.yaml'

export const resources = {
  en: { translation: {
    models: modelsEN,
    ...portalEN,
  }},
  ru: { translation: {
    models: modelsRU,
    ...portalRU,
  }},
} as const

i18next.use(initReactI18next).init({
  resources,
  lng: portalConfig.l10n.defaultLocale,
})
