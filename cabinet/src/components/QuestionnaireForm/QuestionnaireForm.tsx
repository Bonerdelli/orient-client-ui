import './QuestionnaireForm.style.less';
import {useApi} from 'library/helpers/api';
import {getQuestionnaire, QuestionnaireApiResponse} from 'library/api/questionnaire';
import QuestionnaireGeneralFormFields from './QuestionnaireGeneralInfoFormFields';
import {Button, Form, Row, Spin} from 'antd';
import {QuestionnaireFormData} from './questionnaire-form.interface';
import QuestionnaireHoldingFormFields from './QuestionnaireHoldingFormFields';
import QuestionnaireCreditFormFields from './QuestionnaireCreditFormFields';
import {getQuestionnaireFormInitialValues} from './get-questionnaire-form-initial-values.func';
import QuestionnaireCreditExpirationsFormFields from './QuestionnaireCreditExpirationFormFields';
import QuestionnaireSuppliersAndBuyersFormFields from './QuestionnaireSuppliersAndBuyersFormFields';
import QuestionnaireEasyFinansRelationshipsFormFields from './QuestionnaireEasyFinansRelationshipsFormFields';
import {useTranslation} from 'react-i18next';

interface QuestionnaireFormProps {
  companyId: string;
}

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({companyId}) => {
  const {t} = useTranslation();
  const [form] = Form.useForm<QuestionnaireFormData>();
  const [data, isDataLoaded] = useApi<QuestionnaireApiResponse>(getQuestionnaire, companyId);

  const initialValues = getQuestionnaireFormInitialValues(data);

  const formSettings = {
    form,
    labelCol: {span: 6},
    wrapperCol: {span: 8},
    initialValues,
    labelWrap: true,
    colon: false,
  };

  // TODO: Поправить верстку в некоторых блоках
  return (
    <Spin spinning={isDataLoaded === null}>
      <Form {...formSettings}
            onFieldsChange={() => {}}
            onFinish={(x) => console.log(x)}
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
