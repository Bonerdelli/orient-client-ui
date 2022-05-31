import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Input, Tooltip, Button } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

import './FormTextItemEditable.style.less'

const { Item: FormItem } = Form
const { Group: InputGroup } = Input

export interface FormTextItemEditableProps {
  model: string
  field: string
  isRequired: boolean
  isEditable?: boolean
  groupFields?: boolean
}

const FormTextItemEditable: React.FC<FormTextItemEditableProps> = ({ model, field, isRequired, isEditable = false, groupFields = false }) => {
  const { t } = useTranslation()
  const [ editing, setEditing ] = useState<boolean>()
  const name = groupFields ? `${model}.${field}` : field
  const requiredRule = {
    required: true,
  }
  const handleSave = () => {
    setEditing(false)
  }
  const handleCancel = () => {
    setEditing(false)
  }
  const renderActions = () => (
    <>
      <Tooltip key="save" title={t('common.actions.save')}>
        <Button
          type="link"
          size="small"
          onClick={handleSave}
          icon={<CheckOutlined />}
        />
      </Tooltip>
      <Tooltip key="cancel" title={t('common.actions.cancel')}>
        <Button danger
          type="link"
          size="small"
          onClick={handleCancel}
          icon={<CloseOutlined />}
        />
      </Tooltip>
    </>
  )
  return (
    <FormItem
      key={name}
      name={name}
      label={t(`models.${model}.fields.${field}.title`)}
      rules={isRequired ? [requiredRule] : []}
    >
      <Input
        disabled={!isEditable}
        onChange={() => setEditing(true)}
        suffix={editing && renderActions()}
      />
    </FormItem>
  )
}

export default FormTextItemEditable
