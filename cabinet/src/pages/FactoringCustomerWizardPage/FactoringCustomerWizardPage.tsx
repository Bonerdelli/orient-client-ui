import { Spin } from 'antd'
import Div from 'orient-ui-library/components/Div'

import FactoringCustomerWizard from 'components/FactoringCustomerWizard'
import { useStoreState } from 'library/store'

import './FactoringCustomerWizardPage.style.less'

const FactoringCustomerWizardPage = () => {

  const company = useStoreState(state => state.company.current)

  if (!company) {
    return (
      <Div className="AppLayout__loaderWrap">
        <Spin size="large" />
      </Div>
    )
  }

  return (
    <div className="FactoringCustomerWizardPage" data-testid="FactoringCustomerWizardPage">
      <FactoringCustomerWizard />
    </div>
  )
}

export default FactoringCustomerWizardPage
