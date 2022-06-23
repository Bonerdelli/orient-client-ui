import './QuestionnaireForm.style.less';
import {useApi} from 'library/helpers/api';
import {getQuestionnaire, QuestionnaireApiResponse} from 'library/api/questionnaire';
import QuestionnaireGeneralFormFields from './QuestionnaireGeneralInfoFormFields';
import {Form, Spin} from 'antd';
import {QuestionnaireFormData} from './questionnaire-form.interface';
import QuestionnaireHoldingFormFields from './QuestionnaireHoldingFormFields';
import QuestionnaireCreditFormFields from './QuestionnaireCreditFormFields';
import {getQuestionnaireFormInitialValues} from './get-questionnaire-form-initial-values.func';
import QuestionnaireCreditExpirationsFormFields from './QuestionnaireCreditExpirationFormFields';
import QuestionnaireSuppliersAndBuyersFormFields from './QuestionnaireSuppliersAndBuyersFormFields';

interface QuestionnaireFormProps {
  companyId: string;
}

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({companyId}) => {
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

  return (
    <Spin spinning={isDataLoaded === null}>
      <Form {...formSettings}
            onFieldsChange={() => {}}>
        <QuestionnaireGeneralFormFields/>
        <QuestionnaireHoldingFormFields/>
        <QuestionnaireCreditFormFields/>
        <QuestionnaireCreditExpirationsFormFields/>
        <QuestionnaireSuppliersAndBuyersFormFields/>
      </Form>
    </Spin>
  );
};

export default QuestionnaireForm;
