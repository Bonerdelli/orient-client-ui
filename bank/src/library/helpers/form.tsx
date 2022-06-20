import { isUndefined } from 'lodash'

import { Input, Select, DatePicker, Switch, Checkbox, Radio } from 'antd'
import { Rule as ValidationRule } from 'antd/es/form'

import { FormProps } from 'antd/es/form/'
import { ScreenMap } from 'antd/es/_util/responsiveObserve'

import FormTextItem from 'components/FormTextItem'
import FormItemWrapper from 'components/FormItemWrapper'

import portalConfig from 'config/portal.yaml'

const ACCOUNT_NUMBER_LENGTH = portalConfig.dataEntry.accountNumberLength
const INN_NUMBER_LENGTH = 9 // TODO: use config portalConfig.dataEntry.innNumberLength

export enum FormInputType {
  'Text',
  'TextArea',
  'Select',
  'CheckBox',
  'Radio',
  'Switcher',
  'Date',
  'DatePeriod',
  'Numeric',
  'Percent',
  'Integer',
  'AccountNumber',
  'INN',
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
const renderFormInputField = (type: FormInputType, isEditable: boolean) => {
  switch (type) {
    case FormInputType.TextArea: {
      return <Input disabled={!isEditable} />
    }
    case FormInputType.Select: {
      return <Select disabled={!isEditable} />
    }
    case FormInputType.CheckBox: {
      return <Checkbox disabled={!isEditable} />
    }
    case FormInputType.Radio: {
      return <Radio disabled={!isEditable} />
    }
    case FormInputType.Switcher: {
      return <Switch disabled={!isEditable} />
    }
    case FormInputType.Date: {
      return <></> // <DatePicker disabled={!isEditable} />
    }
    case FormInputType.DatePeriod: {
      return <></> // <DatePicker disabled={!isEditable} />
    }
    case FormInputType.Numeric: {
      return <Input disabled={!isEditable} />
    }
    case FormInputType.Integer: {
      return <Input disabled={!isEditable} type="number" />
    }
    case FormInputType.Percent: {
      return <Input disabled={!isEditable} suffix='%' />
    }
    case FormInputType.AccountNumber: {
      return <Input disabled={!isEditable} maxLength={ACCOUNT_NUMBER_LENGTH} />
    }
    case FormInputType.INN: {
      return <Input disabled={!isEditable} maxLength={INN_NUMBER_LENGTH} />
    }
    default: {
      throw new Error('Unknown form item type')
    }
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
  const rules: ValidationRule[] = []

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

  if (type === FormInputType.Percent ||
      type === FormInputType.Numeric) {
    // NOTE: doesn't work because of
    //   https://stackoverflow.com/questions/65292936/why-number-validate-rule-doesnt-work-in-antd
    // TODO: fixme or use NumericInput
    // rules.push({
    //   type: 'number'
    // })
  }

  if (type === FormInputType.AccountNumber ||
      type === FormInputType.Integer) {
    // NOTE: doesn't work because of
    //   https://stackoverflow.com/questions/65292936/why-number-validate-rule-doesnt-work-in-antd
    // TODO: fixme or use NumericInput
    // rules.push({
    //   type: 'integer'
    // })
    rules.push({
      pattern: /^\d*$/
    })
  }

  if (type === FormInputType.AccountNumber) {
    rules.push({
      len: ACCOUNT_NUMBER_LENGTH
    })
  }

  return (
    <FormItemWrapper
      model={model}
      field={name as string}
      isRequired={isRequired ?? false}
      validationRules={rules}
    >
      {renderFormInputField(type, isEditable)}
    </FormItemWrapper>
  )
}

/**
 * Base antd form layout configuration
 */
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

/**
 * Two-columns antd form layout configuration
 */
export const twoColumnFormConfig = (bp: ScreenMap): FormProps => ({
  ...baseFormConfig(bp),
  labelCol: {
    xs: { span: 24 },
    lg: { span: 10 },
  },
  wrapperCol: {
  },
})
