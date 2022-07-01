import { isCustomer } from 'orient-ui-library/library/helpers/roles'
import { Order, OrderStatus } from 'orient-ui-library/library/models/order'

import { useStoreState } from 'library/store'
import './OrderStatusTag.style.less'

import OrderClientStatusTag from './OrderClientStatusTag'
import OrderCustomerStatusTag from './OrderCustomerStatusTag'

export interface OrderStatusTagProps {
  statusCode?: OrderStatus,
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
