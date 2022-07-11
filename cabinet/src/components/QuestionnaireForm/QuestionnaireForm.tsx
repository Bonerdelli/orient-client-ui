import './QuestionnaireForm.style.less'
import { getQuestionnaire, sendQuestionnaire } from 'library/api/questionnaire'
import QuestionnaireGeneralFormFields from './sections/QuestionnaireGeneralInfoFormFields'
import { Button, Form, Row, Skeleton } from 'antd'
import { QuestionnaireFormData } from './models/questionnaire-form.interface'
import QuestionnaireHoldingFormFields from './sections/QuestionnaireHoldingFormFields'
import QuestionnaireCreditFormFields from './sections/QuestionnaireCreditFormFields'
import QuestionnaireCreditExpirationsFormFields from './sections/QuestionnaireCreditExpirationFormFields'
import QuestionnaireSuppliersAndBuyersFormFields from './sections/QuestionnaireSuppliersAndBuyersFormFields'
import QuestionnaireEasyFinansRelationshipsFormFields from './sections/QuestionnaireEasyFinansRelationshipsFormFields'
import { useTranslation } from 'react-i18next'
import {
  convertQuestionnaireFormToDto,
} from 'components/QuestionnaireForm/converters/questionnaire-form-to-dto.converter'
import { useStoreState } from 'library/store'
import { Link } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { CompanyQuestionnaireDto } from 'orient-ui-library/library/models/proxy'
import {
  convertQuestionnaireDtoToFormValues,
} from 'components/QuestionnaireForm/converters/questionnaire-dto-to-form-values.converter'

interface QuestionnaireFormProps {
  companyId: string,
  returnUrl: string | null,
}

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({ companyId, returnUrl }) => {
  const { t } = useTranslation()
  const dictionaries = useStoreState(state => state.dictionary.list)
  const [ form ] = Form.useForm<QuestionnaireFormData>()
  const [ isQuestionnaireLoading, setIsQuestionnaireLoading ] = useState<boolean>(true)
  const [ questionnaireDto, setQuestionnaireDto ] = useState<CompanyQuestionnaireDto | null>(null)
  const [ saveInProcess, setSaveInProcess ] = useState<boolean>(false)
  useEffect(() => {
    fetchQuestionnaire()
  }, [])

  const fetchQuestionnaire = async () => {
    const result = await getQuestionnaire(companyId)
    if (result.success) {
      setQuestionnaireDto(result.data as CompanyQuestionnaireDto)
    }
    setIsQuestionnaireLoading(false)
  }

  if (isQuestionnaireLoading || !dictionaries) {
    return (
      <Skeleton active/>
    )
  }

  const initialValues = convertQuestionnaireDtoToFormValues(questionnaireDto)
  const formSettings = {
    form,
    labelCol: { span: 6 },
    wrapperCol: { span: 8 },
    initialValues,
    labelWrap: true,
    colon: false,
  }

  const saveQuestionnaire = async (formValue: QuestionnaireFormData) => {
    const dto: CompanyQuestionnaireDto = convertQuestionnaireFormToDto(formValue)
    setSaveInProcess(true)
    await sendQuestionnaire(companyId, dto)
    setSaveInProcess(false)
  }

  return (
    <Form {...formSettings}
          onFinish={saveQuestionnaire}
    >
      <QuestionnaireGeneralFormFields dictionaries={dictionaries}/>
      <QuestionnaireHoldingFormFields/>
      <QuestionnaireCreditFormFields/>
      <QuestionnaireCreditExpirationsFormFields/>
      <QuestionnaireSuppliersAndBuyersFormFields dictionaries={dictionaries}/>
      <QuestionnaireEasyFinansRelationshipsFormFields/>
      <Row justify={returnUrl ? 'space-between' : 'end'}>
        {returnUrl &&
          <Link to={returnUrl}>
            <Button icon={<ArrowLeftOutlined/>} type="link">
              {t('questionnaire.back')}
            </Button>
          </Link>
        }

        <Button type="primary"
                htmlType="submit"
                loading={saveInProcess}
        >
          {t('questionnaire.save')}
        </Button>
      </Row>
    </Form>
  )
}

export default QuestionnaireForm
