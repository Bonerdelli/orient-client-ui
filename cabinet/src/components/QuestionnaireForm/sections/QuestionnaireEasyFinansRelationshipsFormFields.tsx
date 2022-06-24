import {useTranslation} from 'react-i18next';
import {Button, Col, Divider, Form, Input, Radio, Row, Typography} from 'antd';
import React, {useState} from 'react';
import {EditOutlined, MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {QuestionnaireFormData} from 'components/QuestionnaireForm/models/questionnaire-form.interface';


const QuestionnaireEasyFinansRelationshipsFormFields: React.FC = () => {
  const {t} = useTranslation();
  const {Title} = Typography;
  const form = Form.useFormInstance<QuestionnaireFormData>();
  const [isIndividualRowsVisible, setIndividualRowsVisible] = useState<boolean>(
    form.getFieldValue('hasEasyFinansIndividuals'),
  );
  const [isLegalRowsVisible, setLegalRowsVisible] = useState<boolean>(
    form.getFieldValue('hasEasyFinansLegals'),
  );

  const formItemLayout = {
    required: true,
    labelAlign: 'left' as any,
    labelCol: {span: 6},
    wrapperCol: {span: 'auto'},
  };
  const radioLayout = {
    labelAlign: 'left' as any,
    labelCol: {span: 20},
    wrapperCol: {span: 'auto'},
  };
  const inputLayout = {
    suffix: <EditOutlined/>,
  };
  const yesNoOptions = [
    {label: t('questionnaire.common.yes'), value: true},
    {label: t('questionnaire.common.no'), value: false},
  ];

  const onHasIndividualsChange = () => setIndividualRowsVisible(!isIndividualRowsVisible);
  const onHasLegalsChange = () => setLegalRowsVisible(!isLegalRowsVisible);

  const renderRows = (name: 'easyFinanceIndividuals' | 'easyFinanceLegals') => (
    <Form.List name={name}>
      {(fields, {add, remove}) => (<>
        {fields.map((field, index) => (
          <React.Fragment key={field.key}>
            <Row key={field.key}
                 gutter={16}
                 wrap
            >
              <Col span={12}>
                <Form.Item
                  {...formItemLayout}
                  label={t('questionnaire.easyFinansRelationships.memberName')}
                  name={[field.name, 'bankName']}
                >
                  <Input placeholder={t('')}
                         {...inputLayout} />
                </Form.Item>
              </Col>

              {name === 'easyFinanceLegals' && <>
                <Col span={12}>
                  <Form.Item
                    {...formItemLayout}
                    label={t('questionnaire.easyFinansRelationships.relativeName')}
                    name={[field.name, 'bankName']}
                  >
                    <Input placeholder={t('')}
                           {...inputLayout} />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    {...formItemLayout}
                    label={t('questionnaire.easyFinansRelationships.relation')}
                    name={[field.name, 'bankName']}
                  >
                    <Input placeholder={t('')}
                           {...inputLayout} />
                  </Form.Item>
                </Col>
              </>}

              {index > 0 && <Col span={1}>
                <Form.Item>
                  <MinusCircleOutlined onClick={() => remove(field.name)}/>
                </Form.Item>
              </Col>}
            </Row>
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
  );

  return (
    <>
      <Title level={5}>
        {t('questionnaire.easyFinansRelationships.title')}
      </Title>
      <Form.Item name="hasEasyFinansIndividuals"
                 {...radioLayout}
                 label={t('questionnaire.easyFinansRelationships.hasEasyFinansIndividuals')}
      >
        <Radio.Group onChange={onHasIndividualsChange}
                     options={yesNoOptions}/>
      </Form.Item>
      {isIndividualRowsVisible && renderRows('easyFinanceIndividuals')}
      <Form.Item name="hasEasyFinansLegals"
                 {...radioLayout}
                 label={t('questionnaire.easyFinansRelationships.hasEasyFinansLegals')}
      >
        <Radio.Group onChange={onHasLegalsChange}
                     options={yesNoOptions}/>
      </Form.Item>
      {isLegalRowsVisible && renderRows('easyFinanceLegals')}
    </>
  );
};

export default QuestionnaireEasyFinansRelationshipsFormFields;
