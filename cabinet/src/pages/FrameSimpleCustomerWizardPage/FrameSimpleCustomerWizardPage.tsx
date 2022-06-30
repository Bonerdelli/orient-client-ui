import { Spin } from 'antd'
import Div from 'orient-ui-library/components/Div'

import FrameSimpleCustomerWizard from 'components/FrameSimpleCustomerWizard'
import { useStoreState } from 'library/store'

import './FrameSimpleCustomerWizardPage.style.less'

const FrameSimpleCustomerWizardPage = () => {

  const company = useStoreState(state => state.company.current)

  if (!company) {
    return (
      <Div className="AppLayout__loaderWrap">
        <Spin size="large" />
      </Div>
    )
  }

  return (
    <div className="FrameSimpleCustomerWizardPage" data-testid="FrameSimpleCustomerWizardPage">
      <FrameSimpleCustomerWizard companyId={company.id as number} />
    </div>
  )
}

export default FrameSimpleCustomerWizardPage
