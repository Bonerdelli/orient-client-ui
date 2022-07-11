import { FormInputShortConfig, FormInputType } from 'library/helpers/form'

import { CompanyContactsDto } from 'orient-ui-library/library/models/proxy'

const formFields: FormInputShortConfig<CompanyContactsDto>[] = [
  [ 'companyContact', 'primaryEmail', FormInputType.Text ],
  [ 'companyContact', 'additionalEmail' ],
  [ 'companyContact', 'primaryPhone' ],
  [ 'companyContact', 'additionalPhone' ],
  [ 'companyContact', 'site' ],
]

export default formFields
