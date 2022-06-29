import { FormInputShortConfig, FormInputType } from 'library/helpers/form'

import { CompanyFounderDto } from 'orient-ui-library/library/models/proxy'

const formFields: FormInputShortConfig<CompanyFounderDto>[] = [
  [ 'lastName' ],
  [ 'firstName' ],
  [ 'secondName' ],
  [ 'inn', FormInputType.INN ],
  [ 'ownership', FormInputType.Percent ],
  [ 'isIo', FormInputType.Switcher ],
  [ 'isAttorney', FormInputType.Switcher ],
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
  [ 'phone' ],
].map(item => ([
  'companyFounder',
  ...item,
] as FormInputShortConfig<CompanyFounderDto>))

export default formFields
