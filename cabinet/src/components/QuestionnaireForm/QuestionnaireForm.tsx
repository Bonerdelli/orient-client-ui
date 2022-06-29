import './QuestionnaireForm.style.less'
import { useApi } from 'library/helpers/api'
import { getQuestionnaire, sendQuestionnaire } from 'library/api/questionnaire'
import QuestionnaireGeneralFormFields from './sections/QuestionnaireGeneralInfoFormFields'
import { Button, Form, message, Row, Spin } from 'antd'
import { QuestionnaireFormData } from './models/questionnaire-form.interface'
import QuestionnaireHoldingFormFields from './sections/QuestionnaireHoldingFormFields'
import QuestionnaireCreditFormFields from './sections/QuestionnaireCreditFormFields'
import { convertQuestionnaireDtoToFormValues } from './converters/questionnaire-dto-to-form-values.converter'
import QuestionnaireCreditExpirationsFormFields from './sections/QuestionnaireCreditExpirationFormFields'
import QuestionnaireSuppliersAndBuyersFormFields from './sections/QuestionnaireSuppliersAndBuyersFormFields'
import QuestionnaireEasyFinansRelationshipsFormFields from './sections/QuestionnaireEasyFinansRelationshipsFormFields'
import { useTranslation } from 'react-i18next'
import {
  convertQuestionnaireFormToDto,
} from 'components/QuestionnaireForm/converters/questionnaire-form-to-dto.converter'
import { useStoreState } from 'library/store'
import { Div } from 'orient-ui-library/components'
import { Link } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { CompanyQuestionnaireDto } from 'orient-ui-library/library/models/proxy'

interface QuestionnaireFormProps {
  companyId: string,
  returnUrl: string | null,
}

// TODO: Добавить плейсхолдеры, добить переводы где нету, допилить маппинги
const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({ companyId, returnUrl }) => {
  const { t } = useTranslation()
  const [ form ] = Form.useForm<QuestionnaireFormData>()
  const [ data, isDataLoaded ] = useApi<CompanyQuestionnaireDto>(getQuestionnaire, companyId)
  const dictionaries = useStoreState(state => state.dictionary.list)
  const [ saveInProcess, setSaveInProcess ] = useState<boolean>(false)
  const initialValues = convertQuestionnaireDtoToFormValues(data)

  if (!isDataLoaded || !dictionaries || !initialValues) {
    return (
      <Spin spinning>
        <Div style={{ width: '100%', height: '500px' }}/>
      </Spin>
    )
  }

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
    const res = await sendQuestionnaire(companyId, dto)
    setSaveInProcess(false)
    // я думаю это временная обработка ошибки
    if (!res.success) {
      const field = (res as any).data[0]?.field
      const defaultMessage = (res as any).data[0]?.defaultMessage
      message.error(field && defaultMessage
        ? `${field} ${defaultMessage}`
        : 'Ошибка при сохранении анкеты')
    } else {
      message.success('Анкета успешно сохранена')
    }
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
