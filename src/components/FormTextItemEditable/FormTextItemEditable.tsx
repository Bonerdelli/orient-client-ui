import { ChangeEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, FormInstance, Input, Tooltip, Button } from 'antd'
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons'

import './FormTextItemEditable.style.less'

const { Item: FormItem } = Form

export interface FormTextItemEditableProps {
  form: FormInstance
  model: string
  field: string
  isRequired: boolean
  isEditable?: boolean
  groupFields?: boolean
}

const FormTextItemEditable: React.FC<FormTextItemEditableProps> = ({
  form,
  model,
  field,
  isRequired,
  isEditable = false,
  groupFields = false,
}) => {
  const { t } = useTranslation()
  const [ editing, setEditing ] = useState<boolean>()
  const name = groupFields ? `${model}.${field}` : field

  const requiredRule = {
    required: true,
  }

  const handleEdit = () => {
    if (!editing) {
      setEditing(true)
    }
  }
  const handleSave = () => {
    setEditing(false)
  }
  const handleCancel = () => {
    form?.resetFields([ name ])
    setEditing(false)
  }

  const renderActions = () => (
    <>
      <Tooltip key="save" title={t('common.actions.save.title')}>
        <Button
          type="link"
          size="small"
          onClick={handleSave}
          icon={<CheckOutlined />}
        />
      </Tooltip>
      <Tooltip key="cancel" title={t('common.actions.cancel.title')}>
        <Button danger
          type="link"
          size="small"
          onClick={handleCancel}
          icon={<CloseOutlined />}
        />
      </Tooltip>
    </>
  )

  const renderEditIcon = () => (
    <>
      <Tooltip title={t('common.actions.edit.title')}>
        <Button
          type="link"
          size="small"
          onClick={() => setEditing(true)}
          icon={<EditOutlined />}
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
        onChange={handleEdit}
        suffix={editing ? renderActions() : renderEditIcon()}
      />
    </FormItem>
  )
}

export default FormTextItemEditable
