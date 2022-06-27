import { FormInputShortConfig, FormInputType } from 'library/helpers/form'

import { CompanyRequisites } from 'orient-ui-library/library/models/proxy'

const formFields: FormInputShortConfig<CompanyRequisites>[] = [
  [ 'companyRequisites', 'bankName',      FormInputType.Text,          true ],
  [ 'companyRequisites', 'mfo',           FormInputType.Numeric,       true ],
  [ 'companyRequisites', 'accountNumber', FormInputType.AccountNumber, true ],
]

export default formFields
