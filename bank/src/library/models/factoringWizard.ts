import {
  CompanyDto,
  CompanyFounderDto,
  CompanyQuestionnaireDto,
  CompanyRequisitesDto,
} from 'orient-ui-library/library/models/proxy'
import { FactoringOrderInfo, OrderConditions } from 'orient-ui-library/library'
import { OrderDocument } from 'orient-ui-library/library/models/document'

export interface BankFactoringWizardStep1Dto {
  clientCompany: CompanyDto
  clientCompanyFounder: CompanyFounderDto
  clientCompanyRequisites: CompanyRequisitesDto
  conditions: OrderConditions
  factorOrder: FactoringOrderInfo
  customerInn: string
  customerName: string
  contractNumber: string | null
  purchaseNumber: string | null
}

export interface BankFactoringWizardStep2Dto {
  documents: OrderDocument[] | null
  founder: CompanyFounderDto | null
  requisites: CompanyRequisitesDto | null
  questionnaire: CompanyQuestionnaireDto | null
}
