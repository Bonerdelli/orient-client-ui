import * as schema from '../api/schema'

export interface OrderDocument {
  typeId: number
  typeName: string
  isGenerated: boolean
  isRequired: boolean
  priority?: number
  info?: schema.components['schemas']['Info']
}
