import { FormInputShortConfig, FormInputType } from 'library/helpers/form'

import { CompanyHead } from 'library/models/proxy' // TODO: to ui-lib

const formFields: FormInputShortConfig<CompanyHead>[] = [
  ['companyFounder', 'lastName'           ],
  ['companyFounder', 'firstName'          ],
  ['companyFounder', 'secondName'         ],
  ['companyFounder', 'inn'                ],
  ['companyFounder', 'ownership'          ], // bigint
  ['companyFounder', 'isIo',              FormInputType.Switcher],
  ['companyFounder', 'isAttorney',        FormInputType.Switcher],
  ['companyFounder', 'passportType'       ],
  ['companyFounder', 'passportSeries'     ],
  ['companyFounder', 'passportNumber'     ],
  ['companyFounder', 'passportIssueDate', FormInputType.Date],
  ['companyFounder', 'passportIssuePlace' ],
  ['companyFounder', 'passportIssuerCode' ],
  ['companyFounder', 'passportIssuerName' ],
  ['companyFounder', 'birthdate',         FormInputType.Date],
  ['companyFounder', 'birthplace'         ],
  ['companyFounder', 'isMaleGender',      FormInputType.Switcher],
  ['companyFounder', 'passportValidDate', FormInputType.Date],
  ['companyFounder', 'nationality'        ],
  ['companyFounder', 'address'            ],
]

export default formFields
