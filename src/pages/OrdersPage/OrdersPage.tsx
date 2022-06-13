import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'

import './OrdersPage.style.less'

const { Paragraph } = Typography

export interface OrdersPageProps {

}

const OrdersPage: React.FC<OrdersPageProps> = ({}) => {
  const { t } = useTranslation()
  return (
    <div className="OrdersPage" data-testid="OrdersPage">
      <Paragraph>{t('OrdersPage.component')}</Paragraph>
    </div>
  )
}

export default OrdersPage
