import { useTranslation } from 'react-i18next'
import { Form } from 'antd'

import './FormItemWrapper.style.less'

const { Item: FormItem } = Form

export interface FormItemWrapperProps {
  model: string
  field: string
  isRequired: boolean
  isEditable?: boolean
  groupFields?: boolean
  children: JSX.Element
}

const FormItemWrapper: React.FC<FormItemWrapperProps> = ({ model, field, isRequired, children, groupFields = false }) => {
  const { t } = useTranslation()
  const name = groupFields ? `${model}.${field}` : field
  const requiredRule = {
    required: true,
  }
  return (
    <FormItem
      key={name}
      name={name}
      label={t(`models.${model}.fields.${field}.title`)}
      rules={isRequired ? [requiredRule] : []}
    >
      {children}
    </FormItem>
  )
}

export default FormItemWrapper
