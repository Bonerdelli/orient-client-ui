import { QuestionnaireFormData } from '../models/questionnaire-form.interface'
import { CompanyQuestionnaireDto } from 'orient-ui-library/library/models/proxy'

export const convertQuestionnaireFormToDto = (data: QuestionnaireFormData): CompanyQuestionnaireDto => {
  return {
    ...data,
    credits: data.hasCredits ? data.credits : undefined,
    creditExpirations: data.creditExpirations.length > 0 ? data.creditExpirations : undefined,
    holdingName: data.belongsToHoldings ? data.holdingName : undefined,
    headCompanyName: data.belongsToHoldings ? data.headCompanyName : undefined,
    headCompanyInn: data.belongsToHoldings ? data.headCompanyInn : undefined,
    trials: data.hasTrials ? data.trials : undefined,
    suppliers: data.suppliers.length > 0 ? data.suppliers : undefined,
    buyers: data.buyers.length > 0 ? data.buyers : undefined,
    easyFinanceIndividuals: data.hasEasyFinansIndividuals ? data.easyFinanceIndividuals : undefined,
    easyFinanceLegals: data.hasEasyFinansLegals ? data.easyFinanceLegals : undefined,
  }
}
