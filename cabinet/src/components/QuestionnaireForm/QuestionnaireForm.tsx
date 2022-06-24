import './QuestionnaireForm.style.less';
import {useApi} from 'library/helpers/api';
import {fetchQuestionnaire, QuestionnaireDto, sendQuestionnaire} from 'library/api/questionnaire';
import QuestionnaireGeneralFormFields from './sections/QuestionnaireGeneralInfoFormFields';
import {Button, Form, message, Row, Spin} from 'antd';
import {QuestionnaireFormData} from './models/questionnaire-form.interface';
import QuestionnaireHoldingFormFields from './sections/QuestionnaireHoldingFormFields';
import QuestionnaireCreditFormFields from './sections/QuestionnaireCreditFormFields';
import {
  convertQuestionnaireDtoToFormValues,
} from './converters/convert-questionnaire-dto-to-form-values.func';
import QuestionnaireCreditExpirationsFormFields from './sections/QuestionnaireCreditExpirationFormFields';
import QuestionnaireSuppliersAndBuyersFormFields from './sections/QuestionnaireSuppliersAndBuyersFormFields';
import QuestionnaireEasyFinansRelationshipsFormFields
  from './sections/QuestionnaireEasyFinansRelationshipsFormFields';
import {useTranslation} from 'react-i18next';
import {
  convertQuestionnaireFormToDto,
} from 'components/QuestionnaireForm/converters/convert-questionnaire-form-to-dto-values.func';

interface QuestionnaireFormProps {
  companyId: string;
}

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({companyId}) => {
  const {t} = useTranslation();
  const [form] = Form.useForm<QuestionnaireFormData>();
  const [data, isDataLoaded] = useApi<QuestionnaireDto>(fetchQuestionnaire, companyId);
  const initialValues = convertQuestionnaireDtoToFormValues(data);

  const formSettings = {
    form,
    labelCol: {span: 6},
    wrapperCol: {span: 8},
    initialValues,
    labelWrap: true,
    colon: false,
  };

  const saveQuestionnaire = async (formValue: QuestionnaireFormData) => {
    const dto: QuestionnaireDto = convertQuestionnaireFormToDto(formValue);
    const res = await sendQuestionnaire(companyId, dto);
    console.log(res);
    // я думаю это временная обработка ошибки
    if (!res.success) {
      const field = (res as any).data[0]?.field;
      const defaultMessage = (res as any).data[0]?.defaultMessage;
      message.error(field && defaultMessage
        ? `${field} ${defaultMessage}`
        : 'Ошибка при сохранении анкеты');
    } else {
      message.success('Анкета успешно сохранена!');
    }
  };

  // TODO: Поправить верстку в некоторых блоках
  return (
    <Spin spinning={isDataLoaded === null}>
      <Form {...formSettings}
            onFieldsChange={() => {}}
            onFinish={saveQuestionnaire}
      >
        <QuestionnaireGeneralFormFields/>
        <QuestionnaireHoldingFormFields/>
        <QuestionnaireCreditFormFields/>
        <QuestionnaireCreditExpirationsFormFields/>
        <QuestionnaireSuppliersAndBuyersFormFields/>
        <QuestionnaireEasyFinansRelationshipsFormFields/>
        <Row justify="end">
          <Button type="primary"
                  htmlType="submit"
          >
            {t('questionnaire.save')}
          </Button>
        </Row>
      </Form>
    </Spin>
  );
};

export default QuestionnaireForm;
