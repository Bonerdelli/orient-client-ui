import { useTranslation } from 'react-i18next'
import { Descriptions, Skeleton } from 'antd'
import { CompanyDto } from 'orient-ui-library/library/models/proxy'
import { FactoringOrderInfo } from '../../library'

const { Item: DescItem } = Descriptions

export interface OrderInfoProps {
  orderId?: number
  customerCompany?: CompanyDto
  factoring?: FactoringOrderInfo
  size?: 'middle' | 'small' | 'default'
}

const OrderInfo: React.FC<OrderInfoProps> = ({
  orderId,
  customerCompany,
  factoring,
  size = 'small',
}) => {
  const { t } = useTranslation()

  if (!orderId || !customerCompany) {
    return <Skeleton/>
  }

  const renderFactoringInfo = () => (<>
    <DescItem label={t('models.factoring.fields.bankName.title')}>
      {factoring!.bankName}
    </DescItem>
    <DescItem label={t('models.factoring.fields.amount.title')}>
      {factoring!.amount} {factoring!.currencyCode}
    </DescItem>
    <DescItem label={t('models.factoring.fields.days.title')}>
      {factoring!.days}
    </DescItem>
    <DescItem label={t('models.factoring.fields.contractNumber.title')}>
      {factoring!.contractNumber ?? '—'}
    </DescItem>
    <DescItem label={t('models.factoring.fields.purchaseNumber.title')}>
      {factoring!.purchaseNumber ?? '—'}
    </DescItem>
  </>)

  return (
    <Descriptions
      size={size}
      title={t('models.order.title')}
      className="OrderInfo"
      bordered
      column={1}
    >
      <DescItem label={t('models.order.fields.id.title')}>
        {orderId}
      </DescItem>
      <DescItem label={t('models.customer.fields.inn.title')}>
        {customerCompany.inn}
      </DescItem>
      <DescItem label={t('models.customer.fields.name.title')}>
        {customerCompany.shortName}
      </DescItem>
      {factoring && renderFactoringInfo()}
    </Descriptions>
  )
}

export default OrderInfo
