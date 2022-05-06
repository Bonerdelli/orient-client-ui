import FormTextItem from 'components/FormTextItem'

export enum FormInputType {
  'Text',
  'TextArea',
  'Select',
  'CheckBox',
  'Radio',
  'Switcher',
}

export type FormInputShortConfig<T = unknown> = [
  string,        // Model
  keyof T,       // Name
  FormInputType?,
  boolean?,      // Is Required
  boolean?,      // Disabled
]

export const renderFormInputs = (
  inputConfig: FormInputShortConfig[]
) => inputConfig.map(inputConfig => {
  const [ model, name, type, isRequired, disabled ] = inputConfig
  switch (type) {
    case undefined:
    case FormInputType.Text:
      return (
        <FormTextItem
          model={model}
          field={name as string}
          isRequired={isRequired ?? false}
          isEditable={!disabled ?? true}
        />
      )
    default:
      throw new Error('Unknown form item type')
  }
})
