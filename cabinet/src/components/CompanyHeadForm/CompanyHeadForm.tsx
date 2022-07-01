import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import { Button, Card, Col, Form, Grid, Row, Skeleton, Spin } from 'antd'
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import { isUndefined } from 'lodash'

import ErrorResultView from 'orient-ui-library/components/ErrorResultView'

import { CompanyFounderDto } from 'orient-ui-library/library/models/proxy'
import { callApi, useApi } from 'library/helpers/api' // TODO: to ui-lib
import { baseFormConfig, renderFormInputs } from 'library/helpers/form'
import { getCompanyHead, updateCompanyHead } from 'library/api' // TODO: to ui-lib
import formFields from './CompanyHeadForm.form'
import './CompanyHeadForm.style.less'
import { RETURN_URL_PARAM } from 'library/constants'

const { useBreakpoint } = Grid
const { Item: FormItem } = Form

export interface CompanyHeadFormProps {
  companyId: number,
  backUrl?: string
  id?: number,
}

export interface CompanyHeadPathParams {
  itemId?: string,
}

const CompanyHeadForm: React.FC<CompanyHeadFormProps> = ({ backUrl, companyId, id }) => {
  const { t } = useTranslation()
  const { itemId } = useParams<CompanyHeadPathParams>()
  const breakPoint = useBreakpoint()
  const history = useHistory()
  const { search } = useLocation()
  const returnUrl = new URLSearchParams(search).get(RETURN_URL_PARAM)

  const [ formData, setFormData ] = useState<Partial<CompanyFounderDto>>()
  const [ submitting, setSubmitting ] = useState<boolean>(false)
  const [ initialData, dataLoaded ] = useApi<CompanyFounderDto | null>(
    getCompanyHead, {
      companyId,
      id: id ?? itemId,
    },
  )

  useEffect(() => {
    if (initialData) {
      setFormData(initialData ?? {})
    }
  }, [ initialData ])

  const handleFormSubmit = async (data: CompanyFounderDto) => {
    setSubmitting(true)
    const updatedData = await callApi<CompanyFounderDto | null>(
      updateCompanyHead, {
        companyId,
        id: id ?? itemId,
      },
      data,
    )
    if (updatedData) {
      setFormData(updatedData)
      if (backUrl) {
        history.push(backUrl)
      }
    }
    setSubmitting(false)
  }

  const renderFormActions = () => (
    <FormItem>
      <Button
        type="primary"
        size="large"
        htmlType="submit"
        icon={<SaveOutlined/>}
        disabled={submitting}
      >
        {t('common.actions.save.title')}
      </Button>
    </FormItem>
  )

  const renderCardTitle = () => {
    const title = t('headsPage.formSections.main.title')
    if (!backUrl && !returnUrl) return title

    return (
      <>
        <Link className="CompanyHeadForm__navigateBack" to={(returnUrl || backUrl)!}>
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
    if (isUndefined(formData)) {
      return <Skeleton active={dataLoaded === null}/>
    }
    if (dataLoaded === false) {
      return (
        <ErrorResultView centered status="error"/>
      )
    }
    return renderFormContent()
  }

  const renderFormContent = () => (
    <Form
      initialValues={formData}
      onFinish={(data: CompanyFounderDto) => handleFormSubmit(data)}
      className="CompanyHeadForm"
      data-testid="CompanyHeadForm"
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

export default CompanyHeadForm
