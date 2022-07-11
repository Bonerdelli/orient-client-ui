import { QuestionnaireFormData } from '../models/questionnaire-form.interface'
import { defaultQuestionnaireFormState } from '../constants/default-questionnaire-form-state.const'
import { CompanyQuestionnaireDto } from 'orient-ui-library/library/models/proxy'

export const convertQuestionnaireDtoToFormValues = (dto: CompanyQuestionnaireDto | null): QuestionnaireFormData => {
  if (!dto) {
    return defaultQuestionnaireFormState
  }

  const { id, companyId, ...dataWithoutIds } = dto
  const creditExpirations = dto.creditExpirations?.length === 4
    ? dto.creditExpirations
    : defaultQuestionnaireFormState.creditExpirations
  const buyers = dto.buyers?.length ? dto.buyers : defaultQuestionnaireFormState.buyers
  const suppliers = dto.suppliers?.length ? dto.suppliers : defaultQuestionnaireFormState.suppliers
  return {
    ...dataWithoutIds,
    // setting up empty data for correct form view
    credits: dto.credits ?? defaultQuestionnaireFormState.credits,
    creditExpirations,
    buyers,
    suppliers,
    trials: dto.trials ?? defaultQuestionnaireFormState.trials,
    easyFinanceIndividuals: dto.easyFinanceIndividuals ?? defaultQuestionnaireFormState.easyFinanceIndividuals,
    easyFinanceLegals: dto.easyFinanceLegals ?? defaultQuestionnaireFormState.easyFinanceLegals,

  }
}
