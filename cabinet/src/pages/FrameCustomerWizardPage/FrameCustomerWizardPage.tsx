import { Spin } from 'antd'
import Div from 'orient-ui-library/components/Div'

import FrameCustomerWizard from 'components/FrameCustomerWizard'
import { useStoreState } from 'library/store'

import './FrameCustomerWizardPage.style.less'

const FrameCustomerWizardPage = () => {

  const companyId = useStoreState(state => state.company.companyId)

  if (!companyId) {
    return (
      <Div className="AppLayout__loaderWrap">
        <Spin size="large" />
      </Div>
    )
  }

  return (
    <div className="FrameCustomerWizardPage" data-testid="FrameCustomerWizardPage">
      <FrameCustomerWizard companyId={companyId as number} />
    </div>
  )
}

export default FrameCustomerWizardPage
