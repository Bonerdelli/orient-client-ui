import { useTranslation } from 'react-i18next'
import { Card, Form, Row, Col, Spin, Divider } from 'antd'

import Div from 'ui-components/Div'
import ErrorResultView from 'ui-components/ErrorResultView'

import { renderFormInputs } from 'library/helpers/form'
import { Company } from 'library/models/proxy' // TODO: to ui-lib
import { useApi } from 'library/helpers/api' // TODO: to ui-lib
import { getCompanyById } from 'library/api' // TODO: to ui-lib

import formFields from './CompanyContactsForm.form'

const { useFormInstance } = Form
const { Meta } = Card


import { FAKE_COMPANY_ID } from 'library/mock/company' // TODO: replace after be updates

const CompanyContactsForm = () => {
  const { t } = useTranslation()
  const form = useFormInstance()

  const [ formData, formDataLoaded ] = useApi<Company>(
    getCompanyById, { id: FAKE_COMPANY_ID }
  )

  const handleFormChange = (changedValues: Record<string, string>) => {
    console.log('CompanyContactsForm: values', changedValues)
  }

  if (formDataLoaded === false) {
    return (
      <ErrorResultView centered={true} status="error" />
    )
  }

  if (!formData) {
    return (
      <Div className="AppLayout__loaderWrap">
        <Spin size="large" />
      </Div>
    )
  }

  const renderContent = () => (
    <Form
      form={form}
      initialValues={formData}
      onValuesChange={handleFormChange}
      className="CompanyContactsForm"
      data-testid="CompanyContactsForm"
      labelCol={{ span: 10 }}
      wrapperCol={{ flex: 1 }}
      labelAlign="left"
      requiredMark={false}
      colon={false}
      labelWrap
    >
      <Row gutter={12}>
        <Col span={16}>
          <Card>
            <Meta
              title={t('сompanyPage.formSections.additionalContacts.title')}
              description={t('сompanyPage.formSections.additionalContacts.description')}
            />
            <Divider />
            {renderFormInputs(formFields)}
          </Card>
        </Col>
      </Row>
    </Form>
  )

  return (
    <Spin spinning={formDataLoaded === null}>
      {renderContent()}
    </Spin>
  )

}

export default CompanyContactsForm
