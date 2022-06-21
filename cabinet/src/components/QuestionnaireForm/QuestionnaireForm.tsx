import './QuestionnaireForm.style.less';
import {useApi} from 'library/helpers/api';
import {getQuestionnaire, QuestionnaireResponse} from 'library/api/questionnaire';
import QuestionnaireGeneralFormFields from './QuestionnaireGeneralInfoFormFields';
import {Form, Spin} from 'antd';
import {QuestionnaireFormData} from './questionnaire-form.interface';
import {defaultQuestionnaireFormState} from './default-questionnaire-form-state';
import QuestionnaireHoldingFormFields from 'components/QuestionnaireForm/QuestionnaireHoldingFormFields';
import QuestionnaireCreditFormFields from 'components/QuestionnaireForm/QuestionnaireCreditFormFields';

interface QuestionnaireFormProps {
  companyId: string;
}

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({companyId}) => {
  const [form] = Form.useForm<QuestionnaireFormData>();
  const [data, isDataLoaded] = useApi<QuestionnaireResponse>(getQuestionnaire, companyId);

  const formSettings = {
    form,
    labelCol: {span: 6},
    wrapperCol: {span: 8},
    initialValues: isDataLoaded && data ? data : defaultQuestionnaireFormState,
    labelWrap: true,
  };

  return (
    <Spin spinning={isDataLoaded === null}>
      <Form {...formSettings}
            onFieldsChange={console.log}>
        <QuestionnaireGeneralFormFields/>
        <QuestionnaireHoldingFormFields/>
        <QuestionnaireCreditFormFields/>
      </Form>
    </Spin>
  );
};

export default QuestionnaireForm;
