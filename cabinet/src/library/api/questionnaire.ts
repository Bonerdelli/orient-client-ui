import {get} from 'orient-ui-library/library';
import {QuestionnaireFormData} from 'components/QuestionnaireForm/questionnaire-form.interface';

export interface QuestionnaireResponse extends QuestionnaireFormData {
  id: number
  companyId: number
}

export async function getQuestionnaire(companyId: string) {
  return await get<QuestionnaireResponse>(`/customer/company/${companyId}/questionnaire`);
}
