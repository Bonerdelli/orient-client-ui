import { Spin } from 'antd'
import Div from 'orient-ui-library/components/Div'

import FactoringClientWizard from 'components/FactoringClientWizard'
import { useStoreState } from 'library/store'

import './FactoringClientWizardPage.style.less'

const FactoringClientWizardPage = () => {

  const companyId = useStoreState(state => state.company.companyId)

  if (!companyId) {
    return (
      <Div className="AppLayout__loaderWrap">
        <Spin size="large" />
      </Div>
    )
  }

  return (
    <div className="FactoringClientWizardPage" data-testid="FactoringClientWizardPage">
      <FactoringClientWizard />
    </div>
  )
}

export default FactoringClientWizardPage
