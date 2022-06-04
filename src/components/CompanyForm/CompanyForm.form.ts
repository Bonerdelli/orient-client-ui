import { FormInputConfig } from 'library/helpers/form'

const formFields: Record<string, FormInputConfig[]> = {
  main: [
    [ 'company', 'fullName', false ],
    [ 'company', 'shortName', false, true, true ],
    [ 'company', 'inn', false ],
    [ 'company', 'opf', false ],
    // TODO: make a two-cols layout
    [ 'company', 'isMsp', false ],
    [ 'company', 'capital', false ],
    [ 'company', 'currency', false ],
    [ 'company', 'oked', false ],
    [ 'company', 'soogu', false ],
    [ 'company', 'state', false ],
  ],
  contacts: [
    [ 'companyContact', 'primaryEmail',    false ],
    [ 'companyContact', 'additionalEmail', false ],
    [ 'companyContact', 'primaryPhone',    false ],
    [ 'companyContact', 'additionalPhone', false ],
  ],
  regAuthority: [
    [ 'company', 'regAuthority', false ],
    [ 'company', 'regDate', false ],
    [ 'company', 'regNumber', false ],
  ],
  founder: [
    [ 'companyFounder', 'lastName', false ], // TODO: ask for compound field
    [ 'companyFounder', 'inn', false ],
  ],
}

export default formFields
