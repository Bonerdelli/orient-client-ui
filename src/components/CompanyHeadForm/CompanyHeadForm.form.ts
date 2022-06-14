import { FormInputShortConfig, FormInputType } from 'library/helpers/form'

import { CompanyHead } from 'library/models/proxy' // TODO: to ui-lib

const formFields: FormInputShortConfig<CompanyHead>[] = [
  ['lastName'           ],
  ['firstName'          ],
  ['secondName'         ],
  ['inn'                FormInputType.INN],
  ['ownership',         FormInputType.Percent],
  ['isIo',              FormInputType.Switcher],
  ['isAttorney',        FormInputType.Switcher],
  ['passportType'       ],
  ['passportSeries'     ],
  ['passportNumber'     ],
  ['passportIssueDate', FormInputType.Date],
  ['passportIssuePlace' ],
  ['passportIssuerCode' ],
  ['passportIssuerName' ],
  ['birthdate',         FormInputType.Date],
  ['birthplace'         ],
  ['isMaleGender',      FormInputType.Switcher],
  ['passportValidDate', FormInputType.Date],
  ['nationality'        ],
  ['address'            ],
].map(item => ([
  'companyFounder',
  ...item,
] as FormInputShortConfig<CompanyHead>))

export default formFields
