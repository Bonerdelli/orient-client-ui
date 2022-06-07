import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Form, Row, Col, Spin, Divider, Button } from 'antd'
import { SaveOutlined } from '@ant-design/icons'

import Div from 'ui-components/Div'
import ErrorResultView from 'ui-components/ErrorResultView'

import { renderFormInputs } from 'library/helpers/form'
import { CompanyContacts } from 'library/models/proxy' // TODO: to ui-lib
import { useApi } from 'library/helpers/api' // TODO: to ui-lib
import { getCompanyContacts, updateCompanyContacts } from 'library/api' // TODO: to ui-lib

import formFields from './CompanyContactsForm.form'

const { Item: FormItem } = Form
const { Meta } = Card

export interface CompanyContactsFormProps {
  companyId: number,
}

const CompanyContactsForm: React.FC<CompanyContactsFormProps> = ({ companyId }) => {
  const { t } = useTranslation()

  let [ submitResult ] = useState<boolean | null>(false)
  const [ formData, setFormData ] = useState<Partial<CompanyContacts>>()

  const [ companyHeadData, dataLoaded ] = useApi<CompanyContacts | null>(
    getCompanyContacts, { companyId },
  )

  useEffect(() => {
    setFormData(companyHeadData ?? {})
  }, [ companyHeadData ])

  const handleFormSubmit = async (data: CompanyContacts) => {
    const { companyId } = data as CompanyContacts
    if (!companyId) {
      return
    }
    [ , submitResult ] = useApi(
      updateCompanyContacts, { companyId }, data,
    )
  }

  if (dataLoaded === false) {
    return (
      <ErrorResultView centered status="error" />
    )
  }

  if (!formData) {
    return (
      <Div className="AppLayout__loaderWrap">
        <Spin size="large" />
      </Div>
    )
  }

  const renderFormActions = () => (
    <FormItem>
      <Button
        type="primary"
        size="large"
        htmlType="submit"
        icon={<SaveOutlined />}
        disabled={submitResult === null}
      >
        {t('common.actions.save.title')}
      </Button>
    </FormItem>
  )

  const renderContent = () => (
    <Form
      initialValues={formData || {}}
      onFinish={(data: CompanyContacts) => handleFormSubmit(data)}
      className="CompanyContactsForm"
      data-testid="CompanyContactsForm"
      labelCol={{ span: 10 }}
      wrapperCol={{ flex: 1 }}
      labelAlign="left"
      requiredMark={false}
      colon={false}
      labelWrap
    >
      <Row gutter={12}>
        <Col span={16}>
          <Card>
            <Meta
              title={t('сompanyPage.formSections.additionalContacts.title')}
              description={t('сompanyPage.formSections.additionalContacts.description')}
            />
            <Divider />
            {renderFormInputs(formFields)}
            {renderFormActions()}
          </Card>
        </Col>
      </Row>
    </Form>
  )

  return (
    <Spin spinning={dataLoaded === null}>
      {renderContent()}
    </Spin>
  )

}

export default CompanyContactsForm
