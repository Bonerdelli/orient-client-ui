import { useTranslation } from 'react-i18next'
import { Form, Select, Typography } from 'antd'
import {
  convertDictionaryToSelectOptions,
} from 'components/QuestionnaireForm/converters/dictionary-to-select-options.converter'
import { Dictionaries } from 'library/models/dictionaries'

interface QuestionnaireGeneralFormFieldsProps {
  dictionaries: Dictionaries;
}

const QuestionnaireGeneralFormFields: React.FC<QuestionnaireGeneralFormFieldsProps> = ({
                                                                                         dictionaries,
                                                                                       }) => {
  const { t } = useTranslation()
  const { Title } = Typography
  const formItemLayout = {
    required: true,
    labelAlign: 'left' as any,
  }

  return (
    <>
      <Title level={5}>
        {t('questionnaire.generalInfo.title')}
      </Title>
      <Form.Item {...formItemLayout}
                 name="averageEmployeesCountId"
                 label={t('questionnaire.generalInfo.averageEmployeesCount.label')}
      >
        <Select options={convertDictionaryToSelectOptions(dictionaries.employeeCount)}/>
      </Form.Item>
      <Form.Item {...formItemLayout}
                 name="taxationSystemId"
                 label={t('questionnaire.generalInfo.taxSystem.label')}
      >
        <Select options={convertDictionaryToSelectOptions(dictionaries.taxationSystem)}/>
      </Form.Item>
    </>
  )
}

export default QuestionnaireGeneralFormFields
