import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Checkbox, Col, Form, Grid, Input, message, Row, Spin } from 'antd'

import { CompanyDto, CompanyFounderDto } from 'orient-ui-library/library/models/proxy'
import { setCompanyFactAddresses, setCompanyShortName } from 'library/api'
import { twoColumnFormConfig } from 'library/helpers/form'

import companyFormFields, {
  CompanyFormInputConfig,
  renderFieldWithSaveHandler,
  renderTextInput,
  renderTextInputs,
} from './CompanyForm.form'
import './CompanyForm.style.less'
import { convertCompanyDtoToFormValues } from 'components/CompanyForm/converters/dto-to-company-form-values.converter'

const { useBreakpoint } = Grid

export interface CompanyFormProps {
  company: CompanyDto,
  companyHead?: CompanyFounderDto,
}

interface CompanyFormValues extends Omit<CompanyDto, 'isMsp'> {
  isMsp: string
}

const CompanyForm: React.FC<CompanyFormProps> = ({ company, companyHead }) => {
  const { t } = useTranslation()
  const breakPoint = useBreakpoint()
  const [ form ] = Form.useForm<CompanyFormValues>()

  const [ companyHeadName, setCompanyHeadName ] = useState<string>()
  const [ isAddressesSame, setIsAddressesSame ] = useState<boolean>(company.isAddressesSame ?? false)
  const [ submitting, setSubmitting ] = useState<boolean>(false)
  const initialFormValues = convertCompanyDtoToFormValues(company)

  useEffect(() => {
    if (companyHead) {
      const { firstName, lastName, secondName } = companyHead
      setCompanyHeadName(`${lastName} ${firstName} ${secondName}`)
    }
  }, [ companyHead ])

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
      {companyFormFields.main.map(item => item[1] === 'shortName'
        ? renderFieldWithSaveHandler(item, () => updateCompanyName(form.getFieldValue('shortName')))
        : renderTextInput(...item))}
    </Card>
  )

  const factFields = [ 'soatoFact', 'addressFact' ]
  const getConfigForFactField = (config: CompanyFormInputConfig): CompanyFormInputConfig => {
    const cfg = [ ...config ] as CompanyFormInputConfig
    cfg[3] = !isAddressesSame
    cfg[4] = !isAddressesSame
    return cfg
  }
  const handleAddressesSameChange = () => {
    const newSameAddressState = !isAddressesSame

    if (newSameAddressState) {
      const soato = form.getFieldValue('soato')
      const address = form.getFieldValue('address')
      form.setFieldsValue({ addressFact: address, soatoFact: soato })
    }

    setIsAddressesSame(newSameAddressState)
    setSubmitting(true)
    updateFactAddress()
  }
  const updateFactAddress = async () => {
    if (!company) return

    const requestData = form.getFieldsValue([ 'soatoFact', 'addressFact', 'isAddressesSame' ])
    const result = await setCompanyFactAddresses(company.id!, requestData)
    if (!result.success) {
      message.error(t('common.errors.requestError.title'))
    }
    setSubmitting(false)
  }

  const renderContacts = () => (
    <Card title={t('companyPage.formSections.contacts.title')}>
      {companyFormFields.contacts.map((fieldConfig: CompanyFormInputConfig, index: number) => (
        <React.Fragment key={index}>
          {factFields.includes(fieldConfig[1])
            ? renderFieldWithSaveHandler(getConfigForFactField(fieldConfig), updateFactAddress)
            : renderTextInput(...fieldConfig)}
        </React.Fragment>),
      )}
      <Form.Item key="isAddressesSame"
                 name="isAddressesSame"
                 valuePropName="checked">
        <Checkbox onChange={handleAddressesSameChange}>
          {t('companyPage.formSections.contacts.isAddressesSame')}
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
      <Form.Item label={t('companyPage.formFields.lastName.title')}>
        <Input value={companyHeadName} disabled/>
      </Form.Item>
      <Form.Item label={t('companyPage.formFields.inn.title')}>
        <Input value={companyHead?.inn} disabled/>
      </Form.Item>
    </Card>
  )

  const handleFormSubmit = () => {
    setSubmitting(true)
  }

  const renderContent = () => (
    <Form
      form={form}
      initialValues={initialFormValues}
      onFinish={handleFormSubmit}
      className="CompanyForm"
      data-testid="CompanyForm"
      {...twoColumnFormConfig(breakPoint)}
    >
      <Row gutter={12}>
        <Col xs={24} xl={12} xxl={10}>
          <Row gutter={12}>
            <Col span={24}>
              {renderMainSection()}
            </Col>
            <Col span={24}>
              {renderFounder()}
            </Col>
          </Row>
        </Col>
        <Col xs={24} xl={12} xxl={10}>
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
