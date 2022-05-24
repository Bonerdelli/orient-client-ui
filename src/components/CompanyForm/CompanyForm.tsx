import { useTranslation } from 'react-i18next'
import { Card, Form, Row, Col } from 'antd'

import { FormInputConfig, renderTextInputs } from 'library/helpers/form'

import './CompanyForm.style.less'

const companyFormFields: Record<string, FormInputConfig[]> = {
  main: [
    [ 'company', 'fullName', true ],
    [ 'company', 'shortName', false, true ],
    [ 'company', 'inn', true ],
    [ 'company', 'opf', true ],
    // TODO: make a two-cols layout
    [ 'company', 'isMsp', true ],
    [ 'company', 'capital', true ],
    [ 'company', 'currency', true ],
    [ 'company', 'oked', true ],
    [ 'company', 'soogu', true ],
    [ 'company', 'state', true ],
  ],
  contacts: [
    [ 'companyContact', 'primaryEmail',    false ],
    [ 'companyContact', 'additionalEmail', false ],
    [ 'companyContact', 'primaryPhone',    true ],
    [ 'companyContact', 'additionalPhone', true ],
  ],
  regAuthority: [
    [ 'company', 'regAuthority', true ],
    [ 'company', 'regDate', true ],
    [ 'company', 'regNumber', true ],
  ],
  founder: [
    [ 'companyFounder', 'lastName', true ], // TODO: ask for compound field
    [ 'companyFounder', 'inn', false ],
  ],
}

const CompanyForm = () => {
  const { t } = useTranslation()

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

  return (
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
}

export default CompanyForm
