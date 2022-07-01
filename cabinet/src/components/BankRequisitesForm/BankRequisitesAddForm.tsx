import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { Button, Card, Col, Form, Grid, message, Row, Space, Spin } from 'antd'
import { ArrowLeftOutlined, PlusOutlined, StopOutlined } from '@ant-design/icons'

import Div from 'orient-ui-library/components/Div'

import { CompanyRequisitesDto } from 'orient-ui-library/library/models/proxy'
import { callApi } from 'library/helpers/api' // TODO: to ui-lib
import { baseFormConfig, renderFormInputs } from 'library/helpers/form'
import { addCompanyRequisites } from 'library/api'

import formFields from './BankRequisitesForm.form'
import './BankRequisitesForm.style.less'
import { RETURN_URL_PARAM } from 'library/constants'

const { useBreakpoint } = Grid
const { useForm } = Form

export interface BankRequisitesAddFormProps {
  companyId: number,
  backUrl?: string
}

export const BankRequisitesAddForm: React.FC<BankRequisitesAddFormProps> = (props) => {
  const { backUrl, companyId } = props

  const { t } = useTranslation()
  const history = useHistory()
  const breakpoint = useBreakpoint()
  const [ form ] = useForm()
  const { search } = useLocation()
  const returnUrl = new URLSearchParams(search).get(RETURN_URL_PARAM)

  const [ formData, setFormData ] = useState<Partial<CompanyRequisitesDto>>()
  const [ submitting, setSubmitting ] = useState<boolean>(false)
  const [ submitResult, setSubmitResult ] = useState<boolean>()

  const handleItemCreate = async (data: CompanyRequisitesDto): Promise<boolean> => {
    const insertedData = await callApi<CompanyRequisitesDto | null>(
      addCompanyRequisites, {
        companyId,
      },
      data,
    )
    if (insertedData) {
      setFormData(insertedData)
    }
    return Boolean(insertedData)
  }

  const handleFormSubmit = async (data: CompanyRequisitesDto) => {
    setSubmitting(true)
    const result = await handleItemCreate(data)
    setSubmitResult(result)
    setSubmitting(false)
    if (backUrl && result) {
      history.push(backUrl)
    }
    if (!result) {
      message.error(t('common.errors.requestError.title'))
    }
  }


  const handleCancel = () => {
    form.resetFields()
    if (backUrl) {
      history.push(backUrl)
    }
  }

  const renderFormActions = () => (
    <Div className="Form__actions">
      <Space>
        <Button
          type="primary"
          size="large"
          htmlType="submit"
          icon={<PlusOutlined/>}
          danger={submitResult === false}
          disabled={submitting}
        >
          {t('common.actions.add.title')}
        </Button>
        <Button
          type="default"
          size="large"
          onClick={handleCancel}
          icon={<StopOutlined/>}
        >
          {t('common.actions.cancel.title')}
        </Button>
      </Space>
    </Div>
  )

  const renderCardTitle = () => {
    const title = t('bankRequisitesPage.formSections.main.title')
    if (!backUrl && !returnUrl) return title
    return (
      <>
        <Link className="BankRequisitesForm__navigateBack" to={(returnUrl || backUrl)!}>
          <Button icon={<ArrowLeftOutlined/>} type="link" size="large"></Button>
        </Link>
        {title}
      </>
    )
  }

  const renderCardContent = () => (
    <Card title={renderCardTitle()}>
      {renderFormContent()}
    </Card>
  )

  const renderFormContent = () => (
    <Form
      form={form}
      initialValues={formData}
      onFinish={(data: CompanyRequisitesDto) => handleFormSubmit(data)}
      className="BankRequisitesForm"
      data-testid="BankRequisitesForm"
      {...baseFormConfig(breakpoint)}
    >
      <Spin spinning={submitting}>
        {renderFormInputs(formFields)}
        {renderFormActions()}
      </Spin>
    </Form>
  )

  return (
    <Row gutter={12}>
      <Col xs={24} xl={18} xxl={14} className="relative">
        {renderCardContent()}
      </Col>
    </Row>
  )

}

export default BankRequisitesAddForm // TODO: rename to BankRequisitesAddForm maybe?
