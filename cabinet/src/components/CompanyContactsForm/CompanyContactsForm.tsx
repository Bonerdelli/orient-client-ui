import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Card, Col, Divider, Form, Grid, Row, Skeleton, Spin } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { isUndefined } from 'lodash'

import ErrorResultView from 'orient-ui-library/components/ErrorResultView'

import { CompanyContactsDto } from 'orient-ui-library/library/models/proxy'
import { callApi, useApi } from 'library/helpers/api' // TODO: to ui-lib
import { baseFormConfig, renderFormInputs } from 'library/helpers/form'
import { getCompanyContacts, updateCompanyContacts } from 'library/api' // TODO: to ui-lib
import formFields from './CompanyContactsForm.form'

const { useBreakpoint } = Grid
const { Item: FormItem } = Form
const { Meta } = Card

export interface CompanyContactsFormProps {
  companyId: number,
}

const CompanyContactsForm: React.FC<CompanyContactsFormProps> = ({ companyId }) => {
  const { t } = useTranslation()
  const breakPoint = useBreakpoint()

  const [ formData, setFormData ] = useState<Partial<CompanyContactsDto>>()
  const [ submitting, setSubmitting ] = useState<boolean>(false)
  const [ initialData, dataLoaded ] = useApi<CompanyContactsDto | null>(
    getCompanyContacts,
    { companyId },
  )

  useEffect(() => {
    setFormData(initialData ?? {})
  }, [ initialData ])

  const handleFormSubmit = async (data: CompanyContactsDto) => {
    setSubmitting(true)
    const updatedData = await callApi<CompanyContactsDto | null>(
      updateCompanyContacts,
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
        icon={<SaveOutlined/>}
        disabled={submitting}
      >
        {t('common.actions.save.title')}
      </Button>
    </FormItem>
  )

  const renderCardContent = () => (
    <Card>
      <Meta
        title={t('companyPage.formSections.additionalContacts.title')}
        description={t('companyPage.formSections.additionalContacts.description')}
      />
      <Divider/>
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
      onFinish={(data: CompanyContactsDto) => handleFormSubmit(data)}
      className="CompanyContactsForm"
      data-testid="CompanyContactsForm"
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

export default CompanyContactsForm
