/* TODO: move to ui-lib after debugging */

import * as schema from 'orient-ui-library/library/api/schema'

export type Company = schema.components['schemas']['JCompany']
export type CompanyContacts = schema.components['schemas']['JCompanyContacts']
export type CompanyRequisites = schema.components['schemas']['JCompanyRequisites']
export type CompanyDocument = schema.components['schemas']['JCompanyDocument']
export type CompanyHead = schema.components['schemas']['JCompanyFounder'] // NOTE: founder is not head
