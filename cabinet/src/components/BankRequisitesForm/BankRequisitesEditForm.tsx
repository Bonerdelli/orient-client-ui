import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import { Button, Card, Col, Form, Grid, Row, Skeleton, Space, Spin } from 'antd'
import { ArrowLeftOutlined, SaveOutlined, StopOutlined } from '@ant-design/icons'
import { isNull, isUndefined } from 'lodash'

import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import Div from 'orient-ui-library/components/Div'

import { CompanyRequisitesDto } from 'orient-ui-library/library/models/proxy'
import { callApi, useApi } from 'library/helpers/api' // TODO: to ui-lib
import { baseFormConfig, renderFormInputs } from 'library/helpers/form'
import { getCompanyRequisites, updateCompanyRequisites } from 'library/api'

import formFields from './BankRequisitesForm.form'
import './BankRequisitesForm.style.less'
import { RETURN_URL_PARAM } from 'library/constants'

const { useBreakpoint } = Grid
const { useForm } = Form

export interface BankRequisitesEditFormProps {
  companyId: number,
  backUrl?: string
  itemId?: number,
}

export interface CompanyRequisitesPathParams {
  itemId?: string,
}

export const BankRequisitesEditForm: React.FC<BankRequisitesEditFormProps> = (props) => {
  const { backUrl, companyId } = props

  const { t } = useTranslation()
  const history = useHistory()
  const { itemId } = useParams<CompanyRequisitesPathParams>()
  const breakPoint = useBreakpoint()
  const [ form ] = useForm()
  const { search } = useLocation()
  const returnUrl = new URLSearchParams(search).get(RETURN_URL_PARAM)

  const [ formData, setFormData ] = useState<Partial<CompanyRequisitesDto> | null>()
  const [ submitting, setSubmitting ] = useState<boolean>(false)
  const [ initialData, dataLoaded ] = useApi<CompanyRequisitesDto | null>(
    getCompanyRequisites, {
      id: itemId ?? props.itemId,
      companyId,
    },
  )

  useEffect(() => {
    setFormData(initialData)
  }, [ initialData ])

  const handleItemUpdate = async (data: CompanyRequisitesDto) => {
    const updatedData = await callApi<CompanyRequisitesDto | null>(
      updateCompanyRequisites,
      { companyId },
      {
        ...data,
        id: itemId ?? props.itemId,
      },
    )
    if (updatedData) {
      setFormData(updatedData)
    }
  }

  const handleFormSubmit = async (data: CompanyRequisitesDto) => {
    setSubmitting(true)
    await handleItemUpdate(data)
    setSubmitting(false)
    if (backUrl) {
      history.push(backUrl)
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
          icon={<SaveOutlined/>}
          disabled={submitting}
        >
          {t('common.actions.save.title')}
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
      {renderForm()}
    </Card>
  )

  const renderForm = () => {
    if (dataLoaded === false) {
      return <ErrorResultView centered compact status="error"/>
    }
    if (dataLoaded && isNull(initialData)) {
      return <ErrorResultView centered compact status="warning"/>
    }
    if (isUndefined(formData) || isNull(formData)) {
      return <Skeleton active={dataLoaded === null}/>
    }
    return renderFormContent()
  }

  const renderFormContent = () => (
    <Form
      form={form}
      initialValues={formData ?? {}}
      onFinish={(data: CompanyRequisitesDto) => handleFormSubmit(data)}
      className="BankRequisitesForm"
      data-testid="BankRequisitesForm"
      {...baseFormConfig(breakPoint)}
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

export default BankRequisitesEditForm // TODO: rename to BankRequisitesEditForm maybe?
