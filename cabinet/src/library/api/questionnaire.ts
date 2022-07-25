import { get, post } from 'orient-ui-library/library'
import { CompanyQuestionnaireDto } from 'orient-ui-library/library/models/proxy'
import { isCustomer } from 'library/helpers/user'
import { User } from 'library/models/user'

interface BaseQuestionnaireRequestParams {
  companyId: string | number
  user: User
}

export async function getQuestionnaire({ companyId, user }: BaseQuestionnaireRequestParams) {
  const entity = isCustomer(user) ? 'customer' : 'client'
  return await get<CompanyQuestionnaireDto>(`/${entity}/company/${companyId}/questionnaire`)
}

interface SaveQuestionnaireParams extends BaseQuestionnaireRequestParams {
  dto: CompanyQuestionnaireDto
}

export async function sendQuestionnaire({ companyId, user, dto }: SaveQuestionnaireParams) {
  const entity = isCustomer(user) ? 'customer' : 'client'
  return await post(`/${entity}/company/${companyId}/questionnaire`, dto, true)
}
