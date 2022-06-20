// TODO: move me into ui-lib after debugging

type UnknownGridItem = { [key: string]: unknown }

export interface GridResponse<T = UnknownGridItem> {
  total: number
  data: T[]
}
