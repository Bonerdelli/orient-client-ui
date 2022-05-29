import { FormInputConfig } from 'library/helpers/form'

const formFields: Record<string, FormInputConfig[]> = {
  main: [
    [ 'company', 'fullName', true ],
    [ 'company', 'shortName', false, true ],
    [ 'company', 'inn', true ],
    [ 'company', 'opf', true ],
    // TODO: make a two-cols layout
    [ 'company', 'isMsp', true ],
    [ 'company', 'capital', true ],
    [ 'company', 'currency', true ],
    [ 'company', 'oked', true ],
    [ 'company', 'soogu', true ],
    [ 'company', 'state', true ],
  ],
  contacts: [
    [ 'companyContact', 'primaryEmail',    false ],
    [ 'companyContact', 'additionalEmail', false ],
    [ 'companyContact', 'primaryPhone',    true ],
    [ 'companyContact', 'additionalPhone', true ],
  ],
  regAuthority: [
    [ 'company', 'regAuthority', true ],
    [ 'company', 'regDate', true ],
    [ 'company', 'regNumber', true ],
  ],
  founder: [
    [ 'companyFounder', 'lastName', true ], // TODO: ask for compound field
    [ 'companyFounder', 'inn', false ],
  ],
}

export default formFields
