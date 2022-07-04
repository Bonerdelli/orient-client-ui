import { post } from 'orient-ui-library/library/helpers/api' // TODO: move to ui-lib after debugging
import * as schema from 'orient-ui-library/library/api/schema' // TODO: move to ui-lib after debugging
import { GridResponse } from 'library/models' // TODO: move to ui-lib after debugging
import portalConfig from 'config/portal.yaml'
import { FrameOrderForFactoringDto } from 'library/models/orders'

const QUICK_SEARCH_MAX_ITEMS = portalConfig.dataDisplay.quickSearchMaxItems

export type OrderGridRequest = schema.components['schemas']['OrderGridRequest']

export async function getOrdersForFactoring(companyId: number | string) {
  const request: OrderGridRequest = {
    limit: QUICK_SEARCH_MAX_ITEMS,
    page: 1,
  }
  return post<GridResponse<FrameOrderForFactoringDto>>(
    `/client/company/${companyId}/order/readyToFactor/list`,
    request,
  )
}
