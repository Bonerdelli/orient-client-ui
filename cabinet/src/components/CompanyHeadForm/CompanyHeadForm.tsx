import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Grid,
  Input,
  Radio,
  Row,
  Select,
  Skeleton,
  Spin,
  Switch,
  Tabs,
} from 'antd'
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'

import ErrorResultView from 'orient-ui-library/components/ErrorResultView'

import { CompanyFounderDto } from 'orient-ui-library/library/models/proxy'
import { callApi, useApi } from 'library/helpers/api' // TODO: to ui-lib
import { baseFormConfig, FormInputShortConfig, renderFormInput } from 'library/helpers/form'
import { getCompanyHead, updateCompanyHead } from 'library/api' // TODO: to ui-lib
import {
  dateFieldNames,
  founderFields,
  getPassportFieldsConfig,
  passportFooterFieldNames,
  passportHeaderFieldNames,
  ruPassportFieldNames,
  uzIdFieldNames,
  uzPassportFieldNames,
} from './CompanyHeadForm.form'
import './CompanyHeadForm.style.less'
import { RETURN_URL_PARAM } from 'library/constants'
import { PassportType } from 'orient-ui-library/library'
import { passportTypeTranslationsMap } from 'orient-ui-library/library/constants/passport-type-translations'
import moment from 'moment'
import { DATE_FORMAT } from 'orient-ui-library/library/helpers/date'

const { useBreakpoint } = Grid
const { Item: FormItem } = Form
const { TabPane } = Tabs
const { TextArea } = Input

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
  const [ headForm ] = Form.useForm<CompanyFounderDto>()

  const [ formData, setFormData ] = useState<CompanyFounderDto | null>(null)
  const [ selectedPassportType, setSelectedPassportType ] = useState<PassportType | null>(null)
  const [ submitting, setSubmitting ] = useState<boolean>(false)
  const [ initialData, dataLoaded ] = useApi<CompanyFounderDto | null>(
    getCompanyHead, {
      companyId,
      id: id ?? itemId,
    },
  )

  useEffect(() => {
    if (initialData) {
      const formData = { ...initialData }
      dateFieldNames.forEach(key => {
        const date = initialData[key]
        formData[key] = date ? moment(date) : moment
      })
      setFormData(formData)
      setSelectedPassportType(initialData.passportType as PassportType)
    }
  }, [ initialData ])

  const handleFormSubmit = async (data: CompanyFounderDto) => {
    setSubmitting(true)
    dateFieldNames.forEach(key => data[key] = moment(data[key]).format('YYYY-MM-DD'))
    const updatedData = await callApi<CompanyFounderDto | null>(
      updateCompanyHead, {
        companyId,
      },
      {
        ...data,
        id: id ?? itemId,
      },
    )
    if (updatedData) {
      setFormData(updatedData)
      if (returnUrl) {
        history.push(returnUrl)
        return
      }
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

  let uniqueId = 0
  const getFormFieldProps = (config: FormInputShortConfig<CompanyFounderDto>) => ({
    key: `${config[0]}-${++uniqueId}`,
    name: config[1],
    label: t(`models.${config[0]}.fields.${config[1]}.title`),
    required: true,
  })
  const renderFounderFormInputs = () => {
    return founderFields.map(config => {
      const fieldProps = getFormFieldProps(config)
      switch (fieldProps.name) {
        case 'isIo':
        case 'isAttorney':
          return <FormItem
            {...fieldProps}
            valuePropName="checked"
          >
            <Switch/>
          </FormItem>
        default:
          return renderFormInput(config)
      }
    })
  }

  const renderCommonPassportHeaderFields = () => {
    const [ passportTypeProps, genderProps ] = getPassportFieldsConfig(passportHeaderFieldNames).map(getFormFieldProps)
    const genderOptions = [
      { label: t('common.dataEntity.gender.male'), value: true },
      { label: t('common.dataEntity.gender.female'), value: false },
    ]
    const passportTypeOptions = Object.entries(passportTypeTranslationsMap)
      .map(([ passportType, translation ]) => ({
        value: passportType,
        label: translation,
      }))

    return (<>
      <FormItem {...passportTypeProps}>
        <Select
          options={passportTypeOptions}
          onChange={setSelectedPassportType}
        />
      </FormItem>
      <FormItem {...genderProps}>
        <Radio.Group options={genderOptions}/>
      </FormItem>
    </>)
  }
  const renderCommonPassportFooterFields = () => {
    return getPassportFieldsConfig(passportFooterFieldNames).map(config => {
      const fieldProps = getFormFieldProps(config)
      switch (fieldProps.name) {
        case 'birthdate':
          return <FormItem {...fieldProps}>
            <DatePicker format={DATE_FORMAT}/>
          </FormItem>
        case 'address':
          return <FormItem {...fieldProps}>
            <TextArea autoSize/>
          </FormItem>
        default:
          return renderFormInput(config)
      }
    })
  }
  const renderRuPassportFields = () => {
    return (<>
      {renderCommonPassportHeaderFields()}
      {
        getPassportFieldsConfig(ruPassportFieldNames).map(config => {
          const fieldProps = getFormFieldProps(config)
          switch (fieldProps.name) {
            case 'passportIssuerName':
              fieldProps.label = t(`models.${config[0]}.fields.${config[1]}.titleRu`)
              return <FormItem {...fieldProps}>
                <TextArea autoSize/>
              </FormItem>
            case 'passportIssueDate':
              return <FormItem {...fieldProps}>
                <DatePicker format={DATE_FORMAT}/>
              </FormItem>
            default:
              return renderFormInput(config)
          }
        })
      }
      {renderCommonPassportFooterFields()}
    </>)
  }
  const renderUzPassportFields = () => {
    return (<>
      {renderCommonPassportHeaderFields()}
      {
        getPassportFieldsConfig(uzPassportFieldNames).map(config => {
          const fieldProps = getFormFieldProps(config)
          switch (fieldProps.name) {
            case 'passportIssuerName':
              return <FormItem {...fieldProps}>
                <TextArea autoSize/>
              </FormItem>
            case 'passportIssueDate':
            case 'passportValidDate':
              return <FormItem {...fieldProps}>
                <DatePicker format={DATE_FORMAT}/>
              </FormItem>
            default:
              return renderFormInput(config)
          }
        })
      }
      {renderCommonPassportFooterFields()}
    </>)
  }
  const renderUzIdFields = () => {
    return (<>
      {renderCommonPassportHeaderFields()}
      {
        getPassportFieldsConfig(uzIdFieldNames).map(config => {
          const fieldProps = getFormFieldProps(config)
          switch (fieldProps.name) {
            case 'passportIssuerName':
              return <FormItem {...fieldProps}>
                <TextArea autoSize/>
              </FormItem>
            case 'passportIssueDate':
            case 'passportValidDate':
              return <FormItem {...fieldProps}>
                <DatePicker format={DATE_FORMAT}/>
              </FormItem>
            default:
              return renderFormInput(config)
          }
        })
      }
      {renderCommonPassportFooterFields()}
    </>)
  }
  const renderPassportFields = () => {
    switch (selectedPassportType) {
      case PassportType.Ru:
        return renderRuPassportFields()
      case PassportType.Uz:
        return renderUzPassportFields()
      case PassportType.Uz_Id:
        return renderUzIdFields()
      default:
        return renderCommonPassportHeaderFields()
    }
  }

  if (dataLoaded === false) {
    return (
      <ErrorResultView centered status="error"/>
    )
  }

  if (!formData) {
    return <Card>
      <Skeleton active/>
    </Card>
  }

  return (
    <Row gutter={12}>
      <Col xs={24} xl={18} xxl={14} className="relative">
        <Spin spinning={submitting}>
          <Card title={renderCardTitle()}>
            <Form
              form={headForm}
              initialValues={formData!}
              onFinish={(data: CompanyFounderDto) => handleFormSubmit(data)}
              className="CompanyHeadForm"
              data-testid="CompanyHeadForm"
              {...baseFormConfig(breakPoint)}
            >
              <Tabs defaultActiveKey="1">
                <TabPane key="1"
                         tab={t('models.companyFounder.tabs.generalInfo')}
                >
                  {renderFounderFormInputs()}
                </TabPane>
                <TabPane key="2"
                         tab={t('models.companyFounder.tabs.passportInfo')}
                         forceRender
                >
                  {renderPassportFields()}
                </TabPane>
              </Tabs>
              {renderFormActions()}
            </Form>
          </Card>
        </Spin>
      </Col>
    </Row>
  )

}

export default CompanyHeadForm
