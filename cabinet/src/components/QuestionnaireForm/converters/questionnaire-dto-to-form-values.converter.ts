import { QuestionnaireFormData } from '../models/questionnaire-form.interface'
import { defaultQuestionnaireFormState } from '../constants/default-questionnaire-form-state.const'
import { CompanyQuestionnaireDto } from 'orient-ui-library/library/models/proxy'

export const convertQuestionnaireDtoToFormValues = (dto: CompanyQuestionnaireDto | null): QuestionnaireFormData | null => {
  if (!dto) {
    return null
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
    buyersTotalCount: dto.buyersTotalCount ?? 0,
    buyersPayDelayCount: dto.buyersPayDelayCount ?? 0,
    payDelayMin: dto.payDelayMin ?? 0,
    payDelayAvg: dto.payDelayAvg ?? 0,
    payDelayMax: dto.payDelayMax ?? 0,
    credits: dto.credits ?? defaultQuestionnaireFormState.credits,
    creditExpirations,
    buyers,
    suppliers,
    trials: dto.trials ?? defaultQuestionnaireFormState.trials,
    easyFinanceIndividuals: dto.easyFinanceIndividuals ?? defaultQuestionnaireFormState.easyFinanceIndividuals,
    easyFinanceLegals: dto.easyFinanceLegals ?? defaultQuestionnaireFormState.easyFinanceLegals,
  }
}
