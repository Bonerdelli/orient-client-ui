import {useTranslation} from 'react-i18next';
import {Button, Col, Form, Input, Row, Select, Typography} from 'antd';
import React from 'react';
import {EditOutlined, MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';

const QuestionnaireSuppliersAndBuyersFormFields: React.FC = () => {
  const {t} = useTranslation();
  const {Title, Text} = Typography;
  // const form = Form.useFormInstance<QuestionnaireFormData>();

  const inputLayout = {
    suffix: <EditOutlined/>,
  };

  const formItemRowLayout = {
    labelAlign: 'left' as any,
    required: true,
    wrapperCol: {span: 'auto'},
    labelCol: {span: 8},
  };

  const buyersFieldsFormFieldsLayout = {
    ...formItemRowLayout,
    wrapperCol: {span: 3},
  };

  const delayFieldsFormFieldsLayout = {
    ...formItemRowLayout,
    labelCol: {span: 10},
  };

  // TODO: replace with values from dict
  const paymentFormOptions = [
    {value: 0, label: 'Наличная'},
    {value: 1, label: 'Безналичная'},
  ];

  const renderRows = (name: 'suppliers' | 'buyers') => (<>
    <Title level={5}>{t(`questionnaire.suppliersAndBuyers.${name}.title`)}</Title>
    <Form.Item>
      <Text>{t(`questionnaire.suppliersAndBuyers.${name}.subtitle`)}</Text>
    </Form.Item>
    <Form.List name={name}>
      {(fields, {add, remove}) => (<>
        {fields.map((field) => (
          <Row key={field.key}
               gutter={16}
          >
            <Col span={9}>
              <Form.Item name={[field.name, 'name']}
                         {...formItemRowLayout}
                         label={t('questionnaire.suppliersAndBuyers.fields.name')}>
                <Input {...inputLayout}/>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name={[field.name, 'term']}
                         {...formItemRowLayout}
                         label={t('questionnaire.suppliersAndBuyers.fields.term')}>
                <Input {...inputLayout}/>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name={[field.name, 'paymentFormId']}
                         {...formItemRowLayout}
                         label={t('questionnaire.suppliersAndBuyers.fields.paymentFormId')}>
                <Select defaultActiveFirstOption
                        options={paymentFormOptions}/>
              </Form.Item>
            </Col>
            <Col span={1}>
              <Form.Item wrapperCol={{span: 'auto'}}>
                <MinusCircleOutlined onClick={() => remove(field.name)}/>
              </Form.Item>
            </Col>
          </Row>
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
  </>);

  return (
    <>
      {renderRows('suppliers')}
      {renderRows('buyers')}
      <Form.Item name="buyersTotalCount"
                 {...buyersFieldsFormFieldsLayout}
                 label={t('questionnaire.suppliersAndBuyers.buyersTotalCount')}>
        <Input {...inputLayout}/>
      </Form.Item>
      <Form.Item name="buyersPayDelayCount"
                 {...buyersFieldsFormFieldsLayout}
                 label={t('questionnaire.suppliersAndBuyers.buyersPayDelayCount')}>
        <Input {...inputLayout}/>
      </Form.Item>
      <Form.Item required
                 labelAlign="left"
                 labelCol={{span: 24}}
                 style={{marginBottom: "8px"}}
                 label={t('questionnaire.suppliersAndBuyers.payDelay.title')}/>
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item name="payDelayMin"
                     {...delayFieldsFormFieldsLayout}
                     label={t('questionnaire.suppliersAndBuyers.payDelay.min')}>
            <Input {...inputLayout}/>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="payDelayAvg"
                     {...delayFieldsFormFieldsLayout}
                     label={t('questionnaire.suppliersAndBuyers.payDelay.avg')}>
            <Input {...inputLayout}/>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="payDelayMax"
                     {...delayFieldsFormFieldsLayout}
                     label={t('questionnaire.suppliersAndBuyers.payDelay.max')}>
            <Input {...inputLayout}/>
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default QuestionnaireSuppliersAndBuyersFormFields;
