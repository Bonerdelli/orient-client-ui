import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams, useHistory } from 'react-router-dom'
import { Card, Form, Grid, Row, Col, Space, Spin, Skeleton, Button } from 'antd'
import { SaveOutlined, ArrowLeftOutlined, StopOutlined } from '@ant-design/icons'
import { isUndefined, isNull } from 'lodash'

import ErrorResultView from 'ui-components/ErrorResultView'
import Div from 'components/Div' // TODO: from ui-lib

import { CompanyRequisites } from 'library/models/proxy' // TODO: to ui-lib
import { useApi, callApi } from 'library/helpers/api' // TODO: to ui-lib
import { renderFormInputs, baseFormConfig } from 'library/helpers/form'
import { getCompanyRequisites, updateCompanyRequisites } from 'library/api'

import formFields from './BankRequisitesForm.form'
import './BankRequisitesForm.style.less'

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

  const [ formData, setFormData ] = useState<Partial<CompanyRequisites> | null>()
  const [ submitting, setSubmitting ] = useState<boolean>(false)
  const [ initialData, dataLoaded ] = useApi<CompanyRequisites | null>(
    getCompanyRequisites, {
      id: itemId ?? props.itemId,
      companyId,
    },
  )

  useEffect(() => {
    setFormData(initialData)
  }, [initialData])

  const handleItemUpdate = async (data: CompanyRequisites) => {
    const updatedData = await callApi<CompanyRequisites | null>(
      updateCompanyRequisites, {
        id: itemId ?? props.itemId,
        companyId,
      },
      data,
    )
    if (updatedData) {
      setFormData(updatedData)
    }
  }

  const handleFormSubmit = async (data: CompanyRequisites) => {
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
          icon={<SaveOutlined />}
          disabled={submitting}
        >
          {t('common.actions.save.title')}
        </Button>
        <Button
          type="default"
          size="large"
          onClick={handleCancel}
          icon={<StopOutlined />}
        >
          {t('common.actions.cancel.title')}
        </Button>
      </Space>
    </Div>
  )

  const renderCardTitle = () => {
    const title = t('bankRequisitesPage.formSections.main.title')
    if (!backUrl) return title
    return (
      <>
        <Link className="BankRequisitesForm__navigateBack" to={backUrl}>
          <Button icon={<ArrowLeftOutlined />} type="link" size="large"></Button>
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
      return (
        <ErrorResultView centered compact status="error" />
      )
    }
    if (isNull(formData)) {
      return <ErrorResultView centered compact status="warning" />
    }
    if (isUndefined(formData)) {
      return <Skeleton active={dataLoaded === null} />
    }
    return renderFormContent()
  }

  const renderFormContent = () => (
    <Form
      form={form}
      initialValues={formData ?? {}}
      onFinish={(data: CompanyRequisites) => handleFormSubmit(data)}
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
