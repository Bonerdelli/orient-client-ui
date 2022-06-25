import { useTranslation } from 'react-i18next'
import { Skeleton, Descriptions } from 'antd'

import { Company, CompanyHead } from 'library/models/proxy'
import { formatCurrency } from 'library/helpers'

const { Item: DescItem } = Descriptions

export interface ClientInfoProps {
  company?: Company
  companyHead?: CompanyHead
}

const ClientInfo: React.FC<ClientInfoProps> = ({ company, companyHead }) => {
  const { t } = useTranslation()
  if (!company || !companyHead) {
    return <Skeleton />
  }
  return (
    <Descriptions
      title={t('common.models.client.title')}
      className="ClientInfo"
      bordered
      column={1}
    >
      <DescItem label={t('common.models.company.fullName')}>
        {company.fullName}
      </DescItem>
      <DescItem label={t('common.models.company.inn')}>
        {company.inn}
      </DescItem>
      <DescItem label={t('common.models.company.opf')}>
        {company.opf}
      </DescItem>
      <DescItem label={t('common.models.company.isMs')}>
        {company.isMsp
          ? t('dataEntity.terms.yes')
          : t('dataEntity.terms.no')}
      </DescItem>
      <DescItem label={t('common.models.company.capita')}>
        {company.capital
          ? formatCurrency(company.capital)
          : '–'}
      </DescItem>
      <DescItem label={t('common.models.company.oked')}>
        {company.oked}
      </DescItem>
      <DescItem label={t('common.models.company.soogu')}>
        {company.soogu}
      </DescItem>
      <DescItem label={t('common.models.company.state')}>
        {company.state}
      </DescItem>
      <DescItem label={t('common.models.company.soato')}>
        {company.soato}
      </DescItem>
      <DescItem label={t('common.models.company.address')}>
        {company.address}
      </DescItem>
      <DescItem label={t('common.models.company.chief')}>
        {companyHead.lastName}{' '}
        {companyHead.firstName}{' '}
        {companyHead.middleName}{' '}
      </DescItem>
    </Descriptions>
  )
}

export default ClientInfo
