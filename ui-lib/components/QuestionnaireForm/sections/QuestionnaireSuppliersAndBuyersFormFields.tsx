import { useTranslation } from 'react-i18next'
import { Button, Col, Form, Input, Row, Select, Typography } from 'antd'
import React from 'react'
import { EditOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { defaultQuestionnaireFormState } from '../constants/default-questionnaire-form-state.const'
import { Dictionaries } from '../../../library'
import { convertDictionaryToSelectOptions } from '../../../library/converters/dictionary-to-select-options.converter'

interface QuestionnaireSuppliersAndBuyersFormFieldsProps {
  dictionaries: Dictionaries,
  isEditable: boolean,
}

const QuestionnaireSuppliersAndBuyersFormFields: React.FC<QuestionnaireSuppliersAndBuyersFormFieldsProps> = ({
  dictionaries,
  isEditable,
}) => {
  const { t } = useTranslation()
  const { Title, Text } = Typography

  const inputLayout = {
    suffix: <EditOutlined/>,
    disabled: !isEditable,
  }
  const formItemRowLayout = {
    labelAlign: 'left' as any,
    required: true,
    wrapperCol: { span: 'auto' },
    labelCol: { span: 8 },
  }
  const buyersFieldsFormFieldsLayout = {
    ...formItemRowLayout,
    wrapperCol: { span: 3 },
  }
  const delayFieldsFormFieldsLayout = {
    ...formItemRowLayout,
    labelCol: { span: 10 },
  }
  const maximumFieldsCount = 5

  const renderRows = (name: 'suppliers' | 'buyers') => (<>
    <Title level={5}>{t(`questionnaire.suppliersAndBuyers.${name}.title`)}</Title>
    <Form.Item>
      <Text>{t(`questionnaire.suppliersAndBuyers.${name}.subtitle`, { count: maximumFieldsCount })}</Text>
    </Form.Item>
    <Form.List name={name}>
      {(fields, { add, remove }) => (<>
        {fields.map((field) => (
          <Row key={field.key}
               gutter={16}
          >
            <Col span={9}>
              <Form.Item name={[ field.key, 'name' ]}
                         {...formItemRowLayout}
                         label={t('questionnaire.suppliersAndBuyers.fields.name.title')}
              >
                <Input {...inputLayout}
                       placeholder={t('questionnaire.suppliersAndBuyers.fields.name.placeholder')}
                />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name={[ field.key, 'term' ]}
                         {...formItemRowLayout}
                         labelCol={{ span: 14 }}
                         label={t('questionnaire.suppliersAndBuyers.fields.term.title')}>
                <Input {...inputLayout}
                       placeholder={t('questionnaire.suppliersAndBuyers.fields.term.placeholder')}/>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name={[ field.key, 'paymentFormId' ]}
                         {...formItemRowLayout}
                         label={t('questionnaire.suppliersAndBuyers.fields.paymentFormId.title')}>
                <Select placeholder={t('questionnaire.suppliersAndBuyers.fields.paymentFormId.placeholder')}
                        disabled={!isEditable}
                        options={convertDictionaryToSelectOptions(dictionaries.paymentForm)}/>
              </Form.Item>
            </Col>
            {field.key > 0 && isEditable && <Col span={1}>
              <Form.Item wrapperCol={{ span: 'auto' }}>
                <MinusCircleOutlined onClick={() => remove(field.name)}/>
              </Form.Item>
            </Col>}
          </Row>
        ))}
        {isEditable && <Form.Item>
          <Button onClick={() => add(defaultQuestionnaireFormState[name][0])}
                  disabled={fields.length >= maximumFieldsCount}
                  type="primary"
                  icon={<PlusOutlined/>}
          >
            {t('questionnaire.common.add')}
          </Button>
        </Form.Item>}
      </>)}
    </Form.List>
  </>)

  return (
    <>
      {renderRows('suppliers')}
      {renderRows('buyers')}
      <Form.Item name="buyersTotalCount"
                 {...buyersFieldsFormFieldsLayout}
                 label={t('questionnaire.suppliersAndBuyers.buyersTotalCount.label')}>
        <Input
          {...inputLayout}
          placeholder={t('questionnaire.suppliersAndBuyers.buyersTotalCount.placeholder')}
        />
      </Form.Item>
      <Form.Item name="buyersPayDelayCount"
                 {...buyersFieldsFormFieldsLayout}
                 label={t('questionnaire.suppliersAndBuyers.buyersPayDelayCount.label')}>
        <Input
          {...inputLayout}
          placeholder={t('questionnaire.suppliersAndBuyers.buyersPayDelayCount.placeholder')}
        />
      </Form.Item>
      <Form.Item name="maxPossibleCredit"
                 {...buyersFieldsFormFieldsLayout}
                 label={t('questionnaire.suppliersAndBuyers.maxPossibleCredit.label')}>
        <Input
          {...inputLayout}
          placeholder={t('questionnaire.suppliersAndBuyers.maxPossibleCredit.placeholder')}
        />
      </Form.Item>
      <Form.Item required
                 labelAlign="left"
                 labelCol={{ span: 24 }}
                 style={{ marginBottom: '8px' }}
                 label={t('questionnaire.suppliersAndBuyers.payDelay.title')}/>
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item name="payDelayMin"
                     {...delayFieldsFormFieldsLayout}
                     label={t('questionnaire.suppliersAndBuyers.payDelay.min.label')}>
            <Input
              {...inputLayout}
              placeholder={t('questionnaire.suppliersAndBuyers.payDelay.min.placeholder')}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="payDelayAvg"
                     {...delayFieldsFormFieldsLayout}
                     label={t('questionnaire.suppliersAndBuyers.payDelay.avg.label')}>
            <Input
              {...inputLayout}
              placeholder={t('questionnaire.suppliersAndBuyers.payDelay.avg.placeholder')}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="payDelayMax"
                     {...delayFieldsFormFieldsLayout}
                     label={t('questionnaire.suppliersAndBuyers.payDelay.max.label')}>
            <Input
              {...inputLayout}
              placeholder={t('questionnaire.suppliersAndBuyers.payDelay.max.placeholder')}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  )
}

export default QuestionnaireSuppliersAndBuyersFormFields
