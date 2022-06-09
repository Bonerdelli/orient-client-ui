import { isUndefined } from 'lodash'

import { Input, Select, DatePicker, Switch, Checkbox, Radio } from 'antd'

import { FormProps } from 'antd/es/form/'
import { ScreenMap } from 'antd/es/_util/responsiveObserve'

import FormTextItem from 'components/FormTextItem'
import FormItemWrapper from 'components/FormItemWrapper'


export enum FormInputType {
  'Text',
  'TextArea',
  'Select',
  'CheckBox',
  'Radio',
  'Switcher',
  'Date',
  'DatePeriod',
}

export type FormInputShortConfig<T = unknown> = [
  string,        // Model
  keyof T,       // Name
  FormInputType?,
  boolean?,      // Is Required
  boolean?,      // Disabled
]

/**
 * Render Custom Input
 */
const renderCustomInput = (type: FormInputType, isEditable: boolean) => {
  switch (type) {
    case FormInputType.TextArea: {
      return (
        <Input disabled={!isEditable} />
      )
    }
    case FormInputType.Select: {
      return (
        <Select disabled={!isEditable} />
      )
    }
    case FormInputType.CheckBox: {
      return (
        <Checkbox disabled={!isEditable} />
      )
    }
    case FormInputType.Radio: {
      return (
        <Radio disabled={!isEditable} />
      )
    }
    case FormInputType.Switcher: {
      return (
        <Switch disabled={!isEditable} />
      )
    }
    case FormInputType.Date: {
      return (
        <DatePicker disabled={!isEditable} />
      )
    }
    case FormInputType.DatePeriod: {
      return (
        <DatePicker disabled={!isEditable} />
      )
    }
    default:
      throw new Error('Unknown form item type')
  }
}

/**
 * Render Form Inputs
 */
export function renderFormInputs<T = unknown> (
  inputsConfig: FormInputShortConfig<T>[],
) {
  return inputsConfig.map(inputConfig => renderFormInput<T>(inputConfig))
}

/**
 * Render Form Input
 */
export function renderFormInput<T = unknown> (
  inputConfig: FormInputShortConfig<T>,
) {
  const [ model, name, type, isRequired, disabled ] = inputConfig
  const isEditable = !disabled ?? true

  if (
    isUndefined(type) || // Text input by defalut
    type === FormInputType.Text
  ) {
    return (
      <FormTextItem
        model={model}
        field={name as string}
        isRequired={isRequired ?? false}
        isEditable={isEditable}
      />
    )
  }

  return (
    <FormItemWrapper
      model={model}
      field={name as string}
      isRequired={isRequired ?? false}
    >
      {renderCustomInput(type, isEditable)}
    </FormItemWrapper>
  )
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
