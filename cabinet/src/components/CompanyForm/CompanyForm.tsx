import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Checkbox, Col, Form, Grid, message, Row, Spin } from 'antd'

import { Company } from 'orient-ui-library/library/models/proxy'
import { setCompanyShortName } from 'library/api'
import { twoColumnFormConfig } from 'library/helpers/form'

import companyFormFields, { CompanyFormInputConfig, renderTextInput, renderTextInputs } from './CompanyForm.form'
import './CompanyForm.style.less'

const { useBreakpoint } = Grid

export interface CompanyFormProps {
  company: Company,
}

const CompanyForm: React.FC<CompanyFormProps> = ({ company }) => {
  const { t } = useTranslation()
  const breakPoint = useBreakpoint()
  const [ form ] = Form.useForm<Company>();

  const [ isAddressesSame, setIsAddressesSame ] = useState<boolean>(form.getFieldValue('isAddressesSame'));
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
      title={t('companyPage.formSections.main.title')}
    >
      {renderTextInputs(companyFormFields.main)}
    </Card>
  )

  const factFields = [ 'soatoFact', 'addressFact' ];
  const getFieldConfigForFactField = (config: CompanyFormInputConfig): CompanyFormInputConfig => {
    const cfg = [ ...config ] as CompanyFormInputConfig;
    cfg[3] = !isAddressesSame;
    return cfg;
  }
  const handleAddressesSameChange = () => {
    const newSameAddressState = !isAddressesSame;

    if (newSameAddressState) {
      const soato = form.getFieldValue('soato');
      const address = form.getFieldValue('address');
      form.setFieldsValue({ addressFact: address, soatoFact: soato });
    }

    setIsAddressesSame(newSameAddressState);
  }

  const renderContacts = () => (
    <Card title={t('companyPage.formSections.contacts.title')}>
      {companyFormFields.contacts.map((fieldConfig: CompanyFormInputConfig, index: number) => (
        <React.Fragment key={index}>
          {factFields.includes(fieldConfig[1])
            ? renderTextInput(...getFieldConfigForFactField(fieldConfig))
            : renderTextInput(...fieldConfig)}
        </React.Fragment>)
      )}
      <Form.Item name="isAddressesSame"
                 valuePropName="checked">
        <Checkbox onChange={handleAddressesSameChange}>
          Фактический адрес совпадает с адресом регистрации
        </Checkbox>
      </Form.Item>
    </Card>
  )
  const renderRegAuthority = () => (
    <Card title={t('companyPage.formSections.regAuthority.title')}>
      {renderTextInputs(companyFormFields.regAuthority)}
    </Card>
  )
  const renderFounder = () => (
    <Card title={t('companyPage.formSections.founder.title')}>
      {renderTextInputs(companyFormFields.founder)}
    </Card>
  )

  const handleFormSubmit = (values: Record<string, string>) => {
    updateCompanyName(values.shortName)
    setSubmitting(true)
  }

  const renderContent = () => (
    <Form
      form={form}
      initialValues={company}
      onFinish={handleFormSubmit}
      className="CompanyForm"
      data-testid="CompanyForm"
      {...twoColumnFormConfig(breakPoint)}
    >
      <Row gutter={12}>
        <Col xs={24} xl={12} xxl={10} key="first">
          <Row gutter={12}>
            <Col span={24}>
              {renderMainSection()}
            </Col>
            <Col span={24}>
              {renderFounder()}
            </Col>
          </Row>
        </Col>
        <Col xs={24} xl={12} xxl={10} key="second">
          <Row gutter={[ 12, 12 ]}>
            <Col span={24}>
              {renderContacts()}
            </Col>
            <Col span={24}>
              {renderRegAuthority()}
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  )

  return (
    <Spin spinning={submitting}>
      {renderContent()}
    </Spin>
  )

}

export default CompanyForm
