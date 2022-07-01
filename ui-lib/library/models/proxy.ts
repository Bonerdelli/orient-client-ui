/* TODO: move to ui-lib after debugging */

import * as schema from '../api/schema'

export type CompanyDto = schema.components['schemas']['JCompany']
export type CompanyContactsDto = schema.components['schemas']['JCompanyContacts']
export type CompanyRequisitesDto = schema.components['schemas']['JCompanyRequisites']
export type CompanyFounderDto = schema.components['schemas']['JCompanyFounder'] // NOTE: founder is not head
export type BankDto = schema.components['schemas']['JBank']

// NOTE: for a some reason this type doesn't not exported correctly
// export type OrderDocument = schema.components['schemas']['OrderDocumentsResponse']

export type CompanyDocumentDto = schema.components['schemas']['CompanyDocumentsResponse']
export type CompanyQuestionnaireDto = schema.components['schemas']['CompanyQuestionnaire']


export interface OrderDocument {
  typeId: number
  typeName: string
  isGenerated: boolean
  isRequired: boolean
  info?: schema.components['schemas']['Info']
}

// TODO: why it's duplicated?
// export type CompanyDocument = schema.components['schemas']['JCompanyDocument']
// export type Document = schema.components['schemas']['JOrderDocument']
