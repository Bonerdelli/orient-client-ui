import {useTranslation} from 'react-i18next';
import {Button, Checkbox, Col, Form, Input, Radio, Row, Typography} from 'antd';
import {useState} from 'react';
import {CalendarOutlined, EditOutlined, MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
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
    labelCol: {span: 10},
    wrapperCol: {span: 'auto'},
  };
  const inputLayout = {
    suffix: <EditOutlined/>,
  };

  const onBelongsToHoldingsChange = () => {
    setCreditFieldsVisible(!isCreditFieldsVisible);
  };

  const renderCreditRows = () => (
    <Form.List name="credits">
      {(fields, {add, remove}) => (<>
        {fields.map((field, index) => (<>
          <Row key={field.key}
               gutter={16}
               wrap
          >
            <Col span={11}>
              <Form.Item
                {...field}
                {...formItemLayout}
                label="Наименование Банка"
                name={[field.name, 'bankName']}
              >
                <Input {...inputLayout} />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                {...field}
                {...formItemLayout}
                label="Сумма кредита, тыс. сум"
                name={[field.name, 'creditAmount']}
              >
                <Input {...inputLayout} />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                {...field}
                {...formItemLayout}
                label="Остаток  задолженнности, тыс. сум"
                name={[field.name, 'remainAmount']}
              >
                <Input {...inputLayout}/>
              </Form.Item>
            </Col>

            <Col span={1}>
              {index > 0 && <MinusCircleOutlined onClick={() => remove(field.name)}/>}
            </Col>
            {/* wrap here */}
            <Col span={7}>
              <Form.Item
                {...field}
                {...formItemLayout}
                label="Дата погашения"
                name={[field.name, 'creditDate']}
              >
                {/*TODO: replace to <DatePicker format="YYYY-MM-DD"/>*/}
                <Input suffix={<CalendarOutlined/>}/>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                {...field}
                name={[field.name, 'isExpired']}
              >
                <Checkbox>Наличие просрочки</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </>))}

        <Button onClick={() => add()}
                type="primary"
                icon={<PlusOutlined/>}
        >
          Добавить
        </Button>
      </>)}
    </Form.List>
  );

  return (
    <>
      <Title level={5}>
        {t('questionnaire.credits.title')}
      </Title>
      <Form.Item name="hasCredits"
                 labelCol={{span: 9}}
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
