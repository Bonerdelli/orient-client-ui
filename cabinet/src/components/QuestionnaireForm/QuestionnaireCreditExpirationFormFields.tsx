import {useTranslation} from 'react-i18next';
import {Button, Divider, Form, Input, Radio, Row, Typography} from 'antd';
import React, {useState} from 'react';
import {EditOutlined, MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {QuestionnaireFormData} from 'components/QuestionnaireForm/questionnaire-form.interface';

const QuestionnaireCreditExpirationsFormFields: React.FC = () => {
  const {t} = useTranslation();
  const {Title} = Typography;
  const form = Form.useFormInstance<QuestionnaireFormData>();
  // const [] = form.getFieldValue('creditExpirations') ?? [];
  const [hasTrials, setHasTrials] = useState<boolean>(form.getFieldValue('hasTrials'));

  const yesNoOptions = [
    {label: t('questionnaire.common.yes'), value: true},
    {label: t('questionnaire.common.no'), value: false},
  ];

  const inputLayout = {
    suffix: <EditOutlined/>,
  };

  const handleIsExpiredChange = (name: string, x: unknown) => {
    console.log(name);
    console.log(x);
  };

  const handleTrialsChange = () => {
    setHasTrials(!hasTrials);
  };

  const renderCreditExpirationsRows = () => (
    <Form.List name="creditExpirations">
      {(fields) => (<>
        <Title level={5}>[Тут должно быть 4 строки]</Title>
        {fields.map((field) => (
          <Row key={field.key}>
            <Form.Item name={[field.name, 'isExpired']}
                       labelCol={{span: 9}}
                       labelAlign="left"
                       label={t('questionnaire.creditExpirations.isExpired')}>
              <Radio.Group options={yesNoOptions}
                           onChange={(x) => handleIsExpiredChange(
                             `${field.name}_${field.key}`,
                             x,
                           )}/>
            </Form.Item>
            <Form.Item name={[field.name, 'reason']}
                       labelCol={{span: 9}}
                       labelAlign="left"
                       required
                       label={t('questionnaire.creditExpirations.debtReason')}>
              <Input {...inputLayout}/>
            </Form.Item>
          </Row>
        ))}
      </>)}
    </Form.List>
  );

  const renderTrialsRows = () => (
    <Form.List name="trials">
      {(fields, {add, remove}) => (<>
        {fields.map((field, index) => (
          <React.Fragment key={`${field.name}__${index}`}>
            {renderTrialsRow(field, ['complainant', 'reason'], false)}
            {renderTrialsRow(field, ['amount', 'result'], true)}
            {index > 0 && <MinusCircleOutlined onClick={() => remove(field.name)}/>}
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

  const renderTrialsRow = (field: any, controlNames: string[], noMarginBottom: boolean) => {
    return (
      <Row>
        {controlNames.map((controlName, index) => (
          <Form.Item name={[field.name, controlName]}
                     key={`${field.key}_${controlName}`}
                     labelCol={{span: !!index ? 9 : 6}}
                     wrapperCol={{span: !!index ? 16 : 12}}
                     labelAlign="left"
                     required
                     style={noMarginBottom ? {marginBottom: '0px'} : undefined}
                     label={t(`questionnaire.creditExpirations.${controlName}`)}>
            <Input {...inputLayout}/>
          </Form.Item>
        ))}
      </Row>
    );
  };

  return (
    <>
      <Title level={5}>
        {t('questionnaire.creditExpirations.title')}
      </Title>
      {renderCreditExpirationsRows()}
      <Form.Item name="hasTrials"
                 labelCol={{span: 12}}
                 labelAlign="left"
                 label={t('questionnaire.creditExpirations.hasTrials')}>
        <Radio.Group options={yesNoOptions}
                     onChange={handleTrialsChange}/>
      </Form.Item>
      {hasTrials && renderTrialsRows()}
    </>
  );
};

export default QuestionnaireCreditExpirationsFormFields;
