import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Form, Row, Col, Spin, Divider, Button } from 'antd'
import { SaveOutlined } from '@ant-design/icons'

import Div from 'ui-components/Div'
import ErrorResultView from 'ui-components/ErrorResultView'

import { renderFormInputs } from 'library/helpers/form'
import { CompanyHead } from 'library/models/proxy' // TODO: to ui-lib
import { useApi } from 'library/helpers/api' // TODO: to ui-lib
import { getCompanyHead, updateCompanyHead } from 'library/api' // TODO: to ui-lib

import formFields from './CompanyHeadForm.form'

const { Meta } = Card
const { Item: FormItem } = Form

export interface CompanyHeadFormProps {
  companyId: number,
  id: number,
}

const CompanyHeadForm: React.FC<CompanyHeadFormProps> = ({
  companyId,
  id,
}) => {
  const { t } = useTranslation()

  const [ formData, setFormData ] = useState<Partial<CompanyHead>>()
  const [ submitting, setSubmitting ] = useState<boolean>()
  const [ _, setSubmitSuccess ] = useState<boolean>()

  const [ companyHeadData, dataLoaded ] = useApi<CompanyHead | null>(
    // TODO: update generic with no API Success wrapper
    getCompanyHead, { companyId, id },
  )

  useEffect(() => {
    setFormData(companyHeadData ?? {})
  }, [ companyHeadData ])

  const handleFormSubmit = async (data: CompanyHead) => {
    setSubmitting(true)
    const result = await updateCompanyHead(data, { companyId, id })
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
      initialValues={formData}
      onFinish={(data: CompanyHead) => handleFormSubmit(data)}
      className="CompanyHeadForm"
      data-testid="CompanyHeadForm"
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

export default CompanyHeadForm
