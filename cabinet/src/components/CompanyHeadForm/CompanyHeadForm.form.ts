import { FormInputShortConfig, FormInputType } from 'library/helpers/form'

import { CompanyFounderDto } from 'orient-ui-library/library/models/proxy'

export const founderFields: FormInputShortConfig<CompanyFounderDto>[] = [
  [ 'lastName' ],
  [ 'firstName' ],
  [ 'secondName' ],
  [ 'inn', FormInputType.INN ],
  [ 'ownership', FormInputType.Percent ],
  [ 'isIo', FormInputType.Switcher ],
  [ 'isAttorney', FormInputType.Switcher ],
  [ 'phone' ],
].map(item => ([
  'companyFounder',
  ...item,
] as FormInputShortConfig<CompanyFounderDto>))

const passportFields: FormInputShortConfig<CompanyFounderDto>[] = [
  [ 'passportType' ],
  [ 'passportSeries' ],
  [ 'passportNumber' ],
  [ 'passportIssueDate', FormInputType.Date ],
  [ 'passportIssuePlace' ],
  [ 'passportIssuerCode' ],
  [ 'passportIssuerName' ],
  [ 'birthdate', FormInputType.Date ],
  [ 'birthplace' ],
  [ 'isMaleGender', FormInputType.Switcher ],
  [ 'passportValidDate', FormInputType.Date ],
  [ 'nationality' ],
  [ 'address' ],
].map(item => ([
  'companyFounder',
  ...item,
] as FormInputShortConfig<CompanyFounderDto>))

export const passportHeaderFieldNames = [ 'passportType', 'isMaleGender' ]
export const passportFooterFieldNames = [ 'birthdate', 'birthplace', 'address' ]

export const ruPassportFieldNames = [ 'passportSeries', 'passportNumber', 'passportIssueDate', 'passportIssuerCode', 'passportIssuerName' ]
export const uzPassportFieldNames = [ 'passportSeries', 'passportNumber', 'passportIssueDate', 'passportValidDate', 'passportIssuerName', 'nationality' ]
export const uzIdFieldNames = [ 'passportNumber', 'passportIssueDate', 'passportValidDate', 'passportIssuerName', 'nationality' ]

export const getPassportFieldsConfig = (names: string[]) => passportFields.filter(([ _, name ]) => names.includes(name))

export const dateFieldNames = [ 'birthdate', 'passportIssueDate', 'passportValidDate' ]
