import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Form, Grid, Row, Col, Spin, message } from 'antd'

import { Company } from 'library/models/proxy' // TODO: to ui-lib
import { setCompanyShortName } from 'library/api'
import { twoColumnFormConfig } from 'library/helpers/form'

import companyFormFields, { renderTextInputs } from './CompanyForm.form'
import './CompanyForm.style.less'

const { useBreakpoint } = Grid

export interface CompanyFormProps {
  company: Company,
}

const CompanyForm: React.FC<CompanyFormProps> = ({ company }) => {
  const { t } = useTranslation()
  const breakPoint = useBreakpoint()

  const [ submitting, setSubmitting ] = useState<boolean>(false)

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
    <Card
      className="CompanyForm__mainInfo"
      title={t('сompanyPage.formSections.main.title')}
    >
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

  const renderContent = () => (
    <Form
      initialValues={company}
      onFinish={handleFormSubmit}
      className="CompanyForm"
      data-testid="CompanyForm"
      {...twoColumnFormConfig(breakPoint)}
    >
      <Row gutter={12}>
        <Col xs={24} xl={12} xxl={10} key="first">
          {renderMainSection()}
        </Col>
        <Col xs={24} xl={12} xxl={10} key="second">
          <Row gutter={[12, 12]}>
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
    <Spin spinning={false}>
      {renderContent()}
    </Spin>
  )

}

export default CompanyForm
