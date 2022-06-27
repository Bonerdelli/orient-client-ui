import { useTranslation } from 'react-i18next'
import { Form, Input, Radio, Typography } from 'antd'
import { useState } from 'react'
import { EditOutlined } from '@ant-design/icons'
import { QuestionnaireFormData } from 'components/QuestionnaireForm/models/questionnaire-form.interface'


const QuestionnaireHoldingFormFields: React.FC = () => {
  const { t } = useTranslation()
  const { Title } = Typography
  const form = Form.useFormInstance<QuestionnaireFormData>()
  const [ isHoldingFieldsVisible, setHoldingFieldsVisible ] = useState<boolean>(
    form.getFieldValue('belongsToHoldings'),
  )
  const formItemLayout = {
    required: true,
    labelAlign: 'left' as any,
  }
  const inputLayout = {
    suffix: <EditOutlined/>,
  }
  const belongsToHoldingsOptions = [
    { label: t('questionnaire.common.yes'), value: true },
    { label: t('questionnaire.common.no'), value: false },
  ]

  const onBelongsToHoldingsChange = () => {
    setHoldingFieldsVisible(!isHoldingFieldsVisible)
  }

  const renderHoldingFields = (names: string[]) => (<>
    {names.map(name =>
      <Form.Item {...formItemLayout}
                 key={name}
                 name={name}
                 label={t(`questionnaire.holdings.${name}`)}
      >
        <Input {...inputLayout}/>
      </Form.Item>)
    }
  </>)

  return (
    <>
      <Title level={5}>
        {t('questionnaire.holdings.title')}
      </Title>
      <Form.Item name="belongsToHoldings"
                 labelCol={{ span: 7 }}
                 labelAlign="left"
                 label={t('questionnaire.holdings.belongsToHoldings')}
      >
        <Radio.Group onChange={onBelongsToHoldingsChange}
                     options={belongsToHoldingsOptions}/>
      </Form.Item>
      {isHoldingFieldsVisible && renderHoldingFields(
        [ 'holdingName', 'headCompanyName', 'headCompanyInn' ],
      )}
    </>
  )
}

export default QuestionnaireHoldingFormFields
