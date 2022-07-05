import { CompanyDto, CompanyFounderDto, CompanyRequisitesDto } from 'orient-ui-library/library/models/proxy'
import { FactoringOrderInfo, FactoringWizardStepResponse } from 'orient-ui-library/library'

export type OperatorFactoringWizardStep1ResponseDto = FactoringWizardStepResponse<OperatorFactoringStep1Dto>

export interface OperatorFactoringStep1Dto {
  clientCompany: CompanyDto
  clientCompanyFounder: CompanyFounderDto
  clientCompanyRequisites: CompanyRequisitesDto
  customerCompany: CompanyDto
  factorOrder: FactoringOrderInfo
}
