/* TODO: move to ui-lib after debugging */

import * as schema from '../api/schema'

export type Company = schema.components['schemas']['JCompany']
export type CompanyContacts = schema.components['schemas']['JCompanyContacts']
export type CompanyRequisites = schema.components['schemas']['JCompanyRequisites']
export type CompanyHead = schema.components['schemas']['JCompanyFounder'] // NOTE: founder is not head

// NOTE: for a some reason this type doesn't not exported correctly
// export type OrderDocument = schema.components['schemas']['OrderDocumentsResponse']

export type CompanyDocument = schema.components['schemas']['CompanyDocumentsResponse']
export type CompanyQuestionnaire = schema.components['schemas']['CompanyQuestionnaire']


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
