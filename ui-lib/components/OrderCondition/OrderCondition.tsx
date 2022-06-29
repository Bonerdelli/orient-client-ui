import { useTranslation } from 'react-i18next'
import { Descriptions, Skeleton } from 'antd'

import { Company } from 'library/models/proxy'
import { OrderConditions, OrderConditionType } from 'library/models/orderCondition'
import { formatDate } from 'library/helpers/date'

const { Item: DescItem } = Descriptions

export interface OrderConditionProps {
  condition?: OrderConditions
}

const OrderCondition: React.FC<OrderConditionProps> = ({ condition }) => {
  const { t } = useTranslation()

  if (!condition) {
    return <Skeleton/>
  }

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
            <DescItem label={t('models.orderCondition.fields.payer.title')}>
              {renderPayer(condition.payer)}
            </DescItem>
            <DescItem label={t('models.orderCondition.fields.percentOverall.title')}>
              {condition.percentOverall}
            </DescItem>
            <DescItem label={t('models.orderCondition.fields.percentYear.title')}>
              {condition.percentYear}
            </DescItem>
          </>
        )
      case OrderConditionType.Discount:
        return (
          <>
            <DescItem label={t('models.orderCondition.fields.percentDiscount.title')}>
              {condition.percentDiscount}
            </DescItem>
          </>
        )
      default:
        return <></>
    }
  }


  const renderPayer = (payerType: any) => {
    // NOTE: not supported by be
    return payerType || '–'
  }

  return (
    <Descriptions
      size="middle"
      title={t('models.orderCondition.title')}
      className="OrderCondition"
      bordered
      column={1}
    >
      <DescItem label={t('models.orderCondition.fields.conditionCode.title')}>
        {renderConditionType(condition.conditionCode)}
      </DescItem>
      {renderFieldsByType(condition.conditionCode)}
      <DescItem label={t('models.orderCondition.fields.startDate.title')}>
        {formatDate(condition.startDate, { includeTime: false })}
      </DescItem>
    </Descriptions>
  )
}

export default OrderCondition
