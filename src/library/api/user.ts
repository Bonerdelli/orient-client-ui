import { User, ApiErrorResponse /* , get */ } from 'orient-ui-library'

import mockData from 'library/mock/user'

export async function getCurrentUser(/* id: string */): Promise<
User | ApiErrorResponse
> {
  // const result = await get<User | ApiErrorResponse>('user/current') // NOTE: sample API call
  return mockData
}
