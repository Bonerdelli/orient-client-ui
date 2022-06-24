/* TODO: move to ui-lib after debugging */

import * as schema from 'orient-ui-library/library/api/schema';

export type Company = schema.components['schemas']['JCompany']
export type CompanyContacts = schema.components['schemas']['JCompanyContacts']
export type CompanyRequisites = schema.components['schemas']['JCompanyRequisites']
export type CompanyHead = schema.components['schemas']['JCompanyFounder'] // NOTE: founder is not head

export type OrderDocument = schema.components['schemas']['OrderDocumentsResponse']
export type CompanyDocument = schema.components['schemas']['CompanyDocumentsResponse']

export type QuestionnaireDto = schema.components['schemas']['CompanyQuestionnaire'];

// TODO: why it's duplicated?
// export type CompanyDocument = schema.components['schemas']['JCompanyDocument']
// export type Document = schema.components['schemas']['JOrderDocument']
