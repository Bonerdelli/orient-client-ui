import { FactoringStatus, Order, OrderStatus } from 'orient-ui-library/library/models/order'

import { isCustomer } from 'library/helpers/user'
import { useStoreState } from 'library/store'
import './OrderStatusTag.style.less'

import OrderClientStatusTag from './OrderClientStatusTag'
import OrderCustomerStatusTag from './OrderCustomerStatusTag'

export interface OrderStatusTagProps {
  statusCode?: OrderStatus | FactoringStatus,
  refreshAction?: () => void
  item?: Order,
}

const OrderStatusTag: React.FC<OrderStatusTagProps> = (props) => {
  const user = useStoreState(state => state.user.current)
  if (isCustomer(user)) {
    return (
      <OrderCustomerStatusTag {...props} />
    )
  }
  return (
    <OrderClientStatusTag {...props} />
  )
}

export default OrderStatusTag
