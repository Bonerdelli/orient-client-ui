import { Spin } from 'antd'
import Div from 'orient-ui-library/components/Div'

import FrameCustomerWizard from 'components/FrameCustomerWizard'
import { useStoreState } from 'library/store'

import './FrameCustomerWizardPage.style.less'

const FrameCustomerWizardPage = () => {

  const company = useStoreState(state => state.company.current)

  if (!company) {
    return (
      <Div className="AppLayout__loaderWrap">
        <Spin size="large" />
      </Div>
    )
  }

  return (
    <div className="FrameCustomerWizardPage" data-testid="FrameCustomerWizardPage">
      <FrameCustomerWizard companyId={company.id as number} />
    </div>
  )
}

export default FrameCustomerWizardPage
