import { useTranslation } from 'react-i18next'
import { Card, Form, Input, Row, Col } from 'antd'

const { Item: FormItem } = Form

import './CompanyForm.style.less'

// const { Paragraph } = Typography

type FormInputConfig = [
  string, // Model
  string, // Name
  boolean, // Is Required
  boolean? // Is Editable
]

const CompanyForm = () => {
  const { t } = useTranslation()
  const requiredRule = {
    required: true,
  }
  const renderTextInput = (model: string, field: string, isRequired: boolean, isEditable = false) => (
    <FormItem
      key={`${model}.${field}`}
      name={`${model}.${field}`}
      label={t(`models.${model}.fields.${field}.title`)}
      rules={isRequired ? [requiredRule] : []}
    >
      <Input disabled={!isEditable} />
    </FormItem>
  )
  const renderTextInputs = (inputConfig: FormInputConfig[]) => inputConfig.map(item => renderTextInput(...item))
  const renderMainSection = () => (
    <Card title={t('сompanyPage.formSections.main.title')}>
      {renderTextInputs([
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
      ])}
    </Card>
  )
  const renderContacts = () => (
    <Card title={t('сompanyPage.formSections.contacts.title')}>
      {renderTextInputs([
        [ 'companyContact', 'primaryEmail',    false ],
        [ 'companyContact', 'additionalEmail', false ],
        [ 'companyContact', 'primaryPhone',    true ],
        [ 'companyContact', 'additionalPhone', true ],
      ])}
    </Card>
  )
  const renderRegAuthority = () => (
    <Card title={t('сompanyPage.formSections.regAuthority.title')}>
      {renderTextInputs([
        [ 'company', 'regAuthority', true ],
        [ 'company', 'regDate', true ],
        [ 'company', 'regNumber', true ],
      ])}
    </Card>
  )
  const renderFounder = () => (
    <Card title={t('сompanyPage.formSections.founder.title')}>
      {renderTextInputs([
        [ 'companyFounder', 'lastName', true ], // TODO: ask for compound field
        [ 'companyFounder', 'inn', false ],
      ])}
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
