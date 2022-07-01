import * as schema from '../api/schema'

export interface OrderDocument {
  typeId: number
  typeName: string
  isGenerated: boolean
  isRequired: boolean
  info?: schema.components['schemas']['Info']
}
