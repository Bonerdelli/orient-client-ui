import { FormInputShortConfig, FormInputType } from 'library/helpers/form'

import { CompanyContacts } from 'orient-ui-library/library/models/proxy'

const formFields: FormInputShortConfig<CompanyContacts>[] = [
  [ 'companyContact', 'primaryEmail', FormInputType.Text, true ],
  [ 'companyContact', 'additionalEmail'    ],
  [ 'companyContact', 'primaryPhone'       ],
  [ 'companyContact', 'additionalPhone'    ],
  [ 'companyContact', 'site'               ],
]

export default formFields
