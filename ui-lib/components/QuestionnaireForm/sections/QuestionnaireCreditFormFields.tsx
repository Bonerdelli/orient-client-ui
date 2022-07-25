import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Checkbox, Col, DatePicker, Divider, Form, Input, Radio, Row, Typography } from 'antd'
import { EditOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

import { QuestionnaireFormData } from '../models/questionnaire-form.interface'
import { DATE_FORMAT } from '../../../library/helpers/date'

interface QuestionnaireCreditFormFieldsProps {
  isEditable: boolean
}

const QuestionnaireCreditFormFields: React.FC<QuestionnaireCreditFormFieldsProps> = ({
  isEditable,
}) => {
  const { t } = useTranslation()
  const { Title } = Typography
  const form = Form.useFormInstance<QuestionnaireFormData>()
  const [ isCreditFieldsVisible, setCreditFieldsVisible ] = useState<boolean>(
    form.getFieldValue('hasCredits'),
  )

  const hasCreditOptions = [
    { label: t('questionnaire.common.yes'), value: true },
    { label: t('questionnaire.common.no'), value: false },
  ]

  const formItemLayout = {
    required: true,
    labelAlign: 'left' as any,
    labelCol: { span: 10 },
    wrapperCol: { span: 'auto' },
  }
  const inputLayout = {
    suffix: <EditOutlined/>,
    disabled: !isEditable,
  }

  const onBelongsToHoldingsChange = () => {
    setCreditFieldsVisible(!isCreditFieldsVisible)
  }

  const renderCreditRows = () => (
    <Form.List name="credits">
      {(fields, { add, remove }) => (<>
        {fields.map((field, index) => (
          <React.Fragment key={field.key}>
            <Row key={field.key}
                 gutter={16}
                 wrap
            >
              <Col span={10}>
                <Form.Item
                  {...formItemLayout}
                  labelCol={{ span: 8 }}
                  label={t('questionnaire.credits.bankName.label')}
                  name={[ field.name, 'bankName' ]}
                >
                  <Input
                    placeholder={t('questionnaire.credits.bankName.placeholder')}
                    {...inputLayout}
                  />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  {...formItemLayout}
                  labelCol={{ span: 14 }}
                  label={t('questionnaire.credits.creditAmount.label')}
                  name={[ field.name, 'creditAmount' ]}
                >
                  <Input
                    {...inputLayout}
                    placeholder={t('questionnaire.credits.creditAmount.placeholder')}
                  />
                </Form.Item>
              </Col>

              <Col span={7}>
                <Form.Item
                  {...formItemLayout}
                  labelCol={{ span: 14 }}
                  label={t('questionnaire.credits.remainAmount.label')}
                  name={[ field.name, 'remainAmount' ]}
                >
                  <Input
                    {...inputLayout}
                    placeholder={t('questionnaire.credits.remainAmount.placeholder')}
                  />
                </Form.Item>
              </Col>

              <Col span={1}>
                {index > 0 && isEditable && <MinusCircleOutlined onClick={() => remove(field.name)}/>}
              </Col>
              {/* wrap here */}
              <Col span={7}>
                <Form.Item
                  {...formItemLayout}
                  style={{ marginBottom: '0px' }}
                  label={t('questionnaire.credits.creditDate')}
                  name={[ field.name, 'creditDate' ]}
                >
                  <DatePicker format={DATE_FORMAT}
                              disabled={!isEditable}/>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  {...formItemLayout}
                  style={{ marginBottom: '0px' }}
                  labelCol={{ span: 0 }}
                  valuePropName="checked"
                  name={[ field.name, 'isExpired' ]}
                >
                  <Checkbox disabled={!isEditable}>
                    {t('questionnaire.credits.isExpired')}
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <Divider/>
          </React.Fragment>
        ))}

        {isEditable && <Form.Item>
          <Button onClick={() => add()}
                  type="primary"
                  icon={<PlusOutlined/>}
          >
            {t('questionnaire.common.add')}
          </Button>
        </Form.Item>}
      </>)}
    </Form.List>
  )

  return (
    <>
      <Title level={5}>
        {t('questionnaire.credits.title')}
      </Title>
      <Form.Item name="hasCredits"
                 labelCol={{ span: 9 }}
                 labelAlign="left"
                 label={t('questionnaire.credits.hasCredits')}
      >
        <Radio.Group onChange={onBelongsToHoldingsChange}
                     options={hasCreditOptions}
                     disabled={!isEditable}/>
      </Form.Item>
      {isCreditFieldsVisible && renderCreditRows()}
    </>
  )
}

export default QuestionnaireCreditFormFields
