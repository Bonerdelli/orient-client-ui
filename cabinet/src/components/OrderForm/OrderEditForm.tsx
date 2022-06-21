/**
 * TODO: remove this or use
 */

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams, useHistory } from 'react-router-dom'
import { Card, Form, Grid, Row, Col, Space, Spin, Skeleton, Button } from 'antd'
import { SaveOutlined, ArrowLeftOutlined, StopOutlined } from '@ant-design/icons'
import { isUndefined, isNull } from 'lodash'

import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import Div from 'orient-ui-library/components/Div'

import { Order } from 'library/models/order'
import { useApi, callApi } from 'library/helpers/api' // TODO: to ui-lib
import { renderFormInputs, baseFormConfig } from 'library/helpers/form'
import { getCompanyOrder, updateCompanyOrder } from 'library/api'

import formFields from './OrderForm.form'
import './OrderForm.style.less'

const { useBreakpoint } = Grid
const { useForm } = Form

export interface OrderEditFormProps {
  companyId: number,
  backUrl?: string
  itemId?: number,
}

export interface OrderPathParams {
  itemId?: string,
}

export const OrderEditForm: React.FC<OrderEditFormProps> = (props) => {
  const { backUrl, companyId } = props

  const { t } = useTranslation()
  const history = useHistory()
  const { itemId } = useParams<OrderPathParams>()
  const breakPoint = useBreakpoint()
  const [ form ] = useForm()

  const [ formData, setFormData ] = useState<Partial<Order> | null>()
  const [ submitting, setSubmitting ] = useState<boolean>(false)
  const [ initialData, dataLoaded ] = useApi<Order | null>(
    getCompanyOrder, {
      id: itemId ?? props.itemId,
      companyId,
    },
  )

  useEffect(() => {
    setFormData(initialData)
  }, [initialData])

  const handleItemUpdate = async (data: Order) => {
    const updatedData = await callApi<Order | null>(
      updateCompanyOrder, {
        id: itemId ?? props.itemId,
        companyId,
      },
      data,
    )
    if (updatedData) {
      setFormData(updatedData)
    }
  }

  const handleFormSubmit = async (data: Order) => {
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
        <Link className="OrderForm__navigateBack" to={backUrl}>
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
      return <ErrorResultView centered compact status="error" />
    }
    if (dataLoaded && isNull(initialData)) {
      return <ErrorResultView centered compact status="warning" />
    }
    if (isUndefined(formData) || isNull(formData)) {
      return <Skeleton active={dataLoaded === null} />
    }
    return renderFormContent()
  }

  const renderFormContent = () => (
    <Form
      form={form}
      initialValues={formData ?? {}}
      onFinish={(data: Order) => handleFormSubmit(data)}
      className="OrderForm"
      data-testid="OrderForm"
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

export default OrderEditForm // TODO: rename to OrderEditForm maybe?
