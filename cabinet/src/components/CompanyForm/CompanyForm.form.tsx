import FormTextItem from 'orient-ui-library/components/FormTextItem'
import FormTextItemEditable from 'orient-ui-library/components/FormTextItemEditable'

export type CompanyFormInputConfig = [
  model: string,
  name: string,
  isRequired: boolean,
  isEditable?: boolean,
  editableInline?: boolean,
  isMultilineContent?: boolean,
]

const formFields: Record<string, CompanyFormInputConfig[]> = {
  main: [
    [ 'company', 'fullName', false, false, false, true ],
    [ 'company', 'shortName', false, true, true ],
    [ 'company', 'inn', false ],
    [ 'company', 'opf', false, false, false, true ],
    // TODO: make a two-columns layout
    [ 'company', 'isMsp', false ],
    [ 'company', 'capital', false ],
    [ 'company', 'currencyCode', false ],
    [ 'company', 'oked', false, false, false, true ],
    [ 'company', 'soogu', false, false, false, true ],
    [ 'company', 'state', false ],
  ],
  contacts: [
    [ 'companyContact', 'email', false ],
    [ 'companyContact', 'phones', false ],
    [ 'companyContact', 'soato', false, false, false, true ],
    [ 'companyContact', 'address', false, false, false, true ],
    [ 'companyContact', 'soatoFact', false, true, true ],
    [ 'companyContact', 'addressFact', false, true, true ],
  ],
  regAuthority: [
    [ 'company', 'regAuthority', false, false, false, true ],
    [ 'company', 'regDate', false ],
    [ 'company', 'regNumber', false ],
  ],
  founder: [
    [ 'companyFounder', 'inn', false ],
  ],
}

export const renderFieldWithSaveHandler = (config: CompanyFormInputConfig, saveFn: () => void) => {
  return (
    <FormTextItemEditable
      key={`${config[0]}-${config[1]}`}
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
  isMultilineContent = false,
) => (
  isEditableInline ?
    <FormTextItemEditable
      key={`${model}-${field}`}
      model={model}
      field={field}
      isRequired={isRequired}
      isEditable={isEditable}
    /> : <FormTextItem
      key={`${model}-${field}`}
      model={model}
      field={field}
      isRequired={isRequired}
      isEditable={isEditable}
      isMultilineContent={isMultilineContent}
    />
)

export const renderTextInputs = (
  inputConfig: CompanyFormInputConfig[],
) => inputConfig.map(item => renderTextInput(...item))

export default formFields
