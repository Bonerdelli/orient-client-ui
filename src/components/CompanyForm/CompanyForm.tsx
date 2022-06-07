import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Form, Row, Col, Spin, message } from 'antd'

import Div from 'ui-components/Div'
import ErrorResultView from 'ui-components/ErrorResultView'

import { Company } from 'library/models/proxy' // TODO: to ui-lib
import { useApi } from 'library/helpers/api' // TODO: to ui-lib
import { getCompany, setCompanyShortName } from 'library/api' // TODO: to ui-lib

import companyFormFields, { renderTextInputs } from './CompanyForm.form'
import './CompanyForm.style.less'

const CompanyForm = () => {
  const { t } = useTranslation()

  const [ company, setCompany ] = useState<Company>()
  const [ companies, companyLoaded ] = useApi<Company[]>(getCompany)
  const [ submitting, setSubmitting ] = useState<boolean>(false)

  useEffect(() => {
    if (companies?.length) {
      // NOTE: take first company because multiple companies not supported
      // TODO: ask be to make endpoint with default company
      setCompany(companies[0])
    }
  }, [companies])

  const updateCompanyName = async (value: string) => {
    if (company) {
      const result = await setCompanyShortName(
        { companyId: company.id as number },
        { shortName: value },
      )
      if (!result) {
        message.error(t('common.errors.requestError.title'))
      }
    }
    setSubmitting(false)
  }

  const renderMainSection = () => (
    <Card title={t('сompanyPage.formSections.main.title')}>
      <Spin spinning={submitting}>
        {renderTextInputs(companyFormFields.main)}
      </Spin>
    </Card>
  )
  const renderContacts = () => (
    <Card title={t('сompanyPage.formSections.contacts.title')}>
      {renderTextInputs(companyFormFields.contacts)}
    </Card>
  )
  const renderRegAuthority = () => (
    <Card title={t('сompanyPage.formSections.regAuthority.title')}>
      {renderTextInputs(companyFormFields.regAuthority)}
    </Card>
  )
  const renderFounder = () => (
    <Card title={t('сompanyPage.formSections.founder.title')}>
      {renderTextInputs(companyFormFields.founder)}
    </Card>
  )

  const handleFormSubmit = (values: Record<string, string>) => {
    updateCompanyName(values.shortName)
    setSubmitting(true)
  }

  if (companyLoaded === false) {
    return (
      <ErrorResultView centered status="error" />
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
      initialValues={company}
      onFinish={handleFormSubmit}
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
              {renderContacts()}
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
