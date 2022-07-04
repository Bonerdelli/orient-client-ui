import { post } from 'orient-ui-library/library/helpers/api' // TODO: move to ui-lib after debugging
import * as schema from 'orient-ui-library/library/api/schema' // TODO: move to ui-lib after debugging
import { GridResponse } from 'library/models' // TODO: move to ui-lib after debugging
import portalConfig from 'config/portal.yaml'
import { FrameOrderOfferForFactoringDto } from 'library/models/offers'

const QUICK_SEARCH_MAX_ITEMS = portalConfig.dataDisplay.quickSearchMaxItems

export type OfferGridRequest = schema.components['schemas']['OfferGridRequest']

interface GetOffersForFactoringParams {
  orderId: number
  companyId: number
}

export async function getOffersForFactoring({ orderId, companyId }: GetOffersForFactoringParams) {
  const request: OfferGridRequest = {
    limit: QUICK_SEARCH_MAX_ITEMS,
    page: 1,
    orderId,
  }
  return post<GridResponse<FrameOrderOfferForFactoringDto>>(
    `/client/company/${companyId}/offer/readyToFactor/list`,
    request,
  )
}
