import { useTranslation } from 'react-i18next'
import { Card, Form, Input, Row, Col } from 'antd'

const { Item: FormItem } = Form

import './CompanyForm.style.less'

// const { Paragraph } = Typography

const CompanyForm = () => {
  const { t } = useTranslation()
  const requiredRule = {
    required: true,
  }
  const renderTextInput = (name: string, isRequired: boolean) => (
    <FormItem
      key={name}
      name={name}
      label={t(`models.company.fields.${name}.title`)}
      rules={isRequired ? [requiredRule] : []}
    >
      <Input />
    </FormItem>
  )
  const renderMainSection = () => (
    <Card title={t('сompanyPage.formSections.main.title')}>
      {renderTextInput('fullName', true)}
    </Card>
  )
  const renderContacts = () => (
    <Card title={t('сompanyPage.formSections.contacts.title')}>

    </Card>
  )
  const renderRegAuthority = () => (
    <Card title={t('сompanyPage.formSections.regAuthority.title')}>

    </Card>
  )
  const renderFounder = () => (
    <Card title={t('сompanyPage.formSections.founder.title')}>

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
        <Col span={12}>
          {renderMainSection()}
        </Col>
        <Col span={12}>
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
