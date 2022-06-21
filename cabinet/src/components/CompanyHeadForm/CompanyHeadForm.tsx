import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams, useHistory } from 'react-router-dom'
import { Card, Form, Grid, Row, Col, Spin, Skeleton, Button } from 'antd'
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { isUndefined } from 'lodash'

import ErrorResultView from 'orient-ui-library/components/ErrorResultView'

import { CompanyHead } from 'library/models/proxy' // TODO: to ui-lib
import { useApi, callApi } from 'library/helpers/api' // TODO: to ui-lib
import { renderFormInputs, baseFormConfig } from 'library/helpers/form'
import { getCompanyHead, updateCompanyHead } from 'library/api' // TODO: to ui-lib

import formFields from './CompanyHeadForm.form'
import './CompanyHeadForm.style.less'

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

  const [ formData, setFormData ] = useState<Partial<CompanyHead>>()
  const [ submitting, setSubmitting ] = useState<boolean>(false)
  const [ initialData, dataLoaded ] = useApi<CompanyHead | null>(
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

  const handleFormSubmit = async (data: CompanyHead) => {
    setSubmitting(true)
    const updatedData = await callApi<CompanyHead | null>(
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
        icon={<SaveOutlined />}
        disabled={submitting}
      >
        {t('common.actions.save.title')}
      </Button>
    </FormItem>
  )

  const renderCardTitle = () => {
    const title = t('headsPage.formSections.main.title')
    if (!backUrl) return title
    return (
      <>
        <Link className="CompanyHeadForm__navigateBack" to={backUrl}>
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
    if (isUndefined(formData)) {
      return <Skeleton active={dataLoaded === null} />
    }
    if (dataLoaded === false) {
      return (
        <ErrorResultView centered status="error" />
      )
    }
    return renderFormContent()
  }

  const renderFormContent = () => (
    <Form
      initialValues={formData}
      onFinish={(data: CompanyHead) => handleFormSubmit(data)}
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
