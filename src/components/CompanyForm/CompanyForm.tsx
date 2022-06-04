import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Form, Row, Col, Spin } from 'antd'

import Div from 'ui-components/Div'
import ErrorResultView from 'ui-components/ErrorResultView'

import { renderTextInputs } from 'library/helpers/form'
import { Company } from 'library/models/proxy' // TODO: to ui-lib
import { useApi } from 'library/helpers/api' // TODO: to ui-lib
import { getCompany } from 'library/api' // TODO: to ui-lib

import companyFormFields from './CompanyForm.form'
import './CompanyForm.style.less'

const { useFormInstance } = Form

const CompanyForm = () => {
  const { t } = useTranslation()
  const form = useFormInstance()

  const [ company, setCompany ] = useState<Company>()
  const [ companies, companyLoaded ] = useApi<Company[]>(getCompany)

  useEffect(() => {
    if (companies?.length) {
      // NOTE: take first company because multiple companies not supported
      // TODO: ask be to make endpoint with default company
      setCompany(companies[0])
    }
  }, [companies])

  console.log('useForm', form)

  const renderMainSection = () => (
    <Card title={t('сompanyPage.formSections.main.title')}>
      {renderTextInputs(form, companyFormFields.main)}
    </Card>
  )
  const renderContacts = () => (
    <Card title={t('сompanyPage.formSections.contacts.title')}>
      {renderTextInputs(form, companyFormFields.contacts)}
    </Card>
  )
  const renderRegAuthority = () => (
    <Card title={t('сompanyPage.formSections.regAuthority.title')}>
      {renderTextInputs(form, companyFormFields.regAuthority)}
    </Card>
  )
  const renderFounder = () => (
    <Card title={t('сompanyPage.formSections.founder.title')}>
      {renderTextInputs(form, companyFormFields.founder)}
    </Card>
  )

  const handleFormChange = (changedValues: Record<string, string>) => {
    console.log('values', changedValues)
  }

  if (companyLoaded === false) {
    return (
      <ErrorResultView centered={true} status="error" />
    )
  }

  if (!company) {
    return (
      <Div className="AppLayout__loaderWrap">
        <Spin size="large" />
      </Div>
    )
  }

  const renderContent = () => (
    <Form
      form={form}
      initialValues={company}
      onValuesChange={handleFormChange}
      className="CompanyForm"
      data-testid="CompanyForm"
      labelCol={{ span: 10 }}
      wrapperCol={{ flex: 1 }}
      labelAlign="left"
      requiredMark={false}
      colon={false}
      labelWrap
    >
      <Row gutter={12}>
        <Col span={12} key="first">
          {renderMainSection()}
        </Col>
        <Col span={12} key="second">
          <Row gutter={[0, 12]}>
            <Col span={24}>
              <fieldset name="company">
                {renderContacts()}
              </fieldset>
            </Col>
            <Col span={24}>{renderRegAuthority()}</Col>
            <Col span={24}>{renderFounder()}</Col>
          </Row>
        </Col>
      </Row>
    </Form>
  )

  return (
    <Spin spinning={companyLoaded === null}>
      {renderContent()}
    </Spin>
  )

}

export default CompanyForm
