import { useEffect, useState } from 'react'

import { ApiSuccessResponse } from 'orient-ui-library/library/helpers/api'
import { CompanyDto } from 'orient-ui-library/library/models/proxy'
import { getCompany } from 'library/api'

import { useStoreActions, useStoreState } from 'library/store'

import ErrorResultView from 'orient-ui-library/components/ErrorResultView'

export interface CompanyWrapperProps {
  children: JSX.Element
}

const CompanyWrapper: React.FC<CompanyWrapperProps> = ({ children }) => {

  const user = useStoreState(state => state.user.current)
  const { setCompany } = useStoreActions(actions => actions.company)
  const [ companyLoaded, setCompanyLoaded ] = useState<boolean>()

  const getCurrentCompany = async () => {
    const result = await getCompany()
    if (result.success && (result as ApiSuccessResponse<CompanyDto[]>).data?.length) {
      setCompany(result.data?.[0] as CompanyDto)
      setCompanyLoaded(true)
    } else {
      setCompanyLoaded(false)
    }
  }

  useEffect(() => {
    getCurrentCompany()
  }, [ user ])


  if (companyLoaded === false) {
    return (
      <ErrorResultView centered status="error"/>
    )
  }

  return children
}

export default CompanyWrapper
