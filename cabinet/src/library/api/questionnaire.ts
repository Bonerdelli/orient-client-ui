import {get, post} from 'orient-ui-library/library';
import {components} from 'orient-ui-library/library/api/schema';

export type QuestionnaireDto = components['schemas']['CompanyQuestionnaire'];

export async function fetchQuestionnaire(companyId: string) {
  return await get<QuestionnaireDto>(`/customer/company/${companyId}/questionnaire`);
}

export async function sendQuestionnaire(companyId: string, dto: QuestionnaireDto) {
  return await post(`/customer/company/${companyId}/questionnaire`, dto);
}
