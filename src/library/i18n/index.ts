import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import { i18nCommon } from 'orient-ui-library/library/i18n'

import portalConfig from 'config/portal.yaml'

import portalEN from './translations/en.yaml'
import portalRU from './translations/ru.yaml'

export const resources = {
  en: { translation: {
    ...i18nCommon.en,
    ...portalEN,
  } },
  ru: { translation: {
    ...i18nCommon.ru,
    ...portalRU,
  } },
} as const

console.log('resources', resources)

i18next.use(initReactI18next).init({
  resources,
  lng: portalConfig.l10n.defaultLocale,
})
