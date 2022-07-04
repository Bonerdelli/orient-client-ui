import { post } from 'orient-ui-library/library/helpers/api' // TODO: move to ui-lib after debugging

import { PaginatedRequest, defaultPaginatedRequest } from 'library/helpers/api'
import { Order } from 'orient-ui-library/library/models/order'
import { GridResponse } from 'library/models'

export async function getFactoringOrdersList(
  _params: unknown,
  request: PaginatedRequest = defaultPaginatedRequest
) {
  return await post<GridResponse<Order[]>>('/operator/order/factor/list', request)
}
