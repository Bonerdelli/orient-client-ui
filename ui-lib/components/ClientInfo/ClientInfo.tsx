import { useTranslation } from 'react-i18next'
import { Descriptions, Skeleton } from 'antd'

import { Company, CompanyHead } from 'library/models/proxy'
import { formatCurrency } from 'library/helpers'

const { Item: DescItem } = Descriptions

export interface ClientInfoProps {
  company?: Company
  companyHead?: CompanyHead
}

const ClientInfo: React.FC<ClientInfoProps> = ({ company, companyHead }) => {
  const { t } = useTranslation()
  if (!company) {
    return <Skeleton/>
  }
  return (
    <Descriptions
      size="middle"
      title={t('models.client.title')}
      className="ClientInfo"
      bordered
      size="small"
      column={1}
    >
      <DescItem label={t('models.company.fields.fullName.title')}>
        {company.fullName}
      </DescItem>
      <DescItem label={t('models.company.fields.inn.title')}>
        {company.inn}
      </DescItem>
      <DescItem label={t('models.company.fields.opf.title')}>
        {company.opf}
      </DescItem>
      <DescItem label={t('models.company.fields.isMsp.titleShort')}>
        {company.isMsp
          ? t('common.dataEntity.terms.yes')
          : t('common.dataEntity.terms.no')}
      </DescItem>
      <DescItem label={t('models.company.fields.capital.title')}>
        {company.capital
          ? formatCurrency(company.capital)
          : '–'}
      </DescItem>
      <DescItem label={t('models.company.fields.oked.title')}>
        {company.oked}
      </DescItem>
      <DescItem label={t('models.company.fields.soogu.title')}>
        {company.soogu}
      </DescItem>
      <DescItem label={t('models.company.fields.state.title')}>
        {company.state}
      </DescItem>
      <DescItem label={t('models.company.fields.soato.title')}>
        {company.soato}
      </DescItem>
      <DescItem label={t('models.company.fields.address.title')}>
        {company.address}
      </DescItem>
      <DescItem label={t('models.company.fields.chief.title')}>
        {companyHead?.lastName}{' '}
        {companyHead?.firstName}{' '}
        {companyHead?.middleName}{' '}
      </DescItem>
    </Descriptions>
  )
}

export default ClientInfo
