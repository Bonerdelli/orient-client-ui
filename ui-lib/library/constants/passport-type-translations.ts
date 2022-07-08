import { PassportType } from '../models'
import i18n from 'i18next'

export const passportTypeTranslationsMap = {
  [PassportType.Ru]: i18n.t('models.passportTypes.ru'),
  [PassportType.Uz]: i18n.t('models.passportTypes.uz'),
  [PassportType.Uz_Id]: i18n.t('models.passportTypes.uzId'),
}
