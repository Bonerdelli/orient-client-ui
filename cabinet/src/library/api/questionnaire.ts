import {get} from 'orient-ui-library/library';
import {QuestionnaireFormData} from 'components/QuestionnaireForm/questionnaire-form.interface';

// TODO: replace with CompanyQuestionnaire
export interface QuestionnaireApiResponse extends QuestionnaireFormData {
  id: number;
  companyId: number;
}

export async function getQuestionnaire(companyId: string) {
  return await get<QuestionnaireApiResponse>(`/customer/company/${companyId}/questionnaire`);
}
