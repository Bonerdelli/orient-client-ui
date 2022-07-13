import { FormInputShortConfig, FormInputType } from 'library/helpers/form'

import { CompanyFounderDto } from 'orient-ui-library/library/models/proxy'

export const founderFields: FormInputShortConfig<CompanyFounderDto>[] = [
  [ 'lastName', FormInputType.Text, true ],
  [ 'firstName', FormInputType.Text, true ],
  [ 'secondName', FormInputType.Text, false ],
  [ 'inn', FormInputType.INN, false ],
  [ 'ownership', FormInputType.Percent, true ],
  [ 'isIo', FormInputType.Switcher, true ],
  [ 'isAttorney', FormInputType.Switcher, true ],
  [ 'phoneNumber', FormInputType.Text, true ],
].map(item => ([
  'companyFounder',
  ...item,
] as FormInputShortConfig<CompanyFounderDto>))

const passportFields: FormInputShortConfig<CompanyFounderDto>[] = [
  [ 'passportType', FormInputType.Text, true ],
  [ 'passportSeries', FormInputType.Text, true ],
  [ 'passportNumber', FormInputType.Text, true ],
  [ 'passportIssueDate', FormInputType.Date, true ],
  [ 'passportIssuePlace', FormInputType.Text, true ],
  [ 'passportIssuerCode', FormInputType.Text, true ],
  [ 'passportIssuerName', FormInputType.Text, true ],
  [ 'birthdate', FormInputType.Date, true ],
  [ 'birthplace', FormInputType.Text, true ],
  [ 'isMaleGender', FormInputType.Switcher, true ],
  [ 'passportValidDate', FormInputType.Date, true ],
  [ 'nationality', FormInputType.Text, true ],
  [ 'address', FormInputType.Text, true ],
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

export const initialHeadFormValues: CompanyFounderDto = {
  isIo: false,
  isAttorney: false,
  isMaleGender: true,
}
