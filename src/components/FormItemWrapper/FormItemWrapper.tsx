import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Form } from 'antd'
import { Rule } from 'antd/es/form'

import './FormItemWrapper.style.less'

const { Item: FormItem } = Form

export interface FormItemWrapperProps {
  model: string
  field: string
  isRequired: boolean
  isEditable?: boolean
  groupFields?: boolean
  validationRules?: Rule[]
  children: JSX.Element
}

const FormItemWrapper: React.FC<FormItemWrapperProps> = ({
  model,
  field,
  isRequired,
  children,
  groupFields = false,
  validationRules = [],
}) => {
  const { t } = useTranslation()
  const name = groupFields ? `${model}.${field}` : field
  const [ rules, setRules ] = useState<Rule[]>([])

  useEffect(() => {
    // NOTE: does not support dynamically change
    // TODO: add useEffect for it
    if (isRequired) {
      validationRules.push({
        required: true,
      })
    }
    setRules(validationRules)
  }, [])

  return (
    <FormItem
      key={name}
      name={name}
      label={t(`models.${model}.fields.${field}.title`)}
      rules={rules}
    >
      {children}
    </FormItem>
  )
}

export default FormItemWrapper
