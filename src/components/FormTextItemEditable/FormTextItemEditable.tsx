import { ChangeEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Input, Tooltip, Button } from 'antd'
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons'

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
  const [ prevValue, setPrevValue ] = useState<string>()
  const [ value, setValue ] = useState<string>()

  const name = groupFields ? `${model}.${field}` : field

  const requiredRule = {
    required: true,
  }

  const handleEdit = (e: ChangeEvent<HTMLInputElement>) => {
    if (!editing) {
      setEditing(true)
      setPrevValue(e.target?.value)
    }
  }
  const handleSave = () => {
    setEditing(false)
  }
  const handleCancel = () => {
    setValue(prevValue)
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
        value={value}
        disabled={!isEditable}
        onChange={handleEdit}
        suffix={editing ? renderActions() : renderEditIcon()}
      />
    </FormItem>
  )
}

export default FormTextItemEditable
