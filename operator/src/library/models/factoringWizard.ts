import { CompanyDto, CompanyFounderDto, CompanyRequisitesDto } from 'orient-ui-library/library/models/proxy'
import { FactoringOrderInfo, FactoringWizardStepResponse, FactoringStatus } from 'orient-ui-library/library'
import { StopFactor } from 'library/models/stopFactor'

export type OperatorFactoringWizardStep1ResponseDto = FactoringWizardStepResponse<OperatorFactoringStep1Dto>
export type OperatorFactoringWizardStep4ResponseDto = FactoringWizardStepResponse<OperatorFactoringStep4Dto>

export interface OperatorFactoringStep1Dto {
  clientCompany: CompanyDto
  clientCompanyFounder: CompanyFounderDto
  clientCompanyRequisites: CompanyRequisitesDto
  customerCompany: CompanyDto
  factorOrder: FactoringOrderInfo
}

export interface OperatorFactoringStep4Dto {
  bank: {
    bankId: number
    bankName: string
    isOk: boolean
    stopFactors: StopFactor[]
  }
}

export const FACTORING_REJECTION_ALLOWED_STATUSES = [
  FactoringStatus.FACTOR_OPERATOR_WAIT_FOR_VERIFY,
  FactoringStatus.FACTOR_OPERATOR_VERIFY,
  FactoringStatus.FACTOR_CLIENT_REWORK,
  FactoringStatus.FACTOR_CLIENT_SIGN,
]
