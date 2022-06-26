import { useTranslation } from 'react-i18next'
import { Button, Col, Divider, Form, Input, Radio, Row, Typography } from 'antd'
import React, { useState } from 'react'
import { EditOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { QuestionnaireFormData } from 'components/QuestionnaireForm/models/questionnaire-form.interface'

type ExpirationsState = [
  budget: boolean,
  offBudget: boolean,
  salary: boolean,
  credits: boolean,
]

const QuestionnaireCreditExpirationsFormFields: React.FC = () => {
  const { t } = useTranslation()
  const { Title } = Typography
  const form = Form.useFormInstance<QuestionnaireFormData>()
  const [ hasTrials, setHasTrials ] = useState<boolean>(form.getFieldValue('hasTrials'))
  const [ expirationsState, setExpirationsState ] = useState<ExpirationsState>([
    form.getFieldValue('creditExpirations')[0].isExpired,
    form.getFieldValue('creditExpirations')[1].isExpired,
    form.getFieldValue('creditExpirations')[2].isExpired,
    form.getFieldValue('creditExpirations')[3].isExpired,
  ])

  const yesNoOptions = [
    { label: t('questionnaire.common.yes'), value: true },
    { label: t('questionnaire.common.no'), value: false },
  ]

  const formItemLayout = {
    labelCol: { span: 9 },
    wrapperCol: { span: 'auto' },
    labelAlign: 'left' as any,
    required: true,
  }
  const inputLayout = {
    suffix: <EditOutlined/>,
  }

  const handleIsExpiredChange = (expirationIndex: number) => {
    setExpirationsState(state => {
      const newState = [ ...state ]
      newState[expirationIndex] = !newState[expirationIndex]
      return newState as any
    })
  }

  const handleTrialsChange = () => {
    setHasTrials(!hasTrials)
  }

  const renderCreditExpirationsRows = () => (
    <Form.List name="creditExpirations">
      {(fields) => (<>
        {fields.map((field) => (
          <Row key={field.key}
               gutter={16}
          >
            <Col span={9}>
              <Form.Item name={[ field.name, 'isExpired' ]}
                         {...formItemLayout}
                         labelCol={{ span: 12 }}
                         label={t(`questionnaire.creditExpirations.${field.key}`)}>
                <Radio.Group options={yesNoOptions}
                             onChange={() => handleIsExpiredChange(field.key)}/>
              </Form.Item>
            </Col>
            {expirationsState[field.key] && <Col span={12}>
              <Form.Item name={[ field.name, 'reason' ]}
                         {...formItemLayout}
                         label={t('questionnaire.creditExpirations.debtReason')}>
                <Input {...inputLayout}/>
              </Form.Item>
            </Col>}
          </Row>
        ))}
      </>)}
    </Form.List>
  )

  const renderTrialsRows = () => (
    <Form.List name="trials">
      {(fields, { add, remove }) => (<>
        {fields.map((field) => (
          <React.Fragment key={field.key}>
            {renderTrialsRow(field, [ 'complainant', 'reason' ], false)}
            {renderTrialsRow(field, [ 'amount', 'result' ], true, field.key > 0 ? remove : undefined)}
            <Divider/>
          </React.Fragment>
        ))}

        <Form.Item>
          <Button onClick={() => add()}
                  type="primary"
                  icon={<PlusOutlined/>}
          >
            {t('questionnaire.common.add')}
          </Button>
        </Form.Item>
      </>)}
    </Form.List>
  )

  const renderTrialsRow = (
    field: any,
    controlNames: string[],
    noMarginBottom: boolean,
    remove?: (index: number | number[]) => void,
  ) => {
    return (
      <Row gutter={16}>
        {controlNames.map((controlName, index) => (
          <Col key={`${field.key}_${controlName}`}
               span={!!index ? 9 : 6}
          >
            <Form.Item name={[ field.name, controlName ]}
                       wrapperCol={{ span: 'auto' }}
                       labelAlign="left"
                       required
                       style={noMarginBottom ? { marginBottom: '0px' } : undefined}
                       label={t(`questionnaire.creditExpirations.${controlName}`)}>
              <Input {...inputLayout}/>
            </Form.Item>
          </Col>
        ))}
        {!!remove && <Col span={1}>
          <Form.Item wrapperCol={{ span: 'auto' }}
                     style={noMarginBottom ? { marginBottom: '0px' } : undefined}
          >
            <MinusCircleOutlined onClick={() => remove(field.name)}/>
          </Form.Item>
        </Col>}
      </Row>
    )
  }

  return (
    <>
      <Title level={5}>
        {t('questionnaire.creditExpirations.title')}
      </Title>
      {renderCreditExpirationsRows()}
      <Form.Item name="hasTrials"
                 labelCol={{ span: 12 }}
                 labelAlign="left"
                 label={t('questionnaire.creditExpirations.hasTrials')}>
        <Radio.Group options={yesNoOptions}
                     onChange={handleTrialsChange}/>
      </Form.Item>
      {hasTrials && renderTrialsRows()}
    </>
  )
}

export default QuestionnaireCreditExpirationsFormFields
