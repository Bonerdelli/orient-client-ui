import { useTranslation } from 'react-i18next'
import { Form, Input } from 'antd'

import './FormTextItem.style.less'

const { Item: FormItem } = Form

export interface FormTextItemProps {
  model: string
  field: string
  isRequired: boolean
  isEditable?: boolean
}

const FormTextItem: React.FC<FormTextItemProps> = ({ model, field, isRequired, isEditable = false }) => {
  const { t } = useTranslation()
  const requiredRule = {
    required: true,
  }
  return (
    <FormItem
      key={`${model}.${field}`}
      name={`${model}.${field}`}
      label={t(`models.${model}.fields.${field}.title`)}
      rules={isRequired ? [requiredRule] : []}
    >
      <Input disabled={!isEditable} />
    </FormItem>
  )
}

export default FormTextItem
