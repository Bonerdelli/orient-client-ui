import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Form, Input, Tooltip } from 'antd'
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons'

import './FormTextItemEditable.style.less'

const { Item: FormItem, useFormInstance } = Form

export interface FormTextItemEditableProps {
  model: string
  field: string
  isRequired: boolean
  isEditable?: boolean
  groupFields?: boolean
  onSave?: () => void
}

const FormTextItemEditable: React.FC<FormTextItemEditableProps> = ({
  model,
  field,
  isRequired,
  isEditable = false,
  groupFields = false,
  onSave = null,
}) => {
  const { t } = useTranslation()
  const form = useFormInstance()

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
    form?.submit() // Остается только для того чтоб не писать в каждом onSave setSubmitting(true). Можно под флаг загнать или совсем убрать, посмотрим дальше
    onSave?.()
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
          icon={<CheckOutlined/>}
        />
      </Tooltip>
      <Tooltip key="cancel" title={t('common.actions.cancel.title')}>
        <Button danger
                type="link"
                size="small"
                onClick={handleCancel}
                icon={<CloseOutlined/>}
        />
      </Tooltip>
    </>
  )

  const renderEditIcon = () => (
    <Tooltip title={t('common.actions.edit.title')}>
      <Button
        type="link"
        size="small"
        onClick={() => setEditing(true)}
        icon={<EditOutlined/>}
      />
    </Tooltip>
  )

  return (
    <FormItem
      key={name}
      name={name}
      label={t(`models.${model}.fields.${field}.title`)}
      rules={isRequired ? [ requiredRule ] : []}
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
