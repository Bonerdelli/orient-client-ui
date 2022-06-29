import { useTranslation } from 'react-i18next'
import { Button, Descriptions, Modal, Skeleton } from 'antd'

import { Company, CompanyHead, CompanyRequisites } from 'library/models/proxy'
import { formatCurrency } from 'library/helpers'
import { SelectOutlined } from '@ant-design/icons'
import { useState } from 'react'

const { Item: DescItem } = Descriptions

export interface ClientInfoProps {
  company?: Company
  companyHead?: CompanyHead
  companyRequisites?: CompanyRequisites,
}

const ClientInfo: React.FC<ClientInfoProps> = ({ company, companyHead, companyRequisites }) => {
  const { t } = useTranslation()
  const [ bankRequisitesVisible, setBankRequisitesVisible ] = useState<boolean>(false)

  if (!company) {
    return <Skeleton/>
  }

  const descriptionsLayout = {
    bordered: true,
    column: 1,
    size: 'small' as any,
  }
  const showBankRequisites = () => {
    setBankRequisitesVisible(true)
  }
  const closeBankRequisites = () => {
    setBankRequisitesVisible(false)
  }

  const renderBankRequisites = () => (
    <Descriptions {...descriptionsLayout}>
      <DescItem label={t('models.bankRequisites.bankName')}>
        {companyRequisites.bankName}
      </DescItem>
      <DescItem label={t('models.bankRequisites.mfo')}>
        {companyRequisites.mfo}
      </DescItem>
      <DescItem label={t('models.bankRequisites.accountNumber')}>
        {companyRequisites.accountNumber}
      </DescItem>
    </Descriptions>
  )

  return (
    <Descriptions
      title={t('models.client.title')}
      className="ClientInfo"
      {...descriptionsLayout}
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
        {companyHead?.middleName}
      </DescItem>
      {companyRequisites && <DescItem label={t('models.company.fields.bankRequisites.title')}>
        <Button size="small"
                type="link"
                icon={<SelectOutlined/>}
                onClick={showBankRequisites}
        >
          {t('models.company.fields.bankRequisites.show')}
        </Button>
        <Modal
          visible={bankRequisitesVisible}
          title={t('models.bankRequisites.modalTitle')}
          onCancel={closeBankRequisites}
          footer={
            <Button key="submit"
                    type="primary"
                    onClick={closeBankRequisites}>
              {t('models.bankRequisites.close')}
            </Button>
          }
        >
          {renderBankRequisites()}
        </Modal>
      </DescItem>}
    </Descriptions>
  )
}

export default ClientInfo
