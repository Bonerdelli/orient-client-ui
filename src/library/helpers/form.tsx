import FormTextItem from 'components/FormTextItem'
import FormTextItemEditable from 'components/FormTextItemEditable'

export type FormInputConfig = [
  string,   // Model
  string,   // Name
  boolean,  // Is Required
  boolean?, // Is Editable
  boolean?, // Editable inline
]

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
  inputConfig: FormInputConfig[]
) => inputConfig.map(item => renderTextInput(...item))
