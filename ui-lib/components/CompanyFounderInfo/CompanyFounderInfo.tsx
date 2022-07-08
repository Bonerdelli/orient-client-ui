import { useTranslation } from 'react-i18next'
import { Descriptions, Tabs } from 'antd'

import { CompanyFounderDto } from 'library/models/proxy'
import { PassportType } from '../../library'
import { passportTypeTranslationsMap } from '../../library/constants/passport-type-translations'

const { Item: DescItem } = Descriptions
const { TabPane } = Tabs

export interface CompanyFounderInfoProps {
  companyFounder?: CompanyFounderDto | null
}

const CompanyFounderInfo: React.FC<CompanyFounderInfoProps> = ({ companyFounder }) => {
  const { t } = useTranslation()
  if (!companyFounder) return t('common.errors.dataLoadingError.title')

  const descriptionsLayout = {
    bordered: true,
    column: 1,
    size: 'small' as any,
  }

  const renderGeneralInfoFields = () => {
    const generalInfoFields = [ 'lastName', 'firstName', 'secondName', 'inn', 'ownership', 'isIo', 'isAttorney' ]
    return generalInfoFields.map(field => {
      let fieldValue = companyFounder[field]
      if (typeof fieldValue === 'boolean') {
        fieldValue = t(`common.dataEntity.terms.${fieldValue ? 'yes' : 'no'}`)
      }
      return (
        <DescItem label={t(`models.companyFounder.fields.${field}.title`)}
                  key={field}
        >
          {fieldValue}
        </DescItem>
      )
    })
  }
  const renderCommonPassportHeaderFields = () => (<>
    <DescItem label={t('models.companyFounder.fields.passportType.title')}>
      {passportTypeTranslationsMap[companyFounder.passportType as PassportType]}
    </DescItem>
    <DescItem label={t('models.companyFounder.fields.isMaleGender.title')}>
      {t(`common.dataEntity.gender.${companyFounder.isMaleGender ? 'male' : 'female'}`)}
    </DescItem>
  </>)
  const renderCommonPassportFooterFields = () => (<>
    <DescItem label={t('models.companyFounder.fields.birthdate.title')}>
      {companyFounder.birthdate}
    </DescItem>
    <DescItem label={t('models.companyFounder.fields.birthplace.title')}>
      {companyFounder.birthplace}
    </DescItem>
    <DescItem label={t('models.companyFounder.fields.address.title')}>
      {companyFounder.address}
    </DescItem>
  </>)
  const renderRuPassportFields = () => (<>
    {renderCommonPassportHeaderFields()}
    <DescItem label={t('models.companyFounder.fields.passportSeriesAndNumber.title')}>
      {`${companyFounder.passportSeries} ${companyFounder.passportNumber}`}
    </DescItem>
    <DescItem label={t('models.companyFounder.fields.passportIssueDate.title')}>
      {companyFounder.passportIssueDate}
    </DescItem>
    <DescItem label={t('models.companyFounder.fields.passportIssuerCode.title')}>
      {companyFounder.passportIssuerCode}
    </DescItem>
    <DescItem label={t('models.companyFounder.fields.passportIssuerName.titleRu')}>
      {companyFounder.passportIssuerName}
    </DescItem>
    {renderCommonPassportFooterFields()}
  </>)
  const renderUzPassportFields = () => (<>
    {renderCommonPassportHeaderFields()}
    <DescItem label={t('models.companyFounder.fields.passportSeriesAndNumber.title')}>
      {`${companyFounder.passportSeries} ${companyFounder.passportNumber}`}
    </DescItem>
    <DescItem label={t('models.companyFounder.fields.passportIssueDate.title')}>
      {companyFounder.passportIssueDate}
    </DescItem>
    <DescItem label={t('models.companyFounder.fields.passportValidDate.title')}>
      {companyFounder.passportValidDate}
    </DescItem>
    <DescItem label={t('models.companyFounder.fields.passportIssuerName.title')}>
      {companyFounder.passportIssuerName}
    </DescItem>
    <DescItem label={t('models.companyFounder.fields.nationality.title')}>
      {companyFounder.nationality}
    </DescItem>
    {renderCommonPassportFooterFields()}
  </>)
  const renderUzIdFields = () => (<>
    {renderCommonPassportHeaderFields()}
    <DescItem label={t('models.companyFounder.fields.passportNumber.titleUzId')}>
      {companyFounder.passportNumber}
    </DescItem>
    <DescItem label={t('models.companyFounder.fields.passportIssueDate.title')}>
      {companyFounder.passportIssueDate}
    </DescItem>
    <DescItem label={t('models.companyFounder.fields.passportValidDate.title')}>
      {companyFounder.passportValidDate}
    </DescItem>
    <DescItem label={t('models.companyFounder.fields.passportIssuerName.title')}>
      {companyFounder.passportIssuerName}
    </DescItem>
    <DescItem label={t('models.companyFounder.fields.nationality.title')}>
      {companyFounder.nationality}
    </DescItem>
    <DescItem label={t('models.companyFounder.fields.passportIssuePlace.title')}>
      {companyFounder.passportIssuePlace}
    </DescItem>
    {renderCommonPassportFooterFields()}
  </>)
  const renderPassportFields = () => {
    switch (companyFounder.passportType as PassportType) {
      case PassportType.Ru:
        return renderRuPassportFields()
      case PassportType.Uz:
        return renderUzPassportFields()
      case PassportType.Uz_Id:
        return renderUzIdFields()
      default:
        return <>Unhandled passport type: {companyFounder.passportType}</>
    }
  }

  return (
    <Tabs>
      <TabPane tab={t('models.companyFounder.tabs.generalInfo')}
               key="general-info"
      >
        <Descriptions {...descriptionsLayout}>
          {renderGeneralInfoFields()}
        </Descriptions>
      </TabPane>
      <TabPane tab={t('models.companyFounder.tabs.passportInfo')}
               key="passport-info"
      >
        <Descriptions {...descriptionsLayout}>
          {renderPassportFields()}
        </Descriptions>
      </TabPane>
    </Tabs>
  )
}

export default CompanyFounderInfo
