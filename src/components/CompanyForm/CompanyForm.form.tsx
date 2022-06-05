import FormTextItem from 'components/FormTextItem'
import FormTextItemEditable from 'components/FormTextItemEditable'

export type CompanyFormInputConfig = [
  string,   // Model
  string,   // Name
  boolean,  // Is Required
  boolean?, // Is Editable
  boolean?, // Editable inline
]

const formFields: Record<string, CompanyFormInputConfig[]> = {
  main: [
    [ 'company', 'fullName', true ],
    [ 'company', 'shortName', false, true, true ],
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

export const renderTextInput = (
  model: string,
  field: string,
  isRequired: boolean,
  isEditable = false,
  isEditableInline = false,
) => (
  isEditableInline ?
    <FormTextItemEditable
      model={model}
      field={field}
      isRequired={isRequired}
      isEditable={isEditable}
    /> : <FormTextItem
      model={model}
      field={field}
      isRequired={isRequired}
      isEditable={isEditable}
    />
)

export const renderTextInputs = (
  inputConfig: CompanyFormInputConfig[],
) => inputConfig.map(item => renderTextInput(...item))

export default formFields
