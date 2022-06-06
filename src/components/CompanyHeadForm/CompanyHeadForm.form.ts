import { FormInputShortConfig, FormInputType } from 'library/helpers/form'

import { CompanyHead } from 'library/models/proxy' // TODO: to ui-lib

const formFields: FormInputShortConfig<CompanyHead>[] = [
  ['companyFounder', 'lastName'           ], // string
  ['companyFounder', 'firstName'          ], // string
  ['companyFounder', 'secondName'         ], // string
  ['companyFounder', 'inn'                ], // string
  ['companyFounder', 'ownership'          ], // bigint
  ['companyFounder', 'isIo'               ], // boolean
  ['companyFounder', 'isAttorney'         ], // boolean
  ['companyFounder', 'passportType'       ], // string
  ['companyFounder', 'passportSeries'     ], // string
  ['companyFounder', 'passportNumber'     ], // string
  ['companyFounder', 'passportIssueDate'  ], // Date
  ['companyFounder', 'passportIssuePlace' ], // string
  ['companyFounder', 'passportIssuerCode' ], // string
  ['companyFounder', 'passportIssuerName' ], // string
  ['companyFounder', 'birthdate'          ], // Date
  ['companyFounder', 'birthplace'         ], // string
  ['companyFounder', 'isMaleGender'       ], // boolean
  ['companyFounder', 'passportValidDate'  ], // Date
  ['companyFounder', 'nationality'        ], // string
  ['companyFounder', 'address'            ], // string
]

export default formFields
