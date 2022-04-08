import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import portalConfig from 'config/portal.yaml'
import en from './translations/en.yaml'
import ru from './translations/ru.yaml'

export const resources = {
  en: { translation: en },
  ru: { translation: ru },
} as const

i18next.use(initReactI18next).init({
  resources,
  lng: portalConfig.l10n.defaultLocale,
})
