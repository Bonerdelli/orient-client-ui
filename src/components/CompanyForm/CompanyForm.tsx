import { useTranslation } from 'react-i18next'
import { Card, Form, Row, Col, Spin } from 'antd'

import ErrorResultView from 'ui-components/ErrorResultView'

import { renderTextInputs } from 'library/helpers/form'
import { Company } from 'library/models/proxy' // TODO: to ui-lib
import { useApi } from 'library/helpers/api' // TODO: to ui-lib
import { getCompanyById } from 'library/api' // TODO: to ui-lib

import companyFormFields from './CompanyForm.form'
import './CompanyForm.style.less'

// TODO: replace this when solve issue with "Bad company id provided"
// for /client/company endpoint
const FAKE_COMPANY_ID = 9

const CompanyForm = () => {
  const { t } = useTranslation()
  const [ company, companyLoaded ] = useApi<Company>(
    getCompanyById,
    { id: FAKE_COMPANY_ID }
  )

  const renderMainSection = () => (
    <Card title={t('сompanyPage.formSections.main.title')}>
      {renderTextInputs(companyFormFields.main)}
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

  if (companyLoaded === false) {
    return (
      <ErrorResultView centered={true} status="error" />
    )
  }

  const renderContent = () => (
    <Form
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
            <Col span={24}>{renderContacts()}</Col>
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
