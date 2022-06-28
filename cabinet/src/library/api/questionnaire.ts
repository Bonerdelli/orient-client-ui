import { get, post } from 'orient-ui-library/library'
import { QuestionnaireDto } from 'library/models/proxy'

export async function getQuestionnaire(companyId: string) {
  return await get<QuestionnaireDto>(`/customer/company/${companyId}/questionnaire`)
}

export async function sendQuestionnaire(companyId: string, dto: QuestionnaireDto) {
  return await post(`/customer/company/${companyId}/questionnaire`, dto, true)
}
