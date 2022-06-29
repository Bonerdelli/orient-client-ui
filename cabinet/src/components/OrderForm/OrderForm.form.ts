import { FormInputShortConfig, FormInputType } from 'library/helpers/form'

import { CompanyRequisitesDto } from 'orient-ui-library/library/models/proxy'

const formFields: FormInputShortConfig<CompanyRequisitesDto>[] = [
  [ 'companyRequisites', 'bankName', FormInputType.Text, true ],
  [ 'companyRequisites', 'mfo', FormInputType.Numeric, true ],
  [ 'companyRequisites', 'accountNumber', FormInputType.AccountNumber, true ],
]

export default formFields
