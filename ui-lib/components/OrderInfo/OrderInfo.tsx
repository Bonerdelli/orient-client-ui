import { useTranslation } from 'react-i18next'
import { Typography, Descriptions, Skeleton } from 'antd'
import { CompanyDto } from 'orient-ui-library/library/models/proxy'
import { FactoringOrderInfo, OrderConditions, OrderConditionType } from '../../library'
import { formatDate } from '../../library/helpers/date'

const { Item: DescItem } = Descriptions
const { Text } = Typography

export interface OrderInfoProps {
  orderId?: number
  customerCompany?: Pick<CompanyDto, 'inn' | 'shortName'>
  factoring?: FactoringOrderInfo
  conditions?: OrderConditions
  size?: 'middle' | 'small' | 'default'
}

const OrderInfo: React.FC<OrderInfoProps> = ({
  orderId,
  customerCompany,
  factoring,
  conditions,
  size = 'small',
}) => {
  const { t } = useTranslation()

  if (!orderId || !customerCompany) {
    return <Skeleton/>
  }

  const renderOrderConditions = () => {
    // copypaste from OrderConditions.tsx
    const renderConditionType = (type: OrderConditionType) => {
      switch (type) {
        case OrderConditionType.Comission:
          return t('models.orderCondition.fields.conditionCode.options.comission')
        case OrderConditionType.Discount:
          return t('models.orderCondition.fields.conditionCode.options.discount')
        default:
          return ''
      }
    }

    const renderFieldsByType = (type: OrderConditionType) => {
      switch (type) {
        case OrderConditionType.Comission:
          return (
            <>
              <DescItem label={t('models.orderCondition.fields.percentOverall.title')}>
                <Text>{conditions!.percentOverall}</Text>
                <Text>%</Text>
              </DescItem>
              <DescItem label={t('models.orderCondition.fields.percentYear.title')}>
                <Text>{conditions!.percentYear}</Text>
                <Text>%</Text>
              </DescItem>
            </>
          )
        case OrderConditionType.Discount:
          return (
            <>
              <DescItem label={t('models.orderCondition.fields.percentDiscount.title')}>
                <Text>{conditions!.percentDiscount}</Text>
                <Text>%</Text>
              </DescItem>
            </>
          )
        default:
          return <></>
      }
    }

    return (<>
      <DescItem label={t('models.orderCondition.fields.conditionCode.title')}>
        {renderConditionType(conditions!.conditionCode)}
      </DescItem>
      {renderFieldsByType(conditions!.conditionCode)}
      <DescItem label={t('models.orderCondition.fields.startDate.title')}>
        {formatDate(conditions!.startDate, { includeTime: false })}
      </DescItem>
    </>)
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
      {conditions && renderOrderConditions()}
      {factoring && renderFactoringInfo()}
    </Descriptions>
  )
}

export default OrderInfo
