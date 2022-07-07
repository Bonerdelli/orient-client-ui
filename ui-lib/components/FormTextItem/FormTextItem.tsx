import { useTranslation } from 'react-i18next'
import { Form, Input } from 'antd'

import './FormTextItem.style.less'

const { Item: FormItem } = Form
const { TextArea } = Input

export interface FormTextItemProps {
  model: string
  field: string
  isRequired: boolean
  isEditable?: boolean
  groupFields?: boolean
  isMultilineContent?: boolean
}

const FormTextItem: React.FC<FormTextItemProps> = ({
  model,
  field,
  isRequired,
  isEditable = false,
  groupFields = false,
  isMultilineContent = false,
}) => {
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
      rules={isRequired ? [ requiredRule ] : []}
    >
      {isMultilineContent
        ? <TextArea disabled={!isEditable} autoSize/>
        : <Input disabled={!isEditable}/>}
    </FormItem>
  )
}

export default FormTextItem
