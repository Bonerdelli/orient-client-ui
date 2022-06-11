import { useEffect } from 'react'

import { Company } from 'library/models/proxy' // TODO: to ui-lib
import { useApi } from 'library/helpers/api' // TODO: to ui-lib
import { getCompany } from 'library/api'

import { useStoreActions } from 'library/store'

import ErrorResultView from 'ui-components/ErrorResultView' // TODO: from ui-lib

export interface CompanyWrapperProps {
  children: JSX.Element
}

const CompanyWrapper: React.FC<CompanyWrapperProps> = ({ children }) => {

  const { setCompany } = useStoreActions(actions => actions.company)
  const [ companies, companyLoaded ] = useApi<Company[]>(getCompany)

  useEffect(() => {
    if (companies?.length) {
      // NOTE: take first company because multiple companies not supported
      // TODO: ask be to make endpoint with default company
      setCompany(companies[0])
    }
  }, [companies])


  if (companyLoaded === false) {
    return (
      <ErrorResultView centered status="error" />
    )
  }

  return children
}

export default CompanyWrapper
