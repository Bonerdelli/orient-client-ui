import { FormInstance } from 'antd'

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
  form: FormInstance,
  model: string,
  field: string,
  isRequired: boolean,
  isEditable = false,
  isEditableInline = false,
) => (
  isEditableInline ?
    <FormTextItemEditable
      form={form}
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
  form: FormInstance,
  inputConfig: FormInputConfig[],
) => inputConfig.map(item => renderTextInput(form, ...item))
