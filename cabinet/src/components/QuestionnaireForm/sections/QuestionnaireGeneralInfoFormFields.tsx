import {useTranslation} from 'react-i18next';
import {Form, Select, Typography} from 'antd';

export enum AverageEmployeesCountIdEnum {
  LessThan100,
  MoreThan100,
}

export enum TaxationSystemIdEnum {
  Common,
  Other,
}

const QuestionnaireGeneralFormFields: React.FC = () => {
  const { t } = useTranslation()
  const {Title} = Typography
  const formItemLayout = {
    required: true,
    labelAlign: 'left' as any,
  }
  const averageEmployeesCountOptions = [
    {value: AverageEmployeesCountIdEnum.LessThan100, label: 'До 100 сотрудников'},
    {value: AverageEmployeesCountIdEnum.MoreThan100, label: 'После 100 сотрудников'}
  ]
  const taxationSystemCountOptions = [
    {value: TaxationSystemIdEnum.Common, label: 'Общая'},
    {value: TaxationSystemIdEnum.Other, label: 'Другая'},
  ]

  return (
    <>
      <Title level={5}>
        {t('questionnaire.generalInfo.title')}
      </Title>
      <Form.Item {...formItemLayout}
                 name="averageEmployeesCountId"
                 label={t('questionnaire.generalInfo.averageEmployeesCount.label')}
      >
        <Select options={averageEmployeesCountOptions}/>
      </Form.Item>
      <Form.Item {...formItemLayout}
                 name="taxationSystemId"
                 label={t('questionnaire.generalInfo.taxSystem.label')}
      >
        <Select options={taxationSystemCountOptions}/>
      </Form.Item>
    </>
  )
}

export default QuestionnaireGeneralFormFields
