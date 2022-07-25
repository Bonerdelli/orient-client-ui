import { get, post } from 'orient-ui-library/library'
import { CompanyQuestionnaireDto } from 'orient-ui-library/library/models/proxy'

export async function getQuestionnaire(companyId: string | number) {
  return await get<CompanyQuestionnaireDto>(`/customer/company/${companyId}/questionnaire`)
}

export async function sendQuestionnaire(companyId: string | number, dto: CompanyQuestionnaireDto) {
  return await post(`/customer/company/${companyId}/questionnaire`, dto, true)
}
