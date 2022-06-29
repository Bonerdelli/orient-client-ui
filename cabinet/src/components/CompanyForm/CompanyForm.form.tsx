import FormTextItem from 'orient-ui-library/components/FormTextItem'
import FormTextItemEditable from 'orient-ui-library/components/FormTextItemEditable'

export type CompanyFormInputConfig = [
  model: string,
  name: string,
  isRequired: boolean,
  isEditable?: boolean,
  editableInline?: boolean,
]

const formFields: Record<string, CompanyFormInputConfig[]> = {
  main: [
    [ 'company', 'fullName', false ],
    [ 'company', 'shortName', false, true, true ],
    [ 'company', 'inn', false ],
    [ 'company', 'opf', false ],
    // TODO: make a two-columns layout
    [ 'company', 'isMsp', false ],
    [ 'company', 'capital', false ],
    [ 'company', 'currencyCode', false ],
    [ 'company', 'oked', false ],
    [ 'company', 'soogu', false ],
    [ 'company', 'state', false ],
  ],
  contacts: [
    [ 'companyContact', 'email', false ],
    [ 'companyContact', 'phones', false ],
    [ 'companyContact', 'soato', false ],
    [ 'companyContact', 'address', false ],
    [ 'companyContact', 'soatoFact', false, true, true ],
    [ 'companyContact', 'addressFact', false, true, true ],
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

export const renderFieldWithSaveHandler = (config: CompanyFormInputConfig, saveFn: () => void) => {
  return (
    <FormTextItemEditable
      model={config[0]}
      field={config[1]}
      isRequired={config[2]}
      isEditable={config[3]}
      onSave={saveFn}
    />
  )
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
