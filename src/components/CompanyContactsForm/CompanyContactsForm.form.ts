import { FormInputShortConfig, FormInputType } from 'library/helpers/form'

import { CompanyContact } from 'library/models/proxy' // TODO: to ui-lib

const formFields: FormInputShortConfig<CompanyContact>[] = [
  [ 'companyContact', 'primaryEmail', FormInputType.Text, true ],
  [ 'companyContact', 'additionalEmail'    ],
  [ 'companyContact', 'primaryPhone'       ],
  [ 'companyContact', 'additionalPhone'    ],
  [ 'companyContact', 'site'               ],
]

export default formFields
