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
