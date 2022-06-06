import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Form, Row, Col, Spin, Divider, Button } from 'antd'
import { SaveOutlined } from '@ant-design/icons'

import Div from 'ui-components/Div'
import ErrorResultView from 'ui-components/ErrorResultView'

import { renderFormInputs } from 'library/helpers/form'
import { CompanyContacts } from 'library/models/proxy' // TODO: to ui-lib
import { useApi } from 'library/helpers/api' // TODO: to ui-lib
import { getCompanyContacts, updateCompanyContacts } from 'library/api' // TODO: to ui-lib

import { FAKE_COMPANY_ID } from 'library/mock/company'
import formFields from './CompanyContactsForm.form'

const { Item: FormItem } = Form
const { Meta } = Card // TODO: replace after be updates

export interface CompanyContactsFormProps {
  companyId: number,
  id: number,
}

const CompanyContactsForm: React.FC<CompanyContactsFormProps> = ({ id = FAKE_COMPANY_ID }) => {
  const { t } = useTranslation()


  const [ formData, setFormData ] = useState<Partial<CompanyContacts>>()
  const [ submitting, setSubmitting ] = useState<boolean>()
  const [ _, setSubmitSuccess ] = useState<boolean>()

  const [ companyHeadData, dataLoaded ] = useApi<CompanyContacts | null>(
    // TODO: update generic with no API Success wrapper
    getCompanyContacts, { companyId: id },
  )

  useEffect(() => {
    setFormData(companyHeadData ?? {})
  }, [ companyHeadData ])

  const handleFormSubmit = async (data: CompanyContacts) => {
    setSubmitting(true)
    const result = await updateCompanyContacts(data, { companyId, id })
    if (result) {
      setFormData(result)
      setSubmitSuccess(true)
    }
    setSubmitting(false)
  }


  if (dataLoaded === false) {
    return (
      <ErrorResultView centered status="error" />
    )
  }

  if (!formData) {
    return (
      <Div className="AppLayout__loaderWrap">
        <Spin size="large" />
      </Div>
    )
  }

  const renderFormActions = () => (
    <FormItem>
      <Button
        type="primary"
        size="large"
        icon={<SaveOutlined />}
        disabled={submitting}
      >
        {t('common.actions.save.title')}
      </Button>
    </FormItem>
  )

  const renderContent = () => (
    <Form
      initialValues={formData || {}}
      onFinish={(data: CompanyContacts) => handleFormSubmit(data)}
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
            {renderFormActions()}
          </Card>
        </Col>
      </Row>
    </Form>
  )

  return (
    <Spin spinning={dataLoaded === null}>
      {renderContent()}
    </Spin>
  )

}

export default CompanyContactsForm
