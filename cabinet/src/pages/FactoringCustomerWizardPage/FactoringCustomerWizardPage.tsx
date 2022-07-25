import { Spin } from 'antd'
import Div from 'orient-ui-library/components/Div'

import FactoringCustomerWizard from 'components/FactoringCustomerWizard'
import { useStoreState } from 'library/store'

import './FactoringCustomerWizardPage.style.less'

const FactoringCustomerWizardPage = () => {

  const companyId = useStoreState(state => state.company.companyId)

  if (!companyId) {
    return (
      <Div className="AppLayout__loaderWrap">
        <Spin size="large" />
      </Div>
    )
  }

  return (
    <div className="FactoringCustomerWizardPage" data-testid="FactoringCustomerWizardPage">
      <FactoringCustomerWizard companyId={companyId as number} />
    </div>
  )
}

export default FactoringCustomerWizardPage
