import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Form, Grid, Row, Col, Spin, Skeleton, Divider, Button } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { isUndefined } from 'lodash'

import ErrorResultView from 'ui-components/ErrorResultView'

import { CompanyHead } from 'library/models/proxy' // TODO: to ui-lib
import { useApi, callApi } from 'library/helpers/api' // TODO: to ui-lib
import { renderFormInputs, baseFormConfig } from 'library/helpers/form'
import { getCompanyHead, updateCompanyHead } from 'library/api' // TODO: to ui-lib

import formFields from './CompanyHeadForm.form'

const { useBreakpoint } = Grid
const { Item: FormItem } = Form
const { Meta } = Card

export interface CompanyHeadFormProps {
  companyId: number,
}

const CompanyHeadForm: React.FC<CompanyHeadFormProps> = ({ companyId }) => {
  const { t } = useTranslation()
  const breakPoint = useBreakpoint()

  const [ formData, setFormData ] = useState<Partial<CompanyHead>>()
  const [ submitting, setSubmitting ] = useState<boolean>(false)
  const [ initialData, dataLoaded ] = useApi<CompanyHead | null>(
    getCompanyHead,
    { companyId },
  )

  useEffect(() => {
    if (initialData) {
      setFormData(initialData ?? {})
    }
  }, [ initialData ])

  const handleFormSubmit = async (data: CompanyHead) => {
    setSubmitting(true)
    const updatedData = await callApi<CompanyHead | null>(
      updateCompanyHead,
      { companyId },
      data,
    )
    if (updatedData) {
      setFormData(updatedData)
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

  const renderCardContent = () => (
    <Card>
      <Meta title={t('headsPage.formSections.main.title')} />
      <Divider />
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
