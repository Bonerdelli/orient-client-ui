import {useTranslation} from 'react-i18next';
import {Form, Radio, Typography} from 'antd';
import {useState} from 'react';
import {EditOutlined} from '@ant-design/icons';
import {QuestionnaireFormData} from 'components/QuestionnaireForm/questionnaire-form.interface';


const QuestionnaireCreditFormFields: React.FC = () => {
  const {t} = useTranslation();
  const {Title} = Typography;
  const form = Form.useFormInstance<QuestionnaireFormData>();
  const [isCreditFieldsVisible, setCreditFieldsVisible] = useState<boolean>(
    form.getFieldValue('hasCredits'),
  );

  const hasCreditOptions = [
    {label: t('questionnaire.common.yes'), value: true},
    {label: t('questionnaire.common.no'), value: false},
  ];

  const formItemLayout = {
    required: true,
    labelAlign: 'left' as any,
  };
  const inputLayout = {
    suffix: <EditOutlined/>,
  };

  const onBelongsToHoldingsChange = () => {
    setCreditFieldsVisible(!isCreditFieldsVisible);
  };

  const renderCreditRows = () => (<>
    {/* TODO: https://ant.design/components/form/?theme=compact#components-form-demo-dynamic-form-items-complex */}
  </>);

  return (
    <>
      <Title level={5}>
        {t('questionnaire.credits.title')}
      </Title>
      <Form.Item name="hasCredit"
                 labelCol={{span: 7}}
                 labelAlign="left"
                 label={t('questionnaire.credits.hasCredits')}
      >
        <Radio.Group onChange={onBelongsToHoldingsChange}
                     options={hasCreditOptions}/>
      </Form.Item>
      {isCreditFieldsVisible && renderCreditRows()}
    </>
  );
};

export default QuestionnaireCreditFormFields;
