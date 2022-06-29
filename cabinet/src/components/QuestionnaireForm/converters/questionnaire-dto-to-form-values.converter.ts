import { QuestionnaireFormData } from '../models/questionnaire-form.interface'
import { defaultQuestionnaireFormState } from '../constants/default-questionnaire-form-state.const'
import { QuestionnaireDto } from 'library/models/proxy'

export const convertQuestionnaireDtoToFormValues = (dto: QuestionnaireDto | null): QuestionnaireFormData | null => {
  if (!dto) {
    return null
  }

  const { id, companyId, ...dataWithoutIds } = dto
  return {
    ...dataWithoutIds,
    // setting up empty data for correct form view
    credits: dto.credits ?? defaultQuestionnaireFormState.credits,
    creditExpirations: dto.creditExpirations ?? defaultQuestionnaireFormState.creditExpirations,
    buyers: dto.buyers ?? defaultQuestionnaireFormState.buyers,
    suppliers: dto.suppliers ?? defaultQuestionnaireFormState.suppliers,
    trials: dto.trials ?? defaultQuestionnaireFormState.trials,
    easyFinanceIndividuals: dto.easyFinanceIndividuals ?? defaultQuestionnaireFormState.easyFinanceIndividuals,
    easyFinanceLegals: dto.easyFinanceLegals ?? defaultQuestionnaireFormState.easyFinanceLegals,
  }
}
