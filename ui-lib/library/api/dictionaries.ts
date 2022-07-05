import { Dictionaries } from '../models'
import { ApiResponse, get } from '../helpers'

export async function getDictionaries() {
  return await get<Dictionaries>('/dictionary/all')
}

export async function getDictionary<K extends keyof Dictionaries>(
  name: keyof Dictionaries,
): Promise<ApiResponse<Dictionaries[K]>> {
  return await get<Dictionaries[K]>(`/dictionary/${name}`)
}
