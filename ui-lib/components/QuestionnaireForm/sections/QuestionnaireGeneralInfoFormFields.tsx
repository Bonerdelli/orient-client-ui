import { useTranslation } from 'react-i18next'
import { Form, Select, Typography } from 'antd'
import { Dictionaries } from '../../../library'
import { convertDictionaryToSelectOptions } from '../../../library/converters/dictionary-to-select-options.converter'

interface QuestionnaireGeneralFormFieldsProps {
  dictionaries: Dictionaries;
  isEditable: boolean;
}

const QuestionnaireGeneralFormFields: React.FC<QuestionnaireGeneralFormFieldsProps> = ({
  dictionaries,
  isEditable,
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
        <Select
          placeholder={t('questionnaire.generalInfo.averageEmployeesCount.placeholder')}
          options={convertDictionaryToSelectOptions(dictionaries.employeeCount)}
          disabled={!isEditable}
        />
      </Form.Item>
      <Form.Item {...formItemLayout}
                 name="taxationSystemId"
                 label={t('questionnaire.generalInfo.taxSystem.label')}
      >
        <Select
          placeholder={t('questionnaire.generalInfo.taxSystem.placeholder')}
          options={convertDictionaryToSelectOptions(dictionaries.taxationSystem)}
          disabled={!isEditable}
        />
      </Form.Item>
    </>
  )
}

export default QuestionnaireGeneralFormFields
