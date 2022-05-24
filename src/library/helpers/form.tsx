import FormTextItem from 'components/FormTextItem'

export type FormInputConfig = [
  string,  // Model
  string,  // Name
  boolean, // Is Required
  boolean? // Is Editable
]

export const renderTextInput = (
  model: string,
  field: string,
  isRequired: boolean,
  isEditable = false,
) => (
  <FormTextItem
    model={model}
    field={field}
    isRequired={isRequired}
    isEditable={isEditable}
  />
)

export const renderTextInputs = (
  inputConfig: FormInputConfig[]
) => inputConfig.map(item => renderTextInput(...item))
