import { FormProps } from 'antd/es/form/'
import { ScreenMap } from 'antd/es/_util/responsiveObserve'

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

export function renderFormInputs<T = unknown> (
  inputConfig: FormInputShortConfig<T>[],
) {
  return inputConfig.map(inputConfig => {
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
}

export const baseFormConfig = (bp: ScreenMap): FormProps => ({
  labelCol: {
    xs: { span: 24 },
    md: { span: 10 },
    lg: { span: 10 },
  },
  wrapperCol: {
    md: { flex: 1 },
    lg: { span: 14 },
  },
  labelAlign: bp.xs || bp.sm ? 'left' : 'right',
  requiredMark: false,
  colon: false,
  labelWrap: true,
})

export const twoColumnFormConfig = (bp: ScreenMap): FormProps => ({
  ...baseFormConfig(bp),
  labelCol: {
    xs: { span: 24 },
    lg: { span: 10 },
  },
  wrapperCol: {
  },
})
