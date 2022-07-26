import './QuestionnaireForm.style.less'
import QuestionnaireGeneralFormFields from './sections/QuestionnaireGeneralInfoFormFields'
import { Button, Form, Row } from 'antd'
import { QuestionnaireFormData } from './models/questionnaire-form.interface'
import QuestionnaireHoldingFormFields from './sections/QuestionnaireHoldingFormFields'
import QuestionnaireCreditFormFields from './sections/QuestionnaireCreditFormFields'
import QuestionnaireCreditExpirationsFormFields from './sections/QuestionnaireCreditExpirationFormFields'
import QuestionnaireSuppliersAndBuyersFormFields from './sections/QuestionnaireSuppliersAndBuyersFormFields'
import QuestionnaireEasyFinansRelationshipsFormFields from './sections/QuestionnaireEasyFinansRelationshipsFormFields'
import { useTranslation } from 'react-i18next'
import { convertQuestionnaireFormToDto } from './converters/questionnaire-form-to-dto.converter'
import { Link } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { convertQuestionnaireDtoToFormValues } from './converters/questionnaire-dto-to-form-values.converter'
import { Dictionaries } from '../../library'
import { CompanyQuestionnaireDto } from '../../library/models/proxy'

interface QuestionnaireFormProps {
  questionnaireDto: CompanyQuestionnaireDto | null
  dictionaries: Dictionaries
  isEditable: boolean
  onSave?: (dto: CompanyQuestionnaireDto) => Promise<unknown>
  returnUrl?: string | null
}

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({
  questionnaireDto,
  dictionaries,
  isEditable,
  onSave,
  returnUrl,
}) => {
  const { t } = useTranslation()
  const [ form ] = Form.useForm<QuestionnaireFormData>()
  const [ saveInProcess, setSaveInProcess ] = useState<boolean>(false)

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
    await onSave?.(dto)
    setSaveInProcess(false)
  }

  let classNames = 'QuestionnaireForm'
  if (!isEditable) {
    classNames += ' QuestionnaireForm_readonly'
  }

  return (
    <Form {...formSettings}
          onFinish={saveQuestionnaire}
          className={classNames}
    >
      <QuestionnaireGeneralFormFields
        isEditable={isEditable}
        dictionaries={dictionaries}
      />
      <QuestionnaireHoldingFormFields isEditable={isEditable}/>
      <QuestionnaireCreditFormFields isEditable={isEditable}/>
      <QuestionnaireCreditExpirationsFormFields isEditable={isEditable}/>
      <QuestionnaireSuppliersAndBuyersFormFields
        dictionaries={dictionaries}
        isEditable={isEditable}
      />
      <QuestionnaireEasyFinansRelationshipsFormFields isEditable={isEditable}/>
      <Row justify={returnUrl ? 'space-between' : 'end'}>
        {returnUrl &&
          <Link to={returnUrl}>
            <Button icon={<ArrowLeftOutlined/>} type="link">
              {t('questionnaire.back')}
            </Button>
          </Link>
        }

        {isEditable && <Button type="primary"
                               htmlType="submit"
                               loading={saveInProcess}
        >
          {t('questionnaire.save')}
        </Button>}
      </Row>
    </Form>
  )
}

export default QuestionnaireForm
