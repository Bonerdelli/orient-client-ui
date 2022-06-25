import { useTranslation } from 'react-i18next'
import { Descriptions, Skeleton } from 'antd'

import { Company } from 'library/models/proxy'

const { Item: DescItem } = Descriptions

export interface OrderInfoProps {
  orderId?: number
  customerCompany?: Company
}

const OrderInfo: React.FC<OrderInfoProps> = ({ orderId, customerCompany }) => {
  const { t } = useTranslation()
  if (!orderId || !customerCompany) {
    return <Skeleton />
  }
  return (
    <Descriptions
      title={t('common.models.order.title')}
      className="OrderInfo"
      bordered
      column={1}
    >
      <DescItem label={t('order.fields.id.title')}>
        {orderId}
      </DescItem>
      <DescItem label={t('customer.fields.inn.title')}>
        {customerCompany.inn}
      </DescItem>
      <DescItem label={t('customer.fields.shortName.title')}>
        {customerCompany.shortName}
      </DescItem>
    </Descriptions>
  )
}

export default OrderInfo
